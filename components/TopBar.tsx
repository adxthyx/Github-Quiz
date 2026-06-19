"use client";

import { ScoreChip } from "./ScoreChip";
import { Streak } from "./Streak";

/** Sticky glass top bar: progress (left), streak (center), score chip (right). */
export function TopBar({
  current,
  total,
  streak,
  score,
}: {
  current: number;
  total: number;
  streak: number;
  score: number;
}) {
  return (
    <header className="glass sticky top-0 z-20 w-full">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-4 px-6 py-3">
        <div className="flex items-center gap-3 text-[13px] font-medium text-text-2">
          <span className="text-text">Q {Math.min(current + 1, total)}</span>
          <span className="text-text-muted">of {total}</span>
          <div className="ml-2 hidden h-1 w-24 overflow-hidden rounded-full bg-surface-2 sm:block">
            <div
              className="h-full rounded-full bg-brand transition-[width] duration-[380ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={{ width: `${(current / total) * 100}%` }}
            />
          </div>
        </div>

        <div className="hidden sm:block">
          <Streak streak={streak} />
        </div>

        <ScoreChip score={score} />
      </div>
    </header>
  );
}
