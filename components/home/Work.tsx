import Link from "next/link";
import { projects } from "@/lib/site";
import { ArrowRight } from "../Icons";
import { Reveal } from "../Reveal";
import { Spotlight } from "../Spotlight";
import { ProjectVisual } from "../visuals";
import { SectionHeading } from "./SectionHeading";

export function Work() {
  return (
    <section id="work" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24 sm:px-8 sm:py-28">
      <SectionHeading
        eyebrow="Selected work"
        sub="An inference engine, a code-analysis tool and a consumer app. Each one has a write-up with the architecture, the numbers and what I'd change."
      >
        Selected projects
      </SectionHeading>

      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={i * 120} className={i === 2 ? "md:col-span-2 lg:col-span-1" : ""}>
            <Link href={`/work/${p.slug}`} className="group block h-full" aria-label={`${p.title} case study`}>
              <Spotlight className="card flex h-full flex-col p-3 transition-all duration-500 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:-translate-y-1.5 group-hover:border-line-strong group-hover:shadow-[0_30px_60px_-30px_rgb(0_0_0/0.9)] sm:p-4">
                <div className="relative z-10 overflow-hidden rounded-[1.25rem]">
                  <ProjectVisual
                    slug={p.slug}
                    className="aspect-[4/3] transition-transform duration-700 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.03]"
                  />
                </div>
                <div className="relative z-10 flex flex-1 flex-col px-3 pb-3 pt-6 sm:px-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs tracking-[0.2em] text-accent-hi">{p.index}</span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">{p.kicker}</span>
                  </div>
                  <h3 className="mt-4 text-2xl font-medium tracking-tight sm:text-[1.7rem]">{p.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted">{p.summary}</p>

                  <dl className="mt-6 grid grid-cols-2 gap-3">
                    {p.metrics.map((m) => (
                      <div key={m.label} className="rounded-2xl border border-line bg-white/[0.02] px-3.5 py-3">
                        <dt className="sr-only">{m.label}</dt>
                        <dd className="font-mono text-lg tracking-tight text-ok">{m.value}</dd>
                        <dd className="mt-0.5 text-xs leading-snug text-faint">{m.label}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-6">
                    <ul className="flex flex-wrap gap-1.5">
                      {p.stack.map((s) => (
                        <li key={s} className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-muted">
                          {s}
                        </li>
                      ))}
                    </ul>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-hi">
                      Case study
                      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Spotlight>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
