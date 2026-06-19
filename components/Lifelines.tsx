import { Scissors, Maximize2, Search, Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface LifelineState {
  fiftyFifty: boolean;
  extend: boolean;
  snitch: boolean;
}

interface LifelinesProps {
  used: LifelineState;
  /** When the question is answered, lifelines are no longer actionable. */
  locked: boolean;
  onFiftyFifty: () => void;
  onExtend: () => void;
  onSnitch: () => void;
}

export function Lifelines({
  used,
  locked,
  onFiftyFifty,
  onExtend,
  onSnitch,
}: LifelinesProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-[12px] uppercase tracking-wider text-text-muted">
        Lifelines
      </span>
      <Lifeline
        icon={Scissors}
        label="50 : 50"
        hint="Remove two wrong answers"
        used={used.fiftyFifty}
        locked={locked}
        onClick={onFiftyFifty}
      />
      <Lifeline
        icon={Maximize2}
        label="Extend"
        hint="Show 5× more code"
        used={used.extend}
        locked={locked}
        onClick={onExtend}
      />
      <Lifeline
        icon={Search}
        label="Snitch"
        hint="Reveal the file path"
        used={used.snitch}
        locked={locked}
        onClick={onSnitch}
      />
    </div>
  );
}

function Lifeline({
  icon: Icon,
  label,
  hint,
  used,
  locked,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  hint: string;
  used: boolean;
  locked: boolean;
  onClick: () => void;
}) {
  const disabled = used || locked;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={used ? `${label} — used` : hint}
      className={`flex items-center gap-1.5 rounded-sm border px-2.5 py-1.5 text-[13px] outline-none transition-all duration-[var(--t-fast)] ease-[var(--ease-standard)] focus-visible:ring-2 focus-visible:ring-brand ${
        used
          ? "border-hairline/50 bg-surface/40 text-text-muted opacity-50"
          : locked
            ? "border-hairline/50 bg-surface/40 text-text-muted opacity-40"
            : "border-hairline bg-surface text-text-2 hover:border-accent/60 hover:text-text active:translate-y-px"
      }`}
    >
      {used ? (
        <Check className="h-3.5 w-3.5 text-success" strokeWidth={2} />
      ) : (
        <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
      )}
      {label}
    </button>
  );
}
