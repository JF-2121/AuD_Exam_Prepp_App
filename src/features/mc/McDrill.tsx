import { useEffect, useMemo, useState } from 'react';
import { RotateCcw, Target } from 'lucide-react';
import { recordQuizAttempt } from '../../lib/db';
import { mcFormat } from '../../lib/types';
import type { Difficulty, McFormat, MultipleChoiceQuestion, Topic } from '../../lib/types';
import { McCard } from './McCard';
import { EXAM_INSTRUCTIONS, filterMc, gradeMc, shuffle, type McGrade } from './mcBank';

/**
 * Untimed practice over the whole bank, one question at a time with immediate feedback.
 * Defaults to the 2-of-4 filter, because that format is 36 of the section's 42 points.
 */
export function McDrill({
  questions,
  topics,
}: {
  questions: MultipleChoiceQuestion[];
  topics: Topic[];
}) {
  const [topicId, setTopicId] = useState('');
  const [format, setFormat] = useState<McFormat | ''>('double');
  const [difficulty, setDifficulty] = useState<Difficulty | ''>('');

  const pool = useMemo(
    () =>
      shuffle(
        filterMc(questions, {
          topicId: topicId || undefined,
          format: format || undefined,
          difficulty: difficulty || undefined,
        }),
      ),
    [questions, topicId, format, difficulty],
  );

  const [cursor, setCursor] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [grade, setGrade] = useState<McGrade | null>(null);
  const [tally, setTally] = useState({ points: 0, maxPoints: 0, correct: 0, answered: 0 });

  // A filter change rebuilds the pool, so the cursor and any in-flight answer must reset with it.
  useEffect(() => {
    setCursor(0);
    setSelected([]);
    setGrade(null);
  }, [pool]);

  const question = pool[cursor];
  const topicTitle = useMemo(() => new Map(topics.map((t) => [t.id, t.title])), [topics]);

  function toggle(i: number) {
    if (grade) return;
    const required = question.correctIndexes.length;
    setSelected((prev) => {
      if (required === 1) return [i];
      if (prev.includes(i)) return prev.filter((x) => x !== i);
      if (prev.length >= required) return prev;
      return [...prev, i];
    });
  }

  async function submit() {
    if (!question) return;
    const result = gradeMc(question, selected);
    setGrade(result);
    setTally((t) => ({
      points: t.points + result.awarded,
      maxPoints: t.maxPoints + result.possible,
      correct: t.correct + (result.correct ? 1 : 0),
      answered: t.answered + 1,
    }));
    await recordQuizAttempt({
      questionId: question.id,
      topicId: question.topicId,
      correct: result.correct,
      timestamp: new Date().toISOString(),
    });
  }

  function next() {
    setGrade(null);
    setSelected([]);
    setCursor((c) => c + 1);
  }

  const activeFormat: McFormat | null = question ? mcFormat(question) : format || null;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <FormatToggle value={format} onChange={setFormat} />
        <select className="input ml-auto" value={topicId} onChange={(e) => setTopicId(e.target.value)}>
          <option value="">All topics</option>
          {topics.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>
        <select
          className="input"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as Difficulty | '')}
        >
          <option value="">Any difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {activeFormat && (
        <p className="mb-4 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs leading-relaxed text-[var(--color-text-dim)]">
          {EXAM_INSTRUCTIONS[activeFormat].en}
        </p>
      )}

      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--color-text-dim)]">
        <span>
          Session:{' '}
          <span className="font-semibold text-[var(--color-text)]">
            {tally.points}/{tally.maxPoints} points
          </span>
        </span>
        <span>
          {tally.correct}/{tally.answered} questions
        </span>
        <span className="ml-auto">
          {pool.length ? `${Math.min(cursor + 1, pool.length)} of ${pool.length} in this filter` : ''}
        </span>
      </div>

      {!question ? (
        <div className="card p-8 text-center">
          <Target size={22} className="mx-auto mb-2 text-[var(--color-accent)]" />
          <p className="text-[var(--color-text-dim)]">
            {pool.length === 0
              ? 'No questions match this filter.'
              : "That's every question in this filter — reshuffle to go again."}
          </p>
          <button className="btn btn-primary mx-auto mt-4" onClick={() => setCursor(0)}>
            <RotateCcw size={14} /> Restart this filter
          </button>
        </div>
      ) : (
        <McCard
          question={question}
          topicTitle={topicTitle.get(question.topicId)}
          selected={selected}
          onToggle={toggle}
          revealed={!!grade}
          grade={grade ?? undefined}
          actions={
            grade ? (
              <button className="btn btn-primary" onClick={next}>
                Next question
              </button>
            ) : (
              <button
                className="btn btn-primary"
                disabled={selected.length !== question.correctIndexes.length}
                onClick={submit}
              >
                Submit answer
              </button>
            )
          }
        />
      )}
    </div>
  );
}

function FormatToggle({
  value,
  onChange,
}: {
  value: McFormat | '';
  onChange: (v: McFormat | '') => void;
}) {
  const options: { value: McFormat | ''; label: string }[] = [
    { value: 'double', label: '2 of 4' },
    { value: 'single', label: '1 of 4' },
    { value: '', label: 'Both' },
  ];
  return (
    <div className="flex gap-1 rounded-[var(--radius-pill)] border border-[var(--color-border)] bg-[var(--color-surface)] p-1">
      {options.map((o) => (
        <button
          key={o.label}
          onClick={() => onChange(o.value)}
          className={`min-h-9 rounded-[var(--radius-pill)] px-3 text-xs font-semibold transition-colors ${
            value === o.value
              ? 'bg-[var(--color-accent-fill)] text-[var(--color-on-accent-fill)]'
              : 'text-[var(--color-text-dim)] hover:text-white'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
