---
id: sorting-insertion
title: "Insertion Sort"
category: "Sorting"
order: 1
---

## Idee

Wie das Sortieren eines Kartenblatts auf der Hand: von links nach rechts durchlaufen und jedes neue Element an seiner korrekten Position innerhalb der bereits sortierten Elemente zu seiner Linken einfügen.

```
insertionSort(A)
  FOR i = 1 TO A.length-1 DO
    key = A[i]
    j = i - 1
    WHILE j >= 0 AND A[j] > key DO
      A[j+1] = A[j]
      j = j - 1
    A[j+1] = key
```

## Schleifeninvariante & Korrektheit

**Invariante**: Vor Beginn der Iteration i ist `A[0..i-1]` bereits sortiert. Die innere `WHILE`-Schleife verschiebt jedes Element, das größer als `key` ist, um einen Platz nach rechts und lässt `key` dann in die entstandene Lücke fallen — womit die Invariante für `i+1` wiederhergestellt ist. Nach der letzten Iteration (`i = n-1`) liefert die Invariante ein vollständig sortiertes `A[0..n-1]`.

## Komplexität

| Fall | Eingabe | Zeit |
|---|---|---|
| Best | bereits sortiert | Θ(n) — ein Vergleich pro Element, keine Verschiebungen |
| Worst | umgekehrt sortiert | Θ(n²) — jedes Element wandert bis zu Index 0 |
| Average | zufällige Reihenfolge | Θ(n²) |

**Stabil**: ja — gleiche Schlüssel werden nie aneinander vorbeigetauscht. Das hängt vollständig an der **echten** Ungleichung `A[j] > key` in der While-Bedingung: Die Verschiebung erfolgt nur für Elemente, die *echt größer* als `key` sind. Gilt also `A[j] == key`, so bricht die Schleife ab und `key` wird unmittelbar *nach* seinem gleichen Vorgänger eingefügt — niemals davor.

**Durchgerechnetes Beispiel zur Stabilität**: Sortiere `[5, 2, 5*, 1]`, wobei `5*` das *zweite* Vorkommen des Werts 5 markiert (nur zur Nachverfolgung der Reihenfolge, kein anderer Wert):

- **i=1**, key=2: 5 nach rechts verschieben → `[2, 5, 5*, 1]`
- **i=2**, key=5\*: Vergleich mit A[1]=5 — `5 > 5*` ist **falsch** (gleich, nicht echt größer) → keine Verschiebung, 5\* bleibt liegen → `[2, 5, 5*, 1]` (unverändert)
- **i=3**, key=1: 5\*, 5, 2 alle nach rechts verschieben → `[1, 2, 5, 5*]`

**Endergebnis: [1, 2, 5, 5\*]** — die ursprüngliche 5 steht weiterhin vor 5\*, genau wie in der Eingabe. Wäre der Vergleich `≥` statt `>`, hätte Schritt i=2 die 5 an 5\* vorbeigeschoben und die Stabilität unbemerkt zerstört.

## Durchgerechnetes Beispiel: [5, 3, 2, 4, 1]

1. i=1, key=3: 5 nach rechts → [3,5,2,4,1]
2. i=2, key=2: 5,3 nach rechts → [2,3,5,4,1]
3. i=3, key=4: 5 nach rechts → [2,3,4,5,1]
4. i=4, key=1: 2,3,4,5 nach rechts → [1,2,3,4,5]
