---
id: algorithm-basics
title: "Was ist ein Algorithmus?"
category: "Grundlagen"
order: 1
---

## Definition

Ein **Algorithmus** ist eine Vorschrift, die eine Eingabe in eine Ausgabe überführt. Damit er als echter Algorithmus gilt, muss er erfüllen:

**1. Bestimmt**
- **Determiniert**: Dieselbe Eingabe liefert stets dieselbe Ausgabe (keine Abhängigkeit von äußeren Faktoren).
- **Determinismus**: Dieselbe Eingabe erzeugt stets genau dieselbe Folge von Schritten bzw. Zwischenzuständen.

**2. Berechenbar**
- **Finit**: Die Beschreibung des Algorithmus selbst hat endliche Länge.
- **Terminierbar**: Der Algorithmus hält für jede endliche Eingabe in endlicher Zeit an.
- **Effektiv**: Jeder einzelne Schritt ist auf einer Maschine tatsächlich ausführbar.

**3. Anwendbar**
- **Allgemein**: Funktioniert für eine ganze Klasse von Eingaben, nicht nur für einen Spezialfall.
- **Korrekt**: Terminiert er ohne Fehler, so ist die Ausgabe die spezifizierte, richtige Antwort.

## Einen Algorithmus als korrekt beweisen

Ein Standard-Korrektheitsargument für einen schleifenbasierten Algorithmus besteht aus drei Teilen:

1. **Terminierung** — zeigen, dass Schleife bzw. Rekursion nur endlich oft durchlaufen wird (z. B. weil ein Zähler streng gegen eine Schranke fällt).
2. **Sortiertheit / Korrektheit der Ausgabe** — zeigen, dass die Ausgabe die Spezifikation tatsächlich erfüllt, typischerweise über eine **Schleifeninvariante**: eine Bedingung, die vor der ersten Iteration gilt, nach jeder Iteration erhalten bleibt und — zusammen mit der Abbruchbedingung der Schleife — die Korrektheit impliziert.
3. **Permutationseigenschaft** (bei In-place-Algorithmen wie Sortierverfahren) — zeigen, dass der Algorithmus vorhandene Werte nur *umordnet* und niemals einen erfindet oder verliert.

Ein Beweis über eine Schleifeninvariante hat immer dasselbe dreiteilige Gerüst — **Initialisierung** (gilt vor der ersten Iteration), **Erhaltung** (gilt sie vor einer Iteration, so gilt sie auch vor der nächsten), **Terminierung** (zusammen mit der Abbruchbedingung impliziert sie die Nachbedingung). Drei kurze Beispiele, alle auf einem nichtleeren Integer-Array `A`:

```
Minimum(A):                      Average(A):                     MaxIndex(A):
  len = length(A)                  len = length(A)                  len = length(A)
  min = A[0]                       sum = A[0]                       idx = -1
  for i = 1 to len-1:               for i = 1 to len-1:               conditionTrue = true
    if A[i] < min:                   sum = sum + A[i]                 for i = 1 to len-1:
      min = A[i]                   avg = sum / len                     if A[i] < 2*A[i-1] and conditionTrue:
  return min                       return avg                            idx = i
                                                                        else:
                                                                          conditionTrue = false
                                                                      return idx
```

- **Minimum**: Invariante — „vor der i-ten Iteration ist `min` das Minimum von `A[0..i-1]`“. Erhaltung: `A[i] < min` aktualisiert min korrekt (es ist kleiner als alles bisher Gesehene); andernfalls war min bereits ≤ A[i] und bleibt gültig. Beim Schleifenende (i=len) ist min das Minimum des gesamten Arrays.
- **Average**: Invariante — „vor der i-ten Iteration ist `sum` die Summe von `A[0..i-1]`“. Dieselbe Struktur aus Initialisierung/Erhaltung/Terminierung; `avg = sum/len` nach der Schleife ist per Definition der Mittelwert.
- **MaxIndex** (findet den größten Index `idx`, für den `A[1..idx]` eine Folge ist, in der jedes Element kleiner als das Doppelte seines Vorgängers ist, oder −1, falls das schon zu Beginn scheitert): Invariante — „`conditionTrue` ist genau dann wahr, wenn die Laufbedingung bei jedem Schritt bisher gehalten hat, und `idx` ist der größte gefundene gültige Index (oder −1)“. Das Flag `conditionTrue` ist es, was daraus eine echte Invariante macht statt bloß eine Nachverfolgung des letzten Index: Ist die Bedingung einmal verletzt, muss das Flag für alle weiteren Iterationen **auf falsch einrasten** — ein häufiges Muster bei Problemen der Form „größtes Präfix, das X erfüllt“, bei denen eine einzelne Verletzung jeden späteren Index entwertet, nicht nur den verletzenden.

**Gründe, bewusst einen *weniger* effizienten Algorithmus zu wählen** (eine häufige Reflexionsfrage in der Klausur): Ein einfacherer Algorithmus ist leichter formal zu verifizieren; die Laufzeit selbst kann geheime Informationen preisgeben (ein Seitenkanal), sodass ein Algorithmus mit **konstanter Laufzeit** manchmal einem im Mittel schnelleren vorgezogen wird, genau um dieses Leck zu vermeiden; und ein stark parallelisierbarer Algorithmus verrichtet sequenziell womöglich mehr Gesamtarbeit als ein einfacherer serieller, wird auf echter Hardware aber trotzdem früher fertig. Weitere Ressourcen, deren Optimierung sich neben der reinen Zeit lohnt: die **Varianz** der Laufzeit (Algorithmen mit konstanter Laufzeit), die **Größe** des Algorithmus selbst (Chipfläche in Hardware, Codezeilen in Software), die **Art** der verwendeten Operationen (z. B. die Beschränkung auf reine Additionen, die auf bestimmter Hardware billiger sein können) und die **Parallelisierbarkeit**.

## Datenstrukturen

Datenstrukturen organisieren und speichern Daten so, dass Algorithmen effizient darauf arbeiten können. Die Wahl der Struktur beeinflusst Laufzeit und Speicherverbrauch unmittelbar. Die in dieser Vorlesung behandelten Familien: Arrays/Listen, Stacks/Queues, Bäume, Graphen und hashbasierte Strukturen.
