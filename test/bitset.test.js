import { describe, test, expect } from "@jest/globals";

import Bitset from "../src/bitset/Bitset.js";
import BitsetParseError from "../src/bitset/BitsetParseError.js";
import BitsetOperationError from "../src/bitset/BitsetOperationError.js";

const numExpected1 = [0],
      numExpected2 = [4294967295],
      numExpected3 = [69420],
      numExpected4 = [];

const stringExpected1 = [0],
      stringExpected2 = [13],
      stringExpected3 = [102831151, 15, 961];

describe("Parsing", () => {
    describe("Without offset", () => {
        test("Zero parse", () => {
            const set = new Bitset(0),
                  expected = new Uint32Array(numExpected1);
            
            expect(set.bits).toEqual(expected);
        });
    
        test("Negative number parse", () => {
            const set = new Bitset(-1),
                  expected = new Uint32Array(numExpected2);
      
            expect(set.bits).toEqual(expected);
        });
    
        test("Regular number parse", () => {
            const set = new Bitset(69420),
                  expected = new Uint32Array(numExpected3);
    
            expect(set.bits).toEqual(expected);
        });
    
        test("Bigint parse", () => {
    
        });
        
        test("Empty string parse", () => {
            const set = new Bitset(""),
                  expected = new Uint32Array(stringExpected1);
    
            expect(set.bits).toEqual(expected);
        });

        test("Short string parse", () => {
            const set = new Bitset("1101"),
                  expected = new Uint32Array(stringExpected2);
            
            expect(set.bits).toEqual(expected);
        });
    
        test("Long string parse", () => {
            const set = new Bitset("11110000010000000000000000000000000000111100000110001000010001010000101111"),
                  expected = new Uint32Array(stringExpected3);
    
            expect(set.bits).toEqual(expected);
        });
    });
    
    describe("With offset", () => {
        test("Zero parse", () => {

        });
    
        test("Negative number parse", () => {
            
        });
    
        test("Regular number parse", () => {
            
        });
    
        test("Bigint parse", () => {
    
        });
        
        test("Empty string parse", () => {
            
        });
  
        test("Short string parse", () => {
            
        });
    
        test("Long string parse", () => {
            
        });
    });

    test("Invalid string parse", () => {
        let thrown = false;

        try {
            new Bitset("20");
        } catch(err) {
            thrown = true;
            expect(err).toBeInstanceOf(BitsetParseError);
            expect(err.message).toStrictEqual("Invalid bit: 2");
        }

        expect(thrown).toStrictEqual(true);
    });
});

describe("Operations", () => {
    describe("Get", () => {
        test("Empty set", () => {
    
        });
    
        test("Small set", () => {
    
        });
    
        test("Large set", () => {
    
        });
    });

    describe("Set", () => {
        test("Empty set", () => {
    
        });
    
        test("Small set", () => {
    
        });
    
        test("Large set", () => {
    
        });
    });

    describe("Flip", () => {
        test("Empty set", () => {
    
        });
    
        test("Small set", () => {
    
        });
    
        test("Large set", () => {
    
        });
    });

    describe("OR", () => {
        test("Empty set", () => {
    
        });
    
        test("Small set", () => {
    
        });
    
        test("Large set", () => {
    
        });
    });

    describe("AND", () => {
        test("Empty set", () => {
    
        });
    
        test("Small set", () => {
    
        });
    
        test("Large set", () => {
    
        });
    });

    describe("NOT", () => {
        test("Empty set", () => {
    
        });
    
        test("Small set", () => {
    
        });
    
        test("Large set", () => {
    
        });
    });

    describe("XOR", () => {
        test("Empty set", () => {
    
        });
    
        test("Small set", () => {
    
        });
    
        test("Large set", () => {
    
        });
    });

    describe("Left shift", () => {
        describe("Without carryover", () => {
            test("Empty set", () => {
    
            });
        
            test("Small set", () => {
        
            });
        
            test("Large set", () => {
        
            });
        });
        
        describe("With carryover", () => {
            test("Empty set", () => {
    
            });
        
            test("Small set", () => {
        
            });
        
            test("Large set", () => {
        
            });
        });
    });

    describe("Right shift", () => {
        describe("Without carryover", () => {
            test("Empty set", () => {
    
            });
        
            test("Small set", () => {
        
            });
        
            test("Large set", () => {
        
            });
        });
        
        describe("With carryover", () => {
            test("Empty set", () => {
    
            });
        
            test("Small set", () => {
        
            });
        
            test("Large set", () => {
        
            });
        });
    });
});

describe("toString", () => {
    test("Empty set", () => {
        const set = new Bitset();
        expect(set.toString()).toEqual("");
    });

    test("Single bit set", () => {
        const testString = "1",
              set = new Bitset(testString);

        expect(set.toString()).toEqual(testString);
    });

    test("Small set", () => {
        const testString = "100100100100111",
        set = new Bitset(testString);

        expect(set.toString()).toEqual(testString);
    });

    test("Big set", () => {
        const testString = "11110000010000000000000000000000000000111100000110001000010001010000101111",
        set = new Bitset(testString);

        expect(set.toString()).toEqual(testString);
    });
});