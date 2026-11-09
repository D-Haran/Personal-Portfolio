import { site } from "@/lib/site";
import { ArrowUpRight, DownloadIcon, GitHubIcon, LinkedInIcon } from "../Icons";
import { Reveal } from "../Reveal";
import { CopyEmail } from "./CopyEmail";

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl scroll-mt-24 px-5 pb-16 pt-24 sm:px-8 sm:pt-28">
      <Reveal className="card relative overflow-hidden px-6 py-16 text-center sm:px-12 sm:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 70% at 50% 0%, rgb(53 112 230 / 0.18), transparent 70%), radial-gradient(40% 50% at 15% 100%, rgb(118 58 128 / 0.22), transparent 70%), radial-gradient(40% 50% at 90% 100%, rgb(38 104 116 / 0.22), transparent 70%)",
          }}
        />
        <div className="relative">
          <p className="eyebrow">Contact</p>
          <h2 className="mx-auto mt-6 max-w-3xl text-[clamp(2.4rem,6.5vw,5rem)] font-medium leading-[1] tracking-[-0.04em]">
            Get in touch
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted">
            I&apos;m looking for 2027 internships in software engineering and ML systems. Email is the fastest way to
            reach me.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <CopyEmail email={site.email} />
            <a
              href={site.resume}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-line-strong bg-white/[0.03] px-6 py-4 font-medium transition-all duration-300 hover:-translate-y-0.5 hover:border-white/30"
            >
              Resume (PDF)
              <DownloadIcon className="size-4 transition-transform group-hover:translate-y-0.5" />
            </a>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted">
            <a href={site.github} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 hover:text-fg">
              <GitHubIcon /> GitHub
              <ArrowUpRight className="size-3.5 opacity-0 transition-all group-hover:opacity-100" />
            </a>
            <a href={site.linkedin} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 hover:text-fg">
              <LinkedInIcon /> LinkedIn
              <ArrowUpRight className="size-3.5 opacity-0 transition-all group-hover:opacity-100" />
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
