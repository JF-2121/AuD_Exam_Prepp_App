import type { ExamTemplate, Question } from '../../lib/types';

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function assembleExam(template: ExamTemplate, allQuestions: Question[]): Question[] {
  const picked: Question[] = [];
  const usedIds = new Set<string>();

  for (const section of template.sections) {
    let pool = allQuestions.filter((q) => section.topicIds.includes(q.topicId) && !usedIds.has(q.id));
    if (section.difficulty) pool = pool.filter((q) => q.difficulty === section.difficulty);
    if (section.types) pool = pool.filter((q) => section.types!.includes(q.type));
    const chosen = shuffle(pool).slice(0, section.count);
    chosen.forEach((q) => usedIds.add(q.id));
    picked.push(...chosen);
  }

  return picked;
}
