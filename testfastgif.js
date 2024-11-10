import FastgifDecoder from "./src/fastgif/fastgif.cjs";
import fs from "fs";

const wasm = fs.readFileSync("./src/fastgif/fastgif.wasm");
const gif = fs.readFileSync("D:\\tenor.gif");

FastgifDecoder.loadWasm(wasm);
const data = FastgifDecoder.decode(gif);

console.log();
