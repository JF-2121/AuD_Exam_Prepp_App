---
id: sorting-selection
title: "Selection Sort"
category: "Sorting"
order: 3
relatedAlgorithmIds: ["selection-sort"]
sourceFiles: ["AuD_AnkiDeck"]
---

## Idea

Repeatedly find the minimum of the unsorted remainder and swap it into place at the front.

```
selectionSort(A)
  FOR i = 0 TO n-2 DO
    min = i
    FOR j = i+1 TO n-1 DO
      IF A[j] < A[min] THEN min = j
    SWAP(A[i], A[min])
```

## Complexity

| Case | Time |
|---|---|
| Best | Θ(n²) |
| Worst | Θ(n²) |
| Average | Θ(n²) |

Unlike Insertion/Bubble Sort, Selection Sort has **no fast best case** — it always scans the entire unsorted remainder to find the minimum, regardless of input order. Its advantage: at most n swaps total (useful when writes are expensive). It is **not stable** in the naive form (a swap can move an equal element out of its original relative order).

## Worked example: [5, 3, 2, 4, 1]

1. i=0: min is 1 (index 4) → swap with index 0 → [1,3,2,4,5]
2. i=1: min is 2 (index 2) → swap with index 1 → [1,2,3,4,5]
3. i=2: min is already 3 → no swap
4. i=3: min is already 4 → no swap
