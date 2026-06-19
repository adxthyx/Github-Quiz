"use client";

/** The visual hero: faux window header + Shiki-highlighted, redacted snippet. */
export function CodePanel({
  snippetHtml,
  lang,
}: {
  snippetHtml: string;
  lang: string;
}) {
  return (
    <div
      className="overflow-hidden rounded-[20px] border border-hairline bg-code-bg"
      style={{ boxShadow: "var(--shadow-rest)" }}
    >
      {/* Faux window header — 3 dots + redacted filename */}
      <div className="flex items-center gap-3 border-b border-hairline bg-surface-2 px-4 py-3">
        <div className="flex gap-2">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="ml-2 font-mono text-[13px] text-text-muted">
          █████████.{extOf(lang)}
        </span>
      </div>

      {/* Body — capped height with a bottom fade mask to --code-bg */}
      <div className="relative">
        <div
          className="code-shiki max-h-[60vh] overflow-auto p-6"
          dangerouslySetInnerHTML={{ __html: snippetHtml }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
          style={{
            background:
              "linear-gradient(to bottom, transparent, var(--code-bg))",
          }}
        />
      </div>
    </div>
  );
}

function extOf(lang: string): string {
  const map: Record<string, string> = {
    javascript: "js",
    typescript: "ts",
    python: "py",
    rust: "rs",
    ruby: "rb",
    go: "go",
    php: "php",
    c: "c",
  };
  return map[lang] ?? "txt";
}
