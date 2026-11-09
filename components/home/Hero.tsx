import { site } from "@/lib/site";
import { ArrowRight, DownloadIcon } from "../Icons";
import { HeroPhoto } from "./HeroPhoto";

export function Hero() {
  return (
    <section className="relative mx-auto grid max-w-6xl items-center gap-16 px-5 pb-24 pt-32 sm:px-8 sm:pt-40 lg:grid-cols-[1.3fr_1fr] lg:gap-10 lg:pb-28">
      <div>
        <p className="eyebrow rise" style={{ ["--d" as string]: "0ms" }}>
          Software Engineer · U of T &apos;28
        </p>

        <h1 className="mt-6 text-[clamp(3rem,8vw,5.6rem)] font-medium leading-[0.98] tracking-[-0.045em]">
          <span className="block overflow-hidden pb-[0.08em]">
            <span className="rise block" style={{ ["--d" as string]: "120ms" }}>
              Derrick
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.08em]">
            <span className="rise block" style={{ ["--d" as string]: "220ms" }}>
              Ratnaharan
            </span>
          </span>
        </h1>

        <p
          className="rise mt-7 max-w-xl text-lg leading-relaxed text-muted sm:text-xl"
          style={{ ["--d" as string]: "420ms" }}
        >
          I&apos;m an Applied Math &amp; Statistics student at the University of Toronto. I&apos;ve written a Llama
          inference runtime in C++, a static-analysis engine in Rust, and shipped a campus app to{" "}
          <span className="text-fg">300+ students</span>.
        </p>

        <div className="rise mt-9 flex flex-wrap items-center gap-3" style={{ ["--d" as string]: "600ms" }}>
          <a
            href="#work"
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 font-medium text-white shadow-[0_14px_36px_-12px_rgb(53_112_230/0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4580f0]"
          >
            View my work
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <a
            href={site.resume}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-line-strong bg-white/[0.03] px-7 py-4 font-medium text-fg transition-all duration-300 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.06]"
          >
            Resume
            <DownloadIcon className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
          </a>
        </div>

        <p
          className="rise mt-8 flex items-center gap-3 text-sm text-muted"
          style={{ ["--d" as string]: "720ms" }}
        >
          <span className="pulse-dot relative inline-block size-2 rounded-full bg-ok text-ok" />
          {site.status}
        </p>
      </div>

      <div className="mx-auto w-full max-w-[24rem] lg:mr-0">
        <HeroPhoto />
      </div>
    </section>
  );
}
