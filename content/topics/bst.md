---
id: bst
title: "Binary Search Trees"
category: "Trees"
order: 1
relatedAlgorithmIds: ["bst-insert"]
---

## Overview

A Binary Search Tree (BST) is a binary tree where, for every node, all values in the left subtree are smaller
and all values in the right subtree are larger (or equal, by convention). This is placeholder sample content — it
will be replaced with the real course material.

## Insertion

Starting at the root, compare the new value against the current node and recurse left or right until an empty
spot is found, then insert there.

- Average time: O(log n)
- Worst case: O(n) (degenerate/unbalanced tree, e.g. inserting sorted input)
