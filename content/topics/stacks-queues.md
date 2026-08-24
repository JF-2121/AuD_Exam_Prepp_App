---
id: stacks-queues
title: "Stacks & Queues"
category: "Basic Data Structures"
order: 1
relatedAlgorithmIds: []
sourceFiles: ["AuD-Zusammenfassung.pdf", "AuD_AnkiDeck", "AuD26_Sheet04-Sol.pdf", "AuD26_Sheet05-GrpSol.pdf"]
---

## Stack — LIFO (Last In, First Out)

Like a deck of cards: the last card placed on top is the first one removed.

- `push(k)` — add k to the top
- `pop()` — remove and return the top element
- `isEmpty()` — check if empty

Array implementation: keep a `top` index. `push` increments `top` then writes; `pop` reads then decrements. Both **Θ(1)**, but a fixed-size array can overflow — a common fix is to double the array size when full (and halve it when it drops to ¼ full), giving **amortized Θ(1)** push/pop even with resizing.

**Use cases**: function call stack, undo history, expression/syntax parsing.

**A common tracing mistake**: forgetting that `pop` actually removes an element (not just "reads" it) — e.g. on a stack starting empty with array size 6, the sequence `push(2), push(5), pop(), push(7), push(1), pop()` does **not** leave `[2,5,7,1,_,_]` in the array (that trace ignores what the pops actually removed). Tracing it correctly step by step: `push(2)`→`[2,_,_,_,_,_]` top=0; `push(5)`→`[2,5,_,_,_,_]` top=1; `pop()` returns 5 →`[2,_,_,_,_,_]` top=0; `push(7)`→`[2,7,_,_,_,_]` top=1; `push(1)`→`[2,7,1,_,_,_]` top=2; `pop()` returns 1 →`[2,7,_,_,_,_]` top=1. **Correct final state: `[2, 7, _, _, _, _]`, with 7 on top** — every `pop` must actually shrink the logical stack, not just be noted and skipped.

## Queue — FIFO (First In, First Out)

Like a line at a checkout: whoever arrived first is served first.

- `enqueue(k)` — add k to the rear
- `dequeue()` — remove and return the front element

**Array implementation pitfall**: a naive array queue "walks off the end" as front/rear advance. The fix is a **cyclic array (ring buffer)**: wrap indices using the modulo operator, `rear = (rear + 1) mod size`. Both `enqueue`/`dequeue` are **Θ(1)**.

**Linked-list implementation**: keep `front`/`rear` pointers into a singly linked list — `enqueue` appends at `rear`, `dequeue` removes at `front`. Also Θ(1).

**Use cases**: task scheduling, buffering, breadth-first search.

**Deque** (double-ended queue) generalizes both: insertion/removal at *either* end.

**Worked example — tracing a circular array queue** (size 6, lecture convention: `front=0, rear=-1` when empty). Target end state: array `[2, _, _, 5, 6, 7]` (index 0 = 2, indices 1–2 stale/unused, index 3 = 5, index 4 = 6, index 5 = 7) — logically, 5 is the oldest element and 2 is the newest. A minimal operation sequence reaching this state: enqueue 3 dummy values (fills indices 0–2, `rear=2`) → dequeue all 3 (empties the queue but leaves `front=3`) → enqueue 5 (index 3), enqueue 6 (index 4), enqueue 7 (index 5), enqueue 2 (wraps via modulo back to index 0, `rear=0`). The wraparound (`rear = (rear+1) mod size`) is exactly what lets index 0 hold the *newest* element while index 3 holds the *oldest* — a queue's logical front-to-rear order doesn't need to match increasing array-index order once it has wrapped.

## Building one ADT from another

Two directions, both classic exam exercises — implementing a Queue's FIFO behavior using LIFO Stacks, and vice versa.

**Queue from two Stacks** (`S1`, `S2`): `enqueue(x)` always pushes onto `S1`. `dequeue()` always pops from `S2`; if `S2` is empty first, drain all of `S1` onto `S2` (popping each off `S1` and pushing onto `S2`, which **reverses** the order — putting the oldest element on top of `S2`, ready to pop), then pop from `S2`.

```
enqueue(Q, x):  push(S1, x)                          // O(1)
dequeue(Q):
  if isEmpty(S2):
    while not isEmpty(S1): push(S2, pop(S1))          // reverse S1 into S2
  return pop(S2)
```

`new`, `isEmpty`, `enqueue` are all **O(1)**. `dequeue` is **O(n) worst case** per call (the full drain-and-reverse), though **amortized O(1)** over a long sequence of operations (each element is moved from S1 to S2 at most once in its lifetime) — but a single worst-case call can still cost O(n).

**Stack from two Queues** (`Q1`, `Q2`, invariant: one is always empty): `push(x)` enqueues onto whichever queue is currently non-empty (or `Q2` by convention if both are empty). `pop()` dequeues every element **except the last** from the non-empty queue over into the other queue (preserving order), then dequeues and returns that final (most-recently-pushed) element — since a queue can only remove from the front, this is the only way to reach the *last*-pushed element, which is what `pop` needs.

Runtime: `new`, `isEmpty`, `push` are **O(1)**; `pop` is **O(n)** (must shuffle all-but-one element across).

**Design note — why not use auxiliary Queues to implement a Stack's needs directly, or Stacks for a Queue's, without this shuffling?** It comes down to FIFO vs. LIFO: a Stack needs fast access to the *last*-added element, which is exactly what a Stack gives for free (top) but a Queue actively hides (front) — recovering it from a Queue requires unloading everything in front of it. Symmetrically, a Queue needs the *first*-added element, which a Stack buries under everything pushed since — recovering it requires reversing the whole stack. Whichever ADT you're building *from*, you're fighting its natural access order to expose the other ADT's.
