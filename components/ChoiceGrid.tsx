"use client";

import type { Choice } from "@/lib/types";
import { ChoiceCard, type CardStatus } from "./ChoiceCard";

export function ChoiceGrid({
  choices,
  answered,
  selected,
  onSelect,
}: {
  choices: Choice[];
  answered: boolean;
  selected: string | null;
  onSelect: (fullName: string) => void;
}) {
  function statusFor(c: Choice): CardStatus {
    if (!answered) return "idle";
    if (c.correct) return selected === c.fullName ? "correct" : "reveal-correct";
    if (selected === c.fullName) return "wrong";
    return "dimmed";
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {choices.map((c) => (
        <ChoiceCard
          key={c.fullName}
          choice={c}
          status={statusFor(c)}
          disabled={answered}
          onSelect={() => onSelect(c.fullName)}
        />
      ))}
    </div>
  );
}
