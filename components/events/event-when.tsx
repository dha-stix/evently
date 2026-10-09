"use client";

import { CalendarDays } from "lucide-react";
import { InfoRow } from "@/components/ui/icon-box";
import { formatLongDate, formatTimeRange, formatWhen, isDifferentTimeZone } from "@/lib/utils";
import type { EventItem } from "@/types";

/**
 * Event date + time in the VIEWER's time zone (with a zone label). If the viewer is somewhere
 * else, it also shows the time at the event, e.g. "Event local time: Sat, Nov 14 · 6:00 PM GMT+1".
 */
export function EventWhen({ event }: { event: Pick<EventItem, "startsAt" | "endsAt" | "timezone"> }) {
  const showLocal = isDifferentTimeZone(event.startsAt, event.timezone);
  return (
    <InfoRow
      icon={CalendarDays}
      title={formatLongDate(event.startsAt)}
      subtitle={
        <>
          {formatTimeRange(event.startsAt, event.endsAt)}
          {showLocal && (
            <span className="mt-1 block text-[13px]">
              Event local time: {formatWhen(event.startsAt, event.timezone)}
            </span>
          )}
        </>
      }
    />
  );
}
