"use strict";

class CustomError extends Error {
    constructor(message = "", ...args) {
        super(message, ...args);

        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

class ZstdError extends CustomError {}

class ZstdContext {
    constructor(wasmModule) {
        const IMPORTS = {
            env: {
                emscripten_notify_memory_growth: this._initHeap
            }
        };

        const moduleInstance = new WebAssembly.Instance(wasmModule, IMPORTS);

        this._exports = moduleInstance.exports;
        this._initHeap();
    }

    _initHeap() {
        this._heap = new Uint8Array(this._exports.memory.buffer);
    }

    allocCompressed(size) {
        this._compressedSize = size;
        this._compressedPointer = this._exports.malloc(size);
    }

    supplyInput(data) {
        this._heap.set(data, this._compressedPointer);
    }

    allocDecompressed(size) {
        if (typeof size === "number") {
            this._decompressedSize = size;
        } else {
            const foundSize = this._exports.ZSTD_findDecompressedSize(this._compressedPointer, this._compressedSize);
            this._decompressedSize = Number(foundSize);
        }

        this._decompressedPointer = this._exports.malloc(this._decompressedSize);
    }

    getOutput() {
        const decompressedDataSize = this._exports.ZSTD_decompress(
            this._decompressedPointer,
            this._decompressedSize,
            this._compressedPointer,
            this._compressedSize
        );

        const decompressedData = this._heap.slice(
            this._decompressedPointer,
            this._decompressedPointer + decompressedDataSize
        );

        return decompressedData;
    }

    dispose() {
        this._exports.free(this._compressedPointer);

        if (typeof this._decompressedPointer !== "undefined") {
            this._exports.free(this._decompressedPointer);
        }

        delete this._exports;
    }
}

class ZstdDecompressor {
    static _wasmModule;

    static _getContext() {
        if (typeof this._wasmModule === "undefined") {
            throw new ZstdError("Can't create context, WASM isn't loaded");
        }

        return new ZstdContext(this._wasmModule);
    }

    static loadWasm(wasm) {
        if (typeof this._wasmModule !== "undefined") {
            throw new ZstdError("WASM is already loaded");
        }

        const wasmModule = new WebAssembly.Module(wasm);
        this._wasmModule = wasmModule;
    }

    static decompress(data, size) {
        if (!Array.isArray(data) && !ArrayBuffer.isView(data)) {
            throw new ZstdError("Invalid input data");
        }

        if (!(data instanceof Uint8Array)) {
            data = new Uint8Array(data);
        }

        let output = new Uint8Array();

        const context = this._getContext();
        context.allocCompressed(data.byteLength);

        try {
            context.supplyInput(data);
            context.allocDecompressed(size);

            output = context.getOutput();
        } finally {
            context.dispose();
            return output;
        }
    }
}

module.exports = ZstdDecompressor;
