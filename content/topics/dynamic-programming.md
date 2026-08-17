---
id: dynamic-programming
title: "Dynamic Programming, Backtracking & Greedy"
category: "Advanced Design"
order: 1
relatedAlgorithmIds: []
sourceFiles: ["AuD_AnkiDeck"]
---

## Dynamic Programming (DP)

Like Divide & Conquer, DP breaks a problem into subproblems — but DP's subproblems **overlap** (the same subproblem recurs many times), so DP **memoizes**: store each subproblem's solution the first time it's computed, and look it up instead of recomputing.

Two equivalent styles:
- **Top-down (memoization)**: write the natural recursion, but cache results in a table keyed by subproblem parameters.
- **Bottom-up (tabulation)**: identify the order subproblems depend on each other, and fill a table iteratively starting from the base cases.

**When is DP applicable?** The problem needs both:
1. **Optimal substructure** — an optimal solution is built from optimal solutions to subproblems.
2. **Overlapping subproblems** — the same subproblem is needed multiple times (this is what distinguishes DP from plain Divide & Conquer, e.g. Merge Sort has optimal substructure but *no* overlapping subproblems, so memoizing it gains nothing).

Classic examples: Fibonacci (naive recursion is Θ(2ⁿ); memoized is Θ(n)), longest common subsequence, knapsack, edit distance.

## Backtracking

Systematically explores all candidate solutions by building them incrementally, **abandoning ("pruning") a partial candidate as soon as it can't possibly lead to a valid solution** — this pruning is what makes backtracking far faster than brute-force enumeration in practice, even though its worst case remains exponential. Classic examples: N-Queens, Sudoku solving, subset-sum enumeration.

## Greedy Algorithms

Build a solution by always making the locally-best choice at each step, never reconsidering it. Much faster than DP when applicable, but **only produces a globally optimal solution when the problem has the "greedy-choice property"** — not every problem does (e.g. 0/1 Knapsack is *not* solvable greedily and needs DP, while Fractional Knapsack, Kruskal's MST, and Dijkstra's shortest path *are* correctly greedy).

## Metaheuristics (brief)

General-purpose strategies for hard search/optimization problems where exact algorithms are too slow: e.g. **Simulated Annealing** — like local search (always move to a better neighbor), but occasionally accepts a *worse* move (with probability that decreases over time, analogous to a cooling temperature) to escape local optima.

## Fast Fourier Transform (FFT, brief)

Another Divide & Conquer algorithm, unrelated to DP/backtracking/greedy but grouped here under "advanced algorithmic techniques." Multiplying two degree-(n−1) polynomials naively costs Θ(n²) (multiply every coefficient pair). FFT evaluates both polynomials at the **n-th roots of unity** (complex numbers e^(2πik/n)), multiplies the *evaluations* pointwise in Θ(n), then interpolates back — using the roots' recursive structure to do each transform in Θ(n log n) instead of Θ(n²) naively. Net effect: polynomial multiplication drops from Θ(n²) to **Θ(n log n)**. FFT is fundamentally built on complex numbers (the roots of unity are complex except for trivial cases) — it is not a metaheuristic or an optimization heuristic, it's an exact algorithm.
