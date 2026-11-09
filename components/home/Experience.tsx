import { education, experience } from "@/lib/site";
import { LogoTile } from "../LogoTile";
import { Reveal } from "../Reveal";
import { SectionHeading } from "./SectionHeading";

export function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24 sm:px-8 sm:py-28">
      <SectionHeading eyebrow="Experience">Where I&apos;ve worked</SectionHeading>

      <ol className="mt-16 border-t border-line">
        {experience.map((e, i) => (
          <Reveal as="li" key={e.org} delay={i * 90} className="group border-b border-line">
            <div className="grid gap-4 py-9 transition-colors duration-500 md:grid-cols-[11rem_1fr_9rem] md:gap-10 md:py-11">
              <p className="order-2 font-mono text-sm text-faint md:order-1 md:pt-2">{e.dates}</p>
              <div className="order-1 flex gap-4 md:order-2">
                <span className="flex shrink-0 -space-x-2 pt-1">
                  {e.logos.map((l) => (
                    <LogoTile key={l.src} src={l.src} alt={l.alt} size={44} fill={82} className="ring-2 ring-bg" />
                  ))}
                </span>
                <div className="min-w-0">
                  <h3 className="text-xl font-medium tracking-tight sm:text-2xl">
                    {e.role}
                    <span className="text-muted"> · {e.org}</span>
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {e.points.map((pt) => (
                      <li key={pt} className="relative pl-5 leading-relaxed text-muted">
                        <span className="absolute left-0 top-[0.7em] h-px w-2.5 bg-accent-hi/70 transition-all duration-500 group-hover:w-3.5" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="order-3 text-sm text-faint md:pt-2 md:text-right">{e.place}</p>
            </div>
          </Reveal>
        ))}
      </ol>

      <Reveal className="card mt-10 flex flex-col gap-6 p-7 sm:p-9 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-5">
          <LogoTile src={education.logo.src} alt={education.logo.alt} size={56} fill={80} className="hidden sm:grid" />
          <div>
            <p className="eyebrow">Education</p>
            <h3 className="mt-3 text-xl font-medium tracking-tight sm:text-2xl">{education.school}</h3>
            <p className="mt-2 text-muted">
              {education.degree} · {education.minor}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-faint">{education.coursework}</p>
          </div>
        </div>
        <p className="shrink-0 font-mono text-sm text-muted md:text-right">{education.dates}</p>
      </Reveal>
    </section>
  );
}
