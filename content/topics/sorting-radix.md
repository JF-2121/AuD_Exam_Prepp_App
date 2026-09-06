---
id: sorting-radix
title: "Radix Sort (Non-Comparison Sorting)"
category: "Sorting"
order: 5
relatedAlgorithmIds: ["radix-sort"]
sourceFiles: ["AuD-Zusammenfassung.pdf", "AuD26_Sheet04-Sol.pdf"]
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

## Choosing the bit-grouping r (general b-bit-number analysis)

Generalizing to sorting `n` numbers of `b` bits each, grouped into digits of `r ≤ b` bits at a time: each number then has `d = ⌈b/r⌉` digits, each ranging over `D = 2ʳ` values, so each of the `d` passes costs `O(n + 2ʳ)`. **Total: `O((b/r)·(n + 2ʳ))`.**

- **If `b ≤ log n`**: the optimal choice is `r = b` — a single digit covering the whole number, giving `O(n + 2ᵇ) = O(n)` (since `2ᵇ ≤ 2^(log n) = n`).
- **If `b > log n`**: the optimal choice is `r = log n`, giving `O((b/log n)·(n+n)) = O(bn/log n)` — increasing `r` beyond this makes the `2ʳ` bucket-count term dominate; decreasing it makes the `b/r` pass-count term dominate. The two terms trade off exactly at `r = log n`.

**Is Radix Sort always faster than QuickSort in practice?** Not necessarily — asymptotically `O(n)` beats `O(n log n)`, but asymptotic notation hides constant factors, and Radix Sort's per-pass bucket bookkeeping can carry a larger constant. Radix Sort is also **not in-place** (needs `O(n+D)` extra memory for buckets), unlike in-place comparison sorts — so the "always faster" intuition doesn't hold universally.

## Correctness requires a stable per-digit sort

RadixSort's correctness is **only guaranteed if each digit-pass is itself stable**. Sorting digit-by-digit relies on a lower digit's relative order **surviving** every higher-digit pass — an unstable per-digit sort (e.g. using LIFO stacks instead of FIFO queues for buckets) would reverse relative order and silently produce a wrong result, even though each individual pass "looks" locally sorted.

## Worked example: octal numbers 54₈, 24₈, 71₈, 10₈, 52₈, 77₈, 33₈ (r=3, base 8, LSD first)

**Pass 0** (least-significant octal digit): bucket by last digit → bucket 0: `10₈`; bucket 1: `71₈`; bucket 2: `52₈`; bucket 3: `33₈`; bucket 4: `54₈, 24₈`; bucket 7: `77₈`. Collected: `10₈ 71₈ 52₈ 33₈ 54₈ 24₈ 77₈`.

**Pass 1** (most-significant octal digit, on the pass-0 result): bucket by leading digit → bucket 1: `10₈`; bucket 2: `24₈`; bucket 3: `33₈`; bucket 5: `52₈, 54₈`; bucket 7: `71₈, 77₈`. Collected (final): **`10₈ 24₈ 33₈ 52₈ 54₈ 71₈ 77₈`** — sorted.

## Worked example: [232, 836, 101, 903, 220, 425, 762, 83, 5, 319]

- **Pass 1 (1s digit)**: → [220, 101, 232, 762, 903, 83, 425, 5, 836, 319]
- **Pass 2 (10s digit)**: → [101, 903, 5, 319, 220, 425, 836, 232, 762, 83]
- **Pass 3 (100s digit)**: → [5, 83, 101, 220, 232, 319, 425, 762, 836, 903] — sorted.
