---
id: np-completeness
title: "Complexity Classes & NP-Completeness"
category: "Complexity Theory"
order: 1
relatedAlgorithmIds: []
---

## Decision problems and P vs. NP

A **decision problem** always expects a **0/1-answer** ("yes"/"no"); every computation problem can be reformulated as one. A decision problem `L` belongs to:

- **P**: there exists an algorithm that solves `L` **deterministically in polynomial (worst-case) time**.
- **NP**: it is *unclear* whether `L` can be solved efficiently — but a proposed **solution can be verified** in polynomial time given a "certificate" (a candidate answer/witness).
- **P ⊆ NP** always holds: any problem solvable in polynomial time can also trivially be *verified* in polynomial time (just solve it yourself, ignoring the given certificate). Whether **NP ⊆ P** — i.e. whether **P = NP** — is one of the open **Millennium Problems**.

## NP-hard and NP-complete

To formally compare the relative difficulty of problems, this course uses **polynomial-time reduction**: `L1 ≤P L2` means there is a polynomial-time-computable function `f` such that `x ∈ L1 ⟺ f(x) ∈ L2` — solving `L2` (even as a black box) gives you a solver for `L1` "for free" via `f`. This is exactly the course's `L1 ≤ L2` notation.

- A problem `L_C` is **NP-hard** if every problem in NP reduces to it in polynomial time (`∀ L ∈ NP: L ≤P L_C`). NP-hard problems don't need to be in NP themselves.
- A problem is **NP-complete** if it is both **NP-hard** *and* **in NP** — the "hardest problems in NP." If any single NP-complete problem were solved in polynomial time, **every** problem in NP would be too (P = NP) — that's the power of reduction.
- **SAT** (Boolean satisfiability) is the canonical NP-complete problem, proven directly (Cook-Levin theorem, by encoding a verifier's entire computation as a boolean formula) — every other NP-completeness proof chains back to SAT (or another already-proven NP-complete problem) via reduction. Its restricted variant **3SAT** (clauses of exactly 3 literals) is also NP-complete; the further-restricted **2SAT** is, perhaps surprisingly, **in P** (solvable via implication graphs + strongly connected components).

## Four standard proof techniques (worked examples)

**(a) Reductions preserve complements**: if `L1 ≤P L2`, then `L1̄ ≤P L2̄` too. *Proof*: `L1 ≤P L2` gives a poly-time function `f` with `x ∈ L1 ⟺ f(x) ∈ L2`. Negating both sides of a logical equivalence preserves it: `x ∉ L1 ⟺ f(x) ∉ L2`, i.e. `x ∈ L1̄ ⟺ f(x) ∈ L2̄`. Since `f` itself is unchanged (still poly-time computable), this *is* a valid reduction `L1̄ ≤P L2̄` — no new construction needed, just relabeling.

**(b) One efficiently-solvable NP-complete problem collapses P and NP**: if `L` is NP-complete and `L ∈ P`, then **P = NP**. *Proof*: take any `L' ∈ NP`. By NP-completeness of `L`, `L' ≤P L`. Since `L ∈ P`, chain the poly-time reduction with `L`'s poly-time solver: this gives a poly-time solver for `L'` too. So every `L' ∈ NP` is also in P — i.e. NP ⊆ P, and combined with the always-true P ⊆ NP, this means P = NP.

**(c) The contrapositive**: if some problem in NP is *not* solvable in polynomial time, then *no* NP-complete problem is solvable in polynomial time. This is exactly the logical contrapositive of (b) — if any single NP-complete problem being in P would force P = NP (making every NP problem solvable in poly time), then the existence of even one NP problem that *isn't* poly-time solvable rules out any NP-complete problem being in P.

**(d) `≤P` is transitive**: if `L1 ≤P L2` (via reduction function `f1`) and `L2 ≤P L3` (via `f2`), then `L1 ≤P L3`. *Proof*: define `f3 = f2 ∘ f1` (compose the two reductions). `f3` is still poly-time computable (composing two poly-time functions is poly-time), and `x ∈ L1 ⟺ f1(x) ∈ L2 ⟺ f2(f1(x)) ∈ L3 ⟺ f3(x) ∈ L3`. This transitivity is *why* "one for all, all for one" works: once **any** known-NP-complete problem reduces to a new problem `X`, `X` is automatically NP-hard too — no need to re-derive hardness from SAT directly every time.

## Classic problem pairs: superficially similar, wildly different difficulty

A recurring exam pattern: two problems that *look* structurally alike, where one is polynomial and the other is NP-complete.

| Pair | Polynomial-time member | NP-complete member | Why the gap |
|---|---|---|---|
| Path length | **Shortest** simple path — Dijkstra/Bellman-Ford, O(VE) | **Longest** simple path | Shortest-path has optimal substructure exploitable by DP/greedy; longest-path must avoid revisiting nodes (a *simple* path), which forces reasoning about exponentially many possible node subsets — no such substructure survives |
| Boolean satisfiability | **2-SAT** — in P via implication graphs + SCCs | **3-SAT** | 2-literal clauses only encode pairwise implications, decidable by a graph-connectivity check; 3-literal clauses interlink variables in a way that resists any such local/graph-based shortcut |
| Graph coloring | **2-colorability** (≡ bipartiteness) — in P via BFS/DFS, O(V+E) | **3-colorability** | Coloring a vertex with 2 colors available forces its neighbors' colors deterministically (no real choice); with 3 colors, each neighbor keeps 2 open options after a vertex is colored, creating a genuine branching search tree that is exponential in the worst case |

`3-Coloring` is one of Karp's original 21 NP-complete problems (1972); `Hamiltonian Cycle`, `Vertex Cover`, `Independent Set`, and the decision version of `Knapsack` round out this course's most commonly cited examples, alongside **TSP** (Traveling Salesperson — minimum-weight tour visiting every vertex exactly once).

## Worked example: the Hamiltonian Path problem

**HAM-PATH := {G : a path exists in G visiting every vertex exactly once}.**

**Proving HAM-PATH ∈ NP**: exhibit a polynomial-time *verifier* that, given `G` and a candidate vertex sequence `p = (v_1, …, v_n)` as a certificate, checks all of:
1. `p` has the correct number of vertices (`n = |G.V|`) — O(V).
2. every `v_i` is actually a vertex of `G` — O(V).
3. every consecutive pair `(v_i, v_{i+1})` is an edge of `G` — O(V).
4. all vertices in `p` are distinct (no repeats) — O(V²) worst case, checking all pairs.

These four conditions **are** exactly the definition of a Hamiltonian path, so the verifier accepts iff `p` truly is one. Total verification time O(V²) — polynomial — so **HAM-PATH ∈ NP**. (This is the standard template for proving membership in NP: name the certificate, then bound the verifier's runtime.)

**Special case solvable in polynomial time**: for a **directed acyclic graph**, Hamiltonian path *can* be decided efficiently — topologically sort `G` in O(V+E); a Hamiltonian path exists iff **every consecutive pair in the topological order is an edge** (check all `n-1` consecutive pairs, O(V) more). Why this works: in a DAG, any Hamiltonian path *must* respect the topological order (a path can't jump backward against the edges' direction without revisiting), so the topological order is the *only* candidate — and it's unique whenever a Hamiltonian path exists. This doesn't contradict the general NP-completeness of Hamiltonian Path — DAGs are a structurally restricted special case where the exponential search space collapses to exactly one candidate.

A natural variant, **BOUND-HAM-PATH := {⟨G, v, w⟩ : a Hamiltonian path from v to w exists}**, is handled identically: add a 5th verifier condition checking the path's first/last vertices match `v`/`w` (still NP), and adapt the DAG algorithm by checking the constructed topological-order path actually starts at `v` and ends at `w`.

## Practical takeaway

If a problem is shown NP-complete, don't waste time hunting for a polynomial-time exact algorithm (none is known, and finding one would be a landmark result — it would imply P = NP) — instead reach for:
- **Approximation algorithms** — e.g. for 3SAT, randomly assigning each variable true/false independently satisfies an *expected* ≥½ of all clauses in one pass, a cheap and useful guarantee.
- **Heuristics/metaheuristics** (e.g. simulated annealing) for good-enough solutions fast.
- Exact **exponential-time** algorithms with aggressive pruning (backtracking) — fine for small inputs.
- Check whether your specific instance falls into a **polynomial special case** (like Hamiltonian Path restricted to DAGs) even though the general problem is NP-complete.
