"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const bar =
  "absolute left-1/2 h-[2px] w-5 -translate-x-1/2 rounded-full bg-current";
const spring = { type: "spring", stiffness: 420, damping: 30 } as const;

/** Hamburger that morphs into an X when the menu is open. */
export function MobileMenuButton({
  open,
  onToggle,
  controls,
  className = "md:hidden",
}: {
  open: boolean;
  onToggle: () => void;
  controls: string;
  className?: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={controls}
      aria-label={open ? "Close menu" : "Open menu"}
      whileTap={{ scale: 0.92 }}
      className={cn(
        "relative inline-flex size-11 items-center justify-center rounded-[10px] border bg-white transition-colors",
        open
          ? "border-brand-200 bg-brand-50 text-brand-700"
          : "border-line-strong text-ink",
        className,
      )}
    >
      <motion.span
        className={bar}
        style={{ top: 15 }}
        animate={open ? { y: 6, rotate: 45 } : { y: 0, rotate: 0 }}
        transition={spring}
      />
      <motion.span
        className={bar}
        style={{ top: 21 }}
        animate={{ opacity: open ? 0 : 1, scaleX: open ? 0.2 : 1 }}
        transition={{ duration: 0.15 }}
      />
      <motion.span
        className={bar}
        style={{ top: 27 }}
        animate={open ? { y: -6, rotate: -45 } : { y: 0, rotate: 0 }}
        transition={spring}
      />
    </motion.button>
  );
}
