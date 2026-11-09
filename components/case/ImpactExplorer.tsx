"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

/**
 * Interactive version of `repograph impact`, built from RepoGraph's own
 * 11-file test fixture. Symbols, locations and edge states come from running
 * the real binary; the impact set is reverse reachability over resolved edges,
 * which matches the binary's SYMBOLS output for every node here.
 */

type Sym = { id: string; label: string; loc: string; file: string; test?: boolean };
type Edge = { from: string; to: string; state: "resolved" | "ambiguous" | "unresolved"; kind?: "call" | "reference" };

const FILES: { path: string; lang: "ts" | "py"; note?: { text: string; tone: "bad" | "info" }; syms: Sym[] }[] = [
  {
    path: "tests/auth.test.ts",
    lang: "ts",
    syms: [{ id: "tests.auth.test.testAuthentication", label: "testAuthentication", loc: "3:8", file: "tests/auth.test.ts", test: true }],
  },
  {
    path: "src/auth.ts",
    lang: "ts",
    syms: [
      { id: "src.auth.User.authenticate", label: "User.authenticate", loc: "6:3", file: "src/auth.ts" },
      { id: "src.auth.audit", label: "audit", loc: "1:8", file: "src/auth.ts" },
    ],
  },
  {
    path: "src/api.ts",
    lang: "ts",
    syms: [
      { id: "src.api.login", label: "login", loc: "3:8", file: "src/api.ts" },
      { id: "src.api.authFunction", label: "authFunction", loc: "7:14", file: "src/api.ts" },
    ],
  },
  {
    path: "app.py",
    lang: "py",
    syms: [{ id: "app.login", label: "login", loc: "4:1", file: "app.py" }],
  },
  {
    path: "pkg/service.py",
    lang: "py",
    syms: [
      { id: "pkg.service.Account.authenticate", label: "Account.authenticate", loc: "2:5", file: "pkg/service.py" },
      { id: "pkg.service.Account.validate", label: "Account.validate", loc: "5:5", file: "pkg/service.py" },
    ],
  },
  {
    path: "pkg/__init__.py",
    lang: "py",
    note: { text: "re-exports Account", tone: "info" },
    syms: [],
  },
  {
    path: "ambiguous.py",
    lang: "py",
    syms: [
      { id: "ambiguous.use_collision", label: "use_collision", loc: "7:1", file: "ambiguous.py" },
      { id: "ambiguous.collide@1", label: "collide", loc: "1:1", file: "ambiguous.py" },
      { id: "ambiguous.collide@4", label: "collide", loc: "4:1", file: "ambiguous.py" },
    ],
  },
  {
    path: "src/use-default.ts",
    lang: "ts",
    syms: [{ id: "src.use-default.readAnswer", label: "readAnswer", loc: "3:8", file: "src/use-default.ts" }],
  },
  {
    path: "src/defaulted.ts",
    lang: "ts",
    syms: [{ id: "src.defaulted.primary", label: "primary (default)", loc: "1:16", file: "src/defaulted.ts" }],
  },
  {
    path: "src/dynamic.ts",
    lang: "ts",
    note: { text: "value() — dynamic target", tone: "bad" },
    syms: [{ id: "src.dynamic.invoke", label: "invoke", loc: "1:8", file: "src/dynamic.ts" }],
  },
];

const EDGES: Edge[] = [
  { from: "tests.auth.test.testAuthentication", to: "src.auth.User.authenticate", state: "resolved" },
  { from: "src.api.login", to: "src.auth.User.authenticate", state: "resolved" },
  { from: "src.api.authFunction", to: "src.auth.User.authenticate", state: "resolved", kind: "reference" },
  { from: "src.auth.User.authenticate", to: "src.auth.audit", state: "resolved" },
  { from: "app.login", to: "pkg.service.Account.authenticate", state: "resolved" },
  { from: "pkg.service.Account.authenticate", to: "pkg.service.Account.validate", state: "resolved" },
  { from: "ambiguous.use_collision", to: "ambiguous.collide@1", state: "ambiguous" },
  { from: "ambiguous.use_collision", to: "ambiguous.collide@4", state: "ambiguous" },
  { from: "src.use-default.readAnswer", to: "src.defaulted.primary", state: "resolved" },
];

const ALL = FILES.flatMap((f) => f.syms);
/** Files that import an impacted file are reported too (here: the package re-export). */
const IMPORTERS: Record<string, string[]> = { "pkg/service.py": ["pkg/__init__.py"] };
const BY_ID = Object.fromEntries(ALL.map((s) => [s.id, s]));

/** Reverse reachability over resolved edges only — ambiguous edges are never traversed. */
function impactOf(id: string): Set<string> {
  const seen = new Set([id]);
  const stack = [id];
  while (stack.length) {
    const cur = stack.pop()!;
    for (const e of EDGES) {
      if (e.state === "resolved" && e.to === cur && !seen.has(e.from)) {
        seen.add(e.from);
        stack.push(e.from);
      }
    }
  }
  return seen;
}

type Pt = { x: number; y: number };

export function ImpactExplorer() {
  const [selected, setSelected] = useState("src.auth.audit");
  const wrap = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [pos, setPos] = useState<Record<string, { l: Pt; r: Pt; c: Pt }>>({});
  const [box, setBox] = useState({ w: 0, h: 0 });

  const impact = useMemo(() => impactOf(selected), [selected]);
  const sel = BY_ID[selected];
  const impactSyms = ALL.filter((s) => impact.has(s.id)).sort((a, b) => a.id.localeCompare(b.id));
  const impactFiles = [
    ...new Set(impactSyms.flatMap((s) => [s.file, ...(IMPORTERS[s.file] ?? [])])),
  ].sort();
  const tests = impactSyms.filter((s) => s.test);

  const measure = useCallback(() => {
    const root = wrap.current;
    if (!root) return;
    const rr = root.getBoundingClientRect();
    const next: typeof pos = {};
    for (const s of ALL) {
      const el = nodeRefs.current[s.id];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      const y = r.top - rr.top + r.height / 2;
      next[s.id] = {
        l: { x: r.left - rr.left, y },
        r: { x: r.right - rr.left, y },
        c: { x: r.left - rr.left + r.width / 2, y },
      };
    }
    setPos(next);
    setBox({ w: rr.width, h: rr.height });
  }, []);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const ro = new ResizeObserver(measure);
    if (wrap.current) ro.observe(wrap.current);
    return () => ro.disconnect();
  }, [measure]);

  function path(e: Edge) {
    const a = pos[e.from];
    const b = pos[e.to];
    if (!a || !b) return "";
    // Connect facing sides; nodes stacked in one column loop out to the right.
    let p1: Pt, p2: Pt, s1: number, s2: number;
    if (a.c.x < b.c.x - 40) [p1, p2, s1, s2] = [a.r, b.l, 1, -1];
    else if (a.c.x > b.c.x + 40) [p1, p2, s1, s2] = [a.l, b.r, -1, 1];
    else [p1, p2, s1, s2] = [a.r, b.r, 1, 1];
    const dx = Math.max(28, Math.abs(p2.x - p1.x) * 0.45);
    return `M${p1.x},${p1.y} C${p1.x + dx * s1},${p1.y} ${p2.x + dx * s2},${p2.y} ${p2.x},${p2.y}`;
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
        <p className="text-sm text-muted">
          <span className="text-fg">Click any symbol</span> to see what a change to it can break.
        </p>
        <div className="flex flex-wrap gap-4 font-mono text-[11px] text-faint">
          <span className="inline-flex items-center gap-2"><span className="h-px w-5 bg-accent-hi" />resolved</span>
          <span className="inline-flex items-center gap-2"><span className="h-px w-5 border-t border-dashed border-warn" />ambiguous</span>
          <span className="inline-flex items-center gap-2"><span className="h-px w-5 border-t border-dashed border-bad" />unresolved</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_21rem]">
        {/* graph */}
        <div ref={wrap} className="relative p-5 sm:p-7">
          <svg className="pointer-events-none absolute inset-0 z-10" width={box.w} height={box.h} aria-hidden>
            <defs>
              <marker id="arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0,0 L8,4 L0,8 z" fill="currentColor" />
              </marker>
            </defs>
            {EDGES.map((e, i) => {
              const hot = e.state === "resolved" && impact.has(e.from) && impact.has(e.to);
              const color =
                e.state === "ambiguous" ? "var(--color-warn)" : hot ? "var(--color-accent-hi)" : "rgb(255 255 255 / 0.22)";
              return (
                <path
                  key={i}
                  d={path(e)}
                  fill="none"
                  stroke={color}
                  strokeWidth={hot ? 1.8 : 1.2}
                  strokeDasharray={e.state === "ambiguous" ? "4 4" : undefined}
                  className={hot ? "flow" : ""}
                  style={{ color, transition: "stroke 300ms", animationDirection: "reverse" }}
                  markerEnd="url(#arrow)"
                  opacity={e.state === "ambiguous" ? 0.7 : 1}
                />
              );
            })}
          </svg>

          <div className="relative grid gap-x-12 gap-y-5 sm:grid-cols-3">
            {FILES.map((f) => (
              <div key={f.path} className="rounded-2xl border border-line bg-[#101015]/80 p-3 backdrop-blur-sm">
                <p className="flex items-center justify-between gap-2 px-1 font-mono text-[11px] text-faint">
                  <span className="truncate">{f.path}</span>
                  <span className="rounded bg-white/5 px-1.5 py-px uppercase">{f.lang}</span>
                </p>
                <div className="mt-2.5 flex flex-col gap-1.5">
                  {f.syms.map((s) => {
                    const isSel = s.id === selected;
                    const inImpact = impact.has(s.id);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        ref={(el) => {
                          nodeRefs.current[s.id] = el;
                        }}
                        onClick={() => setSelected(s.id)}
                        aria-pressed={isSel}
                        className={`group flex items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left font-mono text-[12px] transition-all duration-300 ${
                          isSel
                            ? "border-accent bg-accent/25 text-white shadow-[0_0_0_4px_rgb(53_112_230/0.15)]"
                            : inImpact
                              ? s.test
                                ? "border-ok/50 bg-ok/10 text-fg"
                                : "border-accent-hi/40 bg-accent/10 text-fg"
                              : "border-line bg-white/[0.02] text-muted hover:border-line-strong hover:text-fg"
                        }`}
                      >
                        <span className="truncate">{s.label}</span>
                        <span className="shrink-0 text-[10px] text-faint">{s.test ? "test" : `:${s.loc.split(":")[0]}`}</span>
                      </button>
                    );
                  })}
                  {f.note && (
                    <p
                      className={`flex items-center gap-2 rounded-xl border border-dashed px-3 py-2 font-mono text-[11px] ${
                        f.note.tone === "bad"
                          ? "border-bad/50 text-bad/90"
                          : impactFiles.includes(f.path)
                            ? "border-accent-hi/40 text-accent-hi"
                            : "border-line-strong text-faint"
                      }`}
                    >
                      {f.note.tone === "bad" ? "?" : "↳"} {f.note.text}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* output */}
        <div className="border-t border-line bg-[#0c0c10] p-5 font-mono text-[12px] leading-relaxed sm:p-6 lg:border-l lg:border-t-0">
          <p className="text-faint">
            <span className="text-ok">$</span> repograph impact <span className="text-fg">{sel.id.replace(/@\d+$/, "")}</span>
          </p>
          <p className="mt-4 text-[10px] tracking-[0.2em] text-faint">SYMBOLS</p>
          <ul className="mt-1.5 space-y-1">
            {impactSyms.map((s) => (
              <li key={s.id} className="flex justify-between gap-3">
                <span className={`truncate ${s.id === selected ? "text-accent-hi" : "text-fg"}`}>{s.id.replace(/@\d+$/, "")}</span>
                <span className="shrink-0 text-faint">{s.file.split("/").pop()}:{s.loc}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[10px] tracking-[0.2em] text-faint">FILES</p>
          <ul className="mt-1.5 space-y-1 text-muted">
            {impactFiles.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <div className="mt-5 rounded-xl border border-line p-3">
            <p className="text-[10px] tracking-[0.2em] text-faint">AFFECTED TESTS</p>
            {tests.length ? (
              tests.map((t) => (
                <p key={t.id} className="mt-1.5 text-ok">
                  ✓ {t.file}
                </p>
              ))
            ) : (
              <p className="mt-1.5 text-muted">none reachable</p>
            )}
          </div>
          {selected.startsWith("ambiguous.collide") && (
            <p className="mt-4 font-sans text-xs leading-relaxed text-warn/90">
              <code>use_collision</code> could call either definition, so RepoGraph records an ambiguous edge and
              doesn&apos;t treat it as a confirmed caller.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
