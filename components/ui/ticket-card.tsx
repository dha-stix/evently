import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/** Visual "admit one" ticket used on auth, homepage and confirmation screens. */
export function TicketCard({
  title,
  meta,
  code,
  attendee,
  status = "Confirmed",
  footer,
  actions,
  className,
}: {
  title: string;
  meta: React.ReactNode;
  code: string;
  attendee?: string;
  status?: React.ReactNode;
  footer?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-[20px] border border-line bg-white text-ink shadow-[0_30px_60px_rgba(30,26,77,0.12)]", className)}>
      <div className="flex flex-col gap-1.5 bg-night-800 p-5 text-white sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-extrabold tracking-[0.08em] text-night-300">ADMIT ONE</span>
          {status && <Badge tone="success">{status}</Badge>}
        </div>
        <h3 className="text-xl font-bold sm:text-2xl">{title}</h3>
        <p className="text-sm text-night-300">{meta}</p>
      </div>
      {attendee && (
        <div className="flex items-center justify-between px-5 pt-5 sm:px-6">
          <span className="text-sm font-semibold text-muted">Attendee</span>
          <span className="font-bold">{attendee}</span>
        </div>
      )}
      <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t-2 border-dashed border-line px-5 py-5 sm:px-6">
        <div>
          <p className="text-xs font-extrabold tracking-[0.08em] text-muted">TICKET CODE</p>
          <p className="mt-1 font-mono text-[clamp(1.5rem,5vw,2.1rem)] font-semibold tracking-[0.08em]">{code}</p>
        </div>
        {actions}
      </div>
      {footer && <div className="px-5 pb-5 text-sm text-muted sm:px-6">{footer}</div>}
    </div>
  );
}
