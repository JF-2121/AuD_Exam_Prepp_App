---
id: shortest-paths
title: "Shortest Paths & Maximum Flow"
category: "Graphs"
order: 2
relatedAlgorithmIds: ["dijkstra", "bellman-ford"]
sourceFiles: ["AuD_AnkiDeck", "AuD26_Sheet11-GrpSol.pdf"]
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
    u = extract-min(PQ)               // ties broken alphabetically
    for each neighbor v of u with edge weight w(u,v):
      IF dist[u] + w(u,v) < dist[v] THEN
        dist[v] = dist[u] + w(u,v); parent[v] = u
        decrease-key(PQ, v, dist[v])
```

**Complexity**: O((V+E) log V) with a binary-heap priority queue.

**Critical limitation**: Dijkstra **requires non-negative edge weights**. A negative edge can invalidate the "greedy, never revisit a finalized vertex" assumption and produce a wrong answer.

**Notation note**: when two unvisited vertices tie on `dist`, this course's convention is to extract them in **alphabetical order**. **Exam gotcha explicitly flagged by the tutors**: when filling in a step-by-step Dijkstra table, an unchanged cell must still be marked with an explicit **"="** (copy the value from the row above) — leaving it blank costs points, even though the value itself is "obviously" unchanged.

**Worked example** (6 nodes u,v,w,x,y,z, directed, start = u): extraction order **u → w → y → v → z → x**, giving `u.d=0`, `w.d=3`, `y.d=4`, `v.d=5`, `z.d=6`, `x.d=7`. The shortest path u→x is reconstructed by following `.pred` backward from x: **(u, w, y, v, x)**.

## Bellman-Ford Algorithm

Handles **negative edge weights** (but not negative cycles reachable from the source — if one exists, there is no shortest path, and Bellman-Ford can detect this). Relaxes *every* edge, V−1 times.

```
BellmanFord(G, s)
  for each vertex v: dist[v] = ∞
  dist[s] = 0
  REPEAT V-1 times:
    for each edge (u,v) with weight w:    // lexicographic (u,v) order each pass
      IF dist[u] + w < dist[v] THEN dist[v] = dist[u] + w
  for each edge (u,v) with weight w:      // detect negative cycle
    IF dist[u] + w < dist[v] THEN report "negative cycle"
```

**Complexity**: O(V·E) — much slower than Dijkstra, but strictly more general.

**Notation note**: this course relaxes edges **in lexicographic (u,v) order within every pass** (not an arbitrary or input order) — this affects which intermediate values appear after each individual pass (a value might "jump" straight to its final answer in pass 1 if its predecessor happens to be processed early), though the *converged* final distances after all V−1 passes are order-independent.

**Worked example** (6 nodes a–f, directed, start = e): pass 1 gives `c=16(e)`, `d=5(e)`, `f=3(e)`; pass 2 gives `a=20(c)`, `b=6(d)`, `c=5(d)` (improved again); pass 3 gives `a=5(c)`, `c=1(b)`; passes 4–5 change nothing (converged). Final: `e=0`, `d=5(e)`, `b=6(d)`, `c=1(b)`, `a=5(c)`, `f=3(e)`. Shortest path e→a = **(e, d, b, c, a)**.

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

**This course's specific search convention**: augmenting paths are found via a **DFS from s that always branches into the smallest-numbered/lettered reachable node first** (so `t` is taken immediately whenever it's directly reachable). Edge capacities are **ignored while searching for the path itself** — they only come into play afterward, to compute that path's **bottleneck** (the minimum residual capacity along its edges), which is how much flow gets pushed.

```
FordFulkerson(G, s, t):
  for each edge: flow = 0
  while an augmenting path p exists in the residual graph Gf (found via DFS(s), smallest-node-first):
    bottleneck = min residual capacity along p
    push `bottleneck` units of flow along p (increase forward edges, decrease/create backward residual edges)
  return total flow out of s
```

**Worked example**: a flow network with source s and sink t found augmenting paths in this order: `(s,2,3,t)` bottleneck 3, `(s,2,6,t)` bottleneck 1, `(s,2,8,t)` bottleneck 3, `(s,5,2,8,t)` bottleneck 3, `(s,5,6,t)` bottleneck 4, `(s,7,8,3,t)` bottleneck 1 — **max flow = 3+1+3+3+4+1 = 15**, and no further augmenting path exists in the residual graph at that point.

Key facts:
- The residual graph typically has **more** edges than the original (each original edge can contribute both a forward and a backward residual edge).
- **Flow conservation**: at every intermediate node (not s or t), total incoming flow always equals total outgoing flow exactly.
- Max flow is *not* simply "sum of capacities into the sink" — that sum is only an upper bound (a specific cut's capacity); the actual max flow is bounded by the **minimum** cut capacity over all s-t cuts.

## Modeling search problems as shortest-path graphs

Not every shortest-path problem starts out looking like a graph. A classic example: the **wolf/goat/cabbage river-crossing puzzle** (a farmer must ferry a wolf, a goat, and a cabbage across a river one at a time, never leaving an unsafe pair — wolf+goat, or goat+cabbage — alone together on a bank). Modeled as a graph: each **state** (which items are on the starting bank, including the farmer) is a node; each **edge** is one legal crossing. Running Dijkstra (or BFS, since every edge costs 1) from the start state to the empty-bank goal state finds the minimum number of crossings.

Two things this example makes concrete:
- **Tie-breaking changes *which* optimal solution you get, not whether it's optimal.** If two different shortest paths of equal length exist, the order in which Dijkstra breaks ties (e.g. alphabetically vs. some other rule) determines which one is returned — both are still correct minimum-cost answers.
- **Reweighting can change which path is "shortest."** If crossings carrying an animal are given cost 1 but crossings with just the cabbage (or the farmer alone) cost 0, the optimal path can shift entirely — and free zero-cost round trips can even make the optimum non-unique in a new way.
