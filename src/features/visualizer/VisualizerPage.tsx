import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AlertTriangle, ArrowDownWideNarrow, Boxes, CaseSensitive, GitBranch, Play, RotateCcw, Share2, type LucideIcon } from 'lucide-react';
import { algorithmRegistry, FAMILY_ORDER, getAlgorithm } from './registry';
import { msg, type AlgorithmFamily, type AlgorithmStep, type StepText } from './core/types';
import { StepPlayer } from './core/StepPlayer';
import { useT } from '../../lib/i18n/locale';
import type { MessageKey } from '../../lib/i18n/messages';

const FAMILY_ICON: Record<AlgorithmFamily, LucideIcon> = {
  Sorting: ArrowDownWideNarrow,
  'Non-Comparison Sorting': Boxes,
  Trees: GitBranch,
  Graphs: Share2,
  Strings: CaseSensitive,
};

export function VisualizerPage() {
  const t = useT();
  const { algoId } = useParams();
  const navigate = useNavigate();
  const algorithm = algoId ? getAlgorithm(algoId) : undefined;
  const hasInput = algorithm ? algorithm.defaultInput !== undefined : false;

  /**
   * Every algorithm takes a differently shaped input (a number array, `{initial, deletions}`,
   * `{values, radix}`, a bare source-node string, …), so the edit box must never outlive the
   * algorithm it belongs to. Resetting it in an effect was the bug behind the blank-page crash:
   * effects run *after* render, so the first render following a navigation handed the newly
   * selected algorithm the *previous* one's input and `generateSteps` threw mid-render.
   *
   * Tagging the edited text with the algorithm it was typed for, and falling back to the default
   * whenever the tag doesn't match the current route, removes that window entirely — the mismatch
   * is impossible rather than merely short-lived.
   */
  const defaultInputText = JSON.stringify(algorithm?.defaultInput ?? null);
  const [edited, setEdited] = useState<{ algoId: string; text: string } | null>(null);
  const inputText = edited && edited.algoId === algoId ? edited.text : defaultInputText;
  const setInputText = (text: string) => {
    if (algoId) setEdited({ algoId, text });
  };

  if (!algorithm) {
    return (
      <div>
        <h1 className="mb-1 flex items-center gap-2 text-2xl font-semibold tracking-tight text-[var(--color-text-h)]">
          <Play size={22} className="text-[var(--color-accent)]" /> {t('viz.title')}
        </h1>
        <p className="mb-5 text-sm text-[var(--color-text-dim)]">{t('viz.subtitle')}</p>
        <div className="flex flex-col gap-6">
          {FAMILY_ORDER.map((family) => {
            const algos = algorithmRegistry.filter((a) => a.family === family);
            if (algos.length === 0) return null;
            const Icon = FAMILY_ICON[family];
            return (
              <div key={family}>
                <h2 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-dim)]">
                  <Icon size={13} /> {t(`family.${family}` as MessageKey)}
                </h2>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {algos.map((a) => (
                    <Link
                      key={a.id}
                      to={`/visualize/${a.id}`}
                      className="card flex items-center gap-3 p-4 transition-colors hover:bg-[var(--color-surface-hover)]"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--color-accent-dim)] text-[var(--color-accent)]">
                        <Icon size={16} />
                      </span>
                      <span className="font-semibold text-[var(--color-text-h)]">{a.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /**
   * Three things can be wrong with a hand-edited input, and each gets its own sentence rather than
   * the error boundary: it isn't JSON; it is JSON of a shape this algorithm can't run on (caught by
   * `validateInput`, which names the offending field); or it slips past validation and still makes
   * `generateSteps` throw. Generating the steps here rather than inside `StepPlayer` is what makes
   * that last case catchable at all — a throw during a child's render escapes to the boundary.
   */
  let issue: StepText | null = null;
  let steps: AlgorithmStep<unknown>[] | null = null;
  try {
    const parsedInput = hasInput ? JSON.parse(inputText) : undefined;
    issue = algorithm.validateInput?.(parsedInput) ?? null;
    if (!issue) {
      try {
        steps = algorithm.generateSteps(parsedInput);
      } catch {
        issue = msg('viz.inputUnusable');
      }
    }
  } catch {
    issue = msg('viz.invalidJson');
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text-h)]">{algorithm.title}</h1>
        <select className="input" value={algorithm.id} onChange={(e) => navigate(`/visualize/${e.target.value}`)}>
          {FAMILY_ORDER.map((family) => (
            <optgroup key={family} label={t(`family.${family}` as MessageKey)}>
              {algorithmRegistry
                .filter((a) => a.family === family)
                .map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.title}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
      </div>
      {hasInput && (
        <div className="mb-4">
          <label className="text-sm text-[var(--color-text-dim)]" htmlFor="viz-input">
            {t('viz.inputLabel')}
          </label>
          <textarea
            id="viz-input"
            className="input mt-1 w-full"
            rows={2}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <div className="mt-1.5 flex flex-wrap items-start justify-between gap-2">
            {algorithm.inputHint && (
              <p className="min-w-0 flex-1 text-xs leading-relaxed text-[var(--color-text-dim)]">
                {t(algorithm.inputHint)}
              </p>
            )}
            <button className="btn shrink-0" onClick={() => setEdited(null)}>
              <RotateCcw size={13} /> {t('viz.resetDefault')}
            </button>
          </div>
        </div>
      )}
      {issue || !steps ? (
        <div className="card flex items-start gap-3 border-[var(--color-bad)] p-4">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-[var(--color-bad)]" />
          <div className="min-w-0">
            <p className="font-semibold text-[var(--color-text-h)]">{t('viz.inputProblem')}</p>
            <p className="mt-1 text-sm text-[var(--color-text-dim)]">
              {issue ? t(issue.key, issue.vars) : t('viz.inputUnusable')}
            </p>
            <button className="btn mt-3" onClick={() => setEdited(null)}>
              <RotateCcw size={13} /> {t('viz.resetDefault')}
            </button>
          </div>
        </div>
      ) : (
        <StepPlayer algorithm={algorithm} steps={steps} />
      )}
    </div>
  );
}
