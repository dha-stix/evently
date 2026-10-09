"use client";

import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";

/** Feature icon that gives a playful wiggle when its card is hovered. */
export function FeatureIcon({ icon: Icon, className }: { icon: LucideIcon; className?: string }) {
  return (
    <motion.span
      className={className}
      whileHover={{ rotate: [0, -12, 10, -6, 0], scale: 1.08 }}
      transition={{ duration: 0.6 }}
    >
      <Icon className="size-6 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.8} aria-hidden />
    </motion.span>
  );
}
