import fs from "fs";
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
            return new Uint8Array(Array.from({ length: len }, (_, i) => i % 256));
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
    },

    HashUtil: {
        hashData: (data, hashType = "sha1") => {
            const hash = crypto.createHash(hashType);
            hash.setEncoding("hex");

            hash.write(data);
            hash.end();

            return hash.read();
        },

        hashFile: (path, hashType = "sha1") => {
            return new Promise((resolve, reject) => {
                const hash = crypto.createHash(hashType),
                    stream = fs.createReadStream(path);

                hash.setEncoding("hex");

                stream.once("error", err => reject(err));
                stream.pipe(hash);

                stream.once("end", _ => {
                    hash.end();
                    resolve(hash.read());
                });
            });
        }
    }
};

export default Util;
