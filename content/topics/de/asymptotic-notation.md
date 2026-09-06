---
id: asymptotic-notation
title: "Asymptotische Notation (O, Ω, Θ) & Mastertheorem"
category: "Grundlagen"
order: 2
---

## Die fünf Notationen

| Symbol | Schranke | Informelle Bedeutung |
|---|---|---|
| O(g(n)) | obere Schranke | „nie langsamer als“ — für den **Worst Case** |
| o(g(n)) | strikte obere Schranke | echt langsameres Wachstum als g(n) |
| Ω(g(n)) | untere Schranke | „nie schneller als“ — für den **Best Case** |
| ω(g(n)) | strikte untere Schranke | echt schnelleres Wachstum als g(n) |
| Θ(g(n)) | scharfe Schranke | f(n) = O(g(n)) **und** f(n) = Ω(g(n)) — für Average/exaktes Wachstum |

**Formale Definitionen:**

```
O(g(n)) = { f : ∃ c > 0, n0 ∈ ℕ, ∀ n ≥ n0 : 0 ≤ f(n) ≤ c·g(n) }
Ω(g(n)) = { f : ∃ c > 0, n0 ∈ ℕ, ∀ n ≥ n0 : 0 ≤ c·g(n) ≤ f(n) }
Θ(g(n)) = { f : ∃ c1, c2 > 0, n0 ∈ ℕ, ∀ n ≥ n0 : 0 ≤ c1·g(n) ≤ f(n) ≤ c2·g(n) }
```

**Schnellrezept** für f(n) = 5n² + 2n: den Term mit der höchsten Wachstumsrate nehmen (5n²), die Konstante weglassen → f(n) = Θ(n²) (und damit auch O(n²), Ω(n²)).

### Rechenregeln (gelten für O und Ω gleichermaßen)
- **Konstanten**: f(n) = a (a > 0) ⟹ f(n) = O(1)
- **Skalarmultiplikation**: f(n) = O(g(n)) ⟹ a·f(n) = O(g(n))
- **Addition**: f₁ = O(g₁), f₂ = O(g₂) ⟹ f₁+f₂ = O(max{g₁,g₂}) — Beweis: mit C=C₁+C₂, N₀=max(N₁,N₂) gilt f₁(n)+f₂(n) ≤ (C₁+C₂)·max(g₁(n),g₂(n))
- **Multiplikation**: f₁ = O(g₁), f₂ = O(g₂) ⟹ f₁·f₂ = O(g₁·g₂) — Beweis: mit C=C₁·C₂, N₀=max(N₁,N₂) gilt f₁(n)f₂(n) ≤ C₁C₂g₁(n)g₂(n)
- **Reflexivität**: f = O(f) gilt immer (C=1, N₀=1)
- **Transitivität**: f = O(g), g = O(h) ⟹ f = O(h) — Beweis: C=C₁C₂, N₀=max(N₁,N₂), f(n) ≤ C₁g(n) ≤ C₁C₂h(n)

### Dualität und Beziehungen zwischen den fünf Notationen

Diese Identitäten erlauben es, einen Beweis in einer Notation fast kostenlos in eine andere zu überführen:

- **O/Ω-Dualität**: `f ∈ O(g) ⟺ g ∈ Ω(f)` (Rollentausch: C′ = 1/C lässt dieselbe Ungleichung in die andere Richtung lesen).
- **o/ω-Dualität**: `f ∈ o(g) ⟺ g ∈ ω(f)` (dieselbe Idee, c′ = 1/c).
- **Strikt ⟹ nicht-strikt**: `o(g) ⊆ O(g)` und `ω(g) ⊆ Ω(g)` (c=1 in der o/ω-Definition erfüllt unmittelbar die O/Ω-Definition mit C=1).
- **Θ ist genau der Schnitt**: `O(g) ∩ Ω(g) = Θ(g)`, und — da eine Funktion nicht gleichzeitig *echt* langsamer und *nie* langsamer wachsen kann — `o(g) ∩ Ω(g) = ∅`.

**Alternative Definitionen über Grenzwerte** (oft schneller anzuwenden als die ε/N₀-Definitionen):
- `f ∈ O(g) ⟺` die Folge `(f(n)/g(n))ₙ` ist **beschränkt**.
- `f ∈ o(g) ⟺ limₙ→∞ f(n)/g(n) = 0` (eine **Nullfolge**).

**Eine durchgerechnete Klassifikationstabelle** (k≥1, ε>0, c>1, r<s Konstanten) — eine Schablone, um für ein Funktionspaar abzulesen, welche Notationen gelten:

| f(n) | g(n) | O(g) | o(g) | Ω(g) | ω(g) | Θ(g) |
|---|---|---|---|---|---|---|
| logᵏ(n) | nᵉ | ✓ | ✓ | ✗ | ✗ | ✗ |
| nᵏ | cⁿ | ✓ | ✓ | ✗ | ✗ | ✗ |
| 2ⁿ | 2^(n/2) | ✗ | ✗ | ✓ | ✓ | ✗ |
| n^log(c) | c^log(n) | ✓ | ✗ | ✓ | ✗ | ✓ |
| nʳ | nˢ | ✓ | ✓ | ✗ | ✗ | ✗ |
| log(n!) | log(nⁿ) | ✓ | ✗ | ✓ | ✗ | ✓ |

Begründung je Zeile: (1) `logᵏ(n)/nᵉ → 0` — ein Standardgrenzwert, also `f ∈ o(g)` (und damit `O(g)`, aber nicht `Ω`/`ω`/`Θ`). (2) `nᵏ/cⁿ → 0`, identisches Argument. (3) `g(n)/f(n) = 2^(n/2)/2ⁿ = 2^(-n/2) → 0`, also `g ∈ o(f)` — der Tausch per O/Ω-Dualität liefert `f ∈ ω(g) ⊆ Ω(g)`. (4) `n^log(c) = 2^(log(n)log(c)) = c^log(n)` — die beiden Funktionen sind **exakt gleich**, also `f ∈ Θ(g)` (und damit sowohl `O` als auch `Ω`, aber nicht die strikten `o`/`ω`). (5) `r<s ⟹ nʳ/nˢ = n^(r-s) → 0`, dieselbe Form wie Zeile 1. (6) Da `n! ≤ nⁿ` für alle n gilt, liefert `log(n!) ≤ n·log(n)` bereits `f ∈ O(g)`; eine untere Schranke durch Aufspalten der Summe `log(n!) = Σlog(i)` bei `n/2` liefert `log(n!) ≥ (1/3)·n·log(n)` für `n ≥ 9`, also auch `f ∈ Ω(g)` — zusammen `f ∈ Θ(g)`.

**Warum O allein keine echte Ordnungsrelation ist, Θ aber schon**: Definiere `f ≤O g :⟺ f ∈ O(g)`. Diese Relation ist **nicht antisymmetrisch** — z. B. erfüllen `f(n)=n` und `g(n)=2n` sowohl `f ∈ O(g)` als auch `g ∈ O(f)`, obwohl `f ≠ g`. Definiere stattdessen `f =Θ g :⟺ f ∈ Θ(g)`: Diese Relation **ist** eine echte Äquivalenzrelation (reflexiv über `f∈O(f)∩Ω(f)`, symmetrisch über die O/Ω-Dualität, transitiv über die Transitivität von O, angewandt auf beide Schranken). Fasst man Funktionen zu Äquivalenzklassen `[f] = {g : g =Θ f}` zusammen und ordnet *diese Klassen* per `[f] ≤ [g] :⟺ f ∈ O(g)`, erhält man endlich eine echte Halbordnung — die aber immer noch nicht **total** ist: z. B. sind `f(n)=n` und `g(n)=n^(1+sin(n))` unvergleichbar, da `f(n)/g(n) = n^(-sin(n))` und `g(n)/f(n) = n^(sin(n))` jeweils unbeschränkte Teilfolgen besitzen (jeweils dort, wo `sin(n)` ins Negative bzw. Positive ausschlägt), sodass weder `f∈O(g)` noch `g∈O(f)` gilt.

## Warum die Wachstumsrate in der Praxis zählt

Die asymptotische Notation beschreibt **Trends für große n**, nicht konkrete Laufzeiten — ein kleinerer konstanter Faktor kann einen schlechter wachsenden Algorithmus für jede *feste* Eingabegröße schneller machen, und Anwendungen werden selten mit einer harten Obergrenze für die Eingabegröße gebaut, was genau der Grund ist, warum sich meist das asymptotische (und nicht das exakte) Verhalten zu optimieren lohnt.

**Durchgerechnetes Beispiel** — maximale Eingabegröße `n`, die innerhalb eines gegebenen Zeitbudgets lösbar ist, für `f(n)` in Millisekunden:

| f(n) | 1 Sekunde | 1 Minute | 1 Stunde | 1 Tag | 1 Monat | 1 Jahr | 1 Jahrhundert |
|---|---|---|---|---|---|---|---|
| n | 1.000 | 60.000 | 3,6×10⁶ | 86×10⁶ | 2,59×10⁹ | 32×10⁹ | 3,2×10¹² |
| n·log₂(n) | 140 | 4.895 | 204.095 | 3,9×10⁶ | 97×10⁶ | 1×10⁹ | 87×10⁹ |
| n² | 31 | 244 | 1.897 | 9.295 | 50.911 | 177.583 | 1.775.837 |
| n³ | 10 | 39 | 153 | 442 | 1.373 | 3.159 | 14.664 |
| 2ⁿ | 9 | 15 | 21 | 26 | 31 | 34 | 41 |
| n! | 6 | 8 | 9 | 11 | 12 | 13 | 15 |
| nⁿ | 4 | 6 | 7 | 8 | 9 | 10 | 11 |

Der Abstand zwischen den Zeilen *wächst* mit dem Zeitbudget nur weiter — ein **Jahrhundert** zusätzliches Budget verschafft `n²` gerade knapp zwei Größenordnungen (1.897 → 1.775.837), dem linearen `n` aber ganze 9 Größenordnungen (1.000 → 3,2×10¹²). Das ist die konkrete Bedeutung von „n·log n ist so viel besser als n²“: Der Abstand ist nicht ein einmaliger konstanter Faktor, er *wächst weiter*, je mehr Ressourcen man einsetzt — und genau deshalb ist die Unterscheidung polynomiell gegen exponentiell (oder n log n gegen n²) die, die im großen Maßstab wirklich zählt, und nicht die der Konstanten.

## Rekursionsgleichungen & Mastertheorem

Divide-and-Conquer-Algorithmen haben eine Laufzeit der Form:

```
T(n) = a·T(n/b) + f(n)      (a ≥ 1, b > 1, f(n) asymptotisch positiv)
```

`a` = Anzahl der Teilprobleme, `n/b` = Größe jedes Teilproblems, `f(n)` = Kosten für Teilen/Zusammenfügen außerhalb der rekursiven Aufrufe.

**Mastertheorem** — vergleiche f(n) mit n^(log_b a):

1. Ist f(n) = O(n^(log_b a − ε)) für ein ε > 0 → **T(n) = Θ(n^(log_b a))** (die Rekursion dominiert)
2. Ist f(n) = Θ(n^(log_b a)) → **T(n) = Θ(n^(log_b a) · log n)** (Rekursion und Combine-Schritt sind gleich stark)
3. Ist f(n) = Ω(n^(log_b a + ε)) für ein ε > 0 und gilt a·f(n/b) ≤ c·f(n) für ein c < 1 → **T(n) = Θ(f(n))** (der Combine-Schritt dominiert)

Beispiel: Merge Sort hat T(n) = 2T(n/2) + Θ(n). Hier ist a=2, b=2, also n^(log_b a) = n. f(n) = Θ(n) trifft Fall 2 ⟹ T(n) = Θ(n log n).

## Rekursionen per Substitution lösen (wenn das Mastertheorem nicht greift)

Nicht jede Rekursion hat die Form `a·T(n/b) + f(n)`, die das Mastertheorem braucht (z. B. nicht-konstante Koeffizienten, `n-1` statt `n/b`, in den Basisfall eingebackene additive Konstanten). Die **Substitutionsmethode** beweist eine geratene Schranke `T(n) ≤ C·g(n)` direkt per starker Induktion: Schranke raten, dann den Induktionsschritt algebraisch verifizieren und die Konstante `C` nach Bedarf so anpassen, dass die Ungleichung aufgeht.

**Durchgerechnetes Beispiel** — drei Rekursionen, jede per Substitution als O(·) bewiesen:

- `R(n) = R(n-1) + n` für n>1, `R(1) = r`. **Behauptung: R(n) ∈ O(n²).** Raten: `C = max(r,1)`, `N₀=1`: Basisfall `R(1)=r ≤ C·1²`. Schritt: Unter der Annahme `R(n) ≤ Cn²` gilt `R(n+1) = R(n)+(n+1) ≤ Cn²+n+1 ≤ Cn²+2Cn+C = C(n+1)²` (mit `n≥1, C≥1`). Das ist genau die Rekursion hinter dem **Worst Case von Insertion Sort** — R akkumuliert die arithmetische Reihe `1+2+...+n = Θ(n²)`.
- `S(n) = S(⌈n/2⌉) + 1` für n>1, `S(1) = s`. **Behauptung: S(n) ∈ O(log₂n).** Schlüssellemma: `⌈n/2⌉ ≤ (3/4)n` für n≥2. Raten: `C = max(s+1, 3)`, `N₀=2`: Die Form „halbieren plus Konstante“ ist genau die Rekursion der **binären Suche**.
- `T(n) = 2T(⌊n/2⌋) + n` für n>1, `T(1) = t`. **Behauptung: T(n) ∈ O(n log₂n).** Raten: `C = t+1`: Das ist die Rekursion von **Merge Sort**, hier per Substitution statt per Mastertheorem hergeleitet — dieselbe Antwort, andere Beweistechnik.

## Durchgerechnetes Beispiel: Türme von Hanoi (Rekursion → Rekursionsgleichung → geschlossene Form)

Eine klassische Fallstudie zum Weg von einem rekursiven Algorithmus über eine gelöste Rekursionsgleichung zu einem echten Effizienzurteil.

```
Hanoi(n, i, j):                      // n Scheiben von Stapel i nach Stapel j bewegen, dritten nutzen
  sol = []
  if n > 0 and i != j:
    k = 3 - i - j                    // der dritte Stapel (Bezeichner sind 0,1,2)
    sol = sol ++ Hanoi(n-1, i, k)    // die oberen n-1 Scheiben aus dem Weg nach k bewegen
    sol = sol ++ [(i, j)]            // die große Scheibe i -> j bewegen
    sol = sol ++ Hanoi(n-1, k, j)    // die n-1 Scheiben von k nach j bewegen
  return sol
```

**Rekursionsgleichung für die Zuganzahl** `M(n)`: `M(0) = 0`; für `n>0` (und `i≠j`) gilt `M(n) = 2·M(n-1) + 1` (die Stapelbezeichner sind aus Symmetriegründen irrelevant — jeder rekursive Aufruf ist strukturell dasselbe Problem, eine Größe kleiner).

**Geschlossene Form** per Substitution `P(n) = M(n)+1`: `P(n) = 2P(n-1)`, `P(0)=1` ⟹ `P(n) = 2ⁿ` ⟹ **`M(n) = 2ⁿ − 1`**. Das ist exponentiell, Hanoi ist also **kein effizienter (polynomieller) Algorithmus** — und kann es beweisbar auch nicht sein, denn allein die größte Scheibe erzwingt, dass die n-1 Scheiben darüber zweimal vollständig umgelagert werden (einmal, um sie freizumachen, einmal, um sie wieder aufzustapeln), was genau der Term `2·M(n-1)` ist; eine Induktion über diese Tatsache zeigt, dass `2ⁿ-1` nicht nur erreicht, sondern **optimal** ist — kein Algorithmus löst n-Scheiben-Hanoi mit weniger Zügen.

**Plausibilitätsprüfung zur „Legende der Mönche, die 64 goldene Scheiben umlegen“**: `M(64) = 2⁶⁴-1` Züge sind bei 1 Zug/Sekunde über `2³⁷ ≈ 1,4×10¹¹` Jahre — eine Größenordnung mehr als das Alter des Universums von ~13,8 Milliarden Jahren. Eine anschauliche, konkrete Illustration dessen, was „exponentiell“ tatsächlich kostet, sobald n nicht mehr klein ist.
