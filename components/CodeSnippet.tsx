interface CodeSnippetProps {
  /** Pre-highlighted, pre-redacted Shiki HTML. */
  html: string;
}

/**
 * Renders trusted, server-generated Shiki HTML. The markup comes only from
 * `lib/highlight.ts` (our own highlighter over redacted source), never from
 * user input, so `dangerouslySetInnerHTML` is safe here.
 */
export function CodeSnippet({ html }: CodeSnippetProps) {
  return (
    <div
      className="code-shiki overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
