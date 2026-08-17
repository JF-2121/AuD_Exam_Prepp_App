---
id: shortest-paths
title: "Shortest Paths & Maximum Flow"
category: "Graphs"
order: 2
relatedAlgorithmIds: ["dijkstra"]
sourceFiles: ["AuD_AnkiDeck"]
---

## Single-Source Shortest Paths (SSSP)

Given a weighted graph and a source vertex, find the shortest (minimum total weight) path from the source to every other vertex. Every algorithm below is built on the same primitive:

```
relax(G, u, v, w):
  if v.dist > u.dist + w(u,v) then
    v.dist = u.dist + w(u,v); v.pred = u
```

Rule: positive-weight cycles never help (only add cost) and negative-weight cycles make "shortest path" undefined (you could loop forever, decreasing cost each time) — so a shortest path is always simple. A shortest path's every subpath is itself a shortest path between its endpoints.

## Dijkstra's Algorithm

Greedily grows a set of "finalized" vertices in increasing order of shortest known distance, using a **min-priority queue**. At each step, pop the closest unfinalized vertex, and **relax** its outgoing edges (update a neighbor's distance if going through this vertex is shorter).

```
Dijkstra(G, s)
  for each vertex v: dist[v] = ∞
  dist[s] = 0
  PQ = min-priority-queue of all vertices, keyed by dist
  WHILE PQ not empty DO
    u = extract-min(PQ)
    for each neighbor v of u with edge weight w(u,v):
      IF dist[u] + w(u,v) < dist[v] THEN
        dist[v] = dist[u] + w(u,v); parent[v] = u
        decrease-key(PQ, v, dist[v])
```

**Complexity**: O((V+E) log V) with a binary-heap priority queue.

**Critical limitation**: Dijkstra **requires non-negative edge weights**. A negative edge can invalidate the "greedy, never revisit a finalized vertex" assumption and produce a wrong answer.

## Bellman-Ford Algorithm

Handles **negative edge weights** (but not negative cycles reachable from the source — if one exists, there is no shortest path, and Bellman-Ford can detect this). Relaxes *every* edge, V−1 times.

```
BellmanFord(G, s)
  for each vertex v: dist[v] = ∞
  dist[s] = 0
  REPEAT V-1 times:
    for each edge (u,v) with weight w: 
      IF dist[u] + w < dist[v] THEN dist[v] = dist[u] + w
  for each edge (u,v) with weight w:      // detect negative cycle
    IF dist[u] + w < dist[v] THEN report "negative cycle"
```

**Complexity**: O(V·E) — much slower than Dijkstra, but strictly more general.

## DAG Shortest Paths

If the graph is guaranteed acyclic, there's a faster option than Bellman-Ford: topologically sort once, then relax every vertex's outgoing edges in that order. Because a topological order guarantees every predecessor of u is processed before u, one pass suffices — no repeated relaxation needed.

```
DAGShortestPaths(G, s, w)
  initSSSP(G, s, w)
  topologically sort V
  for each u in V, in topological order:
    for each v in adj(u):
      relax(G, u, v, w)
```

**Complexity**: Θ(V+E) — faster than both Dijkstra and Bellman-Ford, but only applicable to DAGs.

## A* Search

A goal-directed variant of Dijkstra: adds a **heuristic** estimate `u.heur` (e.g. straight-line distance to the target t) so the priority queue orders vertices by `dist + heur` instead of `dist` alone, biasing exploration toward the target instead of expanding uniformly in all directions. Stops as soon as the target is popped from the queue.

**Trade-offs vs. Dijkstra**: usually much faster in practice (fewer wasted expansions away from the goal), but needs extra memory for the heuristic values and — like Dijkstra — still doesn't handle negative weights.

| Algorithm | Handles negative weights? | Time | Notes |
|---|---|---|---|
| BFS | n/a (unweighted only) | O(V+E) | shortest path by edge count |
| DAG shortest paths | Yes (no cycles to begin with) | Θ(V+E) | fastest, but DAG-only |
| Dijkstra | No | O((V+E) log V) | classic greedy SSSP |
| A* | No | O((V+E) log V) | Dijkstra + goal-directed heuristic |
| Bellman-Ford | Yes (detects negative cycles) | O(V·E) | most general, slowest |

## Maximum Flow (Ford-Fulkerson)

A different problem on weighted directed graphs: given a source s, a sink t, and edge **capacities**, find the maximum total flow that can be pushed from s to t without exceeding any edge's capacity.

**Ford-Fulkerson method**: repeatedly find an **augmenting path** (a path from s to t with spare capacity) in the **residual graph** — a graph tracking remaining forward capacity *and* a backward edge for flow already sent (so flow can be "undone" if a better routing is found) — and push flow equal to the path's bottleneck capacity along it. **Terminates when no augmenting path exists**; at that point the found flow is provably maximum (max-flow min-cut theorem).

Key facts:
- The residual graph typically has **more** edges than the original (each original edge can contribute both a forward and a backward residual edge).
- **Flow conservation**: at every intermediate node (not s or t), total incoming flow always equals total outgoing flow exactly.
- Max flow is *not* simply "sum of capacities into the sink" — that sum is only an upper bound (a specific cut's capacity); the actual max flow is bounded by the **minimum** cut capacity over all s-t cuts.
