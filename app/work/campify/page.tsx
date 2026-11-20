import type { Metadata } from "next";
import Image from "next/image";
import { CaseHero, Metrics, NextProject, Prose, Stack } from "@/components/case/Case";
import { Reveal } from "@/components/Reveal";
import { projects } from "@/lib/site";

const project = projects.find((p) => p.slug === "campify")!;

export const metadata: Metadata = {
  title: "Campify: a campus social app",
  description:
    "A campus social app for web, iOS and Android used by 300+ students. It turns a timetable screenshot into a calendar with Vertex AI, and monetizes with Stripe.",
};

const shots = [
  { src: "/campify/friends-schedules.jpg", alt: "Seeing when friends are free" },
  { src: "/campify/feed.jpg", alt: "Campus feed" },
  { src: "/campify/course-reviews.jpg", alt: "Course ratings" },
  { src: "/campify/build-better-habits.jpg", alt: "Profile and campus activity" },
];

export default function CampifyPage() {
  return (
    <article>
      <CaseHero project={project} />

      <Metrics
        items={[
          { value: "300+", label: "students onboarded" },
          { value: "54 → 71%", label: "profile completion" },
          { value: "92%", label: "of classes read from a screenshot" },
          { value: "18 + 11", label: "paying students and clubs" },
        ]}
      />

      <Prose>
        <p>
          Meeting up between classes usually means a group chat full of timetable screenshots. Campify puts
          everyone&apos;s timetable in one place: you can see when friends are free, find people in your courses, and
          follow what&apos;s happening on campus. I built and shipped it on <strong>iOS, Android and the web</strong>,
          and it grew to 300+ students.
        </p>
        <p>
          The feature everything depends on is importing a timetable, and my first version did it on-device: OCR the
          screenshot, find day columns, pull course codes and times out with regexes. It worked and it was brittle:
          every school&apos;s timetable has a different layout, and OCR breaks words in places no rule predicts. I
          moved it to <strong>Vertex AI</strong>, reading the image straight into a strict JSON schema, which turned
          &ldquo;parse this layout&rdquo; into &ldquo;describe what you see.&rdquo; It now reads{" "}
          <strong>92% of classes correctly</strong>, including the overlapping blocks that broke the old parser.
        </p>
        <p>
          I also learned that paying users change what you build. A freemium tier on Stripe brought in 18 paying
          students and 11 student clubs, and taught me that billing is a state-sync problem, not a payments one. And
          after noticing new users abandoning their profiles, I rebuilt onboarding around the drop-off step and took
          completion from <strong>54% to 71%</strong>.
        </p>
      </Prose>

      <section className="mt-14 overflow-hidden" aria-label="App screenshots">
        <div className="mx-auto flex max-w-5xl snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:px-8 [scrollbar-width:none]">
          {shots.map((s, i) => (
            <Reveal key={s.src} delay={i * 80} className="w-[46vw] max-w-[12rem] shrink-0 snap-start sm:w-[11rem]">
              <div className="overflow-hidden rounded-[1.25rem] border border-line bg-surface">
                <Image
                  src={s.src}
                  alt={s.alt}
                  width={737}
                  height={1600}
                  sizes="(min-width: 640px) 176px, 46vw"
                  className="h-auto w-full"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Stack project={project} />
      <NextProject current="campify" />
    </article>
  );
}
