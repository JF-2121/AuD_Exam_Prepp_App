import type { ComponentType } from 'react';

export interface AlgorithmStep<TState> {
  state: TState;
  highlightLine?: number;
  description: string;
  meta?: Record<string, unknown>;
}

export type AlgorithmFamily = 'Sorting' | 'Trees' | 'Graphs';

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
