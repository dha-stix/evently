import { Badge, type BadgeTone } from "@/components/ui/badge";
import { getEventPhase } from "@/lib/utils";
import type { EventItem, EventPhase } from "@/types";

const PHASE: Record<EventPhase, { short: string; long: string; tone: BadgeTone }> = {
  open: { short: "Open", long: "Registration open", tone: "success" },
  closed: { short: "Closed", long: "Registration closed", tone: "neutral" },
  draft: { short: "Draft", long: "Draft", tone: "warning" },
  ended: { short: "Ended", long: "Event ended", tone: "neutral" },
};

type PhaseSource = Pick<EventItem, "status" | "endsAt" | "registrationClosesAt" | "capacity" | "registeredCount">;

/** Shows what the event looks like right now (open, closed, draft or ended). */
export function StatusBadge({ event, long, className }: { event: PhaseSource; long?: boolean; className?: string }) {
  const p = PHASE[getEventPhase(event)];
  return (
    <Badge tone={p.tone} className={className}>
      {long && <span aria-hidden className="size-1.5 rounded-full bg-current" />}
      {long ? p.long : p.short}
    </Badge>
  );
}

export const phaseLabel = (phase: EventPhase) => PHASE[phase].short;
