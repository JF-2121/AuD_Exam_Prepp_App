import { useEffect, useMemo, useState } from 'react';
import { recordExamAttempt } from '../../lib/db';
import type { ExamTemplate, Question, Topic } from '../../lib/types';
import { gradeQuestion, type GradeResult } from '../quiz/grading';
import { assembleExam } from './examAssembler';
import { MultipleChoice } from '../quiz/MultipleChoice';
import { ShortAnswer } from '../quiz/ShortAnswer';
import { TraceAlgorithm } from '../quiz/TraceAlgorithm';

type Phase = 'select' | 'running' | 'review';

export function ExamRunner({
  examTemplates,
  questions,
  topics,
}: {
  examTemplates: ExamTemplate[];
  questions: Question[];
  topics: Topic[];
}) {
  const [phase, setPhase] = useState<Phase>('select');
  const [templateId, setTemplateId] = useState(examTemplates[0]?.id);
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [cursor, setCursor] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [startedAt, setStartedAt] = useState('');
  const [results, setResults] = useState<Record<string, GradeResult> | null>(null);

  const template = examTemplates.find((t) => t.id === templateId);

  useEffect(() => {
    if (phase !== 'running' || secondsLeft <= 0) return;
    const id = window.setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => window.clearInterval(id);
  }, [phase, secondsLeft]);

  useEffect(() => {
    if (phase === 'running' && secondsLeft === 0) {
      submit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, phase]);

  function start() {
    if (!template) return;
    setExamQuestions(assembleExam(template, questions));
    setAnswers({});
    setCursor(0);
    setResults(null);
    setSecondsLeft(template.durationMinutes * 60);
    setStartedAt(new Date().toISOString());
    setPhase('running');
  }

  async function submit() {
    if (!template) return;
    const graded: Record<string, GradeResult> = {};
    const perTopicCorrect: Record<string, number> = {};
    const perTopicTotal: Record<string, number> = {};

    for (const q of examQuestions) {
      const r = gradeQuestion(q, answers[q.id]);
      graded[q.id] = r;
      perTopicTotal[q.topicId] = (perTopicTotal[q.topicId] ?? 0) + 1;
      if (r.correct) perTopicCorrect[q.topicId] = (perTopicCorrect[q.topicId] ?? 0) + 1;
    }

    const perTopic = Object.fromEntries(
      Object.keys(perTopicTotal).map((t) => [t, (perTopicCorrect[t] ?? 0) / perTopicTotal[t]]),
    );
    const totalCorrect = Object.values(graded).filter((r) => r.correct).length;
    const score = examQuestions.length ? totalCorrect / examQuestions.length : 0;

    await recordExamAttempt({
      examId: template.id,
      startedAt,
      finishedAt: new Date().toISOString(),
      score,
      perTopic,
    });

    setResults(graded);
    setPhase('review');
  }

  const topicTitle = useMemo(() => new Map(topics.map((t) => [t.id, t.title])), [topics]);

  if (phase === 'select') {
    return (
      <div>
        <h1 className="mb-4 text-2xl font-semibold text-[var(--color-text-h)]">Mock Exam</h1>
        {examTemplates.length === 0 ? (
          <p className="text-[var(--color-text-dim)]">No exam templates authored yet.</p>
        ) : (
          <>
            <select
              className="mb-4 rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-sm"
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
            >
              {examTemplates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.durationMinutes} min)
                </option>
              ))}
            </select>
            <div>
              <button className="btn btn-primary" onClick={start}>
                Start exam
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  if (phase === 'running') {
    const q = examQuestions[cursor];
    const minutes = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    return (
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-[var(--color-text-h)]">{template?.title}</h1>
          <span className="rounded bg-[var(--color-surface)] px-3 py-1 font-mono text-sm">
            {minutes}:{secs.toString().padStart(2, '0')}
          </span>
        </div>
        <div className="mb-3 flex flex-wrap gap-1">
          {examQuestions.map((eq, i) => (
            <button
              key={eq.id}
              className={`h-7 w-7 rounded text-xs ${
                i === cursor
                  ? 'bg-[var(--color-accent)] text-black'
                  : answers[eq.id] !== undefined
                    ? 'bg-[var(--color-good)] text-black'
                    : 'bg-[var(--color-surface)] text-[var(--color-text-dim)]'
              }`}
              onClick={() => setCursor(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>
        {q && (
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
            <p className="mb-2 text-xs uppercase tracking-wide text-[var(--color-text-dim)]">
              {topicTitle.get(q.topicId)} · {q.difficulty}
            </p>
            {q.type === 'multiple-choice' && (
              <MultipleChoice question={q} onSubmit={(a) => setAnswers((prev) => ({ ...prev, [q.id]: a }))} />
            )}
            {q.type === 'short-answer' && (
              <ShortAnswer question={q} onSubmit={(a) => setAnswers((prev) => ({ ...prev, [q.id]: a }))} />
            )}
            {q.type === 'trace' && (
              <TraceAlgorithm question={q} onSubmit={(a) => setAnswers((prev) => ({ ...prev, [q.id]: a }))} />
            )}
          </div>
        )}
        <div className="mt-4 flex justify-between">
          <button className="btn" disabled={cursor === 0} onClick={() => setCursor((c) => c - 1)}>
            ◀ Previous
          </button>
          {cursor < examQuestions.length - 1 ? (
            <button className="btn" onClick={() => setCursor((c) => c + 1)}>
              Next ▶
            </button>
          ) : (
            <button className="btn btn-primary" onClick={submit}>
              Submit exam
            </button>
          )}
        </div>
      </div>
    );
  }

  const totalCorrect = results ? Object.values(results).filter((r) => r.correct).length : 0;
  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold text-[var(--color-text-h)]">Results</h1>
      <p className="mb-4 text-[var(--color-text-dim)]">
        {totalCorrect}/{examQuestions.length} correct
      </p>
      <div className="flex flex-col gap-3">
        {examQuestions.map((q, i) => {
          const r = results?.[q.id];
          return (
            <div key={q.id} className="rounded border border-[var(--color-border)] p-3">
              <p className="text-xs text-[var(--color-text-dim)]">
                Q{i + 1} · {topicTitle.get(q.topicId)}
              </p>
              <p className="my-1">{q.prompt}</p>
              <p className={r?.correct ? 'text-[var(--color-good)]' : 'text-[var(--color-bad)]'}>
                {r?.correct ? 'Correct' : 'Incorrect'}
              </p>
              <p className="text-sm text-[var(--color-text-dim)]">{r?.explanation}</p>
            </div>
          );
        })}
      </div>
      <button className="btn btn-primary mt-4" onClick={() => setPhase('select')}>
        Back to exam menu
      </button>
    </div>
  );
}
