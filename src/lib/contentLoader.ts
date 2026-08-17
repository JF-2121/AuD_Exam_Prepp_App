import { parseFrontmatter } from './frontmatter';
import type { ExamTemplate, Flashcard, Question, Topic } from './types';

const topicFiles = import.meta.glob('/content/topics/*.md', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;
const flashcardFiles = import.meta.glob('/content/flashcards/*.json', { eager: true, import: 'default' }) as Record<string, Flashcard[]>;
const questionFiles = import.meta.glob('/content/questions/*.json', { eager: true, import: 'default' }) as Record<string, Question[]>;
const examTemplateModule = import.meta.glob('/content/examTemplates.json', { eager: true, import: 'default' }) as Record<string, ExamTemplate[]>;

function idFromPath(path: string): string {
  const file = path.split('/').pop() ?? path;
  return file.replace(/\.(md|json)$/, '');
}

export function loadTopics(): Topic[] {
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
}

export function loadFlashcards(): Flashcard[] {
  return Object.values(flashcardFiles).flat();
}

export function loadQuestions(): Question[] {
  return Object.values(questionFiles).flat();
}

export function loadExamTemplates(): ExamTemplate[] {
  return Object.values(examTemplateModule).flat();
}
