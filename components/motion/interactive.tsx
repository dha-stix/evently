"use client";

/**
 * Pointer-driven effects: 3D tilt, magnetic buttons, cursor spotlight and a scroll progress bar.
 * Pointer effects only run for mouse/pen (not touch) and switch off with "reduce motion".
 */
import { useEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

const SPRING = { stiffness: 160, damping: 18, mass: 0.6 };

/** Tilts its children in 3D towards the cursor. */
export function Tilt({ children, className, max = 8 }: { children: React.ReactNode; className?: string; max?: number }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(y, [0, 1], [max, -max]), SPRING);
  const rotateY = useSpring(useTransform(x, [0, 1], [-max, max]), SPRING);

  return (
    <motion.div
      className={className}
      style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 1100 }}
      onPointerMove={(e) => {
        if (e.pointerType === "touch") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left) / r.width);
        y.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => {
        x.set(0.5);
        y.set(0.5);
      }}
    >
      {children}
    </motion.div>
  );
}

/** Pulls its child slightly towards the cursor, like a magnet. */
export function Magnetic({ children, className, strength = 0.25 }: { children: React.ReactNode; className?: string; strength?: number }) {
  const reduce = useReducedMotion();
  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);
  return (
    <motion.div
      className={className}
      style={reduce ? undefined : { x, y }}
      onPointerMove={(e) => {
        if (e.pointerType === "touch") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileTap={{ scale: 0.97 }}
    >
      {children}
    </motion.div>
  );
}

/** Tracks the cursor in CSS vars (--mx / --my) so `ev-spotlight` can draw a glow under it. */
export function Spotlight({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn("ev-spotlight", className)}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    >
      {children}
    </div>
  );
}

/** Soft glow that follows the cursor across its parent section (parent must be `relative`). */
export function CursorGlow({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useSpring(-999, { stiffness: 90, damping: 20 });
  const y = useSpring(-999, { stiffness: 90, damping: 20 });

  // Listen on the parent so the glow never blocks clicks on the content above it
  useEffect(() => {
    const parent = ref.current?.parentElement;
    if (!parent || reduce) return;
    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = parent.getBoundingClientRect();
      x.set(e.clientX - r.left);
      y.set(e.clientY - r.top);
    };
    parent.addEventListener("pointermove", move);
    return () => parent.removeEventListener("pointermove", move);
  }, [reduce, x, y]);

  return (
    <div ref={ref} aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {!reduce && (
        <motion.div
          className="absolute size-[560px] -translate-1/2 rounded-full bg-[radial-gradient(circle,rgba(110,92,246,0.2),transparent_62%)]"
          style={{ left: x, top: y }}
        />
      )}
    </div>
  );
}

/** Thin brand-coloured bar at the top of the page showing scroll progress. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26 });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-brand-600 via-[#F472B6] to-[#FB923C]"
      style={{ scaleX }}
    />
  );
}
