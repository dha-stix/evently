"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import { PartyPopper, RotateCcw, ScanLine } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Avatar } from "@/components/ui/avatar";
import { Reveal } from "@/components/motion";
import { SectionEdge } from "@/components/ui/section-edge";
import {
  ConfettiBurst,
  FESTIVE_COLORS,
  seeded,
} from "@/components/illustrations/confetti";

const ROWS = [10, 14, 18, 22, 26, 30]; // 120 seats
const CAPACITY = ROWS.reduce((a, b) => a + b, 0);
const STAGE = { x: 300, y: 34 };
const NAMES = [
  "Ada Okafor",
  "Tolu Bakare",
  "Sam Eze",
  "Kemi Ade",
  "Chidi Nwosu",
  "Zainab Bello",
  "Femi Ojo",
  "Grace Udo",
  "Musa Sani",
  "Ife Lawal",
  "Bola Ade",
  "Ngozi Obi",
];
const FILL_SECONDS = 8;
const FEED_STEP = 8; // a new arrival appears in the feed every 8 seats, so names stay readable

/** Seats arranged in arcs facing the stage; `order` decides when each one fills (roughly front to back). */
function useSeats() {
  return useMemo(() => {
    const r = seeded(5);
    const seats = ROWS.flatMap((count, row) => {
      const radius = 78 + row * 34;
      return Array.from({ length: count }, (_, i) => {
        const angle = (22 + (136 * (i + 0.5)) / count) * (Math.PI / 180);
        return {
          // rounded so server and browser render identical numbers (avoids hydration warnings)
          x: Math.round((STAGE.x + Math.cos(angle) * radius) * 10) / 10,
          y: Math.round((STAGE.y + Math.sin(angle) * radius) * 10) / 10,
          rank: row + r() * 2.2,
          color: FESTIVE_COLORS[Math.floor(r() * FESTIVE_COLORS.length)],
        };
      });
    });
    const sorted = [...seats.keys()].sort(
      (a, b) => seats[a].rank - seats[b].rank,
    );
    return seats.map((s, i) => ({ ...s, order: sorted.indexOf(i) }));
  }, []);
}

export function LiveRoom() {
  const seats = useSeats();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, CAPACITY, {
      duration: FILL_SECONDS,
      ease: [0.3, 0, 0.4, 1],
      onUpdate: (v) => setProgress(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, run]);

  // with "reduce motion" the room is simply shown full
  const filled = reduce && inView ? CAPACITY : progress;
  const full = filled >= CAPACITY;
  // the three most recent arrivals, newest first
  const step = Math.floor(filled / FEED_STEP);
  const feed = Array.from(
    { length: Math.min(3, step) },
    (_, i) => step - i,
  ).map((n) => ({
    n,
    name: NAMES[(n * 7) % NAMES.length],
    code: `EVT-${(n * 7919).toString(36).toUpperCase().padStart(6, "Q").slice(-6)}`,
  }));

  return (
    <section
      id="live"
      className="relative overflow-hidden bg-night-900 text-white"
    >
      <SectionEdge position="top" color="#ffffff" />
      <SectionEdge position="bottom" color="#f5f6f8" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_70%_20%,rgba(110,92,246,0.35),transparent)]"
      />
      <div className="container-page relative flex flex-col gap-12 py-24 sm:py-32 lg:flex-row lg:items-center lg:gap-16">
        <div className="flex flex-col gap-8 lg:w-[38%]">
          <Reveal>
            <SectionHeading
              light
              eyebrow="Event night"
              title="Watch your room fill up, live."
              lead="Every check-in at the door updates your event instantly, so you always know who’s in and how many seats are left."
            />
          </Reveal>
          <Reveal delay={0.1} className="grid grid-cols-3 gap-3">
            {[
              ["Checked in", filled],
              ["Seats left", CAPACITY - filled],
              ["Capacity", CAPACITY],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <p className="text-xs font-semibold text-night-300">{label}</p>
                <p className="font-display text-2xl font-bold tabular-nums sm:text-3xl">
                  {value}
                </p>
              </div>
            ))}
          </Reveal>
        </div>

        <Reveal y={40} className="flex-1">
          <div
            ref={ref}
            className="relative overflow-hidden rounded-[28px] border border-white/10 bg-night-800/80 p-4 shadow-[0_40px_80px_rgba(0,0,0,0.35)] sm:p-6"
          >
            <div className="flex items-center justify-between gap-3 px-1 pb-2">
              <span className="flex items-center gap-2 text-sm font-bold">
                <span className="relative flex size-2.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-[#22C55E] opacity-70 motion-reduce:hidden" />
                  <span className="relative size-2.5 rounded-full bg-[#22C55E]" />
                </span>
                Product Design Meetup · Live
              </span>
              <button
                type="button"
                onClick={() => setRun((n) => n + 1)}
                disabled={!full || !!reduce}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-2.5 py-1.5 text-xs font-bold text-night-300 transition hover:bg-white/10 hover:text-white disabled:opacity-0"
              >
                <RotateCcw className="size-3.5" aria-hidden /> Replay
              </button>
            </div>

            {/* auditorium seat map */}
            <svg
              viewBox="0 0 600 300"
              className="w-full"
              role="img"
              aria-label={`${filled} of ${CAPACITY} seats filled`}
            >
              <defs>
                <linearGradient id="lr-beam" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#B7AEFF" stopOpacity=".35" />
                  <stop offset="1" stopColor="#B7AEFF" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon
                points="285,30 315,30 380,290 220,290"
                fill="url(#lr-beam)"
                opacity={0.25 + (filled / CAPACITY) * 0.5}
              />
              <rect
                x="230"
                y="8"
                width="140"
                height="30"
                rx="10"
                fill="#4F3FE0"
              />
              <text
                x="300"
                y="28"
                textAnchor="middle"
                fill="#fff"
                fontSize="12"
                fontWeight="800"
                letterSpacing="3"
              >
                STAGE
              </text>
              {seats.map((s, i) => {
                const on = s.order < filled;
                return (
                  <motion.circle
                    key={i}
                    cx={s.x}
                    cy={s.y}
                    r={6.5}
                    initial={false}
                    animate={{
                      fill: on ? s.color : "rgba(255,255,255,0.12)",
                      scale: on ? [1.8, 1] : 1,
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    style={{
                      transformBox: "fill-box",
                      transformOrigin: "center",
                    }}
                  />
                );
              })}
            </svg>

            {/* check-in feed */}
            <div
              className="mt-2 flex min-h-[148px] flex-col gap-2"
              aria-live="off"
            >
              <AnimatePresence initial={false} mode="popLayout">
                {full ? (
                  <motion.div
                    key="full"
                    className="relative flex flex-1 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-brand-600 to-[#7B6BFF] p-4 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  >
                    {!reduce && <ConfettiBurst count={36} />}
                    <PartyPopper className="size-6" aria-hidden />
                    <span className="font-display text-xl font-bold">
                      Full house! All {CAPACITY} guests are in.
                    </span>
                  </motion.div>
                ) : (
                  feed.map((f) => (
                    <motion.div
                      key={f.n}
                      layout
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5"
                      initial={{ opacity: 0, y: -16, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.25 }}
                    >
                      <Avatar name={f.name} />
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-sm font-bold">
                          {f.name}
                        </span>
                        <span className="font-mono text-xs text-night-300">
                          {f.code}
                        </span>
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#22C55E]/15 px-2.5 py-1 text-xs font-bold text-[#4ADE80]">
                        <ScanLine className="size-3.5" aria-hidden /> Checked in
                      </span>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
