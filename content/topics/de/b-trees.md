---
id: b-trees
title: "B-Bäume"
category: "Trees"
order: 6
---

## Definition

Ein B-Baum mit **Minimalgrad** `t` (t ≥ 2) ist eine Verallgemeinerung des BST für **plattengestützte** Speicherung: Jeder Knoten hält viele Schlüssel und viele Kinder, wodurch der Baum sehr flach bleibt und nur wenige Plattenzugriffe nötig sind. Jeder Knoten außer der Wurzel muss erfüllen:

- **Mindestens `t − 1`** Schlüssel, **höchstens `2t − 1`** Schlüssel.
- Ein Knoten mit `k` Schlüsseln hat genau **`k + 1` Kinder** (0 Kinder ⟺ er ist ein **Blatt**).
- Die Wurzel darf so wenig wie **1** Schlüssel haben (oder 0, nur wenn der ganze Baum leer ist).
- **Alle Blätter liegen auf derselben Tiefe** — ein B-Baum ist stets perfekt höhenbalanciert.
- Die Schlüssel innerhalb eines Knotens sind **sortiert** gespeichert, und die Suchbaumeigenschaft gilt über die `k + 1` Kinder hinweg genau wie in einem BST, verallgemeinert auf `k` Schlüssel: Der Teilbaum zwischen Schlüssel `i` und Schlüssel `i+1` enthält nur Werte, die dazwischen liegen.

Ein Knoten mit `2t − 1` Schlüsseln heißt **voll** — er kann keinen weiteren Schlüssel aufnehmen, ohne zuvor gespalten zu werden.

## Einfügen — „vorsorgliches Spalten auf dem Weg nach unten“

Die zentrale Idee, die das B-Baum-Einfügen auf einen **einzigen Durchlauf von oben nach unten** beschränkt (kein Zurückverfolgen): **Bevor überhaupt in ein Kind abgestiegen wird, prüfen, ob dieses Kind voll ist — wenn ja, es zuerst spalten.**

```
insert(T, key):
  if T.root ist voll:
    Wurzel spalten (Wurzel erhält einen Schlüssel, Höhe wächst um 1, neue Wurzel hat 2 Kinder)
  x = T.root
  while x ist kein Blatt:
    das Kind c von x bestimmen, in das key absteigen muss
    if c ist voll:
      splitChild(x, c)             // hebt den Median von c nach x, c spaltet in 2 Kinder von x
      if key > dem neu hochgezogenen Schlüssel von x: c = der neue rechte Bruder
    x = c
  key an der korrekten sortierten Position in x einfügen   // x ist hier garantiert nicht voll und ein Blatt
```

**Einen vollen Knoten `c` (2t − 1 Schlüssel) mit Vater `x` spalten:**
1. Der **Medianschlüssel** (der `t`-te Schlüssel von `c`) wandert **hinauf** in `x`, an die korrekte sortierte Position unter den vorhandenen Schlüsseln von `x`.
2. Die verbleibenden `2t − 2` Schlüssel von `c` teilen sich gleichmäßig auf: die kleineren `t − 1` Schlüssel bleiben im ursprünglichen Knoten (nun das linke Kind von `x` an dieser Stelle), die größeren `t − 1` Schlüssel wandern in einen **brandneuen Knoten** (das neue rechte Kind von `x`, direkt hinter dem Original eingefügt).
3. War `c` kein Blatt, so teilen sich auch seine `2t` Kinder gleichmäßig: Die ersten `t` bleiben bei der linken Hälfte, die letzten `t` gehen an den neuen rechten Knoten.

Weil das Prüfen-und-Spalten-vor-dem-Absteigen auf **jeder Ebene auf dem Weg nach unten** geschieht, ist der Knoten, den der Algorithmus schließlich zum Einfügen erreicht, *garantiert* nicht voll — auf dem Rückweg ist nie eine Spaltung nötig, und das gesamte Einfügen ist ein einziger Abstieg: **O(t·log_t n)** (O(log_t n) Ebenen, O(t) Arbeit pro Knoten, um die Position zu finden bzw. Schlüssel zu verschieben).

**Sonderfall Wurzel**: Nur die Wurzel kann gespalten werden, *ohne* dass ein Vater ihren Medianschlüssel aufnehmen könnte — geschieht dies, so wird eine brandneue Wurzel erzeugt, die genau diesen einen Medianschlüssel hält, mit den beiden Hälften als ihren zwei Kindern. Das ist die **einzige** Möglichkeit, wie die Höhe eines B-Baums wächst, und sie tritt immer an der Wurzel auf.

## Löschen

Das Löschen ist aufwendiger, weil der Algorithmus in jedem Schritt garantieren muss, nie in einen Knoten mit nur `t − 1` Schlüsseln — dem Minimum — abzusteigen oder einen Schlüssel daraus zu entfernen, denn ein weiterer entfernter Schlüssel würde die Invariante verletzen. Drei Fälle, in dieser Reihenfolge geprüft:

**1. Schlüssel `k` liegt in Knoten `x` und `x` ist ein Blatt** — da der Abstieg (siehe Fall 3) bereits garantiert hat, dass jeder besuchte Knoten vor dem Rekursieren ≥ `t` Schlüssel hat, hat `x` genug Schlüssel zum Abgeben; einfach **`k` direkt entfernen**.

**2. Schlüssel `k` liegt in Knoten `x` und `x` ist ein innerer Knoten:**
- **2a.** Hat das Kind **vor** `k` (`y`) **≥ t** Schlüssel: den **Vorgänger** `k'` von `k` bestimmen (der maximale Schlüssel im Teilbaum unter `y`, per Absteigen ganz nach rechts), `k` in `x` durch `k'` ersetzen und dann `k'` rekursiv aus `y` löschen.
- **2b.** Sonst, hat das Kind **nach** `k` (`z`) **≥ t** Schlüssel: symmetrisch — den **Nachfolger** verwenden (das Minimum des Teilbaums von `z`, per Absteigen ganz nach links), ersetzen, rekursiv aus `z` löschen.
- **2c.** Sonst (**beide**, `y` und `z`, haben genau `t − 1` Schlüssel): `y`, `k` und `z` zu einem einzigen Knoten mit `2t − 1` Schlüsseln **verschmelzen** (die Schlüssel von `y`, dann `k`, dann die von `z` — `x` verliert `k` und seinen Kindzeiger auf `z`), dann `k` rekursiv aus diesem verschmolzenen Knoten löschen (nun Fall 1 oder ein weiterer Abstieg nach Fall 3).

**3. Schlüssel `k` liegt nicht im aktuellen Knoten `x`** (einem inneren Knoten) — der Algorithmus muss in das passende Kind `c` absteigen, **garantiert zuvor aber, dass `c` ≥ `t` Schlüssel hat**, genau analog zum vorsorglichen Spalten beim Einfügen:
- **3a. Von einem Bruder ausleihen (rotieren)**: Hat ein unmittelbarer linker oder rechter Bruder von `c` **≥ t** Schlüssel, so den Trennschlüssel von `x` hinunter in `c` bewegen (an dessen nahes Ende) und den angrenzenden Extremschlüssel des Bruders an dessen Stelle hinauf in `x` (der zugehörige Kindzeiger des Bruders wandert, falls vorhanden, mit in `c`).
- **3b. Verschmelzen**: Hat **keiner** der Brüder ≥ `t` Schlüssel (beide haben genau `t − 1`), so **`c` mit einem Bruder und dem Trennschlüssel aus `x`** zu einem einzigen Knoten mit `2t − 1` Schlüsseln verschmelzen — genau wie in Fall 2c, nur während der Suche und nicht während des Löschens eines inneren Schlüssels ausgelöst.
- Dann in das (nun ≥ `t`-schlüsselige) `c` absteigen und rekursieren.

**Schrumpfen der Wurzel**: Betrifft die Verschmelzung von Fall 3b den *einzigen* verbleibenden Schlüssel der Wurzel (die Wurzel hatte genau 1 Schlüssel und beide ihrer Kinder `t − 1` Schlüssel), so **wird der verschmolzene Knoten die neue Wurzel** und die Höhe des Baums sinkt um eins — die einzige Möglichkeit, wie ein B-Baum schrumpft.

```
delete(T, key):
  x = T.root
  while true:
    if key liegt in x:
      if x ist ein Blatt: key aus x entfernen; return
      elif Kind-vor-key hat >= t Schlüssel: k' = predecessor(key); key durch k' ersetzen; x = Kind-vor; key = k'
      elif Kind-nach-key hat >= t Schlüssel: k' = successor(key); key durch k' ersetzen; x = Kind-nach; key = k'
      else: merge(Kind-vor, key, Kind-nach); x = verschmolzener Knoten; mit key fortfahren
    else:
      c = das Kind, in das x absteigen muss, um key zu finden
      if c hat t - 1 Schlüssel:
        if ein Bruder von c hat >= t Schlüssel: über x ausleihen (Rotation)
        else: c mit einem Bruder und dem Trennschlüssel aus x verschmelzen
      x = c   // nun garantiert >= t Schlüssel
```

## Randfälle & Invarianten

- Jeder Knoten außer der Wurzel hat stets zwischen `t − 1` und `2t − 1` Schlüsseln — die gesamte Komplexität des Löschalgorithmus entsteht daraus, diese untere Schranke *vor* dem Absteigen oder Entfernen zu erhalten, symmetrisch dazu, wie das Einfügen die obere Schranke *vor* dem Absteigen erhält.
- Ein Knoten mit `k` Schlüsseln muss genau `k + 1` Kinder haben — eine Abweichung (z. B. `k` Schlüssel bei `k` Kindern) macht einen Baum strukturell ungültig, selbst wenn die Schlüssel sortiert sind.
- Die Schlüssel **innerhalb** eines Knotens müssen aufsteigend sortiert sein — ein unsortierter Knoten ist ungültig, selbst wenn alle anderen Eigenschaften gelten.
- Alle Blätter müssen auf **derselben Tiefe** liegen — das macht einen B-Baum konstruktionsbedingt höhenbalanciert und nicht erst über eine Rebalancierungs-Invariante wie den Balancefaktor von AVL.
- Mit `t = 2` (dem kleinsten zulässigen Grad) nennt man einen B-Baum manchmal einen **2-3-4-Baum** (2, 3 oder 4 Kinder pro Knoten); er entspricht strukturell einem Rot-Schwarz-Baum.
- Das Einfügen lässt die Höhe nur an der **Wurzel** wachsen (per Wurzelspaltung); das Löschen lässt sie nur an der **Wurzel** schrumpfen (per Wurzelverschmelzung) — innere Knoten wechseln nie die Tiefe.

## Komplexitätsübersicht

Für `n` Schlüssel und Minimalgrad `t` (die Baumhöhe ist `O(log_t n)`):

| Operation | Zeit |
|---|---|
| Suchen | O(t · log_t n) |
| Einfügen | O(t · log_t n) |
| Löschen | O(t · log_t n) |
