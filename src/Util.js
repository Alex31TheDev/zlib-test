const Util = Object.freeze({
    encodeString: str => {
        const encoder = new TextEncoder();
        return encoder.encode(str);
    },

    fibonacci: n => {
        const seq = Array(n);
        seq[0] = 1;
        seq[1] = 1;
    
        for(let i = 2; i < n; i++) {
            seq[i] = seq[i - 2] + seq[i - 1];
        }
    
        return seq;
    },

    generateSequenceString: (seq) => {
        const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let out = "";
    
        for(let i = 0; i < seq.length; i++) {
            const char = alphabet[i];

            if(seq[i] === 0) {
                continue;
            }

            out += Array(seq[i]).fill(char).join("");
        }
        
        return out;
    }
});

export default Util;