const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);

let filePath = args[0] ?? "./module.js";
filePath = path.resolve(__dirname);

let code = fs.readFileSync(filePath, "utf-8");
code = code.replace(/(var\swasmExports)=(createWasm\(\)(;))/, "$1$3$2");

fs.writeFileSync(filePath, code, "ascii");
