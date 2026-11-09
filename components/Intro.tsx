import { BrandLogo } from "./BrandLogo";

/**
 * Full-screen logo splash shown on first paint, then fades to reveal the site.
 * Pure CSS so it never traps clicks and degrades gracefully without JS.
 * It plays on a full page load; client-side navigation keeps the layout, so
 * it does not replay.
 */
export function Intro() {
  return (
    <div className="intro" aria-hidden>
      <BrandLogo draw strokeWidth={1.8} className="intro-logo text-fg" />
    </div>
  );
}
