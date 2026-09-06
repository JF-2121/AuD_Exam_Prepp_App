---
id: sorting-bubble
title: "Bubble Sort"
category: "Sorting"
order: 2
relatedAlgorithmIds: ["bubble-sort"]
---

## Idea

Repeatedly scan the array left to right, swapping any adjacent out-of-order pair. Each full pass "bubbles" the largest remaining element to its correct position at the end of the unsorted region.

```
bubbleSort(A)
  FOR i = A.length-1 DOWNTO 1 DO
    sorted = true
    FOR j = 0 TO i-1 DO
      IF A[j] > A[j+1] THEN
        SWAP(A[j], A[j+1])
        sorted = false
    IF sorted THEN break
```

The `sorted` flag is the standard optimization: if a full pass makes zero swaps, the array is already sorted and the algorithm exits early.

## Complexity

| Case | Input | Time |
|---|---|---|
| Best (optimized) | already sorted | Θ(n) — one pass, no swaps, early exit |
| Best (naive, no early exit) | already sorted | Θ(n²) — still runs every pass |
| Worst | reverse sorted | Θ(n²) |
| Average | random order | Θ(n²) |

Bubble Sort and Insertion Sort share the same asymptotic complexity, but Insertion Sort is usually faster in practice — it performs fewer actual operations per element.

## Worked example: [5, 3, 2, 4, 1]

1. Pass 1: → [3, 2, 4, 1, 5]  (5 bubbles all the way to the end)
2. Pass 2: → [2, 3, 1, 4, 5]
3. Pass 3: → [2, 1, 3, 4, 5]
4. Pass 4: → [1, 2, 3, 4, 5]

## Worked example: [6, 4, 9, 3] (compare-and-swap trace)

Each inner-loop step compares an adjacent pair and swaps if out of order:

- **i=1**: (6,4)→swap→[4,6,9,3]; (6,9)→no swap; (9,3)→swap→[4,6,3,9]
- **i=2**: (4,6)→no swap; (6,3)→swap→[4,3,6,9]
- **i=3**: (4,3)→swap→[3,4,6,9]

**Final: [3, 4, 6, 9]**

**Correctness — what exactly needs proving?** It's not enough to show the output is sorted: you must also show the output `A′` is a **permutation** of the input `A` — same length, same multiset of values, just reordered. A sorted array of the *wrong* values would trivially satisfy "sortedness" alone; the permutation property is what rules that out, and it holds here because every step is a `SWAP` (an in-place exchange of two existing values), never an overwrite or deletion.
