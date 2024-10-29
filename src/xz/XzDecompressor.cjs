"use strict";

class CustomError extends Error {
    constructor(message = "", ...args) {
        super(message, ...args);

        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

class XzError extends CustomError {}

const XZ_OK = 0,
    XZ_STREAM_END = 1;

class XzContext {
    constructor(moduleInstance) {
        this.exports = moduleInstance.exports;
        this.memory = this.exports.memory;

        this.ptr = this.exports.create_context();
        this._refresh();

        this.bufSize = this.mem32[0];
        this.inStart = this.mem32[1] - this.ptr;
        this.inEnd = this.inStart + this.bufSize;
        this.outStart = this.mem32[4] - this.ptr;
    }

    _refresh() {
        if (this.memory.buffer === this.mem8?.buffer) {
            return;
        }

        this.mem8 = new Uint8Array(this.memory.buffer, this.ptr);
        this.mem32 = new Uint32Array(this.memory.buffer, this.ptr);
    }

    supplyInput(sourceDataUint8Array) {
        const inBuffer = this.mem8.subarray(this.inStart, this.inEnd);
        inBuffer.set(sourceDataUint8Array, 0);

        this.exports.supply_input(this.ptr, sourceDataUint8Array.byteLength);
        this._refresh();
    }

    getNextOutput() {
        const result = this.exports.get_next_output(this.ptr);

        this._refresh();

        if (result !== XZ_OK && result !== XZ_STREAM_END) {
            throw new XzError(`get_next_output failed with error code: ${result}`);
        }

        const outChunk = this.mem8.subarray(this.outStart, this.outStart + /* outPos */ this.mem32[5]);
        return { outChunk, finished: result === XZ_STREAM_END };
    }

    needsMoreInput() {
        return /* inPos */ this.mem32[2] === /* inSize */ this.mem32[3];
    }

    outputBufferIsFull() {
        return /* outPos */ this.mem32[5] === this.bufSize;
    }

    resetOutputBuffer() {
        this.outPos = this.mem32[5] = 0;
    }

    dispose() {
        this.exports.destroy_context(this.ptr);
        this.exports = null;
    }
}

class XzDecompressor {
    static wasmInstance;

    static loadWasm(wasm) {
        if (typeof this.wasmInstance !== "undefined") {
            throw new XzError("Wasm is already loaded");
        }

        const wasmModule = new WebAssembly.Module(wasm),
            instance = new WebAssembly.Instance(wasmModule, {});

        this.wasmInstance = instance;
    }

    static getContext() {
        if (typeof this.wasmInstance === "undefined") {
            throw new XzError("Cant' create context, wasm isn't loaded");
        }

        return new XzContext(this.wasmInstance);
    }

    static decompress(data) {
        if (!Array.isArray(data) && !ArrayBuffer.isView(data)) {
            throw new XzError("Invalid input data");
        }

        let unconsumedInput,
            finished = false;

        if (data instanceof Uint8Array) {
            unconsumedInput = data;
        } else {
            unconsumedInput = new Uint8Array(data);
        }

        let output = new Uint8Array();

        const context = this.getContext();

        try {
            while (!finished) {
                if (context.needsMoreInput()) {
                    const nextInputLength = Math.min(context.bufSize, unconsumedInput.byteLength);
                    context.supplyInput(unconsumedInput.subarray(0, nextInputLength));
                    unconsumedInput = unconsumedInput.subarray(nextInputLength);
                }

                const nextOutputResult = context.getNextOutput(),
                    outChunk = nextOutputResult.outChunk;

                const newLength = output.length + outChunk.length;

                if (newLength !== output.length) {
                    const tempOutput = new Uint8Array(newLength);

                    tempOutput.set(output);
                    tempOutput.set(outChunk, output?.length ?? 0);

                    output = tempOutput;
                }

                finished = nextOutputResult.finished;
                context.resetOutputBuffer();
            }
        } finally {
            context.dispose();
            return output;
        }
    }
}

module.exports = XzDecompressor;
