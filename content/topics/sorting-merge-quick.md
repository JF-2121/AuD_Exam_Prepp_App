---
id: sorting-merge-quick
title: "Merge Sort & Quicksort"
category: "Sorting"
order: 4
relatedAlgorithmIds: ["merge-sort", "quicksort"]
sourceFiles: ["AuD-Zusammenfassung.pdf"]
---

## Divide and Conquer

Both algorithms split the array (**divide**), solve the pieces recursively, and combine (**conquer**). They differ in *where the work happens*:

- **Merge Sort** does trivial work while dividing (just split in half) and all the real work while **combining** (merging two sorted halves).
- **Quicksort** does all the real work while **dividing** (partitioning around a pivot) and trivial work while combining (nothing — the pieces are already in place).

## Merge Sort

```
mergeSort(A, left, right)
  IF left < right THEN
    mid = floor((left+right)/2)
    mergeSort(A, left, mid)
    mergeSort(A, mid+1, right)
    merge(A, left, mid, right)

merge(A, left, mid, right)
  p = left; q = mid+1
  FOR i = 0 TO right-left DO
    IF q > right OR (p <= mid AND A[p] <= A[q]) THEN
      temp[i] = A[p]; p = p+1
    ELSE
      temp[i] = A[q]; q = q+1
  copy temp back into A[left..right]
```

**Complexity**: T(n) = 2T(n/2) + Θ(n) → **Θ(n log n)** in best, worst, *and* average case — merging always costs Θ(n) regardless of input order, so there's no bad input for Merge Sort. Cost: Θ(n) extra space for the temp array.

## Quicksort

```
quicksort(A, left, right)
  IF left < right THEN
    p = partition(A, left, right)
    quicksort(A, left, p)
    quicksort(A, p+1, right)

partition(A, left, right)
  pivot = A[left]
  p = left-1; q = right+1
  WHILE p < q DO
    REPEAT p = p+1 UNTIL A[p] >= pivot
    REPEAT q = q-1 UNTIL A[q] <= pivot
    IF p < q THEN SWAP(A[p], A[q])
  RETURN q
```

**Complexity**:
- **Worst case Θ(n²)**: pivot is always the min or max (e.g. already-sorted input with first-element pivot) → maximally unbalanced partitions, recursion depth n.
- **Best case Θ(n log n)**: pivot always splits the array into two equal halves → recursion depth log n.
- **Average case Θ(n log n)**: random pivot choice.

In practice Quicksort usually beats Merge Sort despite the same average complexity, because it sorts **in place** (no copying to a temp array) and has smaller constant factors. Choosing the pivot **randomly** (rather than always the first element) avoids the worst case for already-sorted or adversarial inputs.

## Lower bound for comparison-based sorting

Any sorting algorithm that only compares elements pairwise needs **Ω(n log n)** comparisons in the worst case — this follows from a decision-tree argument: there are n! possible orderings, and each comparison can only distinguish two outcomes, so the tree needs depth ≥ log₂(n!) = Θ(n log n). Merge Sort and Heap Sort achieve this bound; Quicksort achieves it only on average, not worst case. Radix Sort is *not* comparison-based, which is how it escapes this bound entirely.
