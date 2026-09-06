---
id: heaps
title: "Binäre Heaps & Prioritätswarteschlangen"
category: "Trees"
order: 5
---

## Definition

Ein binärer **Max-Heap** ist ein **vollständiger Binärbaum** (jede Ebene vollständig von links nach rechts gefüllt, mit möglicher Ausnahme der letzten), der die **Heap-Eigenschaft** erfüllt: Der Schlüssel jedes Knotens ist **≥** den Schlüsseln beider Kinder (ein **Min-Heap** kippt die Ungleichung). Man beachte, dass ein Heap **kein** Suchbaum ist — es gibt keine Links-Rechts-Ordnung, nur Vater-gegen-Kind, sodass das Maximum stets an der Wurzel steht, das zweitgrößte Element aber irgendwo auf den obersten zwei Ebenen liegen kann.

Gespeichert wird **implizit** in einem Array `A` (ohne Zeiger): Für einen Knoten an 0-indizierter Position `i`
- liegt der Vater bei `⌊(i−1)/2⌋`
- liegt das linke Kind bei `2i+1`, das rechte bei `2i+2`

## Insert(H, k)

```
insert(H, k):
  append(H, k)              // k an den letzten freien Platz setzen
  i = H.size - 1
  while i > 0 and H[parent(i)] < H[i]:
    swap(H[parent(i)], H[i])
    i = parent(i)
```

**Sift-up (Aufsteigen)**: Den neuen Schlüssel am Ende anhängen (die einzige Position, die den Baum vollständig hält), ihn dann wiederholt mit seinem **Vater** vergleichen und nach oben tauschen, solange er die Heap-Eigenschaft verletzt. Endet, sobald der Vater ≥ ist oder die Wurzel erreicht wurde. Höchstens `h ≤ ⌈log n⌉` Vergleiche.

Eine naheliegende Abkürzung — `append(H, k)` gefolgt vom erneuten vollständigen `BuildHeap(H.A)` — ist **korrekt, aber verschwenderisch**: Sie prüft bzw. heapifiziert praktisch das ganze Array neu (`⌈(n−1)/2⌉` Knotenprüfungen), um zu reparieren, was ein einzelner Sift-up-Pfad (`≤ log n` Prüfungen) bereits erledigt.

## Delete-max / extract-max

```
extractMax(H):
  max = H[0]
  H[0] = H[H.size - 1]      // letztes Element an die Wurzel setzen
  removeLast(H)
  heapify(H, 0)              // Sift-down ab der Wurzel
  return max
```

**Sift-down (heapify)**: Den (neuen) Wurzelknoten mit beiden Kindern vergleichen; ist eines der Kinder größer, mit dem **größeren** der beiden tauschen (niemals mit dem kleineren — ein Tausch mit dem kleineren würde die andere Seite nicht reparieren) und in diesen Teilbaum rekursieren. Endet, wenn der Knoten ≥ beiden Kindern ist oder ein Blatt erreicht wurde.

```
heapify(H, i):
  l, r = 2i+1, 2i+2
  largest = i
  if l < H.size and H[l] > H[largest]: largest = l
  if r < H.size and H[r] > H[largest]: largest = r
  if largest != i:
    swap(H[i], H[largest])
    heapify(H, largest)
```

## BuildHeap — warum von unten nach oben und nur die erste Hälfte

```
buildHeap(A):
  for i = ⌊(A.length - 1) / 2⌋ downto 0:
    heapify(A, i)
```

- **Nur die erste Hälfte des Arrays** braucht einen `heapify`-Aufruf: Per Definition eines „vollständigen Baums“ sind etwa die letzten `⌈n/2⌉` Indizes **Blätter** (ohne Kinder, gegen die die Eigenschaft verletzt sein könnte), ein `heapify`-Aufruf auf ihnen wäre also garantiert wirkungslos.
- **Es muss von unten nach oben** vorgegangen werden (vom höchsten Index abwärts zu 0), *nicht* von oben nach unten (aufsteigender Index), weil `heapify(A, i)` nur dann korrekt ist, wenn beide Kinder von `i` **bereits gültige Heaps** sind. Gegenbeispiel: der Baum `3 → (2 → 4, 5), 1 → (6, 7)` — ruft man `heapify` von oben nach unten zuerst an der Wurzel (3 ist bereits das Maximum, dort passiert also nichts) und dann auf ihren Kindern (2 und 1, jeweils in ihr größeres Kind hinabgetauscht), so können die größeren Werte 4/5/6/7, die zwei Ebenen tiefer begonnen haben, nie bis über die zweite Ebene aufsteigen, weil die Wurzel nie wieder betrachtet wird. Von unten nach unten zu arbeiten garantiert, dass jeder von `heapify` berührte Teilbaum bereits heap-gültig ist, sodass die eine Korrektur auf oberster Ebene genügt.
- Obwohl es nach `O(n log n)` aussieht (n/2 Aufrufe × je O(log n)), zeigt eine engere amortisierte Analyse, dass `BuildHeap` in **Θ(n)** läuft: Die meisten der n/2 Aufrufe finden nahe den Blättern statt, wo ein Sift-down nur 1–2 Ebenen zurücklegt.

## Heap Sort

```
heapSort(A):
  buildHeap(A)                       // Θ(n)
  for end = A.length - 1 downto 1:
    swap(A[0], A[end])               // aktuelles Maximum an seine sortierte Position bringen
    heapify(A, 0, end)                // Sift-down innerhalb von A[0 .. end-1]
```

Wiederholt das Maximum extrahieren (Wurzel mit dem letzten unsortierten Element tauschen, den Heap um eins verkleinern, die neue Wurzel absinken lassen) und es an das Ende des schrumpfenden Arrays setzen. **Θ(n log n)**, **in-place** (O(1) Zusatzspeicher), aber **nicht stabil** (gleiche Schlüssel können durch die Tauschoperationen umgeordnet werden).

## Randfälle & Invarianten

- Die Heap-Eigenschaft vergleicht einen Knoten nur mit seinen **direkten Kindern**, nie über Teilbäume hinweg — das drittgrößte Element liegt *nicht* garantiert in Tiefe 2; es muss nur irgendwo liegen, wo es lokal Vater ≥ Kind nicht verletzt.
- Ein (aufsteigend) sortiertes Array erfüllt im Allgemeinen **nicht** die Max-Heap-Eigenschaft (z. B. scheitert `[13,4,25,4,32,...]` sofort, da es in Baumordnung nicht einmal monoton ist) — „Heap“ nicht mit „sortiert“ verwechseln.
- Heaps realisieren den ADT **Prioritätswarteschlange**: `insert`, `extract-max`/`extract-min` jeweils O(log n); `peek`-max ist O(1).
- Weder `insert` noch `extract-max`/`extract-min` führen jemals eine **Rotation** aus — nur Elementtauschoperationen entlang eines einzelnen Pfades von der Wurzel zum Blatt (bzw. umgekehrt).

## Komplexitätsübersicht

| Operation | Zeit |
|---|---|
| Peek max | O(1) |
| Einfügen | O(log n) |
| Extract-max | O(log n) |
| Heap aus Array aufbauen | Θ(n) |
| Heap Sort | Θ(n log n) |
