import type { ComponentType } from 'react';
import type { Vars } from '../../../lib/i18n/locale';
import type { MessageKey } from '../../../lib/i18n/messages';

/**
 * A step's narration, as a catalogue key plus its interpolation values rather than a finished
 * sentence. This keeps `generateSteps` free of any locale dependency — it stays a pure function of
 * its input, which is what lets `gradeTrace` re-run it as ground truth — while the player renders
 * the sentence in whichever language is active.
 */
export interface StepText {
  key: MessageKey;
  vars?: Vars;
}

/** Shorthand for building a `StepText` inline. */
export function msg(key: MessageKey, vars?: Vars): StepText {
  return vars ? { key, vars } : { key };
}

export interface AlgorithmStep<TState> {
  state: TState;
  highlightLine?: number;
  description: StepText;
  meta?: Record<string, unknown>;
}

export type AlgorithmFamily = 'Sorting' | 'Non-Comparison Sorting' | 'Trees' | 'Graphs' | 'Strings';

export interface AlgorithmDef<TInput, TState> {
  id: string;
  title: string;
  topicId: string;
  family: AlgorithmFamily;
  pseudocode: string[];
  defaultInput: TInput;
  generateSteps: (input: TInput) => AlgorithmStep<TState>[];
  Renderer: ComponentType<{ step: AlgorithmStep<TState> }>;
  InputEditor?: ComponentType<{ value: TInput; onChange: (value: TInput) => void }>;
  /** Normalizes the final step's state into a plain value comparable to a `trace` question's expectedFinalOutput. Defaults to the raw state. */
  extractResult?: (finalState: TState) => unknown;
}

// Loosened for the registry, which holds algorithms of differing TInput/TState.
export type AnyAlgorithmDef = AlgorithmDef<any, any>;
