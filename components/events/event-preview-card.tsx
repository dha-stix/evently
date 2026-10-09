import { EventCover } from "@/components/ui/event-cover";
import { formatLocation, formatWhen } from "@/lib/utils";
import type { EventItem } from "@/types";

type PreviewEvent = Pick<EventItem, "title" | "cover" | "coverUrl" | "startsAt" | "location" | "capacity">;

export function EventPreviewCard({ event }: { event: PreviewEvent }) {
  const validDate = !Number.isNaN(new Date(event.startsAt).getTime());
  return (
    <div className="card overflow-hidden">
      <EventCover cover={event.cover} coverUrl={event.coverUrl} startsAt={validDate ? event.startsAt : undefined} className="h-36" />
      <div className="flex flex-col gap-2 p-[18px]">
        <h3 className="text-lg font-bold break-words">{event.title || "Your event title"}</h3>
        <p className="text-sm text-muted">{validDate ? formatWhen(event.startsAt) : "Date & time"}</p>
        <p className="text-sm text-muted">{formatLocation(event) || "Venue, City"}</p>
        <p className="text-sm text-muted">{event.capacity !== null ? `${event.capacity} spots` : "Unlimited spots"}</p>
      </div>
    </div>
  );
}
