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

To prove a new problem X is NP-complete: (1) show X ∈ NP (a candidate solution can be checked in poly time), and (2) show a known NP-complete problem **reduces to** X in polynomial time (i.e. X is at least as hard: `L_A ≤ L_B` means a poly-time algorithm for B would give one for A too, via the reduction). Classic seed problem: **SAT** (Boolean satisfiability) — proven NP-complete directly (Cook-Levin theorem, by encoding a verifier's computation as a boolean formula); every other NP-completeness proof chains back to SAT or another already-proven NP-complete problem.

**A worked reduction chain**: SAT ≤ 3SAT (rewrite any clause into an equivalent set of 3-literal clauses) ≤ 3-Coloring (build a gadget graph where a valid 3-coloring corresponds exactly to a satisfying assignment) — and separately, Hamiltonian-Cycle ≤ TSP (a Hamiltonian cycle exists iff the corresponding TSP instance, with weight 0 on real edges and 1 on the rest, has a tour of total weight 0). "One for all, all for one": once *any* known-NP-complete problem reduces to X, X is automatically NP-hard too — you never have to re-derive hardness from scratch.

## Classic NP-complete problems

SAT, 3SAT, 3-Coloring, Hamiltonian Cycle, **TSP** (Traveling Salesperson — find a minimum-weight tour visiting every vertex exactly once), Vertex Cover, Independent Set, Knapsack (the decision version). Recognizing that a new problem resembles one of these is usually the fastest way to guess whether it's NP-complete before attempting a proof.

## Practical takeaway

If a problem is shown NP-complete, don't waste time hunting for a polynomial-time exact algorithm (none is known, and finding one would be a landmark result — it would imply P = NP) — instead reach for:
- **Approximation algorithms** — e.g. for 3SAT, randomly assigning each variable true/false independently satisfies an *expected* ≥½ of all clauses in one pass, a cheap and useful guarantee.
- **Heuristics/metaheuristics** (e.g. simulated annealing) for good-enough solutions fast.
- Exact **exponential-time** algorithms with aggressive pruning (backtracking) — fine for small inputs.
