import { awards, stack } from "@/lib/site";
import { Likes } from "./Likes";
import { LogoTile } from "../LogoTile";
import { Reveal } from "../Reveal";
import { SectionHeading } from "./SectionHeading";

const now = [
  { k: "Building", v: "Kestrel, now that the Metal path is 10× faster" },
  { k: "Leading", v: "Technical workshops at GDG on Campus UTM" },
  { k: "Studying", v: "Applied Math & Statistics, U of T" },
];

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-10 sm:px-8 sm:py-14">
      <SectionHeading eyebrow="About">About me</SectionHeading>

      <div className="mt-10 grid items-stretch gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
        <Reveal className="space-y-5 text-lg leading-relaxed text-muted">
          <p>
            I&apos;m a third-year Applied Math &amp; Statistics student at the University of Toronto Mississauga. Most
            of my time outside of classes goes into building software and exploring how things work.
          </p>
          <p>
            Recently, I&apos;ve been working on <span className="text-fg">Kestrel</span>, a C++ LLM inference engine,
            and <span className="text-fg">Campify</span>, a campus social app with over 300 users. I enjoy working on
            projects that challenge my understanding of systems, from low-level programming to building applications
            people actually use.
          </p>
          <p>Outside of programming, I&apos;m interested in cars, music, and philosophy.</p>
          <p className="text-fg">
            I&apos;m currently looking for software engineering internships for Summer 2027.
          </p>
        </Reveal>

        {/* The cluster is absolutely positioned, so it never adds space of its
            own: these minimums are the only thing giving it a size. */}
        <Reveal delay={80} className="relative -mx-2 min-h-[15rem] sm:min-h-[17rem] lg:mx-0 lg:min-h-[21rem]">
          <Likes />
        </Reveal>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Reveal delay={60} className="card p-7">
          <p className="eyebrow">Currently</p>
          <ul className="mt-5 space-y-4">
            {now.map((n) => (
              <li key={n.k} className="grid grid-cols-[5.5rem_1fr] gap-3 text-[0.95rem]">
                <span className="pt-1 font-mono text-xs uppercase tracking-[0.16em] text-faint">{n.k}</span>
                <span className="text-fg">{n.v}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={140} className="card p-7">
          <p className="eyebrow">Hackathons</p>
          <ul className="mt-5 space-y-4">
            {awards.map((a) => (
              <li key={`${a.event}-${a.prize}`} className="text-[0.95rem]">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-fg">{a.prize}</span>
                  <span className="shrink-0 font-mono text-xs text-faint">{a.event}</span>
                </div>
                <p className="mt-1 text-sm leading-snug text-muted">{a.project}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <Reveal delay={120} className="card mt-6 p-7 sm:p-9">
        <p className="eyebrow">Tools &amp; technologies</p>
        <div className="mt-8 space-y-9">
          {stack.map((group) => (
            <div key={group.group} className="grid gap-5 sm:grid-cols-[9rem_1fr] sm:gap-7">
              <p className="pt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-faint">{group.group}</p>
              <ul className="grid grid-cols-4 gap-x-2 gap-y-6 sm:grid-cols-5 lg:grid-cols-7">
                {group.items.map((s) => (
                  <li key={s.name} className="group flex flex-col items-center gap-2.5 text-center">
                    <LogoTile
                      src={s.logo}
                      alt={s.name}
                      size={52}
                      className="transition-transform duration-300 group-hover:-translate-y-1"
                      radius="rounded-2xl"
                    />
                    <span className="text-[11px] leading-tight text-muted transition-colors duration-300 group-hover:text-fg sm:text-xs">
                      {s.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
