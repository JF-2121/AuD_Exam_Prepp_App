---
id: hashing-probabilistic
title: "Hashing, Skip Lists & Bloom Filters"
category: "Trees"
order: 4
relatedAlgorithmIds: []
sourceFiles: ["AuD-Zusammenfassung.pdf", "AuD26 Altklausur/Gedächtnisprotokoll"]
---

## Hash Tables

Map keys to array slots via a **hash function** h(k), giving expected **O(1)** insert/search/delete — much faster than a tree's O(log n), at the cost of losing sorted order and worst-case guarantees.

**Collisions** (two keys hashing to the same slot) are unavoidable (pigeonhole principle once n > table size) and handled by:
- **Chaining**: each slot holds a linked list of all keys hashing there. Expected search time O(1 + α) where α = n/m is the **load factor** (n keys, m slots).
- **Open addressing**: on collision, probe a deterministic sequence of alternative slots (linear probing, quadratic probing, double hashing) until an empty one is found. No extra memory for lists, but clustering can degrade performance as α → 1.

A good hash function should distribute keys uniformly and be cheap to compute (**simple uniform hashing** assumption: every key equally likely to hash to any slot, independent of other keys).

## Skip Lists

A **probabilistic** alternative to balanced trees: a linked list with multiple "express lane" levels built by randomly promoting elements to higher levels (each element independently promoted with probability ~½). Search starts at the top level and drops down whenever the next node would overshoot the target.

- **Expected** search/insert/delete: **O(log n)** — matches balanced trees, but achieved through randomization rather than strict invariants/rotations, making the implementation much simpler.
- No worst-case guarantee (an unlucky sequence of coin flips could degrade performance), but the probability of significant degradation is vanishingly small.

## Bloom Filters

A space-efficient **probabilistic set-membership** structure: a bit array of size m plus k independent hash functions. `insert(x)`: set all k hashed bit positions to 1. `contains(x)`: check if all k hashed positions are 1.

- **False positives possible**: contains(x) can wrongly say "yes" (bits were set by other elements' overlapping hashes).
- **False negatives impossible**: if x was actually inserted, all its bits are guaranteed set to 1 — contains(x) always correctly says "yes" for elements that were inserted.
- Cannot delete elements (clearing a bit might break membership for another element that shares it) and cannot enumerate the set's contents — only supports insert and membership-test.
- Used when a fast, memory-cheap "probably in the set" pre-filter is valuable (e.g. before an expensive disk/network lookup).
