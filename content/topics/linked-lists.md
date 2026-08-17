---
id: linked-lists
title: "Linked Lists"
category: "Basic Data Structures"
order: 2
relatedAlgorithmIds: []
sourceFiles: ["AuD-Zusammenfassung.pdf"]
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

## Array vs. Linked List

| | Array | Linked List |
|---|---|---|
| Random access `A[i]` | Θ(1) | Θ(n) |
| Insert/delete at a known position | Θ(n) (must shift) | Θ(1) |
| Memory | contiguous block | scattered, extra pointer overhead |
