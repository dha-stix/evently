import { AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoadingState({ label = "Loading…", className }: { label?: string; className?: string }) {
  return (
    <div role="status" className={cn("flex items-center justify-center gap-3 py-24 text-muted", className)}>
      <Loader2 className="size-5 animate-spin" aria-hidden />
      <span className="font-semibold">{label}</span>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
  icon: Icon = AlertCircle,
  className,
}: {
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  icon?: React.ElementType;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-3 rounded-2xl border border-dashed border-[#C9CDD6] bg-white px-6 py-12 text-center", className)}>
      <span className="inline-flex size-12 items-center justify-center rounded-full bg-hover text-muted">
        <Icon className="size-6" aria-hidden />
      </span>
      <p className="text-lg font-extrabold">{title}</p>
      {description && <p className="max-w-md text-[15px] text-muted">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
