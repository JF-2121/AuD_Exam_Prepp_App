import { Component, Fragment, type ErrorInfo, type ReactNode } from 'react';

interface Labels {
  title: string;
  body: string;
  retry: string;
  details: string;
}

interface Props {
  children: ReactNode;
  labels: Labels;
  /**
   * Changing this discards a caught error and remounts the subtree — wired to the route, so simply
   * navigating elsewhere clears a broken page.
   */
  resetKey?: string;
}

interface State {
  error: Error | null;
  /** Bumped by "try again" to force a fresh mount of the children. */
  attempt: number;
  resetKey?: string;
}

/**
 * Without a boundary, one throw during render unmounts the entire React tree and leaves a blank
 * page that only a manual reload fixes. This keeps the failure local: the chrome stays up, and
 * remounting the subtree drops whatever component state caused the throw (e.g. a malformed
 * visualizer input), so "try again" genuinely recovers rather than re-throwing.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, attempt: 0 };

  static getDerivedStateFromProps(props: Props, state: State): Partial<State> | null {
    if (props.resetKey !== state.resetKey) return { resetKey: props.resetKey, error: null };
    return null;
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Keep the stack somewhere reachable; the UI only shows the message.
    console.error('[AuD Grind] render error:', error, info.componentStack);
  }

  private retry = () => this.setState((s) => ({ error: null, attempt: s.attempt + 1 }));

  render() {
    const { error } = this.state;
    // A keyed Fragment — not a wrapper element. The routes render `<aside>`/`<main>` as direct
    // children of a flex container, so an extra DOM node here would break the Topics two-column
    // layout; a Fragment still remounts the subtree on retry without adding one.
    if (!error) return <Fragment key={this.state.attempt}>{this.props.children}</Fragment>;

    const { labels } = this.props;
    return (
      <div className="card max-w-xl p-6">
        <h2 className="mb-1 text-lg font-semibold tracking-tight text-[var(--color-bad)]">{labels.title}</h2>
        <p className="mb-4 text-sm text-[var(--color-text-dim)]">{labels.body}</p>
        <button className="btn btn-primary" onClick={this.retry}>
          {labels.retry}
        </button>
        <details className="mt-4">
          <summary className="cursor-pointer text-xs text-[var(--color-text-dim)]">{labels.details}</summary>
          <pre className="mt-2 overflow-x-auto rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] p-3 text-[11px] text-[var(--color-text-dim)]">
            {error.message}
          </pre>
        </details>
      </div>
    );
  }
}
