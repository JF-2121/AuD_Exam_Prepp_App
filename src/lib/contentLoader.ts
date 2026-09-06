import { parseFrontmatter } from './frontmatter';
import type { ExamTemplate, Flashcard, MultipleChoiceQuestion, Question, Topic } from './types';

const topicFiles = import.meta.glob('/content/topics/*.md', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;
const flashcardFiles = import.meta.glob('/content/flashcards/*.json', { eager: true, import: 'default' }) as Record<string, Flashcard[]>;
const questionFiles = import.meta.glob('/content/questions/*.json', { eager: true, import: 'default' }) as Record<string, Question[]>;
const mcFiles = import.meta.glob('/content/mc/*.json', { eager: true, import: 'default' }) as Record<string, MultipleChoiceQuestion[]>;
const examTemplateModule = import.meta.glob('/content/examTemplates.json', { eager: true, import: 'default' }) as Record<string, ExamTemplate[]>;

/**
 * Content is baked in at build time by the eager globs above, so every loader's result is
 * immutable for the life of the page. Caching it keeps each loader referentially stable, which
 * matters because components memoize on these arrays — a fresh array per call would silently
 * invalidate those memos (re-shuffling a question pool, resetting a cursor) on any re-render.
 */
function once<T>(compute: () => T): () => T {
  let cached: { value: T } | null = null;
  return () => (cached ??= { value: compute() }).value;
}

function idFromPath(path: string): string {
  const file = path.split('/').pop() ?? path;
  return file.replace(/\.(md|json)$/, '');
}

export const loadTopics = once((): Topic[] => {
  const topics = Object.entries(topicFiles).map(([path, raw]) => {
    const { data, content } = parseFrontmatter(raw);
    const id = (data.id as string) ?? idFromPath(path);
    return {
      id,
      title: data.title as string,
      category: data.category as string,
      order: (data.order as number) ?? 0,
      relatedAlgorithmIds: (data.relatedAlgorithmIds as string[]) ?? [],
      sourceFiles: data.sourceFiles as string[] | undefined,
      body: content.trim(),
    } satisfies Topic;
  });
  return topics.sort((a, b) => a.order - b.order);
});

export const loadFlashcards = once((): Flashcard[] => Object.values(flashcardFiles).flat());

/**
 * The multiple-choice compendium. Kept in its own `content/mc/` folder rather than mixed into
 * `content/questions/` because the MC section is ~42% of the real exam and gets its own tab —
 * but it is still merged into `loadQuestions()` so Practice and Mock Exam draw from it too.
 */
export const loadMcQuestions = once((): MultipleChoiceQuestion[] => Object.values(mcFiles).flat());

export const loadQuestions = once((): Question[] => [
  ...Object.values(questionFiles).flat(),
  ...loadMcQuestions(),
]);

export const loadExamTemplates = once((): ExamTemplate[] => Object.values(examTemplateModule).flat());
