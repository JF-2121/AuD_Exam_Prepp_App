---
id: avl-trees
title: "AVL Trees"
category: "Trees"
order: 3
relatedAlgorithmIds: ["avl-insert", "avl-delete"]
---

## Balance invariant

A self-balancing BST using a simpler invariant than Red-Black Trees: for **every** node, the **balance factor** `bf(x) = height(x.left) − height(x.right)` must satisfy `bf(x) ∈ {−1, 0, 1}`. A node with `|bf| = 2` is unbalanced and must be fixed by rotation. By convention, an empty subtree has height `−1`, so a leaf has height `0`.

This guarantees height ≤ ~1.44·log(n+2), tighter than a Red-Black Tree's ≤ 2·log(n+1) — lookups are slightly faster, at the cost of stricter (more frequent) rebalancing on writes.

## Insert

1. Perform a normal **BST insert** — the new key always becomes a leaf.
2. Walk back up from the new leaf's **parent** to the root. At each ancestor `a`:
   - Recompute `height(a) = 1 + max(height(a.left), height(a.right))`.
   - Recompute `bf(a)`.
   - If `|bf(a)| ≤ 1`, continue climbing.
   - If `|bf(a)| = 2`, apply **exactly one** of the four rotation cases below, then **stop** — insertion into an AVL tree needs **at most one** single or double rotation in total, because that single rotation restores the height that subtree had *before* the insertion.

### The four rotation cases

Let `a` be the first unbalanced ancestor found while climbing from the inserted node.

| Case | Condition | Fix |
|---|---|---|
| **LL** | `bf(a) > 1` and `bf(a.left) ≥ 0` | single **rotateRight(a)** |
| **LR** | `bf(a) > 1` and `bf(a.left) < 0` | **rotateLeft(a.left)**, then **rotateRight(a)** |
| **RR** | `bf(a) < −1` and `bf(a.right) ≤ 0` | single **rotateLeft(a)** |
| **RL** | `bf(a) < −1` and `bf(a.right) > 0` | **rotateRight(a.right)**, then **rotateLeft(a)** |

```
insert(T, value):
  bstInsert(T, value)                 // plain BST insert, becomes a leaf
  for each ancestor a of the new leaf, bottom-up:
    updateHeight(a)
    bf = height(a.left) - height(a.right)
    if bf > 1:                        // left-heavy
      if balanceFactor(a.left) < 0: rotateLeft(a.left)   // LR case
      rotateRight(a)
      break                            // at most one (single/double) rotation needed
    if bf < -1:                       // right-heavy
      if balanceFactor(a.right) > 0: rotateRight(a.right) // RL case
      rotateLeft(a)
      break
```

A single **rotation** is an O(1) local restructuring (rotateLeft/rotateRight, same primitive as BST/Red-Black rotations) that swaps which of two adjacent nodes is "on top" while preserving in-order (BST) ordering; both `height` and `bf` of the two rotated nodes must be recomputed immediately afterward, in that order (child's height first, then the new subtree root's).

## Delete

1. Perform a normal **BST delete** (leaf removal, single-child transplant, or two-children successor-swap — same three cases as a plain BST).
2. Walk back up from the **parent of the physically removed/moved node**, applying the *same* four rotation cases as insert at every unbalanced ancestor.
3. **Key difference from insert: do not stop after the first rotation.** A rotation during delete can *shrink* the height of the subtree it fixes, which can propagate a new imbalance further up — so rebalancing must continue **all the way to the root**, potentially requiring **O(log n)** rotations in the worst case (unlike insert's fixed constant).

```
delete(T, value):
  bstDelete(T, value)                 // plain BST delete (transplant / successor)
  for each ancestor a from the removal point up to the root:
    updateHeight(a)
    bf = height(a.left) - height(a.right)
    if bf > 1:
      if balanceFactor(a.left) < 0: rotateLeft(a.left)    // LR case
      rotateRight(a)                  // no break — keep climbing
    if bf < -1:
      if balanceFactor(a.right) > 0: rotateRight(a.right) // RL case
      rotateLeft(a)
```

## Edge cases & invariants

- Balance factor is checked with **strict inequality** — `bf ∈ {−1, 0, 1}` is valid, `|bf| = 2` is the *only* trigger for rotation; AVL never lets imbalance exceed 2 because it fixes it the instant it appears.
- The LR/RL "double rotation" is really just two single rotations back-to-back around different pivots — no separate rotation primitive is needed, unlike some textbook presentations.
- After **insert**, the rebalanced subtree's height equals its height before the insertion — this is *why* one rotation always suffices.
- After **delete**, the rebalanced subtree's height can *decrease*, which is *why* rebalancing must continue to the root.
- Every AVL tree can be recolored into a valid Red-Black tree (its stricter height bound always fits within the RBT bound), but the reverse is not true.
- Plain BST insert/delete and binary max-heap insert/delete need **no rotation at all**; only AVL and Splay trees rotate on every insert.

## Complexity summary

| Operation | Time |
|---|---|
| Search | O(log n) |
| Insert | O(log n), ≤ 1 rotation |
| Delete | O(log n), up to O(log n) rotations |
