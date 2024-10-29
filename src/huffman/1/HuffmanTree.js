import PriorityQueue from "../../heap/PriorityQueue.js";
import { InternalNode, LeafNode } from "./Node.js";
import HuffmanTable from "./HuffmanTable.js";

class HuffmanTree {
    constructor() {
        this.symCount = 0;
        this.maxDepth = 0;

        this.depthMap = new Map();
    }

    create(freq, limit) {
        this.freq = freq;
        this.symCount = freq.length;

        const queue = new PriorityQueue("compareTo");
        for (let i = 0; i < this.symCount; i++) {
            if (freq[i] > 0) {
                queue.enqueue(new LeafNode(i, freq[i]));
            }
        }

        for (let i = 0; queue.size < 2; i++) {
            if (freq[i] === 0) {
                queue.enqueue(new LeafNode(i, 1));
            }
        }

        this.queue = queue;

        this.build();
        this.traverse();
        this.balance(limit);
    }

    build() {
        const n = this.queue.size;

        for (let i = 0; i < n - 1; i++) {
            const left = this.queue.dequeue(),
                right = this.queue.dequeue();

            this.queue.enqueue(new InternalNode(left, right));
        }

        this.root = this.queue.dequeue();
    }

    traverse() {
        this.depthMap.clear();
        this.maxDepth = 0;

        const recurseBound = recurse.bind(this);
        recurseBound(this.root, 0);

        function recurse(node, depth) {
            this.maxDepth = Math.max(this.maxDepth, depth);

            if (node.type === 0) {
                recurseBound(node.left, depth + 1);
                recurseBound(node.right, depth + 1);
            } else if (node.type === 1) {
                if (!this.depthMap.has(depth)) {
                    this.depthMap.set(depth, Array());
                }

                this.depthMap.get(depth).push(node);
            }
        }
    }

    balance(limit) {
        while (this.maxDepth > limit) {
            const leaf_a = this.depthMap.get(this.maxDepth)[0];
            let leaf_b;

            const parent1 = leaf_a.parent,
                parent2 = parent1.parent;

            if (leaf_a.side === 0) {
                leaf_b = parent1.right;
            } else {
                leaf_b = parent1.left;
            }

            if (parent1.side === 0) {
                parent2.left = leaf_b;
                parent2.left.parent = parent2;
                parent2.left.side = 0;
            } else {
                parent2.right = leaf_b;
                parent2.right.parent = parent2;
                parent2.right.side = 1;
            }

            let moved = false;

            for (let i = this.maxDepth - 2; i >= 1; i--) {
                const leaves = this.depthMap.get(i);

                if (typeof leaves !== "undefined") {
                    const leaf_c = leaves[0],
                        parent3 = leaf_c.parent;

                    if (leaf_c.side === 0) {
                        parent3.left = new InternalNode(leaf_a, leaf_c);
                        parent3.left.parent = parent3;
                        parent3.left.side = 0;
                    } else {
                        parent3.right = new InternalNode(leaf_a, leaf_c);
                        parent3.right.parent = parent3;
                        parent3.right.side = 1;
                    }

                    moved = true;
                    break;
                }
            }

            if (!moved) {
                throw new Error("Can't balance the tree.");
            }

            this.traverse(this.root);
        }
    }

    getTable() {
        const table = new HuffmanTable(this.symCount);

        let nextCode = 0,
            lastShift = 0;

        for (const [len, leaves] of this.depthMap.entries()) {
            nextCode <<= len - lastShift;
            lastShift = len;

            leaves.sort((a, b) => a.value - b.value);

            for (const leaf of leaves) {
                table.codes[leaf.value] = nextCode++;
                table.lenCodes[leaf.value] = len;
            }
        }

        return table;
    }
}

export default HuffmanTree;
