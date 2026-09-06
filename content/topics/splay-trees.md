---
id: splay-trees
title: "Splay Trees"
category: "Trees"
order: 4
relatedAlgorithmIds: ["splay-insert", "splay-delete"]
---

## Idea

A **self-adjusting** BST (no explicit balance invariant like AVL's balance factor or Red-Black's colors): after **every** insert, search, or delete, the affected node is moved all the way to the **root** via a sequence of rotations called **splaying**. There is no stored balance metadata — the tree rebalances itself purely as a side effect of access patterns, giving frequently-accessed keys fast future access (amortized O(log n) per operation, and O(1) amortized for repeated access to the same key).

## The splay(node) operation

While `node` is not the root, repeatedly apply **one** of three cases, determined by the relative position of `node`, its parent `p`, and (if it exists) its grandparent `g`:

| Case | Condition | Fix |
|---|---|---|
| **Zig** | `node` has **no grandparent** (`p` is the root) | single rotation **around `p`** (rotateLeft or rotateRight depending on which side `node` is on) |
| **Zig-Zig** | `node` and `p` are **both left children**, or **both right children** | rotate **around `g` first**, then **around `p`** |
| **Zig-Zag** | `node` is a left child and `p` a right child, or vice versa (opposite sides) | rotate **around `p` first**, then **around `g`** |

**Zig** happens **at most once per splay** (only in the final step, when the node has climbed to be a direct child of the root). Zig-Zig and Zig-Zag repeat as needed while a grandparent exists — note the **order of rotations differs** between them: Zig-Zig rotates the *farther* node (`g`) first, Zig-Zag rotates the *nearer* node (`p`) first.

```
splay(node):
  while node.parent != null:
    p = node.parent
    g = p.parent
    if g == null:                       // Zig
      rotate(p, rotateLeft = (node == p.right))
    elif (node == p.left) == (p == g.left):   // Zig-Zig: same side
      rotate(g, rotateLeft = (p == g.right))
      rotate(p, rotateLeft = (node == p.right))
    else:                                // Zig-Zag: opposite sides
      rotate(p, rotateLeft = (node == p.right))
      rotate(g, rotateLeft = (node == g.right))
```

## Insert

Insert **exactly like a plain BST insert** (the new node becomes a leaf, found by descending via key comparisons), then call `splay(newNode)` to bring it to the root.

```
insert(T, value):
  w = bstInsert(T, value)   // plain BST insert; w = the new leaf
  splay(w)                  // w becomes the new root
```

## Search / find

Search **exactly like a plain BST search**. Afterward, splay the **last node visited** to the root — this is either the node containing the searched value (if found), or the last real node examined before falling off the tree into a null child (if not found). Splaying happens **whether or not the key was found**.

## Delete

1. `w = find(value)` — this both locates the node (if present) and, as a side effect, **splays the last-visited node to the root**.
2. If `value` was not found (the splayed root doesn't contain it), the tree is left as-is (only the failed search's splay took effect) — nothing more to do.
3. Otherwise the root **is** the node to delete. Remove it, which splits the tree into two subtrees: `L` (the old root's left subtree) and `R` (the old root's right subtree).
4. If `L` is empty, `R` (if any) becomes the new tree.
5. Otherwise: find the **maximum** of `L` (descend rightmost — it has no right child) and `splay` it to become `L`'s new root. Since it was the maximum, it now has **no right child**, so `R` can be attached directly as its right child — this is the new overall root.

```
delete(T, value):
  w = find(T, value)          // splays last-visited node to root regardless of outcome
  if T.root.value != value: return   // not present, nothing further to do
  L, R = T.root.left, T.root.right
  remove T.root
  if L == null: T.root = R
  else:
    w' = max(L)                // rightmost node of L
    splay(w')                  // w' becomes L's root; it has no right child
    w'.right = R
    T.root = w'
```

## Edge cases & invariants

- Splay trees keep **no balance metadata at all** — no heights, no colors, no balance factors. All structure comes purely from rotations triggered by access.
- **Every** operation (including a failed search) triggers a splay — this is what makes the tree "self-adjusting": recently-touched keys end up near the root.
- The order of the two rotations in Zig-Zig (grandparent, then parent) is what distinguishes it from simply doing two independent Zig steps — doing two plain Zigs in a row produces a *different*, less balanced result than a proper Zig-Zig.
- A single `splay` call can touch **every node on the path** from the target to the old root — worst case O(n) for one operation, but the **amortized** cost over a sequence of operations is O(log n) (potential-function argument), which is the standard exam-relevant guarantee.
- Delete's "attach `R` under the max of `L`" step relies on the max of `L` having **no right child** by definition — this is always true and requires no extra check.
- Unlike AVL and Red-Black Trees, splay trees rotate on **every single access**, not just on insert/delete — even a pure lookup restructures the tree.

## Complexity summary

| Operation | Amortized Time |
|---|---|
| Search | O(log n) |
| Insert | O(log n) |
| Delete | O(log n) |
