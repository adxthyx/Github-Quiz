"use client";

import { Flame } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

/** Flame indicator: pulses once on increment, greys out on a wrong answer. */
export function Streak({ streak }: { streak: number }) {
  const reduce = useReducedMotion();
  const active = streak > 0;

  return (
    <div className="flex items-center gap-2 text-[13px] font-medium">
      <motion.span
        key={streak}
        initial={reduce || streak === 0 ? false : { scale: 0.7 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="inline-flex"
      >
        <Flame
          size={16}
          strokeWidth={1.75}
          className={active ? "text-brand" : "text-text-muted"}
          style={active ? { filter: "drop-shadow(0 0 6px var(--glow-brand))" } : undefined}
        />
      </motion.span>
      <span className={active ? "text-text" : "text-text-muted"}>
        {streak} streak
      </span>
    </div>
  );
}
