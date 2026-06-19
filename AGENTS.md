<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# GitHub Code-Match Quiz

Guess which famous OSS repo a redacted code snippet came from. See `plan.md` for the
architecture and file map.

## Data pipeline — fresh per page load
Questions are **not static** (no committed file) and **not live** (no realtime/polling). On every
page open, `app/page.tsx` (`export const dynamic = "force-dynamic"`) awaits
`lib/build-questions.ts`, which fetches source files from the **GitHub API** with
`cache: "no-store"`, redacts identifiers, runs **Shiki**, and shuffles. Random repo subset +
random file window ⇒ the set changes every visit.

- `GITHUB_TOKEN` lives in `.env` (gitignored — never commit it). It is read **server-side only**
  (`build-questions.ts` is `server-only`); the token must never reach the client. Only the redacted
  question payload is serialized to the browser.
- The builder is resilient: a failed fetch drops that repo and backfills from `lib/repos.ts`.
- Add repos by editing the `POOL` in `lib/repos.ts` (full name, description, url, candidate paths).

## Design contract (anti-slop — hard rules)
- **Dark theme only.** No light mode.
- **Use the tokens in `app/globals.css` verbatim.** Never hardcode hex; no new colors, gradients,
  or fonts. One accent per screen.
- **Fonts:** Geist / Geist Mono via `next/font` only. No Inter.
- **Icons:** Lucide only, single stroke width, sparingly. **No emoji.**
- **Motion:** use the timing/easing tokens (fast 120 / base 220 / slow 380 / entrance 500;
  springs stiffness~300 damping~30). No arbitrary durations, no bounce-by-default.
- **Honor `prefers-reduced-motion`:** kill tilt/drift/confetti/shake; keep opacity/position fades.
- **3D is CSS transforms, not WebGL.** The default build ships **zero** Three.js.
- Every interactive element needs hover, focus-visible, active, and disabled states.

## Commands
`npm run dev` · `npm run build` (`/` is ƒ Dynamic) · `npm run lint`.
