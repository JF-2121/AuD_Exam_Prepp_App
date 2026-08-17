# AUD Maxine 5_260603_154436.pdf

Source metadata: Slide deck "AUD | Übungsgruppe 2 | M.Konz", dated 01.06.2025 (title slide "AUD Übungsgruppe 2"). This is an exercise-group (Übung) session, combining recap ("Wiederholung") slide sections with printed exercise sheets (G1–G5) and Maxine's handwritten annotations directly on/around the slides. Note: no "G1" section appears in the pages read — content starts with an orga/recap slide, then "Wiederholung – Linked Lists" and moves into G2.

## Orga-Wiederholungsstunde (housekeeping, p.1-4)

- Tutor mentions correction of "Schleifeninvariante" (loop invariant) topic was unclear in feedback; offered an optional additional review session ("Wiederholungsstunde"), to be in-person (Präsenz), since no time remained in the regular Übung.
- Slido poll answers shown: interest in a review session → "Ja, in Präsenz"; proposed time: Montag 11:30–13:10, room TBD.
- Jonas Bingel (possibly known as a Mathe-Tutor) would also like to join in person.

## Wiederholung – Linked Lists (p.5-13)

### VERKETTETE LISTEN (Linked Lists) — core structure (p.6)

Node fields:
- **key** – Wert (value)
- **prev** – Zeiger auf Vorgänger (pointer to predecessor)
- **next** – Zeiger auf Nachfolger (pointer to successor)

**Implementation note (Array-based):** "Array: Immer 3 Elemente stellen 1 Listenelement dar" (every 3 array slots represent one list element); prev & next describe array-entry offsets.

Diagram: `L.head = 6` points into an array indexed 0–8:
```
index:   0    1    2    3   4   5    6    7   8
value: [12] [ 6] [nil] [ ] [ ] [ ] [45] [nil] [0]
        key  prev next            key   prev next
```
Arrow from L.head (=6) points to array index 6. A separate small diagram shows nodes `45 → 12` linked (illustrating the key/prev/next relationship pulled from the array).

**search(L,k)** — returns pointer to k in L (or nil). Θ(n).
```
1  current = L.head;
2  WHILE current != nil AND current.key != k DO
3     current = current.next;
4  return current;
```
Note: "Geht von head aus durch die Liste und sucht nach dem key" (goes from head through the list searching for the key).
Example trace: `search(L,13)` on list `head → 5 → 12 → 13 → 42` — visually traced/circled walking from head through 5, 12, to 13.

**insert(L,x)** — inserts element x in L. Θ(1).
```
1  x.next = L.head;
2  x.prev = nil;
3  IF L.head != nil THEN
4     L.head.prev = x;
5  L.head = x;
```
Note: "Element wird als neuer Head eingefügt" (element inserted as new head); "prüft nicht, ob key schon enthalten → T(n) = Ω(n) (bei Prüfung)" — i.e., insert does NOT check for duplicate keys; checking would cost Ω(n).
Example trace `insert(L,9)`:
```
before: head → 5 → 12 → 13 → 42
after:  head → 9 → 5 → 12 → 13 → 42
```

**delete(L,x)** — deletes element x from L. Θ(1).
```
1  IF x.prev != nil THEN
2     x.prev.next = x.next;
3  ELSE
4     L.head = x.next;
5  IF x.next != nil THEN
6     x.next.prev = x.prev;
```
Annotations: "→ Umsetzen von pointers", "→ Löschen eines Wertes k kostet Ω(n)" (finding the value to delete costs Ω(n) — presumably because you must search first), "→ Mit Sentinel → einfacher" (with a sentinel node it's simpler).
Example: list `5 → 12 → 13`, deleting middle element shown with circled pointer updates.

**deleteSent(L,x)** — deletes x from L, list WITH a sentinel node. Θ(1).
```
1  x.prev.next = x.next;
2  x.next.prev = x.prev;
```
Diagram shows sentinel list: `L.sent → head → [nil| 5 |...] → [12] → [13]`, and after `deleteSent(L,x)`: `head → [nil|5] → [13]` (x=12 removed directly, no null-checks needed because sentinel absorbs edge cases).

## G2 – Linked Lists (exercise, p.7-13)

### G2a) — Compare singly vs. doubly linked lists (p.8-10)
Question: "Vergleichen Sie einfach und doppelt verkettete Listen, indem Sie Vorteile der jeweiligen Datenstruktur beschreiben." Slido prompt: schema DL = doubly linked, EL = singly linked.

**Solution (p.10):**
Advantages of doubly linked lists (exemplary):
- List can be traversed **forwards and backwards**.
- **Deleting an element is more efficient** when you already hold a pointer to the element to delete (the operation is O(1)), because you can adjust predecessor and successor via that node. With singly linked lists you'd additionally need the predecessor pointer, and in the worst case would have to traverse the whole list (O(n)).

Advantages of singly linked lists (exemplary):
- Each element needs **less memory**, since only the successor pointer is stored (doubly linked lists must store both predecessor and successor pointers).
- Inserting into a singly linked list needs **fewer operations**, since only one pointer must be adjusted (doubly linked needs both predecessor and successor pointers adjusted).

### G2b) — Reverse a singly linked list, non-recursive, O(n), no extra memory (p.11-13)
Task: "Formulieren Sie einen nicht rekursiven Algorithmus, der eine einfach verkettete Liste mit n Elementen umkehrt." No extra lists allowed (temp vars of constant size OK). O(n) runtime. Prove correctness via loop invariant.

**Worked example / trace (p.12):** Starting list: `0 → 1 → 2 → 3 → (nil)`
Idea: build new reversed list starting from node 0 as the end (next=nil), then successively prepend each subsequent original element to the front of new list:
```
Step 1: 1 → 2 → 3 →      and separately   0 →
Step 2: 2 → 3 →           and separately   1 → 0 →
Step 3: 3                and separately   2 → 1 → 0 →
Final:                                     3 → 2 → 1 → 0 →
```
Note box: "Die Liste ist keine neue Liste, sondern die Pointer werden einfach neu gesetzt, nur zur Übersicht wird hier von einer neuen Liste geredet" (it's not actually a new list — pointers are just reassigned in place; talk of a "new list" is just for clarity).

**Algorithm `ReverseList(L)`:**
```
11:  a = L.head
12:  b = a.next
13:  a.next = nil
14:  while b != nil do
15:      t = b.next
16:      b.next = a
17:      a = b
18:      b = t
19:  L.head = a
```

**Correctness proof (loop invariant, p.13):** "Sehr kurz-gefasster Beweis der Invariante."
Loop invariant: "Zu Beginn der i-ten Iteration der while-Schleife ist L eine verkettete Liste, welche die ersten i Elemente der ursprünglichen Liste in umgekehrter Reihenfolge enthält."
- Initialization: invariant holds before first iteration (L consists of just one element).
- Maintenance: each iteration appends the last not-yet-processed element to L and shifts the list head accordingly.
- Termination: when loop exits, b = nil, so a is the last element of the original list L (now the head). Therefore ReverseList is correct.

## Wiederholung – Binäre Bäume (Binary Trees) (p.14-19)

### BINÄRE-BÄUME core definitions (p.15)

Node contains:
- **key** (Wert)
- **child[]** (array of pointers to children)
- **parent** (pointer to parent node) → "manchmal" (sometimes present)

Example tree diagram:
```
          5 (WURZEL/root)
        /              \
      9 (linker Teilbaum) 12
     /   \                  \
   23     7                 23
```
Annotations on this diagram:
- "5 ist ein Vorfahre von 9,23,7..." (5 is an ancestor of 9,23,7,...)
- "12 ist ein Kind von 5" (12 is a child of 5)
- "23 ist Nachkomme von 12 und 5" (23 is a descendant of 12 and 5)
- "9 ist ein Elternknoten von 23 & 7" (9 is a parent node of 23 & 7)
- "23 hat 7 als Geschwister" (23 has 7 as a sibling)
- Bottom-left "23" node labeled "Blatt" (leaf); the "23" hanging off 12 (with only one child) is labeled "Halbblatt, hat genau 1 Kind" (half-leaf, has exactly 1 child).
- Depth markers on left margin: labeled 0, 1, 2 next to tree levels — "Tiefe = 2" noted at bottom.

**Höhe (Height) box:** "Höhe ≙ max. Tiefe der Knoten" (height = max depth of nodes); "Höhe leerer Bäume: -1" (height of empty trees = -1).

**Eigenschaften (Properties), right column:**
- Baum ist leer oder... (tree is empty or...)
- Es gibt einen Knoten r ("Wurzel"), sodass jeder Knoten v von der Wurzel aus per eindeutiger Sequenz von child-Zeigern erreichbar ist: `v = r.child[i1].child[i2]. ... .child[im]`
- → Bäume sind azyklisch (trees are acyclic)
- Für BINÄR-Baum: jeder Knoten hat max 2 Kinder (for binary tree: each node has max 2 children)

**Box (top-right):** "Für einen nicht-leeren Baum gibt es genau #Knoten − 1 viele Einträge ≠ nil über alle Listen child[]" (wegen Root #child annotation) — i.e. for a non-empty tree there are exactly (#nodes − 1) non-nil entries across all child[] lists, "because of root #child."

### ABSTRAKTER DATENTYP – BAUM (Abstract Data Type – Tree) (p.16)

- **new(T)** — erzeugt neuen Baum namens T (creates new tree named T).
- **search(T,k)** — gibt Element x im Baum T mit x.key==k zurück (bzw. nil). Starts with `search(T.root,k)`.
```
search(x,k)   Θ(n)
1  IF x==nil THEN return nil;
2  IF x.key==k THEN return x;
3  y=search(x.left,k);
4  IF y != nil THEN return y;
5  return search(x.right,k);
```
- **insert(T,x)** — fügt Element x in Baum T hinzu. Θ(1). Comment: `//x.parent==x.left==x.right==nil; ← als root`
```
1  IF T.root != nil THEN
2     T.root.parent=x;
3     x.left=T.root;
4  T.root=x;
```
- **delete(T,x)** — löscht x aus Baum T. "Findet zuerst den maximalen Knoten im Baum, ersetzt ihn dann durch seinen linken Nachfolger (falls vorhanden), und ersetzt anschließend den zu löschenden Knoten durch den maximalen Knoten, indem die Teilbäume an den max Knoten gehängt werden." (First finds the max node in the tree, replaces it with its left successor if present, then replaces the node-to-delete with that max node, attaching subtrees to it.)
```
delete(T,x)   //assumes x in T     Θ(h)
1  y=T.root;
2  WHILE y.right!=nil DO
3     y=y.right;
4  transplant(T,y,y.left);
5  IF x != y THEN
6     y.left=x.left;
7     IF x.left != nil THEN
8        x.left.parent=y;
9     y.right=x.right;
10    IF x.right != nil THEN
11       x.right.parent=y;
12    transplant(T,x,y);
```
Note: "suche rechtestes Kind" (search for rightmost child) attached near step 2-3.

Worked example: `delete(T, 17)` on tree with root 23, left child 17 (green), right child 24 (yellow); 17 has children 9 and 22. Result: 17 replaced by 24 (max node), with 9 and 22 reattached: `23 → (24 with children 9,22)`. Annotation: "setze linken Teilbaum an max dran → rechts" (attach left subtree to the max node → on the right).

- **transplant(T,y,w)** — //transplant w to y.parent. Θ(1).
```
1  v=y.parent;
2  IF y != T.root THEN
3     IF y == v.right THEN
4        v.right=w;
5     ELSE
6        v.left=w;
7  ELSE
8     T.root=w;
9  IF w != nil THEN
10    w.parent=v;
```

### Wo Unverständlichkeiten auftreten können (Common misunderstandings) (p.17-19)

**Height vs depth clarification (p.17):** "Wir sprechen von der Höhe eines Baumes und der Tiefe eines Knotens. Es gibt keine 'Tiefe eines Baumes' oder 'Höhe eines Knotens'." Height is defined recursively: `height(tree) = max(height of subtrees of root) + 1`.

Worked example tree: root `a`, children `b` and `e`; `b` has children `c`, `d`.
```
height(c) = max(height(nil,nil)) + 1 = -1+1 = 0
similarly height(d) = 0
max(height(c),height(d)) + 1 = 0+1 = 1  → height(bcd) = 1
max(height(bcd), height(e)) + 1 = max(1,0)+1 = 1+1 = 2  → height(a's tree) = 2
```

**Siblings (Geschwister) (p.18):** "Geschwister in binären Bäumen sind gleich zu Geschwistern auch im familiären Verhältnis." Formula: `sibling(x) = {y | child(parent(x))} \ x`. Explicit correction noted: "In der Übung habe ich das leider falsch erklärt!" Example tree: a→(b,e); b→(c,d); e→(f). `sibling(c) = {d}` — **NICHT** `{d,f}` (explicitly marked wrong with a lightning-bolt icon).

**Inner nodes (Innere Knoten):** "Innere Knoten in binären Bäumen sind alle Knoten außer die Blätter und die Wurzel" (all nodes except leaves and root). Formula: `inner_nodes = {y | ¬(y=root) ∧ ¬(y=leaf)}`. Example: `inner_nodes(tree) = {b,e}`.

**Ancestors/Descendants vs Parent (p.19):** "Vorfahren und Nachkommen sind eine evtl. mehr-elementige Menge an Knoten, während beispielsweise Eltern nur eine einelementige Menge beschreiben" (ancestors/descendants can be multi-element sets; parent is always a single-element set). Same tree a→(b,e), b→(c,d), e→(f). Example: `descendent(a) = {b,e,c,d,f}`, `Parent(b) = {a}`.

## G3 Binäre Bäume (exercise) (p.20-25)

Tree used throughout G3 (labeled with letters):
```
                r
             /     \
           m         n
          /         /  \
         f         s      x
        / \       /      /  \
       h   a     d      v     p
                        /     / \
                       b     u   k
                      /           \
                     l             y
```
Sub-questions:
a) Kinder(n)/Eltern(f)
b) Geschwister(d)
c) # Innere Knoten
d) Vorfahren(x)/Nachkommen(x)
e) Tiefe(b)
f) Rechter Teilbaum(x)
g) Englische Begriffe (English terms)

### G3 – Lösungen (Solutions) (p.22)
a) **Kinder(n) = {s,x}** / **Eltern(f) = {h,a}**
b) **Geschwister(d) = {}** (empty set)
c) **# Innere Knoten = #{f,m,n,s,x,v,b,u,k} = 10**
d) **Vorfahren(x) = {n,r}** / **Nachkommen(x) = {v,b,l,p,u,k,y}**
e) **Tiefe(b) = 4**
f) **Rechter Teilbaum(x)** = subtree rooted at x: {v(b,l), p(u,k(y))}
g) English glossary table:
   | Deutsch | Englisch |
   |---|---|
   | Baum | tree |
   | Wurzel | root |
   | Knoten | node |
   | Vorfahre | ancestor |
   | Nachkomme | descendant |
   | Kind | child |
   | Elternteil | parent |
   | Geschwister | sibling |
   | Tiefe | depth |
   | innerer Knoten | inner node |
   | Blatt | leaf, pl. leaves |
   | Teilbaum | subtree |

### G3 – Lösungen (insert(z)) (p.23)
"Beim Einfügen setzen wir das einzufügende Element immer neu als root dran." Note: "Der Algorithmus gibt uns hier (ineffizienterweise) vor den alten konstruierten Baum als linken Teilbaum dranzuhängen" (inefficiently attaches the old tree as z's left subtree). insert(T,x) code shown again (same as p.16), Θ(1). Worked example: inserting z makes z the new root with the entire old tree (r,...) as its left subtree.

### G3 – Lösungen (delete(v)) and (delete(f)) (p.24-25)
Detailed step-by-step walkthrough of the tree-delete algorithm using transplant, on the same tree from G3:

**delete(v):** "Wir suchen uns im rechten Teilbaum den rechtesten Knoten." Since root has no right subtree, z itself IS the rightmost node already — stored directly. Call transplant: replaces the considered element with its left subtree (valid because we've already iterated to the rightmost node, so it has no right subtree — the binary property can't be violated). "Hier macht transplant aber nicht mehr als nur den Knoten z zu 'löschen'! Achtung wir haben hier noch nicht v gelöscht!" Then the actual node v is searched and replaced by the stored z.

**delete(f):** rightmost node in right subtree found is k, stored. transplant replaces betrachtete element (k) with its left subtree (y). "!Achtung wir haben hier noch nicht f gelöscht!" f is then found and replaced by stored k. Full before/after trees drawn showing k moving up to replace f's position, with y taking k's old spot.

## Wiederholung – Traversierungen (Traversals) (p.26-28)

### TRAVERSIERUNGEN (p.27) — all three shown side by side on tree:
```
           5
        /     \
       9       12
      / \      / \
    23   7    1   3
```

**INORDER** — Θ(n):
```
inorder(x)
1  IF x != nil THEN
2     inorder(x.left);
3     print x.key;
4     inorder(x.right);
```
"gehe so weit nach links runter bis nil, gehe 1 hoch und print, dann geh rechts runter" (go as far left as possible until nil, go up one level and print, then go right).
Result sequence: **23 9 7 5 1 12 3**
Pattern: `(< Wurzel) || Wurzel || (≥ Wurzel)` — marked "! inorder ≠ Baum" (inorder alone does not uniquely reconstruct a tree).

**PREORDER** — Θ(n):
```
preorder(x)
1  IF x != nil THEN
2     print x.key;
3     preorder(x.left);
4     preorder(x.right);
```
Result: **5 9 23 7 12 1 3**
Pattern: `(Wurzel) || (< Wurzel) || (≥ Wurzel)` — "! preorder ≠ Baum" also noted (preorder alone doesn't uniquely reconstruct either — see note below though).
Also noted faint background formula: `T(n) ≤ (c+d)·n+c` "konstante Anweisungen" / "rekursiver Aufruf" — general recurrence relation for traversal running time.

**POSTORDER** — Θ(n):
```
postorder(x)
1  IF x != nil THEN
2     postorder(x.left);
3     postorder(x.right);
4     print x.key;
```
Result: **23 7 9 1 3 12 5**
Pattern: `(< Wurzel) || (≥ Wurzel) || (Wurzel)`
Side note box: "Das < und ≥ bezieht sich hier nur auf die Stelle im Binärbaum, erst im Suchbaum kann die Semantik verwendet werden" (the < / ≥ symbols here refer only to tree POSITION, not value — actual value semantics only apply once it's a search/BST tree).

**Key insight (lightbulb box):** "preorder + inorder + eindeutige Werte ⇒ Baum" (preorder + inorder + unique values ⇒ tree reconstructible). Method: preorder has root at position 1; search for that value's position in inorder; everything left of it in inorder = left subtree, everything right = right subtree.
Mini example: preorder = 1 2 3 (1 is root/Wurzel); inorder = 2 1 3 (2=links/left, 3=rechts/right) → reconstructs tree: root 1, left child 2, right child 3.

### "TRICK 17" — à la Bingel → wichtig für Zeitsparen in Klausur (p.28)

Mnemonic technique for reading off all three traversals from one tree drawing simultaneously, using colored dots placed around each node:
1. Use 3 colors: one color represents each traversal type — legend shown as "Preorder [blue] Inorder [yellow] Postorder [green]" dots.
2. Draw the three color dots around each node's position (left-top for preorder, bottom for inorder, right-top for postorder, following the general traversal pattern).
3. Draw a path/route through the nodes following the general traversal movement pattern.
4. (step numbered 5 in original, likely a typo for 4) Read off the path.

Example on same 7-node tree (5 root; 9,12 children; 23,7,1,3 grandchildren):
- **Preorder: 5-9-23-7-12-1-3**
- **Inorder: 23-9-7-5-1-12-3**
- **Postorder: 23-7-9-1-3-12-5**
(Matches the earlier results.)

## Wiederholung Binäre Suchbäume (Binary Search Trees / BST) (p.29-30)

### BINÄRE-SUCHBÄUME (BST) properties (p.30)

**Eigenschaften:** For all nodes: if x is a node in the left subtree of z, then `x.key ≤ z.key`; if y is a node in the right subtree of z, then `y.key ≥ z.key`. Example tree: root 23, children 17 and 24; 17's children 9 and 22.

**Key insight box:** "preorder + eindeutige Werte → Rekonstruktion des BST möglich (postorder geht auch)" — kleiner als Wurzel / größer als Wurzel. Mini example: preorder = 1 2 3 → reconstructs as root 1, left child 2 (since 2<1? — actually shown as: numbers under braces "1 2 3" with arrows labeled "kleiner als Wurzel" / "größer als Wurzel"), resulting tree: 1 as root with children 2 and 3.
**Important warning:** "inorder funktioniert hier nicht!" (inorder alone does NOT work for BST reconstruction, unlike the general preorder+inorder combo above) — marked with a warning/exclamation icon.

**search(x,k)** — 1st call x=root. Θ(h):
```
1  IF x==nil OR x.key==k THEN
2     return x;
3  IF x.key > k THEN
4     return search(x.left,k);
5  ELSE
6     return search(x.right,k);
```

**insert(T,z)** — may insert z again; z.left==z.right==nil. Θ(h):
```
1  x=T.root; px=nil;
2  WHILE x != nil DO
3     px=x;
4     IF x.key > z.key THEN
5        x=x.left     [Einstiegspunkt/entry point noted]
6     ELSE
7        x=x.right;
8  z.parent=px;
9  IF px==nil THEN
10    T.root=z;
11 ELSE
12    IF px.key > z.key THEN
13       px.left=z;
14    ELSE
15       px.right=z;
```
Comment: "baue Verbindung auf" (build the connection) bracketed around lines 8-15. "Suche" (search) bracketed around lines 2-7.

**delete(T,z)** — Θ(n) [as drawn; likely Θ(h) intended]:
```
1  IF z.left==nil THEN
2     transplant(T,z,z.right)
3  ELSE
4     IF z.right==nil THEN
5        transplant(T,z,z.left)
6     ELSE
7        y=z.right;
8        WHILE y.left != nil DO y=y.left;
9        IF y.parent != z THEN
10           transplant(T,y,y.right);
11           y.right=z.right;
12           y.right.parent=y;
13       transplant(T,z,y);
14       y.left=z.left;
15       y.left.parent=y;
```

**BST delete cases (right column, p.30):** "Sei z der zu löschende Knoten" (let z be the node to delete):
- → Wenn z kein linkes/rechtes Kind hat, dann ersetze durch rechtes/linkes Kind (if z has no left/right child, replace by right/left child) — small diagram: z→child replaced directly.
- → sonst suche nach kleinstwertigsten Knoten y im rechten Teilbaum von z (otherwise find the smallest-value node y in z's right subtree):
  - Wenn y nicht direktes rechtes Kind von z: y wird durch sein eigenes rechtes Kind ersetzt. Anschließend wird das rechte Kind von z dem neuen Knoten y zugewiesen, und y.right.parent auf y gesetzt. Ersetze z durch rechtes Kind [meant: y].
  - Sonst ersetze z durch rechtes Kind. Das linke Kind wird zum linken Kind von y gemacht.
  Small before/after diagrams illustrate both sub-cases with generic labeled nodes (z, y, colored blue/green).

**Height bounds (lightbulb box):**
- Best-Case Höhe: `h = O(log₂(n))`
- Worst-Case Höhe: `h = n-1`
- AVERAGE/Randomly-Built: `E[h] = Θ(log₂(n))`

## G4 – Binäre Suchbäume (exercise) (p.31-40)

### G4 (a-e) Task (p.32)
(a) Insert nodes with keys 17, 10, 1, 29, 7, 20, 30, 23 one by one into an empty BST. Sketch resulting tree.
(b) Traverse the tree with Inorder, Preorder, and Postorder. "Fällt Ihnen bei einem etwas auf?" (Notice anything about one of them?)
(c) Remove nodes with keys 1, 23, 29 one by one. Give resulting tree + which delete-case applies each time.
(d) Given Postorder traversal `7, 16, 10, 24, 21, 25, 19, 1` of a BST — reconstruct and sketch the tree.
(e) Prove or disprove: "Alle binären Suchbäume mit eindeutigen Werten und ohne Halbblätter lassen sich allein aus ihrer Inorder-Traversierung eindeutig rekonstruieren." (All BSTs with unique values and no half-leaves can be uniquely reconstructed from their inorder traversal alone.)

### G4a) Lösungen — full insertion trace (p.33)
Formulas given: `left-subtree(x) = {y | y < x}`, `right-subtree(x) = {y | y ≥ x}`.
Step by step insertion (each panel shows resulting tree):
1. Insert 17 → tree: {17}
2. Insert 10 → 17 with left child 10
3. Insert 1 → 17→10→1 (1 is left child of 10)
4. Insert 29 → 17 has right child 29 added; left subtree unchanged (10→1)
5. Insert 7 → 7 becomes left child of 1 -- wait, actually shown as: 17(10(1(nil,7)), 29) — 7 attached as right child of 1
6. Insert 20 → 20 becomes left child of 29
7. Insert 30 → 30 becomes right child of 29 (sibling of 20)
8. Insert 23 → 23 attached as right child of 20

**Final tree:**
```
              17
           /       \
         10          29
        /           /   \
       1            20    30
        \             \
         7             23
```

### G4b) Lösungen — traversals of the final tree (p.34)
- **Inorder: 1, 7, 10, 17, 20, 23, 29, 30** → "SORTIERT (bei binären SuchBäumen immer so)" (SORTED — always the case for BSTs)
- **Preorder: 17, 10, 1, 7, 29, 20, 23, 30**
- **Postorder: 7, 1, 10, 23, 20, 30, 29, 17**
Note: a large red "X" is drawn over part of the diagram, seemingly marking a wrong/discarded attempt.

### G4c) Lösungen — deletions (p.35)
Reference to delete-case rules restated (same as p.30 BST delete cases).
Starting tree: 17(10(1(nil,7)),29(20(nil,23),30)).
- **Löschen von 1:** node 1 has only a right child (7), no left child → **Fall 1** (case 1: no left/right child → replace by the other child). Result: 10's left child becomes 7 directly.
- **Löschen von 23:** 23 is a leaf (no children) → also **Fall 1** (special case where the left/right child is nil). Result: 20 loses its right child, becomes a leaf itself.
- **Löschen von 29:** 29 has two children (20, 30) but 20 has already lost its right child so 29's situation reduces similarly → marked "siehe Fall 1" (see case 1). Result final tree:
```
              17
           /       \
         10          30
           \        /
            7      20
```

### G4d) Lösungen — reconstruct from postorder (p.36)
Postorder: `7, 16, 10, 24, 21, 25, 19, 1`. "Bei der Postorder-Traversierung wissen wir, dass das letzte Element immer die root des jeweiligen Teilbaums beschreibt, daher lässt sich das leicht rekonstruieren." (In postorder, the LAST element is always the root of that subtree, allowing straightforward reconstruction.)
Recursive partition notation shown:
```
()‖(7,16,10,24,21,25,19)‖1
  nil                    (7,16,10)‖(24,21,25)‖19
                          (7)‖(16)‖10          (24,21)‖()‖25
                          ()‖()‖7  ()‖()‖16    ()‖(24)‖21    nil
                          nil nil  nil nil     nil ()‖()‖24
                                                    nil nil
```

### G4e) Lösungen — final reconstructed tree (p.37)
**Final tree from (d):**
```
              1
               \
                19
               /    \
             10       25
            /  \      /
           7   16    21
                       \
                        24
```

### G4e) Lösungen (1) — proof of statement, minimality analysis (p.38-40)
Prompt (orange, repeated): "Alle binären Suchbäume mit eindeutigen Werten und ohne Halbblätter lassen sich allein aus ihrer Inorder-Traversierung eindeutig rekonstruieren." Task: prove or find minimal counterexample.

**Approach:** "Minimalität beweisen: Idee: vom kleinsten Baum starten und versuchen Gegenbeispiele zu finden" (start from smallest tree size and try to find counterexamples).

Reference example tree pair used throughout: both trees share Inorder-Traversierung: **20, 25, 30, 50, 75**
- Tree A: root 50, left child 25 (children 20,30), right child 75.
- Tree B: root 25, left child 20, right child 50 (children 30, 75).

Step-by-step minimality argument:
- **0 nodes (empty tree):** unique/trivial, no counterexample possible.
- **1 node:** BST with single node is unique for a given key value; inorder trivially reconstructs it — no counterexample possible ("Der (binäre Such-)Baum mit einem einzigen Knoten ist für einen gegebenen Schlüsselwert eindeutig").
- **2 nodes:** "Bei jedem binären (Such-)Baum mit genau zwei Knoten ist die Wurzel ein Halbblatt." Since the statement explicitly excludes trees with half-leaves, no counterexample possible here either (marked with a red ✗).
- **3 nodes:** There are exactly 5 possible structures for binary trees with 3 nodes (shown as 5 small tree-shape diagrams). Exactly ONE of these (dark-highlighted) contains NO half-leaves — combined with the BST property and inorder traversal (a,b,c sorted, per G4b), this shape is forced uniquely: root=b, left child=a, right child=c. So no counterexample possible with 3 nodes either.
- **4 nodes:** "Es gibt insgesamt 14 verschiedene Strukturen für binäre Bäume mit (genau) vier Knoten. Bei 10 davon ist bereits die Wurzel ein Halbblatt." For the remaining 4 possibilities, one of the root's two children is a half-leaf (illustrated with 4 small diagrams, dark node = half-leaf) — so ALL 4-node trees without half-leaves are excluded, meaning still no counterexample.
- **5 nodes:** "Ein Gegenbeispiel mit fünf Knoten enthält somit die minimal mögliche Anzahl an Knoten." → **The minimal counterexample requires exactly 5 nodes** (the two trees A and B shown above, sharing inorder traversal 20,25,30,50,75 but differing in structure, disprove the statement).

# AUD Maxine 6_260529_142809.pdf

Source metadata: Slide deck "AUD | Übungsgruppe 2 | M.Konz", dated 05.06.2025, title "AUD Übungsgruppe 2". Content: Red-Black Trees (RBT) insert/delete recap, AVL trees recap, and exercises G2–G3, plus Hausübung (homework) hints. NOTE: page dates suggest file 6 (05.06.2025) actually predates file 5 (01.06.2025) and file 7 (09.06.2025) in wall-clock filename terms is inconsistent with content date — file 5's slide date (01.06.2025) is EARLIER than file 6's slide date (05.06.2025), which is earlier than file 7's (09.06.2025). So chronological content order by date is: File 5 (01.06) → File 6 (05.06) → File 7 (09.06), matching file numbering 5,6,7. Treating as given order 5→6→7 per task instructions.

## Wiederholung – RBT Operation Einfügen & co (RBT Insert recap) (p.2-12)

### insert (part 0): rotateLeft (p.3-4)

Diagram: node B (root of local subtree) with left child A and right child C; C has left child D and right child E.
**rotateLeft** transforms:
```
Before:        B                  After:         C
             /   \                              /   \
            A     C          →                 B     E
                 / \                           / \
                D   E                         A   D
```
Visual mnemonic included ("Bild von Jonas Bingel"): a pulley/hoist analogy — "LEFT" — showing B rotating down-left as C rises, with the mnemonic drawing of a hoist/pulley lifting an object, captioned with generic labels analogous to `parent(a) ≙ child(x,y)` type mapping.
Study note: "Wer wissen möchte, warum die Fälle zustande kommen, möge sich den Algorithmus in Ruhe durchlesen dazu. In der Klausur müsst ihr das anwenden können, daher hier die Fälle visuell aufgeschrieben." Attention checklist: "Was passiert mit B / Was passiert mit C / Was passiert mit Teilbaum D."

### insert (part 0): rotateRight (p.5-6)
Same tree B(A,C(D,E)) — mirror operation:
```
Before:        B                  After:         B  (unchanged root reference point)
             /   \                              
            B     E   [as drawn: C is old root, B is its left child with children A,D]
```
(Diagram shows C as top node with left child B(A,D) and right child E; rotateRight transforms this back toward B(A,C(D,E)) — i.e., rotateRight is the inverse of rotateLeft on the same 5-node configuration.) Same "LEFT"/pulley-style visual mnemonic reused, now labeled "RIGHT."

### insert (part 1) — insert(T,z) code (p.7)
Comment: `//z.left==z.right==nil;`
```
1  x=T.root; px=T.sent;
2  WHILE x != nil DO
3     px=x;
4     IF x.key > z.key THEN
5        x=x.left
6     ELSE
7        x=x.right;
8  z.parent=px;
9  IF px==T.sent THEN
10    T.root=z;
11 ELSE
12    IF px.key > z.key THEN
13       px.left=z;
14    ELSE
15       px.right=z;
16 z.color=red;              [NEW — highlighted in red/green as newly added vs BST insert]
17 fixColorsAfterInsertion(T,z);   [NEW]
```
Note: "px beschreibt immer den parent-Knoten des gerade betrachteten Knotens x" / "x ist dabei nicht der einzufügende Knoten, sondern der Knoten der gerade betrachtet wird beim Suchen der passenden Einfügestelle von z!" Complexity: `O(h)=O(log(n))`. Labeled "Wie im BST" (same as in BST) for lines 1-15, "suche passende Stelle" (search for the right spot) / "baue Verbindung auf" (build connection).
Worked example: `insert(9)` into tree with root 5, children 2 and 7: 9 > 5 → go right to 7; 9 > 7 → becomes 7's right child. Result: 5(2,7(nil,9)).

### insert (part 2): fixColorsAfterInsertion — overview and all cases (p.8-12)

**Important disclaimer (p.8, repeated on p.10-11):** "In der folgenden Darstellung beschreiben z oder y nicht den Wert des Knotens sondern den Pointer, der auf einen Knoten zeigt. Zur Übersichtlichkeit wurden die Pointer-Namen als 'Wert' in die Knoten geschrieben, was aber in Wirklichkeit nicht so ist." Illustrated: gray node with two red children, one red grandchild labeled "z" — shown as equal to same tree with z inside the node (visual simplification only).

**fixColorsAfterInsertion(T,z) full code (p.9, repeated with annotations p.10-12):**
```
1  WHILE z.parent.color==red DO
2     IF z.parent==z.parent.parent.left THEN
3        y=z.parent.parent.right;
4        IF y!=nil AND y.color==red THEN
5           z.parent.color=black;
6           y.color=black;
7           z.parent.parent.color=red;
8           z=z.parent.parent;
9        ELSE
10          IF z==z.parent.right THEN
11             z=z.parent;
12             rotateLeft(T,z);
13          z.parent.color=black;
14          z.parent.parent.color=red;
15          rotateRight(T,z.parent.parent);
16    ELSE
17       ... //exchange left and right
18 T.root.color=black;
```
Note: "A und B werden im Code nicht aufgeführt und werden nicht verwendet, sind aber auch zur Bennenung und Übersichtlichkeit eingeführt" (labels A/B appear only in diagrams for clarity, not in code).

**All 4 cases visualized (p.9, "fixColorsAfterInsertion – Alle Fälle"), organized by "Onkel rechts" (uncle on right) vs "Onkel links" (uncle on left), each split into "Onkel rot" (uncle red) vs "Onkel schwarz/nil" (uncle black/nil):**

1. **Onkel rechts, Onkel rot:** Färbung (recolor parent+uncle black, grandparent red) → z-pointer verschieben (move z pointer up to grandparent).
2. **Onkel rechts, Onkel schwarz/nil:** case where z==z.parent.parent (i.e., z is right child) → rotateLeft → then Färbung (recolor) → rotateRight.
3. **Onkel links, Onkel rot:** Färbung → z-pointer verschieben (mirror of case 1).
4. **Onkel links, Onkel schwarz/nil:** z-pointer verschieben → rotateRight → umfärben (recolor) → rotateLeft (mirror of case 2).

**Detailed explanation "Wenn parent linker Knoten ist" (p.10):** "Dann betrachten wir den rechten Onkel = y-Pointer. Wenn Onkel rot, dann färbe parent und onkel schwarz und grandparent rot → ab hier erneutes prüfen nötig, weil dadurch evtl. neue rot-rot-Regel verletzt [wird]." Clarifying diagram: `z.parent.parent.left = ... = linker parent, dh wir haben einen rechten Onkel` (z.parent.parent.left traversal shown means we have a left parent, i.e. a right uncle).

**Detailed explanation "Wenn parent rechter Knoten ist" (p.11):** Mirror case. "Dann betrachten wir den rechten Onkel = y-Pointer. Wenn Onkel schwarz: Wenn z auf der rechten Seite -> bringe auf die linke Seite. Färbe parent schwarz und grandparent rot. ausbalancieren -> rotateRight." Diagram: z=z.parent (rotateLeft) then rotateRight with färbung.

**Full "Onkel links" cases (p.12), boxed in orange** — mirrors Onkel-rechts cases exactly with left/right swapped: Onkel rot → Färbung → z-pointer verschieben; Onkel schwarz/nil → z-pointer verschieben → rotateRight → umfärben → rotateleft.

## Wiederholung – RBT Operation Löschen & co (RBT Delete recap) (p.13-18)

### Wichtige Infos/fürs Verständnis (legend for delete diagrams) (p.14)
- Dashed connector (`.......`) = "Verbindung kann/muss aber nicht existieren" (connection may or may not exist)
- Dotted (`...`) = "Evtl weitere Knoten dazwischen" (possibly further nodes in between)
- `∨` mark = "Eine der beiden Verb. existieren" (one of the two connections exists)
- Blue/green circle = "Farben können sowohl rot als auch schwarz sein → zum Darstellen wenn Farbe von anderem Knoten übernommen" (color can be either red or black — used to show when color is inherited from another node)
- White/empty circle = "Farbe irrelevant/egal" (color irrelevant)
- Filled black circle = "Entweder Knoten existiert, dann ist die Färbung schwarz, sonst existiert er nicht" (either the node exists and is colored black, or it doesn't exist)

### Delete cases: z has no children / z has 1 child (p.15)
Note: "Wenn z keine Kinder oder nur 1 hat, rufen wir einfach transplant auf. Beim Löschen eines schwarzen Knotens müssen wir uns außerdem speichern ob wir aus dem rechten oder linken Baum gelöscht haben/wo wir jetzt evtl. mehr schwarze Knoten haben. transplant ist gleich zum BST, nur dass wir statt der nil-Abfrage eine sentinel-Abfrage haben." (Link to a document "Hessenbox" mentioned, "Unter Nützliches" — QR code shown, presumably linking to an external reference doc; not transcribable, flagged as [UNCLEAR: external reference URL via QR code].)

Diagrammed sub-cases:
- **z = root**, z has no children (points to nil) → dsh (dashed-side-history?) = nil
- **z = leaf**, z.color=red → nil, dsh=nil
- **z has 1 child (Halbblatt)**: z.color=black; shows left/right child variants: dsh=right or dsh=left.
- **z hat 1 Kind, z hat linkes Kind:** transplant + übernehme Farbe von z; dsh=nil.
- **z hat 1 Kind, z hat rechtes Kind:** transplant + übernehme Farbe von z; dsh=nil.

("dsh" appears to be an abbreviation used by Maxine for tracking which side ("direction of shift/subtree history") the deletion occurred on, relevant for fixup — exact meaning [UNCLEAR: abbreviation "dsh" not spelled out in notes, likely shorthand for tracking left/right subtree of the fixup start point].)

### Delete case: z has 2 children (p.16-17)
"Wenn z 2 Kinder hat, wird die ganze Sache evtl unübersichtlicher: Das Vorgehen ist gleich zum BST: wir suchen uns im rechten Suchbaum den kleinsten Wert (linkester Knoten) = kleinster Wert der gerade noch größer ist als z."

Two sub-cases:
- **Rechter Teilbaum von z ist ein Blatt / hat nur rechte Kinder (wenIleft = false):** y found directly as z's right child (or right-only descendants); transplant + übernehme Farbe von z. Shows y.color=red vs y.color=black branches with dsh=nil vs dsh=left.
- **y ist nicht das erste Kind im rechten Teilbaum:** deeper case, requires two transplant calls — first `transplant(y,y.right)`, then `transplant(z,y)` — with recursive-looking diagram showing y walking down the leftmost chain of z's right subtree.

Further nested diagrams (p.17) elaborate the "rechter Teilbaum hat linke Kinder" case, with recursive transplant(y,y.right) chains shown at multiple depths, converging into two final outcomes (dsh=right, dsh=nil).

### Full RBT fixColorsAfterDeletion — all cases summary chart (p.18)
Legend box restates dashed/dotted/color conventions. Large all-cases flowchart split into "dsh=right" (left column) and "dsh=left" (right column), five row-tiers going from top (`a.color=rot`, simple case, single arrow, no rotation) down through increasingly complex tiers involving: umfärben (recolor), rotateLeft/rotateRight, recursive calls to `fixupAfterDeletion(T,a,dsh=...)`. Bottom two tiers explicitly show rotateLeft/rotateRight combined with umfärben as final resolving steps.
Note (left margin): "Jeden einzelnen Fall zu beschreiben, übersteigt die Kapazität der Übung, daher meine Empfehlung: versuchen damit zu arbeiten." (Explaining every single case exceeds the exercise's scope — recommendation: just work with the diagram directly.) [UNCLEAR: fine print inside the flowchart boxes on this page is too small/dense to transcribe reliably beyond the row-tier structure and general labels described above.]

## G2 - RBT Insert & Delete (exercise) (p.19-23)

### G2a) Einfügen (Insert) — task (p.20)
Given RBT: root 5 (black), children 3 (black) and 10 (black); 3's children 2 (red), 4 (red); 10's child 11 (red).
Task: Insert nodes with keys 8, 7, 6, 9 in order. Draw intermediate result after each insertion, after each while-loop iteration in FixColorsAfterInsertion, and after any final root recoloring.

### G2a) Einfügen-Lösung — full trace (p.21)
```
(a) Start:  5(B){3(B){2(R),4(R)}, 10(B){nil,11(R)}}

insert(7):
(b) 7 attached as left child of 8... 
    [tree becomes: 5(B){3(B){2,4}, 10(B){8(R){7(R),nil},11(R)}}]
    → Fall Onkel rechts & rot = Färben
(c) recolor: 10 and 8's sibling become black, root region adjusts:
    5(B){3(B){2,4}, 10(B){8(B){7(R)},11(B)}}

insert(6):
(d) 6 attached under 7 (left child)... 
    → Fall Onkel rechts & schwarz/nil = rotateRight um 8 & färben
(e) rotation applied: 7 becomes local subroot with children 6(R),8(R)

insert(9):
(f) 9 attached as right child of 8
    → Fall Onkel links & rot = Färben
    
Final structure (g): rotateRight(10), Färben, rotateLeft(5)
Result:                7(B)
                    /        \
                 5(B)          10(B)
                /    \        /    \
              3(R)   6(R)   8(R)   11(R)
             /  \                    
           2(?) 4(?)      9(R) attached under 8
```
[Note: exact final colors of nodes 2, 4, 9 in the very final tree are not fully legible in the last panel; transcribed structure is confident, precise final color assignments for leaf-level red/black on 2,4,9 flagged as [UNCLEAR: exact final color labels on outer leaves in panel (g)].]

### G2b) Löschen (Delete) — task (p.22)
Given RBT: root 7(B), children 5(R) and 10(R); 5's children 3(B, with red children 2,4) and 6(B); 10's children 8(B, red child 9) and 11(B).
Task: delete nodes 5, 7, 3 in order; draw intermediate result after each deletion and after each fixup iteration.

### G2b) Löschen-Lösung — full trace (p.23)
**Delete 5** — "Fall: 2 Kinder, rechter Teilbaum = Blatt." transplant + färbe (color); y=a=6 inherits position. dsh=left. fixColorsAfterDeletion → letzter Fall (last/simple case). Result: root 7(B) with children 3(R){2,4} and 10(B){8(R){9},11(B)}... (6 absorbed into 3's old position as sibling — tree restructured with 3 and 6 now both under root 7's left branch, shown as 7(B){3(R){2,6},10(B){8(R){9},11(B)}} approximately — [UNCLEAR: precise final arrangement of nodes 2,4,6 after this step, diagram is dense]).

**Delete 7 (root)** — "Fall: 2 Kinder, y ist das erste Kind im rechten Teilbaum" — y=8 found (marked with arrow), a=10. transplant executed; dsh=right. Result after fixup ("1. Fall" applied): new root becomes 8(B), with 3(R){2,6} on left... 9,10(R),11 rearranged on right — final shown tree: root 8, left subtree 3(2,6), right subtree 10(9,11).

**Delete 3** — "Fall: 2 Kinder, y ist das 1. Kind im rechten Teilbaum" — y=4, a=6 (from within left subtree of new root 8). transplant; dsh=nil → "kein fixColor..." (no fixup color pass needed since dsh=nil). Final resulting tree structure shown with 4 and 6 as children of 8's left branch.

[Overall note: p.23's handwriting/diagram density is high; node-level color labels in the very final trees of each sub-step are the least certain part of this transcription — flagged as [UNCLEAR: fine-grained red/black color assignments in final trees of G2b steps 2 and 3].]

## Wiederholung aka Beibringen – AVL-Bäume (AVL Trees) (p.24-27)

### Was sind AVL-Bäume? Steckbrief (Profile) (p.25)
- **Name:** Georgi Maximowitsch **A**delson-**V**elski und Jewgeni Michailowitsch **L**andis (origin of "AVL").
- **Warum gibt es die?** "Wir versuchen den Höhenunterschied zwischen den Teilbäumen (Balance) in dem RBT noch mehr zu optimieren, wodurch die Suche optimiert wird." (AVL trees further optimize the height-difference/balance between subtrees compared to RBT, improving search.)
- **Definition (boxed):** "Ein AVL-Baum ist ein binärer Suchbaum, sodass für die Balance B(x) in jedem Knoten gilt: B(x) = {-1, 0, +1}. Für leere Bäume gilt: H(x) = -1."
- **Anwendungsbereich:** Systems where mostly **reading** happens (=search), rather than writing (=insert/delete). Reasoning: "Dadurch dass der Baum immer ausbalanciert ist, muss dieser bei jeder Einfüge/Lösch-Operation immer wieder rebalanciert werden."
- **Height bound:** `h ≤ 1.441 · log₂(n)`, compared to RBT's `h ≤ 2 · log₂(n+1)`.
- Example tree shown: root 23, children 17 and 24; 17's children 9 and 25 [as drawn: 9 under 17, 25 under 24 — actually labeled 9 (left of 17) and 25 (right of 24)].

### Anwendung – AVL Bäume - Balance (p.26)
"Wir berechnen die Balance B(x) für jeden Teilbaum – man kann aber auch von selber erkennen, wenn Teilbäume unausgeglichen (2 (oder mehr) Knoten mehr als der andere Teilbaum)." Formula: `B(x) = Höhe(RTB) − Höhe(LTB)` where RTB = rechter Teilbaum (right subtree), LTB = linker Teilbaum (left subtree) of x.
**Important note:** "Das hier ist nicht rekursiv! Hier nutzen wir die Höhe der Teilbäume nicht die Balance." (This formula is NOT recursive — uses subtree HEIGHT, not balance.)

Worked examples:
- Node 9 (leaf, both children nil): H(x)=-1 both sides → B(x) = (-1)-(-1) = 0.
- Node 25 (leaf): same, B(x) = -1 - -1 = 0 (shown twice, presumably two separate leaf examples labeled 9 and 25).
- Node 17 with right child 9 (leaf) [left child nil]: "linkslastig/left heavy" — B(x) = (-1)-(0) = -1; H(x) of 17's subtree = 0.
- Node 24 with left child... : "rechtslastig/right heavy" — B(x) = 0-(-1) = 1; H(x)=0.
- Node 23 (root) with children 17 (balance -1, H=1... shown as "-1" and "0" labels) and 24 (balance labeled "1", H(x)=1): root itself computed as "balanciert/balanced" B(x) = 1-1 = 0.

### Anwendung – AVL Bäume – Einfügen/Löschen (Insert/Delete) (p.27)
"Einfügen: Äquivalent zum Einfügen in einen BST, nur mit Rebalancierung." fixBalaceAfterInsertion(T,x) [sic — "Balace", likely a spelling slip for "Balance"] has 4 cases (no pseudocode exists for it per the notes — "code dazu gibt es nicht"). Deletion: "Suche-Lösche-fixBalace" as shown below (referencing same 4-case diagram, reused for both insert and delete fixup).

insert(T,z) code shown again (same BST-style insert as RBT used, ending in `fixBalanceAfterInsertion(T,z);` instead of the RBT color-fix call).

**AVL rebalancing — 4 cases diagram ("AVL-FÄLLE rebalancieren"):**
- **Fall 1:** node x has balance +1 (right-heavy), y=right child... shown: rotateLeft(T,x) applied, transforming x(A,y(B,z(C,D))) type structure — new node marked "← neu" (newly inserted) deep in the D subtree.
- **Fall 2:** mirror-ish, rotateRight(T,y) — noted "(Fall 4)" cross-reference, i.e. structurally symmetric to Fall 4.
- **Fall 3:** balance -2, rotateRight(T,x) applied on a left-left heavy configuration: x(y(z,...),A) with new node deep under z.
- **Fall 4:** balance -2, different sub-structure — rotateRight(T,x) — noted "(Fall 3)" cross reference implying near-identical resolution differing in which grandchild subtree absorbs new node.

Explanation box: "Neuer Knoten (hier in blau) kann auch ...z selber sein (dann ist A nil, sonst gibt es keine Inbalance) ...im Teilbaum C oder D vorkommen." (The newly inserted node, shown in blue in the diagrams, could be z itself, or appear within subtree C or D.)

## G3 - AVL Insert & Delete (exercise) (p.28-32)

### G2 AVL-Bäume — task (a) insert (p.29)
[Note: exercise is labeled "G2" on this slide despite being under the "G3" section header slide — likely a numbering carry-over/typo in the original deck.]
Given AVL tree: root 30, children 12 and 42; 12's children 7 and 22; 42's children 37 and 55.
Task: Insert nodes 3, 34, 31, 40, 5, 32, 4, 41 in order using the lecture's AVL insert algorithm. Draw intermediate result after each insertion and after every rotation/double-rotation.

### G2 AVL-Bäume — full insertion trace / solution (p.30)
```
Start:  30(12(7,22), 42(37,55))

insert(3):  3 attached as left child of 7. No rebalancing.
insert(34): 34 attached as left child of 37. No rebalancing.
insert(31): 31 attached under 34 (left child). Imbalance detected at 42's subtree
            (balance calc shown: "-1-1=-2" then "-1"? annotated in red near node 37/34).
            → rebalance triggered.
rebalance:  Result: 30(12(7(3),22), 42(34(31,37),55))  [37 and 34 rotated]

insert(40): 40 attached as right child of 37. Balance check on 55's position: "0-2=-2"
            (imbalance flagged red at node 42's right subtree area, involving 55).
rebalance:  Result: 30(12(7(3),22), 37(34(31,nil),42(40,55)))

insert(5):  5 attached under 3 (right child). Imbalance flagged at node 7/12: "-1-1=-2" red.
rebalance:  Result: 30(12(5(3,7),22), 37(34(31),42(40,55)))
            [5 becomes new subroot of that corner with 3 and 7 as children]

insert(32): 32 attached under 31 (right child). Imbalance flagged near 34: "-1-1+2=-1"? [UNCLEAR: exact arithmetic annotation, red digits partly overlapping]
rebalance:  Result: 30(12(5(3,7),22), 37(31(nil,32... ), 42(40,55)))

insert(4):  4 attached under 5 (left child, i.e. under 3's position). Imbalance flagged at 12: "0-2=-2" red.
rebalance:  Result: 30(5(3(nil,4),7... ), 37(31(32),42(40,55)))
            [5 promoted; restructure around 12/22]

insert(41): 41 attached under 40 (right child). No rebalancing needed.
```
**Final tree (approximate, per final panel):**
```
                    30
                 /       \
               5            37
             /   \        /     \
            3     12      32      42
           / \   /  \        \    /  \
          -  4  7   22        31... 40  55
                                      \
                                       41
```
[UNCLEAR: The exact final shape in the bottom-right panel of p.30 is dense with small labels; node 22 and node 7's exact final parent, and the precise position of node 31 relative to 32, could not be fully confirmed pixel-for-pixel. High confidence on the insertion SEQUENCE and general rebalancing pattern (each insert triggers at most one rotation/double-rotation as per AVL rules); lower confidence on exact final tree drawing. Recommend re-deriving the final tree from the AVL rules + insertion sequence if a precise diagram is needed for a visualizer.]

### G2 - AVL-Bäume — task (b) delete (p.31)
Given resulting AVL tree from (a):
```
                    30
                 /       \
               5            37
             /   \        /     \
            3     12      32      42
             \   /  \             /  \
              4 7   22           40    55
                                    \
                                     41
```
Task: delete nodes 4, 3, 7 in order using the lecture's AVL delete algorithm; draw intermediate result after each deletion and after each rotation/double-rotation.

### G2 - AVL-Bäume-Lösung — delete trace (p.32)
```
delete(4): 4 removed (leaf). No rebalancing needed.
           Result: 30(5(3,12(7,22)), 37(32,42(40(nil,41),55)))

delete(3): 3 removed → imbalance at 5: annotation "1-(-1)=2" red, rotate.
rebalance: 5 rotated; result: 30(12(7,22), 37(32,42(40(41),55)))
           [5 removed from tree structure, 12 takes its place as left child of 30]

delete(7): 7 removed → imbalance at 30 flagged: "3-1=2" red, rotate at root level.
rebalance: Final tree:
                    37
                 /       \
               30           42
             /    \        /   \
           12       32    40     55
             \                \
              22                41
```

## G3 Verhältnis von binären Suchbäumen, Rot-Schwarz-Bäumen und AVL-Bäumen (Set relationships) (p.33-34)

### Task (p.33)
Let RB = set of all trees that are red-black colorable, BST = set of all binary search trees, AVL = set of all AVL trees. "Stellen Sie durch Angabe von Mengeninklusionen (=, ⊂, ⊆, ⊄) dar, wie diese Mengen zueinander in Beziehung stehen. Begründen Sie Ihre Antwort und geben Sie zusätzlich für alle Mengen, die ungleich sind, jeweils ein trennendes Beispiel an."

### Solution (p.34)
**Result: AVL ⊂ RB ⊂ BST**
In natural language:
- Every AVL tree is red-black colorable.
- Every red-black colorable tree is a binary search tree.
- Every AVL tree is a binary search tree (by transitivity).

**Gegenbeispiel für BST ⊄ RB (counterexample: BST that is not RB):**
Tree: root 19, single child 37 (right), 37 has children 23 and 41.
"Dieser erfüllt die Suchbaumeigenschaft, da 23 ≤ 37 ≤ 41 sowie ∀x ∈ {23,37,47}: 19 ≤ x gilt." [Note: "47" here appears to be a typo in the original for "41", given the tree only has nodes 19,37,23,41 — flagged as [UNCLEAR: possible typo "47" vs "41" in original notes].] "Allerdings ist der Baum nicht rot-schwarz-färbbar: Die Wurzel 19 muss nach der Definition von Rot-Schwarz-Bäumen schwarz gefärbt werden. Da diese ein Halbblatt (Knoten mit einem Kind) ist, muss ihre Schwarzhöhe 1 (nach Regel 4) sein, also dürfen ihre Nachkommen keinen schwarzen Knoten mehr enthalten. Dies impliziert jedoch, dass alle restlichen Knoten 23, 37 und 41 rot gefärbt werden müssen, was der Nicht-Rot-Rot-Regel widerspricht."

**Gegenbeispiel für RB ⊄ AVL (counterexample: RB-colorable tree that is not AVL):**
Tree: root 23 (black), left child 17 (black, leaf), right child 41 (red); 41's children 29 (black) and 67 (black); 67 has right child 83 (red).
"Dieser Baum weist eine korrekte Rot-Schwarz-Färbung auf, ist allerdings kein AVL-Baum: Der linke Teilbaum der Wurzel besteht aus einem einzigen Knoten, hat also (für sich allein betrachtet) die Höhe 0. Der rechte Teilbaum der Wurzel hat (für sich allein betrachtet) die Höhe 2. Damit ergibt sich für die Balance der Wurzel: B(Knoten mit Schlüssel 23) = Höhe(RTB) − Höhe(LTB) = 2 − 0 = 2, was die Bedingung für AVL-Bäume verletzt."

## Hausübung (Homework) hints (p.35-37)

### Hinweise zur Hausübung – H1 (p.36)
- (a) Queue representation (cyclic or linear) is irrelevant here — queue capacity 5, max 5 enqueue operations, so the usual "what happens on overflow" problem for cyclic queues won't arise.
- (b) Direction the stack grows in is irrelevant.
- (c) **Important clarification quoted from assignment text:** "[...] Diese sollen seperat voneinander in einem Array der Größe n ∈ N implementiert werden. Das bedeutet, dass der Stack nicht auf die Elemente der Queue und die Queue auch nicht auf die Elemente des Stacks zugreift. Keiner der Strukturen soll überlaufen, solange die Gesamtanzahl der Elemente höchstens n beträgt!" Guidance: pay attention to method names like `enqueueAndBalance` — ask why the queue needs balancing, how balancing could be implemented; note that helper methods like `length` are not simply usable off-the-shelf — must write them yourself as pseudocode, following how enqueue etc. were implemented in the lecture (VL).

### Hinweise zur Hausübung – H2 (p.37)
- (a) Only need to state ONCE, at the very end after all insertions, whether the resulting BST is a valid RBT (i.e., red-black colorable, without any recoloring).
- (b) Noted typo in assignment: after the described operation, perform `rotateRight(T', y)` on the resulting new search tree T', and redetermine the depths of the three nodes — otherwise there's no error here (yes, the operation IS executed twice on y, intentionally).
- (c) — (no content / placeholder, "---")
- (d) "paarweise verschiedene Werte" means all values in the tree are unique (no two nodes share a value). "Nächstgrößerer Wert/nächstkleinerer Wert" refers to the set of natural numbers → e.g., nächstkleinerer Wert (next-smaller value) of 5 is 4, nächstgrößerer Wert (next-larger value) of 5 is 6.
- (e) "möglichst balanciert" (as balanced as possible) is intentionally open/loosely defined — no proof of exact optimal balance is expected. Pay attention to the problem statement — why does it mention an UNSORTED array?

# AUD Maxine 7_260603_153747.pdf

Source metadata: Slide deck "AUD | Übungsgruppe 2 | M.Konz", dated 09.06.2025, title "AUD Übungsgruppe 2". Content: String-Matching (naive algorithm + Rabin-Karp), then Heaps/HeapSort (G4), then Splay Trees (G5).

## String-Matching (p.2-20)

### String-Matching - Grundlagen (Fundamentals) (p.3)
Note box: "Allgemein gilt: String-Matching ist klausurrelevant, auch wenn es nur in der Übung dran kommt." (String-matching IS exam-relevant even though it's only covered in the exercise session.)

- String-Matching describes the problem/functionality of finding a **Textmuster** (text pattern) again within a given text, and determining the indices of the shifts ("Verschiebungen").
- Implementation uses **Arrays**, where each letter/character occupies one array field.
- **Alphabet**: the set of usable letters/characters used to build strings, symbol **Σ**.
- **Wörter (Words)**: the character strings built from the alphabet, symbol **ω**.
  - Example: *hallo* is a word in alphabet Σ = {a,b,c,...}; written *hallo ∈ Σ\**.
  - Example: *tlö:@fi* is a word in alphabet Σ = {a,b,c,...,@,/,:,...}
- **T** describes the text being searched, `|T| = n`.
- **P** describes the pattern text, `|P| = m`.
- Constraint: P must not be longer than T, i.e., `m ≤ n` (otherwise no match possible).
- Example array: T = K,U,C,K,U,C,K (7 letters); P = U,C,K (3 letters).

### String-Matching - Beispiel (Example) (p.4)
- We search for a shift ("Verschiebung"/shift) `sft` such that pattern P is found within T at that offset.
- **sft** (abbreviation for "shift") points to the start of the pattern match.
- Formal condition: `T[sft, ..., (sft+m-1)] = P`, equivalently `T[sft+j] = P[j] ∀j ∈ [0,...,m-1], j ∈ ℕ`.
  ("Warum m−1? Das brauchen wir, weil wir hier über die Indizes innerhalb des Arrays reden" — because we're talking about array indices.)
- We search for **ALL** valid shifts. In the example (T=KUCKUCK, P=UCK), valid shifts are **sft = {1, 4}**.
- Diagram illustrates sft=1 (matches "U" at index 1) and sft+2=... pointing to second occurrence at index 4 ("U" again), both correctly aligning P=UCK against T.

### Naives String-Matching (Naive String Matching) (p.5-15)

Note box: "sft pointer für gefundenen Anfang des Textmusters / T Text in dem das Textmuster gesucht werden soll / P Textmuster" (definitions recap).

**Idea:** "Probiere alle möglichen Werte für sft auf T aus und überprüfe, ob T[sft,...,(sft+m-1)] = P gilt."
Video reference: https://www.youtube.com/watch?v=yFHV7weZ_as (recommended to watch "bis 1:15 ca" for good visualization).

**NaiveStringMatching(T,P):**
```
11:  n = length(T)
12:  m = length(P)
13:  L = []
14:  for sft = 0 to n-m do
15:      isValid = true
16:      for j = 0 to m-1 do
17:          if P[j] ≠ T[sft+j] then
18:              isValid = false
19:      if isValid then
20:          L = append(L, sft)
21:  return L
```
Annotation: "Probiere alle möglichen Verschiebungen im Array T aus" (line 14); "Sobald das erste Zeichen nicht passt sft ist nicht mehr valide" (line 17-18 — as soon as the first char mismatches, sft is no longer valid — though note the algorithm as written continues checking rest of j-loop; this is likely just an informal comment, not literal early-exit).

**Full worked trace on T = K,U,C,K,U,C,K and P = U,C,K (p.6-13):**
- **sft=0, j=0:** P[0]=U vs T[0]=K → **U=K? Nein.** isValid=false. L=[] (this pass fails, loop continues but result won't be added).
- **sft=1, j=0:** P[0]=U vs T[1]=U → **U=U? Ja.** isValid=true (so far).
- **sft=1, j=1:** P[1]=C vs T[2]=C → **C=C? Ja.** isValid=true.
- **sft=1, j=2:** P[2]=K vs T[3]=K → **K=K? Ja.** isValid=true. → Match! L=[1].
- (implied sft=2,3 continue and fail — page 12 shows "..." placeholder, confirming no match, L stays [1])
- **sft=5 (page 13):** "Abbruch" (abort) noted: "Letzte Iteration war wenn sft bei Index 4 angekommen ist (7-3=4). Weitere Iterationen machen keinen Sinn weil wir ja den String UCK von Länge 3 matchen wollen, wenn wir aber nur noch 2 Zeichen übrig haben (haben wir so oder so keinen Match)."
- **Final result: L = [1, 4]** (matches the example on p.4).

### Naives String-Matching – Korrektheit (Correctness), from the official solutions (p.14)
"Wir beginnen mit dem Korrektheitsbeweis von NaiveStringMatching, und definieren dazu eine geeignete Schleifeninvariante."

Observation: for every `0 ≤ sft ≤ n-m`, the bit `isValid` after line 18 equals true exactly when `T[sft,...,sft+m-1] = P`. The for-loop (lines 16-18) walks all entries of P checking `T[sft+j] = P[j]` symbol by symbol; once this fails, isValid=false and the shift sft is recognized as invalid.

**Loop invariant** for the outer for-loop (lines 14-20): "Vor dem sft-ten Durchlauf der for-Schleife enthält das Array L alle gültigen Verschiebungen t mit t < sft."

- **Initialization:** No valid shifts t < sft=0 exist, and indeed L is empty before the first loop iteration (sft=0). Invariant holds initially.
- **Maintenance:** Assuming the invariant holds before the sft-th iteration (L contains all valid shifts t < sft). During the sft-th iteration, it's checked whether T[sft,...,sft+m-1] = P (lines 16-18); if so, sft is a valid shift and gets appended to L (lines 19-20), otherwise not. Before the (sft+1)-th iteration, L thus contains all valid shifts t ≤ sft, i.e., t < sft+1 — maintenance holds.
- **Termination:** The for-loop exits before the (sft=n-m+1)-th run. Substituting n-m+1 into the invariant: L contains (before the would-be (n-m+1)-th iteration, which never runs) all valid shifts t with t < n-m+1. Since no larger valid shifts can exist, NaiveStringMatching correctly solves the String-Matching problem.

### Naives String-Matching - Laufzeit (Runtime) (p.15)
"Alle Operationen können in konstanter Laufzeit durchgeführt werden, weshalb wir nur die Anzahl der Schleifendurchläufe zählen müssen." Outer for-loop (lines 14-20) runs **(n-m+1)** times; inner for-loop (lines 16-18) runs **m** times per outer iteration.
**Runtime: O((n-m+1)·m)**

### Naives String-Matching – Exercise part c) worked example (p.16)
Given: T = [h,e,h,e,h,h,h,e,y,h], P = [h,e,h]. Use naive string-matching to find all occurrences.
**Solution:** n=10, m=3. Result: **L = [0, 2]**, since T[0,...,2] = T[2,...,4] = P, and no other indices satisfy this property.

Full trace table shown:
| sft | T[sft,...,sft+m-1] = P ? | L |
|---|---|---|
| 0 | true | [0] |
| 1 | false | [0] |
| 2 | true | [0,2] |
| 3 | false | [0,2] |
| 4 | false | [0,2] |
| 5 | false | [0,2] |
| 6 | false | [0,2] |
| 7 | false | [0,2] |

### Rabin Karp Algorithm (p.17-20)

**Video reference (p.17):** https://youtu.be/yFHV7weZ_as?feature=shared&t=75 — "Ab 1:15 fängt Rabin Karp an. Einmal durchschauen, grob verstehen was passiert."

Concept: "Wir benutzen hier also eine Art Funktion (= Hash-Funktion, das kommt in den nächsten Wochen nochmal ausführlicher), um den zu prüfenden Teil des Arrays T in einen Zahlenwert umzuwandeln. Anschließend vergleichen wir den Zahlenwert des Teilarrays mit dem Zahlenwert des Textmusters. Wenn diese nicht gleich sind, kann dementsprechend kein Match entstanden sein."

- **Hash-Formula** = `t_sft`
- **Hash-Update-Formula** = `t_(sft+1)`
- "Man benötigt die erstere Funktion nur um den ersten Value zu bestimmen. Die 2. Update Formel ist wichtig, um aus dem vorhergegangenen Wert in konstanter Zeit den nächsten Wert zu berechnen."

Formulas (from textbook excerpt (b)):
```
t_sft   = T[sft]·10^(m-1) + T[sft+1]·10^(m-2) + ... + T[sft+m-1]
t_(sft+1) =              T[sft+1]·10^(m-1) + ... + T[sft+m-1]·10 + T[sft+m]
```
"Man erkennt daraus (hoffentlich) leicht, dass beinahe alle Koeffizienten von t_sft und t_(sft+1) übereinstimmen. Lediglich ihre Zehnerpotenzen unterscheiden sich um 1. Wir können also schreiben:"
```
t_(sft+1) - 10·t_sft = -T[sft]·10^m + T[sft+m]
t_(sft+1) = 10·(t_sft - 10^(m-1)·T[sft]) + T[sft+m]
```
"Dieser Ansatz ermöglicht es, t_(sft+1) aus t_sft in konstanter Zeit zu berechnen: Wenn wir die Konstante 10^(m-1) vorberechnen, dann benötigt jede Ausführung dieser Gleichung eine konstante Anzahl arithmetischer Operationen."

Example diagram: array A,C,C,B,C,C,C,B,G,H,C,C,B,J (indices 0-13); a 3-letter window "C,C,B" highlighted with "Hash: 86" for the pattern p, vs "Hash: 12" for `t_sft` shown at a different window position (illustrating that mismatched hash values mean no match at that position).

### Rabin Karp Algorithm a) — Compute(P) (p.18)
"Wir zeigen hier, wie man p in Zeit Θ(m) berechnen kann. Der Vorgang für t₀ ist äquivalent." Given pattern array P=P[0,...,m-1]:
```
p = P[0]·10^(m-1) + P[1]·10^(m-2) + ... + P[m-2]·10 + P[m-1]
  = (...(P[0]·10 + P[1])·10 + ... + P[m-2])·10 + P[m-1]
```
**Compute(P):**
```
1:  m = length(P)
2:  p = 0
3:  for i = 0 to m-1 do
4:      p = 10·p + P[i]
5:  return p
```
"Wir nehmen nun an, dass die Berechnung in Zeile 4 in konstanter Zeit durchgeführt werden kann. Weiter beobachten wir, dass die Schleife genau m-mal durchlaufen wird. Dies liefert uns eine obere Schranke für die Laufzeit von O(m). Andererseits muss man das Array P zumindest einmal vollständig lesen, um p berechnen zu können. Damit ist die Laufzeit auch nach unten beschränkt durch Ω(m)." → **Θ(m)**.

### Rabin Karp Algorithm c) — RabinKarpMatchBasic(T,P) (p.19)
"Wir berechnen zuerst die Zahlen p und t₀ wie in Aufgabenteil G3(a) (Zeilen 4-6), und vergleichen dann die Werte p und t_sft für 0 ≤ sft ≤ n-m (Zeilen 7-9). Wenn p = t_sft für ein gewisses 0 ≤ sft ≤ n-m, dann muss P = T[sft,...,sft+m-1] gelten (wir haben also eine gültige Verschiebung), und der Index sft wird der Liste L hinzugefügt. Neue Werte t_(sft+1) werden aus den Vorgängerwerten t_sft wie in Aufgabenteil G3(b) berechnet (Zeile 11). Damit dies auch in konstanter Zeit geschehen kann, wird die Potenz 10^(m-1) nur einmal berechnet und gespeichert (Zeile 2)."

```
RabinKarpMatchBasic(T,P):
1:   n = T.length,  m = P.length
2:   h = 10^(m-1)
3:   p = 0,  t0 = 0,  L = []
4:   for i = 0 to m-1 do
5:      p = (10p + P[i])
6:      t0 = (10t0 + T[i])
7:   for sft = 0 to n-m do
8:      if p == t_sft then
9:          L = append(L, sft)
10:  if sft < n-m then
11:      t_(sft+1) = 10(t_sft - T[sft]·h) + T[sft+m]
12:  return L
```
Row labels: lines 4-6 = "Berechne initiale 'Hash'-Werte"; lines 8-9 = "Vergleiche Hash-Wert des Musters mit Hash von gerade betrachtetem Teilarray"; lines 10-11 = "Berechne Hash-Wert von nächstem Teilarray."

### Rabin Karp Algorithm d) — full RabinKarpMatch with modulus q (p.20)
"Wir haben bisher in unserer Vorgehensweise ein kleines Problem ignoriert: Mit zunehmender Länge des Suchmusters können die Zahlen p und t_sft sehr groß werden. Es könnte unter Umständen nicht angemessen sein, wenn wir voraussetzen, dass jede arithmetische Operation auf dem Wert p nur 'konstante Zeit' benötigt."

**Fix:** "Sei q eine Primzahl, sodass 10q in ein Computerwort passt. Der Trick ist nun, die Werte p und t_sft einfach modulo q zu berechnen und zu vergleichen; damit werden die betrachteten Zahlen um einiges kleiner."

**Caveat:** "Man beachte allerdings, dass diese Lösung nicht perfekt ist: Aus t_sft ≡ p (mod q) folgt nicht t_sft = p. Auf der anderen Seite gilt mit Sicherheit t_sft ≠ p wenn t_sft ≢ p (mod q). Man kann die Kongruenz t_sft ≡ p (mod q) also als einen schnellen Test verwenden, um ungültige Verschiebungen auszuschließen. Wenn allerdings t_sft ≡ p (mod q) für eine Verschiebung sft gilt, muss nochmal explizit nachgeprüft werden, ob T[sft,...,sft+m-1] = P[0,...,m-1], also ob sft auch eine gültige Verschiebung ist, oder ob ein unechter Treffer vorliegt." (This is a classic false-positive-check due to hash collisions.)

**RabinKarpMatch(T,P,q):**
```
1:   n = T.length,  m = P.length
2:   h = 10^(m-1)  (mod q)
3:   p = 0,  t0 = 0,  L = []
4:   for i = 0 to m-1 do
5:      p = (10p + P[i])  (mod q)
6:      t0 = (10t0 + T[i])  (mod q)
7:   for sft = 0 to n-m do
8:      if p == t_sft then
9:          b = true
10:         for j = 0 to m-1 do
11:             if P[j] ≠ T[sft+j] then
12:                 b = false
13:                 break
14:         if b then
15:             L = append(L, sft)
16:     if sft < n-m then
17:         t_(sft+1) = (10(t_sft - T[sft]·h) + T[sft+m])  (mod q)
18:  return L
```
Note on lines 9-14: "Extra Check, ob wirklich gleich" (extra check to confirm a REAL match, guarding against hash collisions/false positives).

## G4 — Heaps / HeapSort (exercise) (p.21-28)

### G4a) — Identify which trees/arrays satisfy the Heap property (p.21)
Four candidates shown:
- (i) Array: `[11, 4, 23, 2, 6, 17, 37, 1, 3, 5, 7, 13, 19, 28, 42]`
- (ii) Array: `[42, 37, 28, 13, 19, 23, 17, 11, 1, 2, 3, 4, 5, 6, 7]`
- (iii) Tree: root 42, children 13 and 37; 13's children 4,6; 37's children 23,28; 4→(1,2); 6→(3,5); 23→(17,19); 28→(7,11).
- (iv) Tree: root 42, children 13(4(1,2),6(3,5)) and 37(23(17,19)); NOTE: this tree is drawn with an incomplete/unbalanced last level — 37 only has one child slot filled with 23, and it appears the vorletzte Ebene (second-to-last level) isn't fully filled while a level below it exists.
- (v) Tree: root 42, children 17(13(1,2),19(3,4)) and 28(23(5,6),37(7,11)).

### G4a Lösung — Solutions (p.22)
- **(i)** Does NOT satisfy heap property. "Beispielsweise ist die Wurzel nicht der Eintrag mit dem maximalen Wert. Wenn man das Array genauer betrachtet erkennt man, dass es einen binären Suchbaum darstellt. Diese erfüllen nie die Heap-Eigenschaft, wenn sie mehr als 2 Knoten enthalten."
- **(ii)** DOES satisfy heap property, "da alle Knoten einen kleineren Schlüssel als ihr Elternknoten haben. Dies erkennt man am besten, wenn das Array als Baum darstellt" — reconstructed as tree: root 42, children 37 and 28; 37's children 13,19; 28's children 23,17; then 13→(11,1), 19→(2,3), 23→(4,5), 17→(6,7). Confirmed valid (max-heap).
- **(iii)** DOES satisfy the heap property — "da wieder alle Knoten einen geringeren Wert als ihr Elternknoten haben."
- **(iv)-equivalent tree shown** (root 42, children 13,37; 13→(4,6); 37→23 only, no second child; 4→(1,2); 6→(3,5); 23→(17,19)): does NOT satisfy heap property, "weil die vorletzte Ebene nicht vollständig gefüllt ist, es aber eine weitere Ebene weiter unten gibt."
- **(v)** does NOT satisfy heap property. "Es steht die 17 über der 19 (Knoten 1 und 4) und die 28 über der 37 (Knoten 2 und 6)" — i.e., child value exceeds parent value, violating max-heap property.

### G4b) — Alternative Insert via append+BuildHeap: what's the downside? (p.23-24)
Task: "Um einen Schlüssel in ein Heap einzufügen könnte man, anstelle von Insert(H,k), auch zuerst append(H,k) und danach BuildHeap(H.A) aufrufen, wobei append(H,k) die Größe des Arrays inkrementiert und den neuen Eintrag an die letzte Position des Arrays einfügt. Welchen Nachteil hätte diese Implementierung?"

**Solution:** "Die Methode append(H,k) übernimmt die gleiche Funktion wie die beiden ersten Zeilen von Insert(H,k). Danach prüft Insert(H,k) nur auf dem Pfad von der eingefügten Position bis zur Wurzel, ob die Swap-Methode durchgeführt werden muss. Dies sind maximal h ≤ log(n) Überprüfungen. Die Methode BuildHeap(H.A) würde die Aufgabe der Zeilen 3-6 von Insert(H,k) korrekt übernehmen und die gleichen Swap-Befehle ausführen. Jedoch würde BuildHeap(H.A) für etwa die Hälfte der Knoten (also alle, die keine Blätter sind) prüfen, ob Swap notwendig ist. Dies sind ⌈(n-1)/2⌉ Überprüfungen. Die Ersparnis von 4 Zeilen Code hätte also den Nachteil eines deutlich höheren Rechenaufwands bei den Überprüfungen."

**buildHeap(H) code** (Array A already copied to H.A):
```
1  H.size = A.size;
2  FOR i = ceil((H.size-1)/2)-1 DOWNTO 0 DO
3     heapify(H,i);
```

### G4c) — Why BuildHeap only heapifies the first half, and only in descending order (p.25-26)
Task: "Erklären Sie, weshalb BuildHeap(H.A) die Methode Heapify(H.A,i) nur für die erste Hälfte (abgerundet) des Arrays durchführt, und weshalb dies nicht in aufsteigender Reihenfolge geschehen darf."

**Solution:**
- **"Nur auf der ersten Hälfte":** Heapify compares each element with its two child nodes (if both exist). By definition of a heap, every level of the tree is filled from left to right completely before the next level begins. Therefore always exactly the (rounded-up) HALF of the nodes are leaves. These have no children, so Heapify has nothing to do on them — hence it suffices to run Heapify only on the first (rounded-down) half of nodes, which are the non-leaf nodes.
- **"In absteigender Reihenfolge" (descending order requirement):** Heapify causes a value from the considered node to be swapped downward if a child is larger. For the array to satisfy the heap property at the end, it's necessary that the child nodes already contain the largest element in THEIR subtree — which holds when the subtrees are themselves already valid heaps. So Heapify must be called on the child nodes BEFORE their parent nodes are processed.
  Counter-illustration: if the root happens to have two smaller children which themselves have larger grandchildren, and Heapify were run on the root FIRST (ascending order), the root's value wouldn't get swapped down properly, and larger values couldn't propagate all the way up to the root through subsequent ascending calls. So an ascending-order call of Heapify would NOT produce a valid heap.
  Example tree given: root 3, children 2 and 1; 2's children 4,5; 1's children 6,7 (illustrating the failure case).

### G4d) — Full HeapSort trace (p.27-28)
Task: "Führen Sie HeapSort auf das Array A = [6, 4, 1, 8, 3, 7] aus. Verwenden Sie dabei den Algorithmus aus der Vorlesung. Stellen Sie dazu das Heap jeweils in seiner anfänglichen Konfiguration, sowie nach jedem Aufruf der Methode Heapify und nach jeder Ausgabe des Maximums dar." [Note: exercise text on p.27 gives array without explicit bracket count but solution confirms A = [6, 4, 1, 8, 3, 7], 6 elements.]

**Solution recap of HeapSort algorithm:** First establish heap property via repeated Heapify calls on first half of array (descending order). Then repeatedly: extract the max (the root), replace root with the last leaf, sink it back down via Heapify to restore heap property; extracted values (always the largest of remaining keys) are output in descending order.

**Full step-by-step trace (13 labeled panels a–m):**
```
(a) Initial tree (before any heapify): 6(4(8,3),1(7))
    [root 6, left child 4 with children 8,3; right child 1 with child 7]
(b) After Heapify at node 4 (swap 4 and 8): 6(8(4,3),1(7))
(c) After Heapify at node 6/root region — swap: 8(6(4,3),7(1))
    Wait — per notes, panel labels: (b) shows partial heapify, (c) and (d) continue building
(d) Heap fully built: 8(6(4,3),7(1))

--- Extraction phase ---
(e) Extract max (8); replace root with last leaf (1); result before heapify: 1(6(4,3),7)
(f) Heapify sinks 1 down: 7(6(4,3),1)
(g) Heapify continues: 6(4(3),1)  [7 already extracted, so heap shrinks]
(h) Result after this extraction round: 6(4(3),1)

(i) Extract max (6); replace root with last leaf: 1(4(3))
(j) Heapify: 4(3(1))  → result 4(3,1)
    
(k) Extract max (4); replace root with last leaf (1): 3(1) → after heapify still 3(1) [only 2 elements]

(l) Extract max (3); remaining: [1]

(m) Extract max (1); heap empty.
```
Text description (p.28) confirms the extraction order and swaps precisely: "In unserem Beispiel wird ausgehend vom Heap in Abbildung 5d zuerst die 8 extrahiert (wobei die 1 verschoben wird, siehe Abbildungen 5e-5f), dann die 7 (wobei die 3 verschoben wird, siehe Abbildungen 5g-5h), dann die 6 (wobei die 3 verschoben wird, siehe Abbildungen 5i-5j), dann die 4 (wobei die 1 verschoben wird, siehe Abbildungen 5k-5l), dann die 3 (wobei die 1 verschoben wird, siehe Abbildung 5m), und schließlich die 1."

**Final result: the (descending) sorted array is [8, 7, 6, 4, 3, 1].**

[Note: my panel-by-panel node-value reconstruction above (a-m) is a best-effort interpretation of small diagrams; the AUTHORITATIVE result stated explicitly in the text is the extraction order **8, 7, 6, 4, 3, 1** with the noted swap partners (1, then 3, then 3, then 1, then 1) at each extraction step — this text description should be treated as ground truth over my visual panel reconstruction, which is flagged as [UNCLEAR: precise intermediate tree shapes in panels a-m, especially panels b/c and the exact position of node values across the 13 small diagrams].]

## G5 — Splay Trees (exercise) (p.29-34)

### G5 — Insert task (p.29)
"Fügen Sie der Reihe nach die Knoten 4, 8, 7, 1, 6, 9 in den abgebildeten Splay-Baum ein. Verwenden Sie dabei den Algorithmus aus der Vorlesung zum Einfügen von Knoten in einen Splay-Baum. Zeichnen Sie Ihr Zwischenergebnis jeweils nach dem Einfügen des Knotens, sowie nach jeder erfolgten Zig-Zig-, Zig-Zag-, und Zig-Operation."

Starting tree: root 2, right child 10; 10's children 3 and 11; 3's child 5.
```
        2
         \
          10
         /  \
        3    11
         \
          5
```

### G5 - Lösungen — full insertion trace with splay operations (p.30)
Panels (a) through (r), 18 total, tracing each insertion + subsequent splay rotations:

**Insert(4):**
(a) 4 inserted as right child of 3's subtree... (attached deep, then splayed up)
(b)-(c) splay operations propagate 4 upward via zig-zig/zig-zag steps until 4 becomes new root: **root 4**, with 2 as left child, and 10(5(3),11) type structure on the right... 
Result (c): tree with 4 as root: `4( 2, 10(5,11) )` where 5 has left child 3. [Exact structure per panel (c): root 4, left child 2, right child 10; 10's children 5 and 11; 5's left child 3.]

**Insert(8):**
(d) 8 inserted deep (under 5, as right-ish descendant), circled.
(e)-(f) splayed upward.
Result (f): root 4, left child 2, right child 8; 8's children 5(3) and 10(nil,11).

**Insert(7):**
(g) 7 inserted deep under 5 (as right child), circled with arrow.
(h)-(i) splayed upward via zig-zig.
Result (i): root 7, left child 5(2(3),nil)... [panel i shows: 7 as root, left child 5 with children 2(3) — wait, structure per description: "5" left child has "2" with children (nil,3)]. Right child of 7 is 8(nil,10(nil,11)).

Actually per panel labels (g)-(i): tree becomes root 7, children 5 and 8; 5's children 2(3) [wait — the exact structure]: Based on the drawing "(i)" shows: 7 → left: 5 (→ left: 2 → left: 3... ) , right: 8 (→ right: 10 → right: 11).

**Insert(1):**
(j) 1 inserted deep at bottom-left, circled with arrow (zig-zig indicated by curved arrow near nodes 4,5,7,1,3).
(k)-(l) splayed upward.
Result (l): root 1, right child 5(2(nil,4),7(nil,8(nil,10(nil,11))))... [tree grows right-heavy after this: root 1 → right child 2 → right child 4 → right child 7... structure continuing rightward per panel (l)].

**Insert(6):**
(m) 6 inserted, tree shown: root 1, right child 5; 5's children 2(nil,4) and 7(6,8(nil,10(nil,11))).
(n) further splay.
(o) further splay: root 6, left child 1(nil,5(2(nil,4))), right child 7(nil,8(nil,10(nil,11))).

**Insert(9):**
(p) 9 inserted deep under 10 (left child), tree: root 6, left child 1(5(2(4))), right child 7(8(nil,10(9,11))).
(q) splay: root 6, ... 9 moving up.
(r) final result: root 6, right child 7; 7's right child 9; 9's children 8 and 10; 10's right child 11. Left side: 6's left child 1, 1's right child 5, 5's left child 2, 2's right child 4, 4's left child 3.

**Final tree after all insertions (panel r), also used as starting point for G5b:**
```
                    6
                 /     \
                1         7
                 \          \
                  5           9
                 /           /  \
                2           8    10
                 \                 \
                  4                 11
                 /
                3
```
[Note: this chain-like left-side structure (1→5→2→4→3, each via alternating right/left single-child links going down) is explicitly confirmed by the p.31 task diagram, which reuses this exact tree — see below. High confidence in this final structure; lower confidence in some of the exact intermediate panel states (b,c,e,f,h,k,n,o,q) due to diagram density — flagged as [UNCLEAR: precise intermediate splay-tree shapes in several of panels a-q; the START (task tree) and END (panel r / p.31 task) states are confirmed with high confidence].]

### G5b — Search task (p.31)
"Betrachten Sie den resultierenden Splay-Baum aus G5(a), und suchen Sie den Knoten 5. Verwenden Sie dabei den Algorithmus aus der Vorlesung zum Suchen von Knoten in einem Splay-Baum. Zeichnen Sie Ihr Zwischenergebnis jeweils nach jeder erfolgten Zig-Zig-, Zig-Zag-, und Zig-Operation."
Given/confirmed starting tree (labeled "(r)"): root 9, children 7 and 10; 7's children 6 and 8; 6's child 1; 1's child 5; 5's child 2; 2's child 4; 4's child 3; 10's child 11.
[Note: this is a DIFFERENT tree shape than what I reconstructed as panel (r) above from G5a — this appears to be the true, authoritative final tree from G5a. Root is 9 here, not 6.]
```
                    9
                 /     \
               7          10
             /   \           \
            6     8            11
           /
          1
           \
            5
           /
          2
           \
            4
           /
          3
```

### G5b - Lösungen — search(5) trace (p.32)
Two panels (a) and (b):
**(a)** After partial splay: root 9, left child 7(5(1,6),8); 5's left child 1, right child 6; further down 5 also connects to 2→4→3 chain... [structure: root 9, left child 7; 7's children 5 and 8; 5's children 1 and 6; 1's child 2; 2's child 4; 4's child 3; right side: 9's right child 10, 10's child 11].

**(b) Final result after full splay of node 5 to root:**
```
                    5
                 /     \
                1         7
                 \       /  \
                  2     6     9
                   \           \
                    4            10
                   /               \
                  3                 11
```

### G5c — Delete task (p.33)
"Betrachten Sie den resultierenden Splay-Baum aus G5(b), und löschen Sie den Knoten 8. Verwenden Sie dabei den Algorithmus aus der Vorlesung zum Löschen von Knoten aus einem Splay-Baum. Zeichnen Sie Ihr Zwischenergebnis jeweils nach jeder erfolgten Zig-Zig-, Zig-Zag-, und Zig-Operation, sowie nach dem Löschen des Knotens und Aufteilen des Baumes, und nach dem Zusammenführen der zwei Teilbäume."
Given tree (labeled "(b)", = result of G5b): root 5, children 1 and 7; 1's child 2; 2's child 4; 4's child 3; 7's children 6 and 9; 9's children 8 and 10; 10's child 11.
```
                    5
                 /     \
                1         7
                 \       /  \
                  2     6     9
                   \           \
                    4            8,10 (9's children)
                   /                    \
                  3                      11
```

### G5c - Lösungen — delete(8) trace (p.34)
Five panels (a)-(e):
**(a)** After splaying 8 up partway: root 5, left child 1(nil,2(nil,4(3))), right child 8; 8's children 7(6,nil) and 9(nil,10(nil,11)).

**(b) 8 splayed to root:**
```
                    8
                 /     \
                5         9
             /    \         \
            1        7        10
             \      /            \
              2    6               11
               \
                4
               /
              3
```

**(c) Node 8 deleted, tree split into two subtrees (left subtree rooted where 5 was, right subtree rooted where 9 was):**
Left subtree: root 5, children 1 and 7; 1's child 2; 2's child 4; 4's child 3; 7's child 6.
Right subtree: root 9, child 10; 10's child 11.

**(d)** Left subtree's max element (7) splayed to its root (in preparation for join): root 7, children 5 and 6; 5's children 1 and (nil); 1's child 2; 2's child 4; 4's child 3. Right subtree unchanged: root 9, child 10(11) — wait per diagram (d) shows just the right piece as "9 → 10 → 11" chain, separately displayed.

**(e) Final result — the two subtrees joined (7 as new root, right subtree 9(10,11) attached as 7's right child):**
```
                    7
                 /     \
                5         9
             /    \         \
            1        6        10
             \                   \
              2                    11
               \
                4
               /
              3
```

---

*End of transcription. All three source PDFs (43 + 37 + 34 = 114 pages) were read in full.*
