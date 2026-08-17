import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
        <p className="mb-4 text-[var(--color-text-dim)]">Pick an algorithm to visualize:</p>
        <ul className="flex flex-col gap-1">
          {algorithmRegistry.map((a) => (
            <li key={a.id}>
              <Link to={`/visualize/${a.id}`} className="text-[var(--color-accent)] hover:underline">
                {a.title}
              </Link>
            </li>
          ))}
        </ul>
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
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[var(--color-text-h)]">{algorithm.title}</h1>
        <select
          className="rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-sm"
          value={algorithm.id}
          onChange={(e) => navigate(`/visualize/${e.target.value}`)}
        >
          {algorithmRegistry.map((a) => (
            <option key={a.id} value={a.id}>
              {a.title}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4 flex items-center gap-2">
        <label className="text-sm text-[var(--color-text-dim)]">Input (JSON):</label>
        <input
          className="w-72 rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-sm"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button className="btn" onClick={() => setInputText(JSON.stringify(algorithm.defaultInput))}>
          Reset to default
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
