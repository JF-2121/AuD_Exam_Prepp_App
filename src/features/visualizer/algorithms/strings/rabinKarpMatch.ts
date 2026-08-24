import type { AlgorithmDef, AlgorithmStep } from '../../core/types';
import { StringMatchRenderer, type StringMatchState } from './StringMatchRenderer';

const pseudocode = [
  'RabinKarpMatch(T, P, q):',
  '  n = T.length; m = P.length',
  '  h = 10^(m-1) mod q',
  '  p, t0, L = 0, 0, []',
  '  for i = 0 to m - 1:',
  '    p  = (10*p  + P[i]) mod q',
  '    t0 = (10*t0 + T[i]) mod q',
  '  for sft = 0 to n - m:',
  '    if p == t_sft:                 // fast test — may be a spurious hit',
  '      b = true',
  '      for j = 0 to m - 1:',
  '        if P[j] != T[sft + j]: b = false; break',
  '      if b: L = append(L, sft)     // confirmed real match',
  '    if sft < n - m:',
  '      t_sft+1 = (10*(t_sft - T[sft]*h) + T[sft + m]) mod q   // O(1) rolling update',
  '  return L',
];

export interface RabinKarpInput {
  text: number[];
  pattern: number[];
  q: number;
}

function generateSteps({ text, pattern, q }: RabinKarpInput): AlgorithmStep<StringMatchState>[] {
  const n = text.length;
  const m = pattern.length;
  const matches: number[] = [];
  const steps: AlgorithmStep<StringMatchState>[] = [];

  const h = Math.pow(10, m - 1) % q;
  let p = 0;
  let t = 0;
  for (let i = 0; i < m; i++) {
    p = (10 * p + pattern[i]) % q;
    t = (10 * t + text[i]) % q;
  }
  steps.push({
    state: { text, pattern, matches: [], info: [{ label: 'p (pattern hash)', value: String(p) }, { label: 't_0 (first window hash)', value: String(t) }] },
    description: `Preprocess in Θ(m): compute p = value of P mod ${q} = ${p}, and t_0 = value of T[0..${m - 1}] mod ${q} = ${t}.`,
    highlightLine: 3,
  });

  for (let sft = 0; sft <= n - m; sft++) {
    const modMatch = t === p;
    steps.push({
      state: {
        text,
        pattern,
        matches: [...matches],
        sft,
        info: [
          { label: 'p', value: String(p) },
          { label: `t_${sft}`, value: String(t) },
          { label: `t_${sft} == p ?`, value: modMatch ? 'true' : 'false', ok: modMatch },
        ],
      },
      description: modMatch
        ? `Shift ${sft}: t_${sft} = p (mod ${q}) — fast test passes, but this could be a spurious hit. Verify character by character.`
        : `Shift ${sft}: t_${sft} ≠ p (mod ${q}) — guaranteed not a match, skip the explicit check entirely.`,
      highlightLine: 8,
    });

    if (modMatch) {
      let real = true;
      let matchedUpTo = 0;
      for (let j = 0; j < m; j++) {
        if (pattern[j] !== text[sft + j]) {
          real = false;
          steps.push({
            state: { text, pattern, matches: [...matches], sft, matchedUpTo, mismatchIndex: j, info: [{ label: 'verifying', value: `P[${j}] ≠ T[${sft + j}]` }] },
            description: `Explicit check: P[${j}] ≠ T[${sft + j}] — spurious hit ("unechter Treffer"), sft = ${sft} is not actually valid.`,
            highlightLine: 11,
          });
          break;
        }
        matchedUpTo = j + 1;
      }
      if (real) {
        matches.push(sft);
        steps.push({
          state: { text, pattern, matches: [...matches], sft, matchedUpTo: m, info: [{ label: 'verifying', value: 'all characters equal' }] },
          description: `Explicit check passes: sft = ${sft} is a real, confirmed match.`,
          highlightLine: 12,
        });
      }
    }

    if (sft < n - m) {
      const raw = 10 * (t - text[sft] * h) + text[sft + m];
      let next = raw % q;
      if (next < 0) next += q;
      steps.push({
        state: { text, pattern, matches: [...matches], sft, info: [{ label: `t_${sft + 1}`, value: `${next}  (rolled from t_${sft} in O(1))` }] },
        description: `Roll the hash: t_${sft + 1} = 10·(t_${sft} − T[${sft}]·h) + T[${sft + m}], mod ${q} = ${next}.`,
        highlightLine: 13,
      });
      t = next;
    }
  }

  steps.push({ state: { text, pattern, matches: [...matches] }, description: `Done. Valid shifts: [${matches.join(', ')}].`, highlightLine: 15 });
  return steps;
}

export const rabinKarpMatch: AlgorithmDef<RabinKarpInput, StringMatchState> = {
  id: 'string-match-rabin-karp',
  title: 'Rabin–Karp String Matching',
  topicId: 'string-matching',
  family: 'Strings',
  pseudocode,
  defaultInput: { text: [2, 1, 3, 1, 4, 9, 1, 3, 2, 3, 1, 4, 5, 3, 1, 4], pattern: [3, 1, 4], q: 13 },
  generateSteps,
  Renderer: StringMatchRenderer,
  extractResult: (state) => state.matches,
};
