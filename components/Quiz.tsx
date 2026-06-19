"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Flag } from "lucide-react";
import type { Question } from "@/lib/types";
import { QuestionCard } from "@/components/QuestionCard";
import { Lifelines, type LifelineState } from "@/components/Lifelines";
import { ResultsRecap } from "@/components/ResultsRecap";
import { Confetti } from "@/components/Confetti";

const NO_LIFELINES_USED: LifelineState = {
  fiftyFifty: false,
  extend: false,
  snitch: false,
};

export function Quiz({ questions }: { questions: Question[] }) {
  const reduced = useReducedMotion();

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>(
    Array(questions.length).fill(null),
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [done, setDone] = useState(false);

  // Lifelines are once-per-game; effects below apply only to the current question.
  const [used, setUsed] = useState<LifelineState>(NO_LIFELINES_USED);
  const [extended, setExtended] = useState(false);
  const [snitchRevealed, setSnitchRevealed] = useState(false);
  const [hiddenChoiceIds, setHiddenChoiceIds] = useState<string[]>([]);
  const [celebrate, setCelebrate] = useState(false);

  const current = questions[index];
  const total = questions.length;
  const score = answers.reduce(
    (n, a, i) => (a === questions[i].correctId ? n + 1 : n),
    0,
  );
  const isLast = index === total - 1;

  function pick(id: string) {
    if (answered) return;
    setSelectedId(id);
    setAnswered(true);
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = id;
      return next;
    });
    if (id === current.correctId) setCelebrate(true);
  }

  function advance() {
    setCelebrate(false);
    if (isLast) {
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelectedId(null);
    setAnswered(false);
    setExtended(false);
    setSnitchRevealed(false);
    setHiddenChoiceIds([]);
  }

  function useFiftyFifty() {
    if (used.fiftyFifty || answered) return;
    const wrong = current.choices
      .filter((c) => c.id !== current.correctId)
      .map((c) => c.id);
    for (let i = wrong.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [wrong[i], wrong[j]] = [wrong[j], wrong[i]];
    }
    setHiddenChoiceIds(wrong.slice(0, 2));
    setUsed((u) => ({ ...u, fiftyFifty: true }));
  }

  function useExtend() {
    if (used.extend || answered) return;
    setExtended(true);
    setUsed((u) => ({ ...u, extend: true }));
  }

  function useSnitch() {
    if (used.snitch || answered) return;
    setSnitchRevealed(true);
    setUsed((u) => ({ ...u, snitch: true }));
  }

  if (done) {
    return (
      <div className="mx-auto w-full max-w-3xl px-5 py-10">
        <ResultsRecap questions={questions} answers={answers} />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-8">
      {celebrate && <Confetti />}

      {/* Progress + score */}
      <div className="mb-5">
        <div className="flex items-baseline justify-between text-[13px] text-text-2">
          <span>
            Question <span className="text-text">{index + 1}</span> of {total}
          </span>
          <span>
            Score <span className="font-semibold text-text">{score}</span>
          </span>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-2">
          <motion.div
            className="h-full rounded-full bg-brand"
            initial={false}
            animate={{ width: `${((index + (answered ? 1 : 0)) / total) * 100}%` }}
            transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
      </div>

      <div className="mb-4">
        <Lifelines
          used={used}
          locked={answered}
          onFiftyFifty={useFiftyFifty}
          onExtend={useExtend}
          onSnitch={useSnitch}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        >
          <QuestionCard
            question={current}
            extended={extended}
            hiddenChoiceIds={hiddenChoiceIds}
            snitchRevealed={snitchRevealed}
            selectedId={selectedId}
            answered={answered}
            onPick={pick}
          />
        </motion.div>
      </AnimatePresence>

      {answered && (
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={advance}
            className="flex items-center gap-2 rounded-md border border-brand/60 bg-brand/10 px-4 py-2 text-[14px] font-medium text-text outline-none transition-all duration-[var(--t-base)] ease-[var(--ease-standard)] hover:shadow-[var(--shadow-hover-brand)] focus-visible:ring-2 focus-visible:ring-brand active:translate-y-px"
          >
            {isLast ? (
              <>
                See results <Flag className="h-4 w-4" strokeWidth={1.75} />
              </>
            ) : (
              <>
                Next question <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
