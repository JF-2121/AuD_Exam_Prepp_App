import { msg, type AlgorithmDef, type AlgorithmStep } from '../../core/types';
import { StringMatchRenderer, type StringMatchState } from './StringMatchRenderer';
import { nonEmpty, shape, stringList } from '../../core/inputSchema';

const pseudocode = [
  'NaiveStringMatching(T, P):',
  '  n = length(T); m = length(P)',
  '  L = []',
  '  for sft = 0 to n - m:',
  '    isValid = true',
  '    for j = 0 to m - 1:',
  '      if P[j] != T[sft + j]:',
  '        isValid = false',
  '    if isValid:',
  '      L = append(L, sft)',
  '  return L',
];

export interface StringMatchInput {
  text: string[];
  pattern: string[];
}

function generateSteps({ text, pattern }: StringMatchInput): AlgorithmStep<StringMatchState>[] {
  const n = text.length;
  const m = pattern.length;
  const matches: number[] = [];
  const steps: AlgorithmStep<StringMatchState>[] = [
    { state: { text, pattern, matches: [] }, description: msg('viz.naive.intro', { n, m, last: n - m }), highlightLine: 1 },
  ];

  for (let sft = 0; sft <= n - m; sft++) {
    let isValid = true;
    let matchedUpTo = 0;
    steps.push({ state: { text, pattern, matches: [...matches], sft, matchedUpTo: 0 }, description: msg('viz.naive.tryShift', { sft, end: sft + m - 1 }), highlightLine: 3 });
    for (let j = 0; j < m; j++) {
      if (pattern[j] !== text[sft + j]) {
        isValid = false;
        steps.push({
          state: { text, pattern, matches: [...matches], sft, matchedUpTo, mismatchIndex: j },
          description: msg('viz.naive.mismatch', { j, pj: pattern[j], ti: sft + j, tc: text[sft + j], sft }),
          highlightLine: 7,
        });
        break;
      }
      matchedUpTo = j + 1;
      steps.push({
        state: { text, pattern, matches: [...matches], sft, matchedUpTo },
        description: msg('viz.naive.match', { j, pj: pattern[j], ti: sft + j }),
        highlightLine: 6,
      });
    }
    if (isValid) {
      matches.push(sft);
      steps.push({ state: { text, pattern, matches: [...matches], sft, matchedUpTo: m }, description: msg('viz.naive.valid', { m, sft }), highlightLine: 9 });
    }
  }

  steps.push({ state: { text, pattern, matches: [...matches] }, description: msg('viz.d.validShifts', { shifts: matches.join(', ') }), highlightLine: 10 });
  return steps;
}

export const naiveStringMatch: AlgorithmDef<StringMatchInput, StringMatchState> = {
  id: 'string-match-naive',
  title: 'Naive String Matching',
  topicId: 'string-matching',
  family: 'Strings',
  pseudocode,
  defaultInput: { text: ['a', 'a', 'b', 'a', 'a', 'a', 'a', 'a', 'b'], pattern: ['a', 'a', 'b'] },
  generateSteps,
  Renderer: StringMatchRenderer,
  validateInput: shape({ text: stringList, pattern: nonEmpty(stringList) }),
  inputHint: 'viz.hint.stringMatch',
  extractResult: (state) => state.matches,
};
