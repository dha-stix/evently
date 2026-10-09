"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const FESTIVE_COLORS = ["#4F3FE0", "#7B6BFF", "#2DD4BF", "#FFD84D", "#F472B6", "#FB923C"];

/** Deterministic random numbers, so server and browser render the same confetti. */
export function seeded(seed: number) {
  let s = seed % 2147483647 || 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Gentle, never-ending confetti falling through its container. */
export function ConfettiRain({ count = 26, seed = 7, className }: { count?: number; seed?: number; className?: string }) {
  const pieces = useMemo(() => {
    const r = seeded(seed);
    return Array.from({ length: count }, (_, i) => ({
      x: r() * 400,
      w: 5 + r() * 6,
      h: 8 + r() * 8,
      round: r() > 0.65,
      color: FESTIVE_COLORS[i % FESTIVE_COLORS.length],
      duration: 6 + r() * 6,
      delay: -r() * 12,
    }));
  }, [count, seed]);
  return (
    <svg aria-hidden viewBox="0 0 400 480" preserveAspectRatio="xMidYMin slice" className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}>
      {pieces.map((p, i) =>
        p.round ? (
          <circle key={i} className="ev-fall" cx={p.x} cy={-10} r={p.w / 2} fill={p.color} style={{ animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s` }} />
        ) : (
          <rect key={i} className="ev-fall" x={p.x} y={-14} width={p.w} height={p.h} rx={1.5} fill={p.color} style={{ animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s` }} />
        ),
      )}
    </svg>
  );
}

/** One-off celebratory burst from the centre (e.g. "You're registered!"). */
export function ConfettiBurst({ count = 46, seed = 3, className }: { count?: number; seed?: number; className?: string }) {
  const pieces = useMemo(() => {
    const r = seeded(seed);
    return Array.from({ length: count }, (_, i) => {
      const angle = r() * Math.PI * 2;
      const dist = 120 + r() * 220;
      return {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist * 0.7 - 60,
        fall: 160 + r() * 200,
        rotate: (r() - 0.5) * 720,
        size: 6 + r() * 7,
        round: r() > 0.6,
        color: FESTIVE_COLORS[i % FESTIVE_COLORS.length],
        delay: r() * 0.15,
      };
    });
  }, [count, seed]);
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible", className)}>
      {pieces.map((p, i) => (
        <motion.span
          key={i}
          className="absolute block"
          style={{ width: p.size, height: p.round ? p.size : p.size * 1.6, borderRadius: p.round ? 999 : 2, background: p.color }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.4 }}
          animate={{ x: p.x, y: [0, p.y, p.y + p.fall], opacity: [1, 1, 0], rotate: p.rotate, scale: 1 }}
          transition={{ duration: 2.4, delay: p.delay, ease: [0.16, 1, 0.3, 1], times: [0, 0.35, 1] }}
        />
      ))}
    </div>
  );
}
