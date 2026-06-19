import "server-only";

import { createHighlighter, type Highlighter } from "shiki";
import { POOL, type Candidate, type PoolRepo } from "./repos";
import type { Choice, Question, Repo } from "./types";

/* ---------- Shiki: singleton highlighter + token-tuned theme ---------- */

const LANGS = [
  "javascript",
  "typescript",
  "c",
  "python",
  "rust",
  "go",
  "php",
  "ruby",
];

// TextMate theme mapped onto the contract color tokens.
const QUIZ_THEME = {
  name: "quiz-dark",
  type: "dark",
  colors: { "editor.background": "#0e1014", "editor.foreground": "#ededef" },
  settings: [
    { settings: { background: "#0e1014", foreground: "#ededef" } },
    { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: "#6b7280", fontStyle: "italic" } },
    { scope: ["string", "string.quoted", "constant.character"], settings: { foreground: "#16c784" } },
    { scope: ["keyword", "storage.type", "storage.modifier", "keyword.control"], settings: { foreground: "#ff4500" } },
    { scope: ["entity.name.function", "support.function", "meta.function-call"], settings: { foreground: "#8b8bff" } },
    { scope: ["constant.numeric", "constant.language", "keyword.other.unit"], settings: { foreground: "#ff5c1a" } },
    { scope: ["entity.name.type", "support.type", "entity.name.class", "support.class"], settings: { foreground: "#9bd0ff" } },
    { scope: ["variable", "variable.other", "meta.definition.variable"], settings: { foreground: "#ededef" } },
    { scope: ["punctuation", "meta.brace"], settings: { foreground: "#9ba1a6" } },
  ],
} as const;

let highlighterPromise: Promise<Highlighter> | null = null;
function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      themes: [QUIZ_THEME as any],
      langs: LANGS,
    });
  }
  return highlighterPromise;
}

/* ---------- helpers ---------- */

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

function toRepo(r: PoolRepo): Repo {
  return { fullName: r.fullName, description: r.description, url: r.url };
}

/** Fetch raw file contents via the GitHub contents API (default branch). */
async function fetchFile(fullName: string, path: string): Promise<string> {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.raw",
    "User-Agent": "github-code-match-quiz",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(
    `https://api.github.com/repos/${fullName}/contents/${path}`,
    { headers, cache: "no-store" },
  );
  if (!res.ok) {
    throw new Error(`GitHub ${res.status} for ${fullName}/${path}`);
  }
  return res.text();
}

/** Pick a ~40-line code window, skipping a leading license/comment header. */
function pickSnippet(source: string): string {
  const lines = source.split("\n");

  // Skip a leading comment/license block.
  let start = 0;
  while (
    start < lines.length &&
    /^\s*($|\/\/|\/\*|\*|#|<!--|;)/.test(lines[start])
  ) {
    start++;
  }

  const WINDOW = 40;
  const maxStart = Math.max(start, lines.length - WINDOW);
  // Random offset within the body for variety between loads.
  const from =
    maxStart > start
      ? start + Math.floor(Math.random() * (maxStart - start))
      : start;

  return lines
    .slice(from, from + WINDOW)
    .join("\n")
    .replace(/\s+$/, "");
}

/** Strip repo/author/package identifiers so the snippet can't be matched by name. */
function redact(code: string, repo: PoolRepo): string {
  const [owner, name] = repo.fullName.split("/");
  const tokens = new Set<string>([owner, name]);

  // Derive extra brand-ish words from the repo name (drop generic suffixes).
  name
    .replace(/[-_.]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !["core", "lang", "js", "framework"].includes(w))
    .forEach((w) => tokens.add(w));

  let out = code;
  // Remove github.com/owner/... URLs first.
  out = out.replace(
    new RegExp(`https?://[^\\s'"\`]*${owner}[^\\s'"\`]*`, "gi"),
    "https://█████",
  );
  for (const t of tokens) {
    if (!t) continue;
    out = out.replace(new RegExp(`\\b${escapeRe(t)}\\b`, "gi"), "█████");
  }
  return out;
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/* ---------- public API ---------- */

/**
 * Build `n` fresh questions on each call: random repo subset, random file per
 * repo, redacted snippet, Shiki-highlighted, shuffled choices. Resilient — a
 * failed GitHub fetch drops that repo and backfills from the remaining pool.
 */
export async function buildQuestions(n = 6): Promise<Question[]> {
  const highlighter = await getHighlighter();
  const order = shuffle(POOL);
  const questions: Question[] = [];

  for (const repo of order) {
    if (questions.length >= n) break;
    try {
      const candidate: Candidate = pick(repo.candidates);
      const source = await fetchFile(repo.fullName, candidate.path);
      const snippet = redact(pickSnippet(source), repo);
      if (snippet.replace(/\s/g, "").length < 40) continue; // too thin

      const snippetHtml = highlighter.codeToHtml(snippet, {
        lang: candidate.lang,
        theme: "quiz-dark",
      });

      const distractors = shuffle(POOL.filter((r) => r.fullName !== repo.fullName))
        .slice(0, 3)
        .map((r) => ({ ...toRepo(r), correct: false }) satisfies Choice);

      const choices = shuffle<Choice>([
        { ...toRepo(repo), correct: true },
        ...distractors,
      ]);

      questions.push({
        id: `${repo.fullName}:${candidate.path}:${questions.length}`,
        lang: candidate.lang,
        filePath: candidate.path,
        snippetHtml,
        choices,
        answer: toRepo(repo),
      });
    } catch {
      // Drop this repo; loop continues and backfills from the pool.
      continue;
    }
  }

  return questions;
}
