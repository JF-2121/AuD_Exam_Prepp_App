---
id: sorting-bubble
title: "Bubble Sort"
category: "Sorting"
order: 2
---

## Idee

Das Array wiederholt von links nach rechts durchlaufen und dabei jedes benachbarte Paar in falscher Reihenfolge vertauschen. Jeder vollständige Durchlauf lässt das größte verbleibende Element an seine korrekte Position am Ende des unsortierten Bereichs „aufsteigen“.

```
bubbleSort(A)
  FOR i = A.length-1 DOWNTO 1 DO
    sorted = true
    FOR j = 0 TO i-1 DO
      IF A[j] > A[j+1] THEN
        SWAP(A[j], A[j+1])
        sorted = false
    IF sorted THEN break
```

Das Flag `sorted` ist die Standardoptimierung: Führt ein vollständiger Durchlauf keinen einzigen Tausch aus, so ist das Array bereits sortiert und der Algorithmus kann vorzeitig abbrechen.

## Komplexität

| Fall | Eingabe | Zeit |
|---|---|---|
| Best (optimiert) | bereits sortiert | Θ(n) — ein Durchlauf, keine Tauschoperationen, früher Abbruch |
| Best (naiv, ohne früher Abbruch) | bereits sortiert | Θ(n²) — es werden trotzdem alle Durchläufe ausgeführt |
| Worst | umgekehrt sortiert | Θ(n²) |
| Average | zufällige Reihenfolge | Θ(n²) |

Bubble Sort und Insertion Sort haben dieselbe asymptotische Komplexität, aber Insertion Sort ist in der Praxis meist schneller — er führt pro Element weniger tatsächliche Operationen aus.

## Durchgerechnetes Beispiel: [5, 3, 2, 4, 1]

1. Durchlauf 1: → [3, 2, 4, 1, 5]  (die 5 steigt bis ans Ende auf)
2. Durchlauf 2: → [2, 3, 1, 4, 5]
3. Durchlauf 3: → [2, 1, 3, 4, 5]
4. Durchlauf 4: → [1, 2, 3, 4, 5]

## Durchgerechnetes Beispiel: [6, 4, 9, 3] (Vergleichs- und Tausch-Trace)

Jeder Schritt der inneren Schleife vergleicht ein benachbartes Paar und tauscht, falls es in falscher Reihenfolge steht:

- **i=1**: (6,4)→tauschen→[4,6,9,3]; (6,9)→kein Tausch; (9,3)→tauschen→[4,6,3,9]
- **i=2**: (4,6)→kein Tausch; (6,3)→tauschen→[4,3,6,9]
- **i=3**: (4,3)→tauschen→[3,4,6,9]

**Endergebnis: [3, 4, 6, 9]**

**Korrektheit — was genau muss bewiesen werden?** Es genügt nicht zu zeigen, dass die Ausgabe sortiert ist: Man muss außerdem zeigen, dass die Ausgabe `A′` eine **Permutation** der Eingabe `A` ist — gleiche Länge, gleiche Multimenge von Werten, nur umgeordnet. Ein sortiertes Array mit den *falschen* Werten würde die „Sortiertheit“ allein trivial erfüllen; die Permutationseigenschaft ist es, die das ausschließt, und sie gilt hier, weil jeder Schritt ein `SWAP` ist (ein In-place-Austausch zweier vorhandener Werte) und niemals ein Überschreiben oder Löschen.
