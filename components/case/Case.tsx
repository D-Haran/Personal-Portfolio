import Link from "next/link";
import type { ReactNode } from "react";
import { projects, type Project } from "@/lib/site";
import { ArrowRight, ArrowUpRight } from "../Icons";
import { Reveal } from "../Reveal";
import { ProjectVisual } from "../visuals";

export function CaseHero({ project, visual }: { project: Project; visual?: ReactNode }) {
  return (
    <header className="mx-auto max-w-6xl px-5 pt-32 sm:px-8 sm:pt-40">
      <Link
        href="/#work"
        className="rise group inline-flex items-center gap-2 text-sm text-muted hover:text-fg"
        style={{ ["--d" as string]: "0ms" }}
      >
        <ArrowRight className="size-4 rotate-180 transition-transform group-hover:-translate-x-1" />
        All work
      </Link>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-end">
        <div>
          <p className="eyebrow rise" style={{ ["--d" as string]: "60ms" }}>
            <span className="text-accent-hi">{project.index}</span> · {project.kicker}
          </p>
          <h1
            className="rise mt-5 text-[clamp(3rem,9vw,6.5rem)] font-medium leading-[0.95] tracking-[-0.05em]"
            style={{ ["--d" as string]: "120ms" }}
          >
            {project.title}
          </h1>
          <p className="rise mt-7 max-w-xl text-lg leading-relaxed text-muted sm:text-xl" style={{ ["--d" as string]: "220ms" }}>
            {project.summary}
          </p>
          <div className="rise mt-8 flex flex-wrap gap-2.5" style={{ ["--d" as string]: "320ms" }}>
            {project.links.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className={`group inline-flex items-center gap-1.5 rounded-full px-5 py-3 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 ${
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
        </div>

        <div className="rise" style={{ ["--d" as string]: "200ms" }}>
          <div className="card p-3">
            {visual ?? <ProjectVisual slug={project.slug} className="aspect-[4/3] rounded-[1.25rem]" />}
          </div>
        </div>
      </div>

      <div className="rise mt-12 flex flex-wrap gap-2 border-t border-line pt-6" style={{ ["--d" as string]: "400ms" }}>
        <span className="mr-2 font-mono text-xs uppercase tracking-[0.2em] text-faint leading-7">Stack</span>
        {project.stack.map((s) => (
          <span key={s} className="rounded-full border border-line px-3 py-1 font-mono text-xs text-muted">
            {s}
          </span>
        ))}
      </div>
    </header>
  );
}

export function Metrics({ items }: { items: { value: ReactNode; label: string; note?: string }[] }) {
  return (
    <Reveal className="mx-auto mt-16 max-w-6xl px-5 sm:px-8">
      <dl
        className={`grid grid-cols-2 gap-px overflow-hidden rounded-[1.75rem] border border-line bg-line ${
          items.length === 3 ? "md:grid-cols-3" : "md:grid-cols-4"
        }`}
      >
        {items.map((m) => (
          <div key={m.label} className="bg-surface px-5 py-7 sm:px-7">
            <dt className="sr-only">{m.label}</dt>
            <dd className="font-mono text-2xl tracking-tight text-fg sm:text-3xl">{m.value}</dd>
            <dd className="mt-2 text-sm text-muted">{m.label}</dd>
            {m.note && <dd className="mt-1 text-xs text-faint">{m.note}</dd>}
          </div>
        ))}
      </dl>
    </Reveal>
  );
}

export function CaseSection({
  eyebrow,
  title,
  children,
  aside,
}: {
  eyebrow: string;
  title: ReactNode;
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-6xl px-5 pt-24 sm:px-8 sm:pt-32">
      <div className="grid gap-10 lg:grid-cols-[18rem_1fr] lg:gap-16">
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
          {aside && <div className="mt-5 text-sm leading-relaxed text-faint">{aside}</div>}
        </Reveal>
        <div className="min-w-0">
          <Reveal>
            <h2 className="text-[clamp(1.8rem,3.6vw,2.6rem)] font-medium leading-[1.1] tracking-[-0.03em]">{title}</h2>
          </Reveal>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </section>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return <Reveal className="max-w-2xl space-y-5 text-[1.075rem] leading-relaxed text-muted [&_strong]:font-medium [&_strong]:text-fg">{children}</Reveal>;
}

export function Terminal({ title = "zsh", children, className = "" }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <Reveal className={`overflow-hidden rounded-2xl border border-line bg-[#0d0d11] ${className}`}>
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="ml-3 font-mono text-xs text-faint">{title}</span>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed text-muted">{children}</pre>
    </Reveal>
  );
}

export function Limits({ items }: { items: string[] }) {
  return (
    <Reveal as="ul" className="grid gap-3 sm:grid-cols-2">
      {items.map((t) => (
        <li key={t} className="flex gap-3 rounded-2xl border border-line bg-white/[0.02] p-4 text-[0.95rem] leading-relaxed text-muted">
          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-warn/80" />
          {t}
        </li>
      ))}
    </Reveal>
  );
}

export function NextProject({ current }: { current: Project["slug"] }) {
  const i = projects.findIndex((p) => p.slug === current);
  const next = projects[(i + 1) % projects.length];
  return (
    <section className="mx-auto max-w-6xl px-5 pb-10 pt-32 sm:px-8">
      <Reveal>
        <Link href={`/work/${next.slug}`} className="group card block overflow-hidden p-3 transition-all duration-500 hover:border-line-strong">
          <div className="grid items-center gap-6 sm:grid-cols-[1fr_16rem]">
            <div className="p-5 sm:p-8">
              <p className="eyebrow">Next project</p>
              <p className="mt-4 text-4xl font-medium tracking-[-0.04em] sm:text-5xl">
                {next.title}
                <ArrowRight className="ml-3 inline size-8 align-middle text-accent-hi transition-transform duration-500 group-hover:translate-x-2" />
              </p>
              <p className="mt-3 text-muted">{next.kicker}</p>
            </div>
            <ProjectVisual
              slug={next.slug}
              className="aspect-[4/3] rounded-[1.25rem] transition-transform duration-700 group-hover:scale-[1.02]"
            />
          </div>
        </Link>
      </Reveal>
    </section>
  );
}
