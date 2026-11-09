"use client";

import { useEffect, useRef } from "react";
import { BrandLogo } from "./BrandLogo";

/**
 * Loading splash: the logo draws itself in, then the overlay fades to reveal
 * the site. Driven through refs (no re-renders); skipped under reduced motion
 * (CSS hides it). It plays on a full load; client-side navigation keeps the
 * layout so it does not replay.
 */
export function Intro() {
  const overlay = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = overlay.current;
    if (!el) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(
      setTimeout(() => el.setAttribute("data-phase", "done"), 1500),
    );
    timers.push(
      setTimeout(() => {
        el.style.display = "none";
      }, 2000),
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div ref={overlay} className="intro" data-phase="draw" aria-hidden>
      <div className="intro-bg" />
      <BrandLogo id="intro" draw cutColor="var(--color-bg)" className="intro-logo text-fg" />
    </div>
  );
}
