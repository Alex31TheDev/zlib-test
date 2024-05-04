import BitsetParseError from "./BitsetParseError.js";
import BitsetOperationError from "./BitsetOperationError.js";

function getIndexes (ind) {
    const arrInd = ~~(ind / 32),
          bitInd = ind % 32;

    return [arrInd, bitInd];
}

class Bitset {
    constructor(val, baseSize = 1) {
        if(typeof baseSize !== "number") {
            throw new BitsetOperationError("Base size has to be a number.");
        } else if(baseSize < 1) {
            throw new BitsetOperationError("Base size has to be at least 1.");
        }

        this.bits = new Uint32Array(baseSize);
        this.baseSize = baseSize;
        this.bitCount = 0;

        if(typeof val !== "undefined") {
            this.parse(val);
        }
    }

    clear() {
        this.bits = new Uint32Array(this.baseSize);
        this.bitCount = 0;
    }

    extendArray(newSize) {
        if(newSize < this.bits.length) {
            return;
        }

        const newBits = new Uint32Array(newSize);

        for(let i = 0; i < this.bits.length; i++) {
            newBits[i] = this.bits[i];
        }

        this.bits = newBits;
    }

    parseNumber(num, pos = 0) {
        if(typeof num === "bigint") {
            throw new BitsetParseError("Can't parse bigint. Use parseBigint instead.");
        } else if(typeof num !== "number") {
            throw new BitsetParseError("Can't parse " + typeof str + ".");
        }
        
        if(typeof pos !== "number") {
            throw new BitsetOperationError("Position has to be a number.");
        } else if(pos < 0) {
            throw new BitsetOperationError("Position can't be negative.");
        }

        let num2 = num >>> 0,
            bitCount = 0;

        do {
            num2 >>= 1;
            bitCount++;
        } while(num2 > 0);

        this.clear();
        this.bitCount = bitCount;
        this.bits[0] = num | 0;

        return this;
    }

    parseBigint(num, pos = 0) {
        if(typeof num === "number") {
            throw new BitsetParseError("Can't parse number. Use parseNumber instead.");
        } else if(typeof num !== "bigint") {
            throw new BitsetParseError("Can't parse " + typeof str + ".");
        }

        if(typeof pos !== "number") {
            throw new BitsetOperationError("Position has to be a number.");
        } else if(pos < 0) {
            throw new BitsetOperationError("Position can't be negative.");
        }

        return this;
    }

    parseString(str, pos = 0) {
        if(typeof str !== "string") {
            throw new BitsetParseError("Can't parse " + typeof str + ".");
        }

        if(typeof pos !== "number") {
            throw new BitsetOperationError("Position has to be a number.");
        } else if(pos < 0) {
            throw new BitsetOperationError("Position can't be negative.");
        }

        this.clear();
        if(str.length < 1) {
            return this;
        }

        const bitCount = str.length,
              newLength = Math.ceil(bitCount / 32);

        this.extendArray(newLength);
        this.bitCount = bitCount;

        for(let i = 0; i < str.length; i++) {
            const bit = parseInt(str[str.length - i - 1]),
                  [arrIndex, bitIndex] = getIndexes(i);
            
            if(bit === 0) {
                this.bits[arrIndex] &= ~(1 << bitIndex);
            } else if(bit === 1) {
                this.bits[arrIndex] |= (1 << bitIndex);
            } else {
                throw new BitsetParseError("Invalid bit: " + str[str.length - i - 1]);
            }
        }

        return this;
    }

    inPlaceCopy(set, pos = 0) {
        if(!(val instanceof Bitset)) {
            throw new BitsetParseError("Set has to be an instance of BitSet.");
        }
        
        if(typeof pos !== "number") {
            throw new BitsetOperationError("Position has to be a number.");
        } else if(pos < 0) {
            throw new BitsetOperationError("Position can't be negative.");
        }

        this.baseSize = set.baseSize;

        this.bits = set.bits.slice();
        this.bitCount = set.bitCount;

        return this;
    }

    static fromNumber(num) {
        const set = new Bitset();
        set.parseNumber(num);

        return set;
    }

    static fromString(str) {
        const set = new Bitset();
        set.parseString(str);

        return set;
    }

    static copy(set) {
        const copy = new Bitset();
        copy.inPlaceCopy(set);

        return copy;
    }

    parse(val, ind = 0) {
        switch(typeof val) {
            case "number":
                return this.parseNumber(val, ind);
            case "string":
                return this.parseString(val, ind);
            case "bigint":
                return this.parseBigint(val. ind);
            default:
                if(val instanceof Bitset) {
                    this.inPlaceCopy(val, ind);
                } else {
                    throw new BitsetParseError("Can't parse " + typeof val);
                }
        }
    }

    set(pos, bit) {
        if(typeof pos !== "number") {
            throw new BitsetOperationError("Position has to be a number.");
        } else if(pos < 0) {
            throw new BitsetOperationError("Position can't be negative.");
        }

        const [arrIndex, bitIndex] = getIndexes(pos);

        this.extendArray(arrIndex + 1);
        this.bitCount = Math.max(this.bitCount, pos + 1);

        if(bit === 0) {
            this.bits[arrIndex] &= ~(1 << bitIndex);
        } else if(bit === 1) {
            this.bits[arrIndex] |= (1 << bitIndex);
        }

        return this;
    }
    
    get(pos) {
        if(typeof pos !== "number") {
            throw new BitsetOperationError("Position has to be a number.");
        } else if(pos < 0) {
            throw new BitsetOperationError("Position can't be negative.");
        } else if(pos > this.bitCount) {
            return;
        }
        
        const [arrIndex, bitIndex] = getIndexes(pos);
        return this.bits[arrIndex] >> bitIndex & 1;
    }

    flip(pos) {
        if(typeof pos !== "number") {
            throw new BitsetOperationError("Position has to be a number.");
        } else if(pos < 0) {
            throw new BitsetOperationError("Position can't be negative.");
        }
        
        const [arrIndex, bitIndex] = getIndexes(pos);

        this.extendArray(arrIndex + 1);
        this.bitCount = Math.max(this.bitCount, pos + 1);

        this.bits[arrIndex] ^= 1 << bitIndex;
        return this;
    }

    or(set) {
        

        return this;
    }

    and(set) {
        

        return this;
    }

    not(set) {


        return this;
    }

    xor(set) {
        

        return this;
    }

    shiftLeft(n = 1) {
        if(typeof pos !== "number") {
            throw new BitsetOperationError("Shift amount has to be a number.");
        } else if(n > 32) {
            throw new BitsetOperationError("Can't shift more than 1 set unit.");
        } else if(n < 0) {
            throw new BitsetOperationError("Can't shift by a negative number.");
        } else if(n === 0) {
            return this;
        }

        const remainder = new Uint32Array(this.bits.length),
              [oldArrIndex, oldBitIndex] = getIndexes(this.bitCount);

        this.bitCount += n;
        const [arrIndex, bitIndex] = getIndexes(this.bitCount),
              n2 = Math.min(n, bitIndex);

        for(let i = 0; i < this.bits.length; i++) {
            let wordLength;

            if(i < oldArrIndex) {
                wordLength = 32;
            } else {
                wordLength = oldBitIndex;
            }

            remainder[i] = this.bits[i] >>> (wordLength - n2);
            this.bits[i] <<= n;
        }

        this.extendArray(arrIndex + 1);
        for(let i = 0; i < arrIndex; i++) {
            this.bits[i + 1] |= remainder[i];
        }

        return this;
    }

    shiftRight(n = 1) {
        if(typeof pos !== "number") {
            throw new BBitsetOperationError("Shift amount has to be a number.");
        } else if(n > 32) {
            throw new BitsetOperationError("Can't shift more than 1 set unit.");
        } else if(n < 0) {
            throw new BitsetOperationError("Can't shift by a negative number.");
        } else if(n === 0) {
            return this;
        }



        return this;
    }

    toString() {
        const [maxArr, maxBit] = getIndexes(this.bitCount - 1);
        let out = "";

        const str = this.bits[maxArr].toString(2).slice(0, maxBit + 1);
        out += str.padStart(maxBit + 1, "0");

        for(let i = maxArr - 1; i >= 0; i--) {
            const str = this.bits[i].toString(2);
            out += str.padStart(32, "0");
        }

        return out;
    }
}

export default Bitset;