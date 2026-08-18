---
id: minimum-spanning-trees
title: "Minimum Spanning Trees: Kruskal & Prim"
category: "Graphs"
order: 3
relatedAlgorithmIds: ["kruskal", "prim"]
sourceFiles: ["AuD_AnkiDeck"]
---

## Problem

Given a connected, undirected, weighted graph, find a **Minimum Spanning Tree (MST)**: a subset of edges connecting all vertices with no cycles, minimizing total edge weight. Both classic algorithms are **greedy** and both provably produce an optimal MST.

## Kruskal's Algorithm

Sort all edges by weight ascending. Repeatedly take the cheapest remaining edge and add it **unless it would create a cycle** (checked via a Union-Find / Disjoint-Set structure).

```
Kruskal(G)
  sort edges by weight ascending
  MST = {}
  for each vertex v: makeSet(v)
  for each edge (u,v) in sorted order:
    IF findSet(u) != findSet(v) THEN
      MST.add((u,v))
      union(u,v)
  return MST
```

**Complexity**: O(E log E) dominated by the sort (Union-Find operations are near-O(1) amortized with path compression).

## Prim's Algorithm

Grows a single tree from an arbitrary start vertex, always adding the cheapest edge that connects the current tree to a new vertex — structurally similar to Dijkstra, but keyed on edge weight rather than cumulative distance.

```
Prim(G, s)
  for each vertex v: key[v] = ∞
  key[s] = 0
  PQ = min-priority-queue of all vertices, keyed by key
  WHILE PQ not empty DO
    u = extract-min(PQ)
    for each neighbor v of u with edge weight w(u,v):
      IF v in PQ AND w(u,v) < key[v] THEN
        key[v] = w(u,v); parent[v] = u
        decrease-key(PQ, v, key[v])
```

**Complexity**: O(E log V) with a binary-heap priority queue.

## Kruskal vs. Prim

- Kruskal is edge-centric (good for sparse graphs, easy to parallelize the sort).
- Prim is vertex-centric (good for dense graphs, feels structurally like Dijkstra).
- Both give a correct MST; choice is mostly about graph density and implementation convenience.
