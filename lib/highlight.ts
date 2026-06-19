import { getSingletonHighlighter, type Highlighter } from "shiki";

const THEME = "github-dark-default";
const LANGS = ["js", "ts", "tsx", "jsx", "python", "ruby", "go", "c"];

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter(): Promise<Highlighter> {
  highlighterPromise ??= getSingletonHighlighter({
    themes: [THEME],
    langs: LANGS,
  });
  return highlighterPromise;
}

/**
 * Syntax-highlight `code` to HTML and wrap any redaction runs (block glyphs)
 * in `<span class="redacted">` so the client can render them as bars.
 */
export async function highlightToHtml(
  code: string,
  lang: string,
): Promise<string> {
  const highlighter = await getHighlighter();
  const safeLang = LANGS.includes(lang) ? lang : "txt";
  const html = highlighter.codeToHtml(code, { lang: safeLang, theme: THEME });
  return html.replace(/█+/g, (run) => `<span class="redacted">${run}</span>`);
}
