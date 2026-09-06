---
id: string-matching
title: "String Matching"
category: "String Algorithms"
order: 1
relatedAlgorithmIds: ["string-match-naive", "string-match-rabin-karp"]
---

## Problem statement

Given a **text** `T` (array of length `n`) and a **pattern** `P` (array of length `m ≤ n`) over a finite alphabet `Σ`, find all valid **shifts** `sft` (0 ≤ sft ≤ n − m) such that `T[sft, …, sft + m − 1] = P`, i.e. `T[sft + j] = P[j]` for all `0 ≤ j < m`.

## Naive String Matching

Try every possible shift; for each, compare the pattern against that window of the text character by character.

```
NaiveStringMatching(T, P):
  n = length(T); m = length(P)
  L = []
  for sft = 0 to n - m:
    isValid = true
    for j = 0 to m - 1:
      if P[j] != T[sft + j]:
        isValid = false
    if isValid:
      L = append(L, sft)
  return L
```

- **Correctness** follows directly from the loop invariant "before the `sft`-th iteration, `L` contains exactly the valid shifts `t < sft`" (init/maintenance/termination hold trivially since the inner loop precisely tests the definition of a valid shift).
- **Complexity: O((n − m + 1)·m)** — the outer loop runs `n − m + 1` times, the inner comparison loop up to `m` times per outer iteration. No information learned at one shift carries over to the next.

## Rabin–Karp Algorithm

**Idea**: instead of comparing strings character-by-character, compare a **numeric fingerprint** of each window against the pattern's fingerprint — comparing two numbers is O(1) instead of O(m).

Treat the pattern and every length-`m` window of the text as base-`d` numbers (`d = |Σ|`, e.g. `d = 10` for digit strings). Let `p` = the numeric value of `P`, and `t_sft` = the numeric value of `T[sft, …, sft+m−1]`. Then `sft` is a valid shift **iff `t_sft = p`**.

**Preprocessing — computing `p` and `t_0` in Θ(m) via Horner's rule:**
```
Compute(P):
  m = length(P); p = 0
  for i = 0 to m - 1:
    p = 10 * p + P[i]
  return p
```

**Rolling update — computing `t_{sft+1}` from `t_sft` in O(1):**

`t_{sft+1} = 10 · (t_sft − 10^{m−1} · T[sft]) + T[sft + m]` — subtract off the leading digit's contribution, shift the rest up one digit, and bring in the new trailing digit. The constant `10^{m−1}` is precomputed **once**.

```
RabinKarpMatchBasic(T, P):
  n = T.length; m = P.length; h = 10^(m-1)
  p, t0, L = 0, 0, []
  for i = 0 to m - 1:
    p  = 10*p  + P[i]
    t0 = 10*t0 + T[i]
  for sft = 0 to n - m:
    if p == t_sft:
      L = append(L, sft)
    if sft < n - m:
      t_{sft+1} = 10*(t_sft - T[sft]*h) + T[sft + m]
  return L
```

**The catch — numbers get huge.** For long patterns, `p` and `t_sft` can exceed a machine word, breaking the "O(1) per arithmetic operation" assumption. **Fix**: pick a prime `q` such that `10q` still fits in a computer word, and compute `p` and every `t_sft` **modulo `q`** — this keeps the numbers small, but the comparison is no longer perfectly precise:

- `t_sft ≢ p (mod q)` **guarantees** `sft` is *not* valid (safe to skip — no false negatives).
- `t_sft ≡ p (mod q)` does **not guarantee** `t_sft = p` — a **spurious hit** ("unechter Treffer") is possible. Whenever the modular test passes, an explicit character-by-character check (like the naive algorithm's inner loop) against `T[sft, …, sft+m−1]` is required to confirm a *real* match.

```
RabinKarpMatch(T, P, q):
  n = T.length; m = P.length
  h = 10^(m-1) mod q
  p, t0, L = 0, 0, []
  for i = 0 to m - 1:
    p  = (10*p  + P[i]) mod q
    t0 = (10*t0 + T[i]) mod q
  for sft = 0 to n - m:
    if p == t_sft:
      b = true
      for j = 0 to m - 1:
        if P[j] != T[sft + j]: b = false; break
      if b: L = append(L, sft)
    if sft < n - m:
      t_{sft+1} = (10*(t_sft - T[sft]*h) + T[sft + m]) mod q
  return L
```

**Complexity**: preprocessing Θ(m); worst case still O((n−m+1)·m) if spurious hits are frequent, but with a well-chosen `q` the *expected* number of spurious hits is O(1), giving **expected** running time **O(n + m)**.

## Finite-Automaton (FSM) Matching

**Idea**: precompute (once, from `P` alone) a deterministic finite automaton with `m + 1` states, one per possible "overlap length" between the text read so far and a prefix of `P`. Then a **single left-to-right pass over `T`** (no backtracking, no re-comparison) suffices — O(n) after preprocessing.

- The automaton is always in state `0 ≤ st ≤ m`, meaning: the last `st` characters of `T` read so far equal `P[0, …, st−1]`, and no larger overlap `i > st` holds.
- **Transition function `δ(st, w)`**: from state `st`, reading character `w`, go to the state equal to the length of the **longest suffix** of `P[0..st−1] + w` that is also a **prefix** of `P` (this length is always well-defined and ≤ `st + 1`).
- Reaching state `st = m` means the just-read suffix of `T` equals the entire pattern — a match ending at the current position, i.e. shift `sft = currentIndex − m + 1` is valid.

```
FSMMatching(T, δ, m):
  n = length(T); L = []; st = 0
  for sft = 0 to n - 1:
    st = δ(st, T[sft])
    if st == m:
      L = append(L, sft - m + 1)
  return L
```

**Complexity**: building `δ` costs O(m·|Σ|) (one row per state, one column per alphabet symbol); the matching pass itself is **O(n)** — a strict improvement over Rabin–Karp's *expected* bound, at the price of a heavier, alphabet-dependent preprocessing step.

**FSM works over any alphabet, not just letters/digits** — a second worked example uses `Σ = {β, δ, λ, σ}` (Greek letters) and pattern `P = [λ, δ, λ, σ]` (so `m = 4`, automaton has states `0..4`). Running the resulting automaton over `T = [β,λ,δ,λ,β,σ,λ,λ,δ,λ,δ,λ,σ,λ,σ,β]` (n=16): the state trace is `0,1,2,3,0,0,1,1,2,3,2,3,4,1,0,0` — reaching state `st=4=m` at text index `sft=12` (reading `T[12]=σ`), giving the single valid shift `12 − 4 + 1 = 9`. Confirm: `T[9..12] = [λ,δ,λ,σ] = P` ✓.

## Comparing the three approaches

| Algorithm | Preprocessing | Matching | Worst case |
|---|---|---|---|
| Naive | — | O((n−m+1)·m) | O((n−m+1)·m) |
| Rabin–Karp | Θ(m) | expected O(n+m) | O((n−m+1)·m) (many spurious hits) |
| Finite Automaton | O(m·\|Σ\|) | O(n) | O(m·\|Σ\| + n) |

## Edge cases & invariants

- A valid shift requires the **entire** pattern to match — a single mismatched character anywhere invalidates that shift for the naive algorithm's inner loop.
- Rabin–Karp's modular test can produce **false positives** (spurious hits) but **never false negatives** — `t_sft ≠ p (mod q)` is a sound (if imprecise) way to reject a shift instantly.
- The FSM's state `st` after reading a prefix of `T` is *not* simply "how many characters matched last time" — it is redefined from scratch each step as the **longest** valid overlap, which can also **decrease** on a mismatch (unlike a naive counter that would just reset to 0).
- All three algorithms solve the exact same problem (same set of valid shifts) — they differ purely in preprocessing cost vs. per-character matching cost, which is the standard axis exam questions probe.
