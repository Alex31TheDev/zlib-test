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
        this._exports = moduleInstance.exports;
        this._memory = this._exports.memory;

        this._ptr = this._exports.create_context();
        this._refresh();

        this._bufSize = this._mem32[0];
        this._inStart = this._mem32[1] - this._ptr;
        this._inEnd = this._inStart + this._bufSize;
        this._outStart = this._mem32[4] - this._ptr;
    }

    supplyInput(sourceDataUint8Array) {
        const inBuffer = this._mem8.subarray(this._inStart, this._inEnd);
        inBuffer.set(sourceDataUint8Array, 0);

        this._exports.supply_input(this._ptr, sourceDataUint8Array.byteLength);
        this._refresh();
    }

    needsMoreInput() {
        return /* inPos */ this._mem32[2] === /* inSize */ this._mem32[3];
    }

    getNextOutput() {
        const result = this._exports.get_next_output(this._ptr);

        this._refresh();

        if (result !== XZ_OK && result !== XZ_STREAM_END) {
            throw new XzError(`get_next_output failed with error code: ${result}`);
        }

        const outChunk = this._mem8.subarray(this._outStart, this._outStart + /* outPos */ this._mem32[5]);
        return { outChunk, finished: result === XZ_STREAM_END };
    }

    outputBufferIsFull() {
        return /* outPos */ this._mem32[5] === this._bufSize;
    }

    resetOutputBuffer() {
        this.outPos = this._mem32[5] = 0;
    }

    dispose() {
        this._exports.destroy_context(this._ptr);
        delete this._exports;
    }

    _refresh() {
        if (this._memory.buffer === this._mem8?.buffer) {
            return;
        }

        this._mem8 = new Uint8Array(this._memory.buffer, this._ptr);
        this._mem32 = new Uint32Array(this._memory.buffer, this._ptr);
    }
}

class XzDecompressor {
    static _wasmInstance;

    static _getContext() {
        if (typeof this._wasmInstance === "undefined") {
            throw new XzError("Can't create context, WASM isn't loaded");
        }

        return new XzContext(this._wasmInstance);
    }

    static loadWasm(wasm) {
        if (typeof this._wasmInstance !== "undefined") {
            throw new XzError("WASM is already loaded");
        }

        const wasmModule = new WebAssembly.Module(wasm),
            instance = new WebAssembly.Instance(wasmModule, {});

        this._wasmInstance = instance;
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

        const context = this._getContext();

        try {
            while (!finished) {
                if (context.needsMoreInput()) {
                    const nextInputLength = Math.min(context._bufSize, unconsumedInput.byteLength);
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
        }

        return output;
    }
}

module.exports = XzDecompressor;
