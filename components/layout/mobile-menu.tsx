"use client";

import { Children, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Dropdown menu for small screens (place inside a sticky header). Slides open, staggers its
 * children in, dims the page behind it, and closes on Escape or a tap outside.
 */
export function MobileMenu({
  open,
  onClose,
  id,
  label,
  className,
  children,
}: {
  open: boolean;
  onClose: () => void;
  id: string;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence initial={false}>
      {open && (
        <>
          <motion.nav
            key="menu"
            id={id}
            aria-label={label}
            className={cn(
              "overflow-hidden border-t border-line-soft",
              className,
            )}
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: { duration: 0.35, ease: EASE },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: { duration: 0.25, ease: EASE },
            }}
          >
            <motion.div
              className="container-page flex flex-col gap-1 pt-2 pb-5"
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={{
                show: {
                  transition: { staggerChildren: 0.05, delayChildren: 0.08 },
                },
              }}
            >
              {Children.map(children, (child) =>
                child ? (
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: -8 },
                      show: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.3, ease: EASE },
                      },
                    }}
                  >
                    {child}
                  </motion.div>
                ) : null,
              )}
            </motion.div>
          </motion.nav>
          {/* dims the page; tap to close */}
          <motion.div
            key="backdrop"
            aria-hidden
            onClick={onClose}
            className="absolute inset-x-0 top-full h-dvh bg-night-900/30 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
        </>
      )}
    </AnimatePresence>
  );
}
