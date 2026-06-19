# GitHub Code-Match Quiz — architecture & file map

Guess which famous open-source repo a redacted code snippet came from. The site is a
Next.js 16 (App Router, Turbopack) app: a static landing page, a dynamically-rendered quiz
that pulls fresh snippets per visit, an about page, and an end-of-game recap.

## Routes (`app/`)
- `layout.tsx` — root shell. Loads Geist / Geist Mono via `next/font`, wraps every page in
  `<SiteHeader>` + `<SiteFooter>`.
- `page.tsx` — **`/` landing** (static): hero, sample redacted snippet, "How it works", the
  three lifelines, CTAs into `/play`.
- `play/page.tsx` — **`/play` quiz** (`export const dynamic = "force-dynamic"`). Awaits
  `buildQuestions(6)` and renders `<Quiz>`; shows a fallback if nothing loads.
- `play/loading.tsx` — skeleton shown while questions build (uses the `.skeleton` shimmer).
- `about/page.tsx` — **`/about`** (static): rules, scoring, lifelines, and the live repo pool.
- `globals.css` — dark-only design tokens, background mesh/grain, Shiki + `.redacted` styles,
  keyframes, and the `prefers-reduced-motion` overrides. **Source of truth for all styling.**

## Data pipeline — fresh per page load (`lib/`)
On every `/play` load (never cached), `build-questions.ts` builds a new set:
- `repos.ts` — `POOL: RepoSeed[]`. Each entry: `id`, `fullName`, `description`, `url`,
  `branch`, Shiki `lang`, candidate `paths[]`, and `tells[]` (brand terms to redact). Add a
  repo by appending an entry.
- `build-questions.ts` — `import "server-only"`. For a random subset of repos: fetch a random
  source file with `cache: "no-store"`, pick a random short window (+ a 5× window for Extend),
  redact, highlight, and attach four shuffled choices. **Resilient**: any repo whose fetch
  fails is skipped so a flaky source never breaks the page.
  - Fetch: authenticated GitHub contents API when `GITHUB_TOKEN` is set, else falls back to the
    `raw.githubusercontent.com` CDN. The token is read server-side only and never serialized.
- `redact.ts` — replaces each `tell` (case-insensitive, substring) with same-length `█` runs.
- `highlight.ts` — singleton Shiki highlighter; wraps `█` runs in `<span class="redacted">`.
- `types.ts` — `RepoMeta` and the client-facing `Question` payload (redacted HTML + metadata
  only; never raw source or the token).

## UI (`components/`)
- `Quiz.tsx` (client) — orchestrates index / score / answers / done, plus once-per-game
  lifeline state and per-question effects. Renders the progress bar, `Lifelines`,
  `QuestionCard`, and `ResultsRecap`; fires `Confetti` on a correct pick.
- `QuestionCard.tsx` — snippet panel (CSS 3D pointer tilt), choices, and the post-answer
  reveal. Honors `extended` (which HTML), `hiddenChoiceIds` (50:50), `snitchRevealed` (path).
- `CodeSnippet.tsx` — renders trusted server-generated Shiki HTML.
- `ChoiceButton.tsx` — answer option with hover/focus/active/disabled + correct/incorrect/
  eliminated states.
- `Lifelines.tsx` — 50:50 / Extend / Snitch, each single-use; `LifelineState` lives here.
- `Confetti.tsx` — one-shot burst, `disableForReducedMotion`.
- `ResultsRecap.tsx` — final score, verdict, per-question breakdown, "Play again".
- `SiteHeader.tsx` / `SiteFooter.tsx` — nav shell.

## Environment
- `GITHUB_TOKEN` — optional but recommended, in `.env` (gitignored). Raises the GitHub rate
  limit; without it the builder uses the unauthenticated raw CDN.

## Commands
`npm run dev` · `npm run build` (`/` & `/about` static, `/play` ƒ Dynamic) · `npm run lint`.
