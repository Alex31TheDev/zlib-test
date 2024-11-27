import fs from "fs";
import crypto from "crypto";

const Util = {
    round: (num, digits) => {
        const exp = 10 ** digits;
        return Math.round((num + Number.EPSILON) * exp) / exp;
    },

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
    },

    benchmark: (name, runs, func, ...args) => {
        let result;

        let min = Number.MAX_VALUE,
            max = 0,
            sum = 0;

        for (let i = 1; i <= runs; i++) {
            const t1 = performance.now();

            const out = func(...args);

            const t2 = performance.now(),
                time = t2 - t1;

            if (typeof result === "undefined") {
                result = out;
            }

            min = Math.min(min, time);
            max = Math.max(max, time);
            sum += time;
        }

        const avg = sum / runs;

        const minStr = Math.round(min * 1000).toLocaleString(),
            maxStr = Math.round(max * 1000).toLocaleString(),
            avgStr = Math.round(avg * 1000).toLocaleString(),
            sumStr = Util.round(sum / 1000, 3);

        console.log(
            `${name} - ${runs} runs | min: ${minStr}us | max: ${maxStr}us | avg: ${avgStr}us | total: ${sumStr}s`
        );
        return [min, max, avg, sum, result];
    }
};

export default Util;
