---
id: hashing-probabilistic
title: "Hashing, Skip-Listen & Bloom-Filter"
category: "Trees"
order: 4
---

## Hashtabellen

Schlüssel werden über eine **Hashfunktion** h(k) auf Array-Slots abgebildet, was erwartet **O(1)** für Einfügen/Suchen/Löschen ergibt — viel schneller als die O(log n) eines Baums, um den Preis, die sortierte Reihenfolge und die Worst-Case-Garantien zu verlieren.

**Kollisionen** (zwei Schlüssel hashen auf denselben Slot) sind unvermeidbar (nach dem Schubfachprinzip, sobald n > Tabellengröße) und werden behandelt durch:
- **Verkettung**: Jeder Slot hält eine verkettete Liste aller dorthin gehashten Schlüssel. Die erwartete Suchzeit ist O(1 + α), wobei α = n/m der **Füllgrad** ist (n Schlüssel, m Slots).
- **Offenes Adressieren**: Bei einer Kollision wird eine deterministische Folge alternativer Slots sondiert (lineares Sondieren, quadratisches Sondieren, Doppel-Hashing), bis ein freier gefunden ist. Kein Zusatzspeicher für Listen, aber Clusterbildung kann die Leistung verschlechtern, wenn α → 1.

Eine gute Hashfunktion sollte die Schlüssel gleichmäßig verteilen und billig zu berechnen sein (Annahme des **einfachen gleichmäßigen Hashings**: Jeder Schlüssel landet mit gleicher Wahrscheinlichkeit in jedem Slot, unabhängig von den anderen Schlüsseln).

**Wie viele Slots bleiben erwartet leer?** Für eine Hashfunktion `h`, die `n` paarweise verschiedene Schlüssel gleichverteilt zufällig in ein Array der Länge `a` abbildet: Sei `Yₖ = 1`, wenn Slot `k` leer bleibt, sonst `0`. Ein einzelner fester Schlüssel verfehlt Slot `k` mit Wahrscheinlichkeit `1 − 1/a`; da alle `n` Schlüssel unabhängig sind, gilt `P(Yₖ=1) = (1 − 1/a)ⁿ` (jeder der n Schlüssel muss Slot k verfehlen). Per Linearität des Erwartungswerts, summiert über alle `a` Slots:

**E[Anzahl leerer Slots] = a · (1 − 1/a)ⁿ**

— eine saubere, geschlossene Form, rein aus der Linearität des Erwartungswerts hergeleitet, ohne Unabhängigkeit zwischen den *Slots* (nur zwischen den *Schlüsseln*). Ein Klausurklassiker.

## Skip-Listen

Eine **probabilistische** Alternative zu balancierten Bäumen: eine verkettete Liste mit mehreren „Schnellspur“-Ebenen, aufgebaut durch zufälliges Hochstufen von Elementen auf höhere Ebenen (jedes Element wird unabhängig mit Wahrscheinlichkeit ~½ hochgestuft). Die Suche beginnt auf der obersten Ebene und steigt jeweils ab, sobald der nächste Knoten über das Ziel hinausschießen würde.

- **Erwartetes** Suchen/Einfügen/Löschen: **O(log n)** — gleichauf mit balancierten Bäumen, aber durch Randomisierung erreicht statt durch strenge Invarianten und Rotationen, was die Implementierung deutlich einfacher macht.
- Keine Worst-Case-Garantie (eine unglückliche Folge von Münzwürfen könnte die Leistung verschlechtern), aber die Wahrscheinlichkeit einer signifikanten Verschlechterung ist verschwindend gering.

**Einfügemechanik**: `x` zuerst auf der untersten Ebene (Ebene 1) einfügen, genau wie in eine sortierte verkettete Liste. Dann entscheiden, ob es zusätzlich in höhere Schnellspur-Ebenen hochgestuft wird — mit Wahrscheinlichkeit `p` (typisch ½) pro Ebene, Ebene für Ebene geprüft, beginnend mit der niedrigsten Schnellspur, und beim ersten fehlgeschlagenen Münzwurf abgebrochen. In einer Klausur wird dieser Zufall manchmal durch eine **deterministische Funktion** `P(x, h)` ersetzt (ein Platzhalter für „der Münzwurf auf Ebene h für den Wert x“) — `x` wird genau dann in die Schnellspur der Ebene `h` hochgestuft, wenn `P(x,h) ≤ p`. Z. B. mit `p = 0.5`: Ein neuer Wert tritt zunächst immer Ebene 1 bei; dann `P(x,2) ≤ 0.5` prüfen, um zu entscheiden, ob er auch Ebene 2 beitritt; falls ja, `P(x,3) ≤ 0.5` für Ebene 3 prüfen; und so weiter, mit Abbruch bei der ersten fehlgeschlagenen Prüfung.

## Bloom-Filter

Eine speichereffiziente **probabilistische** Struktur zur Mengenzugehörigkeit: ein Bit-Array der Größe m plus k unabhängige Hashfunktionen. `insert(x)`: alle k gehashten Bitpositionen auf 1 setzen. `contains(x)`: prüfen, ob alle k gehashten Positionen auf 1 stehen.

- **False Positives möglich**: `contains(x)` kann fälschlich „ja“ sagen (die Bits wurden von den überlappenden Hashes anderer Elemente gesetzt).
- **False Negatives unmöglich**: Wurde x tatsächlich eingefügt, so sind alle seine Bits garantiert auf 1 — `contains(x)` sagt für eingefügte Elemente also stets korrekt „ja“.
- Elemente können nicht gelöscht werden (das Zurücksetzen eines Bits könnte die Zugehörigkeit eines anderen Elements zerstören, das sich dieses Bit teilt), und der Inhalt der Menge kann nicht aufgezählt werden — unterstützt werden nur Einfügen und Zugehörigkeitstest.
- Eingesetzt, wenn ein schnelles, speichersparsames „wahrscheinlich in der Menge“ als Vorfilter wertvoll ist (z. B. vor einem teuren Platten- oder Netzwerkzugriff).

**Durchgerechnetes Beispiel**: m=12 Bits, k=3 Hashfunktionen `h1(x)=(6x+x²−2) mod 12`, `h2(x)=x² mod 12`, `h3(x)=(x mod 10 + 3x²) mod 12`. Das Einfügen von x=25, 43, 81 setzt die Bits `{5,1,8}`, `{5,1,6}` bzw. `{1,9,4}` — Vereinigung **{1,4,5,6,8,9}**. Test von x=33: `h1(33)=1, h2(33)=9, h3(33)=6` — alle drei stehen bereits, der Filter meldet also „vorhanden“, obwohl 33 nie eingefügt wurde: ein **bestätigter False Positive**, vollständig vereinbar mit der Garantie (False Positives sind möglich, False Negatives nicht).

**Counting-Bloom-Filter (mit Löschunterstützung)**: Jedes Bit durch einen kleinen **Zähler** ersetzen (z. B. 4 Bit, Werte 0–15). `insert(x)` inkrementiert die k gehashten Zähler; `contains(x)` behandelt jeden Zähler `> 0` als „gesetzt“; `delete(x)` dekrementiert die k gehashten Zähler. Das ergänzt echte Löschunterstützung (im klassischen Bit-Array-Bloom-Filter unmöglich) um den Preis des `Zählerbreite`-fachen Speichers — die Garantie „keine False Negatives“ bleibt erhalten, ein Überlauf muss aber verhindert werden (ein volllaufender und umbrechender Zähler würde die Struktur beschädigen).
