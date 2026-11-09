import { awards, stack } from "@/lib/site";
import { LogoTile } from "../LogoTile";
import { Reveal } from "../Reveal";
import { SectionHeading } from "./SectionHeading";

const now = [
  { k: "Building", v: "Faster Metal kernels for Kestrel" },
  { k: "Leading", v: "Technical workshops at GDG on Campus UTM" },
  { k: "Studying", v: "Applied Math & Statistics, U of T" },
];

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24 sm:px-8 sm:py-28">
      <SectionHeading eyebrow="About">About me</SectionHeading>

      <div className="mt-14 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
        <Reveal className="space-y-5 text-lg leading-relaxed text-muted">
          <p>
            I&apos;m an Applied Math &amp; Statistics student at the University of Toronto, and I spend most of my free
            time building software. What I enjoy most is going one level deeper than I strictly need to.
          </p>
          <p>
            That instinct runs through the work above. With <span className="text-fg">Kestrel</span> I wrote an LLM
            inference engine from scratch to see exactly what happens between a prompt and a token. With{" "}
            <span className="text-fg">RepoGraph</span> I built a tool that answers &ldquo;what does this change
            break?&rdquo; from the code itself. And with <span className="text-fg">Campify</span> I shipped a product
            to 300+ real users and dealt with everything that comes with that.
          </p>
          <p className="text-fg">
            I&apos;m looking for a team where correctness and speed meet real products: software that&apos;s fast and
            right, and things people actually use.
          </p>
        </Reveal>

        <div className="grid gap-6">
          <Reveal delay={100} className="card p-7">
            <p className="eyebrow">Currently</p>
            <ul className="mt-5 space-y-4">
              {now.map((n) => (
                <li key={n.k} className="grid grid-cols-[5.5rem_1fr] gap-3 text-[0.95rem]">
                  <span className="font-mono text-xs uppercase tracking-[0.16em] text-faint pt-1">{n.k}</span>
                  <span className="text-fg">{n.v}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={180} className="card p-7">
            <p className="eyebrow">Awards</p>
            <ul className="mt-5 space-y-3">
              {awards.map((a) => (
                <li key={a.prize} className="flex items-baseline justify-between gap-4 text-[0.95rem]">
                  <span className="text-fg">{a.prize}</span>
                  <span className="shrink-0 font-mono text-xs text-faint">{a.event}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>

      <Reveal delay={120} className="card mt-6 p-7 sm:p-9">
        <p className="eyebrow">Tools &amp; technologies</p>
        <ul className="mt-7 grid grid-cols-4 gap-x-2 gap-y-6 sm:grid-cols-5 lg:grid-cols-7">
          {stack.map((s) => (
            <li key={s.name} className="group flex flex-col items-center gap-2.5 text-center">
              <LogoTile
                src={s.logo}
                alt={s.name}
                size={56}
                className="transition-transform duration-300 group-hover:-translate-y-1"
                radius="rounded-2xl"
              />
              <span className="text-xs leading-tight text-muted transition-colors duration-300 group-hover:text-fg">
                {s.name}
              </span>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
