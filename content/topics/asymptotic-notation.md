---
id: asymptotic-notation
title: "Asymptotic Notation (O, Ω, Θ) & Master Theorem"
category: "Grundlagen"
order: 2
relatedAlgorithmIds: []
sourceFiles: ["AuD-Zusammenfassung.pdf"]
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
- **Addition**: f₁ = O(g₁), f₂ = O(g₂) ⟹ f₁+f₂ = O(max{g₁,g₂})
- **Multiplication**: f₁ = O(g₁), f₂ = O(g₂) ⟹ f₁·f₂ = O(g₁·g₂)

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
