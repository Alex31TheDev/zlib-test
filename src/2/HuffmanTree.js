import PriorityQueue from "../heap/PriorityQueue.js";
import { NodeType, NodeSide, LeafNode, InternalNode } from "./Node.js";
import HuffmanTable from "./HuffmanTable.js";
import Bitset from "../bitset/Bitset.js";

class HuffmanTree {
    constructor(freq) {
        this.freq = freq;
        this.symCount = freq.length;

        this.create();
    }

    create() {
        const queue = new PriorityQueue("compareTo");

        for(let i = 0; i < this.symCount; i++) {
            if(this.freq[i] > 0) {
                queue.enqueue(new LeafNode(i, this.freq[i]));
            }
        }

        for(let i = 0; queue.size < 2; i++) {
            if(this.freq[i] === 0) {
                queue.enqueue(new LeafNode(i, 1));
            }
        }

        const n = queue.size;
        for(let i = 0; i < n - 1; i++) {
            const left = queue.dequeue(),
                  right = queue.dequeue();

            queue.enqueue(new InternalNode(left, right));
        }

        this.tree = queue.dequeue();
    }

    getTable() {
        const codes = Array(this.symCount),
              codeLengths = Array(this.symCount);

        function recTraverse(node, code, codeLen) {
            if(typeof node === "undefined") {
                return;
            }

            switch(node.side) {
                case NodeSide.Left:
                    code.shiftLeft(1);
                    break;
                case NodeSide.Right:
                    code.shiftLeft(1);
                    code.set(0, 1);
                    break;
            }

            switch(node.type) {
                case NodeType.Internal:
                    codeLen++;

                    recTraverse(node.left, Bitset.copy(code), codeLen);
                    recTraverse(node.right, Bitset.copy(code), codeLen);

                    break;
                case NodeType.Leaf:
                    codes[node.symbol] = Bitset.copy(code);
                    codeLengths[node.symbol] = codeLen;
                    break;
            }
        }

        recTraverse(this.tree, new Bitset(), 0);
        return new HuffmanTable(this.symCount, codes, codeLengths);
    }

    getLengthLimitedTable(limit) {
        const histogram = Array(limit).fill(0);
        for(let i = 0; i < this.symCount; i++) {
            histogram[i] = this.freq[i];
        }

        console.log();
    }
}

export default HuffmanTree;