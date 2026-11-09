import type { Metadata } from "next";
import Image from "next/image";
import { CaseHero, CaseSection, Metrics, NextProject, Prose, Terminal } from "@/components/case/Case";
import { Flow } from "@/components/case/Flow";
import { Reveal } from "@/components/Reveal";
import { projects } from "@/lib/site";

const project = projects.find((p) => p.slug === "campify")!;

export const metadata: Metadata = {
  title: "Campify: a campus social app",
  description:
    "Campify is a production campus social app for web, iOS and Android, used by 300+ students. It includes an OCR timetable importer and graph-based friend recommendations.",
};

const shots = [
  { src: "/campify/friends-schedules.jpg", alt: "Smart scheduling: see when friends are free" },
  { src: "/campify/feed.jpg", alt: "Campus feed screen" },
  { src: "/campify/course-reviews.jpg", alt: "Course ratings screen" },
  { src: "/campify/build-better-habits.jpg", alt: "Profile and campus activity screen" },
];

const signals = [
  { name: "Mutual connections", body: "People your friends already know." },
  { name: "Schedule overlap", body: "Shared courses and free time, from imported timetables." },
  { name: "Social proximity", body: "How close you already are in the network." },
  { name: "Interaction signals", body: "Who you actually engage with in the app." },
];

export default function CampifyPage() {
  return (
    <article>
      <CaseHero project={project} />

      <Metrics
        items={[
          { value: "300+", label: "students onboarded", note: "across multiple universities" },
          { value: "3", label: "platforms shipped", note: "iOS · Android · web" },
          { value: "+17 pts", label: "profile completion", note: "54% → 71% after redesign" },
          { value: "1 photo", label: "to import a timetable", note: "on-device OCR" },
        ]}
      />

      <section className="mt-20 overflow-hidden" aria-label="App screenshots">
        <div className="mx-auto flex max-w-6xl snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 sm:px-8 [scrollbar-width:none]">
          {shots.map((s, i) => (
            <Reveal key={s.src} delay={i * 90} className="w-[62vw] max-w-[16rem] shrink-0 snap-start sm:w-[15rem]">
              <div className="group overflow-hidden rounded-[1.6rem] border border-line bg-surface">
                <Image
                  src={s.src}
                  alt={s.alt}
                  width={737}
                  height={1600}
                  sizes="(min-width: 640px) 240px, 62vw"
                  className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <CaseSection
        eyebrow="Why"
        title={
          <>
            Campus life runs on schedules, <span className="serif-accent">but nobody shares them.</span>
          </>
        }
      >
        <Prose>
          <p>
            Meeting up between classes usually means a group chat full of timetable screenshots. Campify puts
            everyone&apos;s timetable in one place. You can see when friends are free, find people in your courses,
            and follow what&apos;s happening on campus.
          </p>
          <p>
            I built and launched it on <strong>iOS, Android and the web</strong> with Flutter, React, Firebase and
            Node.js. It grew to <strong>300+ students across multiple universities</strong>, which meant real data
            and real users finding edge cases I hadn&apos;t thought of.
          </p>
        </Prose>
      </CaseSection>

      <CaseSection
        eyebrow="Timetable import"
        title={
          <>
            From a messy screenshot <span className="serif-accent">to a structured schedule.</span>
          </>
        }
        aside="Every school's timetable looks different. The parser can't assume a layout, so it works from geometry and patterns."
      >
        <Flow
          steps={[
            { title: "On-device OCR", detail: "ML Kit text blocks, lines and boxes" },
            { title: "Find day columns", detail: "header labels, or x-clustering if none" },
            { title: "Extract class cards", detail: "course codes, times, rooms via regex", tone: "accent" },
            { title: "De-duplicate", detail: "merge boxes with heavy IoU overlap" },
            { title: "User review", detail: "low-confidence rows get confirmed" },
            { title: "Write schedule", detail: "Firestore + optional .ics", tone: "ok" },
          ]}
        />

        <Prose>
          <p className="mt-10">
            The hard part was <strong>defensive parsing</strong>. Course codes come as <code>MAT223H5</code> or{" "}
            <code>PHYSICS 1D03</code>, times as <code>9:30 PM</code>, <code>9PM</code> or <code>21:30</code>, and OCR
            breaks words in odd places. So the parser looks at neighbouring lines in a block, normalizes everything
            to 24-hour time, and falls back to clustering by x-position when no day headers are found. Nothing is
            written until the student has checked the rows.
          </p>
        </Prose>

        <Terminal title="schedule_image_import.dart" className="mt-8">
          <span className="text-faint">{"// course codes: MAT223H5 / MAT 223H5, then looser fallbacks"}</span>
          {"\n"}
          <span className="text-accent-hi">final</span> _reCourseTight = RegExp(<span className="text-ok">r&apos;\b([A-Z]{"{3}"}\s?\d{"{3}"}[A-Z]\d?)\b&apos;</span>);{"\n"}
          <span className="text-accent-hi">final</span> _reCourseLoose = RegExp(<span className="text-ok">r&apos;\b([A-Z]{"{2,}"}\s?\d{"{3}"}[A-Z]?\d?)\b&apos;</span>);{"\n"}
          <span className="text-faint">{"// 9:30 PM – 11 PM  →  21:30–23:00"}</span>
          {"\n"}
          <span className="text-accent-hi">final</span> _reTimeAMPM = RegExp(<span className="text-ok">r&apos;(\d{"{1,2}"}(:\d{"{2}"})?\s?(AM|PM))\s*[-–]\s*…&apos;</span>);
        </Terminal>
      </CaseSection>

      <CaseSection
        eyebrow="Recommendations"
        title={
          <>
            Friend suggestions that <span className="serif-accent">make sense.</span>
          </>
        }
        aside="The social graph and the schedule data feed one ranking, so a suggestion reflects both who you know and where you are."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {signals.map((s, i) => (
            <Reveal key={s.name} delay={i * 80} className="card p-6">
              <p className="font-mono text-xs text-accent-hi">{String(i + 1).padStart(2, "0")}</p>
              <p className="mt-3 text-lg font-medium tracking-tight">{s.name}</p>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{s.body}</p>
            </Reveal>
          ))}
        </div>
      </CaseSection>

      <CaseSection
        eyebrow="Onboarding"
        title={
          <>
            I used the data <span className="serif-accent">to fix the funnel.</span>
          </>
        }
      >
        <Prose>
          <p>
            Many new students never finished their profile, and an empty profile makes a social app feel empty. I
            looked at where new users dropped off during activation and{" "}
            <strong>redesigned onboarding around those points</strong>.
          </p>
        </Prose>

        <Reveal className="card mt-8 p-6 sm:p-8">
          <p className="flex items-baseline justify-between text-sm">
            <span className="text-fg">Profile completion</span>
            <span className="font-mono text-xs text-faint">+17 percentage points</span>
          </p>
          <div className="mt-6 space-y-4">
            {[
              { label: "Before", v: 54, color: "rgb(255 255 255 / 0.22)" },
              { label: "After", v: 71, color: "linear-gradient(90deg,#2f8f86,#5fd08a)" },
            ].map((r, i) => (
              <div key={r.label} className="grid grid-cols-[4rem_1fr_3.5rem] items-center gap-4">
                <span className="text-sm text-muted">{r.label}</span>
                <div className="h-8 overflow-hidden rounded-lg bg-white/[0.04]">
                  <div
                    className="bar-grow h-full rounded-lg"
                    style={{ width: `${r.v}%`, background: r.color, ["--d" as string]: `${i * 250}ms` }}
                  />
                </div>
                <span className="font-mono text-lg tabular-nums">{r.v}%</span>
              </div>
            ))}
          </div>
        </Reveal>
      </CaseSection>

      <NextProject current="campify" />
    </article>
  );
}
