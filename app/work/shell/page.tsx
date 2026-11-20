import type { Metadata } from "next";
import { CaseHero, Metrics, NextProject, Prose, Stack } from "@/components/case/Case";
import { projects } from "@/lib/site";

const project = projects.find((p) => p.slug === "shell")!;

export const metadata: Metadata = {
  title: "mysh: a Unix shell and TCP chat server in C",
  description:
    "A Unix shell in C with pipelines, background jobs and variable expansion, plus a single-threaded TCP chat server multiplexing 50+ clients through one select() loop.",
};

export default function ShellPage() {
  return (
    <article>
      <CaseHero project={project} />

      <Metrics
        items={[
          { value: "11", label: "built-ins, none of them fork" },
          { value: "50+", label: "concurrent clients, one thread" },
          { value: "2,634", label: "lines of C" },
          { value: "6,033", label: "lines of Python integration tests" },
        ]}
      />

      <Prose>
        <p>
          Typing <code>a | b &amp;</code> looks like one thing. It&apos;s actually two forks, a pipe, four{" "}
          <code>dup2</code> calls, five descriptors that each have to be closed in exactly the right process, a
          process group, and a parent that must not block. Get it wrong and nothing crashes: it hangs, or leaks a
          descriptor you notice a thousand commands later.
        </p>
        <p>
          So I wrote one. A Unix shell in C with multi-stage pipelines, background jobs,
          signal handling, variable expansion and eleven built-ins, none of which fork. Built into the same process
          model is a <strong>TCP chat server</strong> that multiplexes every client through a single non-blocking{" "}
          <code>select()</code> loop, with no thread per connection. Each connection carries its own line buffer, because
          TCP has no message boundaries and one message can arrive in three reads.
        </p>
        <p>
          The useful tests weren&apos;t unit tests. Descriptor leaks only show up behaviourally, so the suite drives
          the compiled binary as a subprocess and checks what it actually does, including{" "}
          <strong>making <code>bind</code>, <code>socket</code> and <code>select</code> fail on purpose</strong> to
          confirm it degrades instead of dying.
        </p>
        <p>
          It was coursework for CSC209 at U of T, so the repository stays private.
        </p>
      </Prose>

      <Stack project={project} />
      <NextProject current="shell" />
    </article>
  );
}
