"use client";

import Image from "next/image";
import { useRef, type PointerEvent } from "react";

/** Hero photo with a gentle 3D tilt toward the pointer. */
export function HeroPhoto() {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${(-y * 5).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(x * 6).toFixed(2)}deg`);
  }

  function onLeave() {
    ref.current?.style.setProperty("--rx", "0deg");
    ref.current?.style.setProperty("--ry", "0deg");
  }

  return (
    <div className="relative [perspective:1200px]" onPointerMove={onMove} onPointerLeave={onLeave}>
      <div
        ref={ref}
        className="rise relative transition-transform duration-500 ease-out [transform-style:preserve-3d]"
        style={{
          transform: "rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))",
          ["--d" as string]: "250ms",
        }}
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] ring-1 ring-white/10 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8)] sm:rounded-[2.5rem]">
          <Image
            src="/derrick.jpg"
            alt="Derrick Ratnaharan smiling on a hike above a lake"
            fill
            priority
            sizes="(min-width: 1024px) 420px, 80vw"
            className="object-cover object-[50%_35%] saturate-[1.05]"
          />
          {/* grade the photo toward the site's palette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1b1030]/70 via-transparent to-[#2a1838]/25 mix-blend-multiply" />
          <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_80%_10%,rgb(240_170_120/0.18),transparent)]" />
        </div>
      </div>
    </div>
  );
}
