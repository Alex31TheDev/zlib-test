"use strict";

class CustomError extends Error {
    constructor(message = "", ...args) {
        super(message, ...args);

        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

class FastgifError extends CustomError {}

const Util = {
    stringToBytes: str => {
        const bytes = new Uint8Array(str.length);

        for (let i = 0; i < str.length; i++) {
            bytes[i] = str.charCodeAt(i);
        }

        return bytes;
    },

    bytesToString: bytes => {
        let str = "";

        for (let i = 0; i < bytes.length; i++) {
            str += String.fromCharCode(bytes[i]);
        }

        return str;
    }
};

const MEM_SIZE = 256,
    TABLE_SIZE = 2;

const ABORT = 0,
    DYNAMICTOP_PTR = 7824,
    STACKTOP = 7840,
    STACK_MAX = 5250720;

const memoryBase = 1024,
    tableBase = 0;

class DecoderContext {
    #exports;
    #view;
    #u32view;

    constructor(wasmModule) {
        const memory = new WebAssembly.Memory({
                initial: MEM_SIZE,
                maximum: MEM_SIZE
            }),
            view = (this.#view = new Uint8Array(memory.buffer));

        this.#u32view = new Uint32Array(memory.buffer);
        this.#u32view[DYNAMICTOP_PTR >> 2] = STACK_MAX;

        const env = {
            ABORT,
            DYNAMICTOP_PTR,
            STACKTOP,
            STACK_MAX,

            abort() {
                throw new FastgifError("abort");
            },

            abortOnCannotGrowMemory() {
                throw new FastgifError("abortOnCannotGrowMemory");
            },

            enlargeMemory() {
                throw new FastgifError("enlargeMemory");
            },

            getTotalMemory() {
                return view.length;
            },

            ___setErrNo(v) {
                throw new FastgifError("errno: " + v);
            },

            _emscripten_memcpy_big(dst, src, num) {
                view.set(view.subarray(src, src + num), dst);
                return dst;
            },

            memory: memory,
            memoryBase,

            table: new WebAssembly.Table({
                initial: TABLE_SIZE,
                maximum: TABLE_SIZE,
                element: "anyfunc"
            }),
            tableBase,

            _oninit: this.#oninit.bind(this),
            _onframe: this.#onframe.bind(this)
        };

        const instance = new WebAssembly.Instance(wasmModule, { env });
        this.#exports = instance.exports;
    }

    allocMemory(size) {
        this._bufSize = size;
        this._at = this.#exports._malloc(size);
    }

    supplyInput(buffer) {
        this.#view.set(buffer, this._at);
        this.#exports._read_buffer(this._at, this._bufSize);
    }

    getOutput() {
        const ret = this.#exports._play();

        if (ret) {
            throw new FastgifError("unhandled decode error: " + this.#readString(ret));
        }

        const task = this._task;
        delete this._task;

        return task;
    }

    dispose() {
        //this.#exports._free(this._at);
        this.#exports = undefined;
    }

    #oninit(ptr, width, height) {
        const len = width * height;

        this._task = {
            ptr: ptr / 4,
            width,
            height,
            len,
            frames: []
        };
    }

    #onframe(ms) {
        const task = this._task,
            buf = new Uint32Array(task.len);

        buf.set(this.#u32view.subarray(task.ptr, task.ptr + task.len));
        task.frames.push({ buf, ms });
    }

    #readString(at) {
        const v = this.#view.slice(at);

        for (let i = 0; i < v.length; i++) {
            if (v[i] === 0) {
                break;
            }
        }

        return Util.bytesToString(v.slice(0, i));
    }
}

class FastgifDecoder {
    static #wasmModule;

    static #getContext() {
        if (typeof this.#wasmModule === "undefined") {
            throw new FastgifError("Can't create context, WASM isn't loaded");
        }

        return new DecoderContext(this.#wasmModule);
    }

    static loadWasm(wasm) {
        if (typeof this.#wasmModule !== "undefined") {
            throw new FastgifError("WASM is already loaded");
        }

        const wasmModule = new WebAssembly.Module(wasm);
        this.#wasmModule = wasmModule;
    }

    static decode(data) {
        if (!Array.isArray(data) && !ArrayBuffer.isView(data)) {
            throw new FastgifError("Invalid input data");
        }

        let buffer;

        if (data instanceof Uint8Array) {
            buffer = data;
        } else {
            buffer = new Uint8Array(data);
        }

        let output = [];

        const context = this.#getContext();
        context.allocMemory(buffer.length);

        try {
            context.supplyInput(buffer);
            const task = context.getOutput();

            output = task.frames.map(frame => {
                const arr = new Uint8ClampedArray(frame.buf.buffer);

                return {
                    imageData: new ImageData(arr, task.width, task.height),
                    delay: frame.ms
                };
            });
        } finally {
            context.dispose();
            return output;
        }
    }
}

module.exports = FastgifDecoder;
