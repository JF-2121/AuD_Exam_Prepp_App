---
id: algorithm-basics
title: "What Is an Algorithm?"
category: "Grundlagen"
order: 1
relatedAlgorithmIds: []
sourceFiles: ["AuD-Zusammenfassung.pdf", "AuD_AnkiDeck"]
---

## Definition

An algorithm (Algorithmus) is a rule for transforming an input into an output. To count as a proper algorithm it must satisfy:

**1. Bestimmt (determined)**
- **Determiniert**: the same input always yields the same output (no dependence on external factors).
- **Determinismus**: the same input always produces the exact same sequence of steps / intermediate states.

**2. Berechenbar (computable)**
- **Finit**: the description of the algorithm itself has finite length.
- **Terminierbar**: the algorithm halts in finite time for every finite input.
- **Effektiv**: every step is actually executable on a machine.

**3. Anwendbar (applicable)**
- **Allgemein**: works for an entire class of inputs, not just one special case.
- **Korrekt**: if it terminates without error, the output is the specified correct answer.

## Proving an algorithm correct

A standard correctness argument for a loop-based algorithm has three parts:

1. **Termination** — show the loop/recursion runs only finitely often (e.g. a counter strictly decreases toward a bound).
2. **Sortedness / correctness of output** — show the output actually satisfies the specification, typically via a **loop invariant**: a condition that is true before the first iteration, remains true after every iteration, and — combined with the loop's termination condition — implies correctness.
3. **Permutation property** (for in-place algorithms like sorting) — show the algorithm only *rearranges* existing values, never invents or drops one.

## Data structures

Data structures organize and store data so algorithms can operate on it efficiently. The choice of structure directly affects runtime and memory use. Broad families covered in this course: arrays/lists, stacks/queues, trees, graphs, and hash-based structures.
