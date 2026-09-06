---
id: b-trees
title: "B-Trees"
category: "Trees"
order: 6
relatedAlgorithmIds: ["btree-insert", "btree-delete"]
---

## Definition

A B-Tree of **minimum degree** `t` (t ≥ 2) is a generalization of a BST for **disk-backed** storage: each node holds many keys and many children, keeping the tree very shallow so few disk reads are needed. Every node except the root must satisfy:

- **At least `t − 1`** keys, **at most `2t − 1`** keys.
- A node with `k` keys has exactly **`k + 1` children** (0 children ⟺ it's a **leaf**).
- The root may have as few as **1** key (or 0, only if the whole tree is empty).
- **All leaves lie at the same depth** — a B-Tree is always perfectly height-balanced.
- Keys within a node are stored **sorted**, and the search-tree property holds across the `k + 1` children exactly as in a BST generalized to `k` keys: the subtree between key `i` and key `i+1` contains only values between them.

A node with `2t − 1` keys is called **full** — it cannot accept another key without splitting first.

## Insert — "preemptive split on the way down"

The key idea that keeps B-Tree insert to a **single top-to-bottom pass** (no backtracking): **before ever descending into a child, check whether that child is full — if so, split it first.**

```
insert(T, key):
  if T.root is full:
    split the root (root gets one key, height grows by 1, new root has 2 children)
  x = T.root
  while x is not a leaf:
    find the child c of x that key must descend into
    if c is full:
      splitChild(x, c)             // promotes c's median key into x, c splits into 2 children of x
      if key > x's newly promoted key: c = the new right sibling
    x = c
  insert key into x at the correct sorted position   // x is guaranteed non-full here, and a leaf
```

**Splitting a full node `c` (2t − 1 keys) with parent `x`:**
1. The **median key** (the `t`-th key of `c`) moves **up** into `x`, at the correct sorted position among `x`'s existing keys.
2. `c`'s remaining `2t − 2` keys divide evenly: the smaller `t − 1` keys stay in the original node (now `x`'s left child at that position), the larger `t − 1` keys move into a **brand-new node** (`x`'s new right child, inserted immediately after the original).
3. If `c` was not a leaf, its `2t` children split evenly too: the first `t` stay with the left half, the last `t` go to the new right node.

Because the check-and-split-before-descending happens at **every level on the way down**, the node the algorithm finally reaches to insert into is *guaranteed* non-full — no split is ever needed on the way back up, and the whole insert is one downward pass: **O(t·log_t n)** (O(log_t n) levels, O(t) work per node to find the position / shift keys).

**Root special case**: only the root can be split *without* a parent to absorb its median key — when this happens, a brand-new root is created holding just that one median key, with the two halves as its two children. This is the **only** way a B-Tree's height increases, and it always happens at the root.

## Delete

Deletion is more involved because the algorithm must guarantee, at every step, that it never descends into (or removes a key from) a node with only `t − 1` keys — the minimum — since removing one more would violate the invariant. Three cases, checked in order:

**1. Key `k` is in node `x` and `x` is a leaf** — since the descent has already guaranteed (see case 3) that every node visited has ≥ `t` keys before recursing into it, `x` has enough keys to spare; simply **remove `k` directly**.

**2. Key `k` is in node `x` and `x` is internal:**
- **2a.** If the child **before** `k` (`y`) has **≥ t** keys: find `k`'s **predecessor** `k'` (the maximum key in the subtree rooted at `y`, reached by descending rightmost), replace `k` with `k'` in `x`, then recursively delete `k'` from `y`.
- **2b.** Else, if the child **after** `k` (`z`) has **≥ t** keys: symmetric — use the **successor** (minimum of `z`'s subtree, descend leftmost), replace, recursively delete from `z`.
- **2c.** Else (**both** `y` and `z` have exactly `t − 1` keys): **merge** `y`, `k`, and `z` into a single node of `2t − 1` keys (`y`'s keys, then `k`, then `z`'s keys — `x` loses `k` and its child pointer to `z`), then recursively delete `k` from this merged node (now case 1 or a further case-3 descent).

**3. Key `k` is not in the current node `x`** (an internal, non-leaf node) — the algorithm must descend into the appropriate child `c`, but **first guarantees `c` has ≥ `t` keys**, exactly like insert's preemptive split:
- **3a. Borrow (rotate) from a sibling**: if an immediate left or right sibling of `c` has **≥ t** keys, move the separating key from `x` down into `c` (at the near end), and move the sibling's adjacent extreme key up into `x` in its place (the sibling's matching child pointer, if any, moves along with it into `c`).
- **3b. Merge**: if **neither** sibling has ≥ `t` keys (both have exactly `t − 1`), **merge `c` with one sibling and the separating key from `x`** into a single node of `2t − 1` keys — exactly as in case 2c, just triggered while searching rather than while deleting an internal key.
- Then descend into (the now ≥ `t`-key) `c` and recurse.

**Root shrinking**: if case 3b's merge involves the root's *only* remaining key (the root had exactly 1 key and both its children had `t − 1` keys), the merged node **becomes the new root**, and the tree's height decreases by one — the only way a B-Tree shrinks.

```
delete(T, key):
  x = T.root
  while true:
    if key is in x:
      if x is a leaf: remove key from x; return
      elif child-before-key has >= t keys: k' = predecessor(key); replace key with k'; x = child-before; key = k'
      elif child-after-key has >= t keys: k' = successor(key); replace key with k'; x = child-after; key = k'
      else: merge(child-before, key, child-after); x = merged node; continue with key
    else:
      c = the child x must descend into to find key
      if c has t - 1 keys:
        if a sibling of c has >= t keys: borrow through x (rotation)
        else: merge c with a sibling and the separating key from x
      x = c   // now guaranteed >= t keys
```

## Edge cases & invariants

- Every node except the root always has between `t − 1` and `2t − 1` keys — the delete algorithm's entire complexity comes from preserving this lower bound *before* descending or removing, symmetric to how insert preserves the upper bound *before* descending.
- A node with `k` keys must have exactly `k + 1` children — a mismatch (e.g. `k` keys but `k` children) makes a tree structurally invalid even if keys are sorted.
- Keys **within** a node must be sorted ascending — an unsorted node is invalid even if every other property holds.
- All leaves must be at the **same depth** — this is what makes a B-Tree height-balanced by construction, not by a rebalancing invariant like AVL's balance factor.
- With `t = 2` (the smallest legal degree), a B-Tree is sometimes called a **2-3-4 tree** (2, 3, or 4 children per node) and is structurally equivalent to a Red-Black Tree.
- Insert only ever grows height at the **root** (via a root split); delete only ever shrinks height at the **root** (via a root merge) — internal nodes never change depth.

## Complexity summary

For `n` keys and minimum degree `t` (tree height is `O(log_t n)`):

| Operation | Time |
|---|---|
| Search | O(t · log_t n) |
| Insert | O(t · log_t n) |
| Delete | O(t · log_t n) |
