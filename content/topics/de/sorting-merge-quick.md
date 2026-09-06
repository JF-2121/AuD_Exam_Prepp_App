---
id: sorting-merge-quick
title: "Merge Sort & Quicksort"
category: "Sorting"
order: 4
---

## Divide and Conquer

Beide Algorithmen zerlegen das Array (**divide**), lösen die Teile rekursiv und fügen sie zusammen (**conquer**). Sie unterscheiden sich darin, *wo die Arbeit anfällt*:

- **Merge Sort** verrichtet beim Teilen triviale Arbeit (nur in der Mitte trennen) und die gesamte eigentliche Arbeit beim **Zusammenfügen** (zwei sortierte Hälften verschmelzen).
- **Quicksort** verrichtet die gesamte eigentliche Arbeit beim **Teilen** (Partitionieren um ein Pivot) und triviale Arbeit beim Zusammenfügen (nämlich keine — die Teile liegen bereits richtig).

## Merge Sort

```
mergeSort(A, left, right)
  IF left < right THEN
    mid = floor((left+right)/2)
    mergeSort(A, left, mid)
    mergeSort(A, mid+1, right)
    merge(A, left, mid, right)

merge(A, left, mid, right)
  p = left; q = mid+1
  FOR i = 0 TO right-left DO
    IF q > right OR (p <= mid AND A[p] <= A[q]) THEN
      temp[i] = A[p]; p = p+1
    ELSE
      temp[i] = A[q]; q = q+1
  temp zurück in A[left..right] kopieren
```

**Komplexität**: T(n) = 2T(n/2) + Θ(n) → **Θ(n log n)** im Best, Worst *und* Average Case — das Verschmelzen kostet unabhängig von der Eingabereihenfolge immer Θ(n), es gibt also keine schlechte Eingabe für Merge Sort. Preis: Θ(n) zusätzlicher Speicher für das temporäre Array.

## Quicksort

```
quicksort(A, left, right)
  IF left < right THEN
    p = partition(A, left, right)
    quicksort(A, left, p)
    quicksort(A, p+1, right)

partition(A, left, right)
  pivot = A[left]
  p = left-1; q = right+1
  WHILE p < q DO
    REPEAT p = p+1 UNTIL A[p] >= pivot
    REPEAT q = q-1 UNTIL A[q] <= pivot
    IF p < q THEN SWAP(A[p], A[q])
  RETURN q
```

**Komplexität**:
- **Worst Case Θ(n²)**: Das Pivot ist stets das Minimum oder Maximum (z. B. bereits sortierte Eingabe mit dem ersten Element als Pivot) → maximal unbalancierte Partitionen, Rekursionstiefe n.
- **Best Case Θ(n log n)**: Das Pivot teilt das Array stets in zwei gleich große Hälften → Rekursionstiefe log n.
- **Average Case Θ(n log n)**: bei zufälliger Pivot-Wahl.

In der Praxis schlägt Quicksort Merge Sort trotz gleicher Average-Case-Komplexität meist, weil er **in-place** sortiert (kein Kopieren in ein temporäres Array) und kleinere konstante Faktoren hat. Eine **zufällige** Pivot-Wahl (statt immer das erste Element) vermeidet den Worst Case bei bereits sortierten oder gezielt bösartigen Eingaben.

## Untere Schranke für vergleichsbasiertes Sortieren

Jeder Sortieralgorithmus, der Elemente ausschließlich paarweise vergleicht, benötigt im Worst Case **Ω(n log n)** Vergleiche — das folgt aus einem Entscheidungsbaum-Argument: Es gibt n! mögliche Anordnungen, und jeder Vergleich kann nur zwei Ausgänge unterscheiden, der Baum braucht also Tiefe ≥ log₂(n!) = Θ(n log n). Merge Sort und Heap Sort erreichen diese Schranke; Quicksort erreicht sie nur im Mittel, nicht im Worst Case. Radix Sort ist *nicht* vergleichsbasiert und entkommt der Schranke damit vollständig.
