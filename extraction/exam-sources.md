# ALTKLAUSUR 23-24 (Nachklausur/Fachprüfung, aud-exam-20240405)

**Metadata (from cover page / Deckblatt):**
- Technische Universität Darmstadt — Fachbereich Informatik
- Titel: Nachklausur / Fachprüfung — Algorithmen und Datenstrukturen
- Wintersemester 2023/2024
- Datum/Zeit: 05.04.2024 — 09:00–11:00 Uhr (i.e., 2 hours / 120 minutes)
- Hinweise (rules):
  - Only black or blue pen allowed; no pencils, red/correction pens, correction fluid/tape. Cross out clearly what should not be graded.
  - Allowed aids ("Hilfsmittel"): lecture slides, exercises ("Übungen"), other notes, books, dictionaries, and other literature. **Not allowed**: any electronic devices (calculators, laptop, mobile phone, etc.); phones/smartwatches must be switched off and not within immediate reach.
  - Fill out cover sheet completely and legibly.
  - Write name and Matrikelnummer on every answer sheet.
  - Write solution in the space under each task; use blank pages at end of exam if needed and clearly indicate page number if answering elsewhere.
  - Submit only ONE solution per task — multiple variants invalidate the whole solution. Cross out clearly what should not be graded.
  - If this is your third attempt ("Drittversuch"), note this on the cover sheet.
  - **Passing threshold: 50 of 100 total points.**
- Point distribution table (Aufgabe / Max. Punkte):

| Aufgabe | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | Σ |
|---|---|---|---|---|---|---|---|---|---|
| Max. Punkte | 13 | 10 | 14 | 12 | 6 | 13 | 17 | 15 | 100 |

- Section titles: 1 Sortieren (13P), 2 Binäre Suchbäume (10P), 3 Randomisierte Datenstrukturen (14P: 3.1 Skip-Listen 4P, 3.2 Hash-Tabellen 6P, 3.3 Bloom-Filter 4P), 4 Rot-Schwarz-Bäume (12P: 4.1 Verständnisfragen 8P, 4.2 Einfügen 4P), 5 AVL-Bäume (6P), 6 Graphenalgorithmen (13P: 6.1 Verständnisfragen 5P, 6.2 Algorithmus von Dijkstra 8P), 7 Advanced Designs (17P: 7.1 Allgemeine Fragen 2P, 7.2 Dynamic Programming 8P, 7.3 Greedy-Algorithmus 7P), 8 Asymptotik und NP (15P: 8.1 Asymptotische Laufzeiten 5P, 8.2 Mastertheorem 5P, 8.3 NP 5P).
- **No official/expected solutions are included in this document** — it is a blank exam paper (student answer spaces only, all left empty). Pages 24–26 are blank scratch pages.

---

## Aufgabe 1: Sortieren (13 P total)

### 1.1 (2 P) — fill-in-the-blank / trace-this-algorithm format
Im Folgenden ist der Sortieralgorithmus INSERTION-SORT lückenhaft dargestellt. Füllen Sie die fehlenden Stellen aus, sodass Sie einen funktionierenden INSERTION-SORT Algorithmus haben, der in **abfallender** Reihenfolge sortiert.

```
INSERTION-SORT(A)
1:  for j = 1 to A.length - 1 do
2:      key = A[j]
3:      i = j - 1
4:      while i >= 0 and __________ do
5:          A[i+1] = A[i]
6:          __________
7:      A[i+1] = key
```
(Blanks on lines 4 and 6 to be filled in by student; no solution given.)

### 1.2 (1 P) — short answer
Inwiefern unterscheiden sich die beiden Sortieralgorithmen MERGE-SORT und INSERTION-SORT konzeptionell?

### 1.3 (1,5 P) — short answer
Erklären Sie in maximal **drei** Sätzen das Prinzip Divide-and-Conquer.

### 1.4 (0,5 P + 6 P) — trace-this-algorithm
Führen Sie die Unterroutine MERGE in MERGE-SORT auf dem Array
```
A[12..17] = [3, 5, 6, 2, 4, 8]
```
aus.

a) (0,5 P) Bestimmen Sie im ersten Schritt die Arrays L und R.
```
L = [ ______ ], R = [ ______ ]
```
(Expected, not given as printed solution — but derivable: L = [3,5,6], R = [2,4,8])

b) (6 P) Anschließend durchläuft der Algorithmus in der Unterroutine merge eine for-Schleife und überträgt nach und nach die Elemente nach B. Geben Sie den Zustand des Arrays B nach jedem Durchlauf der for-Schleife sowie direkt vor dem Ende an, wobei das Array zu Beginn mit 0-Werten belegt wird. Geben Sie die Werte von i, pl und pr nach jeder Iteration der for-Schleife sowie direkt vor dem Ende von MERGE konkret an.

Blank answer table structure given (student fills in): starts with `[0,0,0,0,0,0]  i=___, pl=___, pr=___` then six more rows of `[ , , , , , ]  i=___, pl=___, pr=___`, ending with a final `[ , , , , , ]` row (no i/pl/pr, i.e., final state of B). No solution provided.

### 1.5 (2 P) — short answer / ranking
Sortieren Sie die folgenden Sortieralgorithmen aufsteigend nach ihrer worst-case Komplexität und geben Sie diese auch jeweils an. Bei gleicher worst-case Komplexität vergleichen Sie die erwarteten Laufzeiten miteinander und benennen Sie diese ebenfalls.
- QUICKSORT
- MERGE-SORT
- INSERTION-SORT

---

## Aufgabe 2: Binäre Suchbäume (10 P total)

### 2.1 (2 P) — trace/draw
Fügen Sie **nacheinander** die folgenden Werte in den gegebenen binären Suchbaum ein: 62, 45, 29, 93, 0, 17, 41, 39. Verwenden Sie dabei den Algorithmus aus der Vorlesung zum Einfügen von Knoten in einen binären Suchbaum. Sie dürfen den angegebenen binären Suchbaum vervollständigen.

Given tree:
```
              43
           /      \
         35        71
        /         /   \
      15         59    72
```

### 2.2 (3 P) — trace-this-algorithm
Sei T der folgende binäre Suchbaum. Bestimmen Sie die Ausgabe der Algorithmen PREORDER(T.root), POSTORDER(T.root) und INORDER(T.root), und geben Sie diese unten an.

Given tree:
```
                    57
              /            \
           28                63
         /    \             /   \
       16      48          60    70
      /       /   \                \
     5       35    54               83
              \                    /
               41                72
```
(Student fills in Preorder / Postorder / Inorder — blank, no solution given.)

### 2.3 (2 P) — draw-this / trace-this-algorithm
Löschen Sie den Knoten 28 aus dem Baum aus Teilaufgabe 2. Verwenden Sie dabei den Algorithmus aus der Vorlesung zum Löschen von Knoten aus einem binären Suchbaum. Zeichnen Sie nach der Löschoperation den vollständigen Baum.

### 2.4 (3 P) — short answer / identify-and-justify
Für eine der folgenden drei Zahlenfolgen existiert kein binärer Suchbaum, für den die Folge ein gültiger Suchpfad ist. Nennen Sie diese Folge und begründen Sie, warum sie keinen gültigen Suchpfad darstellt.
- Folge 1: 325, 511, 470, 361, 458, 398, 369, 373.
- Folge 2: 213, 867, 752, 527, 311, 426, 402, 376.
- Folge 3: 537, 458, 337, 376, 439, 498, 440, 442.

---

## Aufgabe 3: Randomisierte Datenstrukturen (14 P total)

### 3.1 Skip-Listen (4 P)

**3.1.1 (2 P) — trace-this-algorithm / draw**
Gegeben sei folgende Skip-Liste mit Wahrscheinlichkeit p = 1/8:
```
Level 2: -∞ --------------------------------------> 87
Level 1: -∞ -----------------> 18 ----------------> 87
Level 0: -∞ --> 17 --> 18 --> 43 --> 87 --> 93
```
Fügen Sie den Wert 49 ein. Nutzen Sie dafür die folgenden, uniform zwischen 0 und 1 verteilten Zufallswerte, und fügen Sie den Wert in weitere Ebenen ein, falls der Zufallswert kleiner p ist:
```
0,06; 0,10; 0,11; 0,26; 0,03; 0,96
```
Zeichnen Sie die Skip-Liste nach der Einfügeoperation.

**3.1.2 (2 P) — short answer**
Was ist die durchschnittliche Höhe einer Skip-Liste mit n Elementen und Wahrscheinlichkeit p > 0 für übergeordnete Listen? Begründen Sie Ihre Antwort.

### 3.2 Hash-Tabellen (6 P)

**3.2.1 (2 P) — trace-this-algorithm / draw**
Gegeben sei eine Hash-Tabelle mit einer Kapazität von 5, die Zahlen abspeichert. Die verwendete Hashfunktion h(n) ist dabei gegeben als:
```
h(n) = 3·q(n) + 4  mod 5
```
wobei q(n) die Quersumme der Zahl ist (Summe aller Ziffern; z.B. Quersumme von 76 = 13). Die Hash-Tabelle arbeitet mit verketteten Listen für Konflikte, wobei neue Elemente an das **Ende** der Liste gehängt werden.

Fügen Sie die folgenden Zahlen in die Hash-Tabelle nacheinander ein, indem Sie die gegebene Zeichnung ergänzen: **98, 124, 3000, 2040, 72, 15, 94, 740**

Table T has indices 0–4, each initially empty with a pointer/arrow (chaining structure). (Blank, no solution given.)

**3.2.2 (2 P) — short answer**
Nennen Sie ein Beispiel, in dem diese Hashfunktion zu schlechten Ergebnissen führen würde, und wie dieses mit realen Daten auftreten könnte. Was wäre eine bessere Alternative für die Hashfunktion?

**3.2.3 (2 P) — short answer**
Nennen Sie eine für zufällige Eingaben maximal schlechte Hashfunktion, die jedoch immer noch auf den korrekten Wertebereich (also auf Kapazität viele Werte) abbildet. Wie würde sich hier die asymptotische Komplexität für die Suche in der Hash-Tabelle verschlechtern? Begründen Sie Ihre Aussagen.

### 3.3 Bloom-Filter (4 P)

Gegeben sei ein Bloom-Filter, in den bereits Elemente eingefügt worden sind.

**3.3.1 (2 P) — short answer**
Angenommen, der Filter gibt Ihnen für Ihre Anfrage, ob ein Element x im Filter ist, die Antwort 0 ("nicht enthalten") zurück. Ist das Element x dann wirklich nicht im Filter? Begründen Sie Ihre Antwort.

**3.3.2 (2 P) — prove-or-disprove**
Beweisen oder widerlegen Sie: Wenn der Bloom-Filter eine falsche Antwort gibt, dann müssen im Filter vorher mindestens zwei Elemente eingefügt worden sein.

---

## Aufgabe 4: Rot-Schwarz-Bäume (12 P total)

Notation: rote Knoten = Rechteck, schwarze Knoten = Kreis.

### 4.1 Verständnisfragen (8 P)

**4.1.1 — identify-and-justify (1 P each, 4 sub-parts a-d)**
Welche der folgenden Bäume sind Rot-Schwarz-Bäume? Begründen Sie Ihre Angabe.

a) (1 P):
```
                8(●)
           /            \
        2(▭)            15(●)
       /    \           /    \
     1(●)   3(▭)     11(●)   20(▭)
              \       /  \      \
              5(●)  9(●) 12(●)  21(▭)
```

b) (1 P):
```
                7(●)
           /          \
        4(▭)          9(●)
       /    \         /    \
     3(●)   5(▭)    8(▭)  10(▭)
              \
              6(●)
```

c) (1 P):
```
                12(●)
           /            \
        7(▭)            16(●)
       /    \           /    \
     5(●)  10(●)     14(▭)  18(▭)
     /  \
   1(▭) 3(▭)
```

d) (1 P):
```
                       10(●)
              /                    \
           4(▭)                   14(▭)
          /    \                  /    \
        2(●)   7(●)            12(●)  16(●)
       /  \    /  \                    /  \
     1(▭)3(▭) 5(▭)8(▭)              15(▭) 17(▭)
                \
                6(●)
```

**4.1.2 (2 P) — short answer**
Nennen Sie einen Vorteil von Rot-Schwarz-Bäumen gegenüber herkömmlichen binären Suchbäumen. Wie wird dieser erreicht?

**4.1.3 (2 P) — draw / color-this**
Gegeben sei folgender **binärer Suchbaum**. Bestimmen Sie eine mögliche Rot-Schwarz-Färbung für diesen Baum. Vervollständigen Sie jeden Knoten entsprechend durch ein Rechteck oder einen Kreis.
```
                       10
              /                    \
            6                       13
          /    \                  /    \
        5       8                11      15
               /  \                \
              7    9                12
```

### 4.2 Einfügen (4 P)

**4.2.1 (1 P) — trace-this-algorithm / draw**
Fügen Sie den Knoten 10 in den folgenden Rot-Schwarz-Baum ein:
```
                       11(●)
              /                    \
           7(▭)                   15(●)
          /    \                       \
        5(●)   9(●)                    18(▭)
                 \
                 8(▭)
```
Verwenden Sie stets den Algorithmus aus der Vorlesung zum Einfügen von Knoten in einen Rot-Schwarz-Baum. Zeichnen Sie Ihr Zwischenergebnis jeweils nach dem Einfügen, sowie nach jeder Iteration der while-Schleife in FIXCOLORSAFTERINSERTION und gegebenenfalls nach dem letzten Umfärben der Wurzel.

**4.2.2 (3 P) — trace-this-algorithm / draw**
Fügen Sie den Knoten 3 in den folgenden Rot-Schwarz-Baum ein:
```
                       14(●)
              /                    \
            6(▭)                  18(●)
          /    \                       \
        4(●)   8(▭)                    20(▭)
       /  \
     2(▭) 5(▭)
```

---

## Aufgabe 5: AVL-Bäume (6 P total)

Konvention: Wurzel eines Baumes hat Tiefe 1 (nicht 0), sodass die Höhe von Bäumen bei 1 beginnt.

### 5.1 (1,5 P + 1,5 P) — identify-and-justify
Welche der folgenden Bäume sind AVL-Bäume? Begründen Sie Ihre Antwort. Geben Sie bei einer positiven Antwort an, welche Eigenschaften gelten, und nennen Sie bei einer negativen Antwort mindestens eine Eigenschaft, die verletzt wird, und wo.

a) (1,5 P):
```
                       8
              /                \
            6                   11
          /    \               /    \
        4       7             9      12
       /  \                    \
      2    5                   10
     / \
    1   3
```

b) (1,5 P):
```
                          7
              /                        \
            4                           15
          /    \                    /        \
        2       5                 13           20
         \       \              /    \           \
          3       6            8      10          18
                                        \
                                        14
                                       /
                                      9
```

### 5.2 (2 P) — draw-this
Zeichnen Sie einen AVL-Baum der Höhe 6 mit der kleinstmöglichen Anzahl an Knoten.

### 5.3 (1 P) — draw-this
Zeichnen Sie einen AVL-Baum der Höhe 4 mit der maximalen Anzahl an Knoten.

---

## Aufgabe 6: Graphenalgorithmen (13 P total)

### 6.1 Verständnisfragen (5 P)

**6.1.1 (2 P) — short answer**
Definieren Sie das Problem, welches vom Algorithmus von Prim gelöst wird.

**6.1.2 Gegeben sei der folgende Graph G = (V,E):**
```
Nodes: a, b, c, d, e
Directed edges (arrows): a→b, a→c, a→d, b→c, b→d, b→e, c→d, c→e, d→e
(also appears: c→b or similar cross edges per drawing; d has an incoming self-loop-like arrow drawn — likely d receives from a,b,c and points to e)
```
[UNCLEAR: exact edge set of graph — page shows a dense digraph on nodes {a,b,c,d,e} with d in the center; edges include a→b, a→c, a→d, b→d, b→c(or c→b), c→d, c→e, d→e, b→e — full precise arrow directions not fully legible from the rendered image]

a) (1,5 P) — short answer
Bestimmen Sie eine kleinstmögliche Teilmenge E' ⊆ E von zu entfernenden Kanten, sodass G' = (V, E \ E') topologisch sortiert werden kann, und geben Sie diese an (wenn E' = ∅ schreiben Sie "□" zwischen die Mengenklammern).
```
E' = { ______ }
```

b) (1,5 P) — draw/short-answer
Geben Sie eine topologische Sortierung von G' an. Fügen Sie dazu die Knoten von G' in der richtigen Reihenfolge in die verkettete Liste unten ein. (5 empty boxes linked in a chain given for the answer.)

### 6.2 Algorithmus von Dijkstra (8 P)

Betrachten Sie den gewichteten Graphen G = (V,E,w) mit Knotenmenge V = {a,b,c,d,e,f}, dessen gewichtete Kanten durch folgende (asymmetric/directed) Adjazenzmatrix beschrieben sind (□ = keine Kante):

```
      a    b    c    d    e    f
  a [ □    1    □    4    3    5  ]
  b [ 7    □   14    □    1    4  ]
  c [10   12    □    1   17    2  ]
  d [19   17    3    □   25    5  ]
  e [15    □    2    7    □    8  ]
  f [ 8    9    □   73   12    □  ]
```
(Reading: entry k in row i, column j means (i,j) ∈ E and w((i,j)) = k.)

**6.2.1 (6 P) — trace-this-algorithm**
Führen Sie den Algorithmus von Dijkstra auf diesem Graphen aus. Beginnen Sie im Knoten d. Füllen Sie dazu die Tabelle auf der nächsten Seite aus. Diese enthält eine separate Zeile für jede Iteration der while-Schleife im Algorithmus. Geben Sie in jeder Zeile an, welcher Knoten r im gegebenen Schritt aus der Menge Q extrahiert wird, sowie die Menge Q am Ende des betrachteten Schrittes. Bestimmen Sie außerdem die Schätzung des kürzesten Pfades s.d und den Vorgängerknoten s.p für jeden Knoten s im Graphen nach jeder Iteration. **Table must be filled completely; incomplete rows count as errors.** Use "=" to indicate "same as cell above."

Answer table skeleton (student fills in; initial state row given, pre-filled with starting values before loop begins, rotated in the PDF but transcribed here upright):
```
Row labels (columns, right to left in original): a.d=∞, b.d=∞, c.d=∞, d.d=0, e.d=∞, f.d=∞,
                                                    a.p=nil, b.p=nil, c.p=nil, d.p=nil, e.p=nil, f.p=nil,
                                                    r = -,
                                                    Q = {a,b,c,d,e,f}
```
Each subsequent row (6 total iteration rows, blank for student to fill) has columns for: [6 blank data cells] | a.d | b.d | c.d | d.d | e.d | f.d — with r and Q also present per row (structure is a large table oriented with row headers on the right: a.d, b.d, c.d, d.d, e.d, f.d, r, Q). No solution filled in.

**6.2.2 (2 P) — draw-this**
Verwenden Sie nun das obige Ergebnis, um den kürzesten Pfad von d nach e, und jenen von d nach a anzugeben. Zeichnen Sie dazu die entsprechenden Kanten in die Abbildungen unten ein.
(Two blank node diagrams given, each showing nodes a,b,c,d,e,f in a 2×3 grid layout, for student to draw edges on.)

---

## Aufgabe 7: Advanced Designs (17 P total)

### 7.1 Allgemeine Fragen (2 P)

**7.1.1 (1 P) — short answer**
Wann werden Metaheuristiken zur Lösung eines Problems angewendet?

**7.1.2 (1 P) — short answer**
Auf welcher grundlegenden Idee beruht Backtracking?

### 7.2 Dynamic Programming (8 P)

**Problembeschreibung ("Treppensteigeproblem"):** Gegeben ist eine Treppe aus n Stufen. Eine Person, die diese Treppe nach oben läuft (darf nicht rückwärts laufen), kann jeweils eine Stufe oder zwei Stufen pro Schritt gehen und muss am Ende genau auf der n-ten Stufe ankommen. Implementieren Sie einen rekursiven Algorithmus, der die Anzahl aller möglichen Wege berechnet, wie eine Person zur n-ten Stufe gehen kann.

**7.2.1 (1 P) — short answer**
Veranschaulichen Sie das obige Problem anhand der folgenden Treppendarstellung: Wie viele Möglichkeiten gibt es für n=2? (Staircase illustration with 5 steps shown, shaded.)

**7.2.2 (2 P) — short answer with justification**
Wie viele Möglichkeiten gibt es, mindestens drei, aber höchstens vier Stufen zu gehen? Begründen Sie Ihre Antwort.

**7.2.3 (2 P) — fill-in-the-blank code**
Vervollständigen Sie die fehlenden Lücken im Pseudocode.
```
STAIRS(n)
1:  if n = 1 then
2:      return __________
3:  elseif n = 2 then
4:      return __________
5:  else
6:      s = __________
7:  return s
```

**7.2.4 (2 P) — draw-this**
Geben Sie den vollständigen Rekursionsbaum für die Ausführung von STAIRS(5) an.

**7.2.5 (1 P) — short answer**
Welche Laufzeit hat der Algorithmus STAIRS?

### 7.3 Greedy-Algorithmus (7 P)

**7.3.1 (1 P) — short answer**
Auf welcher grundlegenden Idee beruht der Greedy-Algorithmus?

**7.3.2 (5 P) — code-this**
Sie wurden von der Wissenschaftsstadt Darmstadt beauftragt, für ein Parkhaus einen Parkautomaten zu programmieren, welcher nach erfolgreicher Zahlung der Parkgebühr etwaiges Rückgeld ausgibt. Die Menge an Münzen, die der Automat zurückgibt, ist gegeben durch die Menge M = {1, 2, 5, 10, 20, 50} (Münzen haben die Einheit Eurocent). Schreiben Sie selbstständig einen Greedy-Algorithmus in Pseudocode, welcher das obige Rückgeld entsprechend zurückgibt. Nutzen Sie dazu die folgende Vorlage (8 numbered blank lines) und beachten Sie, dass Sie nicht alle Zeilen der Vorlage nutzen müssen.
```
GREEDY( ___ )
1: 
2: 
3: 
4: 
5: 
6: 
7: 
8: 
```

**7.3.3 (1 P) — trace-this-algorithm**
Führen Sie den Greedy-Algorithmus jeweils für das Wechselgeld 34 und 76 aus.

---

## Aufgabe 8: Asymptotik und NP (15 P total)

### 8.1 Asymptotische Laufzeiten (5 P)

Geben Sie für die folgenden Abschätzungen der Laufzeit f(n) die asymptotische Laufzeit in O-, Ω-, oder Θ-Notation an. Wählen Sie jeweils die **restriktivste** Notation, und entfernen Sie alle überflüssigen Terme.

Beispiel (given, not a graded question): f(n) = 2n²+3n+4 sollte durch Θ(n²), jedoch nicht durch O(n³) oder Θ(2n²+3n+4) angegeben werden.

i) f(n) ≥ 97n³ + 4n⁹ − 8n³ − 14n
ii) f(n) ≤ 15ⁿ + n¹⁵ + nⁿ
iii) f(n) = 1042228576 + 2³⁰
iv) f(n) = { 13n² − 4n + 17, n < 10000 ; log₅(17n), n ≥ 10000 }
v) f(n) ≤ g(2g(3g(n))), wobei g(n) = n³

(No point-per-sub-item breakdown given beyond overall 5 P; no solutions provided.)

### 8.2 Mastertheorem (5 P)

Begründen Sie für jede der folgenden Rekursionsgleichungen T(n), ob Sie das Mastertheorem anwenden können oder nicht. Benutzen Sie gegebenenfalls das Mastertheorem, um eine asymptotische Schranke für T(n) zu bestimmen.

1. T(n) = 5T(n/25) + log₂(n² + 3) − 1
2. T(n) = 16T(n/4) + n² log₂(n + 2)

### 8.3 NP (5 P)

**8.3.1 (1 P) — short answer**
Wann ist ein Problem NP-schwer (auch NP-hart genannt)?

**8.3.2 (1 P) — short answer**
Wann ist ein Problem NP-vollständig?

**8.3.3 (2 P) — short answer**
Was müssen Sie tun, wenn Sie ein Problem als NP-vollständig nachweisen wollen?

**8.3.4 (1 P) — short answer**
Nennen Sie zwei NP-vollständige Probleme.

**8.3.5 (1 P) — short answer**
Was ist der Unterschied zwischen einem Entscheidungsproblem und einem Berechnungsproblem?

(Pages 24–26 are blank scratch/overflow pages — no content.)

---

# AuD Gedächtnisprotokoll SoSe 2025 (HedgeDoc export)

**Metadata (from top of document):**
- Title: "AuD Gedächtnisprotokoll SoSe 2025" (student's written recollection of the actual Summer Semester 2025 exam, reconstructed from memory)
- **100 Punkte, davon 42P Multiple Choice**
- **Zeit: 120 Minuten**
- **Hilfsblatt: Zweiseitiges A4-Blatt** (a two-sided A4 cheat sheet was allowed as the aid)
- Source URL footer: https://md.darmstadt.ccc.de/s/WHwVOvTlV (HedgeDoc pad), dated 20.05.26 17:14 (export timestamp)
- No difficulty commentary or additional prose notes from the author beyond the structural metadata above (format/duration/aids) — the document is presented as a direct reconstruction of exam questions without separate meta-commentary.
- Section point totals: 1) Multiple Choice 42P, 2) Asymptotik und Komplexität 5P, 3) Sortieralgorithmen 10P, 4) Probabilistische Datenstrukturen 4P, 5) Grundlegende Datenstrukturen 7P, 6) Fortgeschrittene Datenstrukturen 12P, 7) Graphenalgorithmen 8P, 8) Algorithmen-Entwurfsmethoden 12P. Sum = 42+5+10+4+7+12+8+12 = 100P (matches stated total).
- **No official solutions are provided** anywhere in this document — it is purely a reconstruction of questions (some show handwritten/scanned tree diagrams from the original exam, photographed).

---

## Section 1: Multiple Choice (42 Punkte)

### Part I — single correct answer (1 P each; 6 questions = 6P)
Instructions: "In diesem Abschnitt ist bei jeder Aufgabe genau *eine* der vier Aussagen richtig. Markieren Sie diese mit einem Kreuz (X)."

**1. (1P)** Topic: Complexity/Big-O ordering.
Ordnen Sie die folgenden Funktionen nach wachsender Komplexität:
f₁(n) = n log n, f₂(n) = n², f₃(n) = 2ⁿ, f₄(n) = n^(log n)
- f1 < f2 < f3 < f4
- f1 < f2 < f4 < f3
- f1 < f4 < f2 < f3
- f4 < f2 < f1 < f3

**2. (1P)** Topic: Stacks/Queues.
Aussagen über Stacks und Queues:
- Der Stack und die Queue arbeiten beide nach dem LIFO-Prinzip.
- Der Stack und die Queue arbeiten beide nach dem FIFO-Prinzip.
- Der Stack arbeitet nach dem LIFO-Prinzip, die Queue nach dem FIFO-Prinzip.
- Der Stack arbeitet nach dem FIFO-Prinzip, die Queue nach dem LIFO-Prinzip.

**3. (1P)** Topic: Linked lists.
Verkettete Listen:
- Das Einfügen von zwei Elementen nacheinander am Ende einer einfach verketteten Liste erfordert höchstens zwei Traversierungen der Liste.
- Jedes Element in einer einfach verketteten Liste enthält mindestens zwei Zeiger.
- Einfach verkettete Listen erlauben direkten Zugriff auf ein beliebiges Element per Index.
- In einer einfach verketteten Liste kann man rückwärts durch die Liste iterieren.

**4. (1P)** Topic: Binary search trees.
Binäre Suchbäume (BST) mit n Elementen:
- In einem BST können Blätter auf jeder Ebene auftreten.
- Auf einer Ebene mit Tiefe d gibt es immer weniger als 2^d viele Knoten im BST.
- Die Höhe eines BST kann im worst case gleich n sein.
- Im best case ist die Höhe eines BST log₁₀ n.

**5. (1P)** Topic: Tree traversals.
Welche der folgenden Traversierungen eines binären Suchbaums gibt die Elemente aufsteigend sortiert aus?
- Preorder Traversierung
- Postorder Traversierung
- Inorder Traversierung
- Jede der oben genannten Traversierungen.

**6. (1P)** Topic: Bloom filters.
Suchen in einem Bloomfilter:
- Es kann nur False Negatives geben.
- Es kann nur False Positives geben.
- Es kann sowohl False Negatives als auch False Positives geben.
- Es kann weder False Negatives noch False Positives geben.

### Part II — exactly two correct answers (2 P each; 18 questions = 36P)
Instructions: "In diesem Abschnitt sind bei jeder Aufgabe genau *zwei* der vier Aussagen richtig. Markieren Sie diese mit einem Kreuz (X). Es werden nur dann Punkte vergeben, wenn genau die beiden richtigen Aussagen markiert wurden."

**1. (2P)** Topic: Skip lists. Skip-Listen (n Elemente, Wahrscheinlichkeit p):
- Die durchschnittliche Höhe liegt nicht in Ω(log n)
- Die Zeit-Komplexität für Löschen liegt im Durchschnitt in Θ(n)
- Der Speicherbedarf ist durchschnittlich n/(1−p)
- Die Zeit-Komplexität für Suchen liegt im Durchschnitt in Θ(n log n)

**2. (2P)** Topic: Algorithm analysis / trace code. Sei f die Laufzeit des Algorithmus Alg(n) (siehe unten).
- f(n) ∈ O(n)
- f(n) ∈ O(n²)
- f(n) ∈ Θ(n·log(n))
- f(n) ∈ Θ(n²)

Given code:
```
Alg(n)
c = 0
for i = 1 to n do
    j = 1
    while j < i do
        j = 2 * j
        c = c + j
    done
done
return c
```

**3. (2P)** Topic: Stacks/Queues.
- Auf ein Element in der Mitte eines Stacks kann zugegriffen werden, ohne dass darüber liegende Elemente entfernt werden müssen.
- Die Zeit-Komplexität von Push- und Pop-Operationen in Stacks beträgt typischerweise O(1).
- Die Zeit-Komplexität von Enqueue- und Dequeue-Operationen in Queues beträgt typischerweise O(n).
- Das Enqueue und anschließende Dequeue bei einer Queue gibt nur dann dasselbe Element zurück, wenn die Queue vorher leer war.

**4. (2P)** Topic: Data structures (linked lists, ADTs).
- Ein Vorteil verketteter Listen ist, dass Einfügen und Löschen durch einfaches Anpassen von Zeigern erfolgen können, ohne dass die restlichen Elemente verschoben werden müssen.
- Bei einer doppelt verketteten Liste enthält jedes Element neben dem Wert einen Zeiger nur auf das nächste Element.
- Ein abstrakter Datentyp (ADT) beschreibt die möglichen Werte, Operationen und das Verhalten eines Datentyps, nicht aber dessen konkrete Implementierung.
- Die ADT-Beschreibung gibt die Zeit-Komplexität für Operationen an verketteten Listen an.

**5. (2P)** Topic: Advanced data structure equivalences (heaps, RBT, AVL).
Äquivalenz fortgeschrittener Datenstrukturen:
- Jeder binäre Max-Heap kann als ein Rot-Schwarz-Baum gefärbt werden.
- Jeder Rot-Schwarz-Baum ist ein binärer Suchbaum.
- Jeder Rot-Schwarz-Baum ist ein AVL-Baum.
- Jeder AVL-Baum kann als ein Rot-Schwarz-Baum gefärbt werden.

**6. (2P)** Topic: Tree rotations (Splay trees, AVL, BST, Max-Heap).
Rotationen (d.h. Funktionen rotateLeft() und rotateRight()) in Bäumen:
- Splay-Bäume brauchen beim Einfügen keine Rotationsfunktionen.
- AVL-Bäume brauchen beim Einfügen keine Rotationsfunktionen.
- Binäre Suchbäume brauchen beim Einfügen keine Rotationsfunktionen.
- Binäre Max-Heaps brauchen beim Einfügen keine Rotationsfunktionen.

**7. (2P)** Topic: Binary max-heaps.
- Das größte Element steht in der Wurzel.
- Ein binärer Max-Heap ist immer ein binärer Suchbaum.
- Das Löschen des maximalen Elements in einem binären Max-Heap, gefolgt vom Verschieben des letzten Knotens des Heaps an die Wurzel und schließlich der Durchführung von Heapify, führt zu einem binären Max-Heap.
- In einem binären Max-Heap befinden sich die größten Elemente in den Blättern.

**8. (2P)** Topic: Hash tables/functions.
- Hashtabellen werden verwendet, um Daten komprimiert zu speichern.
- Eine Hashfunktion ist deterministisch.
- Es gibt keine Hashfunktion, die Kollisionen vollständig vermeiden kann.
- Das Hauptziel von Hashfunktionen in Hashtabellen ist die Verschlüsselung von Schlüsseln zur Sicherheit.

**9. (2P)** Topic: Graph fundamentals/definitions.
- Ein endlicher Graph besteht aus einer endlichen Anzahl an Knoten und einer endlichen Anzahl an Kanten.
- Ein endlicher Graph besteht aus einer endlichen Anzahl Knoten und kann eine unendliche Anzahl an Kanten besitzen.
- Die Kantenmenge in einem gerichteten Graphen ist definiert als E := V×V (mit Knotenmenge V), sodass gilt: (u,v) ∈ E ⇔ (v,u) ∈ E.
- Die Kantenmenge in einem ungerichteten Graph ist definiert als E := V×V (mit Knotenmenge V), sodass gilt: (u,v) ∈ E ⇔ (v,u) ∈ E.

**10. (2P)** Topic: Graph algorithms (trees, topological sort, DFS on DAG).
- Wenn ein zusammenhängender ungerichteter Graph mit n Knoten n−1 Kanten hat, muss es sich um einen Baum handeln.
- Bei einem vollständig zusammenhängenden, gerichteten Graphen terminiert eine topologische Sortierung nicht.
- Eine Preorder-Traversierung auf einem Min-Heap gibt die Elemente in sortierter Reihenfolge aus.
- Beim Durchlauf der Tiefensuche (DFS) in einem Directed Acyclic Graph ist es möglich, dass Kreuzkanten entstehen.

**11. (2P)** Topic: Graph algorithms (BFS/DFS).
- Die Breitensuche (BFS) kann zur Bestimmung der kürzesten Pfade in ungewichteten Graphen verwendet werden.
- Bei der DFS muss eine Queue zur Verwaltung der offenen Knoten benutzt werden.
- In einem ungerichteten Graphen G entstehen durch DFS nur Baum- und Rückwärtskanten.
- Die BFS durchläuft bei jeder Eingabe stets weniger Knoten als die DFS.

**12. (2P)** Topic: Max-Flow / Ford-Fulkerson.
- Der maximale Fluss ist durch die Summe der Kapazität aller eingehenden Kanten am Zielknoten t definiert.
- Der Algorithmus terminiert, wenn kein flusserhöhender Pfad mehr existiert.
- Der Restkapazitätsgraph hat immer weniger Kanten als der ursprüngliche Graph.
- Ein Knoten v ∈ V\{s,t} kann nicht mehr eingehenden Fluss als ausgehenden Fluss haben.

**13. (2P)** Topic: Dijkstra and Bellman-Ford.
- Der Algorithmus von Dijkstra funktioniert nur für nicht-negative Kantengewichte.
- Der Algorithmus von Dijkstra funktioniert nur für Directed Acyclic Graphs (DAGs), also nur für gerichtete Graphen ohne Zyklen.
- Der Algorithmus von Bellman-Ford funktioniert nur für nicht-negative Kantengewichte.
- Der Algorithmus von Bellman-Ford funktioniert auch für Graphen mit nur negativen Kantengewichten.

**14–15. Note on layout:** Question 14 straddles pages 6–7, its four options are split across the page break:
**14. (2P)** Topic: Dijkstra.
- Dijkstra bricht bei einem erkannten Zyklus ab.
- Kantengewichte dürfen gleich 0 sein.
- Die Laufzeit von Dijkstra ist O(|V|·log(|V|)).
- Die Laufzeit von Dijkstra ist Θ(|V|·log(|V|) + |E|).

**15. (2P)** Topic: Algorithm design paradigms (D&C, DP, Greedy).
- Die Laufzeit eines Divide-and-Conquer-Algorithmus hängt nur von der Komplexität des Combine-Schritts ab.
- Dynamische Programmierung ist eine effiziente Methode für Probleme, bei denen ein naiver rekursiver Algorithmus dieselben Teilprobleme mehrfach lösen würde.
- Wenn ein Problem mit dynamischer Programmierung optimal gelöst werden kann, dann findet auch ein Greedy-Algorithmus immer die optimale Lösung für dasselbe Problem.
- Sowohl dynamische Programmierung als auch Greedy-Algorithmen setzen voraus, dass das Problem eine optimale Teilstruktur besitzt.

**16. (2P)** Topic: Algorithm design methods (Backtracking, Metaheuristics, Hill Climbing, Edit Distance).
- Backtracking macht im Durchschnitt gleich viele Schritte wie Brute Force.
- Metaheuristiken sind eine allgemeine Vorgehensweise, um Optimierungsprobleme zu lösen.
- Hill Climbing findet immer die beste Lösung.
- Die Minimum Edit Distance misst, wie viele Operationen nötig sind, um einen String in einen anderen zu überführen.

**17. (2P)** Topic: Algorithm design methods (D&C, Dijkstra=Greedy, Backtracking, DP).
- Beim Divide-&-Conquer-Verfahren muss jeder Zerlegungsschritt das Problem in gleich große Teilprobleme aufteilen, damit der Algorithmus korrekt arbeitet.
- Dijkstras Algorithmus ist ein Beispiel für ein Greedy-Algorithmus.
- Backtracking kann für Entscheidungsprobleme und für Optimierungsprobleme angewendet werden.
- Dynamisches Programmieren setzt voraus, dass ein Problem nicht überlappende Teilprobleme besitzt.

**18. (2P)** Topic: FFT.
- Die FFT ist eine Metaheuristik-Methode zur Lösung von Optimierungsproblemen.
- Die FFT verwendet ausschließlich reelle Zahlen und keine komplexen Zahlen.
- Die FFT nutzt die n-te primitive Einheitswurzel e^(2πi/n), um die Berechnung effizienter zu gestalten.
- Die FFT reduziert die Laufzeit der Multiplikation zweier Polynome vom Grad n−1 von Θ(n²) auf Θ(n·log(n)).

---

## Section 2: Asymptotik und Komplexität (5 Punkte)

**2.1 (3P)** — short answer, 3 sub-parts. Topic: asymptotic notation (O/Ω/Θ).
Geben Sie für die folgenden Funktionen f(n) die asymptotische Laufzeit in O-, Ω-, oder Θ-Notation an. Wählen Sie jeweils die restriktivste Notation und entfernen Sie alle überflüssigen Terme.
Beispiel (given, not graded): f(n) = 2n²+3n+4 sollte durch Θ(n²), jedoch nicht durch O(n³) oder Θ(2n²+3n+4) angegeben werden.

- a) (1P) f(n) = 4^(log₄(n)·√n + n·log₂(n))
- b) (1P) f(n) ≥ 3^(3n) + 10ⁿ
- c) (1P) f(n) ≤ n! + 1000ⁿ + n^100000 · log(1000n) + nⁿ

**2.2 (2P)** — short answer, 2 sub-parts. Topic: Mastertheorem.
Begründen Sie, ob für die folgenden Rekursionsgleichungen T(n) das Mastertheorem anwendbar ist. Benutzen Sie gegebenenfalls das Mastertheorem, um eine asymptotische Schranke für T(n) zu bestimmen.
- a) (1P) T(n) = 2T(n/4) + n²
- b) (1P) T(n) = 16T(n/2) + n³

---

## Section 3: Sortieralgorithmen (10 Punkte)

**3.1 (6P)** — trace-this-algorithm. Topic: Insertion sort, Quicksort.
Gegeben sei folgendes Array:
```
| 10 | 7 | 2 | 3 | 6 | 1 | 4 | 13 | 29 |
```
- a) (3P) Sortieren Sie das Array mithilfe des Insertion-Sort-Algorithmus. Nummerieren und zeichnen Sie jeden Schritt des Algorithmus. Hinweis: Nicht alle Iterationen müssen verwendet werden, falls das Array bereits früher vollständig sortiert ist.
- b) (3P) Sortieren Sie das Array mithilfe des Quicksort-Algorithmus. Nummerieren und zeichnen Sie jeden Schritt des Algorithmus. Hinweis: Nicht alle Iterationen müssen verwendet werden, falls das Array bereits früher vollständig sortiert ist.

**3.2 (4P)** — prove-this / fill-in-the-blank (loop invariant proof). Topic: Selection-sort-style algorithm ("MinSort") correctness proof.
Betrachten Sie den folgenden Pseudocode für den Sortieralgorithmus `MinSort`, welcher Arrays mit **eindeutigen Schlüsseln** aufsteigend sortiert.
Hinweis: Die Methode indexOfMin{A[p], ..., A[q]} bestimmt den Index des kleinsten Schlüsselwerts im Bereich A[p], ..., A[q].
```
n = length(A)
for i = 0 to n - 2 do
    imin = indexOfMin{A[i], ..., A[n-1]}
    swap(A[i], A[imin])
end for
```
Vor dem i-ten Durchlauf der FOR-Schleife gilt:
- A enthält genau die Einträge des ursprünglichen Arrays, und
- A[0, ..., i-1] enthält die i Einträge von A mit den kleinsten Schlüsseln, sortiert in aufsteigender Reihenfolge der Schlüssel.

Füllen Sie die Lücken des folgenden Beweises zur Schleifeninvariante von `MinSort` aus (fill-in-the-blank; blanks marked as `_____` below, no solution given in source):

> **Induktionsanfang:** Vor dem ersten Schleifendurchlauf (i = _____) stimmt A mit dem ursprünglichen Array überein (da A noch nicht verändert wurde), und trivialerweise enthält A[0,...,_____] die _____ Einträge von A mit den kleinsten Schlüsseln, aufsteigend sortiert. Somit ist die Schleifeninvariante vor dem Induktionsanfang erfüllt, und der Induktionsanfang ist gezeigt.
>
> **Induktionsschritt:** Angenommen, die Schleifeninvariante ist vor dem i-ten Durchlauf der FOR-Schleife erfüllt, also A enthält genau die Einträge des ursprünglichen Arrays, und A[0,...,i-1] enthält die i Einträge von A mit den kleinsten Schlüsseln, sortiert in aufsteigender Reihenfolge. Der Algorithmus berechnet nun den Index _____ ≤ i_min ≤ _____ des kleinsten Schlüssels in A[_____,...,_____], und tauscht A[i_min] und A[i]. Zu Beginn der nächsten (der (_____)-ten) Iteration der FOR-Schleife enthält A wieder die Einträge des ursprünglichen Arrays (da nur eine Tauschoperation stattgefunden hat), und A[0,...,_____] enthält die i+1 _____________________ , sortiert in aufsteigender Reihenfolge der Schlüssel. Damit ist der Induktionsschritt gezeigt.
>
> **Terminierung:** Die FOR-Schleife bricht vor dem _____-ten Durchlauf ab. Durch Einsetzen von i = _____ in die Schleifeninvariante erhalten wir: Das Array A enthält genau die Einträge des ursprünglichen Arrays, und A[0,...,_____] enthält die _____ Einträge von A mit den kleinsten Schlüsseln, sortiert in aufsteigender Reihenfolge. Dies bedeutet im Umkehrschluss, dass A[n-1] _____________________ sein muss, also ist A insgesamt nach der Ausführung von MinSort(A) aufsteigend nach den Schlüsselwerten sortiert.

---

## Section 4: Probabilistische Datenstrukturen (4 Punkte)

**4.1 Skip-Listen (4P)** — trace-this-algorithm / draw. Topic: skip lists.
Gegeben sei die folgende Skip-Liste mit einer Wahrscheinlichkeit p = 0,33.
```
Ebene 2: -∞ ------------------------------------------> 47
Ebene 1: -∞ ------------------------------> 47 --------> 95
Ebene 0: -∞ --> 13 --> 21 --> 47 --> 66 --> 95
```
- a) (1P) Fügen Sie den Wert 67 in die Liste ein. Nach Bedarf, nutzen Sie die folgenden Zufallswerte von links nach rechts (streichen Sie die verwendeten Werte durch): 0.15, 0.80, 0.61, 0.72, 0.82, 0.25, 0.83. Zeichnen Sie anschließend die Skip-Liste nach der Einfügeoperation.
- b) (1P) Fügen Sie in das Ergebnis von Teilaufgabe a) den Wert 19 ein. Nach Bedarf, nutzen Sie die folgenden Zufallswerte von links nach rechts (streichen Sie verwendete Werte durch): 0.09, 0.18, 0.39, 0.06, 0.01, 0.32, 0.67. Zeichnen Sie anschließend die Skip-Liste nach der Einfügeoperation.
- c) (2P) Zeichnen Sie in die nach Teilaufgabe b) entstandene Skip-Liste die Suchpfade für die beiden Werte 18 und 66 ein.

---

## Section 5: Grundlegende Datenstrukturen (7 Punkte)

**5.1 Binäre Suchbäume (BST) (7P)** — reconstruct-tree / trace / draw. Topic: BST construction from traversals, insertion, search paths.
Gegeben seien die Preorder-Traversierung [37, 15, 7, 29, 56, 85] und die Inorder-Traversierung [7, 15, 29, 37, 56, 85] eines binären Suchbaums.
- a) (1P) Zeichnen Sie den entsprechenden binären Suchbaum.
- b) (2P) Fügen Sie die Werte 23 und 60 nacheinander in den resultierenden Baum aus Teilaufgabe a) ein und zeichnen Sie den Baum nach jeder Einfügeoperation.
- c) (1P) Zeichnen Sie die Suchpfade für die Werte 29 und 50 in den resultierenden Baum aus Teilaufgabe b) und geben Sie die besuchten Knoten in der richtigen Reihenfolge an.
- d) (2P) Geben Sie eine Reihenfolge an, in der die Elemente des ursprünglichen Baums aus Teilaufgabe a) in einen leeren Baum eingefügt wurden.
- e) (1P) Gibt es (zusätzlich zu Ihrer Antwort) noch andere Einfügungsreihenfolgen, die zu demselben Baum führen würden? Warum/warum nicht?

(Derivable expected tree from a): root 37, left subtree root 15 (left child 7, right child 29), right subtree root 56 (right child 85) — i.e.:
```
                37
             /      \
           15        56
          /  \          \
         7    29         85
```

---

## Section 6: Fortgeschrittene Datenstrukturen (12 Punkte)

**6.1 Rot-Schwarz-Bäume (4P)** — identify-and-justify (4 sub-trees a-d, drawn as scanned/photographed images in source). Topic: RBT validity.
Notation: rote Knoten = Rechteck, schwarze Knoten = Kreis. "Definieren Sie diese Symbole **nicht** um."
Welche der folgenden Bäume sind Rot-Schwarz-Bäume? Begründen Sie Ihre Antwort. Geben Sie bei einer positiven Antwort an, welche Eigenschaften gelten, und nennen Sie bei einer negativen Antwort mindestens eine Eigenschaft, die verletzt wird, und wo.

a) Baum 1:
```
                       27(●)
              /                    \
           18(●)                   36(●)
          /       \                /       \
        9(●)      21(▭)          29(●)     59(▭)
       /   \                              /    \
     3(▭)  12(●)                       42(●)   68(●)
```

b) Baum 2:
```
                7(●)
           /            \
         4(●)           11(▭)
        /    \          /     \
      2(▭)   3(▭)     9(●)   12(●)
                        \
                       10(▭)
```

c) Baum 3:
```
                       13(●)
              /                    \
            9(●)                  21(▭)
          /      \              /         \
        3(▭)    11(●)        16(●)        24(●)
       /   \                 /    \        /    \
     1(●)  4(●)            15(●) 18(▭)   23(●)  27(●)
                                  /   \
                               17(●) 19(●)
```

d) Baum 4:
```
                       68(●)
              /                    \
           11(●)                   89(●)
          /       \                /       \
        4(●)      7(▭)          86(▭)      96(●)
                  /    \                    /    \
                6(●)   9(●)              92(●)  97(●)
                                74(●) [attached under 86]
```
[UNCLEAR: exact placement of node 74 under 86 in Baum 4 — appears as a single left child of 86(▭) based on layout]

**6.2 B-Bäume (4P)** — trace-this-algorithm / draw. Topic: B-tree insertion.
Betrachten Sie folgenden B-Baum mit Grad t=2:
```
                    [ 5 | 20 | 25 ]
              /        |        |        \
        [1,3,4]   [15,17]   [22,23]   [26,50]
```
Fügen Sie der Reihe nach die Schlüssel 16, 30 und 40 in diesen Baum ein. Verwenden Sie dabei den informellen Algorithmus aus der Vorlesung (Prinzip: Suchen und Splitten) zum Einfügen von Schlüsseln in einen B-Baum. Skizzieren Sie Ihr Zwischenergebnis nach jeder Einfügeoperation.

**6.3 AVL-Bäume (4P)** — code-this. Topic: AVL tree validity check, recursive algorithm.
Schreiben Sie den Pseudocode oder Java-Code eines rekursiven Algorithmus', der überprüft, ob eine Instanz eines binären Suchbaums (mit seinem Stammknoten T als Eingabe) auch ein AVL-Baum ist (gibt `true` zurück) oder nicht (gibt `false` zurück). Beachten Sie, dass Sie mehrere Funktionen definieren können. Zeigen Sie, wie Sie die Funktion mit dem Stammknoten des Baums, T, aufrufen würden.

---

## Section 7: Graphenalgorithmen (8 Punkte)

**7.1 Kruskal-Algorithmus (4P)** — trace-this-algorithm. Topic: Kruskal's MST algorithm with union-find (set-based).
Führen Sie den Algorithmus von Kruskal auf dem abgebildeten Graphen aus, indem Sie die Tabelle vervollständigen. Hinweis: Die untenstehende Tabelle muss vollständig ausgefüllt werden. Insbesondere werden unvollständige Zeilen als Fehler gewertet. Benutzen Sie das Symbol "=", wenn Sie die Inhalte der Zelle oberhalb in die aktuelle Zelle kopieren wollen.

Given graph (undirected, weighted), nodes {a,b,c,d,e,f}:
```
Edges: a-b (1), a-c (5), b-c (2), b-d (4), c-d (6), c-e (16), d-e (11), d-f (12), e-f (9)
```
Layout: a — b (w=1); a — c (w=5); b — c (w=2); b — d (w=4); c — d (w=6); c — e (w=16); d — e (w=11); d — f (w=12); e — f (w=9).

Table (partially filled in source as a worked/example table — appears to already show a filled-in solution trace! Transcribing exactly as shown):

| {u,v} | w({u,v}) | Dazu? | set(a) | set(b) | set(c) | set(d) [implied] | set(e) [implied] | set(f) [implied] |
|---|---|---|---|---|---|---|---|---|
| □ | □ | □ | {a} | {b} | {c} | — | — | — |
| {a,b} | 1 | ja | {a,b} | {a,b} | = | | | |
| {b,c} | 2 | ja | {a,b,c} | {a,b,c} | {a,b,c} | | | |
| {b,d} | 4 | ja | {a,b,c,d} | {a,b,c,d} | {a,b,c,d} | | | |
| {a,c} | 5 | nein | = | = | = | | | |
| {c,d} | 6 | nein | = | = | = | | | |
| {e,f} | 9 | ja | = | = | = | | | |
| {d,e} | 11 | ja | {a,b,c,d,e,f} | {a,b,c,d,e,f} | {a,b,c,d,e,f} (truncated in source) | | | |
| {d,f} | 12 | nein | = | = | = | | | |
| {c,e} | 16 | nein | = | = | = | | | |

Note: This table appears in the source already partially filled with what look like correct/example answers (this may be a worked example from the lecture/exercise materials embedded by the Gedächtnisprotokoll author, or the author's own recollection of the correct trace) rather than a blank exam question — treat the "ja"/"nein" and set columns as the transcribed content exactly as they appear, but treat them as [UNCLEAR: possibly the author's own reconstructed/remembered answer rather than an official solution] since this is a memory protocol, not the original exam. Columns for set(d), set(e), set(f) are cut off / not fully visible in the source image.

**7.2 (4P)** — identify-this (MST algorithm identification from edge sets). Topic: Kruskal vs. Prim algorithm traces.
Es folgen vier Darstellungen eines Graphen, in denen einige Kanten **fett** gedruckt hervorgehoben sind. Bestimmen Sie jeweils, ob die hervorgehobene Kantenmenge durch eine (eventuell frühzeitig abgebrochene) Ausführung des Algorithmus' von Kruskal oder Prim entsteht, oder ob beide oder keine dieser Möglichkeiten zutrifft. Schreiben Sie "Kruskal", "Prim", "Beide" oder "Keine" in das Feld unter der jeweiligen Abbildung. Machen Sie immer die genaueste Angabe: Wenn bspw. eine Kantenmenge durch beide Algorithmen entstehen kann, dann schreiben Sie "Beide" und nicht "Kruskal" oder "Prim". **Hinweis: Es ist immer nur eine Antwort korrekt!**

Given graph (same underlying graph shown 4 times with different bold/highlighted edge subsets), nodes {A,B,C,D,E,F,G,H}:
```
Edges: A-B(1), A-C(6), A-E(3), B-D(12), C-E(7), C-G(9), D-F(4), E-F(5), E-G(6)[approx], E-H(1), F-H(5), G-H(6)
```
[UNCLEAR: exact full edge/weight list of the octagon-ish graph — edges visible include A-B=1, B-D=12, D-F=4, F-H=1, E-H=6(or similar), E-G=9, E-F=5, A-E=3, C-E=7, E-D dashed=10, C-... — the four sub-diagrams show different highlighted subsets of a common graph with nodes A,B,C,D,E,F,G,H; precise weights partially illegible from rendering]
Four sub-diagrams (a–d) given, each showing the same graph with a different bold edge subset; student writes "Kruskal"/"Prim"/"Beide"/"Keine" under each. No answers filled in (blank for student).

---

## Section 8: Algorithmen-Entwurfsmethoden (12 Punkte)

**General rules stated for this section:**
- Die Algorithmen können in Pseudocode (im Stil der Vorlesung) oder in Java-Syntax geschrieben werden.
- Es ist erlaubt, Hilfsfunktionen zu verwenden, bei denen es sich um Algorithmen oder Datenstrukturen handelt, die in der Vorlesung behandelt wurden (solange klar ist, auf welche Sie sich beziehen, z.B. RBT-RotateLeft(T, x), das bei Red-Black-Trees behandelt wurde).
- Jeder deterministische Polynomialzeit-Algorithmus und eine korrekte Komplexitätsangabe bringen die Hälfte der Punkte, aber **nur Algorithmen, deren asymptotische Komplexität optimal ist** (und von Ihnen korrekt beschrieben wurde), erhalten die maximale Punktzahl.

**8.1 Einkommensstatistik (12P)** — design-and-code-this (algorithm design + complexity analysis). Topic: range query / offline query processing, likely intended solution via sorting + prefix sums or binary search (design problem, no single "algorithm" format label like sort/tree/graph).

Gegeben sei eine Liste von ganzen Zahlen, die dem monatlichen Einkommen der Einwohner einer Stadt entsprechen. Wir möchten Abfragen dazu beantworten, wie viele Einwohner ein Einkommen zwischen einer bestimmten Untergrenze und einer Obergrenze (beide inklusive) haben. Wir gehen davon aus, dass die Anzahl der Abfragen Q größer ist als die Länge der Liste N. Die Liste ändert sich im Laufe der Zeit nicht und wird für alle Anfragen verwendet.

Leiten Sie einen Algorithmus ab, der bei einer Liste von N ganzen Zahlen (sᵢ, i=1,...,N) und einer Liste von Q Abfragen (mit unteren und oberen Grenzen lⱼ und hⱼ, j=1,...,Q) eine Liste von Werten (C) zurückgibt. Jedes Element Cⱼ von C soll der Anzahl der Elemente in der Einkommensliste entsprechen, die ≥ lⱼ und ≤ hⱼ sind.

Leiten Sie die asymptotische Komplexität Ihres vorgeschlagenen Algorithmus' ab. Falls Sie Hilfsfunktionen verwendet haben, geben Sie deren Laufzeitkomplexität an.

(No solution provided — final page of document ends here.)
