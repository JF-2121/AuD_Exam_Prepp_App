---
id: minimum-spanning-trees
title: "Minimum Spanning Trees: Kruskal & Prim"
category: "Graphs"
order: 3
relatedAlgorithmIds: ["kruskal", "prim"]
sourceFiles: ["AuD_AnkiDeck", "AuD26_Sheet10-Sol.pdf"]
---

## Problem

Given a connected, undirected, weighted graph, find a **Minimum Spanning Tree (MST)**: a subset of edges connecting all vertices with no cycles, minimizing total edge weight. Both classic algorithms are **greedy** and both provably produce an optimal MST.

## Kruskal's Algorithm

Sort all edges by weight ascending. Repeatedly take the cheapest remaining edge and add it **unless it would create a cycle** (checked via a Union-Find / Disjoint-Set structure). **This course's convention: edges of equal weight are processed in alphabetical order** of their endpoints — an exam-relevant tie-break, since it determines the exact order accept/reject decisions are made in (though not the final MST weight, when the MST happens to be unique).

```
Kruskal(G)
  sort edges by weight ascending      // ties broken alphabetically by endpoint
  MST = {}
  for each vertex v: makeSet(v)
  for each edge (u,v) in sorted order:
    IF findSet(u) != findSet(v) THEN
      MST.add((u,v))
      union(u,v)
  return MST
```

**Complexity**: O(E log E) dominated by the sort (Union-Find operations are near-O(1) amortized with path compression).

**Worked example** (8 nodes a–h, sorted edges): `{f,g}=1` accept, `{b,c}=2` accept, `{f,h}=2` accept, `{b,h}=3` accept, `{g,h}=3` **reject** (cycle: f-g-h already connects them), `{c,h}=4` **reject** (cycle), `{d,e}=4` accept, `{a,b}=5` accept, `{a,g}=6` **reject** (cycle), `{d,h}=7` accept — 7 edges accepted for 8 nodes, done. Final MST weight = 1+2+2+3+4+5+7 = **24**.

## Prim's Algorithm

Grows a single tree from an arbitrary start vertex, always adding the cheapest edge that connects the current tree to a new vertex — structurally similar to Dijkstra, but keyed on edge weight rather than cumulative distance.

```
Prim(G, s)
  for each vertex v: key[v] = ∞
  key[s] = -∞                         // sentinel: guarantees s is extracted first
  PQ = min-priority-queue of all vertices, keyed by key
  WHILE PQ not empty DO
    u = extract-min(PQ)               // ties broken alphabetically
    for each neighbor v of u with edge weight w(u,v):
      IF v in PQ AND w(u,v) < key[v] THEN
        key[v] = w(u,v); parent[v] = u
        decrease-key(PQ, v, key[v])
```

**Notation note**: this course initializes the **start vertex's key to −∞**, not 0 — a pure sentinel to guarantee it is always extracted first regardless of what other keys look like (0 would work too here since all weights are positive, but −∞ is the general-purpose choice and is what the course's reference implementation literally names its constant: `MINUS_INFINITE`). Ties between equal-key vertices are broken **alphabetically**.

**Worked example** (same 8-node graph, start = a): extraction order **a → d → f → b → c → e → g → h**. Final MST edges: `{a,d}, {d,f}, {d,b}, {b,c}, {c,e}, {e,g}, {g,h}`. Total weight = 2+2+3+4+1+3+2 = **17**.

**Complexity**: O(E log V) with a binary-heap priority queue.

## Kruskal vs. Prim

- Kruskal is edge-centric (good for sparse graphs, easy to parallelize the sort).
- Prim is vertex-centric (good for dense graphs, feels structurally like Dijkstra).
- Both give a correct MST; choice is mostly about graph density and implementation convenience.
- **Exam-tested distinguishing fact**: Prim's intermediate result is **always a single connected tree** (it only ever grows one tree from the start vertex) — it can **never** produce a disjoint forest as an intermediate state. Kruskal, by contrast, routinely holds several disjoint tree fragments mid-run (they only merge into one tree at the very end). So if you're shown a partial highlighted-edge-set and asked "could this be a snapshot of Prim, Kruskal, both, or neither?" — a disconnected set of tree fragments **immediately rules out Prim**.

## Why the MST is (sometimes) unique

Two classic exchange-argument facts, both provable by contradiction (assume a counter-example MST, find a strictly cheaper swap):

- **Unique cheapest edge ⟹ it's in every MST.** If graph G has one edge `e` of strictly minimum weight, `e` belongs to *every* MST of G. (Proof sketch: adding `e` to any MST that excludes it creates exactly one cycle; every other edge on that cycle must be strictly heavier than `e`, so replacing one of them with `e` strictly decreases total weight — contradicting that the original was already minimum.)
- **All edge weights distinct ⟹ the MST is unique.** A direct consequence of applying the above fact repeatedly. If some weights tie, multiple distinct MSTs can exist (e.g. swapping between two equal-weight edges that both work).
