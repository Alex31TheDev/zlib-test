const Base64 = {
    generateTables: () => {
        Base64.lookup = [];
        Base64.reverseLookup = [];

        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

        for (let i = 0; i < alphabet.length; i++) {
            Base64.lookup[i] = alphabet[i];
            Base64.reverseLookup[alphabet.charCodeAt(i)] = i;
        }
    },
    encode: bytes => {
        if (typeof Base64.lookup === "undefined") {
            Base64.generateTables();
        }

        const len = bytes.length,
            extra = bytes.length % 3;

        const out = [];

        for (let i = 0, len2 = len - extra; i < len2; i += 3) {
            const a = (bytes[i] << 16) & 0xff0000,
                b = (bytes[i + 1] << 8) & 0x00ff00,
                c = bytes[i + 2] & 0x0000ff;

            const triplet = a | b | c;

            const b1 = Base64.lookup[(triplet >> 18) & 0x3f],
                b2 = Base64.lookup[(triplet >> 12) & 0x3f],
                b3 = Base64.lookup[(triplet >> 6) & 0x3f],
                b4 = Base64.lookup[triplet & 0x3f];

            out.push(b1, b2, b3, b4);
        }

        switch (extra) {
            case 1: {
                const val = bytes[len - 1];

                const b1 = Base64.lookup[(val >> 2) & 0x3f],
                    b2 = Base64.lookup[(val << 4) & 0x3f];

                out.push(b1, b2, "==");
                break;
            }
            case 2: {
                const val = (bytes[len - 2] << 8) + bytes[len - 1];

                const b1 = Base64.lookup[(val >> 10) & 0x3f],
                    b2 = Base64.lookup[(val >> 4) & 0x3f],
                    b3 = Base64.lookup[(val << 2) & 0x3f];

                out.push(b1, b2, b3, "=");
                break;
            }
        }

        return out.join("");
    },
    decode: base64 => {
        if (typeof Base64.reverseLookup === "undefined") {
            Base64.generateTables();
        }

        if (base64.length % 4 !== 0) {
            throw new TypeError("Invalid string. Length must be a multiple of 4.");
        }

        const len = base64.includes("=") ? base64.indexOf("=") : base64.length,
            extra = len % 2;

        const arrLen = (base64.length * 3) / 4 - extra,
            arr = new Uint8Array(arrLen);

        const count = extra > 0 ? len - 4 : len;
        let i = 0,
            byte_i = 0;

        for (; i < count; i += 4) {
            const b1 = Base64.reverseLookup[base64.charCodeAt(i)] << 18,
                b2 = Base64.reverseLookup[base64.charCodeAt(i + 1)] << 12,
                b3 = Base64.reverseLookup[base64.charCodeAt(i + 2)] << 6,
                b4 = Base64.reverseLookup[base64.charCodeAt(i + 3)];

            const triplet = b1 | b2 | b3 | b4;

            arr[byte_i++] = (triplet >> 16) & 0xff;
            arr[byte_i++] = (triplet >> 8) & 0xff;
            arr[byte_i++] = triplet & 0xff;
        }

        switch (extra) {
            case 2: {
                const b1 = Base64.reverseLookup[base64.charCodeAt(i)] << 2,
                    b2 = Base64.reverseLookup[base64.charCodeAt(i + 1)] >> 4;

                const val = b1 | b2;

                arr[byte_i++] = val & 0xff;
                break;
            }
            case 1: {
                const b1 = Base64.reverseLookup[base64.charCodeAt(i)] << 10,
                    b2 = Base64.reverseLookup[base64.charCodeAt(i + 1)] << 4,
                    b3 = Base64.reverseLookup[base64.charCodeAt(i + 2)] >> 2;

                const val = b1 | b2 | b3;

                arr[byte_i++] = (val >> 8) & 0xff;
                arr[byte_i++] = val & 0xff;
                break;
            }
        }

        return arr;
    }
};

export default Base64;
