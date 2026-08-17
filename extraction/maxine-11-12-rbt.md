# AUD Maxine 11 (source: `AUD Maxine 11_260529_122303.pdf`, 32 pages)

> Note on source identity: despite the filename, every page of this PDF is the tutorial-session deck **"AUD | Übungsgruppe 2"** by tutor M. Konz, dated **07.07.2025** (footer date). It is not a professor lecture slide deck but the exercise-group (Übungsgruppe) recap/practice session. Content: Prim/Dijkstra review, a worked Klausur-style Dijkstra table exercise, the wolf/goat/cabbage river-crossing problem modeled as a state graph solved with Dijkstra, and Ford-Fulkerson. It ends with administrative slides about Testate (oral spot-checks) and a "Wiederholungsstunde" (review-session) announcement. Slide footer page numbers ("Seite") jump from 29 to 34 (slides 30–33 were apparently removed from the deck before export), so the content is complete even though the visible numbering has a gap.

## Remember Prim? (Wiederholung)

- Prim's algorithm finds an MST (Minimaler Spannbaum / minimum spanning tree).
- Prim always picks the cheapest edge outgoing from the node with the currently lowest key value.
- Worked mini-example on a 4-node graph A, B, C, D with edges: A–B = 1, A–C = 3, B–C = 3 (diagonal), B–D = 6, C–D = 4.
  - Step 1: r = A. key(A) = −∞, pred(A) = NIL. key(B) = ∞, pred(B) = NIL. key(C) = 3 (highlighted), pred(C) = NIL. key(D) = ∞, pred(D) = NIL. Q = [A, B, C, D], min = A.
  - Step 2: A extracted (edge A–B, weight 1, highlighted as taken). key(A) = −∞ pred NIL (done). key(B) = ∞... updates toward 1. key(C) = 3, pred(C) = A. key(D) = ∞, pred(D) = NIL. Q = [B, C, D].
  - Step 3: B extracted next (key 1, pred A now finalized in green). key(C) = 3, pred(C) = A. key(D) = ∞, pred(D) = NIL. Q = [C, D], min pointer shown at this stage per the slide's annotation "Q=[B,C,D] ↑min" then edge B–C (weight 3) highlighted as newly taken.
  - Step 4 (final panel): key(A) = −∞ pred NIL, key(B) = 1 pred A, key(C) = 3 pred A, key(D) = ∞ pred NIL — B–C edge (weight 3) drawn bold/green as part of the tree. Q = [C, D] → [D] as C is extracted.
  - [UNCLEAR: exact intermediate Q-queue contents/arrow placements between panels 3–4; the final MST edges shown bold are A–B(1), A–C(3), B–C(3) — note D's key never updates from ∞ in the visible panels, suggesting the slide's example is cut off before D is finalized, or D is meant to connect via C–D(4)/B–D(6) in a step not fully shown.]

## Dijkstra

- Dijkstra works very similarly to Prim but additionally uses the **Relax** function.
- Relax reminder: for nodes u, v and edge (u,v) with weight w((u,v)):
  - Compare: **if dist(v) > dist(u) + w((u,v))** then
    - Update dist(v) := dist(u) + w((u,v)) (= Relax)
  - Small diagram: dist=7 →(5)→ dist=20 becomes dist=7 →(5)→ dist=12 (relaxed down from 20 to 12 because 7+5=12 < 20).
- Worked trace on same A,B,C,D graph (A–B=1, A–C=3, B–C=3, B–D=6, C–D=4), source s = A:
  - Init: dist(A)=0 pred NIL, dist(B)=1 pred A, dist(C)=3 pred A, dist(D)=∞ pred NIL. (A already relaxes B and C directly since A is source; A–B=1, A–C=3.)
  - Extract min from Q=[B,C,D] → B (dist 1). Relax from B: dist(C) stays 3 (B→C would be 1+3=4 > 3, "keine Veränderung" = no change, marked in red). dist(D) = 1+6 = 7, pred(D)=B.
  - Extract min from Q=[C,D] → C (dist 3, "kleinsten Wert hat C!"). Relax from C: dist(D) via C would be 3+4=7, tie with existing 7 — noted "k.V." (keine Veränderung / no change) in red, dist(D) stays 7 pred B.
  - Q=[D] → D extracted, D has "keine Nachbarn" (no outgoing neighbors) to relax.
  - Final: dist(A)=0 pred NIL, dist(B)=1 pred A, dist(C)=3 pred A, dist(D)=7 pred B.

## Klausuranwendung – Dijkstra (exam-style tabular method)

- Procedure taught for writing Dijkstra as a table in the exam:
  1. First row is given / always the same starting pattern.
  2. From the current row, find the **smallest value that is still in Q** — its node becomes **r** for the next row.
  3. For every neighbor **n** of r compute: `n.d = min( n.key ; dist(r) + w((n,r)) )`.
  4. Once r is "abgeschlossen" (closed/finalized), the rest of that column can be filled with "=" (copy down) — this preserves overview of which columns' minimum may still be searched next step.
- Example graph: A–B=1, A–C=3, B–C=3 (diagonal), B–D=6, C–D=4, start r=A.

| A.d | B.d | C.d | D.d | A.p | B.p | C.p | D.p | r | Q |
|---|---|---|---|---|---|---|---|---|---|
| 0 | ∞ | ∞ | ∞ | nil | nil | nil | nil | – | {A,B,C,D} |
| = | 1 | 3 | = | = | A | A | = | A | {B,C,D} |
| = | = | = | 6 | = | = | = | B | B | {C,D} |
| = | = | = | 4 | = | = | = | C | C | {D} |
| = | = | = | = | = | = | = | = | D | {} |

## G2 – Dijkstra (Übung)

- Task: run Dijkstra starting at node **u** on a 6-node directed graph {u, v, w, x, y, z}, with the rule that ties in shortest-path estimate are broken **alphabetically**.
- Given directed edges (with weights): u→v=15, u→w=3, u→y=7, w→y=6, y→w=2, v→x=10 (and x→v=4 shown reversed with arrowhead), y→v=7, y→z=5, z→x=8, v→x/x→v pair near 4 and 10 (bidirectional-looking arrows between v and x, weights 4 and 10), z→v=1 (arrow into v labeled 1, vertical). [UNCLEAR: exact direction of a couple of the v/x/z arrows — the diagram has several closely-packed arrowheads around v, x, y, z; transcribed as best legible.]
- Fill in a table with columns for each node's `.d` (distance estimate) and `.p` (predecessor), plus which node r is extracted each iteration, and Q at the end of each iteration. Then use the result to find shortest path u→x and draw its edges.

### G2 – Lösung (solution table)

| u.d | v.d | w.d | x.d | y.d | z.d | u.p | v.p | w.p | x.p | y.p | z.p | r | Q |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | ∞ | ∞ | ∞ | ∞ | ∞ | nil | nil | nil | nil | nil | nil | – | {u,v,w,x,y,z} |
| = | 15 | 3 | = | 7 | = | = | u | u | = | u | = | u | {v,w,x,y,z} |
| = | = | = | = | 5 | = | = | = | = | = | w | = | w | {v,x,y,z} |
| = | 12 | = | = | = | 10 | = | y | = | = | = | y | y | {v,x,z} |
| = | 11 | = | 18 | = | = | = | z | = | z | = | = | z | {v,x} |
| = | = | = | 15 | = | = | = | = | = | v | = | = | v | {x} |
| = | = | = | = | = | = | = | = | = | = | = | = | x | {} |

(Reading order in the source table is u.d, v.d, w.d, x.d, y.d, z.d then the six `.p` columns, then r, then Q — reproduced above in that column order.)

## G3 – Flussüberquerung (Wolf, Goat/Sheep, Cabbage river-crossing puzzle)

Constraints (Bedingungen) given on the slide:
- Only the farmer (Bauer) + at most one of {1 animal, or the cabbage} may be in the boat at once.
- Wolf + Sheep may not be left alone together on one side.
- Sheep + Cabbage may not be left alone together on one side.

- Modeling: notation {x, y, ...} means x, y, ... are on the **left** bank. Items: Bauer (B), Kohlkopf/cabbage (K), Schaf/sheep (S), Wolf (W).
- Start state: {B, K, S, W} (everyone on the left), boat on the left.
- First crossing shown: farmer takes the sheep across → remaining on left = {K, W}, right bank state noted as `= {KW}`.
- Second panel: cabbage and wolf remain on the left bank, farmer + sheep now on the right, right-bank set noted `= {KW}` [as the complement label used on the slide].

### Lösung – Mögliche Zustände (possible states)

All legal states (as unordered "left-bank contains" sets), 10 total:
{B,K,S,W} / {∅} — {B,K,S} / {W} — {B,K,W} / {S} — {B,S,W} / {K} — {B,S} / {K,W}

(Top row lists the 10 states as ellipses: {B,K,S,W}, {B,S,W}, {B,K,W}, {B,K,S}, {B,S}, {∅}, {K}, {S}, {W}, {K,W}.)

### Lösung – Mögliche Übergänge (possible transitions → state graph)

- Starting state is always {B,K,S,W}. From there the farmer (as Bauer) can only cross **with the sheep**, because otherwise wolf+cabbage-with-sheep type conflicts would occur (cabbage+sheep or wolf+sheep together unattended).
- First transition drawn: {B,K,S,W} → {K,W} (i.e., after the boat trip, {K,W} remains on the original left bank while {B,S} cross... interpreted from the "= {KW}" label given earlier).
- From {K,W}, the farmer can go back with the sheep, or go back with nothing (leading to further transition edges into the graph — exact edges not enumerated one by one beyond the two example arrows shown; the slide states "Usw. Am Ende entsteht dieser Graph:" and shows a bipartite-style crossing diagram with edges connecting states on the top row to states on the bottom row).
- Final graph (page "Lösung-Mögliche Übergänge", 3rd slide): a bipartite-looking tangle of edges between the 5 states on top ({B,K,S,W}, {B,S,W}, {B,K,W}, {B,K,S}, {B,S}) and the 5 states on bottom ({∅}, {K}, {S}, {W}, {K,W}) — many crossing lines drawn, exact edge list not individually labeled on the slide (visual graph only).

## G3(b) — Solve via Dijkstra with minimal number of crossings

- Approach: use Dijkstra on the state graph above to solve with the **minimal number of river crossings** ⇒ set edge weight = 1 for all paths.
- DP/Dijkstra trace table (columns = the 10 states, using shorthand BKSW, BSW, BKW, BKS, BS, KW, W, S, K, ∅):

| BKSW.d | BSW.d | BKW.d | BKS.d | BS.d | KW.d | W.d | S.d | K.d | ∅.d |
|---|---|---|---|---|---|---|---|---|---|
| 0 | ∞ | ∞ | ∞ | ∞ | ∞ | ∞ | ∞ | ∞ | ∞ |
| = | = | = | = | = | 1 | = | = | = | = |
| = | = | 2 | = | = | = | = | = | = | = |
| = | = | = | 4 | = | = | 3 | = | 3 | = |
| = | 4 | = | = | = | = | = | = | = | = |
| = | = | = | = | 5 | = | = | = | = | = |
| = | = | = | = | = | 6 | = | = | = | = |
| = | = | = | = | = | = | = | = | = | 7 |

Predecessor row (.p columns) and r/Q columns, row by row:

| step | r | Q (remaining) |
|---|---|---|
| 0 | – | {BKSW, BSW, BKW, BKS, BS, KW, W, S, K, ∅} |
| 1 | BKSW | {BSW, BKW, BKS, BS, KW, W, S, K, ∅} |
| 2 | KW | {BSW, BKW, BKS, BS, W, S, K, ∅} |
| 3 | BKW | {BSW, BKS, BS, W, S, K, ∅} |
| 4 | K | {BSW, BKS, BS, W, S, ∅} |
| 5 | W | {BSW, BKS, BS, S, ∅} |
| 6 | BKS | {BSW, BS, S, ∅} |
| 7 | BSW | {BS, S, ∅} |
| 8 | S | {BS, ∅} |
| 9 | BS | {∅} |
| 10 | ∅ | {} |

Predecessors shown: KW.p = BKSW; BKW.p = KW; W.p = BKW, K.p = BKW; BKS.p = K; BSW.p = W; BS.p = BKS; S.p = BSW; ∅.p = BS.

This traces the classic solution: cross with sheep → return alone → cross with wolf (or cabbage) → return with sheep → cross with cabbage (or wolf) → return alone → cross with sheep. 7 crossings total (∅.d = 7).

## G3(c+d) — Follow-up questions

- **Is the found solution the only possible one?** No → the red-colored and green-colored alternative edges in the state graph are equally long (same length/cost), meaning there are multiple minimal-crossing solutions (symmetric alternatives, e.g. swapping the order wolf/cabbage cross).
- **If the farmer must pay a fee of 1€ every time he crosses together with an animal, how does he minimize cost?** → Set edge weight = 1 only for crossings that carry an animal, and 0 otherwise (i.e., crossing alone or with the cabbage costs 0; crossing with wolf or sheep costs 1). Diagram shown with red and green edges marking the animal-carrying transitions between the 10 states.

## Ford-Fulkerson

- Ford-Fulkerson finds the **maximal flow (maximale Auslastung)** through a weighted graph.
- Analogy: water pipes in a city — pipes have different diameters (Kantengewicht = capacity). The amount of water already sent through an edge is tracked via the **Restkapazitätsgraph (residual graph)**.
- Restkapazitätsgraph construction examples shown:
  - Edge 3/5 (used/capacity) → residual edges: forward 2 (remaining capacity), backward 3 (already used, reversible).
  - Edge 0/5 → residual: forward 5, backward 0 (no backward edge needed since nothing used yet).
  - Edge 6/6 (fully saturated) → residual: forward 0 (no forward edge), backward 6.
  - Triangle example: edges 3/15, 0/5, 6/16 → residual triangle with edges 2, 3 / 5 / 3, 6 arranged accordingly.
- Base example graph: S→A=10, S→B=8, A→C=6, A→B=5, B→C=10, B→t=7, C→t=10.

### Ford-Fulkerson procedure (as taught)

So geht Ford-Fulkerson vor:
1. Search (mittels BFS or DFS) some path from source s to sink t.
2. Find the minimal edge weight c_min on this path.
3. Reduce all edge weights w(u,v) along the path from s to t by c_min: `w((u,v)) = w((u,v)) − c_min`.
4. Add c_min to all edge weights w(v,u) along the reverse path from t to s (the back-edges): `w((v,u)) = w(v,u) − c_min` [as literally written on the slide — note the slide writes this as a subtraction even though conceptually it is the residual back-edge capacity increasing; transcribed exactly as shown].
5. Repeat.

(Note added on slide: "In der Klausur schreiben wir zusätzlich noch hin, welchen Pfad wir gerade betrachtet (= hinzugefügt) haben" — in the exam, also always write down which path was just considered/added.)

### Worked Ford-Fulkerson trace (S,A,B,C,t graph, capacities S→A=10, S→B=8, A→C=6, A→B=5, B→C=10, B→t=7, C→t=10)

1. Path found via DFS: S→A→B→t (path highlighted). Minimum capacity on path = 5 (bottleneck A→B). Send 5 through: S→A becomes 5/10 used-form shown as "5, 5" residual (forward 5 remaining... ), A→B becomes 0 residual forward / 5 backward, B→t becomes 2/... Diagrams show residual updates: S–A: 5 (fwd) / 5 (back); A–B: fully used, backward 5; B–t: forward 2, backward 5.
2. New DFS path found within updated residual graph: S→A→C→t. Minimum capacity found = 5. Send 5 through this path (residual updates shown: A–C edge reduces, C–t edge reduces, new back-edges appear).
3. Next DFS path found: S→B→C→t (using freed-up capacity, going backward through some edges as needed) — minimum = 2. Send 2 through.
4. Next DFS path: S→B→A→C→t (using a back-edge B→A which exists because of the earlier forward A→B saturation) — minimum = 1. Send 1 through.
5. Next path: S→B→C→t again, using different remaining residual capacity — minimum = 4. Send 4 through.
6. ⇒ **Kein Weg mehr möglich** (no more augmenting path possible) ⇒ **also umschreiben**: redraw final graph with used/capacity notation.
7. **Maximalen Fluss lässt sich am Eingang ablesen**: how much was fed into the flow network at the source = 10 + 7 = 17 ⇒ **|f| = 17**. Final annotated graph shown: S→A 10/10, S→B 7/8, A→C 6/6, A→B 4/5, B→C 4/10, B→t 10/10, C→t 10/10 [read from the final "10/10, 4/5, 7/8, 4/10, 6/6, 10/10, 10/10" labels near S,A,B,C,t in the last panel].

## G3 – Ford-Fulkerson (separate exercise, larger 8-node graph)

- Graph nodes: s, 7, 2, 5 (left column), 8, 3, 6 (middle-right), t (sink). Edges with capacities: s→7=3, s→2=6, s→5=8, 7→8=2, 7→2=4 (labeled "7" on a diagonal, possibly weight 7 on edge 7→3 or 2→7 — [UNCLEAR: exact diagonal edge label between 7 and 3, appears to be 7]), 2→3=1, 2→6=4 (diagonal, labeled roughly "2/4" area), 2→8=6 (diagonal), 5→6=4, 8→3=1, 8→t=3, 3→t=9, 6→3=5 (diagonal, labeled 5), 6→t= [UNCLEAR: small numeral near z/6→t, looks like "3" with a tail, possibly "5"].
- Instructions: run Ford-Fulkerson, use DFS for path search each iteration, always picking the **smallest-numbered node first** (and node **t before all other nodes** when it's reachable). Give the augmenting path and flow added at each step, draw the residual graph after each augmentation, then give the final maximum flow and final flow network.

### G3 – Lösung (1/2)

(a) Path (s,2,3,t). Added value: 1.
(b) Path (s,2,6,t). Added value: 2.
(c) Path (s,2,8,t). Added value: 3.
(d) Path (s,5,2,8,3,t). Added value: 1.

Each panel shows the residual graph redrawn in red for the edges just used/updated, e.g. after (a): s↔2 shown as 5/1 (forward/backward), 2↔3 shown 1/... , 3↔t shown 8/1. After (b): 2↔6 and 6↔t updated (3/2 and 2/3-ish labels). After (c): 2↔8 and 8↔t updated (3/3, 3/1 type labels — pattern of forward/backward pairs). After (d): s↔5, 5↔2, 2↔8 chain updated (7/1, 3/1, 1/1 pattern visible in red).

### G3 – Lösung (2/2)

(e) Path (s,5,6,t). Added value: 3.
(f) Path (s,5,6,3,t). Added value: 1.
(g) Path (s,7,3,t). Added value: 3.
(h) **Wert des maximalen Flusses: |f| = 14.**

Final flow network (used/capacity per edge): s→7 = 3/3, s→2 = 6/6, s→5 = 5/8, 7→8 = 0/2, 7→3 = 3/7, 2→8 = 4/6, 2→3 = 1/1, 2→6 = 1/4, 5→6 = 4/4, 8→3 = 1/1, 8→t = 3/3, 3→t = 6/9, 6→t = 5/5. (Read from the final annotated diagram "(h)".)

## Testate (Meta / exam-logistics note, not algorithmic content)

- Tutors ask about all 3 practical Hausübungen (homework assignments), with questions like "What was your idea behind this implementation" or "Why did you run the loop to n and not n-1", etc.
- Purpose: verify students implemented the code themselves — you may not say you copied code from the internet or asked ChatGPT.
- For pseudocode-implementation tasks: if asked "what was your idea," it is fine to say you took the pseudocode from the lecture and adapted it to Java — but if your code deviates from that pseudocode, that's suspicious and you must be able to explain it.
- You fail (durchfallen) if you cannot give a plausible answer to any question. You just need to argue convincingly that you thought about it yourself.
- Tutor personal note: "Ich persönlich werde keine Fragen zu falsch-laufenden Tests stellen" — no questions will be asked about tests that fail to run correctly, since the point is to verify you deserved the points/Studienleistung you actually earned.

## Wiederholungsstunde-Update (Meta / logistics note)

- Provisional review-session date: 20.08.25.
- Jonas is trying to get a room booked (status: requested).
- There will be exam office-hours (Klausursprechstunden) that will be combined with this.
- Not everything can be reviewed in the session — would need more time.
  - Loop invariants (Schleifeninvarianten) will definitely be covered.
  - Rest: a survey (Umfrage) will be sent out — possibly: solving exam problems, reviewing question types, etc.

---

# AUD Maxine RBT Delete (source: `AUD Maxine RBT Delete_260529_122305.pdf`, 2 pages)

**Important characterization**: this file is a **symbolic/structural algorithm reference sheet**, not a numeric worked example with concrete key values. Both pages are large, dense, hand-drawn decision-tree / case diagrams for Red-Black Tree deletion, using generic placeholder node labels (z, y, x, a, b, c, d) rather than actual numbers. There is no "insert these numbers, trace the tree step by step" example in this file — instead it is essentially the professor's own annotated redrawing of the CLRS-style RB-DELETE and RB-DELETE-FIXUP case structure. Because the diagrams are visual trees with small handwritten annotations, some fine details (exact node letters inside triangles, a few numeric priority labels) are genuinely hard to read with certainty and are flagged as [UNCLEAR].

## Legend (top-left of page 1)

- **Filled/bulleted dot ( • )**: "wichtig für Fixup" — important for the fixup step.
- **Dotted line ( ⋯ )**: "Verbindung kann/muss aber nicht existieren" — the connection can, but does not have to, exist.
- **"..." (ellipsis between nodes)**: "Evtl. weitere Knoten dazwischen" — there may be more nodes in between.
- **"∨" symbol**: "Eine der beiden Verb. existieren" — one of the two connections must exist (but not necessarily both).
- **Half-blue/half-yellow circle**: "Farben können sowohl rot als auch schwarz sein" — the color can be either red or black; "→ zum Darstellen wenn Farbe von anderem Knoten übernommen" — used to represent when a node's color is taken over from another node.
- **Empty/open circle (white, no fill)**: "Farbe irrelevant/legal" — color is irrelevant / any legal color.

## LÖSCHEN — top-level case split on z's children

The root of the decision tree splits on how many children the node-to-delete **z** has:

### Case A: z has no children (0 Kinder)
- **Sub-case A1: z = root.** z is simply replaced by nil. dsh = nil.
- **Sub-case A2: z = leaf (not root).**
  - If **z.color = red**: replaced by nil (drawn as a small red circle → nil). dsh = nil. (No fixup needed — deleting a red leaf never violates black-height.)
  - If **z.color = black**: replaced by nil. Two mirrored sub-branches depending on whether z was its parent's **left child** (dsh = right) or **right child** (dsh = left), with **a = z.parent** carried forward into the fixup call.

### Case B: z has exactly 1 child (z is a "Halbblatt" / half-leaf)
- **Sub-case B1: z has only a left child.** Operation: `transplant` + "übernehme Farbe von z" (the child takes over z's color). dsh = nil.
- **Sub-case B2: z has only a right child.** Same: `transplant` + take over z's color. dsh = nil.
(No further fixup call needed in either sub-case — because the replacing child absorbs z's color, black-height is preserved.)

### Case C: z has 2 children, and z's right subtree's leftmost/successor node y is itself the immediate right child of z (i.e., "rechter Teilbaum von z ist ein Blatt / hat nur rechte Kinder", flag **left = false**)
- y directly becomes the `transplant` target: `transplant` + "übernehme Farbe von z" (y takes z's color).
- Branches on **y's original color**:
  - **y.color = red** → dsh = nil (no fixup needed).
  - **y.color = black** → dsh = left (in this drawn orientation), with **a = y** carried into the fixup call. [The mirrored/general rule per the fixup legend is: whichever side lost a black node determines dsh — see "Bedeutung" notes below.]

### Case D: z has 2 children, and z's right subtree has left children (flag **left = true**), i.e. y (the in-order successor, "kleinstes Element das größer als z ist") is **not** the first left child, so it must be searched for deeper in z's right subtree
- "Suche linkestes Kind im rechten Teilbaum von z" — search for the leftmost child in z's right subtree = the successor y.
- A chain of `transplant(y, y.right)` operations is performed repeatedly, walking y out of its original position (splicing y's right child up into y's place), for as many levels as y is nested — the diagram shows this repeated 2–3 times symbolically with "..." to indicate it can repeat further.
- Finally: `transplant(z, y)` + "übernehme Farbe von z" (y takes over z's position and z's color).
- Resulting dsh is **right** or **nil** depending on structure, with **a = y.parent (as it was right before the very first transplant)** carried into the fixup call.

### "dsh = nil" — no-fixup note
Where dsh ends up nil, the accompanying note explains: "kein Fixup nötig, weil rote Knoten gelöscht wurden → keine Auswirkung auf Schwarzhöhe" — no fixup is necessary because (only) red nodes were removed, so there's no effect on black-height.

## "Für Fixup" — meaning of dsh=right / dsh=left (bottom of page 1)

Two small template diagrams illustrate the structural meaning of the dsh flag using generic nodes (labelled with small numbers/letters in the source that are only used for illustration, not real keys):

- **(dsh = right)-Fälle**: shows a node "a" whose child pointer to x is nil (a → nil), contrasted with a fuller tree where "a" has a left subtree containing extra nodes not mirrored on the right. Two before/after tree pairs are drawn showing the structural transform.
- **(dsh = left)-Fälle**: the mirror image — a → nil on the other side, and the mirrored before/after tree pair.
- **Bedeutung, wenn dsh = right**: "es wurde ein schwarzer Knoten auf der linken Seite nach oben verschoben/gelöscht, d.h. im rechten Teilbaum gibt es ein[en] schwarzen Knoten mehr → Ungleichgewicht" — a black node was moved up / deleted on the left side, i.e. the right subtree now has one more black node than the left → imbalance (this is the "extra black" / double-black condition that RB-DELETE-FIXUP must resolve).
- **Bedeutung, wenn dsh = left**: mirror statement — a black node was moved up/deleted on the right side, so the left subtree has one extra black node → imbalance.

Interpretation carried into page 2: **dsh marks which side of parent `a` the double-black node (x) currently sits on** — dsh=right means x is a's *left* child (so the sibling b is a's right child), and dsh=left means x is a's *right* child (sibling b is a's left child). This mirrors the classic CLRS `x == x.p.left` branch.

---

## Page 2 — Fixup-Fälle (the 6 RB-DELETE-FIXUP cases, dsh=right | dsh=left mirrored)

### Legend (top of page 2)
- **A/B/C/D/E/F are not actual pointers used by the algorithm** — "sind keine im Algorithmus genutzten pointer, zur besseren Übersicht eingeführt" — introduced only for clarity of the diagram (the real pointers are a=parent, b=sibling(w), c/d=nephews, x).
- **White/open circle**: "bedeutet, Färbung ist irrelevant für den Schritt" — color is irrelevant for this step.
- **Yellow circle**: "bedeutet, Färbung ist zwar egal aber wird irgendwo benötigt" — color doesn't matter right now but is needed somewhere (i.e., referenced later in the same case).
- **Dotted/slashed connection or node**: "Verbindung/Knoten kann existieren, muss aber nicht" — may exist, doesn't have to.
- **Gray/dark filled circle**: "Entweder Knoten existiert, dann ist die Färbung schwarz, sonst existiert er nicht" — either the node exists and is black, or it doesn't exist at all (used for nephew nodes that, if present, must be black in that case).
- **"∨"**: one of the two connections may exist, doesn't have to.
- Note: **a** is either the parent of x, or y itself, or the parent of y (before the first transplant), depending on which top-level deletion case (A–D above) led here.
- Note: **"Fälle von oben nach unten durchgehen"** — go through the cases from top to bottom in order (priority matters), e.g. "x.color = red hat eine höhere Priorität als b.color = black" — the x-is-red case takes priority over/is checked before the b(sibling)-is-black case.

The table has two mirrored columns — **dsh = right** (left column of the page) and **dsh = left** (right column, mirror image) — and 6 rows of cases, checked top to bottom:

### Row 1 — `x.color = red`
- **dsh=right**: node **a** has a red child **x** (drawn small, red) plus other children b, c, d. Transform: x is simply recolored black. This is the terminal/base case — once x becomes black, the tree is balanced (the extra black is absorbed into x itself), no rotation needed.
- **dsh=left**: mirror — x is a's red child on the other side; recolor x to black. Done.

### Row 2 — `a.color = black` **and** `b.color = red` (sibling is red)
- **dsh=right**: `rotateLeft` (around a), then **umfärben** (recolor a and b so the tree stays a valid BST-coloring — a becomes red, b becomes black per the standard CLRS Case 1 transformation), then recurse: **fixupAfterDeletion(T, a, dsh)** — here dsh stays "right" ("hier dsh=right").
- **dsh=left**: mirror — `rotateRight` (around a), umfärben, then **fixupAfterDeletion(T, a, dsh)** with dsh="left" ("hier dsh=left").
- This is the classic "sibling is red" case: rotate to make the sibling black, then fall through into one of the later cases via the recursive call.

### Row 3 — `a.color = red`, `b.color = black`, and both nephews are black-or-absent: `(c = nil OR c.color = black)` **and** `(d = nil OR d.color = black)`
- **dsh=right**: just **umfärben** (recolor a to black, b to red) — no rotation, and **no further recursive fixup call** (terminal case).
- **dsh=left**: mirror — same recoloring, terminal.
- This is CLRS's combined "Case 2 with red parent": since the parent absorbs the extra black by turning black itself (and the sibling turns red), the fixup terminates immediately.

### Row 4 — `a.color = black`, `b.color = black`, and both nephews black-or-absent: `(c = nil OR c.color = black)` **and** `(d = nil OR d.color = black)` — i.e. "c nicht rot und d nicht rot"
- **dsh=right**: **umfärben** (b becomes red), then the problem is pushed up to the grandparent level via a recursive call, branching on what kind of node **a** is:
  - if a is a **right child** → `fixupAfterDeletion(T, a, dsh=left)`
  - if **a = root** → `fixupAfterDeletion(T, a, dsh=nil)` → i.e. **Abbruch** (terminate — reached the root, done)
  - if a is a **left child** → `fixupAfterDeletion(T, a, dsh=right)`
- **dsh=left**: mirror — umfärben, then:
  - if a is a right child → dsh=left
  - if a = root → dsh=nil (Abbruch)
  - if a is a left child → dsh=right
- This is CLRS Case 2 (both nephews black, sibling black, parent black): recolor the sibling red and move the double-black problem one level up to the parent, recursing with the new "a" being the grandparent and dsh set according to which side the (old) parent a sat on.

### Row 5 — `b.color = black`, **c ≠ nil and c.color = red** (near nephew is red), and `(d = nil OR d.color = black)` (far nephew black-or-absent)
- **dsh=right**: `rotateRight` (around b, the sibling), then **umfärben**, then recurse: **fixupAfterDeletion(T, a, dsh)** — dsh stays "right" ("hier right").
- **dsh=left**: mirror — `rotateLeft` (around b), umfärben, then **fixupAfterDeletion(T, a, dsh)** ("hier left").
- This is CLRS Case 3: rotate the near-red nephew up to become the new sibling, recolor, and fall through into Case 4 (Row 6 below) via the recursive call.

### Row 6 — `b.color = black`, **d ≠ nil and d.color = red** (far nephew is red)
- **dsh=right**: `rotateLeft` (around a), then **umfärben**: "b übernimmt Farbe von a, a wird black, d wird black" — b takes over a's color, a becomes black, d becomes black. **Terminal case** — no further recursive call, the fixup is complete.
- **dsh=left**: mirror — `rotateRight` (around a), umfärben the same way (b takes a's color, a→black, c/mirror-far-nephew→black).
- This is CLRS Case 4, the final terminating case: rotating the far-red nephew into place resolves the double-black in one step.

### Summary of the six cases in CLRS terms
1. **x red** → recolor x black, done.
2. **sibling b red** → rotate + recolor, recurse (falls into one of cases 3–6 next).
3. **sibling b black, both nephews black/absent, parent a red** → recolor, done.
4. **sibling b black, both nephews black/absent, parent a black** → recolor, recurse up to grandparent (dsh flips or terminates at root).
5. **sibling b black, near nephew c red, far nephew d black/absent** → rotate + recolor, recurse (falls into case 6 next).
6. **sibling b black, far nephew d red** → rotate + recolor, done.

This exactly mirrors the textbook RB-DELETE-FIXUP structure, with the professor's own naming: **a** = parent, **b** = sibling (CLRS's w), **c** = the nephew nearer to x (CLRS's w.left when x is a left child, i.e., the "near" nephew), **d** = the nephew farther from x (CLRS's w.right, the "far" nephew), and **dsh** playing the role of tracking whether x is a left or right child of a (equivalently, which side the sibling b is on) as the recursion climbs the tree.

[UNCLEAR: a few small numeric/letter annotations inside the tiny triangle placeholders in the Row 1–6 diagrams (used purely as decorative sub-tree markers, e.g. small digits near the "a", "..." triangles) were not legible enough to transcribe with confidence; they do not appear to carry algorithmic meaning beyond generic "some subtree" markers.]

---

# AUD Maxine 12 (source: `AUD Maxine 12_260529_122304.pdf`, 40 pages)

> Note on source identity: like file 11, this entire PDF is a tutorial-session deck, **"AUD | Übungsgruppe 2"**, this time dated **13.07.2025** — a later, apparently final Übungsgruppe session. Content: review of Memoisation (Fibonacci example), a DP-with-memoisation practice problem, review of Minimum Edit Distance (Levenshtein distance) with a full derivation of the recurrence and a worked example, a Minimum-Edit-Distance exam-style exercise (TIGER → WINTER), and finally a review of the FFT (Fast Fourier Transform) approach to fast polynomial multiplication.

## Wiederholung – Memoisation

### Problem (Fibonacci motivating example)
- Goal: compute the 6th Fibonacci number. Fibonacci-Zahlen: each number is the sum of the two before it: 0, 1, 1(0+1), 2(1+1), 3(1+2), 5(2+3), ...
- Recursive relation: F₆ = F₅ + F₄. To compute F₅ you need F₄ and F₃. To compute F₄ you need F₃ and F₂. Etc.
- Naively, the computer would first fully compute F₅ (via F₄ and F₃), and only afterward start computing F₄ from scratch again — it has no way of knowing it already computed F₄ while computing F₅.
- Recursion tree drawn: F₆ branches into F₅ and F₄; F₅ branches into F₄ and F₃; F₄ (under F₅) branches into F₃ and F₂; F₃ (under that F₄) branches into F₃-leaf-group... down to base cases (small circles at the leaves, representing further recursive expansion of F₃, F₂, F₁, F₀ level nodes).
- **Laufzeit wird hier exponentiell** (runtime becomes exponential here) — because of the many duplicate computations, which can easily be avoided.

### Problem – Lösungsansatz (solution approach)
- Idea: once a Fibonacci number has been computed, store it in some form and reuse it later.
- → this is exactly what **Memoisation** means.
- Quoted definitions on the slide:
  - "Memoisation ist wie ein Gedächtnis für deinen Algorithmus. Er merkt sich, was er schon weiß, um nicht dumm alles nochmal zu machen." — attributed to ChatGPT.
  - "Memoisation [...] ist eine Technik, um Computerprogramme zu beschleunigen, indem Rückgabewerte von Funktionen zwischengespeichert anstatt neu berechnet werden." — attributed to Wikipedia.
- Diagram: the same F₆ recursion tree, now with shaded/circled overlapping regions grouping the repeated F₄, F₃, F₂ subtrees to show which computations get reused instead of recomputed.

## G3 – Dynamische Programmierung mit Memoisation (exercise + solution)

- Given the recursively defined sequence (aₙ)ₙ:
  - aₙ = a⌊n/2⌋ + a⌊n/3⌋ for n ≥ 2
  - a₀ = a₁ = 1 otherwise
- Task: (1) compute aₙ for n = 2, ..., 6. (2) Use dynamic programming with memoisation to design an algorithm **MemSequence** that takes an integer n ≥ 0 as input and determines the n-th value of this sequence. Describe the algorithm and give it in pseudocode.

### Solution — values
- a₂ = a₁ + a₀ = 1 + 1 = 2
- a₃ = a₁ + a₁ = 1 + 1 = 2
- a₄ = a₂ + a₁ = 2 + 1 = 3
- a₅ = a₂ + a₁ = 2 + 1 = 3
- a₆ = a₃ + a₂ = 2 + 2 = 4

### Solution — pseudocode

```
MemSequence(n)
11:  A = newArray(n+1)
12:  A[0] = A[1] = 1
13:  return MemSequenceAux(A, n)

MemSequenceAux(A, r)
21:  if A[r] ≠ 0 then
22:    return A[r]
23:  else
24:    A[r] = MemSequenceAux(A, ⌊r/2⌋) + MemSequenceAux(A, ⌊r/3⌋)
25:    return A[r]
```

(Line numbers 11–13 and 21–25 as written on the slide, presumably continuing numbering from a larger lecture pseudocode listing convention.)

## Wiederholung – Minimum Edit Distance

### Minimum-Edit-Distance — definitions
- Measures similarity of texts / how many (letter-)operations are needed to transform one text into another.

Operations, each with cost = 1:
| Operation | Meaning |
|---|---|
| `ins(S,i,b)` | inserts letter b into S at position i |
| `del(S,i)` | deletes the letter of string S at position i |
| `sub(S,i,b)` | replaces the letter at position i in string S with b |
| `copy(S,i)` | keeps the letter (no cost) |

- Worked micro-example transforming "ZWEI FESTE" → "EIN TEST" (as drawn, letter by letter, with small op-codes i/i/c/c/d/s/c/c/c/i under each aligned letter pair): 5 costly operations total.
- **Levenshtein-Distanz (LD)**: describes exactly this number of operations needed to turn string 1 into string 2. In the example, **LD = 5**.

### Vorbereitung – Anwendung M-E-D (deriving the DP recurrence)

- Goal: transform string X into string Y (X is changed, Y is left untouched) and compute the distance = number of costly operations needed.
- The 4 cases of transforming X into Y correspond exactly to the 4 operations: copy, ins, del, sub.
- Generalize how the distance changes under each operation.
- **D[i][j]** = the distance computed so far to transform X[1...i] into Y[1...j]. Indices start at 1 because index 0 is reserved (initialized with 0) for later use / the empty prefix.
- D[0][0] = 0 (at the very start, LD = 0).

Worked running example: X = "Tag", Y = "Lag".
- **Operation copy** — precondition: X[1...i-1] already transformed into Y[1...j-1], and X[i] = Y[j] (matching letters), so nothing needs to change, just copy.
  - Copy has 0 cost, so distance doesn't change: **D[i][j] = D[i-1][j-1]**.
  - Example: comparing "a" positions — D[2][2] = 1 + 0 (copying the matching "a"/"a").
- **Operation sub** — precondition: X[1...i-1] already transformed into Y[1...j-1], but X[i] ≠ Y[j], so we replace (an extra operation).
  - Sub costs 1: **D[i][j] = D[i-1][j-1] + 1**.
  - Example: D[1][1] = 0 + 1 (substituting "T" → "L").
- **Operation del** — precondition: X[1...i-1] already transformed into Y[1...j]; X[i] doesn't fit, so delete it.
  - Del costs 1, and i decreases by one conceptually (we're deleting the entry at position i): **D[i][j] = D[i-1][j] + 1**.
  - Example: X = "Lage", Y = "Lag" — must delete the "e" so "Lag" results, increasing distance: D[4][3] = D[3][3] + 1 = 1 + 1.
- **Operation ins** — precondition: X[1...i] already transformed into Y[1...j-1]; Y[j] is still missing, so insert it.
  - Ins costs 1: **D[i][j] = D[i][j-1] + 1**.
  - Example: X = "Tag", Y = "Lage" — must insert "e" to get "Lage": D[3][4] = D[3][3] + 1 = 1 + 1.

### Fast-Übersicht M-E-D (combining the four cases)

- D[i][j] is the distance to transform X[1...i] into Y[1...j] (i, j ≥ 1). Considering the next step to transform X into Y:

| | copy | sub | del | ins |
|---|---|---|---|---|
| formula | D[i][j] = D[i-1][j-1] | D[i][j] = D[i-1][j-1]+1 | D[i][j] = D[i-1][j]+1 | D[i][j] = D[i][j-1]+1 |
| condition | X[i] = Y[j] | X[i] ≠ Y[j] | — | — |

- copy and sub can be merged: **D[i][j] = D[i-1][j-1] + (X[i] ≠ Y[j])** (treating the boolean mismatch as 0 or 1).
- Combined with del/ins via a minimum, the final recurrence is:

**D[i][j] = min{ D[i-1][j-1] + (X[i]≠Y[j]),  D[i-1][j] + 1,  D[i][j-1] + 1 }**

### Übersicht M-E-D – Anwendung (worked example: X="SONNE", Y="WOLKE")

- Step 1: create the (m+1)×(n+1) grid, initialize row 0 and column 0 to 0,1,2,3,4,5 (edit distance from/to the empty string).
- Example fill shown: X = SONNE (columns, i = 0..5), Y = WOLKE (rows, j = 0..5). First computed interior cell: D[1][1] (comparing "S" vs "W"):
  - D[1][1] = min{ D[0][0]+1, D[0][1]+1, D[1][0]+1 } = min{0+1, 1+1, 1+1} = **1**.
- General visual rule given for filling any interior cell **d** using the 2×2 block immediately above/left of it:
  - Block layout: `a+s` (top-left, diagonal) `b+1` (top, directly above) / `c+1` (left, directly left) `d` (the cell being computed, bottom-right)
  - **d = min{ a+s, b+1, c+1 }**, where **s = 1** if the two letters corresponding to cell d differ, else **s = 0**.

### Pseudocode (MinEditDist)

```
MinEditDist(X,Y,m,n)  // X=X[1..m], Y=Y[1..n]
1  D[][] = ALLOC(m,n);
2  FOR i=0 TO m DO D[i][0]=i;
3  FOR j=0 TO n DO D[0][j]=j;
4  FOR i=1 TO m DO
5    FOR j=1 TO n DO
6      IF X[i]=Y[j] THEN s=0 ELSE s=1;
7      D[i][j]=min{D[i-1][j-1]+s, D[i-1][j]+1, D[i][j-1]+1};
8  return D[m][n];
```

- Runtime and space: **Θ(mn)**.
- Annotation on the pseudocode: the `s` term corresponds to copy/sub (s=0 for copy, s=1 for sub), the `D[i-1][j]+1` term corresponds to del, and the `D[i][j-1]+1` term corresponds to ins.

## G2 – Minimum Edit Distance (exam-style exercise)

**(a)** Explain why the Minimum-Edit-Distance problem has the property of overlapping subproblems and is therefore well-suited to a dynamic-programming solution. Hint: refer to the cache D, where D[i][j] computes the distance between prefixes X[1...i] and Y[1...j].

### G2(a) – Lösung
- In the recursive computation of the solution, the same subproblems get solved multiple times.
- Example: computing D[i][j] needs the subproblem D[i-1][j-1]. But that same subproblem is also needed when computing D[i-1][j] and D[i][j-1] (within their own recursive calls).
- A naive recursive approach would have exponential runtime. Through **Memoization** (storing results in table D), the solution for each subproblem is computed only once and looked up as needed thereafter. This reduces the runtime to **Θ(mn)**.

**(b)** Compute the Levenshtein distance between source word X = TIGER and target word Y = WINTER. Fill in the DP table D completely. Use standard cost 1 for insertion (ins), deletion (del), and substitution (sub). Copy (copy) costs 0. Index 0 represents the empty string. X has length 5 (i=1..5), Y has length 6 (j=1..6).

### G2(b) – Lösung (filled DP table)

Rows = Y[1..j] = W,I,N,T,E,R (j=0..6); Columns = X[1..i] = T,I,G,E,R (i=0..5).

| D | 0 | 1 (T) | 2 (I) | 3 (G) | 4 (E) | 5 (R) |
|---|---|---|---|---|---|---|
| **0** | **0** | 1 | 2 | 3 | 4 | 5 |
| **1 (W)** | 1 | **1** | 2 | 3 | 4 | 5 |
| **2 (I)** | 2 | 2 | **1** | 2 | 3 | 4 |
| **3 (N)** | 3 | 3 | **2** | 2 | 3 | 4 |
| **4 (T)** | 4 | 3 | 3 | **3** | 3 | 4 |
| **5 (E)** | 5 | 4 | 4 | 4 | **3** | 4 |
| **6 (R)** | 6 | 5 | 5 | 5 | 4 | **3** |

(Diagonal cells highlighted in the source correspond to the letters that match/align during the optimal alignment: the anti-diagonal-ish path of bolded values 0,1,1,2,3,3,3 shown highlighted traces one optimal alignment path.)

**Result: Levenshtein-Distance(TIGER, WINTER) = D[5][6] = 3.**

## Wiederholung FFT (Fast Fourier Transform — for fast polynomial multiplication)

### Problem: Polynommultiplikation
- Given two polynomials p(x) and q(x); computing their product r(x) = p(x)·q(x) directly is relatively expensive — quadratic runtime (naive coefficient-by-coefficient multiplication, "usw." / and so on, illustrated with crossing arrows between all coefficient pairs).
- Example polynomials: p(x) = 4x³ + 3x² + 2x¹ + 4x⁰, q(x) = 9x³ + 8x² + 7x¹ + 6x⁰.
- General form: p(x)·q(x) = (Σᵢ₌₀ⁿ⁻¹ pᵢxⁱ) · (Σᵢ₌₀ⁿ⁻¹ qᵢxⁱ), a polynomial of degree 2n−2, equal to Σₖ₌₀^(2n-2) (Σⱼ₌₀ᵏ pⱼ·q_{k-j}) xᵏ — this inner sum is called the **Faltung / "Konvolution"** (convolution) of the coefficients.

### Überblick (the coefficient ↔ value-representation trick)
- Diagram: A(x), B(x) given by coefficients (Coeff ⇒ Value transform down to point-value pairs), then pointwise **Multiply** the value representations, then transform back (Value ⇒ Coeff) to get C(x) = c₀ + c₁x + ... + c_{2d}x^{2d} from A(x)=a₀+...+a_d x^d and B(x)=b₀+...+b_d x^d.

### Polynommultiplikation – Lösungsansatz (why point/value representation helps)
- Key theorem stated on the slide: **"Jedes Polynom p(x) über Körper vom Grad ≤ n−1 lässt sich eindeutig durch n Punkt/Wert-Paare (xⱼ,yⱼ)_{j=0,...,n-1} für verschiedene xⱼ durch yⱼ = p(xⱼ) beschreiben."** — every polynomial of degree ≤ n−1 over a field can be uniquely described by n point/value pairs at distinct xⱼ.
- Example: to uniquely describe p(x) = 4x³+3x²+2x+4 (degree 3, so n=4), you need exactly 4 points: (x₁,p(x₁)), (x₂,p(x₂)), (x₃,p(x₃)), (x₄,p(x₄)), each computed by plugging into the cubic formula.
- Similarly for q(x): need 4 points each for p and q.
- If we instead compute r(x) = p(x)·q(x): the product has degree (grad(p)+grad(q)) = (n−1)+(n−1) = 2n−2. So by the theorem, uniquely representing r(x) requires **2n−1** point/value pairs — meaning we need 2n−1 values of both p and q (not just n) to get 2n−1 values of r.
- Once we have 2n−1 values of p and q each, we simply compute pointwise products (xₖ, p(xₖ)·q(xₖ)) to get the 2n−1 points that describe r(x).

### "Warte mal..." (a doubt raised, then resolved)
- Objection raised on slide: evaluating p(xₖ) via Horner's scheme takes Θ(n). Doing this for n points would give Θ(n²) total — so what did we gain?
- **Der ganze Trick dabei...** (the actual trick): we want to reduce the number of values we need to *compute directly*, using **Divide-and-Conquer**: rearrange the function so we only need to evaluate it at n/2 points, because evaluating too many points is exactly the bottleneck.

### Splitting p(x) into even/odd parts
- Example: p(x) = 3 + 2x + 5x² + 7x³ + 0x⁴ + 1x⁵ + 4x⁶ + 6x⁷.
- Rewrite by separating even-power terms (p_even) and odd-power terms (p_odd):
  - p(x) = (3 + 5x² + 0x⁴ + 4x⁶) + (2x + 7x³ + 1x⁵ + 6x⁷)
  - p_even(x) = 3 + 5x² + 0x⁴ + 4x⁶
  - p_odd(x) = 2x + 7x³ + 1x⁵ + 6x⁷
- Factor an x out of the odd part: x·p_odd(x) form → rewritten as x(2 + 7x² + 1x⁴ + 6x⁶).
- Substituting **a = x²**: p(a) = p_even(a) + x·p_odd(a), where p_even(a) = 3 + 5a¹ + 0a² + 4a⁴ and p_odd(a) = x(2 + 7a¹ + 1a² + 6a⁴).
- First-pass conclusion (later corrected on the next slide): "we've halved the degree, so we only need half as many values to represent the polynomial" — **the slide explicitly flags this as NOT quite right**: "Das Ziel ist immernoch 2n−1 Werte zu finden! Der Grad des Polynoms der Multiplikation verändert sich ja nicht!" — the goal is still to find 2n−1 values; the degree of the product polynomial doesn't change just because we rewrote p.
- Correct framing: we've put things in a form where we truly can halve the *number of computations*, not the number of points needed:
  - We want to choose the 2n−1 x-values such that computing x² gives the *same* value for two different x's — i.e. we want pairs of points that collapse to one computation.
  - From basic algebra: (−x)² = x². So choosing x-values in ± pairs, one evaluation of a= x² serves both x and −x.
  - Example: for the value 9, there are exactly 2 x-values giving x²=9: −3 and 3. Plugging a=9 into p(a) directly gives both points (−3, p(9)-derived value) and (3, p(9)-derived value) [i.e. (−3, p(−3)) and (3, p(3))] from one computation of p_even(9) and p_odd(9).

### Einheitswurzeln (roots of unity)
- What does this have to do with roots of unity? Roots of unity are useful because they satisfy exactly this "same square" condition needed above.
- For the 2n−1 (~2n) values needed, we want xⱼ such that **xⱼ² = x_{j+n}²** — ordinary square roots aren't elegant/sufficient for this; roots of unity satisfy exactly this condition.
- Stated property: for the **m-th primitive root of unity ωₘ**, for even m: **(ωₘʲ)² = (ωₘ^{j+m/2})²** for all j = 0,1,...,m/2 − 1, because (ωₘ^{j+m/2})² = ωₘ^{2j+m} = ωₘ^{2j}·ωₘᵐ = (ωₘʲ)², using ωₘᵐ = 1.

### Wie wird das ganze jetzt gerechnet? (putting it together)
- Setup: we have p(x) and q(x), both of degree n−1, and want r(x) = p(x)·q(x), of degree 2n−2. We need 2n−1 values to represent r(x) uniquely.
- Split both p(x) and q(x) recursively: p(x) = p_even(x²) + x·p_odd(x²).
- Use the (2n−1 ≈ 2n)-th root of unity for the x-values:
  - p(ω₂ₙʲ) = p_even((ω₂ₙʲ)²) + ω₂ₙʲ · p_odd((ω₂ₙʲ)²), for all j ∈ {0, 1, ..., 2n/2 − 1}.
- p_even and p_odd can themselves be further split recursively into p_even,even, p_even,odd and p_odd,even, p_odd,odd — this is the recursive structure underlying the FFT (the slide ends here, without going further into the recursive FFT/butterfly details or the inverse transform).

## Beispiel – Gruppenübung (closing slide)
- "Tafel/Ipad" — indicates a live worked example was done on the whiteboard/iPad during the session and is not captured in the slide deck itself. No content transcribable.
