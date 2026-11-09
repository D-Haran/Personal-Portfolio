"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import { BrandLogo } from "./BrandLogo";
import { GitHubIcon } from "./Icons";

const links = [
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export function Nav() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [sectionActive, setSectionActive] = useState<string | null>(null);
  const active = onHome ? sectionActive : pathname.startsWith("/work") ? "work" : null;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [bar, setBar] = useState({ left: 0, width: 0, visible: false });
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  // Section tracking on the home page.
  useEffect(() => {
    if (!onHome) return;
    const sections = links
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setSectionActive(e.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    const onTop = () => {
      if (window.scrollY < window.innerHeight * 0.4) setSectionActive(null);
    };
    window.addEventListener("scroll", onTop, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onTop);
    };
  }, [onHome]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Slide the underline to the active link.
  useLayoutEffect(() => {
    const measure = () => {
      const el = active ? linkRefs.current[active] : null;
      if (!el) return setBar((b) => ({ ...b, visible: false }));
      setBar({ left: el.offsetLeft + 12, width: el.offsetWidth - 24, visible: true });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:pt-5">
      {/* hairline that draws through the nav on load */}
      <div
        aria-hidden
        className={`nav-line pointer-events-none absolute inset-x-0 top-[2.75rem] h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent transition-opacity duration-700 sm:top-[3rem] ${scrolled ? "opacity-0" : "opacity-100"}`}
      />
      <nav
        aria-label="Primary"
        className={`relative mx-auto flex max-w-5xl items-center justify-between rounded-full border px-2.5 py-2 backdrop-blur-xl transition-all duration-500 ${
          scrolled
            ? "border-line-strong bg-[#121217]/80 shadow-[0_12px_40px_-12px_rgb(0_0_0/0.6)]"
            : "border-line bg-[#121217]/55"
        }`}
      >
        <Link href="/" onClick={() => setOpen(false)} className="group flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3" aria-label="Home">
          <BrandLogo
            id="nav"
            className="size-9 text-fg transition-transform duration-500 group-hover:rotate-[8deg]"
          />
          <span className="text-[0.95rem] font-medium tracking-tight">
            Derrick <span className="hidden sm:inline">Ratnaharan</span>
          </span>
        </Link>

        <div className="relative hidden items-center md:flex">
          {links.map((l) => (
            <Link
              key={l.id}
              href={`/#${l.id}`}
              ref={(el) => {
                linkRefs.current[l.id] = el;
              }}
              className={`relative px-3 py-2 text-[0.92rem] transition-colors duration-300 ${
                active === l.id ? "text-fg" : "text-muted hover:text-fg"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <span
            aria-hidden
            className="absolute -bottom-0.5 h-[2px] rounded-full bg-accent-hi transition-all duration-500 ease-[cubic-bezier(.2,.7,.2,1)]"
            style={{ left: bar.left, width: bar.width, opacity: bar.visible ? 1 : 0 }}
          />
        </div>

        <div className="flex items-center gap-1.5">
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="hidden size-10 place-items-center rounded-full text-muted transition-colors hover:bg-white/5 hover:text-fg sm:grid"
          >
            <GitHubIcon className="size-[18px]" />
          </a>
          <a
            href={site.resume}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-accent px-4 py-2.5 text-sm font-medium text-white shadow-[0_8px_24px_-8px_rgb(53_112_230/0.8)] transition-all duration-300 hover:-translate-y-px hover:bg-[#4580f0] sm:px-5"
          >
            Resume
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Menu"
            className="grid size-10 place-items-center rounded-full text-fg hover:bg-white/5 md:hidden"
          >
            <span className="relative block h-3 w-4">
              <span className={`absolute left-0 h-px w-4 bg-current transition-all duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 top-1.5 h-px w-4 bg-current transition-opacity duration-300 ${open ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 h-px w-4 bg-current transition-all duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={`mx-auto mt-2 max-w-5xl overflow-hidden rounded-3xl border border-line bg-[#121217]/90 backdrop-blur-xl transition-all duration-500 md:hidden ${
          open ? "max-h-80 opacity-100" : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <ul className="p-2">
          {links.map((l) => (
            <li key={l.id}>
              <Link
                href={`/#${l.id}`}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-2xl px-4 py-3 text-fg hover:bg-white/5"
              >
                {l.label}
                <span className="font-mono text-xs text-faint">#{l.id}</span>
              </Link>
            </li>
          ))}
          <li>
            <a href={site.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-2xl px-4 py-3 text-muted hover:bg-white/5">
              <GitHubIcon /> GitHub
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
