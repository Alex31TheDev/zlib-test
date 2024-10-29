const HeapType = Object.freeze({
    Min: -1,
    Max: 1
});

function numComparison(a, b) {
    return Math.sign(a - b);
}

function compareElements(array, i1, i2, comparison) {
    switch (typeof comparison) {
        case "string":
            return array[i1][comparison](array[i2]);
        case "function":
            return comparison(array[i1], array[i2]);
    }
}

class Heap {
    constructor(type, comparison) {
        this.heap = [];
        this.type = type;

        if (typeof this.comparison === "undefined") {
            this.comparison = numComparison;
        } else {
            this.comparison = comparison;
        }
    }

    static from(arr, type, comparison) {
        let heap = new Heap(type, comparison);
        heap.heap = Array(arr.length);

        for (let i = 0; i < arr.length; i++) {
            heap.heap[i] = arr[i];
        }

        heap.heapify();
        return heap;
    }

    get size() {
        return this.heap.length;
    }

    get isEmpty() {
        return this.heap.length < 1;
    }

    at(i) {
        return this.heap[i];
    }

    swap(i1, i2) {
        let tmp = this.heap[i1];
        this.heap[i1] = this.heap[i2];
        this.heap[i2] = tmp;
    }

    heapifyUp(i) {
        while (i) {
            const parent = Math.floor((i - 1) / 2);

            if (compareElements(this.heap, i, parent, this.comparison) === this.type) {
                this.swap(parent, i);
                i = parent;
            } else {
                break;
            }
        }

        return i;
    }

    heapifyDown(i) {
        while (i < this.heap.length) {
            const left = i * 2 + 1,
                right = i * 2 + 2;

            let largest = i;

            if (left < this.heap.length && compareElements(this.heap, left, i, this.comparison) === this.type) {
                largest = left;
            }

            if (right < this.heap.length && compareElements(this.heap, right, largest, this.comparison) === this.type) {
                largest = right;
            }

            if (largest === i) {
                return;
            }

            this.swap(i, largest);
            i = largest;
        }
    }

    heapify() {
        const start = Math.floor((this.heap.length - 2) / 2);
        for (let i = start; i >= 0; i--) {
            this.heapifyDown(i);
        }
    }

    push(value) {
        this.heap.push(value);
        return this.heapifyUp(this.heap.length - 1);
    }

    pop() {
        if (this.isEmpty) {
            return;
        }

        const val = this.heap[0];

        this.heap[0] = this.heap[this.heap.length - 1];
        this.heap.splice(this.heap.length - 1, 1);

        this.heapifyDown(0);
        return val;
    }

    toString() {
        let string = "",
            height = Math.floor(Math.log2(this.heap.length)) + 1,
            start = 0,
            end = 0;

        for (let i = 0; i <= height; i++) {
            let layer = "";

            let a = Math.pow(2, height - i),
                pad = " ".repeat(2 * a - 1),
                startPad = " ".repeat(a);

            start = end;
            end = Math.min(Math.pow(2, i) - 1, this.heap.length);

            for (let j = start; j < end; j++) {
                let val = this.heap[j],
                    finalPad = j === start ? startPad : pad;

                layer += finalPad + val;

                if (j != 0) {
                    let arrow = j % 2 === 0 ? "\\" : "/";
                    string += finalPad + arrow;
                }
            }

            string += "\n" + layer + "\n";
        }

        return string;
    }
}

export { Heap, HeapType };
