import Base64 from "../src/base64/base64.cjs";

import Util from "../src/Util.js";
import Encoding from "../src/util/Encoding.js";

const dataLength = 2048 * 1000,
    runs = 200;

const data = Array(dataLength)
    .fill()
    .map((_, i) => i % 256);

const encoded = Encoding.encodeBase64(data);

console.log("Data length:", dataLength, "runs:", runs, "\n");

Util.benchmark("Built-in encode", runs, Encoding.encodeBase64, data);
Util.benchmark("Built-in decode", runs, Encoding.decodeBase64, encoded);

console.log();

Util.benchmark("Custom encode", runs, Base64.encode, data);
Util.benchmark("Custom decode", runs, Base64.decode, encoded);
