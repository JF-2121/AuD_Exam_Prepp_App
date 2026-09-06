---
id: sorting-radix
title: "Radix Sort (nicht-vergleichsbasiertes Sortieren)"
category: "Sorting"
order: 5
---

## Idee

Radix Sort vergleicht nie zwei Elemente direkt — stattdessen sortiert er Ziffer für Ziffer (beginnend mit der niederwertigsten Ziffer) und verwendet dabei an jeder Ziffernstelle eine **stabile** Bucket-Verteilung (im Stil von Counting Sort).

```
radixSort(A)          // Schlüssel haben d Ziffern zur Basis D (z. B. D=10)
  FOR i = 0 TO d-1 DO       // i=0 ist die niederwertigste Ziffer
    FOR j = 0 TO n-1 DO putBucket(A, i, j, buckets)
    Buckets in der Reihenfolge 0..D-1 zurück in A lesen, dann Buckets leeren
```

Jeder Durchlauf muss ein **stabiles** Sortierverfahren sein (die relative Reihenfolge gleicher Ziffern erhalten), sonst wird die Arbeit der vorherigen Durchläufe zunichtegemacht.

## Komplexität

**O(d·(n + D))** in jedem Fall (Best = Worst = Average — die Laufzeit hängt überhaupt nicht von der Eingabereihenfolge ab).

- Behandelt man D (die Größe des Ziffernalphabets, z. B. 10) als Konstante → **O(d·n)**.
- Ist zusätzlich d (die Anzahl der Ziffern) konstant → **O(n)**, also lineare Zeit.
- Nähert sich D dem Wert n, so gilt d = Θ(log_D n) und man erhält **O(n log n)** — genau so umgeht Radix Sort die untere Schranke Ω(n log n) für vergleichsbasiertes Sortieren: Er ist nicht vergleichsbasiert, die Schranke greift also nicht.

## Wahl der Bit-Gruppierung r (allgemeine Analyse für b-Bit-Zahlen)

Verallgemeinert auf das Sortieren von `n` Zahlen mit je `b` Bit, gruppiert zu Ziffern von jeweils `r ≤ b` Bit: Jede Zahl hat dann `d = ⌈b/r⌉` Ziffern, jede über `D = 2ʳ` Werte, sodass jeder der `d` Durchläufe `O(n + 2ʳ)` kostet. **Insgesamt: `O((b/r)·(n + 2ʳ))`.**

- **Für `b ≤ log n`**: Die optimale Wahl ist `r = b` — eine einzige Ziffer, die die ganze Zahl abdeckt, was `O(n + 2ᵇ) = O(n)` ergibt (da `2ᵇ ≤ 2^(log n) = n`).
- **Für `b > log n`**: Die optimale Wahl ist `r = log n`, was `O((b/log n)·(n+n)) = O(bn/log n)` ergibt — ein größeres `r` lässt den Term `2ʳ` für die Bucket-Anzahl dominieren, ein kleineres den Term `b/r` für die Durchlaufanzahl. Genau bei `r = log n` wiegen sich die beiden Terme auf.

**Ist Radix Sort in der Praxis immer schneller als Quicksort?** Nicht zwangsläufig — asymptotisch schlägt `O(n)` zwar `O(n log n)`, aber die asymptotische Notation verbirgt konstante Faktoren, und die Bucket-Verwaltung pro Durchlauf kann bei Radix Sort eine deutlich größere Konstante tragen. Radix Sort ist außerdem **nicht in-place** (benötigt `O(n+D)` zusätzlichen Speicher für die Buckets), anders als In-place-Vergleichssortierer — die Intuition „immer schneller“ hält also nicht allgemein.

## Korrektheit erfordert ein stabiles Verfahren pro Ziffer

Die Korrektheit von Radix Sort ist **nur garantiert, wenn jeder Ziffern-Durchlauf selbst stabil ist**. Das ziffernweise Sortieren beruht darauf, dass die relative Ordnung einer niederwertigeren Ziffer jeden höherwertigen Durchlauf **überlebt** — ein instabiler Durchlauf (z. B. mit LIFO-Stacks statt FIFO-Queues als Buckets) würde die relative Reihenfolge umkehren und unbemerkt ein falsches Ergebnis liefern, obwohl jeder einzelne Durchlauf lokal „sortiert aussieht“.

## Durchgerechnetes Beispiel: Oktalzahlen 54₈, 24₈, 71₈, 10₈, 52₈, 77₈, 33₈ (r=3, Basis 8, LSD zuerst)

**Durchlauf 0** (niederwertigste Oktalziffer): nach der letzten Ziffer einsortieren → Bucket 0: `10₈`; Bucket 1: `71₈`; Bucket 2: `52₈`; Bucket 3: `33₈`; Bucket 4: `54₈, 24₈`; Bucket 7: `77₈`. Eingesammelt: `10₈ 71₈ 52₈ 33₈ 54₈ 24₈ 77₈`.

**Durchlauf 1** (höchstwertige Oktalziffer, auf dem Ergebnis von Durchlauf 0): nach der führenden Ziffer einsortieren → Bucket 1: `10₈`; Bucket 2: `24₈`; Bucket 3: `33₈`; Bucket 5: `52₈, 54₈`; Bucket 7: `71₈, 77₈`. Eingesammelt (final): **`10₈ 24₈ 33₈ 52₈ 54₈ 71₈ 77₈`** — sortiert.

## Durchgerechnetes Beispiel: [232, 836, 101, 903, 220, 425, 762, 83, 5, 319]

- **Durchlauf 1 (Einerstelle)**: → [220, 101, 232, 762, 903, 83, 425, 5, 836, 319]
- **Durchlauf 2 (Zehnerstelle)**: → [101, 903, 5, 319, 220, 425, 836, 232, 762, 83]
- **Durchlauf 3 (Hunderterstelle)**: → [5, 83, 101, 220, 232, 319, 425, 762, 836, 903] — sortiert.
