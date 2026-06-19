/** A run of these block glyphs marks redacted text; styled as a bar on the client. */
const BLOCK = "█";

/**
 * Replace every (case-insensitive) occurrence of each tell with a same-length
 * run of block glyphs, so the snippet keeps its shape but the giveaway brand
 * names are barred out. Tells are matched as substrings on purpose — we want
 * "react" hidden inside "ReactHooks" too. Longest tells first so a longer tell
 * isn't half-eaten by a shorter overlapping one.
 */
export function redact(source: string, tells: string[]): string {
  const ordered = [...new Set(tells.filter(Boolean))].sort(
    (a, b) => b.length - a.length,
  );
  let out = source;
  for (const tell of ordered) {
    const re = new RegExp(escapeRegExp(tell), "gi");
    out = out.replace(re, (m) => BLOCK.repeat(m.length));
  }
  return out;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
