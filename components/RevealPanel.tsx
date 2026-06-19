"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";
import { ArrowRight, Check, X, ExternalLink } from "lucide-react";
import type { Repo } from "@/lib/types";

const SPRING = { stiffness: 300, damping: 30 } as const;

export function RevealPanel({
  correct,
  answer,
  filePath,
  isLast,
  onNext,
}: {
  correct: boolean;
  answer: Repo;
  filePath: string;
  isLast: boolean;
  onNext: () => void;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, rotateX: -12 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
      style={{ transformPerspective: 1000 }}
      className="glass mt-4 rounded-[20px] p-5"
    >
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${
            correct ? "bg-success/15 text-success" : "bg-danger/15 text-danger"
          }`}
        >
          {correct ? <Check size={15} strokeWidth={2.25} /> : <X size={15} strokeWidth={2.25} />}
        </span>
        <span
          className={`text-[15px] font-medium ${correct ? "text-success" : "text-danger"}`}
        >
          {correct ? "Correct" : "Not quite"}
        </span>
      </div>

      <div className="mt-3 text-[13px] text-text-2">
        From{" "}
        <a
          href={answer.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-medium text-accent underline-offset-2 hover:underline"
        >
          {answer.fullName}
          <ExternalLink size={13} strokeWidth={1.75} />
        </a>
      </div>
      <div className="mt-1 font-mono text-[13px] text-text-muted">{filePath}</div>

      <div className="mt-4 flex justify-end">
        <MagneticButton onClick={onNext} reduce={!!reduce}>
          {isLast ? "See results" : "Next"}
          <ArrowRight size={16} strokeWidth={2} />
        </MagneticButton>
      </div>
    </motion.div>
  );
}

function MagneticButton({
  children,
  onClick,
  reduce,
}: {
  children: React.ReactNode;
  onClick: () => void;
  reduce: boolean;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useSpring(useMotionValue(0), SPRING);
  const y = useSpring(useMotionValue(0), SPRING);

  function handleMove(e: React.PointerEvent) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set(((e.clientX - (r.left + r.width / 2)) / r.width) * 8);
    y.set(((e.clientY - (r.top + r.height / 2)) / r.height) * 8);
  }
  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onClick}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={{ x, y }}
      whileTap={{ scale: 0.97 }}
      className="inline-flex items-center gap-2 rounded-[14px] bg-brand px-5 py-2.5 text-[15px] font-medium text-white outline-none transition-colors hover:bg-brand-hi focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
    >
      {children}
    </motion.button>
  );
}
