import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowDownWideNarrow, GitBranch, Play, RotateCcw } from 'lucide-react';
import { algorithmRegistry, getAlgorithm } from './registry';
import { StepPlayer } from './core/StepPlayer';

export function VisualizerPage() {
  const { algoId } = useParams();
  const navigate = useNavigate();
  const algorithm = algoId ? getAlgorithm(algoId) : undefined;
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
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {algorithmRegistry.map((a) => {
            const Icon = a.id === 'bst-insert' ? GitBranch : ArrowDownWideNarrow;
            return (
              <Link
                key={a.id}
                to={`/visualize/${a.id}`}
                className="card flex items-center gap-3 p-4 transition-colors hover:bg-[var(--color-surface-hover)]"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--color-accent-dim)] text-[var(--color-accent)]">
                  <Icon size={16} />
                </span>
                <span className="font-medium text-[var(--color-text-h)]">{a.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  let parsedInput: unknown;
  let parseError: string | null = null;
  try {
    parsedInput = JSON.parse(inputText);
  } catch {
    parseError = 'Invalid JSON input.';
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text-h)]">{algorithm.title}</h1>
        <select className="input" value={algorithm.id} onChange={(e) => navigate(`/visualize/${e.target.value}`)}>
          {algorithmRegistry.map((a) => (
            <option key={a.id} value={a.id}>
              {a.title}
            </option>
          ))}
        </select>
      </div>
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
      {parseError ? (
        <p className="text-[var(--color-bad)]">{parseError}</p>
      ) : (
        <StepPlayer algorithm={algorithm} input={parsedInput} />
      )}
    </div>
  );
}
