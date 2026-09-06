---
id: algorithm-basics
title: "What Is an Algorithm?"
category: "Grundlagen"
order: 1
relatedAlgorithmIds: []
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

A loop-invariant proof always has the same three-part skeleton — **initialization** (true before the first iteration), **maintenance** (if true before an iteration, still true before the next), **termination** (combined with the loop's exit condition, implies the postcondition). Three short worked examples, all on a non-empty integer array `A`:

```
Minimum(A):                      Average(A):                     MaxIndex(A):
  len = length(A)                  len = length(A)                  len = length(A)
  min = A[0]                       sum = A[0]                       idx = -1
  for i = 1 to len-1:               for i = 1 to len-1:               conditionTrue = true
    if A[i] < min:                   sum = sum + A[i]                 for i = 1 to len-1:
      min = A[i]                   avg = sum / len                     if A[i] < 2*A[i-1] and conditionTrue:
  return min                       return avg                            idx = i
                                                                        else:
                                                                          conditionTrue = false
                                                                      return idx
```

- **Minimum**: invariant — "before the i-th iteration, `min` is the minimum of `A[0..i-1]`." Maintenance: `A[i] < min` updates min correctly (it's smaller than everything seen so far); otherwise min was already ≤ A[i], so it's still valid. At loop exit (i=len), min is the minimum of the whole array.
- **Average**: invariant — "before the i-th iteration, `sum` is the sum of `A[0..i-1]`." Same init/maintenance/termination shape; `avg = sum/len` after the loop is the mean by definition.
- **MaxIndex** (find the largest index `idx` such that `A[1..idx]` is a run where each element is less than double its predecessor, or −1 if this fails immediately): invariant — "`conditionTrue` is true iff the run-condition has held for every step so far, and `idx` is the largest valid index found (or −1)." The `conditionTrue` flag is what makes this a genuine invariant rather than just tracking the latest index: once the condition fails once, it must **latch false** for all later iterations — this is a common pattern for "largest prefix satisfying X" problems, where a single violation invalidates every index after it, not just the violating one.

**Reasons to deliberately choose a *less* efficient algorithm** (a common exam reflection question): a simpler algorithm is easier to formally verify; runtime itself can leak secret information (a side-channel), so a **constant-time** algorithm is sometimes chosen over a faster-on-average one specifically to avoid that leak; and a highly parallel algorithm may do more total work sequentially than a simpler serial one, while still finishing faster in wall-clock time on real hardware. Other resources worth optimizing besides raw time: **variance** of runtime (constant-time algorithms), **size** of the algorithm itself (silicon area in hardware, lines of code in software), the **kind** of operations used (e.g. restricting to only additions, which may be cheaper on specific hardware), and **parallelizability**.

## Data structures

Data structures organize and store data so algorithms can operate on it efficiently. The choice of structure directly affects runtime and memory use. Broad families covered in this course: arrays/lists, stacks/queues, trees, graphs, and hash-based structures.
