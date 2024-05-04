function generateTable() {
    const polynomial = 0xedb88320,
          table = new Int32Array(256);

    for(let i = 0; i < 256; i++) {
        let crc = i;

        for(let bit = 0; bit < 8; bit++) {
            if(crc & 1) {
                crc = polynomial ^ (crc >>> 1);
            } else {
                crc = crc >>> 1;
            }
        }

        table[i] = crc;
    }

    return table;
}

const table = generateTable();

class CRC32 {
    constructor() {
        this.crc = 0 ^ (-1);
    }

    get value() {
        return (this.crc ^ (-1)) >>> 0;
    }

    updateByte(byte) {
        if(typeof byte !== "number") {
            throw new ChecksumError("Byte has to be a number.");
        }

        const x = table[(this.crc ^ byte) & 0xff];
        this.crc = (this.crc >>> 8) ^ x;

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

        for(let i = start; i < end; i++) {
            const x = table[(this.crc ^ bytes[i]) & 0xff];
            this.crc = (this.crc >>> 8) ^ x;
        }

        return this.value;
    }
}

export default CRC32;