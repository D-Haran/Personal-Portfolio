import { Reveal } from "../Reveal";

type Group = {
  label: string;
  unit: string;
  better: "higher" | "lower";
  values: { name: string; value: number; color: string }[];
};

/** Horizontal grouped bars that grow in when scrolled into view. */
export function Bars({ groups, caption }: { groups: Group[]; caption?: string }) {
  return (
    <Reveal className="card p-6 sm:p-8">
      <div className="mb-6 flex flex-wrap items-center gap-5 text-sm text-muted">
        {groups[0].values.map((v) => (
          <span key={v.name} className="inline-flex items-center gap-2">
            <span className="size-2.5 rounded-sm" style={{ background: v.color }} />
            {v.name}
          </span>
        ))}
      </div>
      <div className="space-y-8">
        {groups.map((g, gi) => {
          const max = Math.max(...g.values.map((v) => v.value));
          return (
            <div key={g.label}>
              <p className="flex items-baseline justify-between text-sm">
                <span className="text-fg">{g.label}</span>
                <span className="font-mono text-xs text-faint">{g.better} is better</span>
              </p>
              <div className="mt-3 space-y-2">
                {g.values.map((v, vi) => (
                  <div key={v.name} className="grid grid-cols-[1fr_6.5rem] items-center gap-3">
                    <div className="h-7 overflow-hidden rounded-lg bg-white/[0.04]">
                      <div
                        className="bar-grow h-full rounded-lg"
                        style={{
                          width: `${(v.value / max) * 100}%`,
                          background: v.color,
                          ["--d" as string]: `${gi * 160 + vi * 90}ms`,
                        }}
                      />
                    </div>
                    <span className="font-mono text-sm tabular-nums text-fg">
                      {v.value.toLocaleString("en-US")}
                      <span className="ml-1 text-xs text-faint">{g.unit}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {caption && <p className="mt-7 border-t border-line pt-5 text-sm leading-relaxed text-faint">{caption}</p>}
    </Reveal>
  );
}
