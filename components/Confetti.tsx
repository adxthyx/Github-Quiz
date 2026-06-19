"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

/** Fires a one-shot confetti burst on mount. No-op under reduced motion. */
export function Confetti() {
  useEffect(() => {
    confetti({
      particleCount: 90,
      spread: 72,
      startVelocity: 38,
      origin: { y: 0.35 },
      colors: ["#ff4500", "#ff5c1a", "#16c784", "#8b8bff", "#ededef"],
      disableForReducedMotion: true,
    });
  }, []);
  return null;
}
