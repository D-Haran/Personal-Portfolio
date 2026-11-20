import Link from "next/link";
import { projects } from "@/lib/site";
import { ArrowRight } from "../Icons";
import { Reveal } from "../Reveal";
import { Spotlight } from "../Spotlight";
import { ProjectVisual } from "../visuals";
import { SectionHeading } from "./SectionHeading";

export function Work() {
  return (
    <section id="work" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-10 sm:px-8 sm:py-14">
      <SectionHeading
        eyebrow="Selected work"
        sub="An inference engine, a verification layer, a consumer app and a Unix shell."
      >
        Selected projects
      </SectionHeading>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={i * 80}>
            <Link href={`/work/${p.slug}`} className="group block h-full" aria-label={`${p.title} case study`}>
              <Spotlight className="card flex h-full flex-col p-2.5 transition-all duration-500 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:-translate-y-1 group-hover:border-line-strong group-hover:shadow-[0_24px_48px_-28px_rgb(0_0_0/0.9)]">
                <div className="relative z-10 overflow-hidden rounded-[1rem]">
                  <ProjectVisual
                    slug={p.slug}
                    className="aspect-[4/3] transition-transform duration-700 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.03]"
                  />
                </div>

                <div className="relative z-10 flex flex-1 flex-col px-2 pb-1.5 pt-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-medium tracking-tight">{p.title}</h3>
                    <span className="font-mono text-[10px] tracking-[0.18em] text-accent-hi">{p.index}</span>
                  </div>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-faint">{p.kicker}</p>

                  <p className="mt-3 text-[13px] leading-relaxed text-muted">{p.blurb}</p>

                  <div className="mt-auto pt-4">
                    <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 font-mono text-[11px] text-ok">
                      {p.metrics.map((m, j) => (
                        <span key={m.label}>
                          {j > 0 && <span className="mr-2 text-faint">·</span>}
                          {m.value}
                          <span className="ml-1 text-faint">{m.label}</span>
                        </span>
                      ))}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-accent-hi">
                      Case study
                      <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
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
