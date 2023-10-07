class Node {
    constructor(type, parent, side, weight) {
        this.parent = parent;
        this.side = side;
        this.weight = weight;

        this.type = type ?? 0;
    }

    compareTo(node) {
        return Math.sign(this.weight - node.weight);
    }
}

class InternalNode extends Node {
    constructor(left, right) {
        super();

        left.parent = this;
        left.side = 0;
        this.left = left;

        right.parent = this;
        right.side = 1;
        this.right = right;

        this.weight = left.weight + right.weight;
    }
}

class LeafNode extends Node {
    constructor(value, weight) {
        super(1, undefined, undefined, weight);
        
        this.value = value;
    }
}

export {
    InternalNode,
    LeafNode
};