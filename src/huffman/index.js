import assert from "node:assert";
import Util from "../Util.js";

import { Heap, HeapType } from "../heap/Heap.js";
import Bitset from "../bitset/Bitset.js";

import HuffmanTree from "./1/HuffmanTree.js";
import HuffmanTree2 from "./2/HuffmanTree.js";


function testBitset() {
    const set1 = new Bitset(46290),
          set2 = new Bitset("11110000010000000000000000000000000000111100000110001000010001010000101111");

    const bitsExpected1 = [46290],
          bitsExpected2 = [102831151, 15, 961];

    Util.arrayAssert(set1.bits, bitsExpected1);
    Util.arrayAssert(set2.bits, bitsExpected2);

    const set3 = new Bitset(),
          set4 = new Bitset("00000000000000001101001110101100");

    const setTest = [{
        ind: 0,
        bit: 1
    }, {
        ind: 2,
        bit: 1
    }, {
        ind: 2,
        bit: 0
    }, {
        ind: 100,
        bit: 1
    }, {
        ind: 3,
        bit: 1
    }],
          getTest = [1, 4, 5, 2, 3, 69];

    const setExpected = [9, 0, 0, 16],
          getExpected = [0, 0, 1, 1, 1, undefined];

    for(const test of setTest) {
        set3.set(test.ind, test.bit);
    }

    Util.arrayAssert(set3.bits, setExpected);

    for(let i = 0; i < getTest.length; i++) {
        const bit = set4.get(getTest[i]);
        assert.equal(bit, getExpected[i]);
    }

    const stringExpected1 = "1011010011010010",
          stringExpected2 = "11110000010000000000000000000000000000111100000110001000010001010000101111";
    
    const str1 = set1.toString(),
          str2 = set2.toString();

    assert.equal(str1, stringExpected1);
    assert.equal(str2, stringExpected2);

    const leftShiftExpected1 = [92580],
          leftShiftExpected2 = [2587885568, 22],
          leftShiftExpected3 = [205662302, 30, 1922],
          leftShiftExpected4 = [579198976, 123076, 7872512];

    set1.shiftLeft(1);
    Util.arrayAssert(set1.bits, leftShiftExpected1);

    set1.shiftLeft(20);
    Util.arrayAssert(set1.bits, leftShiftExpected2);

    set2.shiftLeft(1);
    Util.arrayAssert(set2.bits, leftShiftExpected3);

    set2.shiftLeft(12);
    Util.arrayAssert(set2.bits, leftShiftExpected4);

    console.log("Bitset test passed.");
}

function testHuffman() {
    const n = 21,
          seq = Util.DataGenerator.fibonacci(n),
          tree = new HuffmanTree();
    
    tree.create(seq, 5);
    const table = tree.getTable();

    const expected = [
        0b111111111111000,
        0b111111111111001,
        0b111111111111010,
        0b111111111111011,
        0b111111111111100,
        0b1111111111100,
        0b111111111111101,
        0b111111111111110,
        0b111111111111111,
        0b1111111111101,
        0b11111111110,
        0b1111111110,
        0b111111110,
        0b11111110,
        0b1111110,
        0b111110,
        0b11110,
        0b1110,
        0b110,
        0b10,
        0b0
    ];

    const codeBin = table.codes.map(x => x.toString(2));

    for(let i = 0; i < codeBin.length; i++) {
        console.log(`${i}: ${codeBin[i]}`);
    }

    Util.arrayAssert(table.codes, expected);
    console.log("Huffman test passed.");
}

testHeap();
testBitset();
//testHuffman();

const seq = [10, 1, 15, 7],
      str = Util.generateSequenceString(seq);
const tree = new HuffmanTree2(seq);
const codes = tree.getTable(2).getCodes(2).codes;
const codeBin = codes.map(x => x.toString());

console.log();