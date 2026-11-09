import type { ReactNode } from "react";
import { Reveal } from "../Reveal";

export function SectionHeading({ eyebrow, children, sub }: { eyebrow: string; children: ReactNode; sub?: ReactNode }) {
  return (
    <Reveal className="max-w-4xl">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-5 text-[clamp(2.1rem,5vw,3.6rem)] font-medium leading-[1.04] tracking-[-0.035em]">{children}</h2>
      {sub && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{sub}</p>}
    </Reveal>
  );
}
