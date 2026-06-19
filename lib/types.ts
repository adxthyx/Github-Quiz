// Shared types. The `Question` payload below is the ONLY data serialized to the
// browser — it carries redacted, highlighted HTML and never the raw source or token.

/** Repo metadata that is safe to send to the client (used for answer choices). */
export interface RepoMeta {
  /** Stable slug, e.g. "facebook/react". */
  id: string;
  /** Display name, e.g. "facebook/react". */
  fullName: string;
  description: string;
  url: string;
}

/** A single quiz question, fully redacted and ready to render on the client. */
export interface Question {
  id: string;
  /** Shiki language id, e.g. "tsx", "python". */
  lang: string;
  /** Short snippet, syntax-highlighted + redacted (Shiki HTML). */
  highlightedHtml: string;
  /** 5x-larger window of the same snippet — powers the "Extend" lifeline. */
  highlightedHtmlExtended: string;
  /** 1-based [start, end] line range of the short snippet within the source file. */
  lineRange: [number, number];
  /** Source file path with the repo's own tells redacted — powers the "Snitch" lifeline. */
  pathHint: string;
  /** RepoMeta.id of the correct answer. */
  correctId: string;
  /** Four choices (correct + 3 distractors), pre-shuffled. */
  choices: RepoMeta[];
}
