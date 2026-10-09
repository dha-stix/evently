"use client";

import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={controls}
      aria-label={open ? "Close menu" : "Open menu"}
      className={cn("inline-flex size-11 items-center justify-center rounded-[10px] border border-line-strong bg-white text-ink", className)}
    >
      {open ? <X className="size-5" /> : <Menu className="size-5" />}
    </button>
  );
}
