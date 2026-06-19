import "server-only";

import { POOL, type RepoSeed } from "@/lib/repos";
import { redact } from "@/lib/redact";
import { highlightToHtml } from "@/lib/highlight";
import type { Question, RepoMeta } from "@/lib/types";

const SHORT_LINES = 14;
const EXTEND_FACTOR = 5; // "Extend" lifeline shows 5x more lines
const SKIP_HEADER = 8; // skip a typical license/header block when possible

/**
 * Build a fresh set of quiz questions on every call. Reads source files from
 * GitHub with `cache: "no-store"`, redacts each repo's tells, highlights with
 * Shiki, and attaches shuffled multiple-choice options. Resilient: any repo
 * whose fetch/parse fails is skipped, so a flaky source never breaks the page.
 */
export async function buildQuestions(count: number): Promise<Question[]> {
  const questions: Question[] = [];
  for (const seed of shuffle(POOL)) {
    if (questions.length >= count) break;
    const q = await buildOne(seed);
    if (q) questions.push(q);
  }
  return questions;
}

async function buildOne(seed: RepoSeed): Promise<Question | null> {
  for (const path of shuffle(seed.paths)) {
    try {
      const raw = await fetchSource(seed, path);
      const lines = normalize(raw);
      if (lines.length < 4) continue;

      const short = pickWindow(lines, SHORT_LINES);
      const ext = expandWindow(lines, short, SHORT_LINES * EXTEND_FACTOR);

      const [highlightedHtml, highlightedHtmlExtended] = await Promise.all([
        highlightToHtml(redact(short.text, seed.tells), seed.lang),
        highlightToHtml(redact(ext.text, seed.tells), seed.lang),
      ]);

      return {
        id: `${seed.id}#${short.start}`,
        lang: seed.lang,
        highlightedHtml,
        highlightedHtmlExtended,
        lineRange: [short.start + 1, short.start + short.count],
        pathHint: redact(path, seed.tells),
        correctId: seed.id,
        choices: buildChoices(seed),
      };
    } catch {
      // try the next candidate path; if none work, the repo is skipped
    }
  }
  return null;
}

async function fetchSource(seed: RepoSeed, path: string): Promise<string> {
  const token = process.env.GITHUB_TOKEN;

  // Primary: authenticated GitHub contents API (raw media type, never cached).
  if (token) {
    const res = await fetch(
      `https://api.github.com/repos/${seed.fullName}/contents/${path}?ref=${seed.branch}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.raw+json",
          "User-Agent": "code-match-quiz",
        },
        cache: "no-store",
      },
    );
    if (res.ok) return res.text();
    // fall through to the CDN on auth/rate-limit errors
  }

  // Fallback: raw CDN (works without a token; still uncached).
  const res = await fetch(
    `https://raw.githubusercontent.com/${seed.fullName}/${seed.branch}/${path}`,
    { cache: "no-store" },
  );
  if (!res.ok) throw new Error(`fetch ${seed.fullName}/${path} -> ${res.status}`);
  return res.text();
}

interface Window {
  start: number; // 0-based index into lines
  count: number;
  text: string;
}

/** Pick a short window, preferring to skip a leading license/header block. */
function pickWindow(lines: string[], size: number): Window {
  const count = Math.min(size, lines.length);
  const maxStart = Math.max(0, lines.length - count);
  const minStart = Math.min(SKIP_HEADER, maxStart);
  const start = minStart + Math.floor(Math.random() * (maxStart - minStart + 1));
  return { start, count, text: lines.slice(start, start + count).join("\n") };
}

/** Grow a window to `size` lines, centered on the short one and clamped to file. */
function expandWindow(lines: string[], short: Window, size: number): Window {
  const count = Math.min(size, lines.length);
  const pad = Math.floor((count - short.count) / 2);
  const start = clamp(short.start - pad, 0, Math.max(0, lines.length - count));
  return { start, count, text: lines.slice(start, start + count).join("\n") };
}

function buildChoices(correct: RepoSeed): RepoMeta[] {
  const distractors = shuffle(POOL.filter((r) => r.id !== correct.id))
    .slice(0, 3)
    .map(toMeta);
  return shuffle([toMeta(correct), ...distractors]);
}

function toMeta(r: RepoSeed): RepoMeta {
  return { id: r.id, fullName: r.fullName, description: r.description, url: r.url };
}

function normalize(raw: string): string[] {
  const lines = raw.replace(/\t/g, "  ").split("\n");
  while (lines.length > 0 && lines[lines.length - 1].trim() === "") lines.pop();
  return lines;
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
