---
id: dynamic-programming
title: "Dynamic Programming, Backtracking & Greedy"
category: "Advanced Design"
order: 1
relatedAlgorithmIds: []
---

## Dynamic Programming (DP)

Like Divide & Conquer, DP breaks a problem into subproblems — but DP's subproblems **overlap** (the same subproblem recurs many times), so DP **memoizes**: store each subproblem's solution the first time it's computed, and look it up instead of recomputing.

Two equivalent styles:
- **Top-down (memoization)**: write the natural recursion, but cache results in a table keyed by subproblem parameters.
- **Bottom-up (tabulation)**: identify the order subproblems depend on each other, and fill a table iteratively starting from the base cases.

**When is DP applicable?** The problem needs both:
1. **Optimal substructure** — an optimal solution is built from optimal solutions to subproblems.
2. **Overlapping subproblems** — the same subproblem is needed multiple times (this is what distinguishes DP from plain Divide & Conquer, e.g. Merge Sort has optimal substructure but *no* overlapping subproblems, so memoizing it gains nothing).

### Worked example — Climbing Stairs (top-down memoization)

**Problem**: a staircase has `n` steps; each move advances exactly 1 or 2 steps. How many distinct sequences of moves reach the top?

**Recurrence**: let `a_k` be the number of ways to reach the top starting from step `k`:

```
a_k = a_{k+1} + a_{k+2}   for k < n
a_n = 1                    (already at the top: exactly one, empty, way)
a_k = 0                    for k > n   (overshot — invalid)
```

For `n = 4`: `a4=1, a5=0 ⟹ a3=a4+a5=1, a2=a3+a4=2, a1=a2+a3=3, a0=a1+a2=5` — **5 ways** to climb 4 stairs.

```
MemClimbStairs(n):
  A = newArray(n+1); fill with -1        // -1 marks "not yet computed"
  return MemClimbStairsAux(A, n, 0)

MemClimbStairsAux(A, n, r):
  if r > n: return 0
  if r == n: return 1
  if A[r] != -1: return A[r]             // already computed — reuse it
  A[r] = MemClimbStairsAux(A, n, r+1) + MemClimbStairsAux(A, n, r+2)
  return A[r]
```

The `if A[r] != -1` check is the entire memoization idea in one line: without it, this is the naive Θ(2ⁿ) recursion (Fibonacci-shaped); with it, each of the `n+1` subproblems is solved exactly once, giving **Θ(n)**.

### Worked example — Minimum Edit Distance (Levenshtein distance, bottom-up tabulation)

**Problem**: the minimum number of single-character insertions, deletions, and substitutions needed to turn string `X` into string `Y`.

**Why it has overlapping subproblems**: computing `D[i][j]` (edit distance between `X[1..i]` and `Y[1..j]`) needs `D[i-1][j-1]`. That *same* subproblem `D[i-1][j-1]` is *also* needed directly by the computations of `D[i-1][j]` and `D[i][j-1]` — a naive recursive solution would recompute it repeatedly, so a DP table (filled bottom-up, or memoized top-down) solves each `(i,j)` pair exactly once: **Θ(mn)** instead of exponential.

**Recurrence** (with unit costs — insert/delete/substitute all cost 1, and copying an equal character costs 0):

```
D[i][0] = i                              // delete all i characters of X's prefix
D[0][j] = j                              // insert all j characters of Y's prefix
D[i][j] = min(
  D[i-1][j-1] + (X[i] != Y[j] ? 1 : 0),  // substitute (or free copy if equal)
  D[i-1][j] + 1,                         // delete X[i]
  D[i][j-1] + 1,                         // insert Y[j]
)
```

**Worked example**: `X = TIGER` (length 5), `Y = WINTER` (length 6). The filled table:

| D | ∅ | T | I | G | E | R |
|---|---|---|---|---|---|---|
| **∅** | 0 | 1 | 2 | 3 | 4 | 5 |
| **W** | 1 | 1 | 2 | 3 | 4 | 5 |
| **I** | 2 | 2 | 1 | 2 | 3 | 4 |
| **N** | 3 | 3 | 2 | 2 | 3 | 4 |
| **T** | 4 | 3 | 3 | 3 | 3 | 4 |
| **E** | 5 | 4 | 4 | 4 | 3 | 4 |
| **R** | 6 | 5 | 5 | 5 | 4 | **3** |

`D[5][6] = 3`: TIGER can become WINTER in 3 edits. Reconstructing the path from `D[5][6]` back to `D[0][0]` (always preferring the diagonal — a free copy — when characters match) gives the operation sequence **sub(T→W), copy(I), ins(N), sub(G→T), copy(E), copy(R)**.

**Weighted generalization**: if insert/delete/substitute have different costs `cost_ins`, `cost_del`, `cost_sub`, the recurrence becomes `D[i][j] = min(D[i-1][j-1] + cost(X[i],Y[j]), D[i-1][j] + cost_del, D[i][j-1] + cost_ins)` where `cost(a,b) = 0` if `a=b` else `cost_sub`; the boundary rows/columns become `D[i][0] = i·cost_del` and `D[0][j] = j·cost_ins`.

## Backtracking

Systematically explores all candidate solutions by building them incrementally, **abandoning ("pruning") a partial candidate as soon as it can't possibly lead to a valid solution** — this pruning is what makes backtracking far faster than brute-force enumeration in practice, even though its worst case remains exponential. Classic examples: N-Queens, Sudoku solving, subset-sum enumeration, Labyrinth/maze pathfinding, graph coloring.

**Structure**: backtracking is fundamentally a **depth-first search over the space of partial solutions**. At each step: (1) check if the current partial candidate is already a complete, valid solution — if so, return it; (2) otherwise check if it can *still possibly* be extended into one — if not, **discard the last decision and try the next alternative** ("retreat" to the previous state); (3) otherwise extend it by one more choice and recurse.

### Worked example — Word Search

**Problem**: given a 2D grid of letters and a target word, decide if the word can be traced by a path of horizontally/vertically adjacent cells, each cell used **at most once**.

```
WordSearch(board, word):
  rows = length(board); cols = length(board[0])
  for i = 0 to rows-1:
    for j = 0 to cols-1:
      path = newList()
      (isFound, path) = WordSearchBTR(board, word, i, j, path)
      if isFound: return path
  return PathNotFound

WordSearchBTR(board, word, i, j, path):
  r = length(path)
  if r == length(word): return (true, path)         // full word already matched
  invalid = (i<0) or (j<0) or (i>=rows) or (j>=cols)
            or board[i][j] != word[r] or contains(path, (i,j))
  if invalid: return (false, path)                  // prune: dead end
  append(path, (i,j))
  dr = [1,-1,0,0]; dc = [0,0,1,-1]                   // 4 neighbor directions
  for k = 0 to 3:
    (isFound, path) = WordSearchBTR(board, word, i+dr[k], j+dc[k], path)
    if isFound: return (true, path)
  remove(path, (i,j))                                // backtrack: undo the choice
  return (false, path)
```

The **prune** is the `invalid` check (out of bounds, wrong letter, or cell already used in this path) — it stops exploring a branch the instant it's provably hopeless. The **backtrack** is `remove(path, (i,j))` immediately before returning `false` — undoing the tentative choice so the caller's next neighbor-attempt starts from a clean state, exactly the "retreat and try the next alternative" step.

## Greedy Algorithms

Build a solution by always making the **locally optimal** choice at each step — considering only the current situation, never its effect on later decisions — and never reconsidering it. Much faster than DP when applicable, but **only produces a globally optimal solution when the problem has the "greedy-choice property"** — not every problem does.

### When greedy fails — two concrete counter-examples

**Coin change** (minimize the number of coins for a given amount, denominations {1, 3, 4}, target 6): greedy always takes the largest denomination that fits, giving **4 + 1 + 1 = 3 coins**. The true optimum is **3 + 3 = 2 coins**. Greedy's locally-best pick (the biggest coin available) leaves a remainder that's awkward to finish cheaply — a DP over "minimum coins for every amount up to the target" is needed to guarantee optimality for arbitrary denominations.

**0/1 Knapsack vs. Fractional Knapsack**: given items with weight `g_k` and value `w_k`, and capacity `G_max = 50`:

| item k | value `w_k` | weight `g_k` | ratio `d_k = w_k/g_k` |
|---|---|---|---|
| 1 | 60 | 10 | 6 |
| 2 | 100 | 20 | 5 |
| 3 | 120 | 30 | 4 |

- **Fractional** knapsack (items may be split, e.g. take half a shirt) **is correctly solved by greedy**: sort by ratio `d_k` descending, fill capacity with the best ratio first, taking a fractional slice of the last item that doesn't fully fit. This IS optimal for the fractional variant.
- **0/1** knapsack (each item taken whole or not at all): the *same* greedy — take item 1 (ratio 6, uses 10), then item 2 (ratio 5, uses 20, total weight 30 ≤ 50) — stops there since item 3 no longer fits, for total value **60 + 100 = 160**. But the true optimum is items **2 + 3 = 100 + 120 = 220** (weight 20+30=50, exactly full) — strictly better, and greedy never finds it, because committing to the whole of item 1 early forecloses a better combination. **0/1 Knapsack needs DP**, not greedy, precisely because it lacks the greedy-choice property once items can't be split.

Problems that genuinely *do* have the greedy-choice property (so greedy IS correctly optimal for them): **Fractional Knapsack**, **Kruskal's/Prim's MST**, **Dijkstra's shortest path** (non-negative weights).

## Metaheuristics (brief)

General-purpose strategies for hard search/optimization problems where exact algorithms are too slow: e.g. **Simulated Annealing** — like local search (always move to a better neighbor), but occasionally accepts a *worse* move (with probability that decreases over time, analogous to a cooling temperature) to escape local optima.

## Fast Fourier Transform (FFT)

Another Divide & Conquer algorithm, unrelated to DP/backtracking/greedy but grouped here under "advanced algorithmic techniques." Multiplies two degree-(n−1) polynomials in **Θ(n log n)** instead of the naive Θ(n²) (multiply every coefficient pair).

**The three-step idea**:
1. **Coefficient → point-value**: instead of working with a polynomial's `n` coefficients `a_0, …, a_{n-1}` directly, evaluate it at `n` cleverly chosen points to get `n` `(x, p(x))` pairs — the "point-value" representation. (This step is FFT itself.)
2. **Pointwise multiply**: multiplying two polynomials' point-value representations at *matching* x-values is just `n` independent scalar multiplications — **Θ(n)**.
3. **Point-value → coefficient**: convert the product's point-value representation back to coefficients via the **inverse FFT**.

**Why FFT evaluation is fast**: it evaluates the polynomial not at `n` arbitrary points, but at the `n`-th **roots of unity** `ω_n^0, ω_n^1, …, ω_n^{n-1}` (where `ω_n = e^{2πi/n}`), which satisfy `(ω_n^j)² = (ω_n^{j+n/2})²` for every `j` — meaning evaluating at all `n` roots reduces (via splitting the polynomial into its even- and odd-indexed coefficients, `p(x) = p_even(x²) + x·p_odd(x²)`) to evaluating **two half-size polynomials at only `n/2` points each** (the squared values are the `(n/2)`-th roots of unity). Recursing gives the Θ(n log n) bound.

### Worked example

Polynomial `p(x) = 3 + 2x + x³` → coefficient vector `[3, 2, 0, 1]` (degree 3, so `n = 4` points suffice for a unique point-value representation, though `2n−1` points would be needed if the *result of a multiplication* — degree up to `2n-2` — must be uniquely recoverable).

Splitting into even/odd-indexed coefficients: `p_even(y) = 3 + 0y` (from `a_0, a_2`), `p_odd(y) = 2 + 1y` (from `a_1, a_3`), so `p(x) = p_even(x²) + x·p_odd(x²)`.

Evaluating `FFT([2,1], n=2, w=ω_8²)` (the recursive call for `p_odd`, using `ω_8²` since squaring halves the effective root) at points `[1, ω_8², ω_8⁴, ω_8⁶]` gives `[3, 2+i, 1, 2−i]` (using `p_odd(y) = 2 + y`: at `y=1` → 3, at `y=ω_8²=i` → `2+i`, at `y=ω_8⁴=-1` → 1, at `y=ω_8⁶=-i` → `2-i`).

Combining via `p(x) = p_even(x²) + x·p_odd(x²)` at each of the 4 points:
```
x=1:      p_even(1) + 1·p_odd(1)     = 3 + 1·3     = 6
x=ω_8:    p_even(ω_8²) + ω_8·p_odd(ω_8²)  = 3 + ω_8·(2+i)  = 3+i
x=ω_8²:   p_even(ω_8⁴) + ω_8²·p_odd(ω_8⁴) = 3 + i·1        = 3+i
x=ω_8³:   p_even(ω_8⁶) + ω_8³·p_odd(ω_8⁶) = 3 + ω_8³·(2-i) = 3-i
```
(exact values depend on the specific complex roots `ω_8^k`; the key mechanic to remember is the even/odd split plus the `p_even(x²) + x·p_odd(x²)` combine step, repeated recursively down to degree-0 base cases where `FFT([a], n=1, w) = [(1,a), (w,a)]` trivially.)

**Why 2n points, not n**: a size-n polynomial's point-value form needs only `n` points to be uniquely determined — but multiplying two such polynomials produces a result of degree up to `2n-2`, which needs `2n-1` points to be uniquely recoverable. In practice FFT-based multiplication evaluates both input polynomials at `2n` points (the next convenient power of two) before the pointwise-multiply step.

## Comparing the three paradigms

| Paradigm | Revisits earlier decisions? | Guarantees optimal? | Typical complexity |
|---|---|---|---|
| Greedy | Never | Only if greedy-choice property holds | Fast (often O(n log n)) |
| Backtracking | Yes — explicit undo/retreat | Yes (exhaustive, with pruning) | Exponential worst case |
| Dynamic Programming | Implicitly, via memoized subproblems | Yes (if optimal substructure holds) | Polynomial (subproblem count × work per subproblem) |
