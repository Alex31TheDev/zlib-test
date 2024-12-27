const Util = {
    round: (num, digits) => {
        const exp = 10 ** digits;
        return Math.round((num + Number.EPSILON) * exp) / exp;
    },

    generateSequenceString: seq => {
        const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let out = "";

        for (let i = 0; i < seq.length; i++) {
            const char = alphabet[i];

            if (seq[i] === 0) {
                continue;
            }

            out += Array(seq[i]).fill(char).join("");
        }

        return out;
    },

    benchmark: (name, runs, func, ...args) => {
        let result;

        let min = Number.MAX_VALUE,
            max = 0,
            sum = 0;

        for (let i = 1; i <= runs; i++) {
            const t1 = performance.now();

            const out = func(...args);

            const t2 = performance.now(),
                time = t2 - t1;

            if (typeof result === "undefined") {
                result = out;
            }

            min = Math.min(min, time);
            max = Math.max(max, time);
            sum += time;
        }

        const avg = sum / runs;

        const minStr = Math.round(min * 1000).toLocaleString(),
            maxStr = Math.round(max * 1000).toLocaleString(),
            avgStr = Math.round(avg * 1000).toLocaleString(),
            sumStr = Util.round(sum / 1000, 3);

        console.log(
            `${name} - ${runs} runs | min: ${minStr}us | max: ${maxStr}us | avg: ${avgStr}us | total: ${sumStr}s`
        );
        return [min, max, avg, sum, result];
    }
};

export default Util;
