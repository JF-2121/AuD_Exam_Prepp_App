import type { AlgorithmDef } from './types';
import { useStepPlayback } from './useStepPlayback';

export function StepPlayer<TInput, TState>({ algorithm, input }: { algorithm: AlgorithmDef<TInput, TState>; input: TInput }) {
  const steps = algorithm.generateSteps(input);
  const playback = useStepPlayback(steps.length);
  const step = steps[playback.index];

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <div className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <algorithm.Renderer step={step} />
        <p className="mt-4 text-sm text-[var(--color-text-dim)]">{step.description}</p>
        <div className="mt-4 flex items-center gap-2">
          <button className="btn" onClick={playback.stepBack} disabled={playback.index === 0}>
            ◀ Back
          </button>
          {playback.isPlaying ? (
            <button className="btn" onClick={playback.pause}>Pause</button>
          ) : (
            <button className="btn" onClick={playback.play} disabled={playback.index >= steps.length - 1}>
              ▶ Play
            </button>
          )}
          <button className="btn" onClick={playback.stepForward} disabled={playback.index >= steps.length - 1}>
            Next ▶
          </button>
          <button className="btn" onClick={playback.reset}>
            ⟲ Reset
          </button>
          <select
            className="ml-2 rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-1 text-sm"
            value={playback.speed}
            onChange={(e) => playback.setSpeed(Number(e.target.value))}
          >
            <option value={0.5}>0.5x</option>
            <option value={1}>1x</option>
            <option value={2}>2x</option>
            <option value={4}>4x</option>
          </select>
        </div>
        <input
          className="mt-3 w-full"
          type="range"
          min={0}
          max={steps.length - 1}
          value={playback.index}
          onChange={(e) => playback.scrubTo(Number(e.target.value))}
        />
        <p className="mt-1 text-xs text-[var(--color-text-dim)]">
          Step {playback.index + 1} / {steps.length}
        </p>
      </div>
      <div className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 md:w-72">
        <h3 className="mb-2 text-sm font-semibold text-[var(--color-text-h)]">Pseudocode</h3>
        <pre className="overflow-x-auto text-xs leading-6">
          {algorithm.pseudocode.map((line, i) => (
            <div
              key={i}
              className={
                i === step.highlightLine
                  ? 'rounded bg-[var(--color-accent-dim)] px-1 text-[var(--color-accent)]'
                  : 'px-1'
              }
            >
              {line}
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}
