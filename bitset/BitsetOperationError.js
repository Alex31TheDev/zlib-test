class BitsetOperationError extends Error {
    constructor(message = "", ...args) {
        super(message, ...args);
        
        this.name = "BitsetOperationError";
        this.message = message;
    }
}

export default BitsetOperationError;