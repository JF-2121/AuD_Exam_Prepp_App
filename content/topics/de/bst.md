---
id: bst
title: "Binäre Suchbäume"
category: "Trees"
order: 1
---

## Definition

Ein BST ist ein Binärbaum, in dem jeder Knoten einen Schlüssel trägt und für jeden Knoten z gilt: Alles im **linken** Teilbaum von z ist `< z.key`, alles im **rechten** Teilbaum ist `≥ z.key`. Diese Invariante erlaubt es der Suche, in jedem Schritt die Hälfte des verbleibenden Baums zu überspringen — *sofern* der Baum balanciert ist.

## Terminologie für Binärbäume (formal)

- Jeder Knoten hat eine Liste seiner (bei Binärbäumen höchstens zwei) **Kinder**. Ist Knoten `c` ein Kind von `p`, so ist `p` der **Vater** von `c`. Jeder Baum hat genau einen Knoten ohne Vater: die **Wurzel**.
- Ein Knoten ohne Kinder ist ein **Blatt**; jeder andere Knoten ist ein **innerer Knoten**.
- Ein **Pfad** zwischen den Knoten `a` und `d` ist eine Folge `(v₀,...,vₙ)` mit `v₀=a`, `vₙ=d` und `vᵢ₊₁` als Kind von `vᵢ` für jedes `i`. Existiert ein solcher Pfad, so ist er **eindeutig** (Bäume haben keine Kreise) — in diesem Fall nennt man `a` einen **Vorfahren** von `d` und `d` einen **Nachfahren** von `a`.
- Die **Tiefe** eines Knotens ist die Länge des Pfades von der Wurzel zu ihm (die Wurzel selbst hat Tiefe 0).
- Der **Teilbaum** mit Wurzel `x` ist `x` zusammen mit allen seinen Nachfahren.

## Suchen & Einfügen

```
search(x, k)
  IF x == nil OR x.key == k THEN RETURN x
  IF k < x.key THEN RETURN search(x.left, k)
  ELSE RETURN search(x.right, k)

insert(T, z)
  x = T.root; px = nil
  WHILE x != nil DO
    px = x
    x = (z.key < x.key) ? x.left : x.right
  z.parent = px
  IF px == nil THEN T.root = z
  ELSE IF z.key < px.key THEN px.left = z
  ELSE px.right = z
```

Beide laufen in **O(h)**, wobei h die Höhe des Baums ist — Θ(log n) bei Balance, aber **Θ(n) im Worst Case** (ein entarteter Baum, in dem jeder Knoten nur ein Kind hat, praktisch eine verkettete Liste).

**Durchgerechnetes Beispiel**: 50, 30, 15, 80, 20, 60, 90, 70 (in dieser Reihenfolge) in einen leeren BST einfügen — jeder Schlüssel steigt über dieselben `<`/`≥`-Vergleiche wie bei `search` ab und hält beim ersten `nil`-Kindplatz.

```
        50
      ┌──┴──┐
     30      80
    ┌─┘    ┌──┴──┐
   15      60    90
     └─┐     └─┐
      20       70
```

Eine nützliche Gegenprobe zu dieser Form: **die Inorder-Traversierung JEDES BST ist stets sortiert** — hier `15, 20, 30, 50, 60, 70, 80, 90`.

### Einen gültigen Suchpfad erkennen

Eine Zahlenfolge ist genau dann ein gültiger **Suchpfad** eines BST (die beim Suchen eines Werts besuchten Knoten), wenn sie nie eine von einer früheren Abzweigung gesetzte Schranke verletzt: Ein Schritt nach **links** an einem Knoten legt eine **obere Schranke** für alle nachfolgenden Werte fest (sie müssen alle `<` dem Schlüssel dieses Knotens sein), ein Schritt nach **rechts** legt eine **untere Schranke** fest. Verletzt ein späterer Wert die zuletzt gesetzte Schranke, so kann kein BST diesen Pfad erzeugt haben.

Beispiel: `124, 153, 131, 148, 142, 156` ist **kein** gültiger Suchpfad — der Linksschritt bei 153 (um 131 zu erreichen) setzt für alles Folgende eine obere Schranke von 153, aber der letzte Wert 156 bricht sie (156 > 153). Dagegen ist `47, 19, 41, 26, 33, 38` **gültig**: Wurzel 47 → links zu 19 → rechts zu 41 → rechts zu 26 → rechts zu 33 → rechts zu 38, und jede Abzweigung respektiert alle bisher gesetzten Schranken.

## Löschen

Drei Fälle, mit einer Hilfsroutine `transplant(u, v)`, die den Teilbaum mit Wurzel u durch den Teilbaum mit Wurzel v ersetzt:

1. **Blatt** (keine Kinder) — einfach entfernen.
2. **Ein Kind** (ein „Halbblatt“) — transplantieren: Das einzelne Kind nimmt direkt den Platz des gelöschten Knotens ein.
3. **Zwei Kinder** — den **Nachfolger** y von z bestimmen (der kleinste Schlüssel im rechten Teilbaum von z, also der linkeste Knoten des rechten Teilbaums), y an die Position von z transplantieren und y die linken und rechten Kinder von z geben.

```
delete(T, z)
  IF z.left == nil THEN transplant(T, z, z.right)
  ELSE IF z.right == nil THEN transplant(T, z, z.left)
  ELSE
    y = z.right
    WHILE y.left != nil DO y = y.left      // Nachfolger suchen
    IF y.parent != z THEN
      transplant(T, y, y.right)
      y.right = z.right; y.right.parent = y
    transplant(T, z, y)
    y.left = z.left; y.left.parent = y
```

Ebenfalls **O(h)**.

**Durchgerechnetes Beispiel** (Fortsetzung des oben aufgebauten Baums): 15, dann 70, dann 80 löschen, in dieser Reihenfolge:
1. 15 löschen — Knoten 15 hat genau **ein Kind** (20) → **Fall 2**: 20 ersetzt 15 direkt.
2. 70 löschen — Knoten 70 ist ein **Blatt** → **Fall 1**: direkt entfernen.
3. 80 löschen — Knoten 80 hat **zwei Kinder**, und sein rechtes Kind 90 hat kein linkes Kind, ist also sein eigener Nachfolger → **Fall 3**: 90 ersetzt 80.

```
        50
      ┌──┴──┐
     30      90
       └─┐    └─┐
        20      60
```

## Traversierungen

- **Inorder** (links, Knoten, rechts) — besucht die Schlüssel in aufsteigend sortierter Reihenfolge. Wird genutzt, um einen BST zurück in sortierte Daten zu serialisieren.
- **Preorder** (Knoten, links, rechts) — nützlich zum Kopieren eines Baums (Struktur von oben nach unten neu aufbauen).
- **Postorder** (links, rechts, Knoten) — nützlich zum Löschen eines Baums (Kinder vor dem Vater freigeben).

Alle drei sind **Θ(n)** (jeder Knoten wird einmal besucht).

**Anmerkung**: Preorder allein bestimmt die Form eines Baums *nicht* eindeutig (eine gegebene Preorder-Folge kann von verschiedenen Bäumen stammen). Aber **Preorder + Inorder gemeinsam** (bei durchweg eindeutigen Schlüsseln) rekonstruieren den Baum eindeutig.

### Einen BST allein aus der Postorder rekonstruieren

Anders als bei Preorder genügt die **Postorder-Folge eines BST für sich allein**, um ihn eindeutig zu rekonstruieren (die Suchbaumeigenschaft löst die Zuordnung links/rechts auf). Postorder ist `(Postorder des linken Teilbaums) ∥ (Postorder des rechten Teilbaums) ∥ (Wurzel)` — das **letzte Element ist also stets die Wurzel**, und die BST-Eigenschaft (Schlüssel des linken Teilbaums `<` Wurzel `≤` Schlüssel des rechten Teilbaums) bestimmt genau, wo im Rest die Trennung zwischen linker und rechter Teilbaumfolge liegt.

**Durchgerechnetes Beispiel**: Rekonstruktion aus der Postorder `27, 36, 30, 44, 41, 45, 39, 21`. Wurzel = letztes Element = **21**. Da hier in einem gültigen BST vor der 21 keine kleineren Schlüssel verbleiben, bildet alles Übrige ihren rechten Teilbaum (Wurzel **39**, nach derselben Regel rekursiv gefunden): Zerlege `27,36,30,44,41,45` in `(27,36,30)` (alle `< 39`, linker Teilbaum) und `(44,41,45)` (alle `> 39`, rechter Teilbaum). Rekursion: `(27,36,30)` → Wurzel 30, linkes Blatt 27, rechtes Blatt 36. `(44,41,45)` → Wurzel 45, linker Teilbaum `(44,41)` → Wurzel 41 mit rechtem Kind 44.

```
21
  └──┐
     39
   ┌──┴──┐
  30      45
 ┌─┴─┐   ┌─┘
27  36  41
          └─┐
            44
```

### Inorder ALLEIN genügt nicht (selbst mit zusätzlichen Struktureinschränkungen)

Eine verlockende, aber **falsche** Behauptung: „Jeder BST mit eindeutigen Schlüsseln und ohne Halbblätter (jeder innere Knoten hat genau 0 oder 2 Kinder) lässt sich allein aus seiner Inorder-Traversierung eindeutig rekonstruieren.“ **Gegenbeispiel** — beide sind gültige BSTs, mit eindeutigen Schlüsseln, ohne Halbblätter, und teilen die identische Inorder-Traversierung `15, 20, 30, 50, 60`:

```
     50                20
   ┌──┴──┐            ┌─┴──┐
  20      60          15    50
 ┌─┴─┐                    ┌──┴──┐
15   30                  30      60
```

Dieses Gegenbeispiel mit 5 Knoten ist zugleich **minimal** — mit weniger Knoten existiert kein Gegenbeispiel: Bei 0 oder 1 Knoten ist die Rekonstruktion trivial; bei genau 2 Knoten wäre die Wurzel immer ein Halbblatt (per Voraussetzung ausgeschlossen); bei genau 3 Knoten hat von den 5 möglichen Formen nur eine (eine Wurzel mit zwei Blattkindern) kein Halbblatt, und sie ist durch die sortierten Inorder-Werte `a,b,c` eindeutig erzwungen → Wurzel `b`, Kinder `a,c`; bei genau 4 Knoten vermeiden von den 14 möglichen Formen nur 4 ein Halbblatt *an der Wurzel*, aber jede dieser 4 enthält weiterhin irgendwo im Baum ein Halbblatt. Erst bei 5 Knoten tritt ein echtes ambiges Paar erstmals auf.

## „BST-Sort“: sortieren per Einfügen und Inorder

Man kann n Zahlen sortieren, indem man sie alle in einen (initial leeren) BST einfügt und sie dann per Inorder-Traversierung ausliest. Die Laufzeit hängt vollständig von der Form des entstehenden Baums ab:
- **Worst Case**: Die Eingabe ist bereits sortiert → jedes Einfügen entartet den Baum zu einer Kette (Höhe n), sodass das i-te Einfügen Θ(i) kostet → insgesamt `1+2+...+n = Θ(n²)`.
- **Best Case**: Der Baum bleibt balanciert (Höhe O(log n)) → jedes Einfügen kostet O(h) = O(log n) → insgesamt **O(n log n)**, was die optimale Schranke für vergleichsbasiertes Sortieren erreicht.

Genau *deshalb* sind selbstbalancierende Bäume (AVL, Rot-Schwarz) wichtig: Sie garantieren die Best-Case-Form (und damit ein BST-Sort in O(n log n)) unabhängig von der Eingabereihenfolge, statt sie dem Zufall zu überlassen.

## Strikte Binärbäume: die Blattzahl-Formel (Beweis)

Ein **strikter** (oder voller) Binärbaum ist einer, in dem jeder Knoten entweder 0 oder 2 Kinder hat (nirgends Halbblätter). **Behauptung: Ein strikter Binärbaum mit n Knoten hat stets genau `(n+1)/2` Blätter.**

*Beweis per Induktion* (es treten nur ungerade n auf, da strikte Bäume immer eine ungerade Knotenzahl haben): **Basisfall** n=1 — eine einzelne Wurzel ist 1 Blatt, und `(1+1)/2 = 1` ✓. **Induktionsschritt**: Angenommen, die Behauptung gilt für alle strikten Bäume mit `≤ n` Knoten; betrachte einen mit `n+2` Knoten. Da `n+2 > 1`, hat die Wurzel zwei Kinder, die Wurzeln strikter Teilbäume mit `n_L` und `n_R` Knoten sind (`n_L + n_R = n+1`, denn die Wurzel selbst ist das `+1`). Nach Induktionsvoraussetzung haben die Teilbäume `(n_L+1)/2` bzw. `(n_R+1)/2` Blätter; die Wurzel selbst ist kein Blatt, also insgesamt `(n_L+1)/2 + (n_R+1)/2 = (n_L+n_R+2)/2 = (n+1+2)/2 = ((n+2)+1)/2` Blätter — genau die behauptete Formel für den Baum mit `(n+2)` Knoten. QED.

## Rotationen erhalten die BST-Eigenschaft (Beweisskizze)

Eine **Rotation** ist das O(1)-Primitiv zur lokalen Umstrukturierung hinter jedem selbstbalancierenden BST (AVL, Rot-Schwarz, Splay). Es lohnt sich, direkt zu verifizieren, dass sie die Suchbaum-Invariante nie zerstört — hier gezeigt für eine **Links-Rechts-Doppelrotation** an Knoten `z` (einfache Rotationen sind dasselbe Argument, eine Schicht einfacher).

Ausgangslage: Vor der Rotation ist `x` die Teilbaumwurzel mit linkem Kind `α` und rechtem Kind `y`; `y` hat linken Teilbaum `β` und rechten Teilbaum `γ`; `z` (der Großvater) hat `x` als ein Kind und den Teilbaum `δ` als das andere — mit der Schlüsselordnung `key(α) ≤ x.key ≤ key(β) ≤ y.key ≤ key(γ) ≤ z.key ≤ key(δ)`. Nach `DoubleRotateLR(B,z)`: `y` wird die neue Teilbaumwurzel, mit `x` (Kinder `α,β`) als linkem und `z` (Kinder `γ,δ`) als rechtem Kind.

**Immer noch ein gültiger Binärbaum**: Fallprüfung für jeden Knoten `v` — außerhalb des rotierten Teilbaums (unverändert), `v=x` (Kinder werden `α,β`, weiterhin 2), `v=y` (Kinder werden `x,z`, weiterhin 2), `v=z` (Kinder werden `γ,δ`, weiterhin 2) — jeder Knoten behält höchstens 2 Kinder.

**Immer noch ein gültiger BST**: `v=x` — linker Teilbaum `α`, rechter Teilbaum `β`; da `α ≤ x ≤ β` vorher galt, weiterhin gültig. `v=z` — linker Teilbaum `γ`, rechter Teilbaum `δ`; `γ ≤ z ≤ δ` galt vorher (beide lagen schon auf ihrer jeweiligen Seite von z), weiterhin gültig. `v=y` — linker Teilbaum `{x,α,β}` (alle waren vor der Rotation `≤ y.key`) und rechter Teilbaum `{z,γ,δ}` (alle waren vorher `≥ y.key`) — die Ordnung beider Seiten bleibt erhalten. Jedes `v` innerhalb von `α,β,γ,δ` behält dieselbe relative Position zu seinen eigenen Nachfahren, von der Rotation unberührt. Alle Fälle gelten, `B′` ist also ein gültiger BST. QED — das ist die strukturelle Tatsache, auf die sich jeder rotationsbasierte selbstbalancierende Baumalgorithmus stillschweigend verlässt.
