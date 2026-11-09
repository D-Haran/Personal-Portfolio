import type { ReactNode } from "react";
import { Reveal } from "../Reveal";

export type FlowStep = { title: string; detail?: ReactNode; tone?: "default" | "accent" | "ok" };

/**
 * A numbered pipeline: a 3×2 grid on wide screens, and a vertical list
 * joined by animated connectors on phones.
 */
export function Flow({ steps, loopLabel }: { steps: FlowStep[]; loopLabel?: string }) {
  return (
    <Reveal className="relative">
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((s, i) => (
          <li key={s.title} className="relative flex">
            <div
              className={`relative z-10 w-full rounded-2xl border p-4 transition-colors duration-300 ${
                s.tone === "accent"
                  ? "border-accent/40 bg-accent/10"
                  : s.tone === "ok"
                    ? "border-ok/30 bg-ok/[0.07]"
                    : "border-line bg-white/[0.025]"
              }`}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <p className="font-mono text-[10px] tracking-[0.2em] text-faint">{String(i + 1).padStart(2, "0")}</p>
              <p className="mt-2 font-medium leading-snug text-fg">{s.title}</p>
              {s.detail && <p className="mt-1.5 text-[13px] leading-snug text-muted">{s.detail}</p>}
            </div>
            {i < steps.length - 1 && (
              <svg aria-hidden className="absolute left-6 top-full z-0 h-3 w-px overflow-visible sm:hidden">
                <line x1="0" y1="0" x2="0" y2="12" className="flow" stroke="var(--color-accent-hi)" strokeWidth="1.5" />
              </svg>
            )}
          </li>
        ))}
      </ol>
      {loopLabel && (
        <div className="mt-4 flex items-center gap-3 text-sm text-faint">
          <svg viewBox="0 0 24 24" className="size-4 text-accent-hi" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
            <path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {loopLabel}
        </div>
      )}
    </Reveal>
  );
}
