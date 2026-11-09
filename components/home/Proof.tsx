import { CountUp } from "../CountUp";
import { Reveal } from "../Reveal";

const stats = [
  { node: <CountUp to={300} suffix="+" />, label: "students using Campify" },
  { node: <CountUp to={3} />, label: "platforms shipped — iOS, Android, web" },
  { node: <CountUp to={70} suffix="+" />, label: "AI patches evaluated at Mercor" },
  { node: <CountUp to={3} suffix="×" />, label: "hackathon winner" },
];

export function Proof() {
  return (
    <section aria-label="Highlights" className="relative">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="grid grid-cols-2 border-y border-line md:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`px-2 py-8 sm:px-6 sm:py-10 ${i % 2 === 1 ? "border-l border-line" : ""} ${i >= 2 ? "border-t border-line md:border-t-0" : ""} ${i === 2 ? "md:border-l" : ""}`}
            >
              <p className="font-mono text-3xl tracking-tight text-fg sm:text-4xl">{s.node}</p>
              <p className="mt-2 text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
