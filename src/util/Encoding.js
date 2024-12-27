const Encoding = {
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
    }
};

export default Encoding;
