import crypto from "crypto";

const DataGenerator = {
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
};

export default DataGenerator;
