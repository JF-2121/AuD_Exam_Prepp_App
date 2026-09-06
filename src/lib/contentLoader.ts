import { parseFrontmatter } from './frontmatter';
import type { Locale } from './i18n/locale';
import type { ExamTemplate, Flashcard, MultipleChoiceQuestion, Question, Topic } from './types';

const topicFiles = import.meta.glob('/content/topics/*.md', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;
const topicFilesDe = import.meta.glob('/content/topics/de/*.md', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;
const flashcardFiles = import.meta.glob('/content/flashcards/*.json', { eager: true, import: 'default' }) as Record<string, Flashcard[]>;
const flashcardFilesDe = import.meta.glob('/content/flashcards/de/*.json', { eager: true, import: 'default' }) as Record<string, Flashcard[]>;
const questionFiles = import.meta.glob('/content/questions/*.json', { eager: true, import: 'default' }) as Record<string, Question[]>;
const questionFilesDe = import.meta.glob('/content/questions/de/*.json', { eager: true, import: 'default' }) as Record<string, Question[]>;
const mcFiles = import.meta.glob('/content/mc/*.json', { eager: true, import: 'default' }) as Record<string, MultipleChoiceQuestion[]>;
const mcFilesDe = import.meta.glob('/content/mc/de/*.json', { eager: true, import: 'default' }) as Record<string, MultipleChoiceQuestion[]>;
const examTemplateModule = import.meta.glob('/content/examTemplates.json', { eager: true, import: 'default' }) as Record<string, ExamTemplate[]>;
const examTemplateModuleDe = import.meta.glob('/content/examTemplates.de.json', { eager: true, import: 'default' }) as Record<string, ExamTemplate[]>;

/**
 * Content is baked in at build time by the eager globs above, so every loader's result is
 * immutable for the life of the page. Caching it per locale keeps each loader referentially
 * stable, which matters because components memoize on these arrays — a fresh array per call would
 * silently invalidate those memos (re-shuffling a question pool, resetting a cursor) on any
 * re-render.
 */
function oncePerLocale<T>(compute: (locale: Locale) => T): (locale: Locale) => T {
  const cache = new Map<Locale, T>();
  return (locale) => {
    if (!cache.has(locale)) cache.set(locale, compute(locale));
    return cache.get(locale)!;
  };
}

/**
 * Overlays a locale's content onto the English base, **per field**. Items are matched by `id`, so
 * a translated item is the same item — SRS scheduling, quiz history and mastery all keep working
 * across a language switch. Fields the translation omits (or leaves blank) fall back to English,
 * which is what makes partial translation safe: a German file may carry only the fields that have
 * actually been translated so far.
 *
 * The corollary for multiple-choice content: a translation supplies prose only and inherits
 * `correctIndexes`, so its four options must stay in the English file's order. See content/README.
 */
function overlay<T extends { id: string }>(base: T[], translated: T[]): T[] {
  if (translated.length === 0) return base;
  const byId = new Map(translated.map((item) => [item.id, item]));
  return base.map((item) => {
    const t = byId.get(item.id);
    if (!t) return item;
    const merged = { ...item };
    for (const [key, value] of Object.entries(t)) {
      const empty =
        value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);
      if (!empty) (merged as Record<string, unknown>)[key] = value;
    }
    return merged;
  });
}

function idFromPath(path: string): string {
  const file = path.split('/').pop() ?? path;
  return file.replace(/\.(md|json)$/, '');
}

function parseTopics(files: Record<string, string>): Topic[] {
  return Object.entries(files).map(([path, raw]) => {
    const { data, content } = parseFrontmatter(raw);
    return {
      id: (data.id as string) ?? idFromPath(path),
      title: data.title as string,
      category: data.category as string,
      order: (data.order as number) ?? 0,
      relatedAlgorithmIds: (data.relatedAlgorithmIds as string[]) ?? [],
      sourceFiles: data.sourceFiles as string[] | undefined,
      body: content.trim(),
    } satisfies Topic;
  });
}

export const loadTopics = oncePerLocale((locale): Topic[] => {
  const base = parseTopics(topicFiles);
  const merged = locale === 'de' ? overlay(base, parseTopics(topicFilesDe)) : base;
  return [...merged].sort((a, b) => a.order - b.order);
});

export const loadFlashcards = oncePerLocale((locale): Flashcard[] =>
  overlay(
    Object.values(flashcardFiles).flat(),
    locale === 'de' ? Object.values(flashcardFilesDe).flat() : [],
  ),
);

/**
 * The multiple-choice compendium. Kept in its own `content/mc/` folder rather than mixed into
 * `content/questions/` because the MC section is ~42% of the real exam and gets its own tab —
 * but it is still merged into `loadQuestions()` so Practice and Mock Exam draw from it too.
 */
export const loadMcQuestions = oncePerLocale((locale): MultipleChoiceQuestion[] =>
  overlay(Object.values(mcFiles).flat(), locale === 'de' ? Object.values(mcFilesDe).flat() : []),
);

export const loadQuestions = oncePerLocale((locale): Question[] => [
  ...overlay(
    Object.values(questionFiles).flat(),
    locale === 'de' ? Object.values(questionFilesDe).flat() : [],
  ),
  ...loadMcQuestions(locale),
]);

export const loadExamTemplates = oncePerLocale((locale): ExamTemplate[] =>
  overlay(
    Object.values(examTemplateModule).flat(),
    locale === 'de' ? Object.values(examTemplateModuleDe).flat() : [],
  ),
);
