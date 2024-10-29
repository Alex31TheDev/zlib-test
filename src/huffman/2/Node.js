const NodeType = Object.freeze({
    Leaf: 0,
    Internal: 1
});

const NodeSide = Object.freeze({
    Left: 0,
    Right: 1
});

class BaseNode {
    constructor(type, side, parent, weight) {
        this.type = type;
        this.side = side;
        this.parent = parent;

        this.weight = weight;
    }

    compareTo(node) {
        return Math.sign(this.weight - node.weight);
    }
}

class LeafNode extends BaseNode {
    constructor(symbol, weight) {
        super(NodeType.Leaf, undefined, undefined, weight);
        this.symbol = symbol;
    }
}

class InternalNode extends BaseNode {
    constructor(left, right) {
        super(NodeType.Internal);

        left.parent = this;
        left.side = NodeSide.Left;

        right.parent = this;
        right.side = NodeSide.Right;

        this.left = left;
        this.right = right;

        this.weight = left.weight + right.weight;
    }
}

export {
    NodeType,
    NodeSide,
    LeafNode,
    InternalNode
};