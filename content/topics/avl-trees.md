---
id: avl-trees
title: "AVL Trees & Heaps"
category: "Trees"
order: 3
relatedAlgorithmIds: ["avl-insert", "avl-delete"]
sourceFiles: ["AuD_AnkiDeck"]
---

## AVL Trees

Another self-balancing BST, using a simpler invariant than Red-Black Trees: for every node, the heights of its left and right subtrees differ by **at most 1** (the "balance factor" ∈ {−1, 0, 1}).

- **Insert/Delete**: insert or delete as in a plain BST, then walk back up from the affected node updating heights and checking the balance factor at each ancestor. If a node becomes unbalanced (factor ±2), apply a rotation (single or double, depending on the case) to restore balance.
- **AVL vs. Red-Black**: AVL trees are more rigidly balanced (height ≤ ~1.44 log n vs. RBT's ≤ 2 log n), so **lookups are slightly faster**, but insertion/deletion can require more rotations to maintain the tighter invariant — Red-Black Trees are generally preferred when writes are frequent (e.g. Linux CFS), AVL trees when reads dominate.

| Operation | Time |
|---|---|
| Search | O(log n) |
| Insert | O(log n) |
| Delete | O(log n) |

## Binary (Max-)Heaps

A complete binary tree (filled left to right, level by level) satisfying the **heap property**: every parent is ≥ its children (max-heap) or ≤ its children (min-heap). Usually stored implicitly in an array (no pointers needed): for a node at index i, children are at `2i+1` and `2i+2`.

- **Insert**: append at the end, then "bubble up" (swap with parent while the heap property is violated). O(log n).
- **Delete-max**: swap root with the last element, remove the last element, then "sift down" (swap with the larger child while violated). O(log n).
- **Build-heap from an array**: sift-down from the last non-leaf up to the root — O(n) total (not O(n log n), by a tighter amortized argument).
- **Heap Sort**: repeatedly delete-max and place at the end of the array. O(n log n), **in-place**, but **not stable**.

Heaps back the **Priority Queue** abstract data type (`insert`, `extract-max`/`extract-min`).

## B-Trees (brief)

A generalization for **disk-backed** search trees: each node holds many keys (not just one) and many children, keeping the tree very shallow (height O(log n) but with a large base) so few disk reads are needed. Insert/search/delete are all O(log n), same asymptotic shape as balanced binary trees, just with a much smaller constant in practice for disk access.
