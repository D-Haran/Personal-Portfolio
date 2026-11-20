"use client";

import { useEffect, useRef } from "react";

type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Stickers per side: 1, 2 or 3. */
  n: number;
  tile: number;
  gap: number;
  baseRot: number;
  phase: number;
  wobble: number;
  colors: [number, number, number][];
  alpha: number;
  depth: number;
};

/** The six Rubik's cube face colours. */
const FACES: [number, number, number][] = [
  [247, 247, 245], // white
  [196, 30, 58], // red
  [0, 81, 186], // blue
  [255, 88, 0], // orange
  [0, 158, 96], // green
  [255, 213, 0], // yellow
];

/** Sticker clusters: mostly small faces, a few single tiles. */
const SIDES = [1, 1, 2, 2, 3];

/** Rounded square centred on the origin. */
function sticker(ctx: CanvasRenderingContext2D, s: number) {
  const h = s / 2;
  const r = s * 0.24;
  ctx.beginPath();
  ctx.moveTo(-h + r, -h);
  ctx.lineTo(h - r, -h);
  ctx.quadraticCurveTo(h, -h, h, -h + r);
  ctx.lineTo(h, h - r);
  ctx.quadraticCurveTo(h, h, h - r, h);
  ctx.lineTo(-h + r, h);
  ctx.quadraticCurveTo(-h, h, -h, h - r);
  ctx.lineTo(-h, -h + r);
  ctx.quadraticCurveTo(-h, -h, -h + r, -h);
  ctx.closePath();
}

/**
 * Ambient background: fragments of a Rubik's cube face drifting past.
 * Deliberately quiet: low opacity, no connecting lines, no cursor chasing.
 * Pieces stay near square-on (a rotated square reads as a diamond, not a
 * sticker) and only wobble a few degrees. Pauses when the tab is hidden and
 * draws a single still frame under reduced motion.
 */
export function Cubies() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let pieces: Piece[] = [];
    let t = 0;

    // Parallax target, and the eased value that follows it.
    const aim = { x: 0, y: 0 };
    const pan = { x: 0, y: 0 };

    const build = () => {
      // Soft low-opacity shapes don't need full retina density, and a
      // full-viewport canvas at dpr 2 is the single most expensive thing here.
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(18, Math.max(6, Math.round((w * h) / 78000)));
      pieces = Array.from({ length: count }, () => {
        // depth drives size, speed, opacity and parallax together
        const depth = Math.random();
        const n = SIDES[(Math.random() * SIDES.length) | 0];
        const tile = 7 + depth * 5;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.13 * (0.5 + depth),
          vy: (Math.random() - 0.5) * 0.13 * (0.5 + depth) - 0.015,
          n,
          tile,
          gap: tile * 0.26,
          baseRot: (Math.random() - 0.5) * 0.42, // within ~12°
          phase: Math.random() * Math.PI * 2,
          wobble: 0.0016 + Math.random() * 0.0022,
          colors: Array.from(
            { length: n * n },
            () => FACES[(Math.random() * FACES.length) | 0],
          ),
          alpha: 0.055 + depth * 0.05,
          depth,
        };
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of pieces) {
        const span = p.n * p.tile + (p.n - 1) * p.gap;
        const rot = p.baseRot + Math.sin(t * p.wobble + p.phase) * 0.1;
        const a = p.alpha;

        ctx.save();
        ctx.translate(p.x + pan.x * p.depth, p.y + pan.y * p.depth);
        ctx.rotate(rot);
        ctx.lineWidth = 1;

        for (let i = 0; i < p.n; i++) {
          for (let j = 0; j < p.n; j++) {
            const [r, g, b] = p.colors[i * p.n + j];
            ctx.save();
            ctx.translate(
              -span / 2 + p.tile / 2 + i * (p.tile + p.gap),
              -span / 2 + p.tile / 2 + j * (p.tile + p.gap),
            );
            sticker(ctx, p.tile);
            ctx.fillStyle = `rgba(${r},${g},${b},${a.toFixed(3)})`;
            ctx.fill();
            // hairline edge, so it reads as a tile rather than a soft blob
            ctx.strokeStyle = `rgba(${r},${g},${b},${(a * 1.6).toFixed(3)})`;
            ctx.stroke();
            ctx.restore();
          }
        }
        ctx.restore();
      }
    };

    // 30fps: the drift is slow enough that nobody can tell, and it halves the
    // fill cost of a full-viewport canvas.
    const FRAME = 1000 / 30;
    let last = 0;

    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      if (now - last < FRAME) return;
      last = now;

      t += 2;
      pan.x += (aim.x - pan.x) * 0.09;
      pan.y += (aim.y - pan.y) * 0.09;

      for (const p of pieces) {
        // ×2 because this now ticks at 30fps, not 60
        p.x += p.vx * 2;
        p.y += p.vy * 2;
        const m = p.n * (p.tile + p.gap) + 24;
        if (p.x < -m) p.x = w + m;
        else if (p.x > w + m) p.x = -m;
        if (p.y < -m) p.y = h + m;
        else if (p.y > h + m) p.y = -m;
      }
      draw();
    };

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      // at most ~14px of travel across the whole viewport
      aim.x = (e.clientX / w - 0.5) * -28;
      aim.y = (e.clientY / h - 0.5) * -28;
    };
    const onResize = () => build();
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduce) raf = requestAnimationFrame(step);
    };

    build();
    if (reduce) {
      draw();
    } else {
      raf = requestAnimationFrame(step);
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} className="cubies" aria-hidden />;
}
