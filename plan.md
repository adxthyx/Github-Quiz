# GitHub Code-Match Quiz

Show a redacted, syntax-highlighted code snippet; the player picks which of four
famous open-source repos it came from (2×2 choice cards); the reveal links the real
repo on GitHub and shows the file path.

## Stack
- Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · TypeScript
- [Motion](https://motion.dev) (animation/gestures/layout) · [Shiki](https://shiki.style)
  (highlighting) · [canvas-confetti](https://github.com/catdad/canvas-confetti) ·
  [lucide-react](https://lucide.dev) · Geist / Geist Mono via `next/font`
- No Three.js, no UI kits (see design contract).

## Data pipeline — fresh per page load
Not static (no committed question file) and not live (no realtime/polling). On **every**
page open the server builds a new set:

```
app/page.tsx (force-dynamic)  →  lib/build-questions.ts  →  GitHub contents API (no-store)
  async Server Component            server-only             Authorization: Bearer GITHUB_TOKEN
                                       │
        random subset of lib/repos.ts pool → random file per repo → redact → Shiki → shuffle
                                       ↓
                              Question[]  →  <Quiz> (client)
```

- Random repo subset + random file window ⇒ **questions change every visit**.
- `fetch(..., { cache: 'no-store' })` + `export const dynamic = 'force-dynamic'` defeat caching.
- `GITHUB_TOKEN` (in `.env`) is read server-side only; it never reaches the client — only the
  redacted question payload is serialized.
- Resilient: a failed GitHub fetch drops that repo and backfills from the pool, so one hiccup
  never blanks the quiz. `app/loading.tsx` shows a skeleton while the set builds.

## Data model — `lib/types.ts`
`Repo { fullName, description, url }` · `Choice = Repo & { correct }` ·
`Question { id, lang, filePath, snippetHtml, choices[4], answer }`.

## File map
- `app/globals.css` — design tokens, Tailwind v4 `@theme`, shadows/glass, radial-mesh + grain
  background, blob-drift, reduced-motion killswitch, Shiki theme hooks.
- `app/layout.tsx` — Geist fonts, dark `<html>`, metadata.
- `app/page.tsx` / `app/loading.tsx` — dynamic quiz page + skeleton.
- `lib/repos.ts` — curated repo pool (+ candidate file paths).
- `lib/build-questions.ts` — server-only builder (fetch → redact → Shiki → shuffle).
- `components/` — `Quiz`, `TopBar`, `ScoreChip`, `Streak`, `CodePanel`, `ChoiceCard`
  (pointer-tracked CSS-3D tilt), `ChoiceGrid`, `RevealPanel` (slide/flip + magnetic Next),
  `Skeleton`.

## Run
```bash
# .env must contain GITHUB_TOKEN=ghp_xxx  (gitignored, never commit)
npm install
npm run dev          # open http://localhost:3000
npm run build        # / is ƒ Dynamic (rebuilt per request)
npm run lint
```

Reload the page twice — the snippet set should change each time, and `GITHUB_TOKEN` should
never appear in the client bundle or network payload.

## Design contract
The visual system is fixed: dark-only, exact color tokens, bento layout, CSS-3D (no WebGL),
Motion timing tokens, honor `prefers-reduced-motion`, Lucide only, no emoji/gradients. See
`AGENTS.md` for the enforced guardrails.
