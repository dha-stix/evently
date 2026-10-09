"use client";

/**
 * Small animation building blocks (built on the `motion` library). They respect the visitor's
 * "reduce motion" setting via <MotionConfig reducedMotion="user"> in components/providers.
 */
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useInView, useReducedMotion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Fades and slides children in when they scroll into view. */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span";
}) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 22, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE } },
};

/** Container whose <StaggerItem> children animate in one after another. */
export function Stagger({ children, className, onMount }: { children: React.ReactNode; className?: string; onMount?: boolean }) {
  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      {...(onMount ? { animate: "show" } : { whileInView: "show", viewport: { once: true, amount: 0.15 } })}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}

/**
 * Headline that rises in word by word. Each line can have its own class (e.g. a brand colour).
 * Screen readers get the plain text once.
 */
export function AnimatedHeadline({
  lines,
  className,
  delay = 0,
  as: Tag = "h1",
}: {
  lines: { text: string; className?: string; wordClassName?: string }[];
  className?: string;
  delay?: number;
  as?: "h1" | "h2";
}) {
  let index = 0;
  return (
    <Tag className={className}>
      <span className="sr-only">{lines.map((l) => l.text).join(" ")}</span>
      <span aria-hidden className="block">
        {lines.map((line, li) => (
          <span key={li} className={cn("block", line.className)}>
            {line.text.split(" ").map((word, wi) => {
              const i = index++;
              return (
                <span key={wi} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                  <motion.span
                    className={cn("inline-block", line.wordClassName)}
                    initial={{ y: "105%", rotate: 4 }}
                    animate={{ y: "0%", rotate: 0 }}
                    transition={{ duration: 0.8, delay: delay + i * 0.07, ease: EASE }}
                  >
                    {word}
                    {wi < line.text.split(" ").length - 1 ? " " : ""}
                  </motion.span>
                </span>
              );
            })}
          </span>
        ))}
      </span>
    </Tag>
  );
}

/** Counts up to `value` the first time it scrolls into view. */
export function CountUp({
  value,
  format = (n) => Math.round(n).toLocaleString("en-US"),
  duration = 1.4,
  className,
}: {
  value: number;
  format?: (n: number) => string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const from = useRef(0);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.6 });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const node = ref.current;
    // Live values (e.g. check-ins) count on from the last number instead of restarting at 0
    const controls = animate(from.current, value, {
      duration: reduce ? 0 : duration,
      ease: EASE,
      onUpdate: (v) => {
        node.textContent = format(v);
      },
    });
    from.current = value;
    return () => controls.stop();
  }, [inView, value, duration, format, reduce]);
  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {format(0)}
    </span>
  );
}

/** Cycles through words with a smooth slide (e.g. "meetups → workshops → parties"). */
export function RotatingWords({ words, interval = 2200, className }: { words: string[]; interval?: number; className?: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words.length, interval]);
  return (
    <span className={cn("relative inline-grid overflow-hidden align-bottom", className)}>
      {/* Reserve the width of the longest word so surrounding text doesn't jump */}
      <span aria-hidden className="invisible col-start-1 row-start-1">
        {words.reduce((a, b) => (b.length > a.length ? b : a))}
      </span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[i]}
          className="col-start-1 row-start-1"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
