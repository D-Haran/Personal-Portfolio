import Link from "next/link";
import { site } from "@/lib/site";
import { TorontoClock } from "./TorontoClock";

export function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-5 pb-10 pt-6 sm:px-8">
      <div className="flex flex-col gap-4 border-t border-line pt-8 text-sm text-faint sm:flex-row sm:items-center sm:justify-between">
        <p>
          © 2026 {site.name}. Built with Next.js &amp; Tailwind.
        </p>
        <div className="flex items-center gap-5">
          {/* <TorontoClock /> */}
          <Link href="/#work" className="hover:text-fg">Work</Link>
          <a href={site.github} target="_blank" rel="noreferrer" className="hover:text-fg">GitHub</a>
          <a href={site.linkedin} target="_blank" rel="noreferrer" className="hover:text-fg">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}
