import { useEffect, useRef, useState } from 'react';

export function useStepPlayback(stepCount: number) {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    setIndex(0);
    setIsPlaying(false);
  }, [stepCount]);

  useEffect(() => {
    if (!isPlaying) return;
    intervalRef.current = window.setInterval(() => {
      setIndex((current) => {
        if (current >= stepCount - 1) {
          setIsPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, 900 / speed);
    return () => {
      if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
    };
  }, [isPlaying, speed, stepCount]);

  return {
    index,
    isPlaying,
    speed,
    setSpeed,
    play: () => setIsPlaying(true),
    pause: () => setIsPlaying(false),
    stepForward: () => setIndex((i) => Math.min(i + 1, stepCount - 1)),
    stepBack: () => setIndex((i) => Math.max(i - 1, 0)),
    scrubTo: (i: number) => setIndex(Math.max(0, Math.min(i, stepCount - 1))),
    reset: () => {
      setIsPlaying(false);
      setIndex(0);
    },
  };
}
