---
id: linked-lists
title: "Linked Lists"
category: "Basic Data Structures"
order: 2
relatedAlgorithmIds: []
---

## Structure

A chain of nodes, each holding a value and a pointer to the next node (`nil` for the last node). Unlike an array, a linked list has no fixed size and no contiguous memory block — insertion/removal at a known position is O(1) because there's nothing to shift.

```
search(L, k)              -- Θ(n)
  current = L.head
  WHILE current != nil AND current.key != k DO
    current = current.next
  RETURN current

insert(L, x)               -- Θ(1)  (insert at head)
  x.next = L.head
  x.prev = nil
  IF L.head != nil THEN L.head.prev = x
  L.head = x

delete(L, x)                -- Θ(1) given a pointer to x, Θ(n) to find it first
  IF x.prev != nil THEN x.prev.next = x.next
  ELSE L.head = x.next
  IF x.next != nil THEN x.next.prev = x.prev
```

**Singly vs. doubly linked**: singly linked lists only store `next`, so deleting a node requires walking from the head to find its predecessor (Θ(n)). Doubly linked lists add a `prev` pointer, making delete Θ(1) once you already hold a pointer to the node.

## Sentinels (Wächter)

A **sentinel** is a permanent dummy node used as a fixed head/tail placeholder. It eliminates the need to special-case an empty list or list boundaries in insert/delete — every real node always has a valid `prev`/`next` to link against, even at the ends. Trade-off: mildly more complex initialization for less special-casing everywhere else.

## Worked example: removing duplicates in-place, O(1) extra space

**Problem**: given an unsorted **singly**-linked list of n elements, remove duplicates so every value appears at most once — using no extra memory besides O(1) temporary pointers (no auxiliary lists/sets), non-recursively, in O(n²).

```
RemoveDuplicates(L):
  a = L.head
  while a != nil:
    b = a
    while b.next != nil:
      if b.next.key == a.key:
        b.next = b.next.next        // splice out the duplicate
      else:
        b = b.next
    a = a.next
```

**Idea**: `a` walks the list once as a fixed reference point; for each `a`, a second pointer `b` scans everything after it, splicing out any node whose key matches `a`'s. Because a singly-linked list can't look backward, this "fix each value against everything ahead of it" approach is what makes O(1) extra space possible — no hash set to remember what's been seen.

**Runtime**: O(n²) — worst case (no duplicates present), the inner loop scans `(n-1) + (n-2) + ... + 1 = n(n-1)/2 = Θ(n²)` total nodes.

**Loop invariant** (outer while-loop): *before the i-th outer iteration, the sublist from the head up to (and including) `a` contains no duplicates, and every occurrence of an already-visited node's key has been removed from the rest of the list.* Initialization: before the first iteration `a` is the head, a single-element sublist is trivially duplicate-free. Maintenance: the inner loop fixes `a` and removes every later node sharing its key, so when `a` advances, the (now one-longer) duplicate-free prefix invariant still holds. Termination: when `a` reaches `nil`, every node has served as the reference point and had its duplicates purged — the final list contains only unique values.

## Array vs. Linked List

| | Array | Linked List |
|---|---|---|
| Random access `A[i]` | Θ(1) | Θ(n) |
| Insert/delete at a known position | Θ(n) (must shift) | Θ(1) |
| Memory | contiguous block | scattered, extra pointer overhead |
