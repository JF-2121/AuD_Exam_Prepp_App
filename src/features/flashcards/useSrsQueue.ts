import { useCallback, useEffect, useState } from 'react';
import { getAllSrsState, putSrsState, recordReviewLog } from '../../lib/db';
import { isDue, nextSrsState, type Grade } from '../../lib/srs';
import type { Flashcard, SrsState } from '../../lib/types';

export function useSrsQueue(allCards: Flashcard[], topicId?: string) {
  const [srsStates, setSrsStates] = useState<Record<string, SrsState>>({});
  const [loaded, setLoaded] = useState(false);

  const reload = useCallback(async () => {
    const states = await getAllSrsState();
    setSrsStates(Object.fromEntries(states.map((s) => [s.flashcardId, s])));
    setLoaded(true);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const scoped = topicId ? allCards.filter((c) => c.topicId === topicId) : allCards;
  const dueCards = loaded ? scoped.filter((c) => isDue(srsStates[c.id])) : [];

  const grade = useCallback(
    async (flashcardId: string, g: Grade) => {
      const next = nextSrsState(srsStates[flashcardId], flashcardId, g);
      await putSrsState(next);
      await recordReviewLog(flashcardId);
      setSrsStates((prev) => ({ ...prev, [flashcardId]: next }));
    },
    [srsStates],
  );

  return { dueCards, srsStates, loaded, grade };
}
