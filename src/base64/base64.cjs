"use strict";

class CustomError extends Error {
    constructor(message = "", ...args) {
        super(message, ...args);

        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

class Base64Error extends CustomError {}

const Base64 = {
    _generateTables: () => {
        Base64._enc_mult = 4 / 3;
        Base64._dec_mult = 3 / 4;

        Base64.lookup = [];
        Base64.reverseLookup = [];

        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

        for (let i = 0; i < alphabet.length; i++) {
            Base64.lookup[i] = alphabet[i];
            Base64.reverseLookup[alphabet.charCodeAt(i)] = i;
        }

        Base64._enc_mask = 0x3f;
        Base64._dec_mask = 0xff;

        Base64._a_mask = 0xff0000;
        Base64._b_mask = 0x00ff00;
        Base64._c_mask = 0x0000ff;
    },

    getEncodedSize: (...args) => {
        let len, extra;

        switch (args.length) {
            case 1:
                const bytes = args[0];

                len = bytes.length;
                extra = Base64._getEncodeByteCount(bytes)[1];
                break;
            case 2:
                [len, extra] = args;
                break;
        }

        const padding = 3 - extra;
        return Math.ceil(len * Base64._enc_mult) + padding;
    },

    getDecodedSize: (...args) => {
        let len, extra;

        switch (args.length) {
            case 1:
                const str = args[0];

                len = str.length;
                extra = Base64._getDecodeCharCount(str)[1];
                break;
            case 2:
                [len, extra] = args;
                break;
        }

        return len * Base64._dec_mult - extra;
    },

    encode: bytes => {
        if (typeof Base64.lookup === "undefined") {
            Base64._generateTables();
        }

        const [count, extra] = Base64._getEncodeByteCount(bytes);

        const outLen = Base64.getEncodedSize(bytes.length, extra),
            out = Array(outLen);

        let i = 0,
            char_i = 0;

        const pushBytes = (b1, b2, b3, b4) => {
            out[char_i++] = b1;
            out[char_i++] = b2;
            out[char_i++] = b3;
            out[char_i++] = b4;
        };

        for (; i < count; i += 3) {
            const a = (bytes[i] << 16) & Base64._a_mask,
                b = (bytes[i + 1] << 8) & Base64._b_mask,
                c = bytes[i + 2] & Base64._c_mask;

            const triplet = a | b | c;

            const b1 = Base64.lookup[(triplet >> 18) & Base64._enc_mask],
                b2 = Base64.lookup[(triplet >> 12) & Base64._enc_mask],
                b3 = Base64.lookup[(triplet >> 6) & Base64._enc_mask],
                b4 = Base64.lookup[triplet & Base64._enc_mask];

            pushBytes(b1, b2, b3, b4);
        }

        switch (extra) {
            case 1: {
                const c = bytes[count] & Base64._c_mask;

                const triplet = c;

                const b1 = Base64.lookup[(triplet >> 2) & Base64._enc_mask],
                    b2 = Base64.lookup[(triplet << 4) & Base64._enc_mask];

                pushBytes(b1, b2, "=", "=");
                break;
            }
            case 2: {
                const b = (bytes[count] << 8) & Base64._b_mask,
                    c = bytes[count + 1] & Base64._c_mask;

                const triplet = b | c;

                const b1 = Base64.lookup[(triplet >> 10) & Base64._enc_mask],
                    b2 = Base64.lookup[(triplet >> 4) & Base64._enc_mask],
                    b3 = Base64.lookup[(triplet << 2) & Base64._enc_mask];

                pushBytes(b1, b2, b3, "=");
                break;
            }
        }

        return out.join("");
    },

    decode: str => {
        if (typeof Base64.reverseLookup === "undefined") {
            Base64._generateTables();
        }

        if (str.length % 4 !== 0) {
            throw new Base64Error("Invalid string. Length must be a multiple of 4");
        }

        const [count, extra] = Base64._getDecodeCharCount(str);

        const arrLen = Base64.getDecodedSize(str.length, extra),
            arr = new Uint8Array(arrLen);

        let i = 0,
            byte_i = 0;

        const pushBytes = (a, b, c) => {
            if (a !== undefined) {
                arr[byte_i++] = a;
            }

            if (b !== undefined) {
                arr[byte_i++] = b;
            }

            if (c !== undefined) {
                arr[byte_i++] = c;
            }
        };

        for (; i < count; i += 4) {
            let b1 = Base64.reverseLookup[str.charCodeAt(i)],
                b2 = Base64.reverseLookup[str.charCodeAt(i + 1)],
                b3 = Base64.reverseLookup[str.charCodeAt(i + 2)],
                b4 = Base64.reverseLookup[str.charCodeAt(i + 3)];

            if (b1 === undefined) {
                throw new Base64Error("Invalid character: " + str[i]);
            }

            if (b2 === undefined) {
                throw new Base64Error("Invalid character: " + str[i + 1]);
            }

            if (b3 === undefined) {
                throw new Base64Error("Invalid character: " + str[i + 2]);
            }

            if (b4 === undefined) {
                throw new Base64Error("Invalid character: " + str[i + 3]);
            }

            b1 <<= 18;
            b2 <<= 12;
            b3 <<= 6;

            const triplet = b1 | b2 | b3 | b4;

            const a = (triplet >> 16) & Base64._dec_mask,
                b = (triplet >> 8) & Base64._dec_mask,
                c = triplet & Base64._dec_mask;

            pushBytes(a, b, c);
        }

        switch (extra) {
            case 0:
                break;
            case 1: {
                let b1 = Base64.reverseLookup[str.charCodeAt(i)],
                    b2 = Base64.reverseLookup[str.charCodeAt(i + 1)],
                    b3 = Base64.reverseLookup[str.charCodeAt(i + 2)];

                if (b1 === undefined) {
                    throw new Base64Error("Invalid character: " + str[i]);
                }

                if (b2 === undefined) {
                    throw new Base64Error("Invalid character: " + str[i + 1]);
                }

                if (b3 === undefined) {
                    throw new Base64Error("Invalid character: " + str[i + 2]);
                }

                b1 <<= 10;
                b2 <<= 4;
                b3 >>= 2;

                const triplet = b1 | b2 | b3;

                const b = (triplet >> 8) & Base64._dec_mask,
                    c = triplet & Base64._dec_mask;

                pushBytes(b, c);
                break;
            }
            case 2: {
                let b1 = Base64.reverseLookup[str.charCodeAt(i)],
                    b2 = Base64.reverseLookup[str.charCodeAt(i + 1)];

                if (b1 === undefined) {
                    throw new Base64Error("Invalid character: " + str[i]);
                }

                if (b2 === undefined) {
                    throw new Base64Error("Invalid character: " + str[i + 1]);
                }

                b1 <<= 2;
                b2 >>= 4;

                const triplet = b1 | b2;

                const c = triplet & Base64._dec_mask;

                pushBytes(c);
                break;
            }
            default:
                const paddingChars = str.slice(len + 1);
                throw new Base64Error("Invalid padding chars: " + paddingChars);
        }

        return arr;
    },

    _getEncodeByteCount: bytes => {
        const extra = bytes.length % 3,
            count = bytes.length - extra;

        return [count, extra];
    },

    _getDecodeCharCount: str => {
        const paddingPos = str.indexOf("="),
            len = paddingPos > 0 ? paddingPos : str.length,
            extra = str.length - len,
            count = extra > 0 ? len - 4 : len;

        return [count, extra];
    }
};

module.exports = Base64;
