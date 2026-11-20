import Image from "next/image";

/** Deterministic pseudo-random in [0,1) so server and client render identically. */
const hash = (i: number, j: number) => {
  const x = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/**
 * Kestrel: a causal attention matrix. Lower-triangular cells glow in a warm
 * gradient; a scan line sweeps down like tokens being decoded.
 */
export function KestrelVisual({ n = 12, className = "" }: { n?: number; className?: string }) {
  const size = 100 / n;
  const cells = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      const diag = j === i;
      const o = diag ? 0.95 : 0.18 + hash(i, j) * 0.6 * (1 - (i - j) / (n * 1.4));
      const t = (i + j) / (2 * n);
      cells.push(
        <rect
          key={`${i}-${j}`}
          className="cell"
          x={j * size + 0.6}
          y={i * size + 0.6}
          width={size - 1.2}
          height={size - 1.2}
          rx={1.2}
          fill={`url(#kg)`}
          style={{ ["--o" as string]: o.toFixed(2), ["--cd" as string]: `${(t * 3.6).toFixed(2)}s`, opacity: o }}
        />,
      );
    }
  }
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background:
          "radial-gradient(120% 90% at 30% 20%, #f3b28d 0%, #d47a86 35%, #6b4bb8 70%, #2b2f73 100%)",
      }}
    >
      <div className="absolute inset-0 opacity-50 mix-blend-soft-light" style={{ background: "radial-gradient(60% 60% at 70% 80%, #8fb1ff, transparent)" }} />
      <svg viewBox="-6 -6 112 112" className="absolute inset-[10%] size-[80%] drop-shadow-[0_10px_30px_rgb(20_10_50/0.5)]" aria-hidden>
        <defs>
          <linearGradient id="kg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff6d6" />
            <stop offset="0.5" stopColor="#ffd08a" />
            <stop offset="1" stopColor="#ff8f9a" />
          </linearGradient>
        </defs>
        {cells}
      </svg>
      <div
        aria-hidden
        className="absolute inset-x-[10%] top-[10%] h-[8%] rounded-sm bg-gradient-to-b from-transparent via-white/25 to-transparent"
        style={{ animation: "sweep 6s linear infinite" }}
      />
      {/* <span className="absolute bottom-3 left-4 font-mono text-[10px] tracking-[0.2em] text-white/70">CAUSAL MASK · KV CACHED</span> */}
    </div>
  );
}

/** Verdicts shown in the Cosign card visual, in the order the pipeline reports them. */
const C_CLAIMS: [string, "ok" | "bad" | "warn", number][] = [
  ["emissions cut 80%", "bad", 0.86],
  ["fleet launched 2021", "ok", 0.62],
  ["cost overrun 1,200%", "bad", 0.74],
  ["18% measured drop", "ok", 0.54],
  ["source: home.cern/…", "warn", 0.68],
  ["12 vessels in service", "ok", 0.46],
];

const C_TONE = {
  ok: "#5fd08a",
  bad: "#ef6f6f",
  warn: "#f0b45c",
} as const;

/**
 * Cosign: a stack of extracted claims, each carrying the verdict the
 * grounding gate gave it. The sweep is the judging pass moving down the list.
 */
export function CosignVisual({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background:
          "radial-gradient(120% 95% at 20% 0%, #3b2a6b 0%, #2a2160 38%, #16304a 72%, #0c1626 100%)",
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-45 mix-blend-soft-light"
        style={{ background: "radial-gradient(55% 55% at 85% 90%, #37d6a0, transparent)" }}
      />
      <div className="absolute inset-x-[9%] top-[13%] space-y-[4.5%]">
        {C_CLAIMS.map(([label, tone, w], i) => (
          <div key={label} className="flex items-center gap-[3%]">
            <span
              className="size-[7px] shrink-0 rounded-full"
              style={{ background: C_TONE[tone], boxShadow: `0 0 10px ${C_TONE[tone]}` }}
            />
            <span
              className="h-[6px] rounded-full"
              style={{
                width: `${w * 100}%`,
                background: `linear-gradient(90deg, ${C_TONE[tone]}aa, ${C_TONE[tone]}22)`,
                opacity: 0.85 - i * 0.06,
              }}
            />
          </div>
        ))}
      </div>
      <div
        aria-hidden
        className="absolute inset-x-[9%] top-[13%] h-[10%] rounded-sm bg-gradient-to-b from-transparent via-white/20 to-transparent"
        style={{ animation: "sweep 7s linear infinite" }}
      />
      <svg viewBox="0 0 100 24" className="absolute inset-x-[9%] bottom-[16%] h-[14%] w-[82%]" aria-hidden>
        <line x1="2" y1="12" x2="98" y2="12" stroke="#37d6a0" strokeOpacity="0.45" strokeWidth="1" className="flow" />
        <circle cx="2" cy="12" r="3" fill="#37d6a0" />
        <circle cx="98" cy="12" r="3" fill="#37d6a0" />
      </svg>
      {/* <span className="absolute bottom-3 left-4 font-mono text-[10px] tracking-[0.2em] text-white/70">
        GROUNDED · REFUTED · FABRICATED
      </span> */}
    </div>
  );
}

/** Client sockets in the mysh card visual: [y offset, active]. */
const S_FDS: [number, boolean][] = [
  [14, true],
  [27, false],
  [40, true],
  [53, true],
  [66, false],
  [79, true],
];

/**
 * mysh: client file descriptors on the left, one select() loop in the middle.
 * The ready ones light up; the loop never forks and never blocks.
 */
export function ShellVisual({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background:
          "radial-gradient(110% 90% at 80% 10%, #2a3a33 0%, #1b2a28 40%, #121a1e 75%, #0b1013 100%)",
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-30 mix-blend-soft-light"
        style={{ background: "radial-gradient(45% 45% at 18% 85%, #5fd08a, transparent)" }}
      />
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" aria-hidden>
        {S_FDS.map(([y, hot], i) => (
          <g key={y}>
            <path
              d={`M10 ${y} C 32 ${y}, 38 50, 56 50`}
              fill="none"
              stroke={hot ? "#5fd08a" : "#ffffff"}
              strokeOpacity={hot ? 0.75 : 0.16}
              strokeWidth="1"
              className={hot ? "flow" : ""}
              style={hot ? { animationDelay: `${i * 0.18}s` } : undefined}
            />
            <circle cx="10" cy={y} r="2" fill={hot ? "#5fd08a" : "#ffffff"} fillOpacity={hot ? 0.95 : 0.3} />
          </g>
        ))}
        <rect x="56" y="36" width="30" height="28" rx="5" fill="#0b1013" fillOpacity="0.7" stroke="#5fd08a" strokeOpacity="0.5" />
      </svg>
      <span className="absolute left-[60%] top-[42%] font-mono text-[9px] tracking-[0.08em] text-ok/90 sm:text-[10px]">
        select()
      </span>
      <span className="absolute left-[4%] top-[4%] font-mono text-[10px] text-white/45">mysh$</span>
      {/* <span className="absolute bottom-3 left-4 font-mono text-[10px] tracking-[0.2em] text-white/60">
        ONE THREAD · 50+ CLIENTS
      </span> */}
    </div>
  );
}

/** Campify: a real App Store screenshot floating on a cool teal field. */
export function CampifyVisual({ className = "", priority = false }: { className?: string; priority?: boolean }) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: "radial-gradient(120% 100% at 70% 0%, #bfe3e4 0%, #7fb8bf 40%, #2f5e6a 80%, #173640 100%)" }}
    >
      <div className="absolute inset-0 opacity-40 mix-blend-soft-light" style={{ background: "radial-gradient(50% 50% at 25% 85%, #ffd9a8, transparent)" }} />
      <div className="absolute left-1/2 top-[11%] w-[44%] -translate-x-1/2 rotate-[5deg] transition-transform duration-700 group-hover:rotate-[2deg] group-hover:-translate-y-2">
        {/* crop away the store-listing headline so only the phone shows */}
        <div className="relative aspect-[9/14] overflow-hidden rounded-[1.1rem] shadow-[0_30px_60px_-15px_rgb(5_25_30/0.7)] ring-1 ring-white/20">
          <Image
            src="/campify/friends-schedules.jpg"
            alt="Campify's friend schedule screen"
            fill
            sizes="(min-width: 1024px) 260px, 45vw"
            priority={priority}
            className="object-cover object-bottom"
          />
        </div>
      </div>
      {/* <span className="absolute bottom-3 left-4 font-mono text-[10px] tracking-[0.2em] text-white/75">iOS · ANDROID · WEB</span> */}
    </div>
  );
}

export function ProjectVisual({ slug, className = "" }: { slug: string; className?: string }) {
  if (slug === "kestrel") return <KestrelVisual className={className} />;
  if (slug === "cosign") return <CosignVisual className={className} />;
  if (slug === "shell") return <ShellVisual className={className} />;
  return <CampifyVisual className={className} />;
}
