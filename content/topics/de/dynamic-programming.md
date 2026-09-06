---
id: dynamic-programming
title: "Dynamische Programmierung, Backtracking & Greedy"
category: "Advanced Design"
order: 1
---

## Dynamische Programmierung (DP)

Wie Divide & Conquer zerlegt DP ein Problem in Teilprobleme — aber die Teilprobleme der DP **überlappen sich** (dasselbe Teilproblem tritt vielfach auf), weshalb DP **memoisiert**: die Lösung jedes Teilproblems beim ersten Berechnen speichern und danach nachschlagen statt neu berechnen.

Zwei äquivalente Stile:
- **Top-down (Memoisierung)**: die natürliche Rekursion schreiben, die Ergebnisse aber in einer Tabelle zwischenspeichern, geschlüsselt nach den Teilproblem-Parametern.
- **Bottom-up (Tabellierung)**: die Reihenfolge bestimmen, in der die Teilprobleme voneinander abhängen, und eine Tabelle iterativ ab den Basisfällen füllen.

**Wann ist DP anwendbar?** Das Problem braucht beides:
1. **Optimale Teilstruktur** — eine optimale Lösung setzt sich aus optimalen Lösungen von Teilproblemen zusammen.
2. **Überlappende Teilprobleme** — dasselbe Teilproblem wird mehrfach gebraucht (genau das unterscheidet DP von reinem Divide & Conquer; Merge Sort etwa hat eine optimale Teilstruktur, aber *keine* überlappenden Teilprobleme, sodass Memoisierung dort nichts bringt).

### Durchgerechnetes Beispiel — Treppensteigen (Top-down-Memoisierung)

**Aufgabe**: Eine Treppe hat `n` Stufen; jeder Zug führt genau 1 oder 2 Stufen nach oben. Wie viele verschiedene Zugfolgen erreichen das obere Ende?

**Rekursionsgleichung**: Sei `a_k` die Anzahl der Wege, von Stufe `k` aus oben anzukommen:

```
a_k = a_{k+1} + a_{k+2}   für k < n
a_n = 1                    (schon oben: genau ein, leerer, Weg)
a_k = 0                    für k > n   (übersprungen — ungültig)
```

Für `n = 4`: `a4=1, a5=0 ⟹ a3=a4+a5=1, a2=a3+a4=2, a1=a2+a3=3, a0=a1+a2=5` — **5 Wege**, 4 Stufen zu steigen.

```
MemClimbStairs(n):
  A = newArray(n+1); mit -1 füllen        // -1 markiert „noch nicht berechnet“
  return MemClimbStairsAux(A, n, 0)

MemClimbStairsAux(A, n, r):
  if r > n: return 0
  if r == n: return 1
  if A[r] != -1: return A[r]             // bereits berechnet — wiederverwenden
  A[r] = MemClimbStairsAux(A, n, r+1) + MemClimbStairsAux(A, n, r+2)
  return A[r]
```

Die Prüfung `if A[r] != -1` ist die gesamte Idee der Memoisierung in einer Zeile: Ohne sie ist das die naive Θ(2ⁿ)-Rekursion (in Fibonacci-Form); mit ihr wird jedes der `n+1` Teilprobleme genau einmal gelöst, was **Θ(n)** ergibt.

### Durchgerechnetes Beispiel — Minimale Editierdistanz (Levenshtein-Distanz, Bottom-up-Tabellierung)

**Aufgabe**: die minimale Anzahl von Einfüge-, Lösch- und Ersetzungsoperationen einzelner Zeichen, um den String `X` in `Y` zu überführen.

**Warum es überlappende Teilprobleme hat**: Die Berechnung von `D[i][j]` (der Editierdistanz zwischen `X[1..i]` und `Y[1..j]`) benötigt `D[i-1][j-1]`. Genau *dasselbe* Teilproblem `D[i-1][j-1]` wird *außerdem* direkt von den Berechnungen von `D[i-1][j]` und `D[i][j-1]` gebraucht — eine naive rekursive Lösung würde es wiederholt neu berechnen, während eine DP-Tabelle (bottom-up gefüllt oder top-down memoisiert) jedes Paar `(i,j)` genau einmal löst: **Θ(mn)** statt exponentiell.

**Rekursionsgleichung** (mit Einheitskosten — Einfügen/Löschen/Ersetzen kosten je 1, das Kopieren eines gleichen Zeichens kostet 0):

```
D[i][0] = i                              // alle i Zeichen des X-Präfixes löschen
D[0][j] = j                              // alle j Zeichen des Y-Präfixes einfügen
D[i][j] = min(
  D[i-1][j-1] + (X[i] != Y[j] ? 1 : 0),  // ersetzen (oder kostenloses Kopieren bei Gleichheit)
  D[i-1][j] + 1,                         // X[i] löschen
  D[i][j-1] + 1,                         // Y[j] einfügen
)
```

**Durchgerechnetes Beispiel**: `X = TIGER` (Länge 5), `Y = WINTER` (Länge 6). Die gefüllte Tabelle:

| D | ∅ | T | I | G | E | R |
|---|---|---|---|---|---|---|
| **∅** | 0 | 1 | 2 | 3 | 4 | 5 |
| **W** | 1 | 1 | 2 | 3 | 4 | 5 |
| **I** | 2 | 2 | 1 | 2 | 3 | 4 |
| **N** | 3 | 3 | 2 | 2 | 3 | 4 |
| **T** | 4 | 3 | 3 | 3 | 3 | 4 |
| **E** | 5 | 4 | 4 | 4 | 3 | 4 |
| **R** | 6 | 5 | 5 | 5 | 4 | **3** |

`D[5][6] = 3`: TIGER lässt sich mit 3 Bearbeitungen in WINTER überführen. Verfolgt man den Pfad von `D[5][6]` zurück bis `D[0][0]` (und bevorzugt bei übereinstimmenden Zeichen stets die Diagonale — ein kostenloses Kopieren), so ergibt sich die Operationsfolge **sub(T→W), copy(I), ins(N), sub(G→T), copy(E), copy(R)**.

**Gewichtete Verallgemeinerung**: Haben Einfügen/Löschen/Ersetzen unterschiedliche Kosten `cost_ins`, `cost_del`, `cost_sub`, so wird die Rekursionsgleichung zu `D[i][j] = min(D[i-1][j-1] + cost(X[i],Y[j]), D[i-1][j] + cost_del, D[i][j-1] + cost_ins)` mit `cost(a,b) = 0` falls `a=b`, sonst `cost_sub`; die Randzeile/-spalte werden zu `D[i][0] = i·cost_del` und `D[0][j] = j·cost_ins`.

## Backtracking

Erkundet systematisch alle Lösungskandidaten, indem es sie schrittweise aufbaut und **einen Teilkandidaten aufgibt („beschneidet“), sobald er unmöglich zu einer gültigen Lösung führen kann** — genau dieses Beschneiden macht Backtracking in der Praxis weit schneller als eine Brute-Force-Aufzählung, auch wenn der Worst Case exponentiell bleibt. Klassische Beispiele: N-Damen-Problem, Sudoku-Lösen, Aufzählung von Teilmengensummen, Labyrinth-Wegfindung, Graphfärbung.

**Struktur**: Backtracking ist im Kern eine **Tiefensuche über dem Raum der Teillösungen**. In jedem Schritt: (1) prüfen, ob der aktuelle Teilkandidat bereits eine vollständige, gültige Lösung ist — wenn ja, zurückgeben; (2) andernfalls prüfen, ob er *überhaupt noch* zu einer erweitert werden kann — wenn nicht, **die letzte Entscheidung verwerfen und die nächste Alternative probieren** („Rückzug“ in den vorherigen Zustand); (3) andernfalls um eine weitere Entscheidung erweitern und rekursieren.

### Durchgerechnetes Beispiel — Word Search

**Aufgabe**: Gegeben ein 2D-Buchstabengitter und ein Zielwort: entscheide, ob das Wort durch einen Pfad horizontal/vertikal benachbarter Zellen nachgezeichnet werden kann, wobei jede Zelle **höchstens einmal** verwendet wird.

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
  if r == length(word): return (true, path)         // vollständiges Wort bereits gefunden
  invalid = (i<0) or (j<0) or (i>=rows) or (j>=cols)
            or board[i][j] != word[r] or contains(path, (i,j))
  if invalid: return (false, path)                  // beschneiden: Sackgasse
  append(path, (i,j))
  dr = [1,-1,0,0]; dc = [0,0,1,-1]                   // 4 Nachbarrichtungen
  for k = 0 to 3:
    (isFound, path) = WordSearchBTR(board, word, i+dr[k], j+dc[k], path)
    if isFound: return (true, path)
  remove(path, (i,j))                                // Backtracking: Entscheidung zurücknehmen
  return (false, path)
```

Das **Beschneiden** ist die `invalid`-Prüfung (außerhalb des Gitters, falscher Buchstabe oder Zelle in diesem Pfad schon benutzt) — sie beendet die Erkundung eines Zweigs in dem Moment, in dem er beweisbar hoffnungslos ist. Das **Backtracking** ist `remove(path, (i,j))` unmittelbar vor der Rückgabe von `false` — es nimmt die versuchsweise Entscheidung zurück, damit der nächste Nachbarversuch des Aufrufers von einem sauberen Zustand startet, genau der Schritt „zurückziehen und die nächste Alternative probieren“.

## Greedy-Algorithmen

Bauen eine Lösung, indem sie in jedem Schritt die **lokal optimale** Entscheidung treffen — allein die aktuelle Situation betrachtend, nie deren Auswirkung auf spätere Entscheidungen — und diese nie revidieren. Deutlich schneller als DP, wo anwendbar, aber **liefern nur dann eine global optimale Lösung, wenn das Problem die „Greedy-Choice-Eigenschaft“ besitzt** — was nicht auf jedes Problem zutrifft.

### Wo Greedy scheitert — zwei konkrete Gegenbeispiele

**Münzwechsel** (die Anzahl der Münzen für einen gegebenen Betrag minimieren, Nennwerte {1, 3, 4}, Ziel 6): Greedy nimmt stets den größten passenden Nennwert, also **4 + 1 + 1 = 3 Münzen**. Das echte Optimum ist **3 + 3 = 2 Münzen**. Die lokal beste Wahl von Greedy (die größte verfügbare Münze) hinterlässt einen Restbetrag, der sich schlecht günstig aufbrauchen lässt — für beliebige Nennwerte braucht man eine DP über „minimale Münzanzahl für jeden Betrag bis zum Ziel“, um Optimalität zu garantieren.

**0/1-Rucksack gegen fraktionalen Rucksack**: Gegeben Objekte mit Gewicht `g_k` und Wert `w_k` sowie Kapazität `G_max = 50`:

| Objekt k | Wert `w_k` | Gewicht `g_k` | Verhältnis `d_k = w_k/g_k` |
|---|---|---|---|
| 1 | 60 | 10 | 6 |
| 2 | 100 | 20 | 5 |
| 3 | 120 | 30 | 4 |

- Der **fraktionale** Rucksack (Objekte dürfen geteilt werden, z. B. ein halbes Hemd nehmen) **wird von Greedy korrekt gelöst**: absteigend nach dem Verhältnis `d_k` sortieren, die Kapazität mit dem besten Verhältnis zuerst füllen und vom letzten, nicht mehr vollständig passenden Objekt einen Bruchteil nehmen. Für die fraktionale Variante IST das optimal.
- Der **0/1**-Rucksack (jedes Objekt ganz oder gar nicht): Dasselbe Greedy — Objekt 1 nehmen (Verhältnis 6, verbraucht 10), dann Objekt 2 (Verhältnis 5, verbraucht 20, Gesamtgewicht 30 ≤ 50) — endet dort, da Objekt 3 nicht mehr passt, für einen Gesamtwert von **60 + 100 = 160**. Das echte Optimum sind aber die Objekte **2 + 3 = 100 + 120 = 220** (Gewicht 20+30=50, exakt voll) — echt besser, und Greedy findet es nie, weil die frühe Festlegung auf das *ganze* Objekt 1 eine bessere Kombination verbaut. **Der 0/1-Rucksack braucht DP**, nicht Greedy, und zwar genau deshalb, weil ihm die Greedy-Choice-Eigenschaft fehlt, sobald Objekte nicht geteilt werden können.

Probleme, die die Greedy-Choice-Eigenschaft tatsächlich *besitzen* (für die Greedy also korrekt optimal ist): **fraktionaler Rucksack**, **MST nach Kruskal/Prim**, **kürzeste Wege nach Dijkstra** (bei nicht-negativen Gewichten).

## Metaheuristiken (kurz)

Allzweckstrategien für schwere Such-/Optimierungsprobleme, bei denen exakte Algorithmen zu langsam sind: z. B. **Simulated Annealing** — wie eine lokale Suche (stets zu einem besseren Nachbarn wechseln), akzeptiert aber gelegentlich einen *schlechteren* Schritt (mit einer über die Zeit fallenden Wahrscheinlichkeit, analog zu einer abkühlenden Temperatur), um lokalen Optima zu entkommen.

## Fast Fourier Transform (FFT)

Ein weiterer Divide-&-Conquer-Algorithmus, ohne Bezug zu DP/Backtracking/Greedy, aber hier unter „fortgeschrittene algorithmische Techniken“ eingeordnet. Multipliziert zwei Polynome vom Grad (n−1) in **Θ(n log n)** statt im naiven Θ(n²) (jedes Koeffizientenpaar multiplizieren).

**Die dreistufige Idee**:
1. **Koeffizienten → Punkt-Wert**: Statt direkt mit den `n` Koeffizienten `a_0, …, a_{n-1}` eines Polynoms zu arbeiten, wird es an `n` geschickt gewählten Punkten ausgewertet, um `n` Paare `(x, p(x))` zu erhalten — die „Punkt-Wert“-Darstellung. (Dieser Schritt ist die FFT selbst.)
2. **Punktweise multiplizieren**: Zwei Punkt-Wert-Darstellungen an *übereinstimmenden* x-Stellen zu multiplizieren sind einfach `n` unabhängige Skalarmultiplikationen — **Θ(n)**.
3. **Punkt-Wert → Koeffizienten**: Die Punkt-Wert-Darstellung des Produkts per **inverser FFT** zurück in Koeffizienten überführen.

**Warum die FFT-Auswertung schnell ist**: Sie wertet das Polynom nicht an `n` beliebigen Punkten aus, sondern an den `n`-ten **Einheitswurzeln** `ω_n^0, ω_n^1, …, ω_n^{n-1}` (mit `ω_n = e^{2πi/n}`), die `(ω_n^j)² = (ω_n^{j+n/2})²` für jedes `j` erfüllen — die Auswertung an allen `n` Wurzeln reduziert sich damit (durch Aufspalten des Polynoms in seine gerade- und ungerade-indizierten Koeffizienten, `p(x) = p_even(x²) + x·p_odd(x²)`) auf die Auswertung **zweier halb so großer Polynome an je nur `n/2` Punkten** (die quadrierten Werte sind die `(n/2)`-ten Einheitswurzeln). Die Rekursion liefert die Schranke Θ(n log n).

### Durchgerechnetes Beispiel

Polynom `p(x) = 3 + 2x + x³` → Koeffizientenvektor `[3, 2, 0, 1]` (Grad 3, also genügen `n = 4` Punkte für eine eindeutige Punkt-Wert-Darstellung — auch wenn `2n−1` Punkte nötig wären, wenn das *Ergebnis einer Multiplikation* — Grad bis `2n-2` — eindeutig rekonstruierbar sein soll).

Aufspalten in gerade-/ungerade-indizierte Koeffizienten: `p_even(y) = 3 + 0y` (aus `a_0, a_2`), `p_odd(y) = 2 + 1y` (aus `a_1, a_3`), also `p(x) = p_even(x²) + x·p_odd(x²)`.

Die Auswertung von `FFT([2,1], n=2, w=ω_8²)` (der rekursive Aufruf für `p_odd`, mit `ω_8²`, da das Quadrieren die effektive Wurzel halbiert) an den Punkten `[1, ω_8², ω_8⁴, ω_8⁶]` ergibt `[3, 2+i, 1, 2−i]` (mit `p_odd(y) = 2 + y`: bei `y=1` → 3, bei `y=ω_8²=i` → `2+i`, bei `y=ω_8⁴=-1` → 1, bei `y=ω_8⁶=-i` → `2-i`).

Zusammenführen per `p(x) = p_even(x²) + x·p_odd(x²)` an jedem der 4 Punkte:
```
x=1:      p_even(1) + 1·p_odd(1)     = 3 + 1·3     = 6
x=ω_8:    p_even(ω_8²) + ω_8·p_odd(ω_8²)  = 3 + ω_8·(2+i)  = 3+i
x=ω_8²:   p_even(ω_8⁴) + ω_8²·p_odd(ω_8⁴) = 3 + i·1        = 3+i
x=ω_8³:   p_even(ω_8⁶) + ω_8³·p_odd(ω_8⁶) = 3 + ω_8³·(2-i) = 3-i
```
(Die exakten Werte hängen von den konkreten komplexen Wurzeln `ω_8^k` ab; die zu merkende Kernmechanik ist die Gerade/Ungerade-Aufspaltung plus der Zusammenführungsschritt `p_even(x²) + x·p_odd(x²)`, rekursiv wiederholt bis zu den Basisfällen vom Grad 0, wo trivial `FFT([a], n=1, w) = [(1,a), (w,a)]` gilt.)

**Warum 2n Punkte und nicht n**: Die Punkt-Wert-Form eines Polynoms der Größe n braucht nur `n` Punkte, um eindeutig bestimmt zu sein — aber die Multiplikation zweier solcher Polynome erzeugt ein Ergebnis vom Grad bis zu `2n-2`, das `2n-1` Punkte zur eindeutigen Rekonstruktion braucht. In der Praxis wertet die FFT-basierte Multiplikation beide Eingabepolynome an `2n` Punkten aus (der nächsten bequemen Zweierpotenz), bevor der punktweise Multiplikationsschritt folgt.

## Die drei Paradigmen im Vergleich

| Paradigma | Revidiert frühere Entscheidungen? | Garantiert Optimalität? | Typische Komplexität |
|---|---|---|---|
| Greedy | Nie | Nur bei Greedy-Choice-Eigenschaft | Schnell (oft O(n log n)) |
| Backtracking | Ja — explizites Zurücknehmen/Zurückziehen | Ja (erschöpfend, mit Beschneiden) | Exponentiell im Worst Case |
| Dynamische Programmierung | Implizit, über memoisierte Teilprobleme | Ja (bei optimaler Teilstruktur) | Polynomiell (Teilproblemanzahl × Arbeit pro Teilproblem) |
