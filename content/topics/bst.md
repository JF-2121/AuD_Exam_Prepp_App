---
id: bst
title: "Binary Search Trees"
category: "Trees"
order: 1
relatedAlgorithmIds: ["bst-insert", "bst-delete"]
sourceFiles: ["AuD-Zusammenfassung.pdf"]
---

## Definition

A BST is a binary tree where every node has a key, and for every node z: everything in z's **left** subtree is `< z.key`, everything in z's **right** subtree is `≥ z.key`. This invariant lets search skip half the remaining tree at every step — *if* the tree is balanced.

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

## Traversals

- **Inorder** (left, node, right) — visits keys in ascending sorted order. Used to serialize a BST back into sorted data.
- **Preorder** (node, left, right) — useful for copying a tree (recreate structure top-down).
- **Postorder** (left, right, node) — useful for deleting a tree (free children before the parent).

All three are **Θ(n)** (visit every node once).

**Note**: preorder alone does *not* uniquely determine a tree's shape (a given preorder sequence can come from different trees). But **preorder + inorder together** (with all-unique keys) *do* uniquely reconstruct the tree.
