import { msg, type AlgorithmDef, type AlgorithmStep, type StepText } from '../../core/types';
import { BucketRenderer, type RadixState } from './BucketRenderer';

// The course's pseudocode (AuD-Zusammenfassung §4.6): LSD-first, one stable bucket pass per digit.
const pseudocode = [
  'radixSort(A)                    // keys have d digits, base D',
  '  for i = 0 to d-1              // i = 0 is the least significant digit',
  '    for j = 0 to n-1',
  '      putBucket(A, i, j, buckets)   // append A[j] to the bucket for its i-th digit',
  '    read buckets back into A in order 0..D-1, then clear buckets',
];

export interface RadixInput {
  /**
   * Keys written as numerals **in `radix`** (e.g. "54" with radix 8 is the lecture's 54₈), which
   * keeps the input readable in whatever base the exercise uses instead of forcing a decimal
   * translation the student then has to undo mentally.
   */
  values: string[];
  radix: number;
}

/** Digit of `numeral` at `pos` counted from the right; 0 when the numeral is shorter (zero padding). */
function digitAt(numeral: string, pos: number, radix: number): number {
  const i = numeral.length - 1 - pos;
  if (i < 0) return 0;
  const d = Number.parseInt(numeral[i], radix);
  return Number.isNaN(d) ? 0 : d;
}

function generateSteps({ values, radix }: RadixInput): AlgorithmStep<RadixState>[] {
  const base = Math.min(Math.max(Math.trunc(radix) || 10, 2), 16);
  let a = values.map((v) => String(v).trim()).filter((v) => v.length > 0);
  const n = a.length;
  const digitCount = Math.max(1, ...a.map((v) => v.length));
  const steps: AlgorithmStep<RadixState>[] = [];

  const emptyBuckets = () => Array.from({ length: base }, (): string[] => []);
  const push = (state: RadixState, description: StepText, highlightLine: number) =>
    steps.push({ state, description, highlightLine });

  if (n === 0) {
    push(
      { array: [], output: [], buckets: emptyBuckets(), radix: base, digitCount, digitPos: 0, phase: 'done' },
      msg('viz.radix.nothing'),
      0,
    );
    return steps;
  }

  push(
    {
      array: [...a],
      output: Array(n).fill(null),
      buckets: emptyBuckets(),
      radix: base,
      digitCount,
      digitPos: 0,
      phase: 'distribute',
    },
    msg('viz.radix.intro', { n, digits: digitCount, base }),
    0,
  );

  for (let pos = 0; pos < digitCount; pos++) {
    const buckets = emptyBuckets();
    const snapshot = [...a];

    push(
      {
        array: snapshot,
        output: Array(n).fill(null),
        buckets: emptyBuckets(),
        radix: base,
        digitCount,
        digitPos: pos,
        phase: 'distribute',
      },
      msg('viz.radix.passStart', { pos }),
      1,
    );

    // --- distribute -------------------------------------------------------
    for (let j = 0; j < n; j++) {
      const value = snapshot[j];
      const d = digitAt(value, pos, base);
      buckets[d].push(value);
      const padded = value.length - 1 - pos < 0;
      push(
        {
          array: snapshot,
          output: Array(n).fill(null),
          buckets: buckets.map((b) => [...b]),
          radix: base,
          digitCount,
          digitPos: pos,
          phase: 'distribute',
          activeIndex: j,
          activeBucket: d,
        },
        msg(padded ? 'viz.radix.placePadded' : 'viz.radix.place', { j, value, pos, digit: d }),
        3,
      );
    }

    // --- collect ----------------------------------------------------------
    const output: (string | null)[] = Array(n).fill(null);
    const remaining = buckets.map((b) => [...b]);
    let written = 0;

    push(
      {
        array: snapshot,
        output: [...output],
        buckets: remaining.map((b) => [...b]),
        radix: base,
        digitCount,
        digitPos: pos,
        phase: 'collect',
      },
      msg('viz.radix.bucketed', { n, last: base - 1 }),
      4,
    );

    for (let k = 0; k < base; k++) {
      while (remaining[k].length > 0) {
        const value = remaining[k].shift()!;
        output[written] = value;
        written++;
        push(
          {
            array: snapshot,
            output: [...output],
            buckets: remaining.map((b) => [...b]),
            radix: base,
            digitCount,
            digitPos: pos,
            phase: 'collect',
            activeBucket: k,
          },
          msg('viz.radix.collect', { value, bucket: k, index: written - 1 }),
          4,
        );
      }
    }

    a = output as string[];
    push(
      {
        array: [...a],
        output: [...output],
        buckets: emptyBuckets(),
        radix: base,
        digitCount,
        digitPos: pos,
        phase: 'collect',
      },
      msg('viz.radix.passEnd', { pos }),
      1,
    );
  }

  push(
    {
      array: [...a],
      output: a.map((v) => v),
      buckets: emptyBuckets(),
      radix: base,
      digitCount,
      digitPos: digitCount - 1,
      phase: 'done',
    },
    msg('viz.radix.done', { digits: digitCount, base }),
    0,
  );

  return steps;
}

export const radixSort: AlgorithmDef<RadixInput, RadixState> = {
  id: 'radix-sort',
  title: 'Radix Sort',
  topicId: 'sorting-radix',
  family: 'Non-Comparison Sorting',
  pseudocode,
  // The lecture's own worked example (AuD26 Sheet 04, G2a): octal keys, b = 6 bits, r = 3.
  defaultInput: { values: ['54', '24', '71', '10', '52', '77', '33'], radix: 8 },
  generateSteps,
  Renderer: BucketRenderer,
  extractResult: (state) => state.array,
};
