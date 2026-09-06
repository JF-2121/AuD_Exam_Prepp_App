---
id: splay-trees
title: "Splay-Bäume"
category: "Trees"
order: 4
---

## Idee

Ein **selbstanpassender** BST (ohne explizite Balance-Invariante wie den Balancefaktor von AVL oder die Farben von Rot-Schwarz): Nach **jedem** Einfügen, Suchen oder Löschen wird der betroffene Knoten über eine Folge von Rotationen — genannt **Splayen** — ganz nach oben zur **Wurzel** bewegt. Es werden keine Balance-Metadaten gespeichert; der Baum rebalanciert sich rein als Nebeneffekt der Zugriffsmuster, was häufig zugegriffenen Schlüsseln schnellen künftigen Zugriff verschafft (amortisiert O(log n) pro Operation, und amortisiert O(1) bei wiederholtem Zugriff auf denselben Schlüssel).

## Die Operation splay(node)

Solange `node` nicht die Wurzel ist, wiederholt **einen** der drei Fälle anwenden, bestimmt durch die relative Lage von `node`, seinem Vater `p` und (falls vorhanden) seinem Großvater `g`:

| Fall | Bedingung | Behebung |
|---|---|---|
| **Zig** | `node` hat **keinen Großvater** (`p` ist die Wurzel) | einfache Rotation **um `p`** (rotateLeft oder rotateRight, je nachdem, auf welcher Seite `node` liegt) |
| **Zig-Zig** | `node` und `p` sind **beide linke Kinder** oder **beide rechte Kinder** | zuerst **um `g`** rotieren, dann **um `p`** |
| **Zig-Zag** | `node` ist ein linkes Kind und `p` ein rechtes Kind, oder umgekehrt (gegenüberliegende Seiten) | zuerst **um `p`** rotieren, dann **um `g`** |

**Zig** tritt pro Splay **höchstens einmal** auf (nur im letzten Schritt, wenn der Knoten zu einem direkten Kind der Wurzel aufgestiegen ist). Zig-Zig und Zig-Zag wiederholen sich, solange ein Großvater existiert — man beachte, dass sich die **Rotationsreihenfolge** zwischen ihnen unterscheidet: Zig-Zig rotiert den *entfernteren* Knoten (`g`) zuerst, Zig-Zag den *näheren* (`p`).

```
splay(node):
  while node.parent != null:
    p = node.parent
    g = p.parent
    if g == null:                       // Zig
      rotate(p, rotateLeft = (node == p.right))
    elif (node == p.left) == (p == g.left):   // Zig-Zig: gleiche Seite
      rotate(g, rotateLeft = (p == g.right))
      rotate(p, rotateLeft = (node == p.right))
    else:                                // Zig-Zag: gegenüberliegende Seiten
      rotate(p, rotateLeft = (node == p.right))
      rotate(g, rotateLeft = (node == g.right))
```

## Einfügen

**Genau wie ein reines BST-Einfügen** (der neue Knoten wird ein Blatt, gefunden per Absteigen über Schlüsselvergleiche), dann `splay(newNode)` aufrufen, um ihn zur Wurzel zu bringen.

```
insert(T, value):
  w = bstInsert(T, value)   // reines BST-Einfügen; w = das neue Blatt
  splay(w)                  // w wird die neue Wurzel
```

## Suchen / find

**Genau wie eine reine BST-Suche.** Danach wird der **zuletzt besuchte Knoten** zur Wurzel gesplayt — das ist entweder der Knoten mit dem gesuchten Wert (falls gefunden) oder der letzte echte untersuchte Knoten, bevor die Suche in ein null-Kind hinausfällt (falls nicht gefunden). Gesplayt wird **unabhängig davon, ob der Schlüssel gefunden wurde**.

## Löschen

1. `w = find(value)` — das lokalisiert den Knoten (falls vorhanden) und **splayt als Nebeneffekt den zuletzt besuchten Knoten zur Wurzel**.
2. Wurde `value` nicht gefunden (die gesplayte Wurzel enthält ihn nicht), bleibt der Baum wie er ist (nur das Splay der erfolglosen Suche hat gewirkt) — mehr ist nicht zu tun.
3. Andernfalls **ist** die Wurzel der zu löschende Knoten. Ihn entfernen, wodurch der Baum in zwei Teilbäume zerfällt: `L` (der linke Teilbaum der alten Wurzel) und `R` (der rechte Teilbaum).
4. Ist `L` leer, so wird `R` (falls vorhanden) der neue Baum.
5. Andernfalls: das **Maximum** von `L` bestimmen (ganz rechts absteigen — es hat kein rechtes Kind) und es per `splay` zur neuen Wurzel von `L` machen. Da es das Maximum war, hat es nun **kein rechtes Kind**, sodass `R` direkt als sein rechtes Kind angehängt werden kann — das ist die neue Gesamtwurzel.

```
delete(T, value):
  w = find(T, value)          // splayt den zuletzt besuchten Knoten zur Wurzel, unabhängig vom Ergebnis
  if T.root.value != value: return   // nicht vorhanden, nichts weiter zu tun
  L, R = T.root.left, T.root.right
  T.root entfernen
  if L == null: T.root = R
  else:
    w' = max(L)                // der ganz rechte Knoten von L
    splay(w')                  // w' wird die Wurzel von L; es hat kein rechtes Kind
    w'.right = R
    T.root = w'
```

## Randfälle & Invarianten

- Splay-Bäume führen **überhaupt keine Balance-Metadaten** — keine Höhen, keine Farben, keine Balancefaktoren. Alle Struktur entsteht rein aus zugriffsgetriebenen Rotationen.
- **Jede** Operation (auch eine erfolglose Suche) löst ein Splay aus — das macht den Baum „selbstanpassend“: Kürzlich berührte Schlüssel landen in der Nähe der Wurzel.
- Die Reihenfolge der beiden Rotationen bei Zig-Zig (Großvater, dann Vater) unterscheidet ihn davon, einfach zwei unabhängige Zig-Schritte auszuführen — zwei reine Zigs hintereinander erzeugen ein *anderes*, schlechter balanciertes Ergebnis als ein echtes Zig-Zig.
- Ein einzelner `splay`-Aufruf kann **jeden Knoten auf dem Pfad** vom Ziel zur alten Wurzel berühren — im Worst Case O(n) für eine Operation, aber die **amortisierten** Kosten über eine Operationsfolge sind O(log n) (Potentialfunktions-Argument), und das ist die klausurrelevante Garantie.
- Der Schritt „`R` unter dem Maximum von `L` anhängen“ verlässt sich darauf, dass das Maximum von `L` per Definition **kein rechtes Kind** hat — das gilt immer und braucht keine zusätzliche Prüfung.
- Anders als AVL- und Rot-Schwarz-Bäume rotieren Splay-Bäume bei **jedem einzelnen Zugriff**, nicht nur beim Einfügen/Löschen — selbst ein reines Nachschlagen strukturiert den Baum um.

## Komplexitätsübersicht

| Operation | Amortisierte Zeit |
|---|---|
| Suchen | O(log n) |
| Einfügen | O(log n) |
| Löschen | O(log n) |
