"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { RotateCcw } from "lucide-react";
import type { Question } from "@/lib/types";
import { TopBar } from "./TopBar";
import { CodePanel } from "./CodePanel";
import { ChoiceGrid } from "./ChoiceGrid";
import { RevealPanel } from "./RevealPanel";

export function Quiz({ questions }: { questions: Question[] }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [done, setDone] = useState(false);

  const total = questions.length;
  const q = questions[index];
  const answered = selected !== null;
  const isCorrect =
    answered && q.choices.find((c) => c.fullName === selected)?.correct === true;

  function handleSelect(fullName: string) {
    if (answered) return;
    setSelected(fullName);
    const correct = q.choices.find((c) => c.fullName === fullName)?.correct;
    if (correct) {
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
  }

  function handleNext() {
    if (index + 1 >= total) {
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  }

  function restart() {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setStreak(0);
    setDone(false);
  }

  const stagger = (i: number) =>
    reduce
      ? { duration: 0.2 }
      : { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const, delay: i * 0.06 };

  return (
    <div className="flex min-h-full flex-col">
      <TopBar current={index} total={total} streak={streak} score={score} />

      <main className="mx-auto w-full max-w-[1200px] flex-1 px-6 py-8">
        {done ? (
          <Results score={score} total={total} onRestart={restart} />
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={`code-${q.id}`}
                initial={{ opacity: 0, y: reduce ? 0 : 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={stagger(0)}
                className="lg:col-span-7"
              >
                <CodePanel snippetHtml={q.snippetHtml} lang={q.lang} />
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={`choices-${q.id}`}
                initial={{ opacity: 0, y: reduce ? 0 : 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={stagger(1)}
                className="lg:col-span-5"
              >
                <ChoiceGrid
                  choices={q.choices}
                  answered={answered}
                  selected={selected}
                  onSelect={handleSelect}
                />
                {answered && (
                  <RevealPanel
                    correct={!!isCorrect}
                    answer={q.answer}
                    filePath={q.filePath}
                    isLast={index + 1 >= total}
                    onNext={handleNext}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}

function Results({
  score,
  total,
  onRestart,
}: {
  score: number;
  total: number;
  onRestart: () => void;
}) {
  return (
    <div className="mx-auto mt-16 max-w-md text-center">
      <div className="text-[13px] font-medium uppercase tracking-wide text-text-muted">
        Quiz complete
      </div>
      <div className="mt-2 text-[40px] font-semibold tracking-[-0.02em] text-text">
        {score} / {total}
      </div>
      <p className="mt-2 text-[15px] text-text-2">
        {score === total
          ? "Flawless. You know your open source."
          : "Reload for a fresh set of snippets."}
      </p>
      <button
        type="button"
        onClick={onRestart}
        className="mt-6 inline-flex items-center gap-2 rounded-[14px] bg-brand px-5 py-2.5 text-[15px] font-medium text-white outline-none transition-colors hover:bg-brand-hi focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      >
        <RotateCcw size={16} strokeWidth={2} />
        Play again
      </button>
    </div>
  );
}
