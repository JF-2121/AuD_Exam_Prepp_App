---
id: sorting-insertion
title: "Insertion Sort"
category: "Sorting"
order: 1
relatedAlgorithmIds: ["insertion-sort"]
sourceFiles: ["AuD-Zusammenfassung.pdf", "AuD_AnkiDeck"]
---

## Idea

Like sorting a hand of playing cards: walk left to right, and insert each new element into its correct position among the already-sorted elements to its left.

```
insertionSort(A)
  FOR i = 1 TO A.length-1 DO
    key = A[i]
    j = i - 1
    WHILE j >= 0 AND A[j] > key DO
      A[j+1] = A[j]
      j = j - 1
    A[j+1] = key
```

## Loop invariant & correctness

**Invariant**: before iteration i begins, `A[0..i-1]` is already sorted. The inner `WHILE` shifts every element greater than `key` one slot right, then drops `key` into the gap — restoring the invariant for `i+1`. After the last iteration (`i = n-1`), the invariant gives a fully sorted `A[0..n-1]`.

## Complexity

| Case | Input | Time |
|---|---|---|
| Best | already sorted | Θ(n) — one comparison per element, no shifts |
| Worst | reverse sorted | Θ(n²) — every element shifts all the way to index 0 |
| Average | random order | Θ(n²) |

**Stable**: yes — equal keys are never swapped past each other.

## Worked example: [5, 3, 2, 4, 1]

1. i=1, key=3: shift 5 right → [3,5,2,4,1]
2. i=2, key=2: shift 5,3 right → [2,3,5,4,1]
3. i=3, key=4: shift 5 right → [2,3,4,5,1]
4. i=4, key=1: shift 2,3,4,5 right → [1,2,3,4,5]
