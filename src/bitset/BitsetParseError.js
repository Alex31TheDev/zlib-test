class BitsetParseError extends Error {
    constructor(message = "", ...args) {
        super(message, ...args);

        this.name = "BitsetParseError";
        this.message = message;
    }
}

export default BitsetParseError;
