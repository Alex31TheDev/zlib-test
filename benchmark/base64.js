import Base64 from "../src/base64/base64.cjs";
import Util from "../src/Util.js";

const dataLength = 2048 * 1000,
    runs = 200;

const data = Array(dataLength)
    .fill()
    .map((_, i) => i % 256);

const encoded = Util.encodeBase64(data);

function benchmark(name, func, data) {
    let min = Number.MAX_VALUE,
        max = 0,
        sum = 0;

    for (let i = 1; i <= runs; i++) {
        const t1 = performance.now();

        func(data);

        const t2 = performance.now(),
            time = t2 - t1;

        min = Math.min(min, time);
        max = Math.max(max, time);
        sum += time;
    }

    const avg = sum / runs;
    console.log(`${name}:`, "min:", min, "max:", max, "avg:", avg);
}

console.log("Data length:", dataLength, "runs:", runs, "\n");

benchmark("Built-in encode", Util.encodeBase64, data);
benchmark("Built-in decode", Util.decodeBase64, encoded);

console.log();

benchmark("Custom encode", Base64.encode, data);
benchmark("Custom decode", Base64.decode, encoded);
