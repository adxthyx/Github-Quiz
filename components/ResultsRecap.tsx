import { Trophy, Check, X, RotateCcw } from "lucide-react";
import type { Question } from "@/lib/types";

interface ResultsRecapProps {
  questions: Question[];
  /** selectedId per question, aligned to `questions` order. */
  answers: (string | null)[];
}

function verdict(score: number, total: number): string {
  const pct = score / total;
  if (pct === 1) return "Flawless. You read code for breakfast.";
  if (pct >= 0.7) return "Sharp eye — that's a strong run.";
  if (pct >= 0.4) return "Not bad. The redactions earned their keep.";
  return "Brutal set. The bars did their job.";
}

export function ResultsRecap({ questions, answers }: ResultsRecapProps) {
  const score = questions.reduce(
    (n, q, i) => (answers[i] === q.correctId ? n + 1 : n),
    0,
  );
  const total = questions.length;

  return (
    <div className="space-y-6">
      <div className="shadow-rest rounded-xl border border-hairline bg-surface p-6 text-center">
        <Trophy
          className="mx-auto h-8 w-8 text-brand"
          strokeWidth={1.5}
        />
        <h1 className="mt-3 text-[28px] font-semibold tracking-tight">
          {score} / {total}
        </h1>
        <p className="mt-1 text-[15px] text-text-2">{verdict(score, total)}</p>
        <a
          href="/play"
          className="mt-5 inline-flex items-center gap-2 rounded-md border border-brand/60 bg-brand/10 px-4 py-2 text-[14px] font-medium text-text outline-none transition-all duration-[var(--t-base)] ease-[var(--ease-standard)] hover:shadow-[var(--shadow-hover-brand)] focus-visible:ring-2 focus-visible:ring-brand active:translate-y-px"
        >
          <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
          Play again
        </a>
      </div>

      <ol className="space-y-2">
        {questions.map((q, i) => {
          const picked = answers[i];
          const right = picked === q.correctId;
          const correct = q.choices.find((c) => c.id === q.correctId)!;
          const pickedMeta = q.choices.find((c) => c.id === picked);
          return (
            <li
              key={q.id}
              className="flex items-start gap-3 rounded-md border border-hairline bg-surface px-4 py-3"
            >
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-sm ${
                  right ? "text-success" : "text-danger"
                }`}
              >
                {right ? (
                  <Check className="h-4 w-4" strokeWidth={2.25} />
                ) : (
                  <X className="h-4 w-4" strokeWidth={2.25} />
                )}
              </span>
              <div className="min-w-0 text-[13px]">
                <p className="font-mono text-text">{correct.fullName}</p>
                {!right && (
                  <p className="mt-0.5 text-text-muted">
                    you guessed{" "}
                    <span className="font-mono">
                      {pickedMeta ? pickedMeta.fullName : "— skipped"}
                    </span>
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
