---
id: sorting-bubble
title: "Bubble Sort"
category: "Sorting"
order: 2
relatedAlgorithmIds: ["bubble-sort"]
sourceFiles: ["AuD-Zusammenfassung.pdf", "AuD_AnkiDeck"]
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
