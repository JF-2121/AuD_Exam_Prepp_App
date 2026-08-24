---
id: heaps
title: "Binary Heaps & Priority Queues"
category: "Trees"
order: 5
relatedAlgorithmIds: ["heap-insert", "heap-delete"]
sourceFiles: ["AuD26_Sheet07-GrpSol.pdf"]
---

## Definition

A binary **max-heap** is a **complete binary tree** (every level fully filled left to right, except possibly the last) satisfying the **heap property**: every node's key is **≥** both of its children's keys (a **min-heap** flips the inequality). Note that a heap is **not** a search tree — there is no left-vs-right ordering, only parent-vs-child, so the maximum is always at the root but the second-largest could be anywhere on the top two levels.

Stored **implicitly** in an array `A` (no pointers): for a 0-indexed node at position `i`,
- parent is at `⌊(i−1)/2⌋`
- left child is at `2i+1`, right child is at `2i+2`

## Insert(H, k)

```
insert(H, k):
  append(H, k)              // place k at the last free slot
  i = H.size - 1
  while i > 0 and H[parent(i)] < H[i]:
    swap(H[parent(i)], H[i])
    i = parent(i)
```

**Sift-up (bubble-up)**: append the new key at the end (the only position that keeps the tree complete), then repeatedly compare it against its **parent** and swap upward while it violates the heap property. Terminates as soon as the parent is ≥, or the root is reached. At most `h ≤ ⌈log n⌉` comparisons.

A tempting shortcut — `append(H, k)` followed by re-running full `BuildHeap(H.A)` — is **correct but wasteful**: it re-checks/re-heapifies roughly the whole array (`⌈(n−1)/2⌉` node checks) to fix what a single sift-up path (`≤ log n` checks) already handles.

## Delete-max / extract-max

```
extractMax(H):
  max = H[0]
  H[0] = H[H.size - 1]      // move last element to the root
  removeLast(H)
  heapify(H, 0)              // sift-down from the root
  return max
```

**Sift-down (heapify)**: compare the (new) root against both children; if either child is larger, swap with the **larger** of the two children (never the smaller — swapping with the smaller child would not fix that side) and recurse into that subtree. Terminates when the node is ≥ both children, or a leaf is reached.

```
heapify(H, i):
  l, r = 2i+1, 2i+2
  largest = i
  if l < H.size and H[l] > H[largest]: largest = l
  if r < H.size and H[r] > H[largest]: largest = r
  if largest != i:
    swap(H[i], H[largest])
    heapify(H, largest)
```

## BuildHeap — why bottom-up, and only the first half

```
buildHeap(A):
  for i = ⌊(A.length - 1) / 2⌋ downto 0:
    heapify(A, i)
```

- **Only the first half of the array** needs a `heapify` call: by definition of "complete tree", roughly the last `⌈n/2⌉` indices are **leaves** (no children to violate the property against), so calling `heapify` on them would be a guaranteed no-op.
- **Must proceed bottom-up** (highest index down to 0), *not* top-down (ascending index), because `heapify(A, i)` is only correct if both of `i`'s children are **already valid heaps**. Counter-example: the tree `3 → (2 → 4, 5), 1 → (6, 7)` — if `heapify` is called top-down starting at the root (3, already the max, so no swap happens there), then on its children (2 and 1, each swapped down into their larger child), the larger values 4/5/6/7 that started two levels down can never bubble all the way up past the second level, because the root is never revisited. Working bottom-up guarantees every subtree `heapify` touches is already heap-valid, so its own single top-level fix is sufficient.
- Despite looking like `O(n log n)` (n/2 calls × O(log n) each), a tighter amortized analysis shows `BuildHeap` runs in **Θ(n)**: most of the n/2 calls happen near the leaves, where a sift-down only has 1–2 levels to travel.

## Heap Sort

```
heapSort(A):
  buildHeap(A)                       // Θ(n)
  for end = A.length - 1 downto 1:
    swap(A[0], A[end])               // move current max to its sorted position
    heapify(A, 0, end)                // sift-down within A[0 .. end-1]
```

Repeatedly extract the max (swap root with the last unsorted element, shrink the heap by one, sift-down the new root) and place it at the end of the shrinking array. **Θ(n log n)**, **in-place** (O(1) extra space), but **not stable** (equal keys can be reordered by the swaps).

## Edge cases & invariants

- The heap property only compares a node to its **direct children**, never across subtrees — the third-largest element is *not* guaranteed to be at depth 2; it only has to be somewhere that doesn't violate parent ≥ child locally.
- A sorted array (ascending) does **not** satisfy the max-heap property in general (e.g. `[13,4,25,4,32,...]` fails immediately since it's not even monotonic in tree-order) — do not confuse "heap" with "sorted".
- Heaps back the **priority queue** ADT: `insert`, `extract-max`/`extract-min`, both O(log n); `peek`-max is O(1).
- Neither `insert` nor `extract-max`/`extract-min` ever performs a **rotation** — only element swaps along a single root-to-leaf (or leaf-to-root) path.

## Complexity summary

| Operation | Time |
|---|---|
| Peek max | O(1) |
| Insert | O(log n) |
| Extract-max | O(log n) |
| Build-heap from array | Θ(n) |
| Heap Sort | Θ(n log n) |
