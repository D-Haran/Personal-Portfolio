import type { Metadata } from "next";
import { CaseHero, CaseSection, Limits, Metrics, NextProject, Prose, Terminal } from "@/components/case/Case";
import { Flow } from "@/components/case/Flow";
import { ImpactExplorer } from "@/components/case/ImpactExplorer";
import { Reveal } from "@/components/Reveal";
import { projects } from "@/lib/site";

const project = projects.find((p) => p.slug === "repograph")!;

export const metadata: Metadata = {
  title: "RepoGraph: static analysis in Rust",
  description:
    "RepoGraph is a deterministic repository-intelligence engine in Rust. It uses Tree-sitter to resolve cross-file calls and find the tests affected by a change.",
};

const bench = [
  ["files_indexed", "83"],
  ["loc", "17,874"],
  ["symbols", "1,882"],
  ["graph_edges", "14,954"],
  ["parse_errors", "0"],
  ["cold_index_ms", "362"],
  ["cached_index_ms", "49"],
  ["cached_reload_ms", "14"],
  ["peak_rss_bytes", "42,516,480"],
];

const states = [
  { name: "resolved", tone: "text-accent-hi border-accent-hi/40", body: "Exactly one static target. These are the only edges impact analysis follows." },
  { name: "ambiguous", tone: "text-warn border-warn/40", body: "More than one possible definition. Every candidate ID is kept and none is guessed." },
  { name: "unresolved", tone: "text-bad border-bad/40", body: "Dynamic or unknown target, like value(), getattr or a callback. Recorded, not invented." },
  { name: "external", tone: "text-muted border-line-strong", body: "Points outside the repo, such as a stdlib or package import." },
];

export default function RepoGraphPage() {
  return (
    <article>
      <CaseHero project={project} />

      <Metrics
        items={[
          { value: "362 ms", label: "cold index of Flask 3.1.2", note: "83 files · 17,874 LOC" },
          { value: "49 ms", label: "incremental re-index", note: "content-hash reuse" },
          { value: "14,954", label: "dependency + call edges" },
          { value: "42.5 MB", label: "peak memory (RSS)" },
        ]}
      />

      <CaseSection
        eyebrow="Why"
        title={
          <>
            “Which tests does this change affect?” <span className="serif-accent">It should have a real answer.</span>
          </>
        }
      >
        <Prose>
          <p>
            In big codebases people either run every test or guess. RepoGraph parses a Python or TypeScript/JavaScript
            repo with <strong>Tree-sitter</strong> and builds an index of every definition, import, reference and
            call, with exact source locations. Then it answers graph questions from that index: callers, references,
            transitive impact and affected tests. <strong>It uses no LLM.</strong>
          </p>
          <p>
            It&apos;s conservative on purpose. A call only gets linked when there is{" "}
            <strong>exactly one static target</strong>. Anything less certain is labelled, never quietly turned into
            a confident edge.
          </p>
        </Prose>
      </CaseSection>

      <CaseSection
        eyebrow="Try it"
        title={
          <>
            Impact analysis, <span className="serif-accent">live.</span>
          </>
        }
      >
        <Prose>
          <p>
            Below is RepoGraph&apos;s own 11-file Python + TypeScript test fixture. The symbols, locations and edge
            states come from <strong>running the real binary on it</strong>. Pick a symbol and you get the
            reverse-reachable set that <code>repograph impact</code> reports, plus the tests it reaches.
          </p>
        </Prose>
      </CaseSection>
      <div className="mx-auto mt-10 max-w-6xl px-5 sm:px-8">
        <Reveal>
          <ImpactExplorer />
        </Reveal>
      </div>

      <CaseSection
        eyebrow="Architecture"
        title="Six layers, each with one job."
        aside="Queries only load the persisted index. They never re-parse the repository."
      >
        <Flow
          steps={[
            { title: "discover", detail: "walk the repo, respecting .gitignore" },
            { title: "parse", detail: "Tree-sitter: defs, imports, refs, calls" },
            { title: "analysis", detail: "resolve modules, bindings, self/this", tone: "accent" },
            { title: "graph", detail: "forward/reverse views, Tarjan SCC" },
            { title: "query", detail: "impact, callers, affected tests", tone: "ok" },
            { title: "index", detail: "versioned JSON, atomic writes" },
          ]}
        />

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {states.map((s, i) => (
            <Reveal key={s.name} delay={i * 70} className="rounded-2xl border border-line bg-white/[0.02] p-5">
              <span className={`inline-block rounded-full border px-2.5 py-0.5 font-mono text-xs ${s.tone}`}>{s.name}</span>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{s.body}</p>
            </Reveal>
          ))}
        </div>

        <Prose>
          <p className="mt-10">
            <strong>Incremental indexing:</strong> on a re-index, every file is content-hashed. Unchanged records are
            reused, deleted files drop out, and only changed files get re-parsed. Global resolution is then rebuilt
            from cached and fresh records together. Every definition gets a stable ID made of its path, location,
            kind and qualified name, so duplicate or overloaded names never merge.
          </p>
        </Prose>
      </CaseSection>

      <CaseSection
        eyebrow="Benchmark"
        title={
          <>
            On a real codebase: <span className="serif-accent">Flask.</span>
          </>
        }
        aside="Flask 3.1.2 at commit 2c1b30d. Release profile on Apple Silicon. These are single-run engineering numbers, not a cross-machine guarantee."
      >
        <Terminal title="repograph benchmark flask">
          <span className="text-ok">$</span> <span className="text-fg">repograph benchmark</span> ./flask{"\n"}
          {"{"}
          {"\n"}
          {bench.map(([k, v], i) => (
            <span key={k}>
              {"  "}
              <span className="text-accent-hi">&quot;{k}&quot;</span>: <span className="text-fg">{v}</span>
              {i < bench.length - 1 ? "," : ""}
              {"\n"}
            </span>
          ))}
          {"}"}
        </Terminal>
      </CaseSection>

      <CaseSection
        eyebrow="Correctness"
        title="Tested against a known graph and generated graphs."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Reveal className="card p-6">
            <p className="font-mono text-3xl text-fg">11 files</p>
            <p className="mt-3 leading-relaxed text-muted">
              A checked-in mixed-language fixture with a known graph. It covers import resolution, cross-file calls,{" "}
              <code className="text-fg">self.validate</code>, duplicate definitions becoming ambiguous, syntax-error
              recovery, affected tests and full cache reuse.
            </p>
          </Reveal>
          <Reveal delay={100} className="card p-6">
            <p className="font-mono text-3xl text-fg">64 × 18</p>
            <p className="mt-3 leading-relaxed text-muted">
              A property test generates 64 random directed graphs of 18 nodes each. For every one it checks that the
              SCC output partitions the node set exactly and that every pair in a component can reach each other.
            </p>
          </Reveal>
        </div>
        <Terminal title="verify" className="mt-4">
          <span className="text-ok">$</span> <span className="text-fg">cargo fmt</span> --all -- --check{"\n"}
          <span className="text-ok">$</span> <span className="text-fg">cargo clippy</span> --all-targets -- -D warnings{"\n"}
          <span className="text-ok">$</span> <span className="text-fg">cargo test</span> --all-targets
        </Terminal>
      </CaseSection>

      <CaseSection
        eyebrow="Limits"
        title={
          <>
            Static analysis <span className="serif-accent">has edges.</span>
          </>
        }
        aside="These limits show up in the index as resolution states. They aren't hidden."
      >
        <Limits
          items={[
            "Python monkey-patching, getattr, runtime imports and wildcard imports usually stay unresolved.",
            "TypeScript path aliases, overload selection and inferred receiver types aren't type-checked yet.",
            "Calls through callbacks, dependency injection or reflection resolve only with a unique binding.",
            "Affected tests are a conservative graph-plus-naming heuristic. Tests chosen at runtime can be missed.",
          ]}
        />
      </CaseSection>

      <NextProject current="repograph" />
    </article>
  );
}
