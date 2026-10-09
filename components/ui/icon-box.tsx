import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function IconBox({ icon: Icon, className }: { icon: LucideIcon; className?: string }) {
  return (
    <span className={cn("inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-600", className)}>
      <Icon className="size-[19px]" strokeWidth={1.8} aria-hidden />
    </span>
  );
}

/** Icon + title + subtitle row used on event detail and registration pages. */
export function InfoRow({ icon, title, subtitle }: { icon: LucideIcon; title: React.ReactNode; subtitle?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3.5">
      <IconBox icon={icon} />
      <div className="min-w-0">
        <p className="font-bold">{title}</p>
        {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
      </div>
    </div>
  );
}
