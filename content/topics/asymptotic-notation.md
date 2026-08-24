---
id: asymptotic-notation
title: "Asymptotic Notation (O, Ω, Θ) & Master Theorem"
category: "Grundlagen"
order: 2
relatedAlgorithmIds: []
sourceFiles: ["AuD-Zusammenfassung.pdf", "AuD26_Sheet01-GrpSol.pdf", "AuD26_Sheet02-Sol.pdf", "AuD26_Sheet04-Sol.pdf"]
---

## The five notations

| Symbol | Bound | Informal meaning |
|---|---|---|
| O(g(n)) | upper bound | "never slower than" — used for **worst case** |
| o(g(n)) | strict upper bound | strictly slower growth than g(n) |
| Ω(g(n)) | lower bound | "never faster than" — used for **best case** |
| ω(g(n)) | strict lower bound | strictly faster growth than g(n) |
| Θ(g(n)) | tight bound | f(n) = O(g(n)) **and** f(n) = Ω(g(n)) — used for **average/exact** growth |

**Formal definitions:**

```
O(g(n)) = { f : ∃ c > 0, n0 ∈ ℕ, ∀ n ≥ n0 : 0 ≤ f(n) ≤ c·g(n) }
Ω(g(n)) = { f : ∃ c > 0, n0 ∈ ℕ, ∀ n ≥ n0 : 0 ≤ c·g(n) ≤ f(n) }
Θ(g(n)) = { f : ∃ c1, c2 > 0, n0 ∈ ℕ, ∀ n ≥ n0 : 0 ≤ c1·g(n) ≤ f(n) ≤ c2·g(n) }
```

**Quick recipe** for f(n) = 5n² + 2n: take the term with the highest growth rate (5n²), drop the constant → f(n) = Θ(n²) (and also O(n²), Ω(n²)).

### Calculation rules (hold for O and Ω alike)
- **Constants**: f(n) = a (a > 0) ⟹ f(n) = O(1)
- **Scalar multiplication**: f(n) = O(g(n)) ⟹ a·f(n) = O(g(n))
- **Addition**: f₁ = O(g₁), f₂ = O(g₂) ⟹ f₁+f₂ = O(max{g₁,g₂}) — proof: with C=C₁+C₂, N₀=max(N₁,N₂), f₁(n)+f₂(n) ≤ (C₁+C₂)·max(g₁(n),g₂(n))
- **Multiplication**: f₁ = O(g₁), f₂ = O(g₂) ⟹ f₁·f₂ = O(g₁·g₂) — proof: with C=C₁·C₂, N₀=max(N₁,N₂), f₁(n)f₂(n) ≤ C₁C₂g₁(n)g₂(n)
- **Reflexivity**: f = O(f) always (C=1, N₀=1)
- **Transitivity**: f = O(g), g = O(h) ⟹ f = O(h) — proof: C=C₁C₂, N₀=max(N₁,N₂), f(n) ≤ C₁g(n) ≤ C₁C₂h(n)

### Duality and relationships between the five notations

These identities let you convert a proof in one notation into a proof in another almost for free:

- **O/Ω duality**: `f ∈ O(g) ⟺ g ∈ Ω(f)` (swap the roles: C′ = 1/C makes the same inequality read the other way).
- **o/ω duality**: `f ∈ o(g) ⟺ g ∈ ω(f)` (same idea, c′ = 1/c).
- **Strict ⟹ non-strict**: `o(g) ⊆ O(g)` and `ω(g) ⊆ Ω(g)` (taking c=1 in the o/ω definition immediately satisfies the O/Ω definition with C=1).
- **Θ is exactly the intersection**: `O(g) ∩ Ω(g) = Θ(g)`, and — since a function can't simultaneously grow *strictly* slower and *never* slower — `o(g) ∩ Ω(g) = ∅`.

**Alternative definitions via limits** (often faster to apply than the ε/N₀ definitions directly):
- `f ∈ O(g) ⟺` the sequence `(f(n)/g(n))ₙ` is **bounded**.
- `f ∈ o(g) ⟺ limₙ→∞ f(n)/g(n) = 0` (a **null sequence**).

**A worked classification table** (k≥1, ε>0, c>1, r<s constants) — a template for reading off which notations apply to a function pair:

| f(n) | g(n) | O(g) | o(g) | Ω(g) | ω(g) | Θ(g) |
|---|---|---|---|---|---|---|
| logᵏ(n) | nᵉ | ✓ | ✓ | ✗ | ✗ | ✗ |
| nᵏ | cⁿ | ✓ | ✓ | ✗ | ✗ | ✗ |
| 2ⁿ | 2^(n/2) | ✗ | ✗ | ✓ | ✓ | ✗ |
| n^log(c) | c^log(n) | ✓ | ✗ | ✓ | ✗ | ✓ |
| nʳ | nˢ | ✓ | ✓ | ✗ | ✗ | ✗ |
| log(n!) | log(nⁿ) | ✓ | ✗ | ✓ | ✗ | ✓ |

Reasoning per row: (1) `logᵏ(n)/nᵉ → 0` — a standard limit, so `f ∈ o(g)` (and hence `O(g)`, but not `Ω`/`ω`/`Θ`). (2) `nᵏ/cⁿ → 0`, identical argument. (3) `g(n)/f(n) = 2^(n/2)/2ⁿ = 2^(-n/2) → 0`, so `g ∈ o(f)` — swapping via O/Ω duality gives `f ∈ ω(g) ⊆ Ω(g)`. (4) `n^log(c) = 2^(log(n)log(c)) = c^log(n)` — the two functions are **exactly equal**, so `f ∈ Θ(g)` (hence both `O` and `Ω`, but not the strict `o`/`ω`). (5) `r<s ⟹ nʳ/nˢ = n^(r-s) → 0`, same shape as row 1. (6) Since `n! ≤ nⁿ` for all n, `log(n!) ≤ n·log(n)` gives `f ∈ O(g)`; a lower bound via splitting the sum `log(n!) = Σlog(i)` at `n/2` gives `log(n!) ≥ (1/3)·n·log(n)` for `n ≥ 9`, so also `f ∈ Ω(g)` — together, `f ∈ Θ(g)`.

**Why O alone isn't a genuine order relation, but Θ is**: define `f ≤O g :⟺ f ∈ O(g)`. This relation is **not antisymmetric** — e.g. `f(n)=n` and `g(n)=2n` satisfy both `f ∈ O(g)` and `g ∈ O(f)`, yet `f ≠ g`. Define instead `f =Θ g :⟺ f ∈ Θ(g)`: this **is** a genuine equivalence relation (reflexive via `f∈O(f)∩Ω(f)`, symmetric via O/Ω duality, transitive via O's transitivity applied to both bounds). Grouping functions into equivalence classes `[f] = {g : g =Θ f}` and ordering *those classes* by `[f] ≤ [g] :⟺ f ∈ O(g)` finally gives a true partial order — but it's still not **total**: e.g. `f(n)=n` and `g(n)=n^(1+sin(n))` are incomparable, since `f(n)/g(n) = n^(-sin(n))` and `g(n)/f(n) = n^(sin(n))` each have unbounded subsequences (wherever `sin(n)` swings negative or positive respectively), so neither `f∈O(g)` nor `g∈O(f)` holds.

## Why growth rate matters in practice

Asymptotic notation is about **trends for large n**, not concrete runtime — a smaller constant factor can make a worse-growing algorithm faster for any *fixed* input size, and applications are rarely built with a hard ceiling on input size, which is exactly why the asymptotic (not exact) behavior is what's usually worth optimizing for.

**Worked example** — max input size `n` solvable within a given time budget, for `f(n)` measured in milliseconds:

| f(n) | 1 second | 1 minute | 1 hour | 1 day | 1 month | 1 year | 1 century |
|---|---|---|---|---|---|---|---|
| n | 1,000 | 60,000 | 3.6×10⁶ | 86×10⁶ | 2.59×10⁹ | 32×10⁹ | 3.2×10¹² |
| n·log₂(n) | 140 | 4,895 | 204,095 | 3.9×10⁶ | 97×10⁶ | 1×10⁹ | 87×10⁹ |
| n² | 31 | 244 | 1,897 | 9,295 | 50,911 | 177,583 | 1,775,837 |
| n³ | 10 | 39 | 153 | 442 | 1,373 | 3,159 | 14,664 |
| 2ⁿ | 9 | 15 | 21 | 26 | 31 | 34 | 41 |
| n! | 6 | 8 | 9 | 11 | 12 | 13 | 15 |
| nⁿ | 4 | 6 | 7 | 8 | 9 | 10 | 11 |

The gap between rows only *widens* as the time budget grows — a **century** of extra budget buys `n²` barely 2 more orders of magnitude (1,897 → 1,775,837), but buys linear `n` a full 9 orders of magnitude (1,000 → 3.2×10¹²). This is the concrete meaning of "n·log n is so much better than n²": the crossover isn't a one-time constant-factor gap, it *keeps growing* the more resources you throw at it — which is exactly why polynomial vs. exponential (or n log n vs. n²) is the distinction that actually matters at scale, not the constants.

## Recurrence relations & the Master Theorem

Divide-and-conquer algorithms have running time of the form:

```
T(n) = a·T(n/b) + f(n)      (a ≥ 1, b > 1, f(n) asymptotically positive)
```

`a` = number of subproblems, `n/b` = size of each subproblem, `f(n)` = cost of dividing/combining outside the recursive calls.

**Master Theorem** — compare f(n) against n^(log_b a):

1. If f(n) = O(n^(log_b a − ε)) for some ε > 0 → **T(n) = Θ(n^(log_b a))** (recursion dominates)
2. If f(n) = Θ(n^(log_b a)) → **T(n) = Θ(n^(log_b a) · log n)** (recursion and combine step tie)
3. If f(n) = Ω(n^(log_b a + ε)) for some ε > 0, and a·f(n/b) ≤ c·f(n) for some c < 1 → **T(n) = Θ(f(n))** (combine step dominates)

Example: Merge Sort has T(n) = 2T(n/2) + Θ(n). Here a=2, b=2, so n^(log_b a) = n. f(n) = Θ(n) matches case 2 ⟹ T(n) = Θ(n log n).

## Solving recurrences by substitution (when the Master Theorem doesn't apply)

Not every recurrence has the `a·T(n/b) + f(n)` shape the Master Theorem needs (e.g. non-constant coefficients, `n-1` instead of `n/b`, additive constants baked into the base case). The **substitution method** proves a guessed bound `T(n) ≤ C·g(n)` directly by strong induction: guess the bound, then verify the inductive step algebraically, adjusting the constant `C` as needed to make the inequality close.

**Worked example** — three recurrences, each proven O(·) by substitution:

- `R(n) = R(n-1) + n` for n>1, `R(1) = r`. **Claim: R(n) ∈ O(n²).** Guess `C = max(r,1)`, `N₀=1`: base case `R(1)=r ≤ C·1²`. Step: assuming `R(n) ≤ Cn²`, `R(n+1) = R(n)+(n+1) ≤ Cn²+n+1 ≤ Cn²+2Cn+C = C(n+1)²` (using `n≥1, C≥1`). This is exactly the recurrence behind **Insertion Sort's worst case** — R accumulates the arithmetic series `1+2+...+n = Θ(n²)`.
- `S(n) = S(⌈n/2⌉) + 1` for n>1, `S(1) = s`. **Claim: S(n) ∈ O(log₂n).** Key lemma: `⌈n/2⌉ ≤ (3/4)n` for n≥2. Guess `C = max(s+1, 3)`, `N₀=2`: the halving-plus-constant shape is exactly **binary search's** recurrence.
- `T(n) = 2T(⌊n/2⌋) + n` for n>1, `T(1) = t`. **Claim: T(n) ∈ O(n log₂n).** Guess `C = t+1`: this is **Merge Sort's** recurrence, re-derived by substitution instead of the Master Theorem — same answer, different proof technique.

## Worked example: Towers of Hanoi (recursion → recurrence → closed form)

A classic case study in going from a recursive algorithm to a solved recurrence to a real efficiency verdict.

```
Hanoi(n, i, j):                      // move n disks from peg i to peg j, using the third peg
  sol = []
  if n > 0 and i != j:
    k = 3 - i - j                    // the third peg (labels are 0,1,2)
    sol = sol ++ Hanoi(n-1, i, k)    // move top n-1 disks out of the way, onto k
    sol = sol ++ [(i, j)]            // move the big disk i -> j
    sol = sol ++ Hanoi(n-1, k, j)    // move the n-1 disks from k onto j
  return sol
```

**Recurrence for the move count** `M(n)`: `M(0) = 0`; for `n>0` (and `i≠j`), `M(n) = 2·M(n-1) + 1` (peg labels don't matter by symmetry — every recursive call is structurally the same problem one size smaller).

**Closed form** via substitution `P(n) = M(n)+1`: `P(n) = 2P(n-1)`, `P(0)=1` ⟹ `P(n) = 2ⁿ` ⟹ **`M(n) = 2ⁿ − 1`**. This is exponential, so Hanoi is **not an efficient (polynomial) algorithm** — and provably can't be, since the largest disk alone forces the `n-1` disks above it to be fully relocated twice (once to clear it, once to restack on top), which is exactly the `2·M(n-1)` term; an induction on this fact shows `2ⁿ-1` is not just achieved but **optimal** — no algorithm can solve n-disk Hanoi in fewer moves.

**Sanity-check on the "legend of the monks moving 64 golden disks"**: `M(64) = 2⁶⁴-1` moves, at 1 move/second, is over `2³⁷ ≈ 1.4×10¹¹` years — an order of magnitude more than the ~13.8 billion year age of the universe. A vivid, concrete illustration of what "exponential" actually costs once n stops being small.
