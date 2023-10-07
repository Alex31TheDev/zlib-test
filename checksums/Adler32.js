import ChecksumError from "./ChecksumError.js";

class Adler32 {
    constructor() {
        this.a = 1;
        this.b = 0;
    }

    get value() {
        const sum = (this.b << 16) | this.a;
        return sum >>> 0;
    }

    updateByte(byte) {
        if(typeof byte !== "number") {
            throw new ChecksumError("Byte has to be a number.");
        }

        this.a += byte;
        this.b += this.a;

        this.a %= 65521;
        this.b %= 65521;

        return this.value;
    }

    calculate(bytes, start = 0, end) {
        if(typeof start !== "number") {
            throw new ChecksumError("Start index has to be a number.");
        }

        if(typeof end === "undefined") {
            end = bytes.length;
        } else if(typeof end !== "number") {
            throw new ChecksumError("End index has to be a number.");
        }

        let len = end,
            i = start;

        while(len) {
            let chunkLen = Math.min(len, 4096);
            len -= chunkLen;

            while(chunkLen--) {
                this.a += bytes[i++];
                this.b += this.a;
            }

            this.a %= 65521;
            this.b %= 65521;
        }

        return this.value;
    }
}

export default Adler32;