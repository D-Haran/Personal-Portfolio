import Link from "next/link";
import type { ReactNode } from "react";
import { projects, type Project } from "@/lib/site";
import { ArrowRight, ArrowUpRight } from "../Icons";
import { Reveal } from "../Reveal";
import { ProjectVisual } from "../visuals";

export function CaseHero({ project }: { project: Project }) {
  return (
    <header className="mx-auto max-w-5xl px-5 pt-32 sm:px-8 sm:pt-36">
      <Link
        href="/#work"
        className="rise group inline-flex items-center gap-2 text-sm text-muted hover:text-fg"
        style={{ ["--d" as string]: "0ms" }}
      >
        <ArrowRight className="size-4 rotate-180 transition-transform group-hover:-translate-x-1" />
        All work
      </Link>

      <div className="mt-8 grid gap-8 md:grid-cols-[1.25fr_1fr] md:items-end">
        <div>
          <p className="eyebrow rise" style={{ ["--d" as string]: "60ms" }}>
            <span className="text-accent-hi">{project.index}</span> · {project.kicker}
          </p>
          <h1
            className="rise mt-4 text-[clamp(2.6rem,7vw,4.4rem)] font-medium leading-[0.98] tracking-[-0.045em]"
            style={{ ["--d" as string]: "120ms" }}
          >
            {project.title}
          </h1>
          <p className="rise mt-5 max-w-xl leading-relaxed text-muted sm:text-lg" style={{ ["--d" as string]: "220ms" }}>
            {project.summary}
          </p>
          {project.links.length > 0 && (
            <div className="rise mt-6 flex flex-wrap gap-2" style={{ ["--d" as string]: "300ms" }}>
              {project.links.map((l, i) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`group inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 ${
                    i === 0
                      ? "bg-accent text-white shadow-[0_12px_30px_-12px_rgb(53_112_230/0.9)] hover:bg-[#4580f0]"
                      : "border border-line-strong bg-white/[0.03] hover:border-white/30"
                  }`}
                >
                  {l.label}
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="rise" style={{ ["--d" as string]: "200ms" }}>
          <div className="card p-2.5">
            <ProjectVisual slug={project.slug} className="aspect-[4/3] rounded-[1.25rem]" />
          </div>
        </div>
      </div>
    </header>
  );
}

export function Metrics({ items }: { items: { value: string; label: string }[] }) {
  return (
    <Reveal className="mx-auto mt-14 max-w-5xl px-5 sm:px-8">
      <dl className="grid grid-cols-2 gap-x-6 gap-y-7 border-y border-line py-7 sm:grid-cols-4">
        {items.map((m) => (
          <div key={m.label}>
            <dt className="sr-only">{m.label}</dt>
            <dd className="font-mono text-xl tracking-tight text-fg sm:text-2xl">{m.value}</dd>
            <dd className="mt-1.5 text-[13px] leading-snug text-muted">{m.label}</dd>
          </div>
        ))}
      </dl>
    </Reveal>
  );
}

/** The body of a case study: a few plain paragraphs, nothing else. */
export function Prose({ children }: { children: ReactNode }) {
  return (
    <section className="mx-auto max-w-5xl px-5 pt-14 sm:px-8">
      <Reveal className="max-w-2xl space-y-5 leading-relaxed text-muted sm:text-[1.05rem] [&_code]:font-mono [&_code]:text-[0.9em] [&_code]:text-fg [&_strong]:font-medium [&_strong]:text-fg">
        {children}
      </Reveal>
    </section>
  );
}

export function Stack({ project }: { project: Project }) {
  return (
    <Reveal className="mx-auto mt-12 flex max-w-5xl flex-wrap gap-2 px-5 sm:px-8">
      <span className="mr-2 font-mono text-xs uppercase tracking-[0.2em] leading-7 text-faint">Built with</span>
      {project.stack.map((s) => (
        <span key={s} className="rounded-full border border-line px-3 py-1 font-mono text-xs text-muted">
          {s}
        </span>
      ))}
    </Reveal>
  );
}

export function NextProject({ current }: { current: Project["slug"] }) {
  const i = projects.findIndex((p) => p.slug === current);
  const next = projects[(i + 1) % projects.length];
  return (
    <section className="mx-auto max-w-5xl px-5 pb-10 pt-20 sm:px-8">
      <Reveal>
        <Link
          href={`/work/${next.slug}`}
          className="group flex items-center justify-between gap-6 border-t border-line pt-8 transition-colors"
        >
          <div>
            <p className="eyebrow">Next project</p>
            <p className="mt-3 text-2xl font-medium tracking-[-0.03em] sm:text-3xl">
              {next.title}
              <ArrowRight className="ml-3 inline size-6 align-middle text-accent-hi transition-transform duration-500 group-hover:translate-x-2" />
            </p>
          </div>
          <ProjectVisual
            slug={next.slug}
            className="hidden aspect-[4/3] w-32 shrink-0 rounded-xl sm:block"
          />
        </Link>
      </Reveal>
    </section>
  );
}
