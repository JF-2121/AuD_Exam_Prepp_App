---
id: sorting-radix
title: "Radix Sort (Non-Comparison Sorting)"
category: "Sorting"
order: 5
relatedAlgorithmIds: []
sourceFiles: ["AuD-Zusammenfassung.pdf"]
---

## Idea

Radix Sort never compares two elements directly — instead it sorts digit by digit (least significant digit first) using a stable bucket distribution (Counting-Sort-style) at each digit position.

```
radixSort(A)          // keys have d digits, base D (e.g. D=10)
  FOR i = 0 TO d-1 DO       // i=0 is least significant digit
    FOR j = 0 TO n-1 DO putBucket(A, i, j, buckets)
    read buckets back into A in order 0..D-1, then clear buckets
```

Each pass must be a **stable** sort (preserve relative order of equal digits), otherwise the work of previous passes gets undone.

## Complexity

**O(d·(n + D))** for every case (best = worst = average — it doesn't depend on input order at all).

- If D (the digit alphabet size, e.g. 10) is treated as a constant → **O(d·n)**.
- If d (number of digits) is also constant → **O(n)**, linear time.
- As D approaches n, d = Θ(log_D n), giving **O(n log n)** — this is how Radix Sort dodges the Ω(n log n) comparison-sort lower bound: it's not comparison-based, so the bound doesn't apply.

## Worked example: [232, 836, 101, 903, 220, 425, 762, 83, 5, 319]

- **Pass 1 (1s digit)**: → [220, 101, 232, 762, 903, 83, 425, 5, 836, 319]
- **Pass 2 (10s digit)**: → [101, 903, 5, 319, 220, 425, 836, 232, 762, 83]
- **Pass 3 (100s digit)**: → [5, 83, 101, 220, 232, 319, 425, 762, 836, 903] — sorted.
