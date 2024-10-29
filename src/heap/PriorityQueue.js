import { Heap, HeapType } from "./Heap.js";

class PriorityQueue {
    constructor(comparison) {
        this.queue = new Heap(HeapType.Min, comparison);
    }

    enqueue(obj) {
        this.queue.push(obj);
    }

    dequeue() {
        return this.queue.pop();
    }

    get front() {
        return this.queue.at(0);
    }

    get size() {
        return this.queue.size;
    }

    get isEmpty() {
        return this.queue.isEmpty;
    }
}

export default PriorityQueue;
