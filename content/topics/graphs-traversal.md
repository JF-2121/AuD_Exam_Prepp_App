---
id: graphs-traversal
title: "Graphs: Representation, BFS & DFS"
category: "Graphs"
order: 1
relatedAlgorithmIds: ["bfs", "dfs"]
sourceFiles: ["AuD-Zusammenfassung.pdf", "AuD_AnkiDeck"]
---

## Representation

- **Adjacency list**: for each node, a list of its neighbors. Space Θ(V+E), good for sparse graphs, checking "is (u,v) an edge?" costs O(degree(u)).
- **Adjacency matrix**: a V×V boolean/weight grid. Space Θ(V²), O(1) edge lookup, wasteful for sparse graphs.

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
