import { describe, test, expect } from "@jest/globals";

import CRC32 from "../src/checksums/CRC32.js";
import Adler32 from "../src/checksums/Adler32.js";

import Encoding from "../src/util/Encoding.js";

function CRCIndependentCase(str, expected) {
    const crc = new CRC32(),
        encoded = Encoding.encodeUtf8String(str);

    crc.calculate(encoded);
    expect(crc.value).toStrictEqual(expected);
}

function adlerIndependentCase(input, expected) {
    const adler = new Adler32(),
        encoded = Encoding.encodeUtf8String(input);

    adler.calculate(encoded);
    expect(adler.value).toStrictEqual(expected);
}

describe("CRC32", () => {
    test("Empty string", () => {
        CRCIndependentCase("", 0x0);
    });

    test("Short strings", () => {
        CRCIndependentCase("a", 0xe8b7be43);
        CRCIndependentCase("abc", 0x352441c2);
        CRCIndependentCase("amogus", 0xa6515965);
    });

    test("Long string", () => {
        CRCIndependentCase("abcdefghijklmnopqrstuvwxyz", 0x4c2750bd);
    });

    test("Checksum update", () => {
        const crc = new CRC32();

        crc.calculate(Encoding.encodeUtf8String("amogus"));
        expect(crc.value).toStrictEqual(0xa6515965);

        crc.calculate(Encoding.encodeUtf8String("morbius"));
        expect(crc.value).toStrictEqual(0xdfac04b6);

        crc.updateByte(0x41);
        expect(crc.value).toStrictEqual(0xf1042436);
    });
});

describe("Adler32", () => {
    test("Empty string", () => {
        adlerIndependentCase("", 0x1);
    });

    test("Short strings", () => {
        adlerIndependentCase("a", 0x00620062);
        adlerIndependentCase("abc", 0x024d0127);
        adlerIndependentCase("amogus", 0x08bb028d);
    });

    test("Long string", () => {
        adlerIndependentCase("abcdefghijklmnopqrstuvwxyz", 0x90860b20);
    });

    test("Checksum update", () => {
        const adler = new Adler32();

        adler.calculate(Encoding.encodeUtf8String("amogus"));
        expect(adler.value).toStrictEqual(0x08bb028d);

        adler.calculate(Encoding.encodeUtf8String("morbius"));
        expect(adler.value).toStrictEqual(0x2685058e);

        adler.updateByte(0x41);
        expect(adler.value).toStrictEqual(0x2c5405cf);
    });
});
