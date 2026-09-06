import { useState } from 'react';
import { getAlgorithm } from '../visualizer/registry';
import type { TraceQuestion } from '../../lib/types';
import { useT } from '../../lib/i18n/locale';

export function TraceAlgorithm({
  question,
  onSubmit,
}: {
  question: TraceQuestion;
  onSubmit: (answer: unknown) => void;
}) {
  const t = useT();
  const algorithm = getAlgorithm(question.algorithmId);
  const [answerText, setAnswerText] = useState('');

  return (
    <div>
      <p className="mb-2">{question.prompt}</p>
      <p className="mb-3 text-xs text-[var(--color-text-dim)]">
        {t('quiz.traceInput')} <code>{JSON.stringify(question.initialInput)}</code>
        {algorithm ? t('quiz.traceFor', { algorithm: algorithm.title }) : ''}
      </p>
      <input
        className="w-full rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
        value={answerText}
        onChange={(e) => setAnswerText(e.target.value)}
        placeholder={t('quiz.tracePlaceholder')}
      />
      <button
        className="btn btn-primary mt-3"
        disabled={!answerText.trim()}
        onClick={() => {
          try {
            onSubmit(JSON.parse(answerText));
          } catch {
            onSubmit(answerText);
          }
        }}
      >
        {t('common.submit')}
      </button>
    </div>
  );
}
