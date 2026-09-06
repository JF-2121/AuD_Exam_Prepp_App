---
id: bst
title: "Binary Search Trees"
category: "Trees"
order: 1
relatedAlgorithmIds: ["bst-insert", "bst-delete"]
---

## Definition

A BST is a binary tree where every node has a key, and for every node z: everything in z's **left** subtree is `< z.key`, everything in z's **right** subtree is `≥ z.key`. This invariant lets search skip half the remaining tree at every step — *if* the tree is balanced.

## Binary tree terminology (formal)

- Every node has a list of its (at most two, for binary trees) **children**. If node `c` is a child of `p`, then `p` is `c`'s **parent**. Every tree has exactly one node with no parent: the **root**.
- A node with no children is a **leaf**; every other node is an **inner node**.
- A **path** between nodes `a` and `d` is a sequence `(v₀,...,vₙ)` with `v₀=a`, `vₙ=d`, and `vᵢ₊₁` a child of `vᵢ` for every `i`. If such a path exists, it is **unique** (trees have no cycles) — in that case `a` is called an **ancestor** of `d`, and `d` a **descendant** of `a`.
- The **depth** of a node is the length of the path from the root to it (the root itself has depth 0).
- The **subtree** rooted at a node `x` is `x` together with all of its descendants.

## Search & Insert

```
search(x, k)
  IF x == nil OR x.key == k THEN RETURN x
  IF k < x.key THEN RETURN search(x.left, k)
  ELSE RETURN search(x.right, k)

insert(T, z)
  x = T.root; px = nil
  WHILE x != nil DO
    px = x
    x = (z.key < x.key) ? x.left : x.right
  z.parent = px
  IF px == nil THEN T.root = z
  ELSE IF z.key < px.key THEN px.left = z
  ELSE px.right = z
```

Both run in **O(h)** where h is the tree's height — Θ(log n) if balanced, but **Θ(n) in the worst case** (a degenerate tree where every node has only one child, effectively a linked list).

**Worked example**: inserting 50, 30, 15, 80, 20, 60, 90, 70 (in that order) into an empty BST — each key descends via the same `<`/`≥` comparisons as `search`, stopping at the first `nil` child slot:

```
        50
      ┌──┴──┐
     30      80
    ┌─┘    ┌──┴──┐
   15      60    90
     └─┐     └─┐
      20       70
```

A useful cross-check on this shape: **inorder traversal of ANY BST is always sorted** — here, `15, 20, 30, 50, 60, 70, 80, 90`.

### Recognizing a valid search path

A sequence of numbers is a valid BST **search path** (the nodes visited while searching for some value) iff it never violates a bound set by an earlier turn: going **left** at a node fixes an **upper bound** for every subsequent value (they must all be `< ` that node's key); going **right** fixes a **lower bound**. A later value violating the most recently set bound means no BST could have produced that path.

Example: `124, 153, 131, 148, 142, 156` is **not** a valid search path — turning left at 153 (to reach 131) sets an upper bound of 153 for everything after, but the final value 156 breaks it (156 > 153). By contrast, `47, 19, 41, 26, 33, 38` **is** valid: root 47 → left to 19 → right to 41 → right to 26 → right to 33 → right to 38, and every turn respects all bounds set so far.

## Delete

Three cases, using a helper `transplant(u, v)` that replaces the subtree rooted at u with the subtree rooted at v:

1. **Leaf** (no children) — just remove it.
2. **One child** (a "half-leaf") — transplant: the single child takes the deleted node's place directly.
3. **Two children** — find z's **successor** y (the smallest key in z's right subtree, i.e. leftmost node of the right subtree), transplant y into z's position, and give y z's left and right children.

```
delete(T, z)
  IF z.left == nil THEN transplant(T, z, z.right)
  ELSE IF z.right == nil THEN transplant(T, z, z.left)
  ELSE
    y = z.right
    WHILE y.left != nil DO y = y.left      // find successor
    IF y.parent != z THEN
      transplant(T, y, y.right)
      y.right = z.right; y.right.parent = y
    transplant(T, z, y)
    y.left = z.left; y.left.parent = y
```

Also **O(h)**.

**Worked example** (continuing the tree built above): deleting **15**, then **70**, then **80**, in that order:
1. Delete 15 — node 15 has exactly **one child** (20) → **case 2**: 20 replaces 15 directly.
2. Delete 70 — node 70 is a **leaf** → **case 1**: remove it directly.
3. Delete 80 — node 80 has **two children**, and its right child 90 has no left child, so 90 *is* its own successor → **case 3**: 90 replaces 80.

```
        50
      ┌──┴──┐
     30      90
       └─┐    └─┐
        20      60
```

## Traversals

- **Inorder** (left, node, right) — visits keys in ascending sorted order. Used to serialize a BST back into sorted data.
- **Preorder** (node, left, right) — useful for copying a tree (recreate structure top-down).
- **Postorder** (left, right, node) — useful for deleting a tree (free children before the parent).

All three are **Θ(n)** (visit every node once).

**Note**: preorder alone does *not* uniquely determine a tree's shape (a given preorder sequence can come from different trees). But **preorder + inorder together** (with all-unique keys) *do* uniquely reconstruct the tree.

### Reconstructing a BST from postorder alone

Unlike preorder, a BST's **postorder sequence by itself is enough** to reconstruct it uniquely (given the search-tree property to disambiguate left vs. right). Postorder is `(postorder of left subtree) ∥ (postorder of right subtree) ∥ (root)` — so the **last element is always the root**, and the BST property (left subtree keys `<` root `≤` right subtree keys) determines exactly where the split between the left- and right-subtree sequences falls within the rest.

**Worked example**: reconstruct from postorder `27, 36, 30, 44, 41, 45, 39, 21`. Root = last element = **21**. Since 21 has no keys greater than it remaining before it in a valid BST here, everything else forms its right subtree (root **39**, the next-to-find via the same rule recursively): split `27,36,30,44,41,45` into `(27,36,30)` (all `< 39`, left subtree) and `(44,41,45)` (all `> 39`, right subtree). Recursing: `(27,36,30)` → root 30, left leaf 27, right leaf 36. `(44,41,45)` → root 45, left subtree `(44,41)` → root 41 with right child 44.

```
21
  └──┐
     39
   ┌──┴──┐
  30      45
 ┌─┴─┐   ┌─┘
27  36  41
          └─┐
            44
```

### Inorder ALONE is not enough (even with extra structural constraints)

A tempting but **false** claim: "every BST with unique keys and no half-leaves (every inner node has exactly 0 or 2 children) can be uniquely reconstructed from its inorder traversal alone." **Counterexample** — both of these are valid BSTs, unique keys, no half-leaves, and share the identical inorder traversal `15, 20, 30, 50, 60`:

```
     50                20
   ┌──┴──┐            ┌─┴──┐
  20      60          15    50
 ┌─┴─┐                    ┌──┴──┐
15   30                  30      60
```

This 5-node counterexample is also **minimal** — no counterexample exists with fewer nodes: with 0 or 1 nodes reconstruction is trivial; with exactly 2 nodes the root would always be a half-leaf (ruled out by assumption); with exactly 3 nodes, of the 5 possible shapes only one (a root with two leaf children) has no half-leaf, and it's uniquely forced by the sorted inorder values `a,b,c` → root `b`, children `a,c`; with exactly 4 nodes, of the 14 possible shapes only 4 avoid a half-leaf *at the root*, but every one of those 4 still contains a half-leaf somewhere else in the tree. Only at 5 nodes does a genuine ambiguous pair first appear.

## "BST Sort": sorting via insert-then-inorder

You can sort n numbers by inserting them all into an (initially empty) BST, then reading them off via inorder traversal. Runtime depends entirely on the resulting tree's shape:
- **Worst case**: input already sorted → every insert degenerates the tree into a chain (height n), so the i-th insertion costs Θ(i) → total `1+2+...+n = Θ(n²)`.
- **Best case**: the tree stays balanced (height O(log n)) → each insertion costs O(h) = O(log n) → total **O(n log n)**, matching comparison-sort's optimal bound.

This is exactly *why* self-balancing trees (AVL, Red-Black) matter: they guarantee the best-case shape (and hence O(n log n) BST-sort) regardless of input order, instead of leaving it to chance.

## Strict binary trees: the leaf-count formula (proof)

A **strict** (or full) binary tree is one where every node has either 0 or 2 children (no half-leaves anywhere). **Claim: a strict binary tree with n nodes always has exactly `(n+1)/2` leaves.**

*Proof by induction* (only odd n occur, since strict trees always have an odd node count): **Base case** n=1 — a lone root is 1 leaf, and `(1+1)/2 = 1` ✓. **Inductive step**: assume the claim for all strict trees with `≤ n` nodes; consider one with `n+2` nodes. Since `n+2 > 1`, the root has two children, roots of strict subtrees with `n_L` and `n_R` nodes (`n_L + n_R = n+1`, since the root itself is the `+1`). By the inductive hypothesis, the subtrees have `(n_L+1)/2` and `(n_R+1)/2` leaves respectively; the root itself isn't a leaf, so total leaves = `(n_L+1)/2 + (n_R+1)/2 = (n_L+n_R+2)/2 = (n+1+2)/2 = ((n+2)+1)/2` — exactly the claimed formula for the `(n+2)`-node tree. QED.

## Rotations preserve the BST property (proof sketch)

A **rotation** is the O(1) local restructuring primitive behind every self-balancing BST (AVL, Red-Black, Splay). It's worth directly verifying it never breaks the search-tree invariant — shown here for a **Left-Right double rotation** on node `z` (single rotations are the same argument, one layer simpler).

Setup: before the rotation, `x` is the subtree root with left child `α` and right child `y`; `y` has left subtree `β` and right subtree `γ`; `z` (the grandparent) has `x` as one child and subtree `δ` as the other — with key ordering `key(α) ≤ x.key ≤ key(β) ≤ y.key ≤ key(γ) ≤ z.key ≤ key(δ)`. After `DoubleRotateLR(B,z)`: `y` becomes the new subtree root, with `x` (children `α,β`) as its left child and `z` (children `γ,δ`) as its right child.

**Still a valid binary tree**: case-checking every node `v` — outside the rotated subtree (unchanged), `v=x` (children become `α,β`, still 2), `v=y` (children become `x,z`, still 2), `v=z` (children become `γ,δ`, still 2) — every node keeps at most 2 children.

**Still a valid BST**: `v=x` — left subtree `α`, right subtree `β`; since `α ≤ x ≤ β` held before, still valid. `v=z` — left subtree `γ`, right subtree `δ`; `γ ≤ z ≤ δ` held before (both were already on their respective sides of z), still valid. `v=y` — left subtree `{x,α,β}` (all were `≤ y.key` before the rotation) and right subtree `{z,γ,δ}` (all were `≥ y.key` before) — both sides' ordering is preserved. Any `v` inside `α,β,γ,δ` keeps the same relative position to its own descendants, untouched by the rotation. Every case holds, so `B′` is a valid BST. QED — this is the structural fact every rotation-based self-balancing tree algorithm silently relies on.
