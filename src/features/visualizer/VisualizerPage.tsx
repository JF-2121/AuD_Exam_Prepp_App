import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowDownWideNarrow, GitBranch, Play, RotateCcw, Share2, type LucideIcon } from 'lucide-react';
import { algorithmRegistry, FAMILY_ORDER, getAlgorithm } from './registry';
import type { AlgorithmFamily } from './core/types';
import { StepPlayer } from './core/StepPlayer';

const FAMILY_ICON: Record<AlgorithmFamily, LucideIcon> = {
  Sorting: ArrowDownWideNarrow,
  Trees: GitBranch,
  Graphs: Share2,
};

export function VisualizerPage() {
  const { algoId } = useParams();
  const navigate = useNavigate();
  const algorithm = algoId ? getAlgorithm(algoId) : undefined;
  const hasInput = algorithm ? algorithm.defaultInput !== undefined : false;
  const [inputText, setInputText] = useState(() => JSON.stringify(algorithm?.defaultInput ?? []));

  useEffect(() => {
    setInputText(JSON.stringify(algorithm?.defaultInput ?? []));
  }, [algoId]);

  if (!algorithm) {
    return (
      <div>
        <h1 className="mb-1 flex items-center gap-2 text-2xl font-semibold tracking-tight text-[var(--color-text-h)]">
          <Play size={22} className="text-[var(--color-accent)]" /> Visualize
        </h1>
        <p className="mb-5 text-sm text-[var(--color-text-dim)]">Pick an algorithm to step through interactively.</p>
        <div className="flex flex-col gap-6">
          {FAMILY_ORDER.map((family) => {
            const algos = algorithmRegistry.filter((a) => a.family === family);
            if (algos.length === 0) return null;
            const Icon = FAMILY_ICON[family];
            return (
              <div key={family}>
                <h2 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-dim)]">
                  <Icon size={13} /> {family}
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

  let parsedInput: unknown;
  let parseError: string | null = null;
  try {
    parsedInput = hasInput ? JSON.parse(inputText) : undefined;
  } catch {
    parseError = 'Invalid JSON input.';
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text-h)]">{algorithm.title}</h1>
        <select className="input" value={algorithm.id} onChange={(e) => navigate(`/visualize/${e.target.value}`)}>
          {FAMILY_ORDER.map((family) => (
            <optgroup key={family} label={family}>
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
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <label className="text-sm text-[var(--color-text-dim)]">Input (JSON):</label>
          <input
            className="input w-full sm:w-72"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button className="btn" onClick={() => setInputText(JSON.stringify(algorithm.defaultInput))}>
            <RotateCcw size={13} /> Reset to default
          </button>
        </div>
      )}
      {parseError ? (
        <p className="text-[var(--color-bad)]">{parseError}</p>
      ) : (
        <StepPlayer algorithm={algorithm} input={parsedInput} />
      )}
    </div>
  );
}
