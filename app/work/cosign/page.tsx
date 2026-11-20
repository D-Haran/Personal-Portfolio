import type { Metadata } from "next";
import { CaseHero, Metrics, NextProject, Prose, Stack } from "@/components/case/Case";
import { projects } from "@/lib/site";

const project = projects.find((p) => p.slug === "cosign")!;

export const metadata: Metadata = {
  title: "Cosign: verifying AI output before paying for it",
  description:
    "A verification layer for AI-written documents built at Hack the North 2026: it audits a document against itself, grounds every citation, and settles on Solana only for verified work.",
};

export default function CosignPage() {
  return (
    <article>
      <CaseHero project={project} />

      <Metrics
        items={[
          { value: "25 / 30", label: "planted errors caught" },
          { value: "60K", label: "characters per document audit" },
          { value: "2–4", label: "independent research agents" },
          { value: "2", label: "blind judges per submission" },
        ]}
      />

      <Prose>
        <p>
          Agent payment protocols settle on delivery. They answer &ldquo;did the transfer succeed?&rdquo; and leave{" "}
          <strong>&ldquo;was the work correct?&rdquo;</strong> to whoever receives it. Cosign is an attempt at the
          second question, built over a weekend at Hack the North with one teammate.
        </p>
        <p>
          It does two things. First it reads a document against itself and reports where it disagrees: a percentage
          its own figures contradict, two sections that can&apos;t both be true, the same event dated twice. No search
          engine can settle those. Then it sends the remaining claims to independent research agents and{" "}
          <strong>retrieves every source they cite itself</strong>, rather than trusting the citation.
        </p>
        <p>
          That last part turned out to be the whole point. In one run an agent cited a CERN URL it had invented, which
          404s, and <strong>both LLM judges passed it</strong>. Only the deterministic check that actually fetched
          the page caught it. Funds are released on Solana devnet per verified claim, with the hash of the
          verification in the transaction memo.
        </p>
        <p>
          The escrow program is written but not deployed, so the chain records the decision rather than enforcing it.
          It was nominated for Best Use of Solana.
        </p>
      </Prose>

      <Stack project={project} />
      <NextProject current="cosign" />
    </article>
  );
}
