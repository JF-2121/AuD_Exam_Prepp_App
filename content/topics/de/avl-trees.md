---
id: avl-trees
title: "AVL-Bäume"
category: "Trees"
order: 3
---

## Balance-Invariante

Ein selbstbalancierender BST mit einer einfacheren Invariante als bei Rot-Schwarz-Bäumen: Für **jeden** Knoten muss der **Balancefaktor** `bf(x) = höhe(x.left) − höhe(x.right)` die Bedingung `bf(x) ∈ {−1, 0, 1}` erfüllen. Ein Knoten mit `|bf| = 2` ist unbalanciert und muss per Rotation korrigiert werden. Per Konvention hat ein leerer Teilbaum die Höhe `−1`, ein Blatt also die Höhe `0`.

Das garantiert eine Höhe ≤ ~1,44·log(n+2) und ist damit schärfer als die Schranke ≤ 2·log(n+1) eines Rot-Schwarz-Baums — Lesezugriffe sind also leicht schneller, um den Preis strengerer (und damit häufigerer) Rebalancierung bei Schreibzugriffen.

## Einfügen

1. Ein normales **BST-Einfügen** durchführen — der neue Schlüssel wird stets ein Blatt.
2. Vom **Vater** des neuen Blatts aufwärts zur Wurzel laufen. An jedem Vorfahren `a`:
   - `höhe(a) = 1 + max(höhe(a.left), höhe(a.right))` neu berechnen.
   - `bf(a)` neu berechnen.
   - Gilt `|bf(a)| ≤ 1`, weiter aufsteigen.
   - Gilt `|bf(a)| = 2`, **genau einen** der vier folgenden Rotationsfälle anwenden und dann **abbrechen** — ein Einfügen in einen AVL-Baum benötigt insgesamt **höchstens eine** einfache oder doppelte Rotation, weil genau diese eine Rotation die Höhe wiederherstellt, die der Teilbaum *vor* dem Einfügen hatte.

### Die vier Rotationsfälle

Sei `a` der erste unbalancierte Vorfahre, der beim Aufstieg vom eingefügten Knoten gefunden wird.

| Fall | Bedingung | Behebung |
|---|---|---|
| **LL** | `bf(a) > 1` und `bf(a.left) ≥ 0` | einfache **rotateRight(a)** |
| **LR** | `bf(a) > 1` und `bf(a.left) < 0` | **rotateLeft(a.left)**, dann **rotateRight(a)** |
| **RR** | `bf(a) < −1` und `bf(a.right) ≤ 0` | einfache **rotateLeft(a)** |
| **RL** | `bf(a) < −1` und `bf(a.right) > 0` | **rotateRight(a.right)**, dann **rotateLeft(a)** |

```
insert(T, value):
  bstInsert(T, value)                 // reines BST-Einfügen, wird ein Blatt
  für jeden Vorfahren a des neuen Blatts, von unten nach oben:
    updateHeight(a)
    bf = höhe(a.left) - höhe(a.right)
    if bf > 1:                        // linkslastig
      if balanceFactor(a.left) < 0: rotateLeft(a.left)   // LR-Fall
      rotateRight(a)
      break                            // höchstens eine (einfache/doppelte) Rotation nötig
    if bf < -1:                       // rechtslastig
      if balanceFactor(a.right) > 0: rotateRight(a.right) // RL-Fall
      rotateLeft(a)
      break
```

Eine einzelne **Rotation** ist eine lokale O(1)-Umstrukturierung (rotateLeft/rotateRight, dasselbe Primitiv wie bei BST-/Rot-Schwarz-Rotationen), die tauscht, welcher von zwei benachbarten Knoten „oben“ steht, und dabei die Inorder-Ordnung (BST-Eigenschaft) erhält; sowohl `höhe` als auch `bf` der beiden rotierten Knoten müssen unmittelbar danach neu berechnet werden, und zwar in dieser Reihenfolge (erst die Höhe des Kindes, dann die der neuen Teilbaumwurzel).

## Löschen

1. Ein normales **BST-Löschen** durchführen (Blatt entfernen, Ein-Kind-Transplantation oder Nachfolgertausch bei zwei Kindern — dieselben drei Fälle wie beim reinen BST).
2. Vom **Vater des physisch entfernten bzw. verschobenen Knotens** aufwärts laufen und an jedem unbalancierten Vorfahren die *gleichen* vier Rotationsfälle wie beim Einfügen anwenden.
3. **Zentraler Unterschied zum Einfügen: nach der ersten Rotation nicht abbrechen.** Eine Rotation beim Löschen kann die Höhe des reparierten Teilbaums *verkleinern*, was eine neue Unwucht weiter oben propagieren kann — die Rebalancierung muss also **bis zur Wurzel** fortgesetzt werden und benötigt im Worst Case **O(log n)** Rotationen (anders als die feste Konstante beim Einfügen).

```
delete(T, value):
  bstDelete(T, value)                 // reines BST-Löschen (transplant / Nachfolger)
  für jeden Vorfahren a von der Entfernungsstelle bis zur Wurzel:
    updateHeight(a)
    bf = höhe(a.left) - höhe(a.right)
    if bf > 1:
      if balanceFactor(a.left) < 0: rotateLeft(a.left)    // LR-Fall
      rotateRight(a)                  // kein break — weiter aufsteigen
    if bf < -1:
      if balanceFactor(a.right) > 0: rotateRight(a.right) // RL-Fall
      rotateLeft(a)
```

## Randfälle & Invarianten

- Der Balancefaktor wird mit **echter Ungleichung** geprüft — `bf ∈ {−1, 0, 1}` ist gültig, `|bf| = 2` ist der *einzige* Auslöser einer Rotation; AVL lässt die Unwucht nie über 2 hinauswachsen, weil sie im Moment ihres Auftretens behoben wird.
- Die LR-/RL-„Doppelrotation“ besteht in Wahrheit nur aus zwei einfachen Rotationen hintereinander um verschiedene Drehpunkte — es ist kein separates Rotations-Primitiv nötig, anders als in manchen Lehrbuchdarstellungen.
- Nach einem **Einfügen** entspricht die Höhe des rebalancierten Teilbaums seiner Höhe vor dem Einfügen — *deshalb* genügt stets eine Rotation.
- Nach einem **Löschen** kann die Höhe des rebalancierten Teilbaums *sinken* — *deshalb* muss die Rebalancierung bis zur Wurzel weiterlaufen.
- Jeder AVL-Baum lässt sich in einen gültigen Rot-Schwarz-Baum umfärben (seine schärfere Höhenschranke passt stets in die RBT-Schranke), umgekehrt gilt das nicht.
- Reines BST-Einfügen/Löschen und binäres Max-Heap-Einfügen/Löschen brauchen **überhaupt keine Rotation**; nur AVL- und Splay-Bäume rotieren bei jedem Einfügen.

## Komplexitätsübersicht

| Operation | Zeit |
|---|---|
| Suchen | O(log n) |
| Einfügen | O(log n), ≤ 1 Rotation |
| Löschen | O(log n), bis zu O(log n) Rotationen |
