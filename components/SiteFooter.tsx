import { GitFork } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-hairline/60">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-5 py-6 text-[13px] text-text-muted sm:flex-row">
        <p>
          Snippets pulled live from public repositories, redacted for the guess.
        </p>
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 rounded-sm outline-none transition-colors duration-[var(--t-fast)] hover:text-text-2 focus-visible:ring-2 focus-visible:ring-brand"
        >
          <GitFork className="h-3.5 w-3.5" strokeWidth={1.75} />
          Open source on GitHub
        </a>
      </div>
    </footer>
  );
}
