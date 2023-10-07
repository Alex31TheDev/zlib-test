import Bitset from "../bitset/Bitset.js";
import HuffmanCodes from "./HuffmanCodes.js";

function genCanonicalCodes(symCount, codeLengths) {
    const codeMap = Array(symCount);

    for(let i = 0; i < symCount; i++) {
        codeMap[i] = [i, codeLengths[i]];
    }

    codeMap.sort((a, b) => {
        const c1 = a[1] - b[1],
              c2 = a[0] - b[0];

        return c1 || c2;
    });

    const codes = Array(symCount);
    let code = Bitset.fromNumber(0),
        nextLength = 0;

    for(let i = 0; i < symCount; i++) {
        const [currSymbol,
               currLength] = codeMap[i];

        if(typeof currLength === "undefined") {
            continue;
        } else {
            codes[currSymbol] = Bitset.copy(code);
        }

        if(i === symCount - 1) {
            nextLength = currLength;
        } else {
            nextLength = codeMap[i + 1][1];
        }

        code.set(0, 1);
        code.shiftLeft(nextLength - currLength);
    }

    return codes;
}

class HuffmanTable {
    constructor(symCount, codes, codeLengths) {
        this.symCount = symCount;

        this.codes = codes;
        this.codeLengths = codeLengths;
    }

    getCodes() {
        if(typeof this.codes === "undefined") {
            return this.getCanonicalCodes();
        }

        return new HuffmanCodes(this.codes, this.codeLengths);
    }

    getCanonicalCodes() {
        if(typeof this.canonicalCodes !== "undefined") {
            return new HuffmanCodes(this.canonicalCodes, this.codeLengths);
        }

        const codes = genCanonicalCodes(this.symCount, this.codeLengths);
        this.canonicalCodes = codes;

        return new HuffmanCodes(codes, this.codeLengths);
    }
}

export default HuffmanTable;