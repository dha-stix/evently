import { StatCard } from "@/components/ui/stat-card";
import { Progress } from "@/components/ui/progress";
import { formatWhen, percent, spotsLeft } from "@/lib/utils";
import type { EventItem } from "@/types";

export function EventStats({ event }: { event: EventItem }) {
  const left = spotsLeft(event);
  return (
    <section aria-label="Event stats" className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      <StatCard
        label="Registered"
        value={
          <>
            {event.registeredCount}
            {event.capacity !== null && <span className="text-lg text-muted"> / {event.capacity}</span>}
          </>
        }
      >
        {event.capacity !== null && <Progress value={percent(event.registeredCount, event.capacity)} className="mt-1" label="Capacity used" />}
      </StatCard>
      <StatCard
        label="Checked in"
        value={event.checkedInCount}
        note={event.registeredCount ? `${percent(event.checkedInCount, event.registeredCount)}% of attendees` : "No attendees yet"}
      />
      <StatCard
        label="Still expected"
        value={Math.max(0, event.registeredCount - event.checkedInCount)}
        note="Registered but not checked in"
      />
      <StatCard
        label="Spots left"
        value={left === null ? "∞" : left}
        note={`Registration closes ${formatWhen(event.registrationClosesAt)}`}
      />
    </section>
  );
}
