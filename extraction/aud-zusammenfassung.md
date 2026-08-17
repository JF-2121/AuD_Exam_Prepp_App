# AuD - Zusammenfassung (Transcription)

Source: AuD-Zusammenfassung_260512_113828_260512_113945.pdf (128 pages)
Author: Moritz Gerhardt (LaTeX version, github: moricetamol)

Table of Contents (as printed on page 1):
1. Inhaltsverzeichnis
2. Was ist ein Algorithmus?
3. Laufzeitanalyse (3.1 O Notation, 3.2 Ω Notation, 3.3 Θ Notation, 3.4 Rekursiongleichungen)
4. Sortieren (4.1 Sortierproblem, 4.2 Insertion Sort, 4.3 Bubble Sort, 4.4 Merge Sort, 4.5 Quicksort, 4.6 Radix Sort)
5. Grundlegende Datenstrukturen (5.1 Stacks, 5.2 Queues, 5.3 Linked List, 5.4 Binary Search Tree)
6. Fortgeschrittene Datenstrukturen (6.1 Red-Black Tree, 6.2 AVL Trees, 6.3 Splay Trees, 6.4 Binary Heap Trees, 6.5 B-Tree)
7. Probabilistische Datenstrukturen (7.1 Deterministisch und Probabilistisch, 7.2 Skip-Lists, 7.3 Hash Tables, 7.4 Bloom Filter)
8. Graphen Algorithmen (8.1 Graphen, 8.2 BFS, 8.3 DFS, 8.4 SCC, 8.5 MST, 8.6 Kürzesten Pfade, 8.7 Maximaler Fluss)
9. Advanced Design (9.1 Divide & Conquer, 9.2 Backtracking, 9.3 Dynamic Programming, 9.4 Greedy Algorithms, 9.5 Metaheuristiken)
10. NP (10.1 Leichte Probleme, 10.2 Berechnungs- & Entscheidungsprobleme, 10.3 Komplexitätsklasse P, 10.4 Komplexitätsklasse NP, 10.5 NP-Vollständigkeit)

---

## 2 Was ist ein Algorithmus?

Ein Algorithmus beschreibt eine Handlungsvorschrift zur Umwandlung von Eingaben in eine Ausgabe.
Dabei sollte ein Algorithmus im allgemeinen folgende Voraussetzungen erfüllen:

1. **Bestimmt:**
   - Determiniert: Bei gleicher Eingabe liefert der Algorithmus gleiche Ausgabe.
     ⟹ Ausgabe nur von Eingabe abhängig, keine äußeren Faktoren.
   - Determinismus: Bei gleicher Eingabe läuft der Algorithmus immer gleich durch die Eingabe.
     ⟹ Gleiche Schritte, Gleiche Zwischenstände.
2. **Berechenbar:**
   - Finit: Der Algorithmus ist als endlich definiert. (Theoretisch)
   - Terminierbar: Der Algorithmus stoppt in endlicher Zeit. (Praktisch)
   - Effektiv: Der Algorithmus ist auf Maschine ausführbar.
3. **Andwendbar:**
   - Allgemein: Der Algorithmus ist für alle Eingaben einer Klasse anwendbar, nicht nur für speziellen Fall.
   - Korrekt: Wenn der Algorithmus ohne Fehler terminiert, ist die Ausgabe korrekt.

---

## 3 Laufzeitanalyse

### 3.1 O Notation

Die O-Notation wird grundsätzlich für *Worst-Case* Laufzeiten verwerdendet. Sie gibt also eine obere Schranke an, die der Algorithmus im schlechtesten Fall erreicht. Dabei wird oft zwischen Big O-Notation und Little o-Notation unterschieden.

Diagram description: Graph with axes n (x) and f(n) (y). Curve labeled f(n) (wiggly then rising) stays below a smooth curve labeled c·g(n) for all n ≥ n0, with n0 marked on x-axis with dashed vertical line. Label at top: f(n) = O(g(n)). (Quelle: DevTut)

#### 3.1 (a) Big-O Notation

Mathematische Definition:

```
O(g(n)) = {f : ∃c ∈ ℝ>0, n0 ∈ ℕ, ∀n ≥ n0 : 0 ≤ f(n) ≤ c · g(n)}
```

Es existieren die positiven Konstanten c und n0, sodass für alle n ≥ n0 gilt, dass f(n) ≥ 0 und f(n) ≤ c · g(n). Das bedeutet, dass die Funktion f(n) für n → ∞ den gleichen Wachstumsfaktor hat wie die Funktion g(n). Einfache Berechnung findet wie folgt statt (anhand vom Beispiel f(n) = 5n² + 2n):

1. Finde den Term mit dem höchsten Wachstumsfaktor (5n²)
2. Konstanten werden weggelassen (n²)
3. Demnach ist f(n) = O(n²)

Dies kann man dann im Rückschluss so anwenden: Um die Konstanten c und n0 zu finden, wird die obige Gleichung benutzt:

1. Simplifiziere die Ungleichung 5n² + 2n ≤ c · n² zu 5 + 2/n ≤ c
2. Da n ≥ n0 kann man die Gleichung für n ≥ 1 auflösen um die Konstanten c und n0 zu finden.
   ⟹ 5 + 2/1 = 7 ≤ c ⟹ c ≥ 7
3. Dementsprechend kann man dann die Konstanten c = 7 und n0 = 1 auswählen.

#### 3.1 (b) Little-o Notation

Mathematische Notation:

```
o(g(n)) = {f : ∃c ∈ ℝ>0, n0 ∈ ℕ, ∀n ≥ n0 : 0 ≤ f(n) < c · g(n)}
```

Es existieren die positive Konstanten c und n0, sodass für alle n ≥ n0 gilt, dass f(n) ≥ 0 und f(n) < c·g(n). Little-o Notation unterscheidet sich also von Big-O Notation nur oberen Schranke. Während bei Big-O der Wachstumsfaktor beider Funktion gleich sein kann (f(n) = c · g(n)), gilt bei Little-o, dass der Wachstumsfaktor der Funktion f(n) kleiner ist als der Wachstumsfaktor der Funktion g(n).

Einfache Berechnung findet analog zu Big-O wie folgt statt (anhand vom Beispiel f(n) = 5n² + 2n):

1. Finde den Term mit dem höchsten Wachstumsfaktor (5n²)
2. Konstanten werden weggelassen (n²)
3. Demnach ist f(n) = o(n²)

Hier muss allerdings noch geprüft werden, ob der Wachstumsfaktor der Funktion f(n) kleiner ist als der Wachstumsfaktor der Funktion g(n). Wenn ja, ist die Little-o Notation korrekt für g(n).

Um zu zeigen, dass f(n) = o(g(n)):

1. Finde den Limes des simplifizierten Ausdrucks f(n)/g(n), der die Wachstumsrate der Funktion f(n) zur Wachstumsrate der Funktion g(n) vergleicht.
   - lim_{n→∞} f(n)/g(n) = lim_{n→∞} (5n²+2n)/n² = lim_{n→∞} 5 + 2/n = 5
     ⟸ 2/n für n → ∞ → 0
2. Da der Limes ≠ 0 ist, bedeutet das, dass das Wachstum von f(n) nicht geringer ist als das von g(n). Deshalb müssen wir den Polynomgrad hochgehen, weswegen f(n) = o(n³) sein muss.
3. Um nun die Konstanten c und n0 zu finden müssen wir einfach f(n)/g(n) auflösen
   - (5n²+2n)/n³ < c
   - 5/n + 2/n² < c
   - 5/n < c, da 2/n² für n → ∞ schneller abfällt als 5/n
   - Für c = 1 muss dann n0 > 5 sein und kann somit als n0 = 6 gewählt werden.

#### 3.1 (c) Rechenregeln

Sind sowohl für Big-O als auch Little-o gültig

- **Konstanten:**
  f(n) = a mit a ∈ ℝ>0 ⟹ f(n) = O(1)
  Ist die Funktion konstant, so ist die Komplexität O(1).
- **Skalare Multiplikation:**
  f(n) = O(g(n)) ⟹ a · f(n) = O(g(n))
  Multiplikation der Funktion ändert die Komplexität nicht.
- **Addition:**
  f1(n) = O(g1(n)), f2(n) = O(g2(n)) ⟹ f1(n) + f2(n) = O(max{g1(n), g2(n)})
  Die Komplexität der Summe zweier Funktionen ist der Maximalwert der Komplexität der beiden Funktionen.
- **Multiplikation:**
  f1(n) = O(g1(n)), f2(n) = O(g2(n)) ⟹ f1(n) · f2(n) = O(g1(n) · g2(n))
  Die Komplexität des Produkts zweier Funktionen ist das Produkt der Komplexität der beiden Funktionen.

### 3.2 Ω Notation

Ähnlich zur O Notation, allerdings geht es hier um den *Best-Case* also minimale Anzahl der Schritte, die ein Algorithmus ausführt.

Diagram description: Graph with axes n (x) and f(n) (y). Curve f(n) stays above curve c·g(n) for n ≥ n0 (dashed vertical line at n0). Label at top: f(n) = Ω(g(n)). (Quelle: DevTut)

Wird auch wieder in Ω und ω aufgeteilt, die sich nur darin unterscheiden, wie strikt die Grenze ist.

#### 3.2 (a) Ω Notation

Mathematische Definition:

```
Ω(g(n)) = {f : ∃c ∈ ℝ>0, n0 ∈ ℕ, ∀n ≥ n0 : 0 ≤ c · g(n) ≤ f(n)}
```

Es existieren die positiven Konstanten c und n0, sodass für alle n ≥ n0 gilt, dass 0 ≤ c · g(n) ≤ f(n). Das bedeutet, dass der Wachstumsfaktor von f(n) ≥ c · g(n) ist. Die Berechnung von Ω ist leider nicht immer so simpel wie die Berechnung von O Notation. Nehme zum Beispiel einen Linearen Suchalgorithmus, der eine Liste so lange durchläuft, bis er die gesuchte Zahl gefunden hat. Die Komplexität ist O(n), da, wenn das Element an letzter Stelle steht alle Eingaben durchlaufen werden müssen. Gleichermaßen kann es aber sein, dass das Element an erster Stelle steht, was dann die Komplexität Ω(1) besitzt. Dies muss allerdings durch Analyse des Algorithmus selbst erkannt werden und kann nicht aus der Funktionsrepräsentation ermittelt werden.

Gilt allerdings nicht sowas, wie vorzeitiger Abbruch bei Suche, so kann Ω ähnlich zu O verwendet werden (Anhand vom Beispiel f(n) = 5n² + 2n):

1. Finde den Term mit dem höchsten Wachstumsfaktor (5n²)
2. Konstanten werden weggelassen (n²)
3. Demnach ist f(n) = Ω(n²)
   Da 5n² + 2n für n → ∞ mindestens so schnell wächst wie n².

Um Werte für c und n0 zu finden, kann das Prinzip wie in O Notation verwendet werden, jedoch auf die Definition von Ω angepasst (Umgekehrtes Gleichheitszeichen).

#### 3.2 (b) ω Notation

Mathematische Definition:

```
ω(g(n)) = {f : ∃c ∈ ℝ>0, n0 ∈ ℕ, ∀n ≥ n0 : 0 ≤ c · g(n) < f(n)}
```

Es existieren die positiven Konstanten c und n0, sodass für alle n ≥ n0 gilt, dass 0 ≤ c · g(n) < f(n).
Das bedeutet, dass der Wachstumsfaktor von f(n) > c · g(n) ist.

Für die Bestimmung von ω gilt das selbe wie für Ω, nur dass zusätzlich noch folgendes beachtet werden muss:

- Hat der Algorithmus einen konstanten Best-Case, so ist ω nicht anwendbar, da ω < 1 sinnlos ist, da per Definition die Komplexität nicht kleiner als 1 sein kann und so der Best-Case schon durch Ω definiert ist.
- Falls nicht konstant, dann muss bei ω ähnlich zu Little-o herausgefunden werden, ob der Wachstumsfaktor von f(n) strikt größer ist als der Wachstumsfaktor der Funktion g(n).
  - lim_{n→∞} f(n)/g(n)
  - Wenn lim = ∞, so gilt ω(g(n))
  - Andernfalls muss der Polynomgrad von g(n) verringert werden:
    ⟶ n^x = n^(x-1) ⟹ n = 1

#### 3.2 (c) Rechenregeln

Sind sowohl für Big-Ω als auch Little-ω gültig

- **Konstanten:**
  f(n) = a mit a ∈ ℝ>0 ⟹ f(n) = Ω(1)
  Ist die Funktion konstant und positiv, so ist die Komplexität Ω(1).
- **Skalare Multiplikation:**
  f(n) = Ω(g(n)) ⟹ a · f(n) = Ω(g(n)) für a > 0
  Eine positive skalare Multiplikation der Funktion ändert die Komplexität nicht.
- **Addition:**
  f1(n) = Ω(g1(n)), f2(n) = Ω(g2(n)) ⟹ f1(n) + f2(n) = Ω(min{g1(n), g2(n)})
  Die Komplexität der Summe zweier Funktionen ist der Minimalwert der Komplexität der beiden Funktionen.
- **Multiplikation:**
  f1(n) = Ω(g1(n)), f2(n) = Ω(g2(n)) ⟹ f1(n) · f2(n) = Ω(g1(n) · g2(n))
  Die Komplexität des Produkts zweier Funktionen ist das Produkt der Komplexität der beiden Funktionen.

### 3.3 Θ Notation

Θ Notation kombiniert O und Ω Notation. Das heißt sie stellt Durchschnittswachstum (Average-Case) einer Funktion dar und liegt somit zwischen O und Ω.

Diagram description: Graph with axes n (x) and f(n) (y). Curve f(n) is sandwiched between two curves c2·g(n) (above) and c1·g(n) (below) for n ≥ n0 (dashed vertical line). Label: f(n) = Θ(g(n)). (Quelle: DevTut)

Mathematische Notation:

```
Θ(g(n)) = {f : ∃c1, c2 ∈ ℝ>0, n0 ∈ ℕ, ∀n ≥ n0 : 0 ≤ c1·g(n) ≤ f(n) ≤ c2·g(n)}
```

Es existieren die positiven Konstanten c1, c2 und n0, sodass für alle n ≥ n0 gilt, dass 0 ≤ c1·g(n) ≤ f(n) ≤ c2·g(n).
f(n) = Θ(g(n)) ⟺ f(n) = O(g(n)) ∧ f(n) = Ω(g(n)).

Die Berechnung von Θ läuft dementsprechend auch ähnlich zu O und Ω ab (Anhand vom Beispiel f(n) = 5n² + 2n).

1. Finde den Term mit dem höchsten Wachstumsfaktor (5n²)
2. Konstanten werden weggelassen (n²)
3. Demnach ist f(n) = Θ(n²)
   Da 5n² + 2n für n → ∞ mindestens so schnell wächst wie n².

Die Berechnung der Konstanten ist allerding ein klein wenig komplizierter, da es eine mehr gibt. Prinzipiell bleibt es aber gleich:

- Simplifiziere die Gleichung: c1 · n² ≤ 5n² + 2n ≤ c2 · n² ⟹ c1 ≤ 5 + 2/n ≤ c2
- Da hier für alle n > 0 der mittlere Term positiv ist, kann man n0 = 1 wählen.
- Dadurch erhalten wir c1 ≤ 5 + 2/1 = 7 ≤ c2, wodurch man hier die Konstanten dann z.B. c1 = 7 und c2 = 7 für n0 = 1 auswählen kann.

### 3.4 Rekursiongleichungen

Im Allgemeinen wird T(n) als die maximale Anzahl von Schritten für Eingaben der Größe n angenommen.
So gilt als allgemeine Form für Rekursiongleichungen:

```
T(n) = a · T(n/b) + f(n)
mit a ≥ 1 und b > 1 und f(n) asymptotisch positiv.
```

Dies ist so anzunehmen, dass das Problem in a Teilprobleme der Größe n/b aufgeteilt wird.
Demnach benötigt das Lösen jedes Teilproblems immer T(n/b) Zeit.
Die Funktion f(n) umfasst hierbei dann die Kosten der anderen Operation wie Aufteilen und Zusammenfügen.

#### 3.4 (a) Mastertheorem

Das Mastertheorem bietet eine einfache Weise an die Laufzeit von verschiedene Rekursionsgleichungen abzuschätzen.
Dabei wird die oben genannte Form vorrausgesetzt.
So gibt es im Mastertheorem grundsätzlich drei verschiedene Fälle:

1. f(n) = O(n^(log_b a - ε)) für ein ε > 0
   Wenn f(n) polynomiell kleiner ist als n^(log_b a)
   - Hier ist die Rekursion wichtiger als die sonstigen Operationen.
   - Demnach: T(n) = Θ(n^(log_b a))
2. f(n) = Θ(n^(log_b a))
   Wenn f(n) und n^(log_b a) gleiche Größenordnung haben
   - Hier tragen Rekursion und sonstige Operationen die selbe Signifikanz
   - Demnach: T(n) = Θ(n^(log_b a) · log n)
3. f(n) = Ω(n^(log_b a + ε)) für ein ε > 0
   Wenn f(n) polynomiell größer ist als n^(log_b a)
   - Hier sind die anderen Operationen dominanter.
   - (Unter der Bedingung: a · f(n/b) ≤ c · f(n) für ein c < 1)
     (Anders: Der rekursive Teil der Funktion a · f(n/b) ist proportional, aber kleiner als der nicht-rekursive Teil f(n). Skalar von c < 1 impliziert ähnliches, aber kleineres Wachstum für n → ∞)
   - Demnach: T(n) = Θ(f(n))

---

## 4 Sortieren

### 4.1 Sortierproblem

Sortieralgorithmen sind die wohl bekanntesten Algorithmen. Hierbei wird als Eingabe eine Folge von Objekten gegeben, die nach einer bestimmten Eigenschaft sortiert werden. Der Algorithmus soll die Eingabe in der richtigen Reihenfolge (nach einer bestimmten Eigenschaft) zur Ausgabe umwandeln. Es wird hierbei meist von einer total geordneten Menge ausgegangen. (Alle Elemente sind miteinander vergleichbar.)

Eine Totale Ordnung wird wie folgt definiert:

Eine Relation ≤ auf M ist eine totale Ordnung, wenn:

- Reflexiv: ∀x ∈ M : x ≤ x
  (x steht in Relation zu x)
- Transitiv: ∀x,y,z ∈ M : x ≤ y ∧ y ≤ z ⟹ x ≤ z
  (Wenn x in Relation zu y steht und y in Relation zu z steht, so folgt, dass x in Relation zu z steht)
- Antisymmetrisch: ∀x,y ∈ M : x ≤ y ∧ y ≤ x ⟹ x = y
  (Wenn x in Relation zu y steht und y in Relation zu x steht, so folgt, dass x = y)
- Totalität: ∀x,y ∈ M : x ≤ y ∨ y ≤ x
  (Alle Elemente müssen in einer Relation zueinander stehen)

### 4.2 Insertion Sort

```
1  Function InsertionSort(arr):
2    For i = 1 to n - 1 do
3      key = arr[i];
4      j = i - 1;
5      // Loops backwards through the array starting at i - 1 until it finds an element that is
         greater than the key or the beginning of the array
6      While j ≥ 0 and arr[j] > key do
7        arr[j + 1] = arr[j]; // Shifts the element to the right
8        j = j - 1;
9      arr[j + 1] = key; // Assigns the key to the correct position
```

#### 4.2 (a) Vorgehensweise

Die Eingabe wird von links nach rechts durchlaufen startend bei i = 1. Das Element i wird dann mit allen Element verglichen, die links von i stehen, bis es 0 erreicht oder das die Einfügestelle gefunden wurde (Vor einem Element, das kleiner als das Element i ist). Die Elemente, die im betrachteten Bereich liegen und größer sind werden während dem Durchlauf eins nach rechts verschoben.

#### 4.2 (b) Visuelle Darstellung

Worked example trace, array [5, 3, 2, 4, 1]:

- **Anfangszustand:** [5, 3, 2, 4, 1]
- **1. Iteration:** key=3 (magenta=5 as insertion point marker, green=3 as element considered). Compare 3 with 5 → 5 > 3, shift. Result: [3, 5, 2, 4, 1]
- **2. Iteration:** key=2 (green). Compares against 5 and 3 (arrows shown over both). Result: [2, 3, 5, 4, 1]
- **3. Iteration:** key=4 (green), compared with 5 (magenta/orange arrow). Result: [2, 3, 4, 5, 1]
- **4. Iteration:** key=1 (green), compared across 2,3,4,5 (arrows shown over all four). Result: [1, 2, 3, 4, 5]
- **Endzustand:** [1, 2, 3, 4, 5]

Legend: Grün ist das momentan betrachte Element/Bereich. Magenta der Einfügepunkt des Elements.
[Note: interactive visualization link mentioned in source, not reproducible here.]

#### 4.2 (c) Komplexität

- **Worst-Case:**
  - Der Worst-Case ist ein array, der in reverse order sortiert ist.
  - Demnach muss jedes Element den kompletten array durchlaufen.
  - Dies ergibt eine Worst-Case Laufzeit von Θ(n²)
- **Best-Case:**
  - Der Best-Case ist ein array, der schon sortiert ist.
  - Demnach muss kein Element verschoben werden, aber trotzdem muss bei jedem Element einmal geprüft werden, ob es größer als sein Vorgänger ist.
  - Dies ergibt eine Best-Case Laufzeit von Θ(n)
- **Average-Case:**
  - Der Average-Case ist ein array, der in random order sortiert ist.
  - Demnach muss für jedes Element der array durchschnittlich bis zur Hälfte durchlaufen werden.
  - Nach der quadratischen Steigerung für große Zahlen ist die Hälfte aber irrelevant, weswegen Θ(n²) ist.

**Slide variant (from lecture slides, alternate pseudocode notation):**

```
insertionSort(A)
1  FOR i=1 TO A.length-1 DO
     // insert A[i] in pre-sorted sequence A[0..i-1]
2    key=A[i];
3    j=i-1; // search for insertion point backwards
4    WHILE j>=0 AND A[j]>key DO
5        A[j+1]=A[j]; // move elements to right
6        j=j-1;
7    A[j+1]=key;
```
Annotations: "Durch !(A[j]=<key) wohldefiniert" (pointing at line 4 condition). "Wir beginnen mit i=1, aber erstes Element ist A[0]" (pointing at line 1). "Short Circuit Evaluation (wie in Java): Wenn erste AND-Bedingung false, wird zweite Bedingung nicht mehr ausgewertet."
Slide footer: "Algorithmen und Datenstrukturen | Marc Fischlin | SS 24 | 02 Sortieren | 10"

### 4.3 Bubble Sort

```
1  Function BubbleSort(arr):
2    For i = n - 1 down to 1 do
3      sorted = true;
4      For j = 0 to i - 1 do
5        If arr[j] > arr[j + 1] then
6          Swap arr[j] and arr[j + 1];
7          sorted = false;
8      If sorted then
9        break;
```

#### 4.3 (a) Vorgehensweise

BubbleSort durchläuft die Eingabe umgekehrt zu InsertionSort: Während bei InsertionSort erst ein Element in einem Teil der Eingabe sortiert wird und der Bereich pro Iteration größer wird, wird bei BubbleSort zuerst der komplette array durchlaufen und beieinander liegende Elemente getauscht, wenn sie größer/kleiner sind und der Bereich mit Iteration weiter eingeschränkt. D.h., dass nach der ersten Iteration bereits das größte Elemente an richtiger Stelle steht, nach der zweiten das zweitgrößte etc.
Hier in dem Beispiel handelt es sich schon um einen optimierten BubbleSort. Dafür wird zusätzlich der Boolean sorted erstellt, der angibt, ob die Eingabe nach dem ersten durchlauf schon sortiert ist, was der Fall ist, wenn kein Element vertauscht wurde. Ist dies der Fall müssen keine weitern Iteration mehr durchgeführt werden und der Algorithmus kann vorzeitig abgebrochen werden. Dies führt zu einem besseren Best-Case.
Im Vergleich zu InsertionSort ist BubbleSort meist inefektiver als InsertionSort, obwohl sie die gleichen Komplexitäten haben. Das liegt daran, dass InsertionSort weniger Operationen ausführen muss.

#### 4.3 (b) Visuelle Darstellung

Worked example trace, array [5, 3, 2, 4, 1]:

- **Anfangszustand:** [5, 3, 2, 4, 1]
- **1. Iteration:** all adjacent pairs compared/swapped as needed (arcs shown across whole array, green=processed region). Result: [3, 2, 4, 1, 5]
- **2. Iteration:** compares/swaps within reduced region (two orange arcs shown). Result: [2, 3, 1, 4, 5]
- **3. Iteration:** one swap (orange arc). Result: [2, 1, 3, 4, 5]
- **4. Iteration:** one swap. Result: [1, 2, 3, 4, 5]
- **Endzustand:** [1, 2, 3, 4, 5]

Note: "Pfeile repräsentieren Bewegung über eine Iteration, nicht einzelne Schritte. Grün repräsentiert den bearbeiteten Bereich."
[Note: interactive visualization link mentioned in source, not reproducible here.]

#### 4.3 (c) Komplexität

- **Worst-Case:**
  - Die Eingabe liegt in reverse order vor.
  - Das heißt, das jedes Element immer vom Anfang bis zum Ende des Bereichs durchgewechselt werden muss.
  - Die Komplexität beträgt also Θ(n²)
- **Best-Case:**
  - Die Eingabe ist bereits sortiert.
  - Das heißt der Algorithmus muss die Eingabe nur einmal durchlaufen um zu schauen, ob Elemente getauscht werden.
  - Die Komplexität beträgt also Θ(n)
  - (Bei nicht optimierten BubbleSort, läuft der Algorithmus immer komplett durch ⟹ Θ(n²))
- **Average-Case:**
  - Die Eingabe ist zufällig sortiert.
  - Im Durchschnitt müssen die Elemente demnach in den meisten Fällen getauscht werden.
  - Die Komplexität beträgt also Θ(n²)

**Slide variant / exercise question (verbatim):**

```
bubbleSort(A)
1  FOR i=A.length-1 DOWNTO 0 DO
2    FOR j=0 TO i-1 DO
3      IF A[j]>A[j+1] THEN SWAP(A[j],A[j+1]);
           //temp=A[j+1]; A[j+1]=A[j]; A[j]=temp;
```
Exercise prompts on slide: "Was macht der folgende Sortier-Algorithmus Bubble-Sort?" / "Welche Laufzeit hat der Algorithmus?" / "Wie verhält er sich im Vergleich zu Insertion Sort?"
Slide footer: "Algorithmen und Datenstrukturen | Marc Fischlin | SS 24 | 02 Sortieren | 50"

### 4.4 Merge Sort

```
1  Function MergeSort(arr, left, right):
2    If left < right then
3      // left < right, otherwise the region has no elements
4      mid = ⌊(left + right) / 2⌋; // Integer division → round down
5      // Split the region into two halves and do the recursive calls
6      MergeSort(arr, left, mid);
7      MergeSort(arr, mid + 1, right);
8      // Merge the two (now sorted) halves
9      Merge(arr, left, mid, right);

10 Function Merge(arr, left, mid, right):
11   temp = new array of size (right - left + 1);
12   p = left;
13   q = mid + 1;
14   // For each element in the region
15   For i = 0 to right - left do
16     // If p > mid the left half is finished → element goes to right half
17     // Otherwise p ≤ mid and the element at p needs to be ≤ the element at q
18     If q > right or (p ≤ mid and arr[p] ≤ arr[q]) then
19       temp[i] = arr[p]; p = p + 1; // Add the element at p to the temp array and increase p
20     Else
21       temp[i] = arr[q]; q = q + 1; // Add the element at q to the temp array and increase q
22   // Copy the merged elements from the temporary array back to the original array
23   For i = 0 to right - left do
24     arr[left + i] = temp[i]; // left + 0 is the start of the region
```

#### 4.4 (a) Vorgehensweise

Die Eingabe wird jeweils immer in der Mitte in zwei Teile aufgeteilt, die jeweils wieder aufgeteilt werden. Dies passiert so lange, bis alle Elemente einzeln vorhanden sind. Danach werden immer zwei dieser enstandenen Teillisten so zusammengeführt, dass sie geordnet sind. Dies wird dann wieder durchgeführt, bis alle Elemente in der Eingabe vorhanden sind und nun auch sortiert sind. Dieses Prinzip wird auch Divide-and-Conquer genannt. Bei Divide wird die Eingabe in zwei Teile aufgeteilt. Bei Conquer werden diese Teile sortiert. Dies geschieht durch die Zusammenführung von den einelementigen Teillisten, die trivial sortiert sind.

#### 4.4 (b) Visuelle Darstellung

Worked example trace, array [3, 2, 4, 1]:

Divide phase (top-down tree, split into halves):
- Root: [3, 2, 4, 1] splits into [3, 2] (left branch) and [4, 1] (right branch)
- [3, 2] splits into [3] and [2]
- [4, 1] splits into [4] and [1]

Conquer/Merge phase (bottom-up, merging back):
- [3] and [2] merge → [2, 3]
- [4] and [1] merge → [1, 4]
- [2, 3] and [1, 4] merge → [1, 2, 3, 4]

Final result: [1, 2, 3, 4]

[Note: interactive visualization link mentioned in source, not reproducible here.]

#### 4.4 (c) Komplexität

- **Worst-Case:**
  - Der Algorithmus funktioniert unabhängig von der Sortiertheit der Eingabe, demnach gibt es keine Worst-Case Eingabe.
  - Die Eingabe kann log n (log₂ n) mal in zwei aufgeteilt werden kann. Zusätzlich benötigt der Algorithmus zum Kombinieren von den Teillisten n
  - Es ergibt sich also die Komplexität von Θ(n log n)
- **Best-Case:**
  - Wie zuvor angesprochen, läuft der Algorithmus unabhängig von der Sortiertheit der Eingabe, demnach gibt es keine Best-Case Eingabe und der Best-Case ist gleich dem Worst-Case.
  - Es ergibt sich also Θ(n log n)
- **Average-Case:**
  - Wie oben, für alle Fälle gleich, also Θ(n log n)

**Slide variant (recursion + merge, with pointer arithmetic derivation):**

```
mergeSort(A,left,right) //initial left=0,right=A.length-1

1  IF left<right THEN  //more than one element
2    mid=floor((left+right)/2);  // middle (rounded down)
3    mergeSort(A,left,mid);      // sort left part
4    mergeSort(A,mid+1,right);   // sort right part
5    merge(A,left,mid,right);    // merge into one
```
Derivation shown on slide: mid = ⌈(right-left+1)/2⌉ + 2·left/2 - 1 = ⌈(right+left-1)/2⌉ = ⌊(right+left)/2⌋
Labeled: "Anzahl Elemente /2 (gerundet)" and "Offset (beginnend mit 0)"
Examples given: left=3, right=4, mid=3 ; left=3, right=5, mid=4
Slide footer: "Algorithmen und Datenstrukturen | Marc Fischlin | SS 24 | 02 Sortieren | 53"

```
merge(A,left,mid,right) // requires left<=mid<=right
    //temporary array B, right-left+1 elements

1  p=left; q=mid+1;     // position left, right
2  FOR i=0 TO right-left DO   // merge all elements
3    IF q>right OR (p<mid AND A[p]=<A[q]) THEN
4      B[i]=A[p];
5      p=p+1;
6    ELSE  //next element at q
7      B[i]=A[q];
8      q=q+1;
9  FOR i=0 TO right-left DO A[i+left]=B[i]; //copy back
```
Annotations on slide (right branch condition): "rechte Liste noch aktiv und [linke Liste bereits abgearbeitet oder nächstes Element rechts]"; (left branch condition): "rechte Liste bereits abgearbeitet oder [linke Liste noch aktiv und nächstes Element links]"
Slide footer: "Algorithmen und Datenstrukturen | Marc Fischlin | SS 24 | 02 Sortieren | 55"
[Note: slide pseudocode uses p<mid, differs from the earlier top block's p≤mid — transcribed exactly as shown, discrepancy preserved.]

### 4.5 Quicksort

```
1  Function QuickSort(arr, left, right):
2    // If region contains more than one element
3    If left < right then
4      part = Partition(arr, left, right);
5      QuickSort(arr, left, part);
6      QuickSort(arr, part + 1, right);

7  Function Partition(arr, left, right):
8    pivot = arr[left]; // Pivot is the first element in the region
9    p = left - 1;
10   q = right + 1;
11   While p < q do
12     // Increase p until an element ≥ pivot is found
13     p = p + 1;
14     While arr[p] < pivot do
15       p = p + 1;
16     // Decrease q until an element ≤ pivot is found
17     q = q - 1;
18     While arr[q] > pivot do
19       q = q - 1;
20     If p < q then
21       Swap arr[p] and arr[q];
22   // Loop runs until p and q cross. Returns partition index q.
23   // Indices ≤ q contain elements ≤ pivot, indices > q contain elements ≥ pivot.
24   return q;
```

Quicksort funktioniert vom Prinzip ähnlich zu Mergesort. Auch hier wird die Eingabe in zwei Teillisten aufgeteilt und der rekursiv wiederholt. Hier findet die Sortierung allerdings anders statt. Anstatt die Sortierung durch die Zusammenführung zweier Listen zu realisieren, werden hier die einzelnen Elemente anhand des Vergleiches an einem anderen Elementes links oder rechts von diesem eingeordnet. Dies führt durch das Divide-and-Conquer Prinzip dazu, dass die Eingabe die Element in die zwei Teile, größer und kleiner des Pivots einordnet. Diese beiden Teile werden dann wiederum genauso behandelt, bis schließlich der gesamte array1 geordnet ist.
Bei der Implementation wird häufig anstatt den Pivot als erstes Element des Bereichs zu definieren, dieser zufällig gewählt, was zu einem besseren average-case führt, wenn die Eingabe bereits einigermaßen sortiert ist. Quicksort ist zwar in der Theorie in den meisten Situationen nicht unbedingt besser als Merge sort auf die Komplexität bezogen, in der Praxis aber oft schneller, durch die Ineffizienz von Kopieroperationen, die für Quicksort wegfallen.

#### 4.5 (a) Visuelle Darstellung

Worked example trace, array [4, 3, 2, 5, 1] (pivot = first element, shown in green; elements < pivot in gray-ish left region, elements > pivot in pink-ish right region per diagram coloring):

- Root: [4, 3, 2, 5, 1], pivot=4 (green). Partitions into left sublist [1, 3, 2] and right sublist [5, 4] (arrows down to two branches)
- Left branch [1, 3, 2]: pivot=1 (green). Left produces empty, right sublist [3, 2]
  - [3, 2]: pivot=3 (green). Partitions into [2] and empty (right)... Result: leaf [1], then [2], [3]
- Right branch [5, 4]: pivot=5 (green). Left sublist [4], right empty
  - Leaves: [4], [5]

Bottom leaves in order: [1], [2], [3], [4], [5]

[Note: interactive visualization link mentioned in source, not reproducible here.]

#### 4.5 (b) Komplexität

- **Worst-Case:**
  - Im Worst-Case wird für pivot immer das größte oder kleinste Element verwendet, was sehr unausgeglichenen Partitionen erzeugt.
  - Dies würde eine Rekursionstiefe von n bedeuten
  - Pro Rekursion muss dann der Bereich immernoch mit n durchlaufen werden
  - Dies bedeutet eine Worst-Case Laufzeit von Θ(n²)
- **Best-Case:**
  - Im Best-Case wird immer das Element als pivot verwendet, das den Median der Liste bildet, was die Partitionen immer ausbalanciert.
  - Dies bedeutet eine Rekursionstiefe von log n
  - Pro Rekursion muss dann der Bereich immernoch mit n durchlaufen werden
  - Dies bedeutet eine Best-Case Laufzeit von Θ(n log n)
- **Average-Case:**
  - Im Average-Case wird ein zufälliges Element als pivot verwendet, wodurch die Partitionen im mittel gleich sind.
  - Dies bedeutet eine Rekursionstiefe von log n
  - Pro Rekursion muss dann der Bereich immernoch mit n durchlaufen werden
  - Dies bedeutet eine Average-Case Laufzeit von Θ(n log n)

**Slide variant (Quicksort, REPEAT/UNTIL loop notation):**

```
quicksort(A,left,right) //initial left=0,right=A.length-1

1  IF left<right THEN  //more than one element
2    q=partition(A,left,right);   // q partition index
3    quicksort(A,left,q);         // sort left part
4    quicksort(A,q+1,right);      // sort right part
```
Slide footer: "Algorithmen und Datenstrukturen | Marc Fischlin | SS 24 | 02 Sortieren | 89"

```
partition(A,left,right) //req.left<right,ret.left..right-1

1  pivot=A[left];
2  p=left-1; q=right+1;  //move from left resp. right
3  WHILE p<q DO
4    REPEAT p=p+1 UNTIL A[p]>=pivot; //left up
5    REPEAT q=q-1 UNTIL A[q]=<pivot; //right down
6    IF p<q THEN Swap(A[p],A[q]);
7  return q          // A[left..q], A[q+1..right]
```

### 4.6 Radix Sort

```
1  // D = 10, possible unique digits (e.g. 0-9 for decimal system)
2  Function RadixSort(arr):
3    d = AmountDigits(arr);
4    buckets = new array of empty lists of size D;
5    For i = 0 to d - 1 do
6      // For each digit in the array, 0 is least significant
7      For j = 0 to n - 1 do
8        PutBucket(arr, i, j, buckets); // Sorts the numbers into their buckets
9      a = 0;
10     // Reads out the buckets in order
11     For k = 0 to D - 1 do
12       For b = 0 to buckets[k].size() - 1 do
13         arr[a] = buckets[k].get(b);
14         a = a + 1;
15       buckets[k].clear();
16       // Clears the bucket for the next iteration

17 Function PutBucket(arr, i, j, buckets):
18   z = ⌊arr[j]/D^i⌋ mod D; // Gets the ith digit of the number
19   buckets[z].append(arr[j]); // Appends the number to bucket z

20 Function AmountDigits(arr):
21   max = arr[0]; For i = 1 to arr.length - 1 do
22     If arr[i] > max then
23       max = arr[i];
24   // Get the amount of digits of the largest number
25   return ⌊log_D(max)⌋ + 1;
```

#### 4.6 (a) Vorgehensweise

Bei RadixSort wird die Eingabe für jede Dezimalstelle sortiert. D.h., dass die Eingabe zuerst anhand von der 1er-Stelle sortiert wird, dann der 10er-Stelle, und so weiter.
Dies geschieht durch die Einordnung der Elemente in "Buckets", die jeweils einen möglichen Wert für die Dezimalstelle darstellen(z.B. {0, 1, 2, 3, 4, 5, 6, 7, 8, 9}). Nachdem alle Werte in Buckets eingeordnet wurden, werden diese Buckets nun nach Signifikanz ausgelesen (0 ist kleiner als 9, also werden 0 zuerst ausgelesen) und nach der bearbeiteten Ziffer sortiert in die Eingabe zurückgefügt. Dadurch liegt der array1 für die Ziffer nun sortiert da.
Dies wird nun für die nächste Dezimalstelle wiederholt, wodurch die Eingabe jetzt für die ersten beiden Dezimalstellen sortiert ist. Dies wird wiederholt, bis alle Dezimalstellen durchlaufen sind, wodurch dann alle Werte sortiert sind.

#### 4.6 (b) Visuelle Darstellung

Worked example trace, array [232, 836, 101, 903, 220, 425, 762, 83, 5, 319] (D=10):

**Pass 1 (sort by 1s digit, i=0):**
Buckets (0-9): 
- 0: 220
- 1: 101
- 2: 232, 762
- 3: 903, 83
- 4: (empty)
- 5: 425, 5
- 6: 836
- 7: (empty)
- 8: (empty)
- 9: 319

Read out in bucket order 0→9: [220, 101, 232, 762, 903, 83, 425, 5, 836, 319]

**Pass 2 (sort by 10s digit, i=1):**
Buckets (0-9):
- 0: 101, 903, 5
- 1: 319
- 2: 220, 425, 836
- 3: 232
- 4: (empty)
- 5: (empty)
- 6: 762
- 7: (empty)
- 8: 83
- 9: (empty)

Read out: [101, 903, 5, 319, 220, 425, 836, 232, 762, 83]

**Pass 3 (sort by 100s digit, i=2):**
Buckets (0-9):
- 0: 5, 83
- 1: 101, 220, 319, 425
- 2: 232
- 3: (empty)
- 4: (empty)
- 5: (empty)
- 6: (empty)
- 7: 762, 836, 903
- 8: (empty)
- 9: (empty)

Read out (final sorted result): [5, 83, 101, 220, 232, 319, 425, 762, 836, 903]

Note: "Die Farben haben keine spezielle Bedeutung und dienen nur der Visualisierung."

#### 4.6 (c) Komplexität

- Da bei RadixSort die Eingabe nur von der Anzahl der möglichen Ziffernvariationen D, der Eingabelänge n und die maximale Anzahl der Ziffern d abhängig ist, ist der Algorithmus für **Best-, Worst- und Average-case** gleich.
- Dieser beträgt im Allgemeinen O(d · (n + D))
- D wird aber oft als Konstant angesehen, weshalb O(d · n) oft verwendet wird.
- Wenn man zusätzlich noch d als konstant ansieht so ergibt sich lineare Laufzeit O(n)
- Nähert sich D n an, so ergibt sich allerdings eine Laufzeit von O(n log n), da d = Θ(log_D n) gilt. [text shown in magenta/highlighted in source]

**Slide variant (Laufzeit derivation):**

```
radixSort(A) // keys: d digits in range [0,D-1]
// B[0][],..., B[D-1][] buckets (init: B[k].size=0)

1  FOR i=0 TO d-1 DO //0 least, d-1 most sign. digit
2    FOR j=0 TO n-1 DO putBucket(A,B,i,j);      -- O(n)
3    a=0;
4    FOR k=0 TO D-1 DO     //rewrite to array
5      FOR b=0 TO B[k].size-1 DO
6        A[a]=B[k][b];    //read out bucket in order
7        a=a+1;
8      B[k].size=0;       //clear bucket again        -- O(D)
9  return A
                                                        -- O(n) steps total (alles in A kopieren)
```
Boxed callout: "Gesamtlaufzeit O(d·(n + D))"

```
putBucket(A,B,i,j) // call-by-reference          -- O(1)
1  z=A[j].digit[i]; // i-th digit of A[j]
2  b=B[z].size;      // next free spot
3  B[z][b]=A[j];
4  B[z].size=B[z].size+1;
```
Slide footer: "Algorithmen und Datenstrukturen | Marc Fischlin | SS 24 | 02 Sortieren | 143"

---

## 5 Grundlegende Datenstrukturen

### 5.1 Stacks

Stacks operieren unter dem "First in - Last out" (FILO) Prinzip. Ähnlich zu einem Kartendeck, wo die unterste (Erste Karte) die ist, die als letztes gezogen wird.
Stacks werden normalerweise mit den folgenden Funktionen erstellt:

- `new(n)`: Erstellt einen neuen Stack.
- `isEmpty`: gibt an ob der Stack leer ist.
- `pop`: gibt das oberste Element des Stacks zurück und enfernt es vom Stack.
- `push(k)`: Fügt k auf den Stack hinzu

Eine mögliche Implementation auf Grundlage eines Arrays wäre:

```
1  Class Stack:
2    arr;
3    top;
4    Constructor Stack(size):
5      arr = new array of size size;
6      top = -1; // Creates a new array with size
7    Function isEmpty():
8      return top < 0; // Returns true if empty
9    Function pop():
10     If isEmpty() then
11       return error; // Underflow check
12     element = arr[top];
13     top = top - 1;
14     return element; // Removes and returns the top element
15   Function push(k):
16     If top ≥ size - 1 then
17       return error; // Overflow check
18     top = top + 1; arr[top] = k;
```

Oft werden Stacks auch mit variabler Größer implementiert. Dies kann über verschiedene Wege passieren, zum Beispiel Kopieren des arrays in einen größeren Array oder implementation über mehrere Arrays (z.B. über Linked List). Häufig wird das erstere so implementiert, dass der Array in einen Array mit doppelter Größe kopiert wird.

Diagram description: Three stack illustrations. "Example Stack" — stack containing (bottom to top) 4, 6, 8. "Pop" — arrow from top showing 8 (magenta) being removed, leaving 4, 6. "Push" — arrow showing 1 (green) being added on top of 4, 6.

**Slide variant (array-based stack with fixed MAX size):**

Diagram: Array S with indices 0-8, values [12, 47, 17, 98, 9, _, _, _, _], S.top points to index 4 (value 9).

```
new(S)
1  S.A[]=ALLOCATE(MAX);
2  S.top=-1;

isEmpty(S)
1  IF S.top<0 THEN
2    return true
3  ELSE
4    return false;

pop(S)
1  IF isEmpty(S) THEN
2    error 'underflow'
3  ELSE
4    S.top=S.top-1;
5    return S.A[S.top+1];

push(S,k)
1  IF S.top==MAX-1 THEN
2    error 'overflow'
3  ELSE
4    S.top=S.top+1;
5    S.A[S.top]=k;
```
Slide footer: "Algorithmen und Datenstrukturen | Marc Fischlin | SS 24 | 03 Grundlegende Datenstrukturen | 9"

**Slide variant (dynamic resizing stack, "Feldarbeit"):**

Note: "RESIZE(S,m) reserviert neuen Speicher der Größe m, kopiert S.A um, und lässt S.A auf neuen Speicher zeigen"

```
new(S)
1  S.A[]=ALLOCATE(1);
2  S.top=-1;
3  S.memsize=1;

isEmpty(S)
1  IF S.top<0 THEN
2    return true
3  ELSE
4    return false;

pop(S)
1  IF isEmpty(S) THEN
2    error 'underflow'
3  ELSE
4    S.top=S.top-1;
5    IF 4*(S.top+1)==S.memsize THEN
6      S.memsize=S.memsize/2;
7      RESIZE(S,S.memsize);
8    return S.A[S.top+1];

push(S,k)
1  S.top=S.top+1;
2  S.A[S.top]=k;
3  IF S.top+1==S.memsize THEN
4    S.memsize=2*S.memsize;
5    RESIZE(S,S.memsize);
```
Slide footer: "Algorithmen und Datenstrukturen | Marc Fischlin | SS 24 | 03 Grundlegende Datenstrukturen | 14"

### 5.2 Queues

Queues funktionieren entgegengesetzt zu Stacks. Sie funktionieren nach dem FIFO-Prinzip (First in - First out). Kann als Warteschleife dargestellt werden. Die Person, die sich als erstes anstellt, kommt auch als erstes dran.
Queues werden normalerweise mit den folgenden Funktionen erstellt:

- `new(n)`: Erstellt einen neuen Queue.
- `isEmpty`: gibt an ob der Queue leer ist.
- `enqueue(k)`: Fügt k auf den Queue hinzu
- `dequeue`: gibt das erste Element des Queues zurück und entfernt es vom Queue.

Hier ist die Implementation für Queues wie folgt:

```
1  Class Queue:
2    arr;
3    front;
4    back;
5    Constructor Queue(size):
6      arr = new array of size size;
7      front = -1;
8      back = -1;
9    Function isEmpty():
10     return back == -1;
11   Function isFull():
12     return (back + 1) mod size == front; // Modulo makes this usable for cyclic arrays
13   Function enqueue(k):
14     If isFull() then
15       return error; // Queue is full
16     Else
17       If isEmpty() then
18         front = 0;
19       back = (back + 1) mod size; // Modulo so that cyclic arrays work
20       arr[back] = k;
21   Function dequeue():
22     If isEmpty() then
23       return error; // Queue is empty
24     Else
25       temp = arr[front];
26       If front == back then
27         front = -1;
28         back = -1;
29       Else
30         front = (front + 1) mod size; // Modulo so that cyclic arrays work
31       return temp;
```

Diagram: "Example non-cyclic Queue" — array [1, 8, 6, 4] with Rear on left (value 1) and Front on right (value 4).

Diagram: "Dequeue" — [1,8,6] → arrow → [4] removed → Rear...Front shows 1,8,6 remaining after 4 dequeued.
Diagram: "Enqueue" — [7]→ arrow →[1,8,6] shows 7 being enqueued to the rear giving [7,1,8,6].

Diagram: "Cyclic Queue" — circular buffer with 8 slots (indices 0-7) arranged clockwise: 0=47, 1=8, 2=37, 3=23, 4=6, 5=86, 6=11(shown as "11"? actual digits "ᴔ11" ambiguous) [UNCLEAR: value at index 6, rendered as "ᴧᴧ" or "11" rotated], 7=(empty, front arrow points here at index0 actually). "front" arrow points to index 0 (value 47). "rear" arrow points to index 6.

**Slide variant (cyclic array queue):**

Note: "Q leer, wenn front==rear+1 mod MAX und empty==true" / "Q voll, wenn front==rear+1 mod MAX und empty==false"

```
new(Q)
1  Q.A[]=ALLOCATE(MAX);
2  Q.front=0;
3  Q.rear=-1;
4  Q.empty=true;

isEmpty(Q)
1  return Q.empty;

dequeue(Q)
1  IF isEmpty(Q) THEN
2    error 'underflow'
3  ELSE
4    Q.front=Q.front+1 mod MAX;
5    IF Q.front==Q.rear+1 mod MAX
6      THEN Q.empty=true;
7    return Q.A[Q.front-1 mod MAX];

enqueue(Q,k)
1  IF Q.front==Q.rear+1 mod MAX
       AND !Q.empty THEN
2    error 'overflow'
3  ELSE
4    Q.rear=Q.rear+1 mod MAX;
5    Q.A[Q.rear]=k;
6    Q.empty=false;
```
Slide footer: "Algorithmen und Datenstrukturen | Marc Fischlin | SS 24 | 03 Grundlegende Datenstrukturen | 35"

**Slide variant (linked-list based queue):**

```
new(Q)
1  Q.front=nil;
2  Q.rear=nil;

isEmpty(Q)
1  IF Q.front==nil THEN
2    return true
3  ELSE
4    return false;

dequeue(Q)
1  IF isEmpty(Q) THEN
2    error 'underflow'
3  ELSE
4    x=Q.front;
5    Q.front=Q.front.next;
6    return x;

enqueue(Q,x)
1  IF isEmpty(Q) THEN
2    Q.front=x;
3  ELSE
4    Q.rear.next=x;
5  x.next=nil;
6  Q.rear=x;
```
Slide footer: "Algorithmen und Datenstrukturen | Marc Fischlin | SS 24 | 03 Grundlegende Datenstrukturen | 37"

### 5.3 Linked List

Eine einfache Linked List besteht aus mehreren Elementen, die jeweils immer einen Wert und eine Referenz auf das nächste Element in der Liste haben. Diese Struktur hat den Vorteil, dass sie keine festgelegte Größe hat, das Einfügen in O(1) stattfindet, einfach zu implementieren ist und im Speicher nicht als Block, sondern einzelne Referenzen steht. Eine einfache Linked List kann wie folgt implementiert werden:

```
1  Class LinkedElement:
2    key;
3    next;
4    Constructor LinkedElement(k):
5      key = k;
6      next = NIL;

7  Class LinkedList:
8    head = NIL; // First element in list
9    tail = NIL; // Last element in list
10   Function insert(k):
11     elem = new LinkedElement(k);
12     If head == NIL then
13       head = elem;
14       tail = elem;
15     Else
16       tail.next = elem;
17       tail = elem;
18   // Complexity: O(n)
19   Function delete(k):
20     prev = NIL;
21     curr = head;
22     While curr ≠ NIL and curr.key ≠ k do
23       prev = curr;
24       curr = curr.next;
25     If curr == NIL then
26       return error; // Element not found
27     If prev ≠ NIL then
28       prev.next = curr.next;
29       If curr == tail then
30         tail = prev;
31     Else
32       head = curr.next;
33       If head == NIL then
34         tail = NIL;
35   // Complexity: O(n)
36   Function search(k):
37     curr = head;
38     While curr ≠ NIL and curr.key ≠ k do
39       curr = curr.next;
40     If curr == NIL then
41       return error; // Element not found
42     return curr;
```

Diese Implementation benutzt einen Head und Tail, hat aber nur Referenz für das nächste Element in der Liste. Eine alternative Implementation wäre Tail wegzulassen und den Nodes eine previous-Referenz zu geben. Damit könnte man beim Einfügen das Element vorne an den Head anzuhängen und die neue Node als Head zuzuweisen. `search` bleibt gleich, bei `delete` muss lediglich die previous Referenz angepasst werden.

Worked example trace / diagrams:

- **Linked List** (initial): Head → 4 → 6 → 3 → 5 → 1 → Tail
- **Delete Outcome** (deleting 3, arc showing 6 pointing over 3 to 5): Node 3 highlighted magenta, arrow from 6 skips to 5.
- **Delete Quasi Outcome** (result): Head → 4 → 6 → 5 → 1 → Tail
  "Die 3 Node wird zwar nicht wirklich 'gelöscht', allerdings wird die Referenz aus der Liste genommen, wodurch keine Referenz mehr auf diese Node besteht."
- **Insert of 8** (result): Head → 4 → 6 → 5 → 1 → 8(green) → Tail
  "8 wird an tail angehängt und wird dann zum tail"

**Slide variant (elementary operations, with sentinel/wächter optimization):**

```
search(L,k)  //returns pointer to k in L (or nil)   -- Laufzeit = Θ(n)
1  current=L.head;
2  WHILE current != nil AND current.key != k DO   // short circuit evaluation (wie in Java)
3    current=current.current;
4  return current;
```
Worked trace on slide: Search(L,17) on list 5→12→17→47 (head=5): steps traverse 5(1)→12(2/3)→17(2/3, found). Search(L,18) on same list: traverses 5→12→17→47→nil (all 2/3 steps then nil).

```
insert(L,x)  //inserts element x in L   -- Laufzeit= Θ(1)
1  x.next=L.head;
2  x.prev=nil;
3  IF L.head != nil THEN
4    L.head.prev=x;
5  L.head=x;
```
Note: "call-by-reference bzw. call-by-value für Objekte wie in Java"
Diagram: Insert(L,x) shows list 5→12→17→47 with head pointer; new node x=37 inserted before 5, becoming new head: 37→5→12→17→47.

```
delete(L,x)  //deletes element x from L   -- Laufzeit= Θ(1)
1  IF x.prev != nil THEN
2    x.prev.next=x.next;
3  ELSE
4    L.head=x.next;
5  IF x.next != nil THEN
6    x.next.prev=x.prev;
```
Note: "Achtung: Löschen eines Wertes k kostet Zeit Ω(n)"
Diagram: Delete(L,x) on list 5→12→17→47 (head=5), deleting x=17 (loop arrow 5/6 shown), result reconnects 12→47.

**Slide variant (Sentinel/Wächter simplification):**

Goal noted: "Ziel: eliminiere die Spezialfälle für Listenanfang/-ende"

```
delete(L,x)  //deletes element x from L
1  IF x.prev != nil THEN
2    x.prev.next=x.next;
3  ELSE
4    L.head=x.next;
5  IF x.next != nil THEN
6    x.next.prev=x.prev;
```
Diagram: Sentinel L.sent, head=L.sent.next; list nil→5→12→17→47; note "Sentinel ist „von außen" nicht sichtbar" and "Leere Liste besteht nur aus Sentinel"

```
deleteSent(L,x)  // deletes x from L with sentinel
1  x.prev.next=x.next;
2  x.next.prev=x.prev;
```
Note: "Andere Operationen wie Einfügen und Löschen müssen auch angepasst werden"
Diagram: Delete(L,x) with sentinel: nil→5→12→17→47, deleting x=17 with steps 1/2 shown.
Slide footer: "Algorithmen und Datenstrukturen | Marc Fischlin | SS 24 | 03 Grundlegende Datenstrukturen | 27"

### 5.4 Binary Search Tree

Ein Binary Search Tree ist eine Datenstruktur, die aus mehreren Nodes besteht, die jeweils pointer zu drei Nodes besitzt: Left, Right und Parent.
Hierbei repräsentiert Left und Right die Nodes, die unter der current Node stehen und Parent die, die über der current Node steht. Dabei ist im Binary Search Tree (Im Gegensatz zum normalen Search Tree) Left immer kleiner als die Node und Right immer größer gleich der Node.
Dies erlaubt es Elemente in dem Tree schnell zu finden, da nicht alle Elemente durchlaufen werden müssen, sondern immer nur ein Pfad, bei dem das Element größer/kleiner ist.
Ein idealer Binary Search Tree ist so balanziert, dass beide Seiten des Baumes die selbe Anzahl an Knoten besitzen. Dies wäre eine ideale Höhe von h = log n. Ein schlechter Binary Search Tree allerdings ist unbalanziert, so dass der Worst-Case so aussieht, dass alle Nodes jeweils maximal ein Kind haben. Dies wäre effektiv gleich einer LinkedList.

```
1  Class BSTNode:
2    key;
3    left = NIL;
4    right = NIL;
5    parent = NIL;
6    Constructor BSTNode(k):
7      key = k;

8  Class BSTree:
9    root = NIL;
10   // Complexity: Ω(1), O(h), Θ(h)
11   Function insert(z):
12     x = root; // Traversal starting from the root
13     px = NIL; // Parent of x, initially null
14     While x ≠ NIL do
15       px = x;
16       If z.key < x.key then
17         x = x.left;
18       Else
19         x = x.right;
20     // Traversing the tree until finding the insertion point
21     z.parent = px; // Sets the parent of the node to be inserted
22     // px is only null if the tree is empty → z is root
23     If px == NIL then
24       root = z;
25     Else If z.key < px.key then
26       px.left = z; // Key smaller → left child
27     Else
28       px.right = z; // Key bigger → right child
```

Diagram trace: "Before insert" tree: root=6, left=4 (left child 2), right=8 (children 7, 9). "Insert 5": traversal path 6→4 (green arrow), 5 becomes right child of 4 (green node 5).

```
1  Class BSTree (continued):
2    Function transplant(u, v):
3      // Transplants v to the parent of u
4      If u.parent == NIL then
5        root = v; // If u is the root, v becomes the new root
6      Else If u == u.parent.left then
7        u.parent.left = v; // If u is a left child, v becomes a left child
8      Else
9        u.parent.right = v; // If u is a right child, v becomes a right child
10     If v ≠ NIL then
11       v.parent = u.parent; // If v is not null, v becomes a child of u's parent
12   // Complexity: Ω(1), O(h), Θ(log n)
13   Function delete(z):
14     If z.left == NIL then
15       transplant(z, z.right); // If z has no left, transplants the right to z's position
16     Else If z.right == NIL then
17       transplant(z, z.left); // If z has no right, transplants the left to z's position
18     Else
19       // If z has both left and right children
20       y = z.right;
21       // Finds the next biggest element of z = smallest in right subtree of z
22       While y.left ≠ NIL do
23         y = y.left;
24       If y.parent ≠ z then
25         // If the next biggest element y is not child of z
26         transplant(y, y.right); // Transplants right child of y to y's position
27         y.right = z.right; // Right child of y becomes right child of z
28         y.right.parent = y; // Parent of the right child of y becomes y
29       transplant(z, y); // Transplants y to z's position
30       y.left = z.left; // Left child of y becomes left child of z
31       y.left.parent = y; // Parent of left child of y becomes y
```

Worked example traces of deletion (tree: root=6, left=4(child 2), right=8(children 7,9)):

- **Leaf Deletion**: tree 6/[4(2),8(7,9)] → "Delete 2" (node 2 highlighted magenta) → Result: 6/[4(no left child), 8(7,9)] i.e. [6,[4,[nil,nil]],[8,[7,9]]]
- **Half-Leaf Deletion**: same tree 6/[4(2),8(7,9)] → "Delete 4" (node 4 highlighted magenta, curved green arrow from 2 to where 4 was) → Result: 6/[2, 8(7,9)] (2 replaces 4 as left child of 6)
- **Complete Node Deletion**: tree 6/[4(2),8(7,9)] → "Delete 8" (node 8 highlighted magenta, curved green arrow from 9 to where 8 was, indicating successor 9 replaces 8) → Result: 6/[4(2), 9(7, no right child)] i.e. root 6, left=4(child 2), right=9(child 7)

Note: "Leaves werden gelöscht, Half-Leaves durch Kind ersetzt, Complete Node durch Nachfolger (nächstgrößtes Element, kleinstes Element im rechten Teilbaum der Node) ersetzt."

```
1  Class BSTree (continued):
2    // Complexity: Ω(1), O(h), Θ(log n)
3    Function iterativeSearch(k):
4      curr = root;
5      While curr ≠ NIL and curr.key ≠ k do
6        If k < curr.key then
7          curr = curr.left;
8        Else
9          curr = curr.right;
10     return curr; // Returns null if element not found
11   // Complexity: Ω(1), O(h), Θ(log n)
12   Function recursiveSearch(k, curr):
13     If curr == NIL then
14       return NIL;
15     If k < curr.key then
16       return recursiveSearch(k, curr.left);
17     Else If k > curr.key then
18       return recursiveSearch(k, curr.right);
19     return curr; // Returns null if element not found
20   // Complexity: O(n)
21   Function traversal(curr):
22     If curr == NIL then
23       return;
24     // Any actions that should be done in a specific order can be done
25     // Here for preorder traversal
26     traversal(curr.left);
27     // Here for inorder traversal
28     traversal(curr.right);
29     // Here for postorder traversal
30     // Left and right can also be exchanged to traverse in reverse order
```

Diagram: "Ideal balanzierter BST (h = log n)" — tree root=6, left=4(children 2,5), right=8(children 7,9).
Diagram: "Worst-Case unbalanzierter BST (h = n)" — degenerate chain 2→4→5→6→7→8→9 (each node one child, linked-list shape).

**Slide variant (Inorder/Pre/Postorder traversal examples):**

Example tree used: root=23, left=17 (children 9, 23), right=24 (child 25). [Note: duplicate key 23 appears as both root and a leaf in source diagram — transcribed as shown.]

```
inorder(x)
1  IF x != nil THEN
2    inorder(x.left);
3    print x.key;
4    inorder(x.right);
```
Note: "Bei Bedarf mit „Wrapper" inorderTree(T)=inorder(T.root)"
Result: "inorder(T.root) ergibt: 9 17 23 23 24 25"

```
preorder(x)
1  IF x != nil THEN
2    print x.key;
3    preorder(x.left);
4    preorder(x.right);
```
Result: "preorder(T.root) ergibt: 23 17 9 23 24 25"

```
postorder(x)
1  IF x != nil THEN
2    postorder(x.left);
3    postorder(x.right);
4    print x.key;
```
Result: "postorder(T.root) ergibt: 9 23 17 25 24 23"

Note: "Beispielanwendung: Serialisierung" (for inorder)

**Slide variant (iterative search, recursive search shown side by side):**

```
search(x,k)  //1.Aufruf x=root
1  IF x==nil OR x.key==k THEN
2    return x;
3  IF x.key > k THEN
4    return search(x.left,k);
5  ELSE
6    return search(x.right,k);
```

```
iterative-search(x,k)   //Aufruf x=root
1  WHILE x != nil AND x.key != k DO
2    IF x.key > k THEN
3      x=x.left;
4    ELSE
5      x=x.right;
6  return x;
```

**Slide variant (insert with numbered steps annotation):**

```
insert(T,z)
    //may insert z again
    //z.left==z.right==nil;
1  x=T.root; px=nil;
2  WHILE x != nil DO
3    px=x;
4    IF x.key > z.key THEN
5      x=x.left;
6    ELSE
7      x=x.right;
8  z.parent=px;
9  IF px==nil THEN
10   T.root=z;
11 ELSE
12   IF px.key > z.key THEN
13     px.left=z;
14   ELSE
15     px.right=z;
```
Laufzeit = O(h)
Diagram: insert(T,z) example — tree root 17, right subtree 24 (children 22(green,new,step 8-15), 25); step numbers 1-7 labeled along traversal path from 17→24→22.

**Slide variant (transplant + delete with step numbers):**

```
transplant(T,u,v)   // hängt Teilbaum v an Elternknoten von u
1  IF u.parent==nil THEN
2    T.root=v
3  ELSE
4    IF u==u.parent.left THEN
5      u.parent.left=v
6    ELSE
7      u.parent.right=v
8  IF v != nil THEN
9    v.parent=u.parent;
```
Laufzeit = Θ(1)  ("zur Erinnerung")
Diagram: shows y, u, z, v nodes with step numbers 4-7 and 8-9 annotated on tree-transplant illustration.

```
delete(T,z)
1  IF z.left==nil THEN
2    transplant(T,z,z.right)
3  ELSE
4    IF z.right==nil THEN
5      transplant(T,z,z.left)
6    ELSE
7      y=z.right;
8      WHILE y.left != nil DO y=y.left;
9      IF y.parent != z THEN
10       transplant(T,y,y.right);
11       y.right=z.right;
12       y.right.parent=y;
13     transplant(T,z,y);
14     y.left=z.left;
15     y.left.parent=y;
```
Laufzeit = O(h)
Diagram: nodes z, y, r with dashed/grayed subtree "Y" and step numbers 13, 14-15 annotated.

---

## 6 Fortgeschrittene Datenstrukturen

### 6.1 Red-Black Tree

Ein Red-Black Tree ist eine Art Binary-Search Tree. Zusätzlich zu diesem besitzen die Nodes in einem RB Tree noch das Attribut `color`. Die Nodes werden also entweder als `red` oder `black` definiert. Dies dient zur Einhaltung der Red-Black-Regeln, durch die die Effizienz der Datenstruktur im Vergleich zum BST verbessert wird.

Die Regeln sind:

1. **Jeder Knoten ist entweder schwarz oder rot**
2. **Die Wurzel ist schwarz**
3. **Rote Knoten haben keine Roten Kinder**
4. **Jeder Pfad von einem Knoten zu seinen Nachkommen besitzt die selbe Anzahl an schwarzen Knoten**

⟹ Hat ein Knoten nur ein Kind, so muss dieses Kind Rot sein, ansonsten ist die Anzahl an schwarzen Knoten auf dem Pfad unterschiedlich zu den anderen Pfaden.

Der Vorteil von RBT zu BST ist, dass während ein BST unausgewogen sein kann, was in einem Worst-Case von h = n resultiert, im RBT durch die Regeln eine maximale Höhe von h = 2 · log(n + 1) sichergestellt wird, was die Worst-Case Laufzeit der Algorithmen deutlich verbessert.

Definition:

```
1  Class RBNode():
2    key;
3    left;
4    right;
5    parent;
6    color;
7    Constructor RBNode(k):
8      key = k;

9  Class RBTree():
10   sent;
11   root;
12   Constructor RBTree():
13     sent = new RBNode(NIL);
14     sent.color = BLACK;
15     sent.left = sent;
16     sent.right = sent;
17     // Sentinel always points to itself ⟹ node.parent.parent and its children will never
          result in null references
18     root = sent;
```

Diagram: "Richtig Konstruierter RBT" — root=48(black), left=8(red, children 7,23 black), right=68(red, children 50(has red child 52), 71 black). "Falsch Konstruierter RBT" — same structure but node 52 shown black (this makes it invalid, since black-height along that path differs).

**Insertion:**

```
1  Class RBTree() (continued):
2    // Complexity: Ω(1), O(log n), Θ(log n)
3    Function insert(z):
4      z.left = sent;
5      z.right = sent;
6      x = root; // Traversal starting from the root
7      px = sent; // Parent of x, initially sentinel unlike BST
8      While x ≠ sent do
9        px = x;
10       If z.key < x.key then
11         x = x.left;
12       Else
13         x = x.right;
14     // Traversing the tree until finding the insertion point
15     z.parent = px; // Sets the parent of the node to be inserted
16     If px == sent then
17       root = z; // px only sentinel if tree is empty → z is root
18     Else If z.key < px.key then
19       px.left = z; // Key smaller → left child
20     Else
21       px.right = z; // Key bigger → right child
22     z.color = RED; // Sets color to red, will not necessarily stay red
23     fixColorsAfterInsertion(z); // Fixes colors to maintain RB properties
```

Einfügen funktioniert grundlegend gleich zu BST, allerdings wird am Ende die Farbe des neuen Knotens auf rot gesetzt und anschließend die Regeln des RBTs (falls verletzt) wieder hergestellt.

Worked example trace (RBT insertions), starting tree: root=48(black), left=8(red, children 7,23), right=68(red, children 50(child 52 red),71):

- **Insert 37 (No colorfix needed):** traversal path 48→8→23→37 (shown as green arrows). New node 37 inserted red as right child of 23. Resulting tree: 48(black) / 8(red,[7,23(23's right child now 37 red)]) , 68(red,[50(child 52 red),71])
- **Insert 55 (Colorfix needed):** [shown starting from tree without the 37 insert, i.e. base tree again] traversal path 48→68→50→52→55 (green arrows). New node 55 inserted red as right child of 52. Since 52 is red and its new child 55 is also red, this violates rule 3 (red node with red child) — colorfix needed. Resulting tree (before fix) shown: 48(black)/[8(red,[7,23]), 68(red,[50(red,[_,52(red,[_,55(red)])]),71])]

[Note: the actual colorfix algorithm/rotation steps for this example were not shown on these pages — continues on subsequent pages not yet read.]

---
[CONTINUED IN NEXT SECTIONS — pages 41 onward]
