"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "motion/react";

/** Fully-rounded score chip with an animated count-up on change. */
export function ScoreChip({ score }: { score: number }) {
  const reduce = useReducedMotion();
  const [animated, setAnimated] = useState(score);
  const prev = useRef(score);

  useEffect(() => {
    if (reduce) return;
    const controls = animate(prev.current, score, {
      duration: 0.7,
      ease: [0.4, 0, 0.2, 1],
      onUpdate: (v) => setAnimated(Math.round(v)),
    });
    prev.current = score;
    return () => controls.stop();
  }, [score, reduce]);

  const display = reduce ? score : animated;

  return (
    <div
      className="flex items-center gap-2 rounded-full bg-surface-2 px-4 py-2 text-[13px] font-medium text-text"
      style={{ boxShadow: "var(--shadow-rest)" }}
    >
      <span className="text-text-muted">Score</span>
      <span className="tabular-nums text-text">{display}</span>
    </div>
  );
}
