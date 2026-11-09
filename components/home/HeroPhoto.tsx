"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight } from "../Icons";
import { ResumeModal } from "../ResumeModal";

/** Hero photo stacked over the résumé; clicking opens a stylized preview. */
export function HeroPhoto() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative [perspective:1400px]">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open résumé preview"
        className="rise group relative block w-full text-left [transform-style:preserve-3d]"
        style={{ ["--d" as string]: "250ms" }}
      >
        {/* résumé peeking out behind the photo */}
        <div
          className="absolute right-0 top-0 h-full w-[76%] origin-bottom-right rotate-[5deg] translate-x-[14%] translate-y-[5%] overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_-24px_rgb(0_0_0/0.85)] ring-1 ring-black/10 transition-transform duration-500 ease-out group-hover:translate-x-[22%] group-hover:rotate-[7deg]"
          style={{ transform: "translateZ(-40px)" }}
        >
          <Image
            src="/resume-preview.jpg"
            alt=""
            width={1082}
            height={1400}
            className="h-full w-full object-cover object-top opacity-95"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/15 to-transparent" />
        </div>

        {/* the photo */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] ring-1 ring-white/10 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.85)] transition-transform duration-500 ease-out group-hover:-translate-y-1 sm:rounded-[2.5rem]">
          <Image
            src="/Derrick-hero.jpeg"
            alt="Derrick Ratnaharan"
            fill
            priority
            sizes="(min-width: 1024px) 420px, 80vw"
            className="object-cover object-center"
            style={{
              transform: "translateY(-8.9%) scale(1.32)",
              transformOrigin: "center",
              filter: "brightness(1) contrast(1.06) saturate(0.78)",
            }}
          />
          {/* tone the bright outdoor photo toward the site's dark, moody palette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090c]/80 via-[#120b22]/25 to-[#1b1030]/30 mix-blend-multiply" />
          <div className="absolute inset-0 bg-[#0e0a1a]/25 mix-blend-soft-light" />
          <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_80%_10%,rgb(240_170_120/0.12),transparent)]" />

          {/* hint */}
          {/* <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md transition-colors duration-300 group-hover:bg-black/60">
            <span className="size-1.5 rounded-full bg-ok" />
            View résumé
            <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span> */}
        </div>
      </button>

      <ResumeModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
