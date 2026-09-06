/**
 * Step descriptions for the visualizer, kept apart from the UI catalogue purely for readability —
 * they are merged into it by `messages.ts`, so the same completeness check covers both.
 *
 * `generateSteps` emits `{ key, vars }` rather than a finished sentence, which keeps the algorithm
 * files free of any locale concern and lets the player render whichever language is active.
 */
export const vizEn = {
  // --- shared across several algorithms ------------------------------------
  'viz.d.initialArray': 'Initial array.',
  'viz.d.arraySorted': 'Array is sorted.',
  'viz.d.emptyTree': 'Empty tree.',
  'viz.d.startingTree': 'Starting tree, built from [{values}].',
  'viz.d.startingTreeGiven': 'Starting tree (given), built from [{values}].',
  'viz.d.insertBecomesRoot': 'Insert {value}: tree was empty, becomes root.',
  'viz.d.notInTree': '{value} is not in the tree — nothing to delete.',
  'viz.d.deleteValue': 'Delete {value}.',
  'viz.d.allInserted': 'All values inserted.',
  'viz.d.allDeleted': 'All deletions complete.',
  'viz.d.allOperations': 'All operations complete.',
  'viz.d.validShifts': 'Done. Valid shifts: [{shifts}].',

  // --- bubble sort ---------------------------------------------------------
  'viz.bubble.compare': 'Compare a[{j}]={aj} and a[{j1}]={aj1}.',
  'viz.bubble.swap': 'Swap: a[{j}] and a[{j1}] were out of order.',

  // --- insertion sort ------------------------------------------------------
  'viz.ins.initial': 'Initial array. A[0] counts as sorted.',
  'viz.ins.takeKey': 'Take key = a[{i}] = {key}.',
  'viz.ins.shift': 'a[{j}]={aj} > key={key}: shift right.',
  'viz.ins.shifted': 'Shifted. Continue looking left.',
  'viz.ins.insertAt': 'Insert key={key} at position {pos}.',

  // --- merge sort ----------------------------------------------------------
  'viz.merge.divide': 'Divide a[{left}..{right}] at mid={mid}.',
  'viz.merge.merging': 'Merging a[{left}..{mid}] and a[{mid1}..{right}]: compare candidates.',
  'viz.merge.merged': 'a[{left}..{right}] merged and sorted.',

  // --- quicksort -----------------------------------------------------------
  'viz.quick.partition': 'Partitioning a[{left}..{right}] with pivot={pivot}.',
  'viz.quick.wrongSide': 'a[{p}]={ap} and a[{q}]={aq} are on the wrong side of the pivot.',
  'viz.quick.swapped': 'Swapped a[{p}] and a[{q}].',

  // --- radix sort ----------------------------------------------------------
  'viz.radix.nothing': 'Nothing to sort.',
  'viz.radix.intro':
    '{n} keys of at most {digits} digits in base {base}. Radix Sort makes {digits} passes, one per digit position, starting with the least significant — and never compares two keys with each other.',
  'viz.radix.passStart':
    'Pass i = {pos}: distribute every key into the bucket given by its digit at position {pos}.',
  'viz.radix.place': 'A[{j}] = {value} — digit at position {pos} is {digit} → append to the back of bucket {digit}.',
  'viz.radix.placePadded':
    'A[{j}] = {value} — digit at position {pos} is {digit} (implicit padding 0: the numeral is shorter than that) → append to the back of bucket {digit}.',
  'viz.radix.bucketed':
    'All {n} keys are bucketed. Now read the buckets back in index order 0..{last}, each one front-to-back.',
  'viz.radix.collect':
    'Take {value} from the front of bucket {bucket} → A[{index}]. Taking from the front (FIFO) is what makes the pass stable, and stability is what stops this pass from undoing the previous one.',
  'viz.radix.passEnd': 'End of pass i = {pos}: the array is now sorted by digit positions 0..{pos}.',
  'viz.radix.done':
    'Sorted after {digits} passes — O(d·(n+D)) with d = {digits} and D = {base}, and not a single key-to-key comparison. The Ω(n log n) comparison-sort lower bound simply does not apply.',

  // --- BFS -----------------------------------------------------------------
  'viz.bfs.start': 'Start BFS at {source}: dist[{source}]=0, enqueue it.',
  'viz.bfs.dequeue': 'Dequeue {u} (dist={dist}). Examine its neighbors.',
  'viz.bfs.lookKnown': 'Look at neighbor {v}: already discovered, skip.',
  'viz.bfs.lookNew': 'Look at neighbor {v}: undiscovered.',
  'viz.bfs.discover': 'Discover {v}: dist[{v}]={dist}, parent[{v}]={u}. Enqueue {v}.',
  'viz.bfs.finished': '{u} finished (all neighbors examined).',
  'viz.bfs.done': 'BFS complete. Highlighted edges form the shortest-path tree by edge count from the source.',
  'viz.bfs.doneUnreachable': 'BFS complete. {nodes} unreachable from {source}.',

  // --- DFS -----------------------------------------------------------------
  'viz.dfs.start': 'All vertices start WHITE (undiscovered).',
  'viz.dfs.discover': 'Discover {u}: disc[{u}]={time}.',
  'viz.dfs.examine': 'Examine edge {u}-{v}: {v} is {color}.',
  'viz.dfs.backtrack': 'Back to {u} after fully exploring {v}.',
  'viz.dfs.finish': '{u} finished: finish[{u}]={time}.',
  'viz.dfs.newTree': '{node} still WHITE and not reachable from {source}: start a new DFS tree there.',
  'viz.dfs.done': 'DFS complete. Labels show disc/finish times; highlighted edges are the DFS tree.',
  'viz.dfs.doneForest': 'DFS complete. Labels show disc/finish times; highlighted edges are the DFS trees.',

  // --- Dijkstra ------------------------------------------------------------
  'viz.dij.init': 'Initialize: dist[{source}]=0, all others ∞.',
  'viz.dij.extract': 'Extract closest unvisited node: {u} (dist={dist}).',
  'viz.dij.relax': 'Relax edge {u}-{v} (weight {weight}): dist[{u}]+{weight} vs dist[{v}]={distV}.',
  'viz.dij.improved': 'Improved: dist[{v}] = {dist}, pred[{v}] = {u}.',
  'viz.dij.done': 'Done. Highlighted edges form the shortest-path tree from the source.',

  // --- Bellman-Ford --------------------------------------------------------
  'viz.bf.init':
    "Initialize: dist[{source}]=0, all others ∞. This demo graph has only non-negative weights (so Dijkstra also works here) — Bellman-Ford's payoff is graphs with negative edges, but it still relaxes every edge V−1 times regardless.",
  'viz.bf.pass': 'Pass {pass} of {total}: relax every edge once.',
  'viz.bf.relax': 'Relax {u}→{v} (weight {weight}): dist[{u}]+{weight} vs dist[{v}]={distV}.',
  'viz.bf.negativeCycle':
    'A further relaxation still improves a distance after V−1 passes: a negative-weight cycle is reachable from the source.',
  'viz.bf.noNegativeCycle':
    'Checked every edge once more: nothing improves, so no negative cycle. Highlighted edges form the shortest-path tree.',
  'viz.bf.converged':
    'No edge changed in pass {pass} — distances have already converged (remaining passes would be no-ops, but the textbook algorithm always runs all V−1).',

  // --- Kruskal -------------------------------------------------------------
  'viz.kru.start': 'Start with every node in its own set. Sort all {edges} edges by weight ascending.',
  'viz.kru.consider': 'Consider edge {from}-{to} (weight {weight}). set({from})={rootA}, set({to})={rootB}.',
  'viz.kru.accept': 'Different sets → accept {from}-{to} into the MST and merge the sets.',
  'viz.kru.reject': 'Same set already → {from}-{to} would form a cycle. Reject.',
  'viz.kru.done': 'MST complete: {accepted} edges connect all {nodes} nodes.',

  // --- Prim ----------------------------------------------------------------
  'viz.prim.start': "Start Prim's from {source}: key[{source}]=0, every other key ∞.",
  'viz.prim.extract': 'Extract cheapest vertex to attach: {u} (key={key}).',
  'viz.prim.consider': 'Edge {u}-{v} (weight {weight}) vs key[{v}]={keyV}.',
  'viz.prim.cheaper': 'Cheaper connection found: key[{v}] = {weight}, parent[{v}] = {u}.',
  'viz.prim.done': 'Done. Highlighted edges form the minimum spanning tree grown from the source.',

  // --- naive string matching ----------------------------------------------
  'viz.naive.intro': 'Text T of length {n}, pattern P of length {m}. Try every shift 0..{last}.',
  'viz.naive.tryShift': 'Try shift sft = {sft}: align P under T[{sft}, …, {end}].',
  'viz.naive.mismatch': "P[{j}] = '{pj}' ≠ T[{ti}] = '{tc}' — shift {sft} is invalid.",
  'viz.naive.match': "P[{j}] = '{pj}' = T[{ti}] — matches so far.",
  'viz.naive.valid': 'All {m} characters matched — sft = {sft} is a valid shift.',

  // --- Rabin-Karp ----------------------------------------------------------
  'viz.rk.preprocess':
    'Preprocess in Θ(m): compute p = value of P mod {q} = {p}, and t_0 = value of T[0..{last}] mod {q} = {t}.',
  'viz.rk.spurious':
    'Explicit check: P[{j}] ≠ T[{ti}] — spurious hit ("unechter Treffer"), sft = {sft} is not actually valid.',
  'viz.rk.hashHit':
    'Shift {sft}: t_{sft} = p (mod {q}) — fast test passes, but this could be a spurious hit. Verify character by character.',
  'viz.rk.hashMiss':
    'Shift {sft}: t_{sft} ≠ p (mod {q}) — guaranteed not a match, skip the explicit check entirely.',
  'viz.rk.confirmed': 'Explicit check passes: sft = {sft} is a real, confirmed match.',
  'viz.rk.roll': 'Roll the hash: t_{next} = 10·(t_{sft} − T[{sft}]·h) + T[{tail}], mod {q} = {value}.',

  // --- BST -----------------------------------------------------------------
  'viz.bst.compare': 'Insert {value}: compare with {node}.',
  'viz.bst.insertLeft': '{value} < {node}: insert as left child.',
  'viz.bst.insertRight': '{value} >= {node}: insert as right child.',
  'viz.bst.noLeftChild': '{value} has no left child (leaf or half-leaf): transplant its right child into its place.',
  'viz.bst.noRightChild': '{value} has no right child (half-leaf): transplant its left child into its place.',
  'viz.bst.twoChildren': '{value} has two children: its successor is {succ} (leftmost node of its right subtree).',
  'viz.bst.detachSucc': "Detach {succ} from its old spot and give it {value}'s right subtree.",
  'viz.bst.succTakesPlace': "{succ} takes {value}'s place, inheriting its left subtree too.",

  // --- AVL -----------------------------------------------------------------
  'viz.avl.insertLeaf': '{value} inserted as a leaf (plain BST insert so far).',
  'viz.avl.walkUp': 'Walk up to {node}: height={height}, balance factor={bf}.',
  'viz.avl.lrCase':
    '{node} is left-heavy (bf={bf}) and its left child {child} is right-heavy: rotate left at {child} first (LR case).',
  'viz.avl.llCase': '{node} is left-heavy (bf={bf}): rotate right at {node} (LL case).',
  'viz.avl.rlCase':
    '{node} is right-heavy (bf={bf}) and its right child {child} is left-heavy: rotate right at {child} first (RL case).',
  'viz.avl.rrCase': '{node} is right-heavy (bf={bf}): rotate left at {node} (RR case).',
  'viz.avl.rebalanced':
    'Rebalanced. AVL insert needs at most one rotation, so no ancestor above this point needs checking.',
  'viz.avl.noLeftChild': '{value} has no left child: transplant its right child into its place.',
  'viz.avl.noRightChild': '{value} has no right child: transplant its left child into its place.',
  'viz.avl.succTakesPlace': "{succ} takes {value}'s place, inheriting its subtrees.",
  'viz.avl.doneInsert': 'All values inserted. Every node satisfies |balance factor| ≤ 1.',
  'viz.avl.doneDelete': 'All deletions complete. Every node satisfies |balance factor| ≤ 1.',

  // --- Red-Black tree ------------------------------------------------------
  'viz.rbt.startingTree': 'Starting Red-Black tree, built from [{values}].',
  'viz.rbt.insertRedLeaf': 'Insert {value} as a red leaf (BST insert).',
  'viz.rbt.case1Left': 'Case 1 (uncle {uncle} is red): recolor parent and uncle black, grandparent red.',
  'viz.rbt.case2Left': 'Case 2 (uncle black, z is inner child): rotate left at {node}.',
  'viz.rbt.case3Left': 'Case 3 (uncle black, z is outer child): recolor and rotate right at grandparent.',
  'viz.rbt.case2Right': 'Case 2 (uncle black, z is inner child): rotate right at {node}.',
  'viz.rbt.case3Right': 'Case 3 (uncle black, z is outer child): recolor and rotate left at grandparent.',
  'viz.rbt.recolorRoot': 'Recolor root black (rule 2 must always hold).',
  'viz.rbt.doneInsert': 'All values inserted. Every root-to-leaf path has the same black-height.',
  'viz.rbt.twoChildren': '{value} has two children: successor {succ} takes its place.',
  'viz.rbt.splicedBlack': 'Spliced-out node was black — the tree may now be unbalanced. Fixing up.',
  'viz.rbt.doneDelete': 'All deletions complete. Red-Black properties restored.',
  'viz.rbt.delCase1Left': 'Case 1: sibling is red — recolor and rotate left at {parent}.',
  'viz.rbt.delCase2': 'Case 2: both of sibling’s children are black — recolor sibling red, move deficiency up.',
  'viz.rbt.delCase3Left': "Case 3: sibling's outer nephew is black — recolor and rotate right at {node}.",
  'viz.rbt.delCase4Left': 'Case 4: rotate left at {parent} — deficiency resolved.',
  'viz.rbt.delCase1Right': 'Case 1: sibling is red — recolor and rotate right at {parent}.',
  'viz.rbt.delCase3Right': "Case 3: sibling's outer nephew is black — recolor and rotate left at {node}.",
  'viz.rbt.delCase4Right': 'Case 4: rotate right at {parent} — deficiency resolved.',

  // --- Splay tree ----------------------------------------------------------
  'viz.splay.insertLeaf': 'Insert {value}: plain BST insert places it as a new leaf.',
  'viz.splay.zig': "Zig: {node}'s parent ({parent}) is the root — single rotation.",
  'viz.splay.zigzigLeft':
    'Zig-Zig: {node} and its parent are both left children — rotate around the grandparent first, then the parent.',
  'viz.splay.zigzigRight':
    'Zig-Zig: {node} and its parent are both right children — rotate around the grandparent first, then the parent.',
  'viz.splay.zigzag':
    'Zig-Zag: {node} and its parent are on opposite sides — rotate around the parent first, then the grandparent.',
  'viz.splay.searchFound': 'Search {value}: found at this node.',
  'viz.splay.searchAbsent':
    'Search {value}: not present — the search falls off the tree here, at the last node visited ({node}).',
  'viz.splay.splayed': '{value} has been splayed to the root.',
  'viz.splay.splayedFound': '{value} has been splayed to the root.',
  'viz.splay.splayedNotFound':
    '{value} has been splayed to the root (the search still splays even though it failed).',
  'viz.splay.insertionsDone': 'Insertions complete.',
  'viz.splay.deleteEmpty': 'Delete {value}: tree is empty, nothing to do.',
  'viz.splay.deleteAbsent':
    'Delete {value}: not present ({root} splayed to root instead) — tree left unchanged.',
  'viz.splay.deleteRoot':
    'Delete {value}: it is now the root (just splayed). Remove it, splitting the tree into L (left subtree) and R (right subtree).',
  'viz.splay.lEmpty': 'L is empty: R becomes the new tree.',
  'viz.splay.findMax': 'Find the maximum of L: {max} (descend rightmost — it has no right child).',
  'viz.splay.attachR': "{max} is L's new root (no right child); attach R directly as its right child.",

  // --- heap ----------------------------------------------------------------
  'viz.heap.insertAppend': 'Insert {value}: append at index {i} (the last free slot — keeps the tree complete).',
  'viz.heap.siftUp':
    'Compare index {i} ({vi}) with parent index {p} ({vp}): {vi} > {vp}, violates heap property — sift up.',
  'viz.heap.swapped': 'Swapped. {value} now at index {i}.',
  'viz.heap.settled': '{value} settles at index {i}: parent (if any) is now ≥ {value}, heap property restored.',
  'viz.heap.doneInsert': 'All values inserted. Every parent ≥ its children.',
  'viz.heap.startArray': 'Starting array [{values}], not yet heap-ordered.',
  'viz.heap.heapify': 'heapify at index {i} ({vi}): compare with children — largest is index {largest} ({vl}).',
  'viz.heap.siftDown': 'Swap index {i} and {largest}: {vl} moves up, {vi} sifts further down.',
  'viz.heap.built': 'Heap built: [{values}] now satisfies the max-heap property everywhere.',
  'viz.heap.extractMax': 'Extract max: root is {max}.',
  'viz.heap.moveLast':
    'Move the last element ({value}) into the root, shrink the heap to size {size}. {max} is placed at the end of the sorted output.',
  'viz.heap.restored': 'Heap property restored for the remaining {size} element(s). Extracted so far: [{extracted}].',
  'viz.heap.doneExtract': 'Done. Extracted in order (descending): [{extracted}].',

  // --- B-Tree --------------------------------------------------------------
  'viz.btree.starting': 'Starting B-Tree (degree t = {t}, so {min}–{max} keys per non-root node).',
  'viz.btree.splitChild':
    'Child was full ({max} keys): median {median} moves up into the parent; the remaining keys split into two nodes of t−1 keys each.',
  'viz.btree.splitNode':
    'Node was full ({max} keys): median {median} moves up into the parent; the remaining keys split into two nodes of t−1 keys each.',
  'viz.btree.splitRoot': 'Insert {key}: root is full — split it first. Tree height grows by one.',
  'viz.btree.insertStart': 'Insert {key}: start at the root.',
  'viz.btree.descend': '{key} descends into the child containing keys between {low} and {high}.',
  'viz.btree.insertedLeaf': '{key} inserted into leaf at sorted position (leaf now has {count} keys).',
  'viz.btree.doneInsert': 'All insertions complete. Every non-root node has between t−1 and 2t−1 keys.',
  'viz.btree.mergeChildren':
    'Both neighboring children have exactly t−1 keys — merge them together with separator {sep} from the parent into one node of {count} keys.',
  'viz.btree.borrowLeft':
    'Left sibling has ≥ t keys: rotate through the parent — {down} moves down into the deficient child, {up} moves up to replace it.',
  'viz.btree.borrowRight':
    'Right sibling has ≥ t keys: rotate through the parent — {down} moves down into the deficient child, {up} moves up to replace it.',
  'viz.btree.removeLeaf': '{key} found in a leaf with keys to spare — remove it directly.',
  'viz.btree.usePredecessor':
    '{key} is internal; its predecessor child has ≥ t keys — replace {key} with predecessor {pred}, then delete {pred} from that child.',
  'viz.btree.useSuccessor':
    '{key} is internal; predecessor child only has t−1 keys, but the successor child has ≥ t — replace {key} with successor {succ}, then delete {succ} from that child.',
  'viz.btree.keyAbsent': '{key} is not in the tree.',
  'viz.btree.descendDelete': 'Descend into the child covering {key} (now guaranteed ≥ t keys).',
  'viz.btree.deleteEmpty': 'Delete {key}: tree is empty.',
  'viz.btree.deleteStart': 'Delete {key}: start at the root.',
  'viz.btree.rootShrank':
    'Root became empty after a merge — its only remaining child becomes the new root. Tree height decreases by one.',
  'viz.btree.nowEmpty': 'The tree is now empty.',
  'viz.btree.doneDelete': 'All deletions complete. Every non-root node still has between t−1 and 2t−1 keys.',
} as const;

export type VizMessageKey = keyof typeof vizEn;

export const vizDe: Record<VizMessageKey, string> = {
  // --- shared --------------------------------------------------------------
  'viz.d.initialArray': 'Ausgangsarray.',
  'viz.d.arraySorted': 'Das Array ist sortiert.',
  'viz.d.emptyTree': 'Leerer Baum.',
  'viz.d.startingTree': 'Ausgangsbaum, aufgebaut aus [{values}].',
  'viz.d.startingTreeGiven': 'Gegebener Ausgangsbaum, aufgebaut aus [{values}].',
  'viz.d.insertBecomesRoot': 'Füge {value} ein: Der Baum war leer, {value} wird zur Wurzel.',
  'viz.d.notInTree': '{value} ist nicht im Baum — nichts zu löschen.',
  'viz.d.deleteValue': 'Lösche {value}.',
  'viz.d.allInserted': 'Alle Werte eingefügt.',
  'viz.d.allDeleted': 'Alle Löschvorgänge abgeschlossen.',
  'viz.d.allOperations': 'Alle Operationen abgeschlossen.',
  'viz.d.validShifts': 'Fertig. Gültige Verschiebungen: [{shifts}].',

  // --- bubble sort ---------------------------------------------------------
  'viz.bubble.compare': 'Vergleiche a[{j}]={aj} und a[{j1}]={aj1}.',
  'viz.bubble.swap': 'Tausche: a[{j}] und a[{j1}] standen in falscher Reihenfolge.',

  // --- insertion sort ------------------------------------------------------
  'viz.ins.initial': 'Ausgangsarray. A[0] gilt als sortiert.',
  'viz.ins.takeKey': 'Nimm key = a[{i}] = {key}.',
  'viz.ins.shift': 'a[{j}]={aj} > key={key}: nach rechts verschieben.',
  'viz.ins.shifted': 'Verschoben. Weiter nach links schauen.',
  'viz.ins.insertAt': 'Füge key={key} an Position {pos} ein.',

  // --- merge sort ----------------------------------------------------------
  'viz.merge.divide': 'Teile a[{left}..{right}] bei mid={mid}.',
  'viz.merge.merging': 'Verschmelze a[{left}..{mid}] und a[{mid1}..{right}]: Kandidaten vergleichen.',
  'viz.merge.merged': 'a[{left}..{right}] verschmolzen und sortiert.',

  // --- quicksort -----------------------------------------------------------
  'viz.quick.partition': 'Partitioniere a[{left}..{right}] mit Pivot={pivot}.',
  'viz.quick.wrongSide': 'a[{p}]={ap} und a[{q}]={aq} liegen auf der falschen Seite des Pivots.',
  'viz.quick.swapped': 'a[{p}] und a[{q}] getauscht.',

  // --- radix sort ----------------------------------------------------------
  'viz.radix.nothing': 'Nichts zu sortieren.',
  'viz.radix.intro':
    '{n} Schlüssel mit höchstens {digits} Ziffern zur Basis {base}. RadixSort macht {digits} Durchläufe — einen pro Ziffernstelle, beginnend bei der niederwertigsten — und vergleicht dabei nie zwei Schlüssel miteinander.',
  'viz.radix.passStart':
    'Durchlauf i = {pos}: Verteile jeden Schlüssel in den Bucket, der durch seine Ziffer an Position {pos} bestimmt ist.',
  'viz.radix.place':
    'A[{j}] = {value} — die Ziffer an Position {pos} ist {digit} → hinten an Bucket {digit} anhängen.',
  'viz.radix.placePadded':
    'A[{j}] = {value} — die Ziffer an Position {pos} ist {digit} (implizite Auffüll-0, da die Zahl kürzer ist) → hinten an Bucket {digit} anhängen.',
  'viz.radix.bucketed':
    'Alle {n} Schlüssel sind einsortiert. Lies die Buckets nun in Indexreihenfolge 0..{last} zurück, jeden von vorne nach hinten.',
  'viz.radix.collect':
    'Nimm {value} von vorne aus Bucket {bucket} → A[{index}]. Das Entnehmen von vorne (FIFO) macht den Durchlauf stabil, und genau diese Stabilität verhindert, dass dieser Durchlauf den vorherigen zunichtemacht.',
  'viz.radix.passEnd':
    'Ende von Durchlauf i = {pos}: Das Array ist jetzt nach den Ziffernstellen 0..{pos} sortiert.',
  'viz.radix.done':
    'Sortiert nach {digits} Durchläufen — O(d·(n+D)) mit d = {digits} und D = {base}, und ohne einen einzigen Vergleich zwischen zwei Schlüsseln. Die untere Schranke Ω(n log n) für vergleichsbasiertes Sortieren greift hier schlicht nicht.',

  // --- BFS -----------------------------------------------------------------
  'viz.bfs.start': 'Starte BFS bei {source}: dist[{source}]=0, in die Queue einfügen.',
  'viz.bfs.dequeue': 'Entnimm {u} (dist={dist}). Untersuche seine Nachbarn.',
  'viz.bfs.lookKnown': 'Betrachte Nachbar {v}: bereits entdeckt, überspringen.',
  'viz.bfs.lookNew': 'Betrachte Nachbar {v}: noch nicht entdeckt.',
  'viz.bfs.discover': 'Entdecke {v}: dist[{v}]={dist}, parent[{v}]={u}. Füge {v} in die Queue ein.',
  'viz.bfs.finished': '{u} ist fertig (alle Nachbarn untersucht).',
  'viz.bfs.done':
    'BFS abgeschlossen. Die hervorgehobenen Kanten bilden den Baum kürzester Wege (nach Kantenzahl) ab der Quelle.',
  'viz.bfs.doneUnreachable': 'BFS abgeschlossen. {nodes} von {source} aus nicht erreichbar.',

  // --- DFS -----------------------------------------------------------------
  'viz.dfs.start': 'Alle Knoten starten WEISS (unentdeckt).',
  'viz.dfs.discover': 'Entdecke {u}: disc[{u}]={time}.',
  'viz.dfs.examine': 'Untersuche Kante {u}-{v}: {v} ist {color}.',
  'viz.dfs.backtrack': 'Zurück zu {u}, nachdem {v} vollständig erkundet wurde.',
  'viz.dfs.finish': '{u} ist fertig: finish[{u}]={time}.',
  'viz.dfs.newTree':
    '{node} ist noch WEISS und von {source} aus nicht erreichbar: Dort beginnt ein neuer DFS-Baum.',
  'viz.dfs.done':
    'DFS abgeschlossen. Die Beschriftungen zeigen disc-/finish-Zeiten; die hervorgehobenen Kanten bilden den DFS-Baum.',
  'viz.dfs.doneForest':
    'DFS abgeschlossen. Die Beschriftungen zeigen disc-/finish-Zeiten; die hervorgehobenen Kanten bilden die DFS-Bäume.',

  // --- Dijkstra ------------------------------------------------------------
  'viz.dij.init': 'Initialisierung: dist[{source}]=0, alle anderen ∞.',
  'viz.dij.extract': 'Entnimm den nächstgelegenen unbesuchten Knoten: {u} (dist={dist}).',
  'viz.dij.relax': 'Relaxiere Kante {u}-{v} (Gewicht {weight}): dist[{u}]+{weight} gegen dist[{v}]={distV}.',
  'viz.dij.improved': 'Verbessert: dist[{v}] = {dist}, pred[{v}] = {u}.',
  'viz.dij.done': 'Fertig. Die hervorgehobenen Kanten bilden den Kürzeste-Wege-Baum ab der Quelle.',

  // --- Bellman-Ford --------------------------------------------------------
  'viz.bf.init':
    'Initialisierung: dist[{source}]=0, alle anderen ∞. Dieser Beispielgraph hat nur nicht-negative Gewichte (Dijkstra funktioniert hier also auch) — die Stärke von Bellman-Ford sind Graphen mit negativen Kanten; er relaxiert aber trotzdem jede Kante V−1 mal.',
  'viz.bf.pass': 'Durchlauf {pass} von {total}: relaxiere jede Kante einmal.',
  'viz.bf.relax': 'Relaxiere {u}→{v} (Gewicht {weight}): dist[{u}]+{weight} gegen dist[{v}]={distV}.',
  'viz.bf.negativeCycle':
    'Auch nach V−1 Durchläufen verbessert eine weitere Relaxation noch eine Distanz: Von der Quelle aus ist ein Kreis mit negativem Gewicht erreichbar.',
  'viz.bf.noNegativeCycle':
    'Alle Kanten noch einmal geprüft: Nichts verbessert sich, es gibt also keinen negativen Kreis. Die hervorgehobenen Kanten bilden den Kürzeste-Wege-Baum.',
  'viz.bf.converged':
    'In Durchlauf {pass} hat sich keine Kante geändert — die Distanzen sind bereits konvergiert (die restlichen Durchläufe wären wirkungslos, der Lehrbuch-Algorithmus führt aber immer alle V−1 aus).',

  // --- Kruskal -------------------------------------------------------------
  'viz.kru.start':
    'Beginne mit jedem Knoten in einer eigenen Menge. Sortiere alle {edges} Kanten aufsteigend nach Gewicht.',
  'viz.kru.consider':
    'Betrachte Kante {from}-{to} (Gewicht {weight}). set({from})={rootA}, set({to})={rootB}.',
  'viz.kru.accept': 'Verschiedene Mengen → nimm {from}-{to} in den MST auf und vereinige die Mengen.',
  'viz.kru.reject': 'Bereits dieselbe Menge → {from}-{to} würde einen Kreis bilden. Verwerfen.',
  'viz.kru.done': 'MST vollständig: {accepted} Kanten verbinden alle {nodes} Knoten.',

  // --- Prim ----------------------------------------------------------------
  'viz.prim.start': 'Starte Prim bei {source}: key[{source}]=0, alle anderen Schlüssel ∞.',
  'viz.prim.extract': 'Entnimm den günstigsten anzuschließenden Knoten: {u} (key={key}).',
  'viz.prim.consider': 'Kante {u}-{v} (Gewicht {weight}) gegen key[{v}]={keyV}.',
  'viz.prim.cheaper': 'Günstigere Verbindung gefunden: key[{v}] = {weight}, parent[{v}] = {u}.',
  'viz.prim.done': 'Fertig. Die hervorgehobenen Kanten bilden den minimalen Spannbaum ab der Quelle.',

  // --- naive string matching ----------------------------------------------
  'viz.naive.intro':
    'Text T der Länge {n}, Muster P der Länge {m}. Probiere jede Verschiebung 0..{last}.',
  'viz.naive.tryShift': 'Probiere Verschiebung sft = {sft}: lege P unter T[{sft}, …, {end}].',
  'viz.naive.mismatch': "P[{j}] = '{pj}' ≠ T[{ti}] = '{tc}' — Verschiebung {sft} ist ungültig.",
  'viz.naive.match': "P[{j}] = '{pj}' = T[{ti}] — stimmt bisher überein.",
  'viz.naive.valid': 'Alle {m} Zeichen stimmen überein — sft = {sft} ist eine gültige Verschiebung.',

  // --- Rabin-Karp ----------------------------------------------------------
  'viz.rk.preprocess':
    'Vorverarbeitung in Θ(m): berechne p = Wert von P mod {q} = {p} und t_0 = Wert von T[0..{last}] mod {q} = {t}.',
  'viz.rk.spurious':
    'Explizite Prüfung: P[{j}] ≠ T[{ti}] — unechter Treffer, sft = {sft} ist tatsächlich ungültig.',
  'viz.rk.hashHit':
    'Verschiebung {sft}: t_{sft} = p (mod {q}) — der schnelle Test besteht, es könnte aber ein unechter Treffer sein. Zeichenweise überprüfen.',
  'viz.rk.hashMiss':
    'Verschiebung {sft}: t_{sft} ≠ p (mod {q}) — garantiert kein Treffer, die explizite Prüfung entfällt vollständig.',
  'viz.rk.confirmed': 'Explizite Prüfung bestanden: sft = {sft} ist ein echter, bestätigter Treffer.',
  'viz.rk.roll':
    'Rolle den Hash weiter: t_{next} = 10·(t_{sft} − T[{sft}]·h) + T[{tail}], mod {q} = {value}.',

  // --- BST -----------------------------------------------------------------
  'viz.bst.compare': 'Füge {value} ein: vergleiche mit {node}.',
  'viz.bst.insertLeft': '{value} < {node}: als linkes Kind einfügen.',
  'viz.bst.insertRight': '{value} >= {node}: als rechtes Kind einfügen.',
  'viz.bst.noLeftChild':
    '{value} hat kein linkes Kind (Blatt oder Halbblatt): setze das rechte Kind an seine Stelle.',
  'viz.bst.noRightChild': '{value} hat kein rechtes Kind (Halbblatt): setze das linke Kind an seine Stelle.',
  'viz.bst.twoChildren':
    '{value} hat zwei Kinder: sein Nachfolger ist {succ} (der linkeste Knoten des rechten Teilbaums).',
  'viz.bst.detachSucc': 'Löse {succ} von seiner alten Stelle und gib ihm den rechten Teilbaum von {value}.',
  'viz.bst.succTakesPlace': '{succ} nimmt den Platz von {value} ein und erbt auch dessen linken Teilbaum.',

  // --- AVL -----------------------------------------------------------------
  'viz.avl.insertLeaf': '{value} wurde als Blatt eingefügt (bis hierhin ein reines BST-Einfügen).',
  'viz.avl.walkUp': 'Gehe hoch zu {node}: Höhe={height}, Balancefaktor={bf}.',
  'viz.avl.lrCase':
    '{node} ist linkslastig (bf={bf}) und sein linkes Kind {child} ist rechtslastig: zuerst Linksrotation bei {child} (LR-Fall).',
  'viz.avl.llCase': '{node} ist linkslastig (bf={bf}): Rechtsrotation bei {node} (LL-Fall).',
  'viz.avl.rlCase':
    '{node} ist rechtslastig (bf={bf}) und sein rechtes Kind {child} ist linkslastig: zuerst Rechtsrotation bei {child} (RL-Fall).',
  'viz.avl.rrCase': '{node} ist rechtslastig (bf={bf}): Linksrotation bei {node} (RR-Fall).',
  'viz.avl.rebalanced':
    'Rebalanciert. Beim AVL-Einfügen ist höchstens eine Rotation nötig, daher muss kein Vorfahre oberhalb dieser Stelle mehr geprüft werden.',
  'viz.avl.noLeftChild': '{value} hat kein linkes Kind: setze das rechte Kind an seine Stelle.',
  'viz.avl.noRightChild': '{value} hat kein rechtes Kind: setze das linke Kind an seine Stelle.',
  'viz.avl.succTakesPlace': '{succ} nimmt den Platz von {value} ein und erbt dessen Teilbäume.',
  'viz.avl.doneInsert': 'Alle Werte eingefügt. Jeder Knoten erfüllt |Balancefaktor| ≤ 1.',
  'viz.avl.doneDelete': 'Alle Löschvorgänge abgeschlossen. Jeder Knoten erfüllt |Balancefaktor| ≤ 1.',

  // --- Red-Black tree ------------------------------------------------------
  'viz.rbt.startingTree': 'Ausgangs-Rot-Schwarz-Baum, aufgebaut aus [{values}].',
  'viz.rbt.insertRedLeaf': 'Füge {value} als rotes Blatt ein (BST-Einfügen).',
  'viz.rbt.case1Left':
    'Fall 1 (Onkel {uncle} ist rot): färbe Vater und Onkel schwarz, Großvater rot.',
  'viz.rbt.case2Left': 'Fall 2 (Onkel schwarz, z ist inneres Kind): Linksrotation bei {node}.',
  'viz.rbt.case3Left': 'Fall 3 (Onkel schwarz, z ist äußeres Kind): umfärben und Rechtsrotation beim Großvater.',
  'viz.rbt.case2Right': 'Fall 2 (Onkel schwarz, z ist inneres Kind): Rechtsrotation bei {node}.',
  'viz.rbt.case3Right': 'Fall 3 (Onkel schwarz, z ist äußeres Kind): umfärben und Linksrotation beim Großvater.',
  'viz.rbt.recolorRoot': 'Färbe die Wurzel schwarz (Regel 2 muss immer gelten).',
  'viz.rbt.doneInsert': 'Alle Werte eingefügt. Jeder Weg von der Wurzel zu einem Blatt hat dieselbe Schwarzhöhe.',
  'viz.rbt.twoChildren': '{value} hat zwei Kinder: Nachfolger {succ} nimmt seinen Platz ein.',
  'viz.rbt.splicedBlack':
    'Der herausgelöste Knoten war schwarz — der Baum kann jetzt unbalanciert sein. Es folgt die Reparatur.',
  'viz.rbt.doneDelete': 'Alle Löschvorgänge abgeschlossen. Die Rot-Schwarz-Eigenschaften sind wiederhergestellt.',
  'viz.rbt.delCase1Left': 'Fall 1: Der Bruder ist rot — umfärben und Linksrotation bei {parent}.',
  'viz.rbt.delCase2':
    'Fall 2: Beide Kinder des Bruders sind schwarz — färbe den Bruder rot und schiebe das Defizit nach oben.',
  'viz.rbt.delCase3Left': 'Fall 3: Der äußere Neffe des Bruders ist schwarz — umfärben und Rechtsrotation bei {node}.',
  'viz.rbt.delCase4Left': 'Fall 4: Linksrotation bei {parent} — das Defizit ist behoben.',
  'viz.rbt.delCase1Right': 'Fall 1: Der Bruder ist rot — umfärben und Rechtsrotation bei {parent}.',
  'viz.rbt.delCase3Right': 'Fall 3: Der äußere Neffe des Bruders ist schwarz — umfärben und Linksrotation bei {node}.',
  'viz.rbt.delCase4Right': 'Fall 4: Rechtsrotation bei {parent} — das Defizit ist behoben.',

  // --- Splay tree ----------------------------------------------------------
  'viz.splay.insertLeaf': 'Füge {value} ein: ein reines BST-Einfügen setzt es als neues Blatt.',
  'viz.splay.zig': 'Zig: Der Vater von {node} ({parent}) ist die Wurzel — eine einzelne Rotation.',
  'viz.splay.zigzigLeft':
    'Zig-Zig: {node} und sein Vater sind beide linke Kinder — zuerst um den Großvater rotieren, dann um den Vater.',
  'viz.splay.zigzigRight':
    'Zig-Zig: {node} und sein Vater sind beide rechte Kinder — zuerst um den Großvater rotieren, dann um den Vater.',
  'viz.splay.zigzag':
    'Zig-Zag: {node} und sein Vater liegen auf gegenüberliegenden Seiten — zuerst um den Vater rotieren, dann um den Großvater.',
  'viz.splay.searchFound': 'Suche {value}: an diesem Knoten gefunden.',
  'viz.splay.searchAbsent':
    'Suche {value}: nicht vorhanden — die Suche fällt hier aus dem Baum, beim zuletzt besuchten Knoten ({node}).',
  'viz.splay.splayed': '{value} wurde zur Wurzel gesplayt.',
  'viz.splay.splayedFound': '{value} wurde zur Wurzel gesplayt.',
  'viz.splay.splayedNotFound':
    '{value} wurde zur Wurzel gesplayt (die Suche splayt auch dann, wenn sie erfolglos war).',
  'viz.splay.insertionsDone': 'Einfügen abgeschlossen.',
  'viz.splay.deleteEmpty': 'Lösche {value}: Der Baum ist leer, nichts zu tun.',
  'viz.splay.deleteAbsent':
    'Lösche {value}: nicht vorhanden ({root} wurde stattdessen zur Wurzel gesplayt) — der Baum bleibt unverändert.',
  'viz.splay.deleteRoot':
    'Lösche {value}: Es ist jetzt die Wurzel (gerade gesplayt). Entferne es; der Baum zerfällt in L (linker Teilbaum) und R (rechter Teilbaum).',
  'viz.splay.lEmpty': 'L ist leer: R wird zum neuen Baum.',
  'viz.splay.findMax': 'Suche das Maximum von L: {max} (ganz rechts absteigen — es hat kein rechtes Kind).',
  'viz.splay.attachR': '{max} ist die neue Wurzel von L (ohne rechtes Kind); hänge R direkt als rechtes Kind an.',

  // --- heap ----------------------------------------------------------------
  'viz.heap.insertAppend':
    'Füge {value} ein: an Index {i} anhängen (der letzte freie Platz — so bleibt der Baum vollständig).',
  'viz.heap.siftUp':
    'Vergleiche Index {i} ({vi}) mit Vaterindex {p} ({vp}): {vi} > {vp} verletzt die Heap-Eigenschaft — nach oben sichten.',
  'viz.heap.swapped': 'Getauscht. {value} liegt jetzt an Index {i}.',
  'viz.heap.settled':
    '{value} bleibt an Index {i}: Der Vater (falls vorhanden) ist jetzt ≥ {value}, die Heap-Eigenschaft ist wiederhergestellt.',
  'viz.heap.doneInsert': 'Alle Werte eingefügt. Jeder Vater ist ≥ seine Kinder.',
  'viz.heap.startArray': 'Ausgangsarray [{values}], noch nicht heap-geordnet.',
  'viz.heap.heapify':
    'heapify an Index {i} ({vi}): mit den Kindern vergleichen — das größte ist Index {largest} ({vl}).',
  'viz.heap.siftDown': 'Tausche Index {i} und {largest}: {vl} steigt auf, {vi} sinkt weiter ab.',
  'viz.heap.built': 'Heap aufgebaut: [{values}] erfüllt jetzt überall die Max-Heap-Eigenschaft.',
  'viz.heap.extractMax': 'Extrahiere das Maximum: die Wurzel ist {max}.',
  'viz.heap.moveLast':
    'Setze das letzte Element ({value}) an die Wurzel und verkleinere den Heap auf Größe {size}. {max} wandert ans Ende der sortierten Ausgabe.',
  'viz.heap.restored':
    'Die Heap-Eigenschaft ist für die verbleibenden {size} Element(e) wiederhergestellt. Bisher extrahiert: [{extracted}].',
  'viz.heap.doneExtract': 'Fertig. Extrahiert in absteigender Reihenfolge: [{extracted}].',

  // --- B-Tree --------------------------------------------------------------
  'viz.btree.starting': 'Ausgangs-B-Baum (Grad t = {t}, also {min}–{max} Schlüssel pro Nicht-Wurzelknoten).',
  'viz.btree.splitChild':
    'Das Kind war voll ({max} Schlüssel): Der Median {median} wandert nach oben in den Vater; die übrigen Schlüssel teilen sich auf zwei Knoten mit je t−1 Schlüsseln auf.',
  'viz.btree.splitNode':
    'Der Knoten war voll ({max} Schlüssel): Der Median {median} wandert nach oben in den Vater; die übrigen Schlüssel teilen sich auf zwei Knoten mit je t−1 Schlüsseln auf.',
  'viz.btree.splitRoot':
    'Füge {key} ein: Die Wurzel ist voll — sie wird zuerst gespalten. Die Höhe des Baums wächst um eins.',
  'viz.btree.insertStart': 'Füge {key} ein: Start an der Wurzel.',
  'viz.btree.descend': '{key} steigt in das Kind ab, das die Schlüssel zwischen {low} und {high} enthält.',
  'viz.btree.insertedLeaf':
    '{key} an der sortierten Position ins Blatt eingefügt (das Blatt hat nun {count} Schlüssel).',
  'viz.btree.doneInsert':
    'Alle Einfügeoperationen abgeschlossen. Jeder Nicht-Wurzelknoten hat zwischen t−1 und 2t−1 Schlüssel.',
  'viz.btree.mergeChildren':
    'Beide benachbarten Kinder haben genau t−1 Schlüssel — verschmelze sie zusammen mit dem Trennschlüssel {sep} aus dem Vater zu einem Knoten mit {count} Schlüsseln.',
  'viz.btree.borrowLeft':
    'Der linke Bruder hat ≥ t Schlüssel: Rotation über den Vater — {down} wandert hinunter in das unterbesetzte Kind, {up} wandert hinauf an dessen Stelle.',
  'viz.btree.borrowRight':
    'Der rechte Bruder hat ≥ t Schlüssel: Rotation über den Vater — {down} wandert hinunter in das unterbesetzte Kind, {up} wandert hinauf an dessen Stelle.',
  'viz.btree.removeLeaf': '{key} liegt in einem Blatt mit Schlüsseln zum Abgeben — direkt entfernen.',
  'viz.btree.usePredecessor':
    '{key} liegt in einem inneren Knoten; das Vorgängerkind hat ≥ t Schlüssel — ersetze {key} durch den Vorgänger {pred} und lösche {pred} anschließend aus diesem Kind.',
  'viz.btree.useSuccessor':
    '{key} liegt in einem inneren Knoten; das Vorgängerkind hat nur t−1 Schlüssel, das Nachfolgerkind aber ≥ t — ersetze {key} durch den Nachfolger {succ} und lösche {succ} anschließend aus diesem Kind.',
  'viz.btree.keyAbsent': '{key} ist nicht im Baum.',
  'viz.btree.descendDelete': 'Steige in das Kind ab, das {key} abdeckt (jetzt garantiert ≥ t Schlüssel).',
  'viz.btree.deleteEmpty': 'Lösche {key}: Der Baum ist leer.',
  'viz.btree.deleteStart': 'Lösche {key}: Start an der Wurzel.',
  'viz.btree.rootShrank':
    'Die Wurzel wurde durch eine Verschmelzung leer — ihr einziges verbleibendes Kind wird zur neuen Wurzel. Die Höhe des Baums sinkt um eins.',
  'viz.btree.nowEmpty': 'Der Baum ist jetzt leer.',
  'viz.btree.doneDelete':
    'Alle Löschvorgänge abgeschlossen. Jeder Nicht-Wurzelknoten hat weiterhin zwischen t−1 und 2t−1 Schlüssel.',
};
