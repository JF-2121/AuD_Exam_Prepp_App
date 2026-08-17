---
id: shortest-paths
title: "Shortest Paths & Maximum Flow"
category: "Graphs"
order: 2
relatedAlgorithmIds: []
sourceFiles: ["AuD_AnkiDeck"]
---

## Single-Source Shortest Paths (SSSP)

Given a weighted graph and a source vertex, find the shortest (minimum total weight) path from the source to every other vertex.

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

| Algorithm | Handles negative weights? | Time |
|---|---|---|
| Dijkstra | No | O((V+E) log V) |
| Bellman-Ford | Yes (detects negative cycles) | O(V·E) |
| BFS (unweighted only) | n/a | O(V+E) |

## Maximum Flow (Ford-Fulkerson)

A different problem on weighted directed graphs: given a source s, a sink t, and edge **capacities**, find the maximum total flow that can be pushed from s to t without exceeding any edge's capacity.

**Ford-Fulkerson method**: repeatedly find an **augmenting path** (a path from s to t with spare capacity) in the **residual graph** — a graph tracking remaining forward capacity *and* a backward edge for flow already sent (so flow can be "undone" if a better routing is found) — and push flow equal to the path's bottleneck capacity along it. **Terminates when no augmenting path exists**; at that point the found flow is provably maximum (max-flow min-cut theorem).

Key facts:
- The residual graph typically has **more** edges than the original (each original edge can contribute both a forward and a backward residual edge).
- **Flow conservation**: at every intermediate node (not s or t), total incoming flow always equals total outgoing flow exactly.
- Max flow is *not* simply "sum of capacities into the sink" — that sum is only an upper bound (a specific cut's capacity); the actual max flow is bounded by the **minimum** cut capacity over all s-t cuts.
