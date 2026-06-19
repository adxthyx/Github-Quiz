"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import confetti from "canvas-confetti";
import type { Choice } from "@/lib/types";

export type CardStatus =
  | "idle"
  | "selected"
  | "correct"
  | "wrong"
  | "reveal-correct"
  | "dimmed";

const SPRING = { stiffness: 300, damping: 30 } as const;

export function ChoiceCard({
  choice,
  status,
  disabled,
  onSelect,
}: {
  choice: Choice;
  status: CardStatus;
  disabled: boolean;
  onSelect: () => void;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);

  // Pointer-tracked tilt (±8°), spring-smoothed.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateY = useSpring(useTransform(px, [0, 1], [-8, 8]), SPRING);
  const rotateX = useSpring(useTransform(py, [0, 1], [8, -8]), SPRING);

  const tiltActive = !disabled && !reduce;

  function handleMove(e: React.PointerEvent) {
    if (!tiltActive || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  }
  function handleLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  // Confetti burst from the card center when revealed correct.
  useEffect(() => {
    if (status !== "correct" || reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    confetti({
      particleCount: 80,
      spread: 60,
      startVelocity: 38,
      ticks: 140,
      origin: {
        x: (r.left + r.width / 2) / window.innerWidth,
        y: (r.top + r.height / 2) / window.innerHeight,
      },
      colors: ["#ff4500", "#ff5c1a", "#16c784", "#8b8bff"],
      disableForReducedMotion: true,
    });
  }, [status, reduce]);

  const s = STYLES[status];

  return (
    <div style={{ perspective: 1000 }}>
      <motion.button
        ref={ref}
        type="button"
        disabled={disabled}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        onClick={onSelect}
        aria-label={`Choose ${choice.fullName}`}
        style={{
          rotateX: tiltActive ? rotateX : 0,
          rotateY: tiltActive ? rotateY : 0,
          transformStyle: "preserve-3d",
          boxShadow: s.shadow,
          opacity: s.opacity,
        }}
        animate={
          status === "wrong" && !reduce
            ? { x: [0, -8, 8, -6, 4, 0], scale: s.scale }
            : { scale: s.scale, x: 0 }
        }
        transition={
          status === "wrong" && !reduce
            ? { duration: 0.35, ease: [0.4, 0, 0.2, 1] }
            : { type: "spring", ...SPRING }
        }
        whileHover={disabled ? undefined : { y: -2 }}
        className={`group relative block w-full rounded-[20px] border bg-surface p-5 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${s.border}`}
      >
        <div style={{ transform: "translateZ(24px)" }}>
          <div className="font-mono text-[13px] text-text-2">
            {choice.fullName.split("/")[0]}/
          </div>
          <div className="text-[15px] font-medium text-text">
            {choice.fullName.split("/")[1]}
          </div>
          <div className="mt-2 text-[13px] leading-[1.5] text-text-muted">
            {choice.description}
          </div>
        </div>
      </motion.button>
    </div>
  );
}

const STYLES: Record<
  CardStatus,
  { border: string; shadow: string; scale: number; opacity: number }
> = {
  idle: {
    border: "border-hairline group-hover:border-hairline",
    shadow: "var(--shadow-rest)",
    scale: 1,
    opacity: 1,
  },
  selected: {
    border: "border-accent",
    shadow: "var(--shadow-hover-brand)",
    scale: 1.02,
    opacity: 1,
  },
  correct: {
    border: "border-success",
    shadow: "var(--shadow-hover-success)",
    scale: 1.02,
    opacity: 1,
  },
  wrong: {
    border: "border-danger",
    shadow: "var(--shadow-hover-danger)",
    scale: 1,
    opacity: 1,
  },
  "reveal-correct": {
    border: "border-success",
    shadow: "var(--shadow-hover-success)",
    scale: 1,
    opacity: 1,
  },
  dimmed: {
    border: "border-hairline",
    shadow: "var(--shadow-rest)",
    scale: 0.98,
    opacity: 0.6,
  },
};
