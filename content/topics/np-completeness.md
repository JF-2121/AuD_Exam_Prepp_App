---
id: np-completeness
title: "Complexity Classes & NP-Completeness"
category: "Complexity Theory"
order: 1
relatedAlgorithmIds: []
sourceFiles: ["AuD_AnkiDeck"]
---

## P vs. NP

- **P**: problems **solvable** in polynomial time.
- **NP**: problems whose **solutions can be verified** in polynomial time (finding a solution may or may not be fast — that's exactly the open question "does P = NP?").
- Every problem in P is also in NP (if you can solve it fast, you can trivially verify a given solution fast too), but whether NP ⊆ P is unknown — this is one of the most famous open problems in computer science.

## NP-hard and NP-complete

- **NP-hard**: at least as hard as the hardest problems in NP — every problem in NP can be reduced to it in polynomial time. (NP-hard problems don't have to be in NP themselves.)
- **NP-complete**: in NP **and** NP-hard — these are the "hardest problems in NP." If any single NP-complete problem were shown solvable in polynomial time, then **P = NP** and *every* NP problem would be too (that's the power of a polynomial-time reduction).

## Reductions

To prove a new problem X is NP-complete: (1) show X ∈ NP (a candidate solution can be checked in poly time), and (2) show a known NP-complete problem **reduces to** X in polynomial time (i.e. X is at least as hard). Classic seed problem: **SAT** (Boolean satisfiability) — proven NP-complete directly (Cook-Levin theorem); most other NP-completeness proofs chain back to SAT or another already-proven NP-complete problem.

## Practical takeaway

If a problem is shown NP-complete, don't waste time hunting for a polynomial-time exact algorithm (none is known, and finding one would be a landmark result) — instead reach for **approximation algorithms**, **heuristics/metaheuristics** (e.g. simulated annealing), or exact **exponential-time** algorithms with aggressive pruning (backtracking) for small inputs.
