# AUD Maxine 8 (AUD Maxine 8_260529_122301.pdf)

> **Note on source type:** Unlike other "Maxine" files, this PDF's actual content is a printed/typed slide deck titled **"AUD Übungsgruppe 2" by M.Konz**, dated **16.06.2025** (an exercise-group / Übungsgruppe session, not raw handwritten notes). It contains typed slide text with handwritten pen annotations (highlights, circles, arrows, added notes) overlaid, which are transcribed inline and marked as *(handwritten annotation)* where useful. Slide footer throughout: "AUD | Übungsgruppe 2 | M.Konz".

## B-Bäume (B-Trees) — Grundlagen

### Was sind B-Trees?
- Ein Knoten kann **mehrere Werte** beinhalten; wir reden vom Grad **t**, der bestimmt, wie viele Werte innerhalb der Knoten enthalten sein dürfen.
- Für alle Knoten **außer der Wurzel**: 
  $$min = (t-1),\ max = (2t-1)$$
- Für die **Wurzel** gibt es eine Ausnahme:
  $$min = 1,\ max = (2t-1)$$
- Diagram: a node with two values `a | b` has three children edges: left child ≤ a, middle child (≥a ∧ ≤b), right child ≥ b.
- *(handwritten annotation, marked important):* "Achtung: n, m, x, y, z sind hier pointer der Knoten, nur 'a' beschreibt hier einen Wert." — "Position eingehender Kanten hat keine Bedeutung, aber Position ausgehender Kanten schon."

### Warum B-Trees? (zum Nachlesen)
- B-Trees scheinen auf den ersten Blick keinen Vorteil zu haben: niedrigere Höhe als BSTs, aber um einen Wert zu suchen müssen wir immer noch viele Vergleiche machen (vielleicht sogar mehr).
- **ABER**: Bei der Computer-Architektur ist jeder Knoten an einem Speicherplatz abgespeichert (x.left/x.right sind Pointer zu diesem Speicherplatz). Beim BST muss man für jeden Knoten diesen Speicherplatz aufrufen (fetch).
- Der B-Baum ist hier effizienter: Der Vergleich findet am selben Speicherplatz statt, wodurch die Laufzeit je nach Bauweise des Computers schneller ist.
- *Handwritten emphasis (italic/orange):* "Fetch dauert länger als compare."
- Diagram compares BST search for "a" (steps: Hole Wert von Knoten x (fetch), Vergleiche Wert von x mit a, Hole Wert von Knoten y (fetch), Vergleiche Wert von y mit a, ... total ~8 steps of Hole/Vergleiche alternating) vs. B-Tree search for "a" where within one fetched node c|d you compare against both keys before the next fetch (Hole Werte von Knoten x (fetch) → Vergleiche 1. Wert von x(c) mit a → Vergleiche 2. Wert von x(d) mit a → Hole Werte von Knoten y (fetch) → Vergleiche 1./2. Wert von y mit a), i.e. fewer fetches for same number of comparisons.
- Bottom callout box: "Hier beschreibt der B-Tree nicht den oben gezeigten BST! Das soll nur der Veranschaulichung dienen."

### B-Bäume - Suche (Pseudocode)
```
search(x,k)
1  WHILE x != nil DO
2     i=0;
3     WHILE i < x.m AND x.key[i] < k DO i=i+1;
4     IF i < x.m AND x.key[i]==k THEN
5        return (x,i);
6     ELSE
7        x=x.child[i];
8  return nil;
```
**Laufzeit:** $O(t \cdot h) = O(\log_t n)$

Worked example: `search(T.root, 10)` on tree with root `[15]`, root's children `[5,8]` (left) and `[20]` (right). Node `[5,8]` has children `[1,2]`, `[7]`, `[10]` (indices 0,1,2 in `x.child`). Node `[20]` has children `[19]`, `[21]`. Trace: start at root `[15]`, i=0, compare key[0]=15 with k=10 → 15 is not < 10 so loop stops at i=0; key[0]=15 ≠ 10, so descend to `x.child[0]` = node `[5,8]`. At `[5,8]`: i=0, key[0]=5<10 → i=1; key[1]=8<10 → i=2; loop stops (i==x.m=2); key not found at this node; descend to `x.child[2]` = leaf `[10]`. At `[10]`: i=0, key[0]=10 not <10, loop stops; key[0]=10==10 → return (x,0). Found.

### B-Bäume – Einfügen (Insert)
**1/3 — Suche Position und füge ein:** Search downward for the correct leaf position (t=2 example diagram: green value node found via leaf search, inserted directly into a leaf).
- **ABER**, was wenn dadurch die B-Baum Bedingung in den Kindern verletzt worden ist (>2t-1 Werte)?

**3/3 — Split case:** Fall: Durch Einfügen würde die obere Grenze (≥2t-1) überschritten werden.
- Da 2t-1 eine ungerade Anzahl von Werten ist, gibt es eine mögliche Aufteilung in 3 Teile:
  $$2t-1 = (t-1) + 1 + (t-1)$$
- Einfügen des mittleren Wertes in Elternknoten.
- **ABER**, was wenn dadurch die B-Baum Bedingung in dem parent-node verletzt worden ist (>2t-1 Werte)? → recursive splitting up the tree.

### B-Bäume - Einfügen (Prinzip "Suche und splitte")
> **(marked important, boxed with "!")** Wir gehen beim Einfügen nach dem Prinzip **"Suche und splitte"**. D.h.: Wenn wir sehen, dass der nächste Knoten bereits 2t-1 Werte besitzt, splitten wir ihn, egal ob der Wert erst später eingefügt wird.

```
insert(T,z)
1  Wenn Wurzel schon 2t-1 Werte, dann splitte Wurzel
2  Suche rekursiv Einfügeposition:
3     Wenn zu besuchendes Kind 2t-1 Werte, splitte es erst
4  Füge z in Blatt ein
```
Side note: "Blatt hat bei Zeitpunkt des Einfügens ≤2t-1 Werte."

**Worked example — `insert(T.root, 57)`:**
Start tree: root `[20,30,50]`, root's rightmost child `[51,55,60]` (dots indicate other children exist but aren't shown in detail).
1. Check root: full (`[20,30,50]` = 3 values = 2t-1 for t=2) → **split**. Root becomes `[30]`; new children `[20]` and `[50]` (50's child remains `[51,55,60]`).
2. `check-child`: descending to `[50]` node, check its child `[51,55,60]`: full → **split**. `[51,55,60]` splits into `[51]` and `[60]`, with 55 promoted into `[50]` → node becomes `[50,55]`, with children `[51]` and `[60]`.
3. Insert 57: descend to child `[60]` (57<60... actually into the correct child), insert 57 → child becomes `[57,60]`.
Final tree: root `[30]`; left child `[20]`; right child `[50,55]` with children `[51]` and `[57,60]` (57 highlighted green as newly inserted).

### B-Trees Löschen – Rotate/Merge (1/4 – 4/4)

**1/4 — Overview:**
Beim Löschen gehen wir nach dem selben Prinzip vor, denn wenn wir einen Knoten löschen, kann auch dadurch die B-Baum-Bedingung verletzt werden (es sind durch Löschen t-2 Werte enthalten). D.h. auch hier gehen wir durch den Baum und schauen für jeden Knoten, ob er noch genug Werte hat (≥t Werte). Wenn dies nicht der Fall ist, müssen wir mehrere Fälle betrachten.

**2/4 — Fall 1 (ROTATE), left sibling has enough values:**
Example with t=3 → (min,max) = (t-1, 2t-1) = (2,5).
- Fall: linker Geschwisterknoten hat ≥t Werte.
- Setup: node V = `[a,s,t]` (inner node with 3 values); left child W; middle child X = `[q,r]`; right child Y. X's child Z = `[c,d,b]` (b is the rightmost / largest value in Z, found via recursive search).
- "Suche im Baum W rekursiv nach größtem Wert (dabei wieder evtl. mit Rotieren und Merge)."
- **Rotiere:** Merke b → Lösche b aus Z → Merke a → Überschreibe a mit b → Sortiere a in X ein.
- Result: V becomes `[b,s,t]`; X becomes `[q,r,a]`; Z becomes `[c,d]`.
- Side note: "(Position von a könnte auch woanders sein)."

**3/4 — Fall 1 mirrored, right sibling has enough values:**
- Fall: linker Geschwisterknoten hat t-1 Werte/null, rechter Geschwisterknoten hat ≥t Werte.
- Setup: V = `[s,a,t]`; left child X = `[q,r]`; right child Y; Y's child Z = `[b,c,d]`.
- "Suche im Baum Y rekursiv nach kleinstem Wert (dabei wieder evtl. mit Rotieren und Merge)."
- **Rotiere:** Merke b → Lösche b aus Z → Merke a → Überschreibe a mit b → Sortiere a in X ein.
- Result: V becomes `[s,b,t]`; X becomes `[q,r,a]`; Z becomes `[c,d]`.

**4/4 — MERGE aka Fall 3:**
- Setup: V = `[s,a,t]`; children W, X = `[b,c]`, Y = `[d,e]`.
- Merge: V loses value `a` → becomes `[s,t]`; the middle child (formerly X, a, Y) merges into a single node `[b,c,a,d,e]` — counts: (t-1) + 1 + (t-1) = 2t-1.

### B-Bäume - Löschen (Prinzip "Lösche und Verschmelze/Rotiere")
> **(marked important, boxed with "!")** Wir gehen beim Löschen nach dem Prinzip **"Lösche und Verschmelze/Rotiere"**. D.h.: Wir schauen, auf dem Weg nach unten, ob das nächste Kind t-1 Werte hat. Wenn ja, dann verschmelze bzw. rotiere.

```
delete(T,k)
1  Wenn Wurzel nur 1 Wert und beide Kinder t-1 Werte,
   verschmelze Wurzel und Kinder (reduziert Höhe um 1)
2  Suche rekursiv Löschposition:
3     Wenn zu besuchendes Kind nur t-1 Werte,
       verschmelze es oder rotiere/verschiebe
4  Entferne Wert k in inneren Knoten/Blatt
```
Diagram illustrates: node with t-1 values found on the path where both children have t-1 values → verschmelze (merge); after merging, one resulting child branch may then have ≥ t values (rotate further if needed); finally delete the target key `x`.

## G2 B-Bäume - Einfügen (Exercise + Solution)

**Exercise:** B-Baum mit Grad t = 2 → (min,max) = (1,3). Starting tree: root `[7,38]`; children `[2,4,5]`, `[9,15,24]`, `[41,42,58]`. Fügen Sie der Reihe nach die Schlüssel **66, 45, 53 und 37** ein, mit dem Algorithmus aus der Vorlesung. Skizzieren Sie das Zwischenergebnis nach jeder Einfügeoperation.

**Solution — Insert 66:**
- Right child `[41,42,58]` is full (3 values) → split into `[41]` and `[58]`, promoting 42 into root.
- Root becomes `[7,38,42]`.
- Insert 66 into rightmost leaf `[58]` → `[58,66]`.
- Resulting tree: root `[7,38,42]`; children `[2,4,5]`, `[9,15,24]`, `[41]`, `[58,66]`.

**Solution — Insert 45:**
- Root `[7,38,42]` is full → split into `[7]` and `[42]`, promoting 38 as new root.
- Tree: root `[38]`; left child `[7]` (with children `[2,4,5]`, `[9,15,24]`); right child `[42]` (with children `[41]`, `[58,66]`).
- Insert 45 into `[58,66]` → `[45,58,66]`.

**Solution — Insert 53:**
- Node `[45,58,66]` is full → split into `[45]` and `[66]`, promoting 58 into parent `[42]` → `[42,58]`.
- Tree: root `[38]`; left `[7]` (children `[2,4,5]`,`[9,15,24]`); right `[42,58]` (children `[41]`,`[45]`,`[66]`).
- Insert 53 into `[45]` → `[45,53]`.

**Solution — Insert 37:**
- Node `[9,15,24]` (left branch) is full → split into `[7,15]` combining with parent (parent `[7]` gains 15) → parent becomes `[7,15]`, with children `[2,4,5]`, `[9]`, `[24]`.
- Insert 37 into `[24]` → `[24,37]`.
- **Final tree:** root `[38]`; left child `[7,15]` with children `[2,4,5]`, `[9]`, `[24,37]`; right child `[42,58]` with children `[41]`, `[45,53]`, `[66]`.

## G3 B-Bäume - Löschen (Exercise + Solution)

**Exercise:** B-Baum mit Grad t = 3 → (min,max) = (2,5). Starting tree: root `[16]`; children `[3,7,13]` and `[20,23]`. `[3,7,13]`'s children: `[1,2]`, `[4,5,6]`, `[10,11,12]`, `[14,15]`. `[20,23]`'s children: `[17,18,19]`, `[21,22]`, `[24,25]`. Löschen Sie der Reihe nach die Schlüssel **6, 13, 7, 4 und 2**.

**Solution — Delete 6:**
- 6 is in leaf `[4,5,6]`; leaf has 3 values ≥ min(2), simple removal: `[4,5,6]` → `[4,5]`. No rebalancing needed. Rest of tree unchanged.

**Solution — Delete 13:**
- 13 is an inner-node value in `[3,7,13]`. The left child of 13 (i.e. `[10,11,12]`, between 7 and 13) has ≥t=3 values → replace 13 with its in-order predecessor: the largest value in the left subtree = **12**.
- 13 is overwritten by 12; 12 is removed from leaf `[10,11,12]` → `[10,11]`.
- Node `[3,7,13]` becomes `[3,7,12]`.
- *(handwritten side-note): "Man kann sich das so vorstellen, dass zuerst rotiert wird und dann gelöscht" — alternatively phrased as a new operation: "ersetze mit größtem Wert".*

**Solution — Delete 7:**
- 7 is inner-node value in `[3,7,12]`. Both its children now have exactly t-1=2 values (left child `[4,5]`, right child `[10,11]`) → neither has enough → **merge** (Verschmelze).
- Merge `[4,5]` + 7 + `[10,11]` → single node `[4,5,7,10,11]`.
- `[3,7,12]` becomes `[3,12]`.
- *(handwritten note): "Man kann sich das so vorstellen, dass zuerst verschmolzen wird und dann gelöscht" — oder "lösche und verschmelze nur Kinder".*

**Solution — Delete 4 (and consequent root merge):**
- Deleting 4 from leaf reduces its count; because the resulting leaf and its siblings/parent are under-full along the path (root `[16]` has only 1 value, and its children `[3,12]` and `[20,23]` — check counts), the algorithm merges root with children per rule 1 (root has 1 value, both its children have t-1 values) → tree collapses one level: merged node becomes `[3,12,16,20,23]`.
- Leaf `[4,5,7,10,11]` loses 4 → `[5,7,10,11]` (leaf still has ≥ t-1 values after removal in this traced scenario).
- Resulting structure (single merged root-level node): `[3,12,16,20,23]` with children `[1,2]`, `[5,7,10,11]`, `[14,15]`, `[17,18,19]`, `[21,22]`, `[24,25]`.
- [UNCLEAR: the exact intermediate merge visuals on this slide are densely hand-annotated in green pen; the general logic — "zu wenig Werte → Geschwister auch zu wenig → verschmelze" — is legible, but precise per-node counts in the middle diagram are difficult to confirm with certainty from the scan.]

**Solution — Delete 2:**
- Annotation: "zu wenig Werte → Geschwister hat genügend → rotiere."
- Leaf `[1,2]` loses 2 → would be under-full; its sibling `[5,7,10,11]` has enough (≥t) → **rotate**: take the smallest value greater than 3 (the separating value) = **5**, rotate up.
- Parent node value 3 moves down into the leaf, sibling loses 5.
- Result: parent becomes `[5,12,16,20,23]`; left leaf becomes `[1,3]`; former `[5,7,10,11]` leaf becomes `[7,10,11]`.
- **Final tree after all 5 deletions:** single node `[5,12,16,20,23]` with children `[1,3]`, `[7,10,11]`, `[14,15]`, `[17,18,19]`, `[21,22]`, `[24,25]`.

## Hash-Tables (Wiederholung)

### Wie funktionieren Hash-Tables
- Wir haben eine Funktion (Hash-Funktion), in die wir Werte einsetzen können und Werte zurückbekommen, die innerhalb eines bestimmten Zahlenbereiches liegen.
- → Wird in der Informatik oft genutzt, um z.B. Texte zu verschlüsseln oder Passwörter zu speichern / Git benutzt das auch z.B. um Commits zu speichern.
- Eine Hash-Table speichert sich diese Eingaben zu den Hashes.
- → Die Tabelle selbst hat so viele Felder, wie es Hashes geben kann, während innerhalb der Felder mittels **verketteter Listen** die Eingaben gespeichert werden.
- → Beispiel: "banana" wurde auf Hash-Wert 1 gehasht → Eintrag "banana" bei Index 1 (chained under a linked list at each bucket).

### G4 – Hash Tables (Exercise + Solution)

**(a) Exercise:** Fügen Sie Elemente mit Schlüsseln **16, 34, 50, 7, 22, 14, 49, 33, 40, 11, 3, 2** in der angegebenen Reihenfolge in eine Hashtabelle T der Länge 8 ein, mit Hashfunktion:
$$h: \mathbb{N} \to \{0,\dots,7\},\quad k \mapsto \lfloor 8\cdot(0{,}37\cdot k \bmod 1)\rfloor$$
Zur Auflösung von Kollisionen: doppelt verkettete Listen.

**Computed hash values:**
$h(16)=7,\ h(34)=4,\ h(50)=4,\ h(7)=4,\ h(22)=1,\ h(14)=1,\ h(49)=1,\ h(33)=1,\ h(40)=6,\ h(11)=0,\ h(3)=0,\ h(2)=5$

**Resulting table T (length 8), doubly-linked chains per bucket, in insertion order:**
- 0: `3 ↔ 11`
- 1: `33 ↔ 49 ↔ 14 ↔ 22`
- 2: `∅`
- 3: `∅`
- 4: `7 ↔ 50 ↔ 34`
- 5: `2`
- 6: `40`
- 7: `16`

**(Löschen) Exercise:** Löschen Sie anschließend die Schlüssel **50 und 55** aus T. Stellen Sie die Hashtabelle nach jeder Löschoperation dar.

**Solution:**
- Delete 50: `h(50)=4` (computed above). Suche in Liste von Index 4 nach Wert 50 → gefunden → gelöscht. Bucket 4 becomes: `7 ↔ 34`.
- Delete 55: `h(55)=2`. Liste von Index 2 ist leer → Algorithmus macht nichts (55 was never in the table). No change.
- Final table: 0: `3↔11`; 1: `33↔49↔14↔22`; 2: `∅`; 3: `∅`; 4: `7↔34`; 5: `2`; 6: `40`; 7: `16`.

## Skip Lists (Wiederholung)

### Skip Lists — Concepts
- Skiplisten/Expresslisten sind verkettete Listen, in denen wir aber **effizient suchen** können. "Verkettete Listen mit zusätzlichem 'Sprung'-Zugriff."
- Die unterste Ebene (Ebene 0) enthält alle Elemente in sortierter Reihenfolge — wie eine normale verkettete Liste.
- Höhere Ebenen enthalten nur einige der Elemente — zufällig ausgewählt.
- **Suchen:** Man beginnt oben links, vergleicht das aktuelle Element: wenn es kleiner ist als das gesuchte → 1 weiter rechts; wenn du nicht mehr weiterkommst → 1 Ebene tiefer; wiederhole, bis in der untersten Ebene angekommen.
- **EINFÜGEN:** Füge auf unterster Ebene ein, und dann evtl. auf Ebenen darüber (zufällige Wahl mit Wahrscheinlichkeit p auf jeder Ebene). Laufzeit $O(h) = O(\log_{1/p}(n))$.
- **LÖSCHEN:** Entferne Vorkommen des Elements auf allen Ebenen.
- Wir fügen in nächster Höhe ein, wenn für den gegebenen Zufallswert gilt: $q < p$.
- **Warum?** Die Elemente, die in mehreren Höhen vorkommen, sind dementsprechend die, die nach Zufallswerten seltener vorkommen. Warum die, die seltener vorkommen? Wenn wir das umgekehrt machen würden, hätten wir zu viele Elemente auf den Expresslisten.

### G5 Skip Lists (Exercise + Solution)

**(a) Exercise:** Given skip list with probability $p = \tfrac{1}{2}$:
- Level 2: `-∞ ↔ 31`
- Level 1: `-∞ ↔ 23 ↔ 31 ↔ 34 ↔ 64`
- Level 0: `-∞ ↔ 12 ↔ 23 ↔ 26 ↔ 31 ↔ 34 ↔ 44 ↔ 56 ↔ 64 ↔ 78`

Wie viele Suchschritte sind notwendig, um die Elemente **78, 12, 63** zu finden?

**Solution:**
- **78** (traced in red): **6 Schritte**.
- **12** (traced in green): **3 Schritte**.
- **63** (traced in blue): **7 Schritte** (search terminates unsuccessfully/at nil, since 63 is not in the list — path goes to level1 34→64, drops to level0, moves toward 64, ends at nil before 78 since 63<64... note: value 63 not present).

**(b) Exercise:** Fügen Sie der Reihe nach die Werte **15, 27 und 33** in die Skip-Liste ein, wenn der Zufallsgenerator fortlaufend folgende Zahlenfolge liefert: `0,34  0,58  0,87  0,49  0,12  0,26  0,69`.

**Solution — Insert 15:**
- H1: 0,34 < 0,5 → einfügen (promote to level 1). H2: 0,58 > 0,5 → stopp (do not promote further).
- 15 inserted at level 0 (between 12 and 23) and at level 1 (between -∞ and 23).
- Note: "15 wird in unterste Ebene sowieso eingefügt."

**Solution — Insert 27:**
- H1: 0,87 > 0,5 → stopp immediately (only inserted at level 0).
- 27 inserted at level 0 only, between 26 and 31.

**Solution — Insert 33:**
- H1: 0,49 < 0,5 → einfügen. H2: 0,12 < 0,5 → einfügen. H3: 0,26 < 0,5 → einfügen. H3(further/level check): 0,69 > 0,5 → stopp.
- 33 inserted at level 0 (between 31 and 34), level 1 (between 31 and 34), and level 2 (between -∞ and 31... shown as a new level-2 entry `33` right after `-∞`, connecting across to 31... per diagram, 33 becomes highest node reaching up to level 2, positioned after 31).
- Final diagram (page 41) shows: Level 2: `-∞ ↔ 33` (with `33 ↔ 31` cross-link shown in red) — i.e., 33 is inserted at levels 0,1,2, positioned right after 31 in sorted order. Level 1 gains `33` between 31 and 34. Level 0 gains `33` between 31 and 34.
- Note: "33 wird in unterste Ebene sowieso eingefügt."

## Bloom-Filter (Wiederholung)

### Bloom Filter — Concepts
- → Verwenden Hash-Funktionen, um Bits (0/1) in ein Bit-Array zu schreiben.
- Auf Element $x_1$ werden **mehrere Hash-Funktionen** angewendet, die Indizes für den Bloom-Filter ausgeben.
- → An den Indizes wird dann eine **1** gespeichert, sonst 0.
- **False-Positives:** Filter gibt an, dass Element in Menge enthalten, obwohl es nicht vorkommt.

**Pseudocode:**
```
initBloom(X,BF,H) //H array of functions H[j]
1  FOR i=0 TO BF.length-1 DO BF[i]=0;    // überall = 0
2  FOR i=0 TO X.length-1 DO              // für jeden x-Wert
3     FOR j=0 TO H.length-1 DO           // für jede Hash-Funktion
4        BF[H[j](X[i])]=1;               // setze 1
```
```
searchBloom(BF,H,y) //H array of functions H[j]
1  result=1;
2  FOR j=0 TO H.length-1 DO
3     result=result AND BF[H[j](y)];     // wenn eine der Hashf. nicht 1 ist → result=0
4  return result;
```

### G6 Bloom Filter (Exercise + Solution)

**Setup:** 16-Bit Bloom-Filter with three hash functions:
$$H_1([x_1,\dots,x_n]) = \sum_{i=1}^n ASCII(x_i) \pmod{16}$$
$$H_2([x_1,\dots,x_n]) = \prod_{i=1}^n ASCII(x_i) \pmod{16}$$
$$H_3([x_1,\dots,x_n]) = \sum_{i=1}^n Q(ASCII(x_i)) \pmod{16}$$
(ASCII(x) = ASCII code; Q(x) = Quersumme / digit sum.)

**(a) Exercise:** Fügen Sie die Strings **[A,u,D]**, **[B,l,o,o,m]** und **[B,a,u,m]** in den 16-Bit Bloom-Filter ein (initial all-zero).

**Solution:**
- $[A,u,D]$: $H_1=65+117+68=250 \bmod 16 = 10$; $H_2=65\cdot117\cdot68 \bmod 16 = 4$; $H_3=Q(65)+Q(117)+Q(68) \bmod 16 = 2$.
  → Bits set: 10, 4, 2. Filter after: index 0:1 (pre-existing per starting example... actually starting filter for this sub-question is all-zero) → `1 0 1 0 1 0 0 0 0 0 1 0 0 0 0 0` (indices 0,2,4,10 = 1). [Note: index 0 was already 1 in the example filter shown before the exercise proper began — treat indices {2,4,10} as newly set by [A,u,D].]
- $[B,l,o,o,m]$: $H_1=66+108+111+111+109=505 \bmod 16=9$; $H_2 \bmod 16 = 8$; $H_3=Q(66)+Q(108)+Q(111)+Q(111)+Q(109) \bmod 16 = 5$.
  → Bits set: 9, 8, 5. Filter after: `1 0 1 0 1 1 0 0 1 1 1 0 0 0 0 0` (indices 0,2,4,5,8,9,10 = 1).
- $[B,a,u,m]$: $H_1=66+97+117+109=389 \bmod16=5$; $H_2 \bmod16=2$; $H_3=Q(66)+Q(97)+Q(117)+Q(109) \bmod16=15$.
  → Bits set: 5, 2, 15. Filter after: `1 0 1 0 1 1 0 0 1 1 1 0 0 0 0 1` (indices 0,2,4,5,8,9,10,15 = 1).

**(b) Exercise:** Prüfen Sie, ob die Strings **[H,a,s,h]** und **[G,r,a,p,h]** im Bloom-Filter (nach den obigen Einfügeoperationen) vorhanden sind. Geben Sie an, was Ihnen dieses Ergebnis sagt.

**Solution:**
- $[H,a,s,h]$: $H_1=72+97+115+104=388 \bmod16=4$; $H_2 \bmod16=0$; $H_3=Q(72)+Q(97)+Q(115)+Q(104) \bmod16=5$.
  → Check bits 4, 0, 5: all = 1 in the filter → **[H,a,s,h]** ist **vermutlich in den Bloom-Filter aufgenommen worden**. Es könnte sich aber auch um ein "False-Positive" handeln, bei dem zufälligerweise alle Bits durch das Einfügen von anderen Werten auf 1 gesetzt wurden. Bei genauerer Betrachtung fällt auf, dass zu Beginn der Aufgabe das Bit der Stelle 5 noch 0 war. Da wir den Wert [H,a,s,h] nie eingefügt haben, wissen wir, dass es sich um ein **"False-Positive"** handelt.
- $[G,r,a,p,h]$: $H_1=71+114+97+112+104=498 \bmod16=2$; $H_2 \bmod16=0$; $H_3=Q(71)+Q(114)+Q(97)+Q(112)+Q(104) \bmod16=7$.
  → Check bits 2, 0, 7: bit 7 is **0** (never set) → we can say **with certainty** that **[G,r,a,p,h]** noch **nicht** in den Bloom-Filter eingegeben wurde (no false negatives possible in a Bloom filter).

**(c) Exercise:** Bloom-Filter als Vorabprüfung für Suchalgorithmus auf Dateisystem verwenden. Da Dateien auch entfernt werden können, müsste der Bloom-Filter nach jedem Entfernungsvorgang neu aufgebaut werden. Überlegen Sie sich eine Variante von Bloom-Filtern, die das Entfernen von Werten unterstützt. Wie beeinflusst diese Veränderung den Speicherbedarf?

**Solution — Counting Bloom Filter:**
- Statt eines einzelnen Bits an jeder Position speichert man einen **Zähler (Counter)**, der zählt, wie oft eine bestimmte Position von verschiedenen Elementen gesetzt wurde.
- Beispielsweise ein 4-Bit-Zähler, der Werte von 0 bis 15 speichern kann. Um Überläufe zu vermeiden, sollte die Größe der Zähler entsprechend gewählt werden.
- **Einfügen:** Hash-Funktionen berechnen, Zähler an den entsprechenden Positionen jeweils **um 1 erhöhen**.
- **Suchen:** Jede Position mit Zähler > 0 gilt als gesetzt (wie eine 1 im klassischen Bloom-Filter).
- **Entfernen:** Hash-Funktionen berechnen, Zähler an den entsprechenden Positionen jeweils **um 1 verringern**.
- Diese Variante heißt **zählerbasierter Bloom-Filter (counting Bloom filter)** und erlaubt das Entfernen von Elementen, was mit klassischen Bloom-Filtern nicht möglich ist.
- **Nachteil:** Durch die Speicherung von Zählern statt einzelner Bits steigt der Speicherbedarf deutlich an — abhängig von der Zählergröße um ein Vielfaches. Trotzdem bleibt die schnelle Prüfung auf sichere Nicht-Vorhandenheit (keine False Negatives) erhalten.
- **Worked example given in notes:** 16-bit Bloom filter with initial bits (from part a, after inserting [A,u,D],[B,l,o,o,m],[B,a,u,m]): `1 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0`. After converting to counters and inserting the same three strings (with the given hash values), resulting **counters**: index 0:1, 1:0, 2:2, 3:0, 4:2, 5:2, 6:0, 7:0, 8:1, 9:1, 10:2, 11:0, 12:0, 13:0, 14:0, 15:1.

---

# AUD Maxine 9 (AUD Maxine 9_260529_122302.pdf)

> Same source type as file 8: printed slide deck **"AUD Übungsgruppe 2" by M.Konz**, dated **21.06.2025**, topic = Graphs. Footer: "AUD | Übungsgruppe 2 | M.Konz".

## Wiederholung — Graph Representations

### Adjazenzmatrix
- Sei $(V,E)$ ein Graph $G$.
- Spalten und Zeilen einer Adjazenzmatrix beschreiben die Nummerierung der Knoten.
- Für die Kanten des Graphen gilt:
  $$A[i,j] = \begin{cases}1 & \text{wenn } \exists e \in E: e=(i,j) \\ 0 & \text{sonst}\end{cases}$$
- Aka: wenn es eine Kante von i zu j gibt, dann schreiben wir eine 1 hin, sonst eine 0.

**Example graph (6 nodes, directed, with self-loop at node 2):** Edges: 1→4, 1→5, 2→1, 2→2 (self-loop), 4→2, 5→6, 6→4. Node 3 isolated.

**Adjacency matrix A (rows i, cols j, 1-indexed):**
```
      j: 1  2  3  4  5  6
i=1:     0  0  0  1  1  0
i=2:     1  1  0  0  0  0
i=3:     0  0  0  0  0  0
i=4:     0  1  0  0  0  0
i=5:     0  0  0  0  0  1
i=6:     0  0  0  1  0  0
```

### Adjazenzmatrix - Besonderheit
- Mit den Potenzen $m$ der Adjazenzmatrix können wir die Anzahl der Pfade, die von $i$ zu $j$ über $m$ Kanten führen, herausfinden. ($A = A^1$: In der Matrix von $A^1$ stehen die Anzahl der Pfade, die von i zu j führen und genau 1 Kante haben.)
- **Beispiel:** $A^3[2,2] = 2$
  1. Path: $2 \to 1 \to 4 \to 2$
  2. Path: $2 \to 2 \to 2 \to 2$ (using the self-loop twice)

### Adjazenzliste
- Die Indizes des Arrays beschreiben die Knoten, die in dem Graphen existieren, d.h.: $|A| = |V|$ (Größe des Arrays A entspricht der Anzahl der Knoten).
- In jedem Index speichern wir uns die Knoten ab, zu denen wir eine Kante finden: $A[i] = \{j \in V \mid (i,j) \in E\}$.

**Adjacency list for the same graph:**
```
1: 4, 5
2: 1, 2
3: (empty)
4: 2
5: 6
6: 4
```

## Breitensuche (BFS) — Intuition
Vereinfachter Algorithmus für das Gefühl, wie BFS funktioniert *(text generated by ChatGPT, checked for correctness by Maxine)*:
- Erstelle eine leere Warteschlange Q.
- Markiere alle Knoten als nicht besucht.
- Markiere den Startknoten s als besucht.
- Lege s in die Warteschlange Q.
- Solange die Warteschlange nicht leer ist, tue Folgendes:
  - Nimm den vordersten Knoten v aus der Warteschlange heraus.
  - Für jeden Nachbarn u von v: wenn u noch nicht besucht wurde → markiere u als besucht, lege u in die Warteschlange Q.
- Beende die Suche, wenn alle erreichbaren Knoten besucht wurden.
- Diagram: binary-tree-like structure used to illustrate visited (blue) vs. not-visited (white) coloring during traversal.

### Warum BFS?
- BFS wird verwendet, um in der Graphentheorie den **kürzesten Pfad** zwischen 2 Knoten zu bestimmen.
- **ACHTUNG!** Ein Durchlauf von BFS bestimmt den kürzesten Pfad von nur **einem** Knoten s zu **allen anderen** Knoten v.
- Example graph used throughout: nodes 1(gray/start,s=1), 2, 3, 5, 4, 6 — same structure as the adjacency-matrix example above (1→4,1→5,2→1,2→2 self-loop,4→2,5→6,6→4, node 3 isolated).

### BFS aus der Vorlesung
Warum ist der Algorithmus aus der Vorlesung "komplizierter"?
- Wir möchten den Algorithmus ausführen können und dabei **schriftlich festhalten**, was wir gemacht haben. Dazu werden die Farben **WHITE, GRAY, BLACK** eingeführt.
  - WHITE = unbesucht / noch nicht besucht.
  - GRAY = besucht → in der Queue für nächsten Schritt.
  - BLACK = abgeschlossen, nicht mehr besuchbar.
- Außerdem können wir mit BFS den kürzesten Pfad von s zu jedem (erreichbaren) Knoten v bestimmen.
- Dazu benötigen wir die Variable **dist** (für distance), die für jeden Knoten erstellt wird. Nach Beenden von BFS wird uns dist am Knoten v die kürzeste Distanz von s nach v sagen.
- Wir möchten den Weg auch **rekonstruieren** können, daher haben wir die Variable **pred** (für predecessor). Für jeden Knoten v wird pred nach Beenden des Algorithmus den Vorgänger gespeichert haben, für den der kürzeste Weg von s nach v entsteht.

**Pseudocode (BFS):**
```
BFS(G,s) //G=(V,E), s=source node in V

1  FOREACH u in V-{s} DO
2     u.color=WHITE; u.dist=+∞; u.pred=NIL;
3  s.color=GRAY; s.dist=0; s.pred=NIL;
4  newQueue(Q);
5  enqueue(Q,s);
6  WHILE !isEmpty(Q) DO
7     u=dequeue(Q);
8     FOREACH v in adj(G,u) DO
9        IF v.color==WHITE THEN
10          v.color=GRAY; v.dist=u.dist+1; v.pred=u;
11          enqueue(Q,v);
12    u.color=BLACK;
```
`adj(G,u)` = Liste aller Knoten $v \in V$ mit $(u,v) \in E$ (Reihenfolge irrelevant).
- WHITE = unbesucht; GRAY = besucht → in Queue; BLACK = abgeschlossen, nicht mehr besuchbar.
- pred = Vorgänger; dist = distanz zu s.

**Worked example (path reconstruction):** Startknoten s=1. After BFS completes: node 1: dist=0/pred=NIL; node 2: dist=2/pred=4; node 3: dist=+∞/pred=NIL (unreachable); node 4: dist=1/pred=1; node 5: dist=1/pred=1; node 6: dist=2/pred=5. (Diagram annotation format is `dist/pred` next to each node.)
- Beispiel: wir wollen den kürzesten Weg zu 6 herausfinden → wir schauen uns 6 an: wir brauchen 2 Kanten (dist=2) und der Vorgänger ist Knoten 5 → wir schauen uns Knoten 5 an: wir brauchen noch 1 Kante und der Vorgänger ist Knoten 1 → So haben wir nun unseren Weg rekonstruiert: **1 → 5 → 6**.

## Tiefensuche (DFS) — Intuition
Pseudocode für Tiefensuche (DFS) in natürlicher Sprache *(text generated by ChatGPT, checked for correctness by Maxine)*:
- Starte bei einem Anfangsknoten.
- Markiere den Knoten als "besucht".
- Für jeden Nachbarn dieses Knotens: wenn der Nachbar noch nicht besucht wurde → Rufe die Tiefensuche rekursiv für diesen Nachbarn auf.
- Beende die Suche, wenn alle erreichbaren Knoten besucht wurden.

### Warum DFS?
DFS benutzen wir nicht, um den kürzesten Weg zu bestimmen. Um eine Intuition zu bekommen, wo die Anwendung von DFS liegt, kann man sich **Backtracking** anschauen (illustrated via a maze/Labyrinth example):
- Angenommen wir stehen in einem Labyrinth und wollen den Ausgang finden, wissen aber nicht wie wir laufen müssen (keine Karte/Übersicht, kurzsichtig — sehen nicht wie der Weg in 2m Entfernung aussieht).
- Strategie: Wenn wir an einer Kreuzung stehen, wählen wir (zufällig) eine der Richtungen. Wenn wir nicht weiter laufen können, gehen wir zur letzt-besuchten Kreuzung zurück und nehmen dort die andere Richtung.
- **Full worked maze trace (step by step, matching the maze diagrams exactly):**
  1. Stehen am Eingang, können links oder geradeaus laufen. Entscheiden uns zuerst nach links zu laufen.
  2. Stoßen gegen eine Wand, können nicht weiter → gehen zur letzten Kreuzung zurück → wählen nächste Option: geradeaus → treffen auf nächste Kreuzung.
  3. Einzige mögliche Option: nach unten → laufen bis wir nicht mehr können oder mehr Optionen haben → wählen (zufällig) oben → wählen zufällig rechts → wählen zufällig geradeaus → immer die Option die wir können (rechts, nochmal rechts) → stoßen an eine Wand.
  4. Gehen zur letzten Kreuzung zurück, schauen ob andere Möglichkeit besteht anders zu laufen → können sonst in keine andere Richtung (alle möglichen ausprobiert) → gehen eine Kreuzung zurück, schauen ob da andere Möglichkeit → auch hier keine andere Richtung → eine Kreuzung zurück...
  5. Möglichkeit nach oben besteht → gehen nach oben → nach rechts → Wand → eine Kreuzung zurück → keine Möglichkeit anders zu laufen → eine Kreuzung zurück → beide Möglichkeiten ausprobiert, beide führen in eine Sackgasse, keine Option mehr frei → eine Kreuzung zurück...
  6. Einzige freie Möglichkeit: hoch → wir gehen nach oben → wählen zufällig: hoch → rechts (einzige freie Möglichkeit) → zufällig hoch → **Ausgang gefunden!**
- Um das Ganze als Graph zu betrachten, auf dem DFS läuft, erstellen wir folgenden Graphen (bei Backtracking ist das ein Baum): Die Knoten beschreiben alle Möglichkeiten wie man laufen kann. DFS würde jetzt, wie wir vorhin gelaufen sind, durch diesen Graphen laufen. (Diagram: chain of maze-snapshot nodes with branching at decision points, forming a tree matching the backtracking path taken.)
- DFS wird also zur Suche von Knoten genutzt. Das kann BFS theoretisch auch, ist aber ineffizienter, weil wir dort immer alle Knoten auf einer "Ebene" (Nachbarn) betrachten, während wir hier mit einem Weg in der Tiefe des Graphen suchen, was im Durchschnitt schneller ist.
- DFS nutzen wir aber auch, um **starke Zusammenhangskomponenten** zu finden.

### DFS - Vorlesung
- Wir führen die Variable **disc** (discovery time) ein: benötigt, um während der Ausführung von DFS einen äquivalenten DFS-Baum aufzeichnen zu können (per Algorithmus — für die Klausur ist das nur unnötig aufwendig).
- Wir führen die Variable **finish** (finish time) ein: benötigt für das topologische Sortieren (bzw. um die Korrektheit beweisen zu können).
- Wir führen die Variable **time** ein, um disc und finish setzen zu können. Time wird immer dann erhöht, wenn DFS-Search neu aufgerufen wird.
- Wir führen die Variablen **WHITE, GREY, BLACK** ein, um unterscheiden zu können, ob ein Knoten schon besucht oder sogar abgeschlossen ist (und auch für Baumkanten).

**Pseudocode (DFS):**
```
DFS(G) //G=(V,E)

1  FOREACH u in V DO
2     u.color=WHITE;
3     u.pred=NIL;
4  time=0;
5  FOREACH u in V DO
6     IF u.color==WHITE THEN
7        DFS-VISIT(G,u)
```
```
DFS-VISIT(G,u)

1  time=time+1;
2  u.disc=time;
3  u.color=GRAY;
4  FOREACH v in adj(G,u) DO
5     IF v.color==WHITE THEN
6        v.pred=u;
7        DFS-VISIT(G,v);
8  u.color=BLACK;
9  time=time+1;
10 u.finish=time;
```
**Laufzeit** = $O(|V| + |E|)$. `time` is a global variable.

**Demo of DFS (hand-drawn example):** Nodes A, B, C, D(labeled "J" in transcription—likely D), E. Edges: A→B, B→C, A→D, B→E (per diagram: A points to B and to a lower node; B points to C and to a lower node E). Discovery/finish/pred annotations shown as `(disc | finish | pred)`:
- A: `(1 | 10 | nil)`
- (lower-left node, "J"/D): `(2 | 3 | A)`
- B: `(4 | 9 | A)`
- E (lower-middle node): `(5 | 6 | B)`
- C: `(7 | 8 | B)`
- Red trace line shows the DFS path: A → (down to D, back) → B → (down to E, back) → C → back to A.

## Starke Zusammenhangskomponenten (SCC)
- In einer SCC können wir von jedem Knoten in der SCC jeden anderen Knoten in der SCC erreichen, d.h. wenn es einen Weg von u nach v gibt, gibt es genauso auch einen von v nach u.
- Wir können DFS nutzen, um per Algorithmus diese zu bestimmen.
- In der Anwendung schauen wir aber einfach nur, ob wir welche mit den "Augen" finden.
- **Example graph (9 nodes):** 1→2, 2→1, 1→4, 2→5, 4→1, 4→5, 5→2, 2→3, 3→6, 6→3, 4→7, 5→9, 7→8, 8→7, 9→7, 8→9(or similar cycle), 9→... — SCCs shown (shaded): {1,2,4,5}, {3,6}, {7,8,9}.

### Slido quiz prompts embedded in slides (no answers given, for self-testing):
- "Was liefert der Eintrag $(A^m)[i,j]$, wenn A die Adjazenzmatrix eines Graphen ist?"
- "Was beschreibt eine Adjazenzliste korrekt?"
- "Welche Aussage über BFS (Breadth-First Search) ist korrekt?"
- "Welche Aussage beschreibt den Unterschied zwischen DFS und BFS korrekt?"
- "SCC: Was kann beim Hinzufügen einer einzigen Kante in einem gerichteten Graphen passieren?"

## G2 Adjazenzmatrix und -liste (Exercise + Solution)

**Exercise:**
(a) Geben Sie die Adjazenzmatrix und Adjazenzliste eines vollständigen binären Baumes mit 7 Knoten an. Nummerieren Sie die Knoten von oben nach unten und von links nach rechts.
(b) Geben Sie für Adjazenzmatrizen und Adjazenzlisten die asymptotische Laufzeit an, um zu überprüfen, ob eine Kante zwischen zwei Knoten liegt.
(c) Geben Sie je einen Algorithmus an, um eine Adjazenzmatrix in eine Adjazenzliste und umgekehrt umzurechnen.

**Solution (a):** Complete binary tree, 7 nodes numbered 1 (root), 2,3 (level 2, left/right), 4,5,6,7 (level 3: children of 2 are 4,5; children of 3 are 6,7).

Adjacency matrix (undirected, 7×7):
```
   1  2  3  4  5  6  7
1  0  1  1  0  0  0  0
2  1  0  0  1  1  0  0
3  1  0  0  0  0  1  1
4  0  1  0  0  0  0  0
5  0  1  0  0  0  0  0
6  0  0  1  0  0  0  0
7  0  0  1  0  0  0  0
```
Adjacency list:
```
1: 2, 3
2: 1, 4, 5
3: 1, 6, 7
4: 2
5: 2
6: 3
7: 3
```

**Solution (b):** Für Adjazenzmatrizen muss man einen Matrixeintrag überprüfen, also liegt die Laufzeit in $O(1)$. Für Adjazenzlisten muss man die Liste für einen Knoten durchsuchen, welche die maximale Länge $|V|$ hat. Damit ist die Laufzeit für Adjazenzlisten in $O(|V|)$.

**Solution (c):**
```
MatrixToList(M)
31: n ← M.rows()
32: L ← Array(n)
33: for i in 0,...,n-1 do
34:    L[i] ← List()
35:    for j in 0,...,n-1 do
36:       if M[i][j] == 1 then
37:          L[i].append(j)
38: return L
```
Für die Umwandlung: durchläuft die Matrix M und bestimmt die Anzahl der Zeilen n. Anschließend wird ein Array L der Länge n initialisiert. Für jede Zeile i der Matrix wird eine leere Liste L[i] erstellt. Daraufhin wird jede Spalte j der Matrix durchlaufen, und falls M[i][j] = 1, wird j zur Liste L[i] hinzugefügt. Schließlich gibt der Algorithmus die Adjazenzliste L zurück.

```
ListToMatrix(L)
11: n ← L.length
12: M ← Matrix(n × n)
13: for i in 0,...,n-1 do
14:    for j in 0,...,n-1 do
15:       M[i][j] ← 0
16: for i in 0,...,n-1 do
17:    node ← L[i].head()
18:    while node ≠ L[i].nil() do
19:       j ← node.entry
20:       M[i][j] ← 1
21:       node ← node.next()
22: return M
```
Umgekehrt: Länge n der Liste L bestimmen, n×n Matrix M mit Nullen initialisieren. Für jede Liste L[i] die Elemente durchlaufen und M[i][j] auf 1 setzen, wenn j sich in der Liste befindet. Schließlich gibt der Algorithmus die Adjazenzmatrix M zurück.

## G3 - BFS - Anwendung (Exercise + Solution)

**Exercise:** Graph with directed edges: 6→1, 6→3, 1→5, 1→3, 5→3, 3→2, 3→7, 2→4, 2→7, 7→3 (approx., per diagram: nodes 6,1,5,4 on top row, 3,2 in middle, 7 at bottom; edges 6→1, 6→3, 1→5, 1→3, 5→3, 3→2, 2→4, 2→7, 3→7, 7→3).

Führen Sie auf G eine Breitensuche ausgehend vom Knoten 6 aus. Wenn mehrere Knoten zur Wahl stehen, wählen Sie zuerst immer den Knoten mit dem kleinsten Schlüssel aus. Füllen Sie die Tabelle: für jede while-Schleifen-Iteration angeben, welcher Knoten u bearbeitet wird, welche Nachbarn v entdeckt werden, und welche Elemente sich in Q am Ende der Iteration befinden. Geben Sie anschließend für jeden Knoten die Distanz zum Ursprungsknoten 6 sowie den Vorgängerknoten an.

**Solution table:**
| Iteration | u | v | Q |
|---|---|---|---|
| 0 | – | ☐ | [6] |
| 1 | 6 | 1, 3 | [1, 3] |
| 2 | 1 | 5 | [3, 5] |
| 3 | 3 | 2 | [5, 2] |
| 4 | 5 | ☐ | [2] |
| 5 | 2 | 4, 7 | [4, 7] |
| 6 | 4 | ☐ | [7] |
| 7 | 7 | ☐ | [] |

**Final dist/pred per node:** node 6: 0/nil; node 1: 1/6; node 3: 1/6; node 5: 2/1; node 2: 2/3; node 4: 3/2; node 7: 3/2.

## G3 - DFS - Anwendung (Exercise + Solution)

**Exercise:** (same graph as above). Führen Sie auf G eine Tiefensuche aus. Wenn mehrere Knoten zur Wahl stehen, wählen Sie zuerst immer den Knoten mit dem kleinsten Schlüssel aus. Geben Sie für jeden Knoten die jeweilige Entdeckungszeit, Abschlusszeit und den Vorgängerknoten an. (Given as a hint: node 1 has Entdeckungszeit=1, Abschlusszeit=12, Vorgängerknoten=nil — i.e. DFS starts at node 1, not 6, in this particular exercise variant.)

**Solution table:**
| Knoten | Entdeckungszeit | Abschlusszeit | Vorgängerknoten |
|---|---|---|---|
| 1 | 1 | 12 | nil |
| 2 | 3 | 8 | 3 |
| 3 | 2 | 11 | 1 |
| 4 | 4 | 5 | 2 |
| 5 | 9 | 10 | 3 |
| 6 | 13 | 14 | nil |
| 7 | 6 | 7 | 2 |

## G4 SCC-Anwendung (Exercise + Solution)

**SCC Algorithm (from lecture):**
```
SCC(G) // G=(V,E) directed graph

1  run DFS(G)
2  compute G^T
3  run DFS(G^T) but visit vertices in main loop
      in descending finish time from step 1
4  output each DFS tree in 3 as one SCC
```
- Warum das funktioniert, ist auf den Folien gut erklärt (referenced but not detailed in these notes); wird sich aber durchs Anwenden richtig klären.

**Exercise (b):** Führen Sie den Algorithmus zur Bestimmung von starken Zusammenhangskomponenten auf folgendem Graphen aus. Wählen Sie dabei in der Tiefensuche immer das lexikographisch kleinste Element, falls Sie zwischen mehreren Knoten wählen müssen.

**Graph:** nodes q, r, s, t, u, v, w, x, y, z. Edges (per diagram): q→s, q→t, q→v (or s→v), s→v, s→w, v→w, w→s, t→x, t→y, x→z, z→x (cycle x↔z), y→q, y→t, r→u, r→y, u→y, y→r(?), q←y.

**Solution — Erste Ausführung von DFS(G):**
| Knoten | Entdeckungszeit | Abschlusszeit | Vorgängerknoten |
|---|---|---|---|
| q | 1 | 16 | nil |
| r | 17 | 20 | nil |
| s | 2 | 7 | q |
| t | 8 | 15 | q |
| u | 18 | 19 | r |
| v | 3 | 6 | s |
| w | 4 | 5 | v |
| x | 9 | 12 | t |
| y | 13 | 14 | t |
| z | 10 | 11 | x |

**Solution — Zweite Ausführung von DFS($G^T$), visiting in descending finish-time order from first run (q,t,y,x,z,s,v,w,r,u):**
| Knoten | Entdeckungszeit | Abschlusszeit | Vorgängerknoten |
|---|---|---|---|
| q | 5 | 10 | nil |
| r | 1 | 2 | nil |
| s | 15 | 20 | nil |
| t | 7 | 8 | y |
| u | 3 | 4 | nil |
| v | 17 | 18 | w |
| w | 16 | 19 | s |
| x | 11 | 14 | nil |
| y | 6 | 9 | q |
| z | 12 | 13 | x |

**Resulting SCCs (shaded groups in final diagram):** {s, v, w} (triangle), {q, t, y} , {r}, {u}, {x, z}. (Diagram shows groupings: {v,w} with s forming a triangle-shaded group; {q,t,y} shaded together; {x,z} shaded together; r and u each their own singleton SCC.)

---

*(Page "Automaten" appears as a section-title placeholder at the end of file 9, page 44, with no body content — likely the start of the next topic covered in a subsequent file.)*

---

# AUD Maxine 10 (AUD Maxine 10_260529_122303.pdf)

> Same source type: printed slide deck **"AUD Übungsgruppe 2" by M.Konz**, dated **30.06.2025**, topic = Minimum Spanning Trees (Prim, Kruskal, Bellman-Ford). Footer: "AUD | Übungsgruppe 2 | M.Konz".

## Wiederholung — Minimale Spannbäume

### Minimale Spannbäume — Definition
- Für einen **zusammenhängenden, ungerichteten, gewichteten** Graphen $G=(V,E)$ mit Gewichten $w$ ist der Subgraph $T=(V,E_T)$ von $G$ ein Spannbaum ("spanning tree"), wenn $T$ **azyklisch** ist und **alle Knoten verbindet**.
- Der Spannbaum ist **minimal**, wenn die Summe über alle Kantengewichte innerhalb dieses Spannbaumes,
  $$w(T) = \sum_{\{u,v\}\in E_T} w(\{u,v\})$$
  minimal für alle Spannbäume von $G$ ist.
- Example graph: nodes a,b,c,d,e,f,g,h,i with weighted edges; MST highlighted (edges a-b(4), b-c(8) [or similar], c-d(7), d-e(9)? — exact MST trace not detailed on this overview slide, just the concept illustration with total weight annotations shown in a separate small example, "Total weight: 51").

## Wiederholung - Prim

### Algorithmus von Prim
**Start:**
- Es gibt einen Startknoten r: $key = -\infty, pred = NIL$.
- Für alle anderen Knoten: $key = \infty, pred = NIL$.
- Alle Knoten werden einmal betrachtet, also in Q gespeichert.

**Wiederhole:**
- Reihenfolge: der, der momentan den kleinsten key-Wert hat, wird zuerst rausgeholt = u.
- Für diesen Knoten u werden key und pred aller benachbarten Knoten v aktualisiert, **wenn v noch in der Queue** und wenn das Gewicht der Kante (u,v) kleiner als key von v ist.

**Pseudocode:**
```
MST-Prim(G,w,r) // r root in V, MST given through v.pred values

1  FOREACH v in V DO {v.key=∞; v.pred=NIL;}
2  r.key=-∞; Q=V;
3  WHILE !isEmpty(Q) DO
4     u=EXTRACT-MIN(Q); //smallest key value
5     FOREACH v in adj(u) DO
6        IF v∈Q and w({u,v})<v.key THEN
7           v.key=w({u,v});
8           v.pred=u;
```
**Laufzeit:** $O(|E| + |V| \cdot \log|V|)$

**Worked example graph:** Nodes A, B, C, D. Edges: A-B (weight 1), A-C (weight 3), B-C (weight 3), B-D (weight 6), C-D (weight 4). Start at r=A.

**Full step-by-step trace:**
1. **Init:** A.key=-∞/pred=NIL; B.key=∞/pred=NIL; C.key=∞/pred=NIL; D.key=∞/pred=NIL. Q=[A,B,C,D].
2. **Extract A** (min=-∞). Update neighbors: B.key=1/pred=A (since w(A,B)=1<∞); C.key=3/pred=A (since w(A,C)=3<∞). D unaffected (not adjacent to A). Q=[B,C,D].
3. **Extract B** (min key=1). Update neighbors still in Q: C — w(B,C)=3, not < C.key(3) → no change; D.key=6/pred=B (w(B,D)=6<∞). Q=[C,D].
4. **Extract C** (min key=3). Update neighbors still in Q: D — w(C,D)=4, not < D.key(6)? Actually 4<6 → D.key=4/pred=C. Q=[D].
5. **Extract D** (min key=4). Q=[] — done.

**Resulting MST:** edges A-B (1), A-C (3), C-D (4) [pred values: B.pred=A, C.pred=A, D.pred=C].

### Prim-Klausuranwendung (exam-style table method)
Two side-by-side tables for tracking key (`.k`) and predecessor (`.p`) values, one column per node plus a "u" (or "Q") column, filled in "direkt hinschreiben" (write directly) style — each row shows the updated state after processing one node, using "=" to indicate unchanged from previous row.

**Worked example on the same A-B-C-D graph (A=1,B=3,C=6,D=4 edges as above):**

Key table:
| A.k | B.k | C.k | D.k | u |
|---|---|---|---|---|
| -∞ | ∞ | ∞ | ∞ | – |
| = | 1 | 3 | = | A |
| = | = | = | 6 | B |
| = | = | = | 4 | C |
| = | = | = | = | D |

Pred table:
| A.p | B.p | C.p | D.p | Q |
|---|---|---|---|---|
| NIL | NIL | NIL | NIL | {A,B,C,D} |
| = | A | A | = | {B,C,D} |
| = | = | = | B | {C,D} |
| = | = | = | C | {D} |
| = | = | = | = | {} |

**Method notes:** Initialisiere Tabellen siehe "direkt hinschreiben". Wiederhole: Suche in Key-Tabelle nach kleinstem key in noch nicht betrachteten Knoten (dort, wo noch nicht die gesamte Spalte voll ist). Aktualisiere key-Tabelle: sollte die Kante zu den Nachbarn kleiner sein als das, was in der Spalte aktuell steht. Aktualisiere predecessor-Tabelle, wenn sich key verändert hat. Tip: Um schneller und übersichtlicher zu arbeiten: wenn Knoten abgeschlossen, Spalte mit "=" ausfüllen, dadurch weniger Fehler und schnelleres Arbeiten.

## G2 – Algorithmus von Prim (Exercise + Solution)

**Exercise:** Führen Sie den Algorithmus von Prim auf dem folgenden Graphen aus. Beginnen Sie im Knoten **a**. Dabei sollen Knoten mit gleichem Key-Wert alphabetisch sortiert bearbeitet werden. Geben Sie den gefundenen minimalen Spannbaum an.

**Graph (8 nodes a,b,c,d,e,f,g,h):** Edges: a-b(1), a-d(10), a-f(3), b-c(8), b-d(2), b-e(7), c-e(15), c-h(6), d-g(8), e-g(3), e-h(5), f-g(2), g-h(10).

**Solution — full key table trace:**
| a.k | b.k | c.k | d.k | e.k | f.k | g.k | h.k | u |
|---|---|---|---|---|---|---|---|---|
| -∞ | ∞ | ∞ | ∞ | ∞ | ∞ | ∞ | ∞ | – |
| = | 1 | = | 10 | = | 3 | = | = | a |
| = | = | 8 | 2 | = | = | = | = | b |
| = | = | = | = | = | 1 | 8 | = | d |
| = | = | = | = | 3 | = | 2 | = | f |
| = | = | = | = | = | = | = | 10 | g |
| = | = | 6 | = | = | = | = | 5 | e |
| = | = | = | = | = | = | = | = | h |
| = | = | = | = | = | = | = | = | c |

(Row-by-row: after processing a → b.k=1, d.k=10, f.k=3; after processing b → c.k=8, d.k=2 [improved]; after processing d → f.k stays 3 or improves — table shows f getting 1 via d, g.k=8 via d; after processing f → e.k=3, g.k=2 [improved via f]; after processing g → h.k=10; after processing e → c.k=6 [improved], h.k=5 [improved]; then h, then c processed, both with all "=" i.e. no further updates.)

**Predecessor table trace:**
| a.p | b.p | c.p | d.p | e.p | f.p | g.p | h.p | Q |
|---|---|---|---|---|---|---|---|---|
| nil | nil | nil | nil | nil | nil | nil | nil | {a,b,c,d,e,f,g,h} |
| = | a | = | a | = | a | = | = | {b,c,d,e,f,g,h} |
| = | = | b | b | = | = | = | = | {c,d,e,f,g,h} |
| = | = | = | = | = | d | d | = | {c,e,f,g,h} |
| = | = | = | = | f | = | f | = | {c,e,g,h} |
| = | = | = | = | = | = | = | g | {c,e,h} |
| = | = | h | = | = | = | = | e | {c,h} |
| = | = | = | = | = | = | = | = | {c} |
| = | = | = | = | = | = | = | = | {} |

**Resulting minimum spanning tree edges (highlighted red in diagram):** a-b, b-d, d-f, f-g, g-e (via e.pred=f, edge f-e weight 3), e-h, h-c. I.e. MST edges: {a,b}, {b,d}, {d,f}, {f,g}, {f,e}, {h,e} [or {e,h}], {h,c}.

## Wiederholung - Kruskal

### Kruskal — Algorithm description
- Jeder Knoten erhält seine eigene Menge, die den eigenen Knoten enthält.
- Kanten werden nach Gewicht aufsteigend sortiert.
- Jede Kante wird zu der anfangs leeren Menge A hinzugefügt, wenn beide Knoten in unterschiedlichen Mengen liegen.
- Mengen beider Knoten werden vereinigt.

**Worked example (A-B-C-D graph, weights A-B=1, A-C=3, B-C=3, C-D=4, B-D=6):**
- Initial sets: {A}, {B}, {C}, {D}.
- Sorted edges: {A,B}(1), {A,C}(3), {B,C}(3), {C,D}(4), {B,D}(6).
- Process {A,B}(1): A,B in different sets → add. Sets merge: {A,B}. Sets now: {A,B}, {C}, {D}. $A=\{\{A,B\}\}$.
- Process {A,C}(3): A,C in different sets → add. Sets merge: {A,B,C}. $A=\{\{A,B\},\{A,C\}\}$.
- Process {B,C}(3): B,C now in the **same** set → skip (would form cycle). Note: "B,C in der selben Menge."
- (Continues with {C,D} and {B,D} — diagram shows sorted list continuing but cropped in this overview slide; the exercise version below completes it in full.)

### Kruskal - Klausuranwendung (exam-style table method)
- Start: {u,v} sortiert nach Kantengewicht hinschreiben (aufsteigend) und w({u,v}) auch hinzufügen.
- 1. Zeile *sets* anpassen, wenn nicht vorgegeben mit $set(x) = x\ \forall x \in V$.
- Erste Kante wird immer hinzugefügt, deswegen dort auch direkt "j" (für ja) hinschreiben.
- Wiederhole: Wenn u und v in unterschiedlichen Mengen, vereinige beide Mengen und passe Mengen aller Knoten an, die in den Mengen enthalten waren.

**Worked example table (A-B-C-D graph):**
| {u,v} | w({u,v}) | Dazu? | set(A) | set(B) | set(C) | set(D) |
|---|---|---|---|---|---|---|
| – | – | – | {A} | {B} | {C} | {D} |
| {A,B} | 1 | j | {A,B} | {A,B} | = | = |
| {A,C} | 3 | j | {A,B,C} | {A,B,C} | {A,B,C} | = |
| {B,C} | 3 | n | = | = | = | = |
| {C,D} | 4 | j | {A,B,C,D} | {A,B,C,D} | {A,B,C,D} | {A,B,C,D} |
| {B,D} | 6 | n | = | = | = | = |

## G3 - Kruskal (Exercise + Solution)

**Exercise:** Führen Sie den Algorithmus von Kruskal auf dem folgenden Graphen aus. Kanten mit gleichem Gewicht sollen dabei alphabetisch sortiert bearbeitet werden (z.B. wird {d,h} vor {e,h} betrachtet). Füllen Sie die Vorlage aus: Kante {u,v}, Gewicht w({u,v}), ob die Kante dem MST hinzugefügt wird (j/n), sowie die Menge set(s) für jeden Knoten am Ende des betrachteten Schrittes.

**Graph (8 nodes a,b,c,d,e,f,g,h):** Edges: c-d(1), f-g(1), d-e(2), f-h(3), c-a(4), a-d(4), a-b(5), a-e(6), g-h(6), d-h(7), e-h(7), a-g(8).

**Solution table (full):**
| {u,v} | w({u,v}) | Dazu? | set(a) | set(b) | set(c) | set(d) | set(e) | set(f) | set(g) | set(h) |
|---|---|---|---|---|---|---|---|---|---|---|
| ☐ | ☐ | ☐ | {a} | {b} | {c} | {d} | {e} | {f} | {g} | {h} |
| {c,d} | 1 | j | = | = | {c,d} | {c,d} | = | = | = | = |
| {f,g} | 1 | j | = | = | = | = | = | {f,g} | {f,g} | = |
| {d,e} | 2 | j | = | = | {c,d,e} | {c,d,e} | {c,d,e} | = | = | = |
| {f,h} | 3 | j | = | = | = | = | = | {f,g,h} | {f,g,h} | {f,g,h} |
| {a,c} | 4 | j | {a,c,d,e} | = | {a,c,d,e} | {a,c,d,e} | {a,c,d,e} | = | = | = |
| {a,d} | 4 | n | = | = | = | = | = | = | = | = |
| {a,b} | 5 | j | {a,b,c,d,e} | {a,b,c,d,e} | {a,b,c,d,e} | {a,b,c,d,e} | {a,b,c,d,e} | = | = | = |
| {a,e} | 6 | n | = | = | = | = | = | = | = | = |
| {g,h} | 6 | n | = | = | = | = | = | = | = | = |
| {d,h} | 7 | j | {a,b,c,d,e,f,g,h} | {a,b,c,d,e,f,g,h} | {a,b,c,d,e,f,g,h} | {a,b,c,d,e,f,g,h} | {a,b,c,d,e,f,g,h} | {a,b,c,d,e,f,g,h} | {a,b,c,d,e,f,g,h} | {a,b,c,d,e,f,g,h} |
| {e,h} | 7 | n | = | = | = | = | = | = | = | = |
| {a,g} | 8 | n | = | = | = | = | = | = | = | = |

**Resulting minimum spanning tree edges (highlighted red in diagram):** {c,d}, {f,g}, {d,e}, {f,h}, {a,c}, {a,b}, {d,h}. (7 edges for 8 nodes — correct for a spanning tree.)

## G4 – Prim vs. Kruskal (Exercise + Solution)

**Context:** In der Klausur ist das Erkennen beider Algorithmen anhand von Graphen oft eine Klausuraufgabe. Man bekommt Graphen, auf denen einer der beiden oder keiner der beiden Algorithmen ausgeführt worden ist. Man sieht einen "Zwischenschritt", wie der Spannbaum bis zu diesem Zeitpunkt konstruiert worden ist. Ziel ist es, anhand von bestimmten Punkten erkennen zu können, ob und welcher Algorithmus angewendet worden ist.

**Decision criteria (diagram/flowchart):**
- **Zyklen** (cycles) in the highlighted edge set → **keine** (none of Prim/Kruskal could have produced this; a valid MST-in-progress is always acyclic).
- **Disjunkt** (the highlighted edges form disjoint components, not all touching one growing tree) → **Kruskal/keine** (Prim always grows a single connected tree from the root, so disjoint edge sets rule out Prim).
- "Von allen Nachbarn im minimalen Spannbaum haben alle Kanten größere Kantengewichte" (checking Prim: from every node currently in the tree, is the next edge always the locally cheapest available?) → **Wenn nein, dann nicht Prim**.
- "Alle günstigsten Kanten im gesamten Graphen enthalten?" (checking Kruskal: are all globally-cheapest available edges included, in weight order, whenever they don't form a cycle?) → **Wenn nein, dann nicht Kruskal**.
- Note: "Evtl unvollständig" (this checklist may be incomplete — flagged by student as a caveat).

**Exercise:** Im Folgenden geht es darum, die Unterschiede zwischen dem Algorithmus von Prim und Kruskal zu erarbeiten. Bestimmen Sie jeweils, ob die hervorgehobene Kantenmenge durch eine (eventuell frühzeitig abgebrochene) Ausführung des Algorithmus von Kruskal oder von Prim entsteht, oder ob beide oder keine dieser Möglichkeiten zutrifft. Geben Sie je nachdem "Kruskal", "Prim", "Beide", oder "Keine" an und begründen Sie Ihre Wahl.

**Four graphs, each on nodes a,b,c,d,e,f with edges:** a-b(4), a-d(2), b-c(3), b-e(7), d-b(8), d-f(5), c-e(2), e-f(1). Each graph variant highlights a different subset of edges in blue:
- **Graph A** — highlighted: {a,d}, {a,b}... wait per image: highlighted edges = a-d(2), b-c... [highlighted: a-d, and c-e, and e-f — forming disjoint pairs].
- **Graph B** — highlighted: a-b... [b-e, b-f via d-b and e-f].
- **Graph C** — highlighted: a-b, a-d.
- **Graph D** — highlighted: a-b, a-d, b-c, c-e (or similar), e-f.

**Solution — Graph A:** Highlighted edges = {a,d}(2) and {c,e}(2) and {e,f}(1) (disjoint pairs not all touching one tree).
- ✓ Keine Zyklen.
- ✓ Disjunkt → **Kruskal**.
- ✓ Kleinste Kantengewichte sind enthalten.
- ⇒ **Kruskal**.

**Solution — Graph B:** Highlighted edges = {b,e}(7)? / {d,b}(8) and {b,e}(7) [forming a "V" shape through b and e].
- ✓ Keine Zyklen.
- ✓ Nicht disjunkt → könnte beides sein.
- ✓ Kleinste Kantengewichte sind **nicht** enthalten → **nicht Kruskal**.
- **Check für Prim** → wird ausgehend von dem gerade betrachteten Knoten die niedrigste Kante ausgewählt?
  - b als root - niedrigste Kante zu c → nicht enthalten.
  - d als root - n.K. zu a → nicht enthalten.
  - e als root – n.K. zu f – enthalten, nächst-niedrigere Kante zu c – nicht enthalten.
  - f als root – n.K. zu e – enthalten, nächstniedrigere Kante zu c – nicht enthalten.
  - → Keiner der Knoten macht als Startknoten Sinn → **nicht Prim**.
- ⇒ **Keine**.

**Solution — Graph C:** Highlighted edges = {a,b}(4) and {a,d}(2).
- ✓ Keine Zyklen.
- ✓ Nicht disjunkt → könnte beides sein.
- ✓ Kleinste Kantengewichte sind **nicht** enthalten → **nicht Kruskal**.
- **Check für Prim:** a als root - niedrigste Kante zu d → enthalten. Nächstniedrigere Kante zu b → enthalten.
- ⇒ **Prim**.

**Solution — Graph D:** Highlighted edges = {a,b}(4), {a,d}(2), {b,c}(3), {c,e}(2), {e,f}(1) — a spanning structure covering all 6 nodes.
- ✓ Keine Zyklen.
- ✓ Nicht disjunkt → könnte beides sein.
- ✓ Kleinste Kantengewichte sind enthalten → Kruskal und evtl. auch Prim.
- **Check für Prim:** a als root - niedrigste Kante zu d → enthalten. Nächstniedrigere Kante zu b → enthalten … usw (works out for Prim too).
- ⇒ **Prim**, ⇒ **Kruskal**, ⇒ **Beide**.

## G5 Bellman-Ford (Exercise + Solution)

### Bellman-Ford — Concept
- Der Algorithmus besteht aus 2 Teilen.
- Der erste führt den eigentlichen Algorithmus aus, während der zweite im Nachhinein checkt, ob wir nicht negative Zyklen beinhalten.
- Zum ersten Teil: Bellman-Ford iteriert eigentlich nur über die Kantengewichte.

**Exercise:** Führen Sie den Algorithmus von Bellman-Ford auf folgendem Graphen aus. Ausgangspunkt bzw. Quelle für den Algorithmus sei der Knoten **a**. Sortieren Sie für die Schleife die Kanten nach der lexikographischen Ordnung. Füllen Sie die Vorlage aus: die Tabelle enthält einen Block für jede Iteration der for-Schleife im Algorithmus, und in jedem Block eine Zeile für jeden Knoten im Graphen. Geben Sie in jeder Zeile die Distanz d und den Vorgänger ρ für jeden Knoten an, nachdem alle Kanten ausgehend vom gegebenen Knoten betrachtet wurden. Bestimmen Sie anschließend den kürzesten Pfad vom Knoten a zum Knoten e.

**Graph (6 nodes a,b,c,d,e,f):** Edges (directed, with weights): a→c(3), a→b(1), c→b(-3), b→f(-4), c→d(2), b→d(3), d→e(-2), e→f(2).

**Edge processing order (lexicographic):** (a,b), (a,c), (b,d), (b,f), (c,b), (c,d), (d,e), (e,f).

**Solution — method note:** Wir arbeiten der Reihenfolge nach die Kanten ab und addieren das momentan gefundene Gewicht von u + die Kante von u nach v auf. Man beachte, dass die Kante auch ein negatives Kantengewicht haben kann und wir dann subtrahieren.

**Iteration 1 (first pass through all edges in order):**
- Init (before iteration 0): a.d=0/nil; b.d=∞/nil; c.d=∞/nil; d.d=∞/nil; e.d=∞/nil; f.d=∞/nil.
- Process (a,b): b.d=0+1=**1**, b.pred=**a**.
- Process (a,c): c.d=0+3=**3**, c.pred=**a**.
- Process (b,d): d.d=1+3=**4**, d.pred=**b**.
- Process (b,f): f.d=1+(-4)=**-3**, f.pred=**b**.
- Process (c,b): candidate 3+(-3)=0, not < current b.d(1)? Actually 0<1 → but table shows b.d stays "=" (1) at this row per the trace shown — [UNCLEAR: handwritten trace shows "1c: b.d = 0" crossed/marked, possibly indicating this update was considered but the final recorded value shown in the solution figure (Abbildung 1(b)) keeps b at 1 with pred=a; treating the lecture-solution figure as authoritative below].
- Process (c,d): candidate c.d(3)+2=5, not < current d.d(4) → no update.
- Process (d,e): e.d=4+(-2)=**2**, e.pred=**d**.
- Process (e,f): candidate e.d(2)+2=4, not < current f.d(-3) → no update.
- **State after iteration 1** (per Abbildung 1(b) in solution): a.d=0/nil; c.d=3/a; b.d=1/a; d.d=4/b; f.d=-3/b; e.d=∞/nil *(e not yet updated at this snapshot — matches iteration-1 table row "1d: e.d=2" being set within iteration 1 per the process-(d,e) step above; the two depicted snapshots in the slides show slightly staggered states — treat the final converged values below as authoritative)*.

**Iteration 2:**
- Process (a,b): no improvement (0+1=1, not <1).
- Process (a,c): no improvement (0+3=3, not <3).
- Process (b,d): candidate 1+3=4, not < current d.d(4) → no change (per table "2b: d.d=3" — [UNCLEAR: table shows d.d updated to 3 in iteration 2 row "2b", suggesting an updated b.d or c.d path was used; most consistent reading: after c,b edge relaxation in iteration 1 or 2, b.d may have improved via c→b: c.d(3)+(-3)=0 < b.d(1) → b.d=0/pred=c, which would then make b→d: 0+3=3 <4 → d.d=3/pred=b, and b→f: 0+(-4)=-4 < -3 → f.d=-4/pred=b]. This matches the final solution figures.
- Process (b,f): f.d improves to **-4**, f.pred=**b** (via improved b.d=0).
- Process (c,b): b.d improves to **0** (c.d(3) + (-3) = 0 < previous 1), b.pred=**c**.
- Process (c,d): no further improvement beyond the b,d path.
- Process (d,e): e.d = d.d(3) + (-2) = **1**, e.pred=**d**.
- Process (e,f): no improvement (1+2=3, not < -4).
- **State after iteration 2:** a.d=0/nil; c.d=3/a; b.d=0/c; d.d=3/b; f.d=-4/b; e.d=1/d.

**Final converged shortest-path values (from source a):**
- a: 0 (nil)
- b: 0, pred=c
- c: 3, pred=a
- d: 3, pred=b
- e: 1, pred=d
- f: -4, pred=b

**Kürzester Pfad von a zu e:** a → c → b → d → e, with total weight $3 + (-3) + 3 + (-2) = 1$.
