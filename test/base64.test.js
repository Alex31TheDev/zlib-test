import { describe, test, expect } from "@jest/globals";

import Base64 from "../src/base64/base64.cjs";

import DataGenerator from "../src/util/DataGenerator.js";
import Encoding from "../src/util/Encoding.js";

const asciiBytes = DataGenerator.sequentialData(256),
    ascii = String.fromCharCode(...asciiBytes);

const longLen = 204800;

const zeroData = DataGenerator.zeroData(longLen),
    longData = DataGenerator.sequentialData(longLen),
    randomData = DataGenerator.randomData(longLen);

function encodeCase(data) {
    if (typeof data === "string") {
        data = Encoding.encodeUtf8String(data);
    }

    const enc1 = Base64.encode(data),
        enc2 = Encoding.encodeBase64(data);

    expect(enc1).toStrictEqual(enc2);
}

function decodeCase(str) {
    const dec1 = Base64.decode(str),
        dec2 = Encoding.decodeBase64(str);

    expect(dec1).toEqual(dec2);
}

describe("Encode", () => {
    test("Empty string", () => {
        encodeCase("");
    });

    describe("Extra chars", () => {
        test("0 extra", () => {
            encodeCase("abc");
            encodeCase([0, 1, 2]);

            encodeCase("abcdef");
            encodeCase([0, 1, 2, 3, 4, 5]);
        });

        test("1 extra", () => {
            encodeCase("a");
            encodeCase([1]);

            encodeCase("aaaaa");
            encodeCase([0, 1, 2, 3, 3, 4]);
        });

        test("2 extra", () => {
            encodeCase("aa");
            encodeCase([0, 1]);

            encodeCase("aaaa");
            encodeCase([0, 1, 2, 3]);
        });
    });

    describe("Short data", () => {
        test("0-255", () => {
            encodeCase(asciiBytes);
        });

        test("ASCII", () => {
            encodeCase(ascii);
        });
    });

    describe("Long data", () => {
        test("Zero data", () => {
            encodeCase(zeroData);
        });

        test("Sequential data", () => {
            encodeCase(longData);
        });

        test("Random data", () => {
            encodeCase(randomData);
        });
    });
});

describe("Decode", () => {
    test("Empty string", () => {
        decodeCase("");
    });

    test("Invalid length", () => {
        expect(_ => Base64.decode("a")).toThrow();
        expect(_ => Base64.decode("ab")).toThrow();
        expect(_ => Base64.decode("abc")).toThrow();
        expect(_ => Base64.decode("abcde")).toThrow();
    });

    test("Invalid chars", () => {
        expect(_ => Base64.decode(";;;;")).toThrow();
        expect(_ => Base64.decode("ab==;")).toThrow();
    });

    test("Invalid data", () => {
        expect(_ => Base64.decode("=")).toThrow();
        expect(_ => Base64.decode("==")).toThrow();
        expect(_ => Base64.decode("===")).toThrow();
        expect(_ => Base64.decode("====")).toThrow();

        expect(_ => Base64.decode("ab===")).toThrow();
        expect(_ => Base64.decode("ab==a")).toThrow();
        expect(_ => Base64.decode("ab==ab==")).toThrow();
    });

    describe("Extra chars", () => {
        test("0 extra", () => {
            decodeCase("YWFh");
            decodeCase("abcd");
            decodeCase("0123");

            decodeCase("YWFhYWFh");
            decodeCase("abcdabcd");
            decodeCase("01230123");
        });

        test("1 extra", () => {
            decodeCase("abc=");
            decodeCase("cnM=");
            decodeCase("012=");

            decodeCase("abcdefg=");
            decodeCase("YWFhYWE=");
            decodeCase("0123456=");
        });

        test("2 extra", () => {
            decodeCase("YQ==");
            decodeCase("ab==");
            decodeCase("01==");

            decodeCase("YWFhYQ==");
            decodeCase("abcdef==");
            decodeCase("012345==");
        });
    });

    describe("Short data", () => {
        test("0-255", () => {
            const enc = Encoding.encodeBase64(asciiBytes);
            decodeCase(enc);
        });

        test("ASCII", () => {
            const enc = Encoding.encodeBase64(ascii);
            decodeCase(enc);
        });
    });

    describe("Long data", () => {
        test("Zero data", () => {
            const enc = Encoding.encodeBase64(zeroData);
            decodeCase(enc);
        });

        test("Sequential data", () => {
            const enc = Encoding.encodeBase64(longData);
            decodeCase(enc);
        });

        test("Random data", () => {
            const enc = Encoding.encodeBase64(randomData);
            decodeCase(enc);
        });
    });
});
