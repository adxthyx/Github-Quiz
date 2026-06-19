import { Check, X } from "lucide-react";
import type { RepoMeta } from "@/lib/types";

interface ChoiceButtonProps {
  choice: RepoMeta;
  index: number;
  answered: boolean;
  isSelected: boolean;
  isCorrect: boolean;
  isEliminated: boolean;
  onPick: () => void;
}

const KEYS = ["A", "B", "C", "D"];

export function ChoiceButton({
  choice,
  index,
  answered,
  isSelected,
  isCorrect,
  isEliminated,
  onPick,
}: ChoiceButtonProps) {
  const disabled = answered || isEliminated;

  // Resolve the visual state in priority order.
  let tone =
    "border-hairline bg-surface text-text hover:border-brand/60 hover:shadow-[var(--shadow-hover-brand)] active:translate-y-px";
  if (isEliminated) {
    tone = "border-hairline/50 bg-surface/40 text-text-muted line-through opacity-40";
  } else if (answered && isCorrect) {
    tone = "border-success/70 bg-success/10 text-text shadow-[var(--shadow-hover-success)]";
  } else if (answered && isSelected && !isCorrect) {
    tone = "border-danger/70 bg-danger/10 text-text animate-[shake-x_var(--t-slow)_var(--ease-standard)]";
  } else if (answered) {
    tone = "border-hairline/60 bg-surface/50 text-text-2 opacity-60";
  }

  return (
    <button
      type="button"
      onClick={onPick}
      disabled={disabled}
      aria-pressed={isSelected}
      className={`group flex w-full items-center gap-3 rounded-md border px-4 py-3 text-left outline-none transition-all duration-[var(--t-base)] ease-[var(--ease-standard)] focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-default ${tone}`}
    >
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-sm border text-[12px] font-semibold ${
          answered && isCorrect
            ? "border-success/60 text-success"
            : answered && isSelected && !isCorrect
              ? "border-danger/60 text-danger"
              : "border-hairline text-text-muted group-hover:border-brand/60 group-hover:text-brand"
        }`}
      >
        {answered && isCorrect ? (
          <Check className="h-4 w-4" strokeWidth={2} />
        ) : answered && isSelected && !isCorrect ? (
          <X className="h-4 w-4" strokeWidth={2} />
        ) : (
          KEYS[index]
        )}
      </span>
      <span className="font-mono text-[14px]">{choice.fullName}</span>
    </button>
  );
}
