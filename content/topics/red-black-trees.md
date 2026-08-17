---
id: red-black-trees
title: "Red-Black Trees"
category: "Trees"
order: 2
relatedAlgorithmIds: ["rbt-insert", "rbt-delete"]
sourceFiles: ["AuD-Zusammenfassung.pdf", "AuD26 Maxine RBT Delete"]
---

## Why

A plain BST can degenerate to height n (e.g. inserting sorted input). A Red-Black Tree is a BST with extra rules that **guarantee height ≤ 2·log(n+1)**, keeping search/insert/delete at Θ(log n) even in the worst case.

## The four rules

1. Every node is **red** or **black**.
2. The **root is black**.
3. A **red node never has a red child** (no two reds in a row on any path).
4. Every path from a node to any of its descendant `nil` leaves passes through the **same number of black nodes** (its "black-height").

⟹ Consequence of rule 4: if a node has only one real child, that child *must* be red (otherwise the missing side would have fewer black nodes).

Implementations typically use a single shared **sentinel** node (`T.nil`, colored black) instead of real `nil` pointers, so every node always has non-null `left`/`right`/`parent` references — this removes almost all null-checking special cases from the algorithms.

## Insert

Insert exactly like a normal BST, color the new node **red**, then call a **fixup** routine to repair any rule-3 violation (red node with a red parent) by walking up the tree applying **recoloring** and **rotations** — at most 2 rotations are ever needed to fully fix an insertion. Overall: **Θ(log n)**.

**Rotation** is the core rebalancing primitive: a local, O(1) restructuring that changes which of two nodes is "on top" while preserving the BST ordering property.

## Delete

Delete like a normal BST (using transplant + successor, same as plain BST delete), but if the removed or moved node was black, a "double black" deficiency can appear that violates rule 4. A **delete-fixup** routine resolves this by walking up the tree, examining the sibling's color and its children's colors, and applying one of four standard cases (recoloring, or a rotation followed by recoloring) until the deficiency is absorbed or reaches the root. Also **Θ(log n)**.

## Complexity summary

| Operation | Time |
|---|---|
| Search | Θ(log n) |
| Insert | Θ(log n) |
| Delete | Θ(log n) |

**Real-world use**: Linux's Completely Fair Scheduler (CFS) uses a Red-Black Tree to keep runnable processes ordered by virtual runtime.
