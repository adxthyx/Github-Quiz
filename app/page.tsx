import Link from "next/link";
import { ArrowRight, Scissors, Maximize2, Search, Shuffle } from "lucide-react";

const STEPS = [
  {
    icon: Shuffle,
    title: "Read the snippet",
    body: "A real file is pulled live from a famous open-source repo — with the dead-giveaway names barred out.",
  },
  {
    icon: Search,
    title: "Make your guess",
    body: "Pick the repository it came from out of four. Instant reveal, running score, six rounds.",
  },
  {
    icon: Scissors,
    title: "Spend your lifelines",
    body: "Stuck? Each game gives you a 50:50, an Extend, and a Snitch — use them wisely.",
  },
];

const LIFELINES = [
  { icon: Scissors, name: "50 : 50", desc: "Drops two wrong answers." },
  { icon: Maximize2, name: "Extend", desc: "Reveals 5× more code." },
  { icon: Search, name: "Snitch", desc: "Leaks the file path." },
];

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-5xl px-5">
      {/* Hero */}
      <section className="flex flex-col items-center pt-20 pb-16 text-center sm:pt-28">
        <span className="rounded-full border border-hairline bg-surface px-3 py-1 text-[12px] uppercase tracking-wider text-text-2">
          Fresh snippets every game
        </span>
        <h1 className="mt-5 max-w-2xl text-[40px] font-semibold leading-[1.1] tracking-tight sm:text-[56px]">
          Guess the repo from a{" "}
          <span className="text-brand">redacted</span> code snippet.
        </h1>
        <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-text-2">
          We bar out the obvious tells and pull a real file from a famous
          open-source project. Can you still name it?
        </p>
        <Link
          href="/play"
          className="group mt-8 inline-flex items-center gap-2 rounded-md border border-brand/60 bg-brand/10 px-6 py-3 text-[15px] font-medium text-text outline-none transition-all duration-[var(--t-base)] ease-[var(--ease-standard)] hover:shadow-[var(--shadow-hover-brand)] focus-visible:ring-2 focus-visible:ring-brand active:translate-y-px"
        >
          Start playing
          <ArrowRight
            className="h-4 w-4 transition-transform duration-[var(--t-base)] group-hover:translate-x-0.5"
            strokeWidth={1.75}
          />
        </Link>
      </section>

      {/* Sample snippet teaser */}
      <section className="mx-auto max-w-xl pb-20">
        <div className="shadow-rest overflow-hidden rounded-lg border border-hairline bg-code-bg">
          <div className="flex items-center gap-2 border-b border-hairline/70 px-4 py-2.5 text-[12px] text-text-muted">
            <span className="rounded-sm bg-surface-2 px-2 py-0.5 font-mono uppercase tracking-wide text-text-2">
              python
            </span>
            <span>lines 41–46</span>
          </div>
          <pre className="overflow-x-auto px-4 py-3 font-mono text-[13.5px] leading-relaxed text-text-2">
            <code>{`def get_response(self, request):
    # Resolve and call the view, then apply
    response = self._middleware_chain(request)
    response._resource_closers.append(request.close)
    if response.status_code >= 400:
        log_response("%s", response.reason_phrase)`}</code>
          </pre>
        </div>
        <p className="mt-3 text-center text-[13px] text-text-muted">
          …so, which framework is that? Find out in the game.
        </p>
      </section>

      {/* How it works */}
      <section className="border-t border-hairline/60 py-16">
        <h2 className="text-center text-[24px] font-semibold tracking-tight">
          How it works
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.title}
              className="shadow-rest rounded-lg border border-hairline bg-surface p-5"
            >
              <step.icon className="h-5 w-5 text-brand" strokeWidth={1.75} />
              <h3 className="mt-3 text-[15px] font-semibold">{step.title}</h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-text-2">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Lifelines */}
      <section className="border-t border-hairline/60 py-16">
        <h2 className="text-center text-[24px] font-semibold tracking-tight">
          Three lifelines per game
        </h2>
        <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-2 sm:flex-row">
          {LIFELINES.map((l) => (
            <div
              key={l.name}
              className="flex flex-1 items-center gap-3 rounded-md border border-hairline bg-surface px-4 py-3"
            >
              <l.icon className="h-4 w-4 text-accent" strokeWidth={1.75} />
              <div>
                <p className="text-[14px] font-medium">{l.name}</p>
                <p className="text-[13px] text-text-muted">{l.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/play"
            className="inline-flex items-center gap-2 rounded-md border border-hairline bg-surface px-5 py-2.5 text-[14px] font-medium text-text outline-none transition-all duration-[var(--t-base)] ease-[var(--ease-standard)] hover:border-brand/60 focus-visible:ring-2 focus-visible:ring-brand active:translate-y-px"
          >
            Play now
            <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
          </Link>
        </div>
      </section>
    </div>
  );
}
