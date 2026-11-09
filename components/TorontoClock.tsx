"use client";

import { useEffect, useState } from "react";

/** Local time in Toronto, so visitors know whether I'm likely awake. */
export function TorontoClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-CA", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "America/Toronto",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="inline-flex items-center gap-2 font-mono text-xs">
      <span className="size-1.5 rounded-full bg-ok/80" />
      Toronto{time ? ` · ${time}` : ""}
    </span>
  );
}
