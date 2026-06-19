import Link from "next/link";
import { GitCompareArrows } from "lucide-react";

const NAV = [
  { href: "/play", label: "Play" },
  { href: "/about", label: "How to play" },
];

export function SiteHeader() {
  return (
    <header className="glass sticky top-0 z-50">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
        <Link
          href="/"
          className="group flex items-center gap-2 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <GitCompareArrows
            className="h-[18px] w-[18px] text-brand transition-transform duration-[var(--t-base)] group-hover:rotate-12"
            strokeWidth={1.75}
          />
          <span className="text-[15px] font-semibold tracking-tight text-text">
            Code<span className="text-brand">Match</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-sm px-3 py-1.5 text-[14px] text-text-2 outline-none transition-colors duration-[var(--t-fast)] hover:text-text focus-visible:ring-2 focus-visible:ring-brand"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
