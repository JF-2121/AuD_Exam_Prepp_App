# Sheet 01

Source: `AuD26_Sheet01-1_260520_104059.pdf` (questions, 5pp) + `AuD26_Sheet01-GrpSol_260520_142753.pdf` (solutions to G1–G5 only, 9pp). Sommersemester 2026. Abgabe: 04.05.2026.

## G1 — Gruppendiskussion (Topic: terminology / no computable answer)

Discuss and be able to explain: (a) Algorithmus; (b) Datenstrukturen in Algorithmen; (c) Das Sortierproblem und InsertionSort; (d) Schleifeninvariante.

No solution given (discussion prompt).

## G2 — Eigenschaften von Algorithmen I (Topic: algorithm properties / fill-in-the-blank)

**Question:** Fill-in-the-blanks text about algorithm properties: Determiniertheit, Determinismus, Effizienz, Korrektheit, Terminierung.

**Solution (filled blanks, in order of appearance):**
"Wir sagen, dass ein Algorithmus **terminiert**, wenn er für jede **Eingabe** nur **endlich** viele Schritte durchläuft und dann eine **Ausgabe** produziert. Entspricht diese stets den Erwartungen gemäß der Spezifikation des Algorithmus, so nennen wir den Algorithmus **korrekt**. Oft gibt es mehrere Algorithmen, die das gleiche **(Berechnungs-)Problem** lösen können. Dann kann es sich lohnen, einen Algorithmus zu verwenden, der die folgenden Ressourcen möglichst **effizient** ausnutzt: **Energie**, **Speicher** und **Zeit**.

Ein Algorithmus erfüllt das Kriterium der **Determiniertheit**, wenn er für jede **Eingabe** stets die gleiche **Ausgabe** berechnet. Eine Verschärfung der **Determiniertheit**, bei der zusätzlich gefordert wird, dass der Algorithmus für jede **Eingabe** dieselben **Zwischenzustände** durchlaufen muss, wird **Determinismus** genannt."

**Weiterführende Erklärung (answers to reflection questions):**
1. Reasons to use a less-efficient algorithm: simpler algorithms are easier to verify formally; runtime can leak secret information (side-channel), so constant-time algorithms are sometimes deliberately used despite being less "efficient"; a performant parallel algorithm may not be resource-efficient in its sequential runtime.
2. Other optimizable resources: variance of runtime (constant-time algorithms); size of the algorithm (chip area in hardware, lines of code in software); number/kind of distinct operations used (e.g. only additions); parallelizability.

## G3 — Pseudocode schreiben (Topic: loop invariants / arrays)

**Question:** For a non-empty integer array A, for each of the following: give pseudocode + prove correctness via loop invariant.
(a) Compute the minimum of A.
(b) Compute the mean of all entries of A.
(c) Find the largest index `idx` of A such that every element up to that index (starting at idx=1) is less than double its immediate predecessor. If this already fails at A[1] or A[1] doesn't exist, set idx = −1.

**Solution:**

(a) `Minimum(A)`:
```
11: len = length(A)
12: min = A[0]
13: for i = 1 to len - 1 do
14:   if A[i] < min then
15:     min = A[i]
16: return min
```
Loop invariant: "Before the i-th iteration of the for-loop, `min` is the minimum of the elements in A[0,…,i−1]."
- Initialization: before i=1, min=A[0], trivially the minimum of A[0..0].
- Maintenance: if A[i] < min, A[i] becomes new min (correct, it's smaller than all previous). If A[i] ≥ min, min unchanged (still correct since min was already ≤ A[i]).
- Termination: loop ends before i=len, so min = minimum of A[0…len−1] = minimum of A. QED.

(b) `Average(A)`:
```
21: len = length(A)
22: sum = A[0]
23: for i = 1 to len - 1 do
24:   sum = sum + A[i]
25: avg = sum/len
26: return avg
```
Loop invariant: "Before the i-th iteration, `sum` is the sum of elements in A[0,…,i−1]." Proven analogously (init/maintenance/termination); after the loop sum = sum of all of A, then avg = sum/len is the mean. QED.

(c) `MaxIndex(A)`:
```
31: len = length(A)
32: idx = -1
33: conditionTrue = true
34: for i = 1 to len - 1 do
35:   if A[i] < 2 * A[i-1] and conditionTrue then
36:     idx = i
37:   else
38:     conditionTrue = false
39: return idx
```
Loop invariant: "Before the i-th iteration: conditionTrue is true iff A[k] < 2·A[k−1] holds for all 1 ≤ k ≤ i−1; and idx is either the largest index k (1≤k≤i−1) such that A[j] < 2·A[j−1] for all 1≤j≤k, or idx=−1 if no such k exists."
- Initialization: before i=1, vacuously true, idx=−1 and conditionTrue=true are correct.
- Maintenance: case split on A[i] < 2·A[i−1] and on conditionTrue's prior value (4 sub-cases) — invariant preserved in every case (see full proof in source for exhaustive case analysis).
- Termination: at i=len, idx = largest valid index or −1. QED.

## G4 — Partielle Ordnungen I (Topic: relations / order theory, divisibility)

**Question:** On ℕ define n | m ⇔ ∃k∈ℕ: n·k = m.
(a) Show | is a partial order on ℕ.
(b) Show | is not total on ℕ.
Definitions given: x is a **minimal element** of M⊆ℕ if ∀y∈M: y|x ⟹ y=x. x is a **least/smallest element** if ∀y∈M: x|y.
(c) Show every least element of M is also minimal.
(d) Show that for M₀ = ℕ\{1}, primes are minimal elements but no prime is the least element of M₀.

**Solution:**
(a) Reflexivity: a|a since 1·a=a. Antisymmetry: a|b and b|a ⟹ a·k₁=b, b·k₂=a ⟹ a·k₁·k₂=a ⟹ k₁=k₂=1 ⟹ a=b. Transitivity: a|b, b|c ⟹ a·k₁=b, b·k₂=c ⟹ a·(k₁k₂)=c, k₁k₂∈ℕ ⟹ a|c.
(b) Counterexample: 2,3∈ℕ, but 2∤3 and 3∤2, so | is not total.
(c) Let a be a least element of M, b∈M arbitrary. By definition a|b. If additionally b|a, antisymmetry gives b=a. So a satisfies the definition of a minimal element.
(d) Let p∈M₀ be prime. p is divisible only by 1 and itself; since 1∉M₀, no a∈M₀\{p} divides p ⟹ p is minimal in M₀. For distinct primes p,q (coprime): p∤q and q∤p, so no prime is the least element of M₀ — all primes are minimal, none is least.

## G5* — Türme von Hanoi (Topic: recursion / recurrence relations / induction)

**Question:** Classic Towers of Hanoi with 3 pegs {0,1,2}, n disks.
(a) Give recursive pseudocode `Hanoi(n,i,j)` outputting an array of moves (tuples (k,l)), using ∥ for array concatenation, avoiding unnecessary moves.
(b) Give a recursive equation for the number of moves Mₙ,ᵢ,ⱼ.
(c) Solve the recurrence in closed form (hint: substitute Pₙ,ᵢ,ⱼ = Mₙ,ᵢ,ⱼ+1); decide if the algorithm is efficient (polynomial).
(d) Prove the algorithm is optimal (fewest possible moves) via induction.
(e) Legend: monks moving 64 gold disks at 1 move/sec since the start of time (universe ≈13.8 billion years old) — should we worry about "the end of the world via Hanoi"?

**Solution:**
(a)
```
Hanoi(n, i, j)
11: sol = []
12: if n > 0 and i ≠ j then
13:   k = 3 - i - j
14:   sol = sol ∥ Hanoi(n-1, i, k)   // move top n-1 disks to peg k
15:   sol = sol ∥ [(i, j)]          // move disk n from i to j
16:   sol = sol ∥ Hanoi(n-1, k, j)  // move top n-1 disks to peg j
17: fi
18: return sol
```
(b) Mₙ,ᵢ,ⱼ = 0 if n=0 or i=j; otherwise Mₙ,ᵢ,ⱼ = 2·M_{n−1,i,j} + 1 (peg labels are irrelevant by symmetry). So: M₀,ᵢ,ⱼ=0, Mₙ,ᵢ,ⱼ=2M_{n−1,i,j}+1 for n>0.

(c) Substituting Pₙ,ᵢ,ⱼ = Mₙ,ᵢ,ⱼ+1 gives Pₙ,ᵢ,ⱼ = 2P_{n−1,i,j}, P₀,ᵢ,ⱼ=1 ⟹ Pₙ,ᵢ,ⱼ=2ⁿ ⟹ **Mₙ,ᵢ,ⱼ = 2ⁿ − 1** (for n>0, i≠j; 0 if n=0 or i=j). Runtime is exponential ⟹ algorithm is **not efficient**.

(d) By induction on n, using the fact that the largest disk must move at least once from i to some other peg r, requiring the n disks above it to first be moved to the third peg, and similarly for the final placement — shows any correct algorithm needs ≥ 2M_{n,i,j}+1 = M_{n+1,i,j} moves. Full inductive argument given in source (base case n=0 trivial: 0 moves needed).

(e) Need at least M_{64,i,j} = 2⁶⁴−1 moves. At 1 move/sec (365-day, always-leap years): (2⁶⁴−1)/(60·60·24·366) years ≥ 2³⁷ = 128·10⁹ years, vastly more than the universe's age of ~13.8·10⁹ years. **No cause for concern.**

## H1 — Bubble-Sort (3+1+1+3+6+4 Punkte) (Topic: sorting, BubbleSort, loop invariants)

**Note:** No official printed solution exists for H1–H3 in the provided GrpSol document (it covers only G1–G5 Präsenzübungen). The scanned solution PDF shows only handwritten student annotations on the question pages, not an official worked solution. Below is the question text plus [UNCLEAR: handwritten] annotations where legible, and my own correctly-computed BubbleSort trace for completeness (marked as computed, not official).

**Given algorithm:**
```
BubbleSort(A)
1: n = length(A)
2: for i = 1 to n-1 do
3:   for j = 0 to n-i-1 do
4:     if A[j] > A[j+1] then
5:       tmp = A[j]
6:       A[j] = A[j+1]
7:       A[j+1] = tmp
8: return A
```

(a) Sort array `[6, 4, 9, 3]` with BubbleSort, showing the array state before every inner-loop pass and marking compared elements; give the final return value.

[COMPUTED trace, not from official source — provided for completeness since no official solution exists]
- i=1: j=0: compare A[0]=6,A[1]=4 → swap → [4,6,9,3]; j=1: compare A[1]=6,A[2]=9 → no swap → [4,6,9,3]; j=2: compare A[2]=9,A[3]=3 → swap → [4,6,3,9]
- i=2: j=0: compare A[0]=4,A[1]=6 → no swap → [4,6,3,9]; j=1: compare A[1]=6,A[2]=3 → swap → [4,3,6,9]
- i=3: j=0: compare A[0]=4,A[1]=3 → swap → [3,4,6,9]
- Final return value: **[3, 4, 6, 9]**

(handwritten annotations on scan corroborate: "6>4", labels "INNER LOOP(j)" / "OUTER LOOP(i)", final boxed **3 4 6 9**)

(b) Now assume initial array is `[3, 4, 6, 9]` (already sorted). How does the number of loop passes change vs (a)? Handwritten annotation: "GLEICHE LÄNGE DA BS TROTZDEM DIE OPTIMAL PRÜFT" [UNCLEAR — appears to say the number of *outer* loop iterations stays the same length (given algorithm has no early-exit optimization), i.e. still runs all n−1 passes regardless of sortedness].

(c) What else must be shown about the relationship between input array A and output array A′ (besides A′ being sorted) to prove correctness? Handwritten annotation: "**Länge gleich + gleiche Werte**" (same length + A′ is a permutation of A, i.e. contains the same elements/values).

(d)–(f) Loop invariants for lines 2–7 and 3–7 proving sortedness and termination. [No official text provided; question only.]

## H2 — Partielle Ordnungen II (3+3+3+3 Punkte) (Topic: partial orders / DAGs / algorithm design)

**Question:**
(a) Software-release example — dependency table:

| ID | Beschreibung | Abhängigkeiten |
|---|---|---|
| T1 | Anforderungen analysieren | ∅ |
| T2 | UI-Design erstellen | ∅ |
| T3 | Backend programmieren | T1 |
| T4 | Frontend umsetzen | T2, T3 |
| T5 | Integrationstest durchführen | T4 |

- Draw all tasks and direct dependencies as a directed graph (example: "B depends on A" ⟹ A→B).
- Explain why this task set with dependency relation forms a partial order M (address reflexivity, antisymmetry, transitivity, with suitable assumptions).
- Give all minimal elements.
- Add a task T6 that introduces a new minimal element.

(b) Design algorithm `MaxElements` that:
- Takes M and relation R = {(a,b) | a⪯b} (i.e. b depends on a) as input.
- Finds all maximal elements.
- Uses at most n(n−1)/2 loop iterations (n = |M|).
- Verify using M={T1,...,T5} and R = {(T1,T1),(T2,T2),(T3,T3),(T4,T4),(T5,T5),(T1,T3),(T2,T4),(T3,T4),(T4,T5),(T1,T4),(T1,T5),(T2,T5),(T3,T5)}.

No official solution provided.

## H3 — Insertion Sort (3+3 Punkte) (Topic: sorting, InsertionSort, stability)

**Given algorithm:**
```
InsertionSort(A)
1: n = length(A)
2: for i = 1 to n-1 do
3:   key = A[i]
4:   j = i-1
5:   while j >= 0 and A[j] > key do
6:     A[j+1] = A[j]
7:     j = j-1
8:   A[j+1] = key
9: return A
```

(a) Sort array `[5, 2, 5*, 1]` (the `*` marks the second occurrence of 5, must be tracked). Show array state after each complete outer for-loop iteration (line 2); mark which elements are compared with `key` in the inner while-loop.

[COMPUTED trace, not from official source]
- Start: [5, 2, 5*, 1]
- i=1: key=2. Compare with A[0]=5 (5>2, shift) → [5,5,5*,1] wait — let's redo carefully: j=0, A[0]=5>2 → A[1]=A[0]=5, j=-1. Insert key at A[0]: → [2, 5, 5*, 1]
- i=2: key=5*. Compare with A[1]=5 (5>5* is false since equal) → no shift, loop doesn't execute. Insert key at A[2]: → [2, 5, 5*, 1] (unchanged)
- i=3: key=1. Compare with A[2]=5* (5*>1, shift) → [2,5,5,1]→ index2 gets 5*'s value... Let's redo: j=2, A[2]=5*>1 → A[3]=A[2]=5*, j=1. A[1]=5>1 → A[2]=A[1]=5, j=0. A[0]=2>1 → A[1]=A[0]=2, j=-1. Insert key at A[0]: → [1, 2, 5, 5*]
- Final: **[1, 2, 5, 5*]**

Handwritten annotations on scan corroborate these intermediate states (N = [2,5,1,5*] etc. partially legible, consistent with the above trace).

(b) Explain, using the pseudocode and part (a)'s results, why InsertionSort is a stable sorting algorithm. Handwritten annotation: "**Da keine Werte beim Sortieren verloren gehen**" [UNCLEAR — likely intends: because the while-loop only shifts elements strictly greater than key (`A[j] > key`, strict inequality), equal elements are never moved past each other, so relative order of equal keys (5 and 5*) is preserved — confirmed by the trace above where 5 stayed before 5*].

---

# Sheet 02

Source: `AuD26_Sheet02-Sol-1_260520_154542.pdf` — combined questions + solutions, 6pp. Sommersemester 2026. Veröffentlicht: 04.05.2026. (No separate Hausübungen section present in this document.)

## G1 — Gruppendiskussion (Topic: asymptotics terminology)

Discuss: (a) Laufzeitanalyse mit asymptotischer Komplexität; (b) Landau-Symbole; (c) Komplexitätsklassen. No solution (discussion).

## G2 — Aussagen über Asymptotik (Topic: Big-O / Landau notation, true/false)

**Question:** True or false, with justification:
(a) Asymptotic notation ignores constant factors and additive terms of runtime functions.
(b) Asymptotic notations help estimate the runtime for a concrete input.
(c) Asymptotic notations help estimate the growth of runtime depending on input length for large input lengths.
(d) Asymptotic notations do NOT help compare the efficiency of two algorithms, since for any concrete input length we can't read off from the notation which algorithm is faster.

**Solution:**
(a) **True.** E.g. for f(n)=32n²+70, the factor 32 and summand 70 are "hidden."
(b) **False.** Concrete runtime can always be affected by a prefactor or a large constant summand.
(c) **True.** Prefactors don't change growth trends; non-dominant terms become irrelevant past some function-dependent size.
(d) **False.** Applications are often built without a firm upper bound on data size, so asymptotic (not exact) behavior is what matters.

## G3 — Verhalten von Laufzeitfunktionen (Topic: growth rates / table of max n by time budget)

**Question:** Table gives runtime functions f(n) (in ms) and time budgets (1 second up to 1 century); fill in max input size n that terminates within budget. (1 day=24h, 1 year=365 days assumed.)

**Given/Solution table (as printed):**

| f(n) | 1 Sekunde | 1 Minute | 1 Stunde | 1 Tag | 1 Monat | 1 Jahr | 1 Jahrhundert |
|---|---|---|---|---|---|---|---|
| n | 1.000 | 60.000 | 3,6×10⁶ | 86×10⁶ | 2,592×10⁹ | 32×10⁹ | 3,2×10¹² |
| n·log₂(n) | 140 | 4.895 | 204.095 | 3,9×10⁶ | 97×10⁶ | 1×10⁹ | 87×10⁹ |
| n² | 31 | 244 | 1.897 | 9.295 | 50.911 | 177.583 | 1.775.837 |
| n³ | 10 | 39 | 153 | 442 | 1.373 | 3.159 | 14.664 |
| 2ⁿ | 9 | 15 | 21 | 26 | 31 | 34 | 41 |
| n! | 6 | 8 | 9 | 11 | 12 | 13 | 15 |
| nⁿ | 4 | 6 | 7 | 8 | 9 | 10 | 11 |

Reflection questions (no computed answers given): comparison of n² vs 2ⁿ; when quadratic becomes unacceptable for real systems; why n·log₂(n) is so much "better" than n².

## G4 — Rechenregeln für asymptotische Notation (Topic: Big-O proofs / Landau algebra)

**Question:** For f₁,f₂,g₁,g₂,f,g,h: ℕ→ℝ>₀ and constant k∈ℝ>₀, prove:
(a) f∈O(g) ⟺ g∈Ω(f)
(b) f∈o(g) ⟺ g∈ω(f)
(c) o(g)⊆O(g), and ω(g)⊆Ω(g)
(d) O(g)∩Ω(g)=Θ(g), and o(g)∩Ω(g)=∅
(e) f₁∈O(g₁) ∧ f₂∈O(g₂) ⟹ f₁+f₂∈O(max(g₁,g₂))
(f) f₁∈O(g₁) ∧ f₂∈O(g₂) ⟹ f₁·f₂∈O(g₁·g₂)
(g) f∈O(f)
(h) f∈O(g) ∧ g∈O(h) ⟹ f∈O(h)

Definitions given (standard ε-δ style for O, Ω, Θ, o, ω).

**Solution (proof sketches, full detail in source):**
(a) f∈O(g) with constants C,N₀ ⟹ set C′=1/C, N₀′=N₀ gives g∈Ω(f); converse symmetric.
(b) f∈o(g) with ∀c>0∃n₀: taking c′=1/c gives g∈ω(f); converse symmetric using c=1/c′.
(c) f∈o(g) ⟹ taking c=1 in the o-definition gives the O-definition with C=1. For ω⊆Ω: apply (b) then (a)-analog.
(d) Θ(g)⊆O(g)∩Ω(g) trivial from definition (use same N₀=N₀′=M₀). Converse: take M₀=max(N₀,N₀′). For o(g)∩Ω(g)=∅: assume f∈o(g)∩Ω(g), derive contradiction C′g(n)≤f(n)<C′g(n) (using c=C′ in the o-definition).
(e) C=C₁+C₂, N₀=max(N₁,N₂): f₁(n)+f₂(n) ≤ (C₁+C₂)max(g₁(n),g₂(n)).
(f) C=C₁·C₂, N₀=max(N₁,N₂): f₁(n)f₂(n) ≤ C₁C₂g₁(n)g₂(n).
(g) C=1, N₀=1: trivial.
(h) C=C₁C₂, N₀=max(N₁,N₂): f(n)≤C₁g(n)≤C₁C₂h(n).

## G5 — Rechnen mit asymptotischer Notation (Topic: classifying function pairs)

**Question:** For each function pair f(n), g(n) below (k≥1, ε>0, c>1, r<s constants), determine which of O, o, Ω, ω, Θ apply, with justification.

**Given/Solution table:**

| f(n) | g(n) | O(g) | o(g) | Ω(g) | ω(g) | Θ(g) |
|---|---|---|---|---|---|---|
| logᵏ(n) | nᵉ | ✓ | ✓ | ✗ | ✗ | ✗ |
| nᵏ | cⁿ | ✓ | ✓ | ✗ | ✗ | ✗ |
| 2ⁿ | 2^(n/2) | ✗ | ✗ | ✓ | ✓ | ✗ |
| n^log(c) | c^log(n) | ✓ | ✗ | ✓ | ✗ | ✓ |
| nʳ | nˢ | ✓ | ✓ | ✗ | ✗ | ✗ |
| log(n!) | log(nⁿ) | ✓ | ✗ | ✓ | ✗ | ✓ |

**Solution reasoning per row:**
1. logᵏ(n)/nᵉ → 0 as n→∞ (standard limit), so f∈o(g); then by G4, f∈O(g), f∉Ω(g), f∉ω(g), f∉Θ(g).
2. Identical argument to row 1: nᵏ/cⁿ → 0.
3. g(n)/f(n) = 2^(n/2)/2ⁿ = 2^(−n/2) → 0, so g∈o(f); swapping via G4 gives f∈ω(g), f∈Ω(g), f∉O(g), f∉o(g), f∉Θ(g).
4. n^log(c) = 2^(log(n)log(c)) = c^log(n) = g(n), i.e. f=g exactly ⟹ f∈Θ(g) (hence O and Ω too), f∉o(g), f∉ω(g).
5. r<s ⟹ lim nʳ/nˢ = lim n^(r−s) = 0, same argument as row 1.
6. Since n!≤nⁿ ∀n, and log monotonic, log(n!)≤log(nⁿ)=n·log(n) ⟹ f∈O(g), f∉ω(g). For the lower bound: using log(n!)=Σlog(i), split the sum at n/2 and bound below to show log(n!) ≥ (⌊n/2⌋−1)·log(n) ≥ (1/3)·n·log(n) for n≥N₀'=9 with C'=1/3, giving f∈Ω(g) and hence f∈Θ(g), f∉o(g). (Full inequality chain with floor function in source.)

## G6* — Alternative Definitionen für asymptotische Notation (Topic: Landau notation via limits)

**Question:** For f,g:ℕ→ℝ>₀, prove:
(a) f∈O(g) ⟺ (f(n)/g(n))ₙ is a bounded sequence.
(b) f∈o(g) ⟺ (f(n)/g(n))ₙ is a null sequence (limₙ→∞ f(n)/g(n)=0).

**Solution:**
(a) (⟹) f∈O(g) gives C,N₀ with f(n)/g(n)≤C for n≥N₀; finitely many terms before N₀ have a max, so the whole sequence is bounded by max(f(1)/g(1),…,f(N₀−1)/g(N₀−1), C).
(⟸) Let C be an upper bound of the sequence; since f,g>0, C>0, and f(n)≤Cg(n) for all n, so N₀=1 works, giving f∈O(g).
(b) (⟹) f∈o(g) ⟹ ∀c>0 ∃n₀: f(n)<cg(n) for n≥n₀ ⟹ |f(n)/g(n)−0|=f(n)/g(n)<c, which is exactly convergence to 0.
(⟸) limₙ→∞ f(n)/g(n)=0 ⟹ ∀c>0 ∃n₀: f(n)/g(n)<c for n≥n₀ ⟹ f(n)<cg(n), which is exactly the definition of f∈o(g).

## G7* — Landau-Notation als Ordnungsrelation (Topic: order/equivalence relations on function classes)

**Question:** Let F={f:ℕ→ℝ>₀}.
(a) Define f ≤O g :⟺ f∈O(g). Show ≤O is NOT a (partial) order relation.
(b) Define f =Θ g :⟺ f∈Θ(g). Show =Θ is an equivalence relation.
(c) With [f]:={g∈F: g=Θf} and quotient F/=Θ, define [f]≤̃O[g] :⟺ ∀f∈[f]∀g∈[g]: f≤O g. Show ≤̃O is a partial order on the quotient.
(d) Is ≤̃O total? Justify.

**Solution:**
(a) **Not antisymmetric**: take f(n)=n, g(n)=2n. Then f∈O(g) (C=1,N₀=1) and g∈O(f) (C=2,N₀=1), i.e. f≤O g and g≤O f, but f≠g. So ≤O is not a partial order.
(b) Reflexivity: f∈O(f) (by G4g) and f∈Ω(f) (by G4a) ⟹ f∈Θ(f)=O(f)∩Ω(f) (by G4d). Symmetry: f=Θg ⟹ f∈O(g)∩Ω(g) ⟹ (by G4a) g∈Ω(f)∩O(f) ⟹ g=Θf. Transitivity: f=Θg, g=Θh ⟹ f∈O(g), g∈O(h) ⟹ f∈O(h) (G4h); analogously f∈Ω(h) (proven similarly though not literally shown in G4) ⟹ f=Θh.
(c) Reflexivity: for g,h∈[f], g=Θf=Θh ⟹ (transitivity of =Θ) g=Θh ⟹ g∈Θ(h)⊆O(h) (G4d) ⟹ g≤O h ⟹ [f]≤̃O[f]. Antisymmetry: [f]≤̃O[g] and [g]≤̃O[f] ⟹ f∈O(g), g∈O(f) ⟹ (G4a) f∈Ω(g) ⟹ f=Θg ⟹ [f]=[g]. Transitivity: f∈O(g), g∈O(h) ⟹ (G4h) f∈O(h) ⟹ [f]≤̃O[h].
(d) **No, not total.** Counterexample: f(n)=n, g(n)=n^(1+sin(n)). Using G6's characterization: for all k∈ℕ, the set {sin(k+i): i=0..4} contains both a positive and negative value. The sequence f(n)/g(n) = 1/n^sin(n) contains an unbounded subsequence (where sin(n)<0), so f∉O(g). The sequence g(n)/f(n) = n^sin(n) contains an unbounded subsequence (where sin(n)>0), so g∉O(f). Hence [f] and [g] are incomparable under ≤̃O.

---

# Sheet 03

Source: `AuD26_Sheet03-1_260520_170814.pdf` — 9pp, **questions only, no solutions document available for this sheet.** Sommersemester 2026. Veröffentlicht: 04.05.2026. Abgabe: 15.05.2026.

## G1 — Gruppendiskussion (Topic: sorting/algorithms terminology)

Discuss: (a) Divide-and-Conquer paradigm; (b) InsertionSort, MergeSort, QuickSort; (c) Mastermethode; (d) Stability of sorting algorithms. No solution (discussion).

## G2 — Darstellung von Merge-Sort und Quick-Sort (Topic: MergeSort, QuickSort tracing)

**Question part (a):** Array A = [45, 89, 32, 34, 35]. Illustrate MergeSort's operations on A (splits, and merges back into sorted order), marking which subarray is being worked on / already sorted. Use given pseudocode:
```
mergeSort(A, left, right)          // initial left=0, right=A.length-1
1  IF left < right THEN
2    mid = floor((left+right)/2)
3    mergeSort(A, left, mid)
4    mergeSort(A, mid+1, right)
5    merge(A, left, mid, right)

merge(A, left, mid, right)         // requires left <= mid <= right
1  p = left; q = mid+1
2  FOR i = 0 TO right-left DO
3    IF q > right OR (p <= mid AND A[p] <= A[q]) THEN
4      B[i] = A[p]; p = p+1
6    ELSE
7      B[i] = A[q]; q = q+1
9  FOR i = 0 TO right-left DO A[i+left] = B[i]
```
No official solution; a handwritten scratch trace on the scan shows splits: `[45 89 32 34 35]` → `[45 89 32] | [34 35]` → `[45 89] | [32]` → merges back up to `[32 34 35 45 89]`.

**Question part (b):** Array B = [45, 89, 32, 34, 35, 57, 46]. Illustrate QuickSort's operations (array state after every swap performed by `Partition`), marking the pivot and already-sorted entries. Given pseudocode:
```
quicksort(A, left, right)          // initial left=0, right=A.length-1
1  IF left < right THEN
2    q = partition(A, left, right)
3    quicksort(A, left, q)
4    quicksort(A, q+1, right)

partition(A, left, right)          // requires left<right
1  pivot = A[left]
2  p = left-1; q = right+1
3  WHILE p < q DO
4    REPEAT p = p+1 UNTIL A[p] >= pivot
5    REPEAT q = q-1 UNTIL A[q] <= pivot
6    IF p < q THEN Swap(A[p], A[q])
7  return q
```
No official solution provided.

## G3 — Anwendungen des Mastertheorems (Topic: Master theorem, recurrence relations)

**Question:** For each recurrence T(n) below (n>1 unless noted, T(1) and, for (f),(h),(i), also T(2) given constants), decide whether the Master theorem applies; if so, find the asymptotic bound.

(a) T(n) = 3T(5n/2) + n²
(b) T(n) = 4T(n/2) + n²
(c) T(n) = 2ⁿT(n/2) + nⁿ
(d) T(n) = ½T(n/2) + 1/n
(e) T(n) = √2·T(n/2) + log(n)
(f) T(n) = 2T(n/log(n)) + n² (for n>2)
(g) T(n) = 64T(n/8) − n²log(n)
(h) T(n) = 4T(n/2) + n/log(n) (for n>2)
(i) T(n) = 2T(n/2) + n/log(n) (for n>2)
(j) T(n) = 6T(n/3) + n²log(n)
(k) T(n) = 2T(4n/3) + n
(l) T(n) = T(n/2) + 2T(n/4) + n

No solution provided (explicitly stated as also serving as unsolved exam-prep practice).

## G4* — Max-Sort (Topic: sorting algorithm design, selection sort variant, loop invariants, stability)

**Question:** MinSort (aka SelectionSort/ExchangeSort) sorts by repeatedly swapping the first of the smallest remaining elements into the front of the unsorted region. Design the mirror-image **MaxSort**:
(a) Design MaxSort: repeatedly swap the first of the largest remaining elements into the *last* position of the unsorted region, producing ascending order. Give pseudocode + short description.
(b) Prove correctness via a suitable loop invariant.
(c) Analyze the runtime of MaxSort.
(d) Is MaxSort stable? Justify.
(e) Trace MaxSort on A = [45, 89, 32, 34, 35], showing state before each outer-loop iteration.

No solution provided.

## Hausübungen (Sheet 03) — Java programming assignments (Topic: implementation, not transcribable as quiz Q&A; questions only)

General notes: No Java standard library helper methods/data structures allowed unless stated; inputs assumed non-null. Framing story: a "magician" sorting "potions" (Potion objects) via a `SortList<E>` interface (get/set/remove/getSize, fixed size, like an array).

### H1 — Implementierung einfacher Sortieralgorithmen (6 Punkte = 3+3)

(a) **BubbleSort:** implement `public void bubbleSort(SortList<Potion> potions)` in-place, ascending, using only SortList's given methods, per the same BubbleSort pseudocode as Sheet01 H1.

(b) **WeirdlySort** (a "cocktail shaker sort" / bidirectional bubble sort, disguised in a magic-themed narrative): scan left→right swapping adjacent inversions; if no swaps, done; otherwise scan right→left swapping adjacent inversions; repeat with shrinking bounds until no swaps occur. Implement as `weirdlySort(SortList<Potion> potions)`, in-place ascending, same swap order/access pattern as BubbleSort.

(c) (Ungraded) Identify which known sorting algorithm `magicSort(SortList<Potion> potions, int wand1, int wand2)` implements (code not included in this extraction — refer to source Java files).

(d) (Ungraded) Empirically compare runtimes of the three algorithms on lists of size 100/1000/10000 using provided `main` method; reflect on findings.

### H2 — HybridSort - QuickSort mit MergeSort-Fallback (14 Punkte = 4+5+5)

Build a hybrid QuickSort/MergeSort algorithm in class `HybridSort` (package `p1.sort`): QuickSort with a maximum recursion depth `k`; falls back to MergeSort once depth ≥ k. `k` is NOT a bound on subrange size.

(a) **MergeSort fallback (4 pts):** implement `merge` (merges sorted [left,middle] and [middle+1,right]) and `mergeSort` (recursively sorts [left,right] then calls merge). Must not modify values outside [left,right]; all comparisons via HybridSort's Comparator.

(b) **QuickSort with depth limit (5 pts):** implement `partition` (Hoare partition scheme, pivot = `sortList.get(left)`), `quickSort(sortList, left, right)` (starts at depth 0), and `quickSort(sortList, left, right, depth)` (recursive; if `depth >= k`, calls `mergeSort(sortList, left, right)` instead and that branch ends). Recursive QuickSort calls operate on [left, p] and [p+1, right] where p = partition's return value; depth incremented by 1 each recursive call.

(c) **Finding optimal k (5 pts):** In class `HybridOptimizer`, implement `optimize(HybridSort, Object[] array)`: try k=0 up to `K_MAX = ceil(log2(n)) + 4` (n = array length); for each k compute cost = getReadCount()+getWriteCount()+getComparisonsCount() (after running `sort()` on a fresh `ArraySortList` with `setK(k)` set); stop at the **first local minimum** (i.e. stop once next value is strictly greater); if a plateau of equal minimal values occurs, return the **last** index of the plateau.

Worked examples given:
| k | Ex.1 R+W+C | Ex.2 | Ex.3 | Ex.4 |
|---|---|---|---|---|
| 0 | 10 | 10 | 10 | 10 |
| 1 | 9 | 9 | 10 | 9 |
| 2 | 8 | 8 | 8 | 8 |
| 3 | 11 | 7 | 11 | 8 |
| 4 | 12 | 6 | 7 | 11 |

- Example 1: answer k=2 (first local & global min).
- Example 2: answer k=4 (first local & global min; monotonically decreasing until end).
- Example 3: answer k=2 (first local min; global min is at k=4, but k=0 plateau doesn't count since next value must be strictly greater to qualify as the plateau's end — rule: only count as local min if the following value is strictly larger).
- Example 4: answer k=3 (plateau at k=2 and k=3 both minimal; return the last, k=3).

Two fixed test inputs of length 15 given (K_MAX=8 for both):
```
INPUT1 = [3, 10, 6, 2, 4, 8, 5, 7, 1, 13, 12, 0, 14, 11, 9]
INPUT2 = [7, 12, 10, 3, 13, 5, 8, 11, 4, 0, 2, 14, 1, 9, 6]
```
INPUT1: MergeSort fallback pays off before QuickSort gets too deep. INPUT2: QuickSort stays shallow enough that increasing k beyond some point changes nothing — plateau rule returns K_MAX.

### H3 — Radix-Sort (10 Punkte = 7+3)

Magical "rune alphabet" with a **non-alphabetic total order** used as sort keys:

| Kürzel | Runenname | Bucket-Index (order) |
|---|---|---|
| F | Flarebind | 0 (lowest) |
| H | Hollowsong | 1 |
| E | Emberdew | 2 |
| Y | Yearnmist | 3 |
| A | Ashenveil | 4 |
| S | Stormwhisper | 5 |
| D | Duskbane | 6 (highest) |

So: **F < H < E < Y < A < S < D**.

Background: Radix = base of a number system (10 for decimal, 2 for binary, 26 for lowercase Latin letters) = number of buckets needed. RadixSort sorts by bucketing on the least-significant position first, re-merging buckets in order, repeating for each position up to the max length; runs in linear time given known max length.

(a) **RuneIndexExtractor and RadixSort (7 pts):**
- Implement `RuneIndexExtractor` (implements `RadixIndexExtractor<String>`). `extractIndex(String value, int position)` extracts the rune symbol at `position` (position 0 = last character of the string, i.e. least-significant) and returns its bucket index per the table above. Assumes all potion names have equal length and only valid rune symbols.
- Implement in class `RadixSort`: `putBucket(T value, int position)` (uses `indexExtractor` to compute the bucket index for the character at `position` and inserts `value` into that bucket — buckets are FIFO queues, via interface `Bucket` / class `BucketLinkedList`); `sort(SortList<T> sortList)` (sorts per the lecture's RadixSort pseudocode; `maxInputLength` attribute gives number of outer-loop iterations).

(b) **Zaubertränke nach Stärke sortieren (3 pts):** Implement in class `IntegerIndexExtractor`: `extractIndex(Integer value, int position)`, returning the digit of `value` at `position` in base `radix` (position 0 = ones digit / least significant). If `position` exceeds the number's valid digit range, return 0 (zero-padding).

Example (value=25, radix=10):
| position | extractIndex(25, position) |
|---|---|
| 0 | 5 |
| 1 | 2 |
| 2 | 0 (Padding) |
| 3 | 0 (Padding) |

---

# Sheet 04

Source: `AuD26_Sheet04_260514_104941.pdf` (questions, 3pp) + `AuD26_Sheet04-Sol_260519_105058.pdf` (solutions, 8pp). Sommersemester 2026. Veröffentlicht: 11.05.2026 (Sol: 18.05.2026). **Note: this document contains only G1–G5 (Präsenzübungen); no Hausübungen section appears in either the question or solution PDF for Sheet 04.**

## G1 — Gruppendiskussion (Topic: sorting lower bound / RadixSort / ADTs / stacks & queues)

Discuss: (a) lower bound for comparison-based sorting; (b) RadixSort; (c) abstract data types & data structures; (d) Stacks and Queues. No solution (discussion). [Handwritten margin notes on scan: "Ω(n·log n)" for (a); "⟹ Insertion Sort" for (b); "n ≥ n·log n"; array/list sketches for (c)/(d) — student's own annotations, not official.]

## G2 — Radixsort (Topic: RadixSort trace, complexity analysis, non-comparison sorting)

**Question:**
(a) Sort the following list of octal numbers using RadixSort: `54₈ 24₈ 71₈ 10₈ 52₈ 77₈ 33₈`. Show the array configuration at the start of each iteration and the filled buckets within each iteration (including the final terminating iteration).
(b) Prove: RadixSort sorts n b-bit numbers, for positive r≤b, in O((b/r)(n+2ʳ)) steps. How do bucket count and operation count change as r varies? For b>log(n) and b≤log(n), which r is optimal? (Hint: r = number of bits grouped per digit; in G2(a), b=6, r=3, digits range 0–7.)
(c) Is RadixSort always faster than a comparison-based algorithm like QuickSort on the same data?

**Solution:**
(a) Iterations (base-8 digits, LSD first):

i=0 (initial array): `548 248 718 108 528 778 338`
Buckets after sorting by least-significant octal digit:
- bucket 0: 108
- bucket 1: (empty)
- bucket 2: 528
- bucket 3: 338
- bucket 4: 248, 548
- bucket 5: (empty)
- bucket 6: (empty)
- bucket 7: 778

→ i=1 (array after pass 0): `108 718 528 338 548 248 778`

Buckets after sorting by next (most-significant) octal digit:
- bucket 0: (empty)
- bucket 1: 108
- bucket 2: 248
- bucket 3: 338
- bucket 4: (empty)
- bucket 5: 528, 548
- bucket 6: (empty)
- bucket 7: 718, 778

→ i=2 (final, sorted array): `108 248 338 528 548 718 778`

(b) With r≤b bits grouped per digit, each number has d=⌈b/r⌉ digits, each digit ranging 0..2ʳ−1, so D=2ʳ buckets are needed. Each of the d iterations costs O(n+D)=O(n+2ʳ). Total: O(d(n+2ʳ)) = O((b/r)(n+2ʳ)).
- If **b ≤ log n**: optimal r=b (one single digit representing all bits) gives O(n+2ᵇ)=O(n) (since 2ᵇ≤2^(log n)=n).
- If **b > log n**: optimal r=log n, giving runtime O((b/log n)(n+n)) = O(bn/log n) — for larger r the 2ʳ term dominates; for smaller r the b/r term grows.

(c) Asymptotically RadixSort's O(n) beats QuickSort's O(n log n), but asymptotic notation hides constant factors — RadixSort's per-iteration cost may be larger in practice, and RadixSort is **not in-place**, requiring extra memory, so it is not always faster in practice.

## G3 — Multiple-Choice zu Sortierverfahren (Topic: sorting properties, stability, complexity, RadixSort correctness)

**Question + Solution (correct answer bolded, with reasoning):**

(a) **Stability:**
- ☐ QuickSort is stable because it partitions elements only around a pivot. — **False**: standard QuickSort is unstable; partitioning can swap equal-keyed elements past each other.
- ☑ **RadixSort is only correct if the underlying per-digit sort is stable.** — **True**: RadixSort sorts digit by digit; a lower digit's sort order must survive higher-digit passes, requiring stability.
- ☐ MergeSort loses stability when sublists being merged have an odd number of elements. — **False**: MergeSort's stability depends only on the merge-step implementation (e.g. tie-breaking favoring the left element), not on sublist parity.

(b) **InsertionSort runtime:**
- ☑ **Best-case is O(n) when input is already sorted.** — **True**: each element requires only one comparison before InsertionSort determines no shift is needed.
- ☐ Average case is Θ(n log n). — **False**: average case is Θ(n²); Θ(n log n) is typical of divide-and-conquer algorithms like MergeSort.
- ☐ InsertionSort is asymptotically faster than QuickSort in the worst case. — **False**: InsertionSort worst case is Θ(n²); QuickSort average case is Θ(n log n), generally much faster.

(c) **Comparison-based lower bound:**
- ☐ A comparison-based algorithm can sort in O(n) worst-case using a binary search tree. — **False**: a BST can degenerate to O(n) height, giving Θ(n²) total.
- ☐ The Ω(n log n) lower bound only applies to unstable sorting algorithms. — **False**: it applies to every comparison-based algorithm regardless of stability.
- ☑ **Every correct comparison-based sorting algorithm needs at least Ω(n log n) comparisons in the worst case.** — **True**: information-theoretic lower bound — n! permutations require a decision tree of depth log(n!) ≈ n log n.

(d) **RadixSort properties:**
- ☐ RadixSort can sort n elements in sublinear time (strictly less than O(n)). — **False**: every element must be examined at least once; sublinear sorting is impossible.
- ☑ **With fixed key length d, RadixSort sorts in O(n) but is not in-place and needs extra memory.** — **True**: RadixSort uses buckets (lists/queues) requiring O(n) extra space.
- ☐ RadixSort's correctness is preserved sorting MSD→LSD with stacks. — **False**: stacks (LIFO) reverse relative order, destroying stability; also MSD-to-LSD requires recursive partitioning, not simple bucket traversal.

(e) **Worst-case scenarios:**
- ☐ MergeSort has worst-case Θ(n²) when the list is reverse-sorted. — **False**: MergeSort is always Θ(n log n) regardless of input order.
- ☑ **QuickSort has worst-case Θ(n²), triggerable by unlucky pivot choice (e.g. always picking the smallest element).** — **True**: if the pivot always splits into 0 and n−1 elements, recursion depth degenerates to n, giving Σi=1..n i = Θ(n²).
- ☐ RadixSort's runtime is independent of the number of elements n. — **False**: runtime is O(d·n), linear in n.

## G4 — Stacks und Queues (Topic: circular-array queue, array-stack, implementing one ADT via another)

**Question:**
(a) Queue Q on a (initially empty) circular array of size 6. Given the valid end-state where elements 5,6,7,2 are in the queue:

`[2, _, _, 5, 6, 7]` (index 0=2, indices 1-2 empty, index3=5, index4=6, index5=7)

Give a valid **minimal** sequence of enqueue/dequeue operations from an empty queue to reach this state (per lecture implementation: initial front=0, rear=−1).

(b) Stack S on an (initially empty) array of size 6. A classmate performed: push(S,2), push(S,5), pop(S), push(S,7), push(S,1), pop(S) and recorded final array state `[2, 5, 7, 1, _, _]`. This is **incorrect**. Identify the error, give the correct final array state, and name the element logically on top of the stack.

(c) Implement a Queue using two Stacks: pseudocode for `new(Q)`, `isEmpty(Q)`, `enqueue(Q,x)`, `dequeue(Q)`. Analyze asymptotic runtime of all four.

(d) Implement a Stack using two Queues: pseudocode for `new(S)`, `isEmpty(S)`, `push(S,x)`, `pop(S)`. Analyze asymptotic runtime of all four.

**Solution:**
(a) In the target state, 5 is oldest, 2 is newest. front should point to index 3 (oldest=5), rear to index 0 (newest=2). Minimal sequence:
(i) enqueue(1), enqueue(1), enqueue(1) — 3 dummy elements, rear=2.
(ii) dequeue(), dequeue(), dequeue() — removes them, front becomes 3, queue empty but pointers shifted.
(iii) enqueue(5) — writes to index 3, rear=3.
(iv) enqueue(6) — writes to index 4, rear=4.
(v) enqueue(7) — writes to index 5, rear=5.
(vi) enqueue(2) — writes to index 0 (wraps via modulo), rear=0.

(b) **Error:** the classmate ignored the pop operations — a pop should remove the top element and decrement the top-index, but the erroneous trace left every ever-pushed element in the array as if no pop had occurred.

Correct step-by-step:
1. push(S,2): `[2,_,_,_,_,_]`, top-index=0
2. push(S,5): `[2,5,_,_,_,_]`, top-index=1
3. pop(S): returns 5. `[2,_,_,_,_,_]`, top-index=0
4. push(S,7): `[2,7,_,_,_,_]`, top-index=1
5. push(S,1): `[2,7,1,_,_,_]`, top-index=2
6. pop(S): returns 1. `[2,7,_,_,_,_]`, top-index=1

**Correct final state:** `[2, 7, _, _, _, _]`. **Top of stack: 7.**

(c) Queue via two stacks S1,S2: `enqueue` always pushes onto S1. `dequeue` always pops from S2; if S2 is empty, first pop everything off S1 and push onto S2 (reversing order so the oldest ends up on top of S2), then pop from S2.
```
new(Q)                    isEmpty(Q)                 enqueue(Q,x)          dequeue(Q)
11: S1 = new(S1)           21: parse Q=[S1,S2]         31: parse Q=[S1,S2]   41: parse Q=[S1,S2]
12: S2 = new(S2)           22: b1 = isEmpty(S1)        32: push(S1,x)        42: if isEmpty(Q) then
13: Q = [S1,S2]            23: b2 = isEmpty(S2)                              43:   return Error
14: return Q               24: return b1 ∧ b2                               44: if isEmpty(S2) then
                                                                              45:   while ¬isEmpty(S1) do
                                                                              46:     push(S2, pop(S1))
                                                                              47: return pop(S2)
```
Runtime: `new`, `isEmpty`, `enqueue` are O(1); `dequeue` is **O(n)** worst case (amortized O(1) over a sequence, though the question asks worst-case per call).

(d) Stack via two queues Q1,Q2: invariant — one queue is always empty. `push` enqueues onto whichever queue is currently non-empty (if both empty, pick Q2 by convention). `pop` dequeues all-but-last element from the non-empty queue into the other queue (preserving order), then returns/dequeues the last (newest) element.
```
new(S)                     isEmpty(S)                 push(S,x)                    pop(S)
11: Q1=new(Q1)               21: parse S=[Q1,Q2]        31: parse S=[Q1,Q2]          41: parse S=[Q1,Q2]
12: Q2=new(Q2)               22: b1=isEmpty(Q1)         32: if isEmpty(Q1) then      42: if isEmpty(S) then return Error
13: S=[Q1,Q2]                 23: b2=isEmpty(Q2)         33:   enqueue(Q2,x)          44: if isEmpty(Q2) then
14: return S                  24: return b1∧b2          34: else                     45:   t=dequeue(Q1)
                                                          35:   enqueue(Q1,x)          46:   while ¬isEmpty(Q1) do
                                                                                       47:     enqueue(Q2,t)
                                                                                       48:     t=dequeue(Q1)
                                                                                       49: else
                                                                                       50:   t=dequeue(Q2)
                                                                                       51:   while ¬isEmpty(Q2) do
                                                                                       52:     enqueue(Q1,t)
                                                                                       53:     t=dequeue(Q2)
                                                                                       54: return t
```
Runtime: `new`, `isEmpty`, `push` are O(1); `pop` is **O(n)**.

## G5* — Substitutionsmethode (Topic: substitution method, induction, recurrence relations)

**Question:** Recurrences (r,s,t∈ℝ≥₀ constants):
R(n) = R(n−1)+n for n>1, R(1)=r.
S(n) = S(⌈n/2⌉)+1 for n>1, S(1)=s.
T(n) = 2T(⌊n/2⌋)+n for n>1, T(1)=t.
Show using the substitution method: (a) R(n)∈O(n²); (b) S(n)∈O(log₂n); (c) T(n)∈O(n log₂n).

**Solution:**
(a) First show R(n)≥0 ∀n by induction (base: R(1)=r≥0; step: R(n+1)=R(n)+(n+1)≥n+1≥0). Then guess C=max(r,1)≥1, N₀=1, and show R(n)≤Cn² by induction: base R(1)=r≤C=C·1². Step: assuming R(n)≤Cn², R(n+1)=R(n)+(n+1) ≤ Cn²+n+1 ≤ Cn²+2n+1 ≤ Cn²+2Cn+C = C(n+1)² (using n≥1 and C≥1). Hence R(n)∈O(n²).

(b) First show S(n)≥0 ∀n by strong induction (base S(1)=s≥0; step uses 1≤⌈(n+1)/2⌉≤n). Key lemma: ⌈n/2⌉ ≤ (3/4)n for all n≥2 (checked directly for n=2,3; for n≥4: ⌈n/2⌉≤n/2+1=(n+2)/2≤(3/2)n/2=(3/4)n). Choose C=max(s+1,3), N₀=2. Base: S(2)=S(1)+1≤C=C·log₂2. Step: S(n+1)=S(⌈(n+1)/2⌉)+1 ≤ C·log₂((n+1)/2)+1 ≤ C·log₂((3/4)(n+1))+1 = C(log₂3+log₂(n+1)−2)+1 = C·log₂(n+1) + C(log₂3−2)+1 ≤ C·log₂(n+1) (using C≥3). Hence S(n)∈O(log₂n).

(c) First show T(n)≥0 ∀n by strong induction (base T(1)=t≥0; step uses 1≤⌊(n+1)/2⌋≤n, giving T(n+1)≥n+1≥0). Choose C=t+1≥1, N₀=2. Base: T(2)=2T(1)+2=2C≤C·2·log₂2. Step: T(n+1)=2T(⌊(n+1)/2⌋)+(n+1) ≤ 2C·⌊(n+1)/2⌋·log₂(⌊(n+1)/2⌋)+(n+1) ≤ 2C·((n+1)/2)·log₂((n+1)/2)+(n+1) = C(n+1)(log₂(n+1)−1)+(n+1) = C(n+1)(log₂(n+1) −1+1/C) ≤ C(n+1)log₂(n+1) (using C≥1). Hence T(n)∈O(n log₂n).

---

# Sheet 05

Source: `AuD26_Sheet05_260520_190024.pdf` (questions, 5pp) + `AuD26_Sheet05-GrpSol_260526_143047_260527_115031.pdf` (solutions, 16pp — covers only G1–G6 Präsenzübungen; H1–H2 Hausübungen questions are printed on the last 2 pages of the solutions doc but with no official solutions). Sommersemester 2026. Veröffentlicht: 18.05.2026 (Sol: 25.05.2026). Abgabe: 29.05.2026.

## G1 — Gruppendiskussion (Topic: linked lists, binary trees terminology)

Discuss: (a) verkettete Listen (linked lists); (b) binäre Bäume; (c) Inorder/Preorder/Postorder traversal; (d) binäre Suchbäume (BSTs). No solution (discussion).

## G2 — Linked Lists (Topic: singly vs. doubly linked lists, duplicate removal, loop invariant)

**Question:**
(a) Compare singly- and doubly-linked lists, describing advantages of each.
(b) Design a **non-recursive** algorithm removing all duplicates from an unsorted singly-linked list of n elements (each value appears at most once afterward), using **no extra memory** besides O(1) temporary helper variables (no extra lists), running in **O(n²)**. Prove correctness via a loop invariant.

**Solution:**
(a) Advantages of **doubly**-linked lists: can be traversed forwards and backwards; deleting an element is O(1) if you already hold a pointer to it (since you can directly access predecessor and successor), whereas singly-linked lists would need an O(n) scan to find the predecessor.
Advantages of **singly**-linked lists: each element needs less memory (only a successor pointer, vs. both predecessor+successor for doubly-linked); insertion requires fewer pointer updates (only one link vs. two).

(b) Algorithm `RemoveDuplicates(L)`: pointer `a` iterates the list element by element as reference point; for each `a`, a second pointer `b` starts at `a` and scans the rest of the list, checking `b.next`. If `b.next.key == a.key`, remove the duplicate by setting `b.next = b.next.next`; otherwise advance `b = b.next`. Repeat until `a` reaches the list end.
```
RemoveDuplicates(L)
11: a = L.head
12: while a ≠ nil do
13:   b = a
14:   while b.next ≠ nil do
15:     if b.next.key == a.key then
16:       b.next = b.next.next
17:     else
18:       b = b.next
19:   a = a.next
```
**Runtime:** O(n²) — outer loop runs n times, inner loop scans the remaining list each time; worst case (no duplicates) gives (n−1)+(n−2)+...+1 = n(n−1)/2 = Θ(n²) operations.

**Correctness (loop invariant for outer while-loop):** At the start of the i-th outer iteration, the sublist from the head of L up to node `a` contains no duplicates, and for every already-visited node, every further occurrence of its key has been removed from the rest of the list. Initialization: before the first iteration, `a` is the head, the sublist is a single element, trivially duplicate-free. Maintenance: the inner loop fixes `a` and scans all following nodes, removing any node with the same key as `a` (via pointer rewiring), ensuring `a`'s value doesn't recur in the rest of the list; when `a` advances, the invariant holds for the new prefix. Termination: when the outer loop ends, `a=nil`, meaning every node has served as reference, and all its duplicates were removed — the resulting list L contains only unique values. QED.

## G3 — Binäre Bäume (Topic: binary tree terminology, definitions, insert/delete operations)

**Given tree** (as confirmed by the official solution's rendering — authoritative structure):
```
                q
           ┌────┴────┐
           n          t
        ┌──┴──┐        │
        x     c        f
      ┌─┴─┐   │      ┌─┴─┐
      v   w   d      g   m
      │  ┌┴┐         │   │
      b  j o         a   e
```
(q is root; q's children: n, t. n's children: x, c. x's children: v, w. v's child: b. w's children: j, o. c's child: d. t's child: f (right only). f's children: g, m. g's child: a. m's child: e.)

**Question:**
(a) Give the children of n and the parent node of f.
(b) Which nodes are the siblings of d?
(c) Which node is the root?
(d) How many inner nodes and leaves does the tree have?
(e) Give the ancestors of v and the descendants of x.
(f) What is the depth of b? (depth starts at 0)
(g) Give the right subtree of x.
(h) Give English translations of the terms used above.
Then perform, in sequence, on the tree (draw the resulting tree each time):
(i) Insert a node z.
(j) Delete node v.
(k) Delete node f.

**Solution:**
(a) Children of n: **x and c**. Parent of f: **t**.
(b) Node d **has no siblings**.
(c) **q** is the root.
(d) The tree has **10 inner nodes and 6 leaves**.
(e) Ancestors of v: **x, n, q**. Descendants of x: **v, w, b, j, o**.
(f) Depth of node b: **4**. (Full depth chart: q=0, n/t=1, x/c/f=2, v/w/d/g/m=3, b/j/o/a/e=4.)
(g) Right subtree of x = subtree rooted at **w**: w with children j and o.
(h) English translations: Baum→tree; Wurzel→root; Knoten→node; Vorfahre→ancestor; Nachkomme→descendant; Kind→child; Elternteil→parent; Geschwister→sibling; Tiefe→depth; innerer Knoten→inner node; Blatt→leaf (pl. leaves); Teilbaum→subtree.

(i) After inserting z (per BST-style insert algorithm, following the rightmost path since z is treated as larger than everything — the official diagram shows z attached as the new right child hanging off q, i.e. inserted at the "rightmost" position of the tree, replacing where b's position analog would be... **per the solution figure**: z is added as a new node connected directly off the root q on the far right, and node b is marked as removed/replaced — actually the official image shows z newly attached at the top-right (hanging off q) while b gets an X mark; exact insertion target: z becomes attached where indicated in Abbildung 1a of the solution (topmost right, connected to q), and separately the leaf b is crossed out — **[UNCLEAR: exact mechanic of the insert operation diagram — the marks indicate z is inserted at the position vacated when v/b's subtree is later restructured in step (j); refer to the official figure for exact pointer placement]**.
(j) After deleting v: b takes v's place — b becomes a direct child of x in v's old position (v is removed, replaced by z per solution figure's later annotation — solution shows "z" filling in for v with b below, i.e. **v is replaced by z (previously inserted node), and b remains its child**), and separately on the t/f/m branch, e is noted (moved) and m's slot near f gets an X mark [UNCLEAR: exact rebalancing mechanic — see official Abbildung 1b].
(k) After deleting f: node **e replaces f** as the child of t (f had two children g and m; per BST-delete-with-two-children convention, f is replaced by a value from its subtree — e ends up as the new subtree root with g as its child, and a remains g's child; m is removed). Resulting structure per official Abbildung 1c: t's child becomes e; e's children are g and m; g's child is a.

*(Note: parts (i)–(k) involve tree-drawing operations shown only as annotated diagrams in the source with colored circles/crosses in the official solution — exact final pointer structure is best understood from the figures directly; the textual reconstruction above is a best-effort description of the diagram annotations, flagged [UNCLEAR] where the mechanic could not be fully disambiguated from the OCR'd figure.)*

## G4 — Binäre Suchbäume (Topic: BST insert, traversals, delete, reconstruction from postorder, uniqueness of reconstruction)

**Question:**
(a) Insert keys 50, 30, 15, 80, 20, 60, 90, 70 (in this order) into an empty BST. Sketch the resulting tree.
(b) Traverse the tree via Inorder, Preorder, Postorder. Notice anything?
(c) Remove nodes 15, 70, 80 (in this order). Give the resulting tree and, for each deletion, which deletion case applied.
(d) Given postorder traversal `27, 36, 30, 44, 41, 45, 39, 21` of a BST, reconstruct and sketch the tree.
(e) Prove or disprove: "All BSTs with unique values and no half-leaves can be uniquely reconstructed from their inorder traversal alone." (formal proof or minimal counterexample)

**Solution:**
(a) Insertion trace: 50 becomes root. 30≤50 → left child of 50. 15≤30 → left child of 30. 80>50 → right child of 50. 20: ≤50,≤30,>15 → right child of 15. 60: >50,≤80 → left child of 80. 90: >50,>80 → right child of 80. 70: >50,≤80,>60 → right child of 60.

Resulting tree:
```
                50
           ┌────┴────┐
          30          80
        ┌──┘        ┌───┴───┐
       15           60      90
         └──┐         └──┐
           20            70
```

(b) **Inorder:** 15, 20, 30, 50, 60, 70, 80, 90. **Preorder:** 50, 30, 15, 20, 80, 60, 70, 90. **Postorder:** 20, 15, 30, 70, 60, 90, 80, 50. Observation: **the inorder traversal is sorted.**

(c) Deletions in order:
1. **Delete 15**: node 15 has one child (20). Case 1 (single child) — replace 15 with its child 20.
2. **Delete 70**: node 70 is a leaf (no children). Case 1 (no children) — delete directly / replace with nil.
3. **Delete 80**: node 80 has two children, but its right child 90 has no left child. Case 2 (two children, successor is the immediate right child) — replace 80 with its right child 90.

Resulting tree after all three deletions:
```
                50
           ┌────┴────┐
          30          90
            └──┐    ┌──┘
              20   60
```
(matches official Abbildung 5's final state: 50 with children 30 and 90; 30's child is 20; 90's child is 60)

(d) Postorder = (left)∥(right)∥(root), recursively. Root of whole sequence = last element = **21**. Reconstruction process (recursion tree in source): root 21 → right subtree root 39 (from remaining sequence's last element) → 39's children reconstructed from (27,36,30) and (44,41,45) respectively, recursively: 30 is root of left branch with children 27,36 (36 as right child, 27 as left... per solution: 30's children are 27(left),36(right)); 45 is root of right branch, with left child 41, and 41's right child 44.

Reconstructed tree:
```
              21
                └───┐
                    39
                ┌────┴────┐
               30          45
             ┌──┴──┐      ┌──┘
            27     36    41
                              └──┐
                                44
```

(e) **Statement is FALSE.** Counterexample (two different BSTs, both with unique values, no half-leaves — i.e. every internal node has either 0 or 2 children —, and identical inorder traversal 15,20,30,50,60):

Tree 1: root 50, left child 20 (with children 15, 30), right child 60.
Tree 2: root 20, left child 15, right child 50 (with children 30, 60).

Both trees are valid BSTs, values unique, no half-leaves, and both have inorder traversal 15,20,30,50,60 — yet the trees differ. The official solution further proves this counterexample is **minimal** (5 nodes): shown exhaustively that no counterexample exists with 0, 1, 3, or 4 nodes (for 3 nodes exactly one of 5 possible shapes has no half-leaves, and it's uniquely reconstructible from sorted inorder values a,b,c as root b with children a,c; for 4 nodes, of 14 possible shapes, only 4 avoid a half-leaf at the root, but all of those still contain a half-leaf elsewhere).

## G5 — Suchpfade in binären Suchbäumen (Topic: BST search path validity)

**Question:** For each number sequence (representing a search path while searching for a value in a BST), determine whether a BST exists producing that search path; if not, explain why.
(a) 124, 153, 131, 148, 142, 156
(b) 47, 19, 41, 26, 33, 38
(c) 512, 203, 407, 302, 248, 281, 239
(d) 312, 814, 421, 715, 523, 618, 594
(e) 103, 501, 212, 405, 311, 324, 298

**Solution:**
(a) **No valid BST exists.** After branching left at 153 (i.e. going to 131 < 153), the upper bound for all subsequent nodes is fixed at 153. The final value 156 violates this bound (156 > 153, but we're in the "< 153" subtree).
(b) **Valid BST exists** — example tree: 47 → left 19 → right 41 → right 26 → right 33 → right 38 (matches official Abbildung 7a: 47 with left child 19; 19's right child 41; 41's left child 26; 26's right child 33; 33's right child 38).
(c) **No valid BST exists.** After branching right at 248 to 281, the new lower bound is 248. The final value 239 falls below this bound — not allowed.
(d) **Valid BST exists** — example tree: 312 → right 814 → left 421 → right 715 → left 523 → right 618 → right 594 (matches official Abbildung 7b).
(e) **No valid BST exists.** At 311, branching right to 324 sets 311 as the new lower bound for subsequent nodes. The final value 298 violates this bound.

## G6* — Aussagen über Bäume (Topic: strict binary trees / induction, BST-sort complexity, tree rotations)

**Question:**
(a) Prove via induction: a **strict** (full) binary tree with n nodes always has exactly (n+1)/2 leaves. (A strict binary tree: every node has either 0 or 2 children.)
(b) One can sort n numbers by building a BST from them then doing an inorder traversal. What are the worst-case and best-case runtimes? Justify.
(c) Show the BST property is preserved under a **double rotation** (Left-Right rotation): if B is a BST and B′ is obtained from B via an arbitrary Left-Right double rotation, then B′ is also a BST.

**Solution:**
(a) Induction on n (odd values only, since strict binary trees always have an odd node count). Base case n=1: root alone is 1 leaf = (1+1)/2 = 1. ✓. Inductive step: assume true for all strict binary trees with m≤n nodes; consider a strict tree with n+2 nodes. Since n+2>1, the root has two children, roots of a left subtree (n_L nodes) and right subtree (n_R nodes), both themselves strict. By IH, left subtree has (n_L+1)/2 leaves, right has (n_R+1)/2 leaves. Since the root itself isn't a leaf, total leaves = (n_L+1)/2 + (n_R+1)/2 = (n_L+n_R+2)/2. Since total nodes n+2 = n_L+n_R+1, we get n_L+n_R = n+1, so leaves = (n+1+2)/2 = (n+2+1)/2. QED (matches formula for the (n+2)-node tree).

(b) **Worst case:** input already sorted → tree degenerates to a chain of height n. Inserting the i-th element costs i operations, total = 1+2+...+n = Σk=1..n k = (n²+n)/2 = **Θ(n²)**.
**Best case:** tree stays balanced (height O(log n)); each insertion costs O(h)=O(log n); n insertions total **O(n log n)**.

(c) Setup: B is a BST, z a node in B, B′ obtained by a Left-Right double rotation on z (`DoubleRotateLR(B,z)`). Before: subtree rooted at x, with left child α, right child y (y has left subtree β, right subtree γ), and x's right sibling subtree δ under z. After: y becomes the new subtree root, with left child x (children α, β) and right child z (children γ, δ).

Two properties to verify:
- **B′ is a binary tree:** every node keeps at most 2 children — case analysis on v (v outside affected subtree: unchanged; v=parent of z: z replaced by y as child, still ≤2 children; v=y: y's children become x,z, i.e. 2 children; v=x: x's children become α,β, i.e. 2 children; v=z: z's children become γ,δ, i.e. 2 children; v inside α,β,γ,δ: untouched).
- **B′ is a BST (order preserved):** since B was a BST, key(α)≤x.key≤key(β)≤y.key≤key(γ)≤z.key≤key(δ). Case analysis on v: v outside rotated subtree — relative position unchanged. v=x: left subtree α, right subtree β; since α≤x≤β held in original, still valid. v=z: left subtree γ, right subtree δ; since γ≤z≤δ held (γ was in z's left subtree, δ was z's right subtree), still valid. v=y: left subtree {x,α,β} (all ≤y.key originally) — left property holds; right subtree {z,γ,δ} (all ≥y.key originally) — right property holds. v inside α,β,γ,δ: relative position to descendants unchanged. QED.

---

# Hausübungen (Sheet 05) — Questions only, no official solution provided

Source: printed on pp. 15–16 of the Sheet05-GrpSol document (titled "Lösungen der Präsenzübungen" — only G1–G6 have official solutions; H1–H2 are listed but unsolved in this document).

## H1 — Stacks and Queues II (2.5+1.5+4+5 Punkte) (Topic: array-based queue/stack tracing, DoubleStack design, queue reversal)

(a) Queue Q on an (initially empty) array of size 5. Show the array state after each of: enqueue(Q,W); enqueue(Q,R); dequeue(Q); enqueue(Q,A); enqueue(Q,R); enqueue(Q,T); dequeue(Q); enqueue(Q,S); enqueue(Q,T); dequeue(Q).

(b) Stack S on an array of size 6, initially containing 'W','E','L','T'. Show the array state after each of: pop(S); pop(S); pop(S); push(S,'O'); push(S,'R'); push(S,'T').

(c) `DoubleStack` holding two stacks in one array of size n∈ℕ; neither stack should overflow as long as the total element count across both is ≤n. Implement `new`, `push1`, `push2`, `pop1`, `pop2`, all O(1). Pop methods return `L` (error sentinel) if the respective stack is empty; push methods return `o` (error sentinel) if the push would overflow.

(d) Design an **iterative** algorithm that reverses a Queue's order, using only Stacks as auxiliary storage (no other data structures, besides the input queue itself). No return value — reversal happens in-place on the passed queue. No unnecessary copy operations. Justify design and give runtime in O-notation. Also explain briefly why using auxiliary Queues instead of a Stack would require more effort, referencing FIFO vs. LIFO principles.

## H2 — Binäre (Such-)Bäume II (3+3+2+2.5+2.5+4 Punkte) (Topic: traversals, insert/delete, BST construction, Red-Black trees, rotations, delete-order dependence, balanced-tree construction lower bound)

(a) Traverse the given binary tree Inorder, Preorder, Postorder:
```
                10
           ┌────┴────┐
          25          4
        ┌──┴──┐    ┌──┴──┐
        1     30   8     2
```
(Tree: root 10; left child 25 with children 1,30; right child 4 with children 8,2.)

(b) (i) Insert node 99 into the tree from (a). (ii) Delete node 25 from the tree from (a). (iii) Delete root 10 from the tree from (a).

(c) Insert keys 25, 12, 10, 67, 17, 30, 69, 100 (in order) into an empty BST. Document only the states after inserting 67 and after inserting 100. Is the resulting tree a valid Red-Black tree? If yes, color it; if no, briefly explain why not.

(d) Given a BST T with subtree root y, y's left child x (with x's left/right subtrees A, B) and y's right subtree C; let a,b,c be arbitrary nodes in A,B,C with depths dₐ,d_b,d_c:
```
        y
      ┌─┴─┐
      x    C
    ┌─┴─┐
    A   B
```
(i) Perform `rotateRight(T,y)`. Draw the resulting tree; determine new depths d′ₐ,d′_b,d′_c in terms of dₐ,d_b,d_c.
(ii) Perform `rotateRight(T,x)` on the tree resulting from (i). Draw the result (subtrees may be split into root + left + right parts as needed).

(e) Given BST T:
```
                50
           ┌────┴────┐
          20          60
        ┌──┴──┐
       10      30
             ┌───┴───┐
            25        40
                      ┌──┘
                     35
```
Perform the nested deletion `delete(delete(T,30),20)`. Then, separately, perform `delete(delete(T,20),30)` again starting from the **original** T. Document the state after each individual operation. What general lesson about BST deletion operations does this illustrate? Write down your insight.

(f) Given an unsorted list L, give pseudocode for an algorithm taking L and returning the root node of a BST that is as balanced as possible (balanced = at every node, roughly equal node-counts on left and right). What runtime does your algorithm have? What is the minimum possible worst-case runtime such an algorithm must have — prove it. (Hint: you may use sorting algorithms from lecture.)
