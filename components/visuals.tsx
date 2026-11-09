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
      <span className="absolute bottom-3 left-4 font-mono text-[10px] tracking-[0.2em] text-white/70">CAUSAL MASK · KV CACHED</span>
    </div>
  );
}

/** Nodes for the RepoGraph card visual — loosely the real fixture graph. */
const G_NODES: [number, number, string][] = [
  [16, 26, "test"],
  [40, 18, ""],
  [64, 30, ""],
  [86, 22, "changed"],
  [28, 56, ""],
  [54, 60, ""],
  [80, 62, ""],
  [18, 84, ""],
  [46, 86, ""],
  [74, 88, ""],
];
const G_EDGES: [number, number, boolean][] = [
  [0, 1, true],
  [1, 2, true],
  [2, 3, true],
  [4, 2, true],
  [4, 5, false],
  [5, 6, false],
  [6, 3, false],
  [7, 8, false],
  [8, 9, false],
  [5, 9, false],
  [0, 4, false],
];

/**
 * RepoGraph: a dependency graph on a pale prism background. The highlighted
 * path flows backward from a changed symbol to the test it affects.
 */
export function RepoGraphVisual({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: "linear-gradient(140deg, #f4f5f8 0%, #dfe3ec 55%, #c9d0de 100%)" }}
    >
      <div
        aria-hidden
        className="absolute -bottom-1/3 -right-1/4 h-[90%] w-[90%] rotate-[-18deg] opacity-70 blur-2xl"
        style={{ background: "conic-gradient(from 200deg, #ff9db0, #ffd98a, #a6f0c2, #8ec5ff, #c7a6ff, #ff9db0)" }}
      />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden>
        {G_EDGES.map(([a, b, hot], k) => {
          const [x1, y1] = G_NODES[a];
          const [x2, y2] = G_NODES[b];
          return (
            <line
              key={k}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={hot ? "#3570e6" : "#1b1d26"}
              strokeOpacity={hot ? 0.9 : 0.22}
              strokeWidth={hot ? 0.7 : 0.45}
              vectorEffect="non-scaling-stroke"
              className={hot ? "flow" : ""}
              style={hot ? { strokeWidth: 2, animationDirection: "reverse" } : { strokeWidth: 1.2 }}
            />
          );
        })}
      </svg>
      {G_NODES.map(([x, y, kind], k) => (
        <span
          key={k}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${x}%`, top: `${y}%` }}
        >
          {kind === "changed" && (
            <span className="pulse-dot absolute inset-0 rounded-full text-[#3570e6]" />
          )}
          <span
            className={`relative block rounded-full ring-4 ${
              kind === "changed"
                ? "size-3.5 bg-[#3570e6] ring-[#3570e6]/20"
                : kind === "test"
                  ? "size-3.5 bg-[#1f9d5c] ring-[#1f9d5c]/20"
                  : "size-2.5 bg-[#1b1d26] ring-[#1b1d26]/10"
            }`}
          />
        </span>
      ))}
      <span className="absolute bottom-3 left-4 font-mono text-[10px] tracking-[0.2em] text-[#1b1d26]/60">IMPACT ← CHANGED SYMBOL</span>
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
            sizes="(min-width: 1024px) 220px, 45vw"
            priority={priority}
            className="object-cover object-bottom"
          />
        </div>
      </div>
      <span className="absolute bottom-3 left-4 font-mono text-[10px] tracking-[0.2em] text-white/75">iOS · ANDROID · WEB</span>
    </div>
  );
}

export function ProjectVisual({ slug, className = "" }: { slug: string; className?: string }) {
  if (slug === "kestrel") return <KestrelVisual className={className} />;
  if (slug === "repograph") return <RepoGraphVisual className={className} />;
  return <CampifyVisual className={className} />;
}
