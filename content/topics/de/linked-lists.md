---
id: linked-lists
title: "Verkettete Listen"
category: "Basic Data Structures"
order: 2
---

## Struktur

Eine Kette von Knoten, von denen jeder einen Wert und einen Zeiger auf den nächsten Knoten hält (`nil` beim letzten Knoten). Anders als ein Array hat eine verkettete Liste keine feste Größe und keinen zusammenhängenden Speicherblock — das Einfügen und Entfernen an einer bekannten Position ist O(1), weil nichts verschoben werden muss.

```
search(L, k)              -- Θ(n)
  current = L.head
  WHILE current != nil AND current.key != k DO
    current = current.next
  RETURN current

insert(L, x)               -- Θ(1)  (am Kopf einfügen)
  x.next = L.head
  x.prev = nil
  IF L.head != nil THEN L.head.prev = x
  L.head = x

delete(L, x)                -- Θ(1) bei gegebenem Zeiger auf x, Θ(n) um ihn zu finden
  IF x.prev != nil THEN x.prev.next = x.next
  ELSE L.head = x.next
  IF x.next != nil THEN x.next.prev = x.prev
```

**Einfach gegen doppelt verkettet**: Einfach verkettete Listen speichern nur `next`, sodass das Löschen eines Knotens ein Ablaufen vom Kopf aus erfordert, um seinen Vorgänger zu finden (Θ(n)). Doppelt verkettete Listen ergänzen einen `prev`-Zeiger, wodurch das Löschen Θ(1) wird, sobald man bereits einen Zeiger auf den Knoten hält.

## Wächter (Sentinels)

Ein **Wächter** ist ein permanenter Dummy-Knoten, der als fester Kopf-/Endplatzhalter dient. Er beseitigt die Notwendigkeit, in Einfüge- und Löschroutinen die leere Liste oder die Listenränder als Sonderfälle zu behandeln — jeder echte Knoten hat stets ein gültiges `prev`/`next`, an das er sich hängen kann, selbst an den Enden. Kompromiss: eine etwas aufwendigere Initialisierung gegen weniger Sonderfälle an allen anderen Stellen.

## Durchgerechnetes Beispiel: Duplikate in-place entfernen, O(1) Zusatzspeicher

**Aufgabe**: Gegeben eine unsortierte **einfach** verkettete Liste mit n Elementen, entferne Duplikate, sodass jeder Wert höchstens einmal vorkommt — ohne zusätzlichen Speicher außer O(1) temporären Zeigern (keine Hilfslisten oder -mengen), nicht-rekursiv, in O(n²).

```
RemoveDuplicates(L):
  a = L.head
  while a != nil:
    b = a
    while b.next != nil:
      if b.next.key == a.key:
        b.next = b.next.next        // Duplikat heraustrennen
      else:
        b = b.next
    a = a.next
```

**Idee**: `a` durchläuft die Liste einmal als fester Referenzpunkt; für jedes `a` überstreicht ein zweiter Zeiger `b` alles Nachfolgende und trennt jeden Knoten heraus, dessen Schlüssel dem von `a` entspricht. Weil eine einfach verkettete Liste nicht zurückblicken kann, ist genau dieser Ansatz „jeden Wert gegen alles Nachfolgende abgleichen“ das, was O(1) Zusatzspeicher überhaupt ermöglicht — kein Hash-Set, das sich das bereits Gesehene merkt.

**Laufzeit**: O(n²) — im Worst Case (keine Duplikate vorhanden) überstreicht die innere Schleife insgesamt `(n-1) + (n-2) + ... + 1 = n(n-1)/2 = Θ(n²)` Knoten.

**Schleifeninvariante** (äußere while-Schleife): *Vor der i-ten äußeren Iteration enthält die Teilliste vom Kopf bis einschließlich `a` keine Duplikate, und jedes Vorkommen eines Schlüssels eines schon besuchten Knotens wurde aus dem Rest der Liste entfernt.* Initialisierung: Vor der ersten Iteration ist `a` der Kopf, und eine einelementige Teilliste ist trivialerweise duplikatfrei. Erhaltung: Die innere Schleife fixiert `a` und entfernt jeden späteren Knoten mit demselben Schlüssel, sodass die Invariante beim Weiterrücken von `a` für das (nun um eins längere) duplikatfreie Präfix weiter gilt. Terminierung: Erreicht `a` den Wert `nil`, so hat jeder Knoten als Referenzpunkt gedient und seine Duplikate ausgesondert — die Endliste enthält nur eindeutige Werte.

## Array gegen verkettete Liste

| | Array | Verkettete Liste |
|---|---|---|
| Wahlfreier Zugriff `A[i]` | Θ(1) | Θ(n) |
| Einfügen/Löschen an bekannter Position | Θ(n) (Verschieben nötig) | Θ(1) |
| Speicher | zusammenhängender Block | verstreut, zusätzlicher Zeiger-Overhead |
