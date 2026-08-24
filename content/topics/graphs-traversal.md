---
id: graphs-traversal
title: "Graphs: Representation, BFS & DFS"
category: "Graphs"
order: 1
relatedAlgorithmIds: ["bfs", "dfs"]
sourceFiles: ["AuD-Zusammenfassung.pdf", "AuD_AnkiDeck", "AuD26_Sheet09-Sol.pdf"]
---

## Representation

- **Adjacency list**: for each node, a list of its neighbors. Space Θ(V+E). Checking "is (u,v) an edge?" costs O(degree(u)) — worst case O(V), since a single node's list can be as long as V−1.
- **Adjacency matrix**: a V×V boolean/weight grid. Space Θ(V²), O(1) edge lookup, wasteful for sparse graphs.
- **Converting between them** is Θ(V²): `MatrixToList(M)` scans every row and appends `j` to `L[i]` whenever `M[i][j] = 1`; `ListToMatrix(L)` zero-initializes an V×V matrix, then for each `i` walks `L[i]` and sets `M[i][j] = 1` for every neighbor `j` found.
- For an **undirected** graph converted from a directed one (replacing every directed edge `(u,v)` with an undirected `{u,v}`), the resulting adjacency matrix `A'` is always **symmetric** (`A'[u][v] = A'[v][u] = 1`) — so `A' = (A')ᵀ`, transposition changes nothing.

## Breadth-First Search (BFS)

Explores the graph in layers outward from a source, using a **queue**. Discovers the **shortest path in terms of edge count** (unweighted shortest path) from the source to every reachable node.

```
BFS(G, s)
  for each vertex u: color[u] = WHITE, dist[u] = ∞
  color[s] = GRAY; dist[s] = 0; enqueue(Q, s)
  WHILE Q not empty DO
    u = dequeue(Q)
    for each neighbor v of u:
      IF color[v] == WHITE THEN
        color[v] = GRAY; dist[v] = dist[u] + 1; parent[v] = u
        enqueue(Q, v)
    color[u] = BLACK
```

**Complexity**: Θ(V + E) — every vertex enqueued once, every edge examined once (twice for undirected).

**Notation note**: when a node has multiple undiscovered neighbors, this course's convention is to discover them in **ascending (lexicographically smallest first) order**. Exam traces are filled into an **iteration table**: for each while-loop pass, record the node `u` just dequeued, which neighbors `v` were newly discovered this step, and the queue `Q`'s contents at the end of the step.

**Worked example** (7-node directed graph, BFS from C, ties broken ascending):

| Iteration | u | v discovered | Q after |
|---|---|---|---|
| 0 | – | – | [C] |
| 1 | C | B, E, F | [B, E, F] |
| 2 | B | D, G | [E, F, D, G] |
| 3 | E | – | [F, D, G] |
| 4 | F | A | [D, G, A] |
| 5 | D | – | [G, A] |
| 6 | G | – | [A] |
| 7 | A | – | [] |

Final distances from C: B=1, E=1, F=1, D=2, G=2, A=2.

## Depth-First Search (DFS)

Explores as far as possible along each branch before backtracking, using a **stack** (explicit, or the call stack via recursion). Used as a building block for topological sort, cycle detection, and strongly-connected-components algorithms.

```
DFS(G)
  for each vertex u: color[u] = WHITE
  time = 0
  for each vertex u: if color[u] == WHITE then DFS-VISIT(u)

DFS-VISIT(u)
  color[u] = GRAY; time += 1; disc[u] = time
  for each neighbor v of u:
    IF color[v] == WHITE THEN parent[v] = u; DFS-VISIT(v)
  color[u] = BLACK; time += 1; finish[u] = time
```

**Complexity**: Θ(V + E), same as BFS — the difference is exploration order (stack/LIFO vs. queue/FIFO), not asymptotic cost.

**BFS vs. DFS**: use BFS when you need shortest paths in an unweighted graph or level-by-level exploration; use DFS when you need to explore full paths, detect cycles, or compute finishing-time-based properties (topological order, SCCs).

## Edge classification (via DFS)

Every edge examined during a DFS falls into one of four types, determined by the color/discovery-time of the node it points to:

| Type | When (u,v) is examined | Meaning |
|---|---|---|
| Tree edge | v.color == WHITE | v discovered for the first time via this edge |
| Back edge | v.color == GRAY | v is an ancestor of u (this edge closes a cycle) |
| Forward edge | v.color == BLACK and u.disc < v.disc | v is a descendant of u, already finished |
| Cross edge | v.color == BLACK and u.disc > v.disc | v is in an already-explored, unrelated part of the tree |

**Undirected graphs only ever produce tree and back edges** — no forward or cross edges are possible, since every edge is encountered from both endpoints.

**Notation note**: when a node has multiple undiscovered choices, DFS exam traces in this course sometimes specify **descending** order (largest key first) rather than ascending — always check which convention a given exercise states, since it changes the resulting disc/finish numbering (though not the underlying tree structure's correctness).

**Reading off edge types from disc/finish intervals** — once every node has a `(disc, finish)` pair, classify each non-tree edge `(u,v)` purely from interval containment, no need to re-run DFS: if `v`'s interval is **nested inside** `u`'s and `v` is a strict descendant → **forward edge**; if `u`'s interval is nested inside `v`'s → **back edge**; if the two intervals are **disjoint** → **cross edge** (and by the parenthesis theorem, no other relationship between two intervals is possible). This interval trick is the fast way to classify every edge in an exam once the disc/finish table is filled in.

## Topological Sort

Only defined for a **DAG** (Directed Acyclic Graph). Orders all vertices so that every edge (u,v) has u appearing before v.

```
TOPOLOGICAL-SORT(G)
  run DFS(G); each time a vertex finishes, insert it at the FRONT of a linked list L
  return L
```

**Complexity**: Θ(V+E) (same as DFS; front-insertion into a linked list is Θ(1)).

## Strongly Connected Components (SCC)

A maximal set of vertices C where every pair u,v ∈ C has a path u→v **and** v→u. Two different SCCs never overlap.

```
SCC(G)
  run DFS(G)                                    // get finish times
  compute Gᵀ                                     // transpose: reverse every edge
  run DFS(Gᵀ), visiting vertices in the main loop by DESCENDING finish time from step 1
  output each DFS tree from step 3 as one SCC
```

**Complexity**: Θ(V+E) — two DFS passes plus building the transpose.

**Worked example** (10-node directed graph, exploring the smallest element first): the first DFS(G) pass produces tree edges `1→3→6→2→4→7→10` (backtrack) then `2→5→9→8` (backtrack all the way out), with finish times `10:8, 7:9, 4:10, 9:15, 8:14, 5:16, 2:17, 6:18, 3:19, 1:20`. The second DFS runs on `Gᵀ`, visiting vertices in the main loop by **descending finish time** from the first pass (so starting from 1, then 3, then 6, …). This produces five DFS trees in `Gᵀ`, each one exactly one SCC: **{1}, {3}, {2,4,6}, {5,8,9}, {7,10}** — 5 strongly connected components total.

**Edge cases, from the same example**:
- **Adding an edge can merge multiple SCCs into one**, but never more than that (it cannot *split* an SCC). Adding edge `5→1` to the graph above threads a cycle through four of the five components (`{1}, {3}, {2,4,6}, {5,8,9}` — everything except `{7,10}`, which stays disconnected from this new edge), merging all four into a single SCC: the total count drops from 5 to **2**.
- **Removing an edge can split one SCC into several**, but never merges anything. Removing the edge `8→5` from the (already-merged, or original) `{5,8,9}` component breaks its internal cycle, splitting it into **three** separate singleton SCCs `{5}, {8}, {9}`: the total count increases by **2**.
- In general: adding an edge can only **decrease or maintain** the SCC count; removing an edge can only **increase or maintain** it — never the reverse.

## Eulerian Circuit (bonus)

An **Eulerian circuit** is a cycle on a (strongly) connected directed graph that visits **every edge exactly once** (vertices may repeat).

- **Necessary condition**: an Eulerian circuit exists only if every vertex's **in-degree equals its out-degree**. *Proof sketch*: if the circuit visits vertex `v` exactly `k` times, it must use exactly `k` incoming and `k` outgoing edges at `v` (one pair per visit) — and since the circuit never reuses an edge, `v` can have **at most** `k` incoming and `k` outgoing edges in the whole graph, or some edge at `v` would never get visited. So in-degree = out-degree = k exactly.
- **Greedy walk always closes into *some* cycle**: starting at an arbitrary vertex, repeatedly following an arbitrary unused outgoing edge (recording each edge visited) is guaranteed to terminate back at the start — never stuck at a different vertex. Why: if the partial walk has used `k'` outgoing edges from some vertex `v` (other than the start), the in-degree = out-degree guarantee means it must also have `k'` (or `k'−1`, for the start vertex) incoming edges accounted for — so there's always another outgoing edge available to leave through, **unless** `v` is the start vertex, in which case the walk must terminate there.
- **But a single greedy walk may not cover every edge.** If it stops early (back at the start with unused edges elsewhere in the graph), find any vertex on the current cycle that still has an unused outgoing edge, and repeat the same greedy-walk construction from there to get a second edge-disjoint cycle sharing that one vertex — then **splice** the two cycles together at their shared vertex into one larger cycle. Repeating this splicing process until no unused edges remain anywhere produces a true Eulerian circuit.
