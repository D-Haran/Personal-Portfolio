import { CountUp } from "../CountUp";
import { Reveal } from "../Reveal";

const stats = [
  { node: <CountUp to={300} suffix="+" />, label: "students using Campify" },
  { node: <CountUp to={3} />, label: "platforms shipped — iOS, Android, web" },
  { node: <CountUp to={70} suffix="+" />, label: "AI patches evaluated at Mercor" },
  { node: <CountUp to={3} suffix="×" />, label: "hackathon winner" },
];

const stack = [
  "C++20", "Rust", "Metal", "Python", "TypeScript", "Tree-sitter", "Flutter",
  "React", "Next.js", "Node.js", "Firebase", "PostgreSQL", "Docker", "CMake", "AWS",
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

      <div className="marquee mt-14 overflow-hidden" aria-hidden>
        <div className="marquee-track flex w-max gap-10 font-mono text-sm tracking-[0.2em] text-faint">
          {[...stack, ...stack].map((s, i) => (
            <span key={i} className="flex items-center gap-10 uppercase">
              {s}
              <span className="size-1 rounded-full bg-white/20" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
