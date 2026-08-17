---
id: stacks-queues
title: "Stacks & Queues"
category: "Basic Data Structures"
order: 1
relatedAlgorithmIds: []
sourceFiles: ["AuD-Zusammenfassung.pdf", "AuD_AnkiDeck"]
---

## Stack — LIFO (Last In, First Out)

Like a deck of cards: the last card placed on top is the first one removed.

- `push(k)` — add k to the top
- `pop()` — remove and return the top element
- `isEmpty()` — check if empty

Array implementation: keep a `top` index. `push` increments `top` then writes; `pop` reads then decrements. Both **Θ(1)**, but a fixed-size array can overflow — a common fix is to double the array size when full (and halve it when it drops to ¼ full), giving **amortized Θ(1)** push/pop even with resizing.

**Use cases**: function call stack, undo history, expression/syntax parsing.

## Queue — FIFO (First In, First Out)

Like a line at a checkout: whoever arrived first is served first.

- `enqueue(k)` — add k to the rear
- `dequeue()` — remove and return the front element

**Array implementation pitfall**: a naive array queue "walks off the end" as front/rear advance. The fix is a **cyclic array (ring buffer)**: wrap indices using the modulo operator, `rear = (rear + 1) mod size`. Both `enqueue`/`dequeue` are **Θ(1)**.

**Linked-list implementation**: keep `front`/`rear` pointers into a singly linked list — `enqueue` appends at `rear`, `dequeue` removes at `front`. Also Θ(1).

**Use cases**: task scheduling, buffering, breadth-first search.

**Deque** (double-ended queue) generalizes both: insertion/removal at *either* end.
