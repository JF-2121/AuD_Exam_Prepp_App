import { useCallback, useEffect, useRef, useState } from 'react';

/** Ignore scrolls smaller than this, so a trackpad's jitter can't flap the bar. */
export const DIRECTION_THRESHOLD = 8;

export interface ScrollDecision {
  hidden: boolean;
  /** The new reference position, or null to keep the old one and let slow scrolling accumulate. */
  lastY: number | null;
}

/**
 * Pure decision step behind `useHideOnScroll`, split out so the behaviour can be exercised
 * directly: given the current offset, the last reference offset and whether the bar is already
 * hidden, decide the next state.
 */
export function decideScrollState(
  y: number,
  lastY: number,
  hidden: boolean,
  revealOffset: number,
): ScrollDecision {
  // Near the top — and during rubber-band overscroll, where y goes negative — always show.
  if (y < revealOffset) return { hidden: false, lastY: y };

  const delta = y - lastY;
  // Below the threshold, keep the old reference so slow scrolling still accumulates toward it
  // instead of being discarded frame by frame.
  if (Math.abs(delta) < DIRECTION_THRESHOLD) return { hidden, lastY: null };

  return { hidden: delta > 0, lastY: y };
}

export interface HideOnScroll {
  /** True while the bar should be translated out of view. */
  hidden: boolean;
  /** Force the bar back into view — wired to focus, so keyboard users never chase a hidden control. */
  reveal: () => void;
}

/**
 * Hides a sticky bar while the reader scrolls down and brings it straight back on the first
 * upward scroll.
 *
 * `revealOffset` keeps the bar pinned near the top of the page: hiding it during the first few
 * pixels of scroll reads as a glitch rather than as an intent to get it out of the way.
 */
export function useHideOnScroll(revealOffset = 96): HideOnScroll {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  const reveal = useCallback(() => setHidden(false), []);

  useEffect(() => {
    lastY.current = window.scrollY;
    let frame = 0;

    function measure() {
      frame = 0;
      setHidden((current) => {
        const next = decideScrollState(window.scrollY, lastY.current, current, revealOffset);
        if (next.lastY !== null) lastY.current = next.lastY;
        return next.hidden;
      });
    }

    function onScroll() {
      // Scroll fires far more often than the screen repaints; coalesce to one read per frame so
      // the handler never forces layout mid-scroll.
      if (frame === 0) frame = requestAnimationFrame(measure);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame !== 0) cancelAnimationFrame(frame);
    };
  }, [revealOffset]);

  return { hidden, reveal };
}
