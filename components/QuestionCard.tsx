"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { FileSearch, ExternalLink } from "lucide-react";
import type { Question } from "@/lib/types";
import { CodeSnippet } from "@/components/CodeSnippet";
import { ChoiceButton } from "@/components/ChoiceButton";

interface QuestionCardProps {
  question: Question;
  extended: boolean;
  hiddenChoiceIds: string[];
  snitchRevealed: boolean;
  selectedId: string | null;
  answered: boolean;
  onPick: (id: string) => void;
}

export function QuestionCard({
  question,
  extended,
  hiddenChoiceIds,
  snitchRevealed,
  selectedId,
  answered,
  onPick,
}: QuestionCardProps) {
  const reduced = useReducedMotion();
  const tiltRef = useRef<HTMLDivElement>(null);

  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduced) return;
    const el = tiltRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1400px) rotateX(${(-py * 3).toFixed(2)}deg) rotateY(${(px * 3).toFixed(2)}deg)`;
  }
  function handleLeave() {
    const el = tiltRef.current;
    if (el) el.style.transform = "";
  }

  const correct = question.choices.find((c) => c.id === question.correctId)!;

  return (
    <div className="space-y-5">
      {/* Snippet panel with subtle 3D tilt */}
      <div
        ref={tiltRef}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        className="shadow-rest overflow-hidden rounded-lg border border-hairline bg-code-bg transition-transform duration-[var(--t-base)] ease-[var(--ease-standard)] will-change-transform"
      >
        <div className="flex items-center justify-between gap-3 border-b border-hairline/70 px-4 py-2.5">
          <div className="flex items-center gap-2 text-[12px] text-text-muted">
            <span className="rounded-sm bg-surface-2 px-2 py-0.5 font-mono uppercase tracking-wide text-text-2">
              {question.lang}
            </span>
            <span className="hidden sm:inline">
              lines {question.lineRange[0]}–{question.lineRange[1]}
            </span>
          </div>
          {snitchRevealed && (
            <span className="flex items-center gap-1.5 rounded-sm border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-[12px] text-accent">
              <FileSearch className="h-3.5 w-3.5" strokeWidth={1.75} />
              {question.pathHint}
            </span>
          )}
        </div>
        <div className="px-4 py-3">
          <CodeSnippet
            html={extended ? question.highlightedHtmlExtended : question.highlightedHtml}
          />
        </div>
      </div>

      {/* Prompt */}
      <p className="text-[15px] text-text-2">
        Which repository is this snippet from?
      </p>

      {/* Choices */}
      <div className="grid gap-2.5 sm:grid-cols-2">
        {question.choices.map((choice, i) => (
          <ChoiceButton
            key={choice.id}
            choice={choice}
            index={i}
            answered={answered}
            isSelected={selectedId === choice.id}
            isCorrect={choice.id === question.correctId}
            isEliminated={hiddenChoiceIds.includes(choice.id)}
            onPick={() => onPick(choice.id)}
          />
        ))}
      </div>

      {/* Reveal */}
      {answered && (
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          className="glass rounded-lg p-4"
        >
          <p className="text-[14px] font-semibold">
            {selectedId === question.correctId ? (
              <span className="text-success">Correct!</span>
            ) : (
              <span className="text-danger">Not quite.</span>
            )}{" "}
            <span className="text-text-2">
              This is from{" "}
              <span className="font-mono text-text">{correct.fullName}</span>.
            </span>
          </p>
          <p className="mt-1.5 text-[14px] text-text-2">{correct.description}</p>
          <a
            href={correct.url}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 rounded-sm text-[13px] text-accent outline-none transition-colors duration-[var(--t-fast)] hover:text-text focus-visible:ring-2 focus-visible:ring-brand"
          >
            <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.75} />
            View repository
          </a>
        </motion.div>
      )}
    </div>
  );
}
