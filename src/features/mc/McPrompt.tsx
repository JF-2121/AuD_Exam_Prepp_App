/**
 * Renders an MC prompt, honouring ``` fences so the pseudocode-carrying questions (e.g. the
 * runtime-analysis one from the 2025 paper) stay readable. Deliberately not react-markdown:
 * prompts are plain text plus the occasional code block, and this keeps the MC chunk light.
 */
export function McPrompt({ text, className = '' }: { text: string; className?: string }) {
  const parts = text.split(/```\n?/);
  return (
    <div className={className}>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <pre
            key={i}
            className="my-2 overflow-x-auto rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] p-3 text-[12.5px] leading-relaxed text-[var(--color-text-dim)]"
          >
            {part.replace(/\n$/, '')}
          </pre>
        ) : (
          part && (
            <p key={i} className="whitespace-pre-wrap">
              {part.replace(/\n+$/, '')}
            </p>
          )
        ),
      )}
    </div>
  );
}
