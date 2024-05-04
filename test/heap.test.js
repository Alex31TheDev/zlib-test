import { describe, test, expect } from "@jest/globals";

import { Heap, HeapType } from "../src/heap/Heap.js";

const testValues = [5, 3, 2, 1, 9, 2, 0, -1, 69420];

const minExpectedHeap = [-1, 1, 0, 3, 9, 2, 2, 5, 69420],
      minExpectedPush = [-1, 0, 1, 2, 9, 3, 2, 5, 69420],
      minExpectedPop = [-1, 0, 1, 2, 2, 3, 5, 9, 69420];

const maxExpectedHeap = [69420, 9, 2, 3, 5, 2, 0, -1, 1],
      maxExpectedPush = [69420, 9, 2, 5, 3, 2, 0, -1, 1],
      maxExpectedPop = [69420, 9, 5, 3, 2, 2, 1, 0, -1];

describe("Min heap", () => {
    test("Heapify", () => {
        const heap = Heap.from(testValues, HeapType.Min);
        expect(heap.heap).toEqual(minExpectedHeap);
    });

    test("Push", () => {
        const heap = new Heap(HeapType.Min);
        for(const val of testValues) {
            heap.push(val);
        }

        expect(heap.heap).toEqual(minExpectedPush);
    });

    test("Pop", () => {
        const heap = new Heap(HeapType.Min);
        for(const val of testValues) {
            heap.push(val);
        }

        for(let i = 0; i < heap.size; i++) {
            const val = heap.pop();
            expect(val).toStrictEqual(minExpectedPop[i]);
        }
    });

    test("toString", () => {
        const heap = new Heap(HeapType.Min);
        for(const val of testValues) {
            heap.push(val);
        }
        
        const expectedString = "\n\n\n        -1\n    /       \\\n    0       1\n  /   \\   /   \\\n  2   9   3   2\n / \\\n 5 69420\n",
              str = heap.toString();

        expect(str).toEqual(expectedString);
    });
});

describe("Max heap", () => {
    test("Heapify", () => {
        const heap = Heap.from(testValues, HeapType.Max);
        expect(heap.heap).toEqual(maxExpectedHeap);
    });

    test("Push", () => {
        const heap = new Heap(HeapType.Max);
        for(const val of testValues) {
            heap.push(val);
        }

        expect(heap.heap).toEqual(maxExpectedPush);
    });

    test("Pop", () => {
        const heap = new Heap(HeapType.Max);
        for(const val of testValues) {
            heap.push(val);
        }

        for(let i = 0; i < heap.size; i++) {
            const val = heap.pop();
            expect(val).toStrictEqual(maxExpectedPop[i]);
        }
    });

    test("toString", () => {
        const heap = new Heap(HeapType.Max);
        for(const val of testValues) {
            heap.push(val);
        }
        
        const expectedString = "\n\n\n        69420\n    /       \\\n    9       2\n  /   \\   /   \\\n  5   3   2   0\n / \\\n -1 1\n",
              str = heap.toString();

        expect(str).toEqual(expectedString);
    });
});