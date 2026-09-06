import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Timer, Trophy } from 'lucide-react';
import { recordExamAttempt, recordQuizAttempt } from '../../lib/db';
import { mcFormat } from '../../lib/types';
import type { MultipleChoiceQuestion, Topic } from '../../lib/types';
import { McCard } from './McCard';
import {
  assembleMcExam,
  EXAM_INSTRUCTIONS,
  EXAM_MAX_POINTS,
  EXAM_MINUTES,
  EXAM_PASS_POINTS,
  gradeMc,
  scoreMcRun,
} from './mcBank';

type Phase = 'idle' | 'running' | 'review';

/**
 * A timed run in the real exam's MC shape: 6 × 1-of-4 then 18 × 2-of-4, 42 points, scored
 * all-or-nothing per question.
 */
export function McExam({
  questions,
  topics,
}: {
  questions: MultipleChoiceQuestion[];
  topics: Topic[];
}) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [paper, setPaper] = useState<MultipleChoiceQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [cursor, setCursor] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const startedAt = useRef('');

  const topicTitle = useMemo(() => new Map(topics.map((t) => [t.id, t.title])), [topics]);

  useEffect(() => {
    if (phase !== 'running') return;
    const id = window.setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(id);
  }, [phase]);

  // Time-up auto-submits. Kept in its own effect (rather than inside the tick) so the submit runs
  // once, after the state that drives it has settled.
  useEffect(() => {
    if (phase === 'running' && secondsLeft === 0) void finish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, secondsLeft]);

  function start() {
    setPaper(assembleMcExam(questions));
    setAnswers({});
    setCursor(0);
    setSecondsLeft(EXAM_MINUTES * 60);
    startedAt.current = new Date().toISOString();
    setPhase('running');
  }

  async function finish() {
    setPhase('review');
    const score = scoreMcRun(paper, answers);
    const perTopicCorrect: Record<string, number> = {};
    const perTopicTotal: Record<string, number> = {};
    for (const q of paper) {
      perTopicTotal[q.topicId] = (perTopicTotal[q.topicId] ?? 0) + 1;
      const grade = gradeMc(q, answers[q.id]);
      if (grade.correct) perTopicCorrect[q.topicId] = (perTopicCorrect[q.topicId] ?? 0) + 1;
      await recordQuizAttempt({
        questionId: q.id,
        topicId: q.topicId,
        correct: grade.correct,
        timestamp: new Date().toISOString(),
      });
    }
    await recordExamAttempt({
      examId: 'mc-section',
      startedAt: startedAt.current,
      finishedAt: new Date().toISOString(),
      score: score.maxPoints ? score.points / score.maxPoints : 0,
      perTopic: Object.fromEntries(
        Object.keys(perTopicTotal).map((t) => [t, (perTopicCorrect[t] ?? 0) / perTopicTotal[t]]),
      ),
    });
  }

  function toggle(q: MultipleChoiceQuestion, i: number) {
    const required = q.correctIndexes.length;
    setAnswers((prev) => {
      const cur = prev[q.id] ?? [];
      let next: number[];
      if (required === 1) next = [i];
      else if (cur.includes(i)) next = cur.filter((x) => x !== i);
      else if (cur.length >= required) next = cur;
      else next = [...cur, i];
      return { ...prev, [q.id]: next };
    });
  }

  if (phase === 'idle') return <ExamIntro onStart={start} available={questions.length} />;

  if (phase === 'running') {
    const q = paper[cursor];
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    const lowTime = secondsLeft < 300;
    const staged = scoreMcRun(paper, answers);
    return (
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-semibold tracking-tight text-[var(--color-text-h)]">
            MC Section · {EXAM_MAX_POINTS} points
          </h2>
          <span
            className={`flex items-center gap-1.5 rounded-md px-3 py-1 font-mono text-sm ${
              lowTime
                ? 'bg-[var(--color-bad-dim)] text-[var(--color-bad)]'
                : 'bg-[var(--color-surface)] text-[var(--color-text)]'
            }`}
          >
            <Timer size={14} />
            {minutes}:{seconds.toString().padStart(2, '0')}
          </span>
        </div>

        <QuestionPalette paper={paper} answers={answers} cursor={cursor} onJump={setCursor} />

        <p className="mb-3 text-xs text-[var(--color-text-dim)]">
          {staged.answered} of {paper.length} answered
        </p>

        {q && (
          <McCard
            question={q}
            topicTitle={topicTitle.get(q.topicId)}
            selected={answers[q.id] ?? []}
            onToggle={(i) => toggle(q, i)}
            label={`Q${cursor + 1} / ${paper.length}`}
          />
        )}

        <div className="mt-4 flex justify-between gap-2">
          <button className="btn" disabled={cursor === 0} onClick={() => setCursor((c) => c - 1)}>
            <ChevronLeft size={14} /> Previous
          </button>
          {cursor < paper.length - 1 ? (
            <button className="btn" onClick={() => setCursor((c) => c + 1)}>
              Next <ChevronRight size={14} />
            </button>
          ) : (
            <button className="btn btn-primary" onClick={() => void finish()}>
              Submit section
            </button>
          )}
        </div>
        {cursor < paper.length - 1 && (
          <button className="btn mt-3 w-full justify-center" onClick={() => void finish()}>
            Submit section early
          </button>
        )}
      </div>
    );
  }

  return <ExamReview paper={paper} answers={answers} topicTitle={topicTitle} onRestart={start} />;
}

function ExamIntro({ onStart, available }: { onStart: () => void; available: number }) {
  return (
    <div className="card p-6">
      <h2 className="mb-1 text-lg font-semibold tracking-tight text-[var(--color-text-h)]">
        Exam simulation
      </h2>
      <p className="mb-5 text-sm text-[var(--color-text-dim)]">
        The MC section exactly as it appears on the paper — {EXAM_MAX_POINTS} points in{' '}
        {EXAM_MINUTES} minutes, drawn fresh from all {available} questions each run.
      </p>

      <div className="mb-5 grid gap-3 sm:grid-cols-2">
        <PartCard
          title="Part I · 6 × 1 of 4"
          points="6 points"
          text={EXAM_INSTRUCTIONS.single.en}
          emphasis={false}
        />
        <PartCard
          title="Part II · 18 × 2 of 4"
          points="36 points"
          text={EXAM_INSTRUCTIONS.double.en}
          emphasis
        />
      </div>

      <p className="mb-5 text-xs text-[var(--color-text-dim)]">
        Pass mark on this section: {EXAM_PASS_POINTS} of {EXAM_MAX_POINTS} points, matching the
        paper's own 50/100 threshold.
      </p>

      <button className="btn btn-primary" onClick={onStart}>
        <Play size={14} /> Start the {EXAM_MINUTES}-minute section
      </button>
    </div>
  );
}

function PartCard({
  title,
  points,
  text,
  emphasis,
}: {
  title: string;
  points: string;
  text: string;
  emphasis: boolean;
}) {
  return (
    <div
      className={`rounded-md border p-4 ${
        emphasis
          ? 'border-[var(--color-accent)] bg-[var(--color-accent-dim)]'
          : 'border-[var(--color-border)] bg-[var(--color-bg)]'
      }`}
    >
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <span className="text-sm font-semibold text-[var(--color-text-h)]">{title}</span>
        <span
          className={`text-xs font-semibold ${emphasis ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-dim)]'}`}
        >
          {points}
        </span>
      </div>
      <p className="text-xs leading-relaxed text-[var(--color-text-dim)]">{text}</p>
    </div>
  );
}

function QuestionPalette({
  paper,
  answers,
  cursor,
  onJump,
}: {
  paper: MultipleChoiceQuestion[];
  answers: Record<string, number[]>;
  cursor: number;
  onJump: (i: number) => void;
}) {
  return (
    <div className="mb-4 flex flex-wrap gap-1">
      {paper.map((q, i) => {
        const answer = answers[q.id] ?? [];
        // Partially filled 2-of-4s get their own colour: an unfinished pick scores 0 like a blank,
        // so it must not look "done" the way a complete answer does.
        const complete = answer.length === q.correctIndexes.length;
        const partial = answer.length > 0 && !complete;
        const isDouble = mcFormat(q) === 'double';
        return (
          <button
            key={q.id}
            onClick={() => onJump(i)}
            title={`Q${i + 1} · ${isDouble ? '2 of 4' : '1 of 4'}`}
            className={`h-8 w-8 text-xs font-semibold transition-colors ${
              isDouble ? 'rounded-md' : 'rounded-full'
            } ${
              i === cursor
                ? 'bg-[var(--color-accent-fill)] text-[var(--color-on-accent-fill)]'
                : complete
                  ? 'bg-[var(--color-good-dim)] text-[var(--color-good)]'
                  : partial
                    ? 'bg-[var(--color-warn-dim)] text-[var(--color-warn)]'
                    : 'bg-[var(--color-surface)] text-[var(--color-text-dim)] hover:bg-[var(--color-surface-hover)]'
            }`}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );
}

function ExamReview({
  paper,
  answers,
  topicTitle,
  onRestart,
}: {
  paper: MultipleChoiceQuestion[];
  answers: Record<string, number[]>;
  topicTitle: Map<string, string>;
  onRestart: () => void;
}) {
  const score = scoreMcRun(paper, answers);
  const passed = score.points >= EXAM_PASS_POINTS;
  const pct = score.maxPoints ? Math.round((score.points / score.maxPoints) * 100) : 0;

  return (
    <div>
      <div className="card mb-4 p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-dim)]">
              <Trophy size={13} className="text-[var(--color-accent)]" /> Section result
            </p>
            <p className="text-4xl font-semibold tracking-tight text-[var(--color-text-h)]">
              {score.points}
              <span className="text-xl text-[var(--color-text-dim)]"> / {score.maxPoints} P</span>
            </p>
          </div>
          <span
            className={`badge ${passed ? 'badge-easy' : 'badge-hard'} text-[12px]`}
          >
            {passed ? 'Above pass mark' : `Below ${EXAM_PASS_POINTS} P pass mark`}
          </span>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-[var(--radius-pill)] bg-[var(--color-bg)]">
          <div
            className={`h-full rounded-[var(--radius-pill)] ${passed ? 'bg-[var(--color-good)]' : 'bg-[var(--color-warn)]'}`}
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-[var(--color-text-dim)]">
          <span>
            <span className="font-semibold text-[var(--color-text)]">{score.correct}</span> of{' '}
            {score.total} questions fully correct
          </span>
          {score.halfRight > 0 && (
            <span className="text-[var(--color-warn)]">
              {score.halfRight} × half-right on a 2-of-4 — {score.halfRight * 2} points lost to
              all-or-nothing
            </span>
          )}
        </div>

        <button className="btn btn-primary mt-5" onClick={onRestart}>
          <Play size={14} /> New section
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {paper.map((q, i) => (
          <McCard
            key={q.id}
            question={q}
            topicTitle={topicTitle.get(q.topicId)}
            selected={answers[q.id] ?? []}
            revealed
            grade={gradeMc(q, answers[q.id])}
            label={`Q${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
