import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  note,
  icon: Icon,
  children,
  className,
}: {
  label: string;
  value: React.ReactNode;
  note?: React.ReactNode;
  icon?: LucideIcon;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("card flex flex-col gap-2 p-5", className)}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-muted">{label}</span>
        {Icon && (
          <span className="inline-flex size-9 items-center justify-center rounded-[10px] bg-brand-100 text-brand-600">
            <Icon className="size-[18px]" aria-hidden />
          </span>
        )}
      </div>
      <span className="font-display text-3xl font-bold tracking-tight">{value}</span>
      {note && <span className="text-[13px] text-muted">{note}</span>}
      {children}
    </div>
  );
}
