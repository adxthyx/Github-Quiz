import Link from "next/link";
import { ArrowRight, Scissors, Maximize2, Search } from "lucide-react";
import { POOL } from "@/lib/repos";

export const metadata = {
  title: "How to play",
};

const LIFELINES = [
  {
    icon: Scissors,
    name: "50 : 50",
    desc: "Removes two of the three wrong choices, leaving the answer and one decoy.",
  },
  {
    icon: Maximize2,
    name: "Extend",
    desc: "Swaps the snippet for a window five times longer — more context, more tells to spot.",
  },
  {
    icon: Search,
    name: "Snitch",
    desc: "Reveals the source file's path and language, with the repo's own name barred out.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-12">
      <h1 className="text-[32px] font-semibold tracking-tight">How to play</h1>
      <p className="mt-3 text-[15px] leading-relaxed text-text-2">
        Every round pulls a real source file from a well-known open-source
        repository, picks a random slice of it, and bars out the obvious
        give-aways — the project&apos;s name and a few signature terms. Your job
        is to name the repo it came from, four choices, six rounds.
      </p>

      <h2 className="mt-10 text-[18px] font-semibold">Scoring</h2>
      <p className="mt-2 text-[15px] leading-relaxed text-text-2">
        One point per correct first guess. There&apos;s no timer — read
        carefully. Your running score sits above the snippet, and a full recap
        with the answers waits at the end.
      </p>

      <h2 className="mt-10 text-[18px] font-semibold">Lifelines</h2>
      <p className="mt-2 text-[15px] leading-relaxed text-text-2">
        You get one of each, once per game. Spend them on the rounds that
        stump you.
      </p>
      <div className="mt-4 space-y-2">
        {LIFELINES.map((l) => (
          <div
            key={l.name}
            className="flex items-start gap-3 rounded-md border border-hairline bg-surface px-4 py-3"
          >
            <l.icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.75} />
            <div>
              <p className="text-[14px] font-medium">{l.name}</p>
              <p className="text-[13px] leading-relaxed text-text-2">{l.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-[18px] font-semibold">
        The repo pool ({POOL.length})
      </h2>
      <p className="mt-2 text-[15px] leading-relaxed text-text-2">
        Snippets are drawn live from these projects:
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {POOL.map((repo) => (
          <a
            key={repo.id}
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            className="rounded-sm border border-hairline bg-surface px-2.5 py-1 font-mono text-[13px] text-text-2 outline-none transition-colors duration-[var(--t-fast)] hover:text-text focus-visible:ring-2 focus-visible:ring-brand"
          >
            {repo.fullName}
          </a>
        ))}
      </div>

      <div className="mt-12">
        <Link
          href="/play"
          className="inline-flex items-center gap-2 rounded-md border border-brand/60 bg-brand/10 px-5 py-2.5 text-[14px] font-medium text-text outline-none transition-all duration-[var(--t-base)] ease-[var(--ease-standard)] hover:shadow-[var(--shadow-hover-brand)] focus-visible:ring-2 focus-visible:ring-brand active:translate-y-px"
        >
          Start playing
          <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
        </Link>
      </div>
    </div>
  );
}
