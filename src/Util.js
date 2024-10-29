import crypto from "crypto";

const Util = {
    encodeUtf8String: str => {
        const encoder = new TextEncoder();
        return encoder.encode(str);
    },

    decodeUtf8Data: data => {
        const decoder = new TextDecoder();
        return decoder.decode(data);
    },

    encodeBase64: data => {
        return Buffer.from(data).toString("base64");
    },

    decodeBase64: str => {
        const data = Buffer.from(str, "base64");
        return new Uint8Array(data);
    },

    DataGenerator: {
        fibonacci: n => {
            const seq = Array(n);
            seq[0] = 1;
            seq[1] = 1;

            for (let i = 2; i < n; i++) {
                seq[i] = seq[i - 2] + seq[i - 1];
            }

            return seq;
        },

        zeroData: len => {
            return new Uint8Array(len);
        },

        sequentialData: len => {
            return new Uint8Array(
                Array(len)
                    .fill()
                    .map((_, i) => i % 256)
            );
        },

        randomData: len => {
            return new Uint8Array(crypto.randomBytes(len).buffer);
        }
    },

    generateSequenceString: seq => {
        const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let out = "";

        for (let i = 0; i < seq.length; i++) {
            const char = alphabet[i];

            if (seq[i] === 0) {
                continue;
            }

            out += Array(seq[i]).fill(char).join("");
        }

        return out;
    }
};

export default Util;
