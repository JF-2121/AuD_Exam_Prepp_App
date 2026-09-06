---
id: hashing-probabilistic
title: "Hashing, Skip Lists & Bloom Filters"
category: "Trees"
order: 4
relatedAlgorithmIds: []
---

## Hash Tables

Map keys to array slots via a **hash function** h(k), giving expected **O(1)** insert/search/delete — much faster than a tree's O(log n), at the cost of losing sorted order and worst-case guarantees.

**Collisions** (two keys hashing to the same slot) are unavoidable (pigeonhole principle once n > table size) and handled by:
- **Chaining**: each slot holds a linked list of all keys hashing there. Expected search time O(1 + α) where α = n/m is the **load factor** (n keys, m slots).
- **Open addressing**: on collision, probe a deterministic sequence of alternative slots (linear probing, quadratic probing, double hashing) until an empty one is found. No extra memory for lists, but clustering can degrade performance as α → 1.

A good hash function should distribute keys uniformly and be cheap to compute (**simple uniform hashing** assumption: every key equally likely to hash to any slot, independent of other keys).

**How many slots end up empty, on expectation?** For a hash function `h` mapping `n` pairwise-distinct keys uniformly at random into an array of length `a`: let `Yₖ = 1` if slot `k` ends up empty, else `0`. A single fixed key misses slot `k` with probability `1 − 1/a`; since all `n` keys are independent, `P(Yₖ=1) = (1 − 1/a)ⁿ` (every one of the n keys must miss slot k). By linearity of expectation, summing over all `a` slots:

**E[number of empty slots] = a · (1 − 1/a)ⁿ**

— a clean, exam-favorite closed form derived purely from linearity of expectation, no independence between *slots* required (only independence between *keys*).

## Skip Lists

A **probabilistic** alternative to balanced trees: a linked list with multiple "express lane" levels built by randomly promoting elements to higher levels (each element independently promoted with probability ~½). Search starts at the top level and drops down whenever the next node would overshoot the target.

- **Expected** search/insert/delete: **O(log n)** — matches balanced trees, but achieved through randomization rather than strict invariants/rotations, making the implementation much simpler.
- No worst-case guarantee (an unlucky sequence of coin flips could degrade performance), but the probability of significant degradation is vanishingly small.

**Insert mechanics**: insert `x` at the bottom (level 1) level first, exactly like a sorted linked list. Then decide whether to also promote it into higher express-lane levels — with probability `p` (typically ½) per level, checked level by level starting from the lowest express lane, stopping the first time the coin flip fails. In an exam, this randomness is sometimes replaced by a **deterministic function** `P(x, h)` (a stand-in for "the coin flip at level h for value x") — `x` gets promoted into level `h`'s express lane if `P(x,h) ≤ p`. E.g. with `p = 0.5`: inserting a new value first always joins level 1; then check `P(x,2) ≤ 0.5` to decide whether it also joins level 2; if so, check `P(x,3) ≤ 0.5` for level 3; and so on, stopping at the first level whose check fails.

## Bloom Filters

A space-efficient **probabilistic set-membership** structure: a bit array of size m plus k independent hash functions. `insert(x)`: set all k hashed bit positions to 1. `contains(x)`: check if all k hashed positions are 1.

- **False positives possible**: contains(x) can wrongly say "yes" (bits were set by other elements' overlapping hashes).
- **False negatives impossible**: if x was actually inserted, all its bits are guaranteed set to 1 — contains(x) always correctly says "yes" for elements that were inserted.
- Cannot delete elements (clearing a bit might break membership for another element that shares it) and cannot enumerate the set's contents — only supports insert and membership-test.
- Used when a fast, memory-cheap "probably in the set" pre-filter is valuable (e.g. before an expensive disk/network lookup).

**Worked example**: m=12 bits, k=3 hash functions `h1(x)=(6x+x²−2) mod 12`, `h2(x)=x² mod 12`, `h3(x)=(x mod 10 + 3x²) mod 12`. Inserting x=25, 43, 81 sets bits `{5,1,8}`, `{5,1,6}`, `{1,9,4}` respectively — union **{1,4,5,6,8,9}**. Testing x=33: `h1(33)=1, h2(33)=9, h3(33)=6` — all three already set, so the filter reports "present," but 33 was never inserted: a **confirmed false positive**, entirely consistent with the guarantee (false positives are possible, false negatives are not).

**Counting Bloom filters (supporting deletion)**: replace each bit with a small **counter** (e.g. 4 bits, values 0–15). `insert(x)` increments the k hashed counters; `contains(x)` treats any counter `> 0` as "set"; `delete(x)` decrements the k hashed counters. This adds real deletion support (impossible in a classic bit-array Bloom filter) at the cost of `counterSize×` the memory — the "no false negatives" guarantee is preserved, but overflow must be guarded against (a counter maxing out and wrapping would corrupt the structure).
