import Link from "next/link";
import { Clock, MapPin } from "lucide-react";
import { EventCover } from "@/components/ui/event-cover";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/events/event-badges";
import { formatLocation, formatWhen, percent } from "@/lib/utils";
import type { EventItem } from "@/types";

export function EventCard({ event }: { event: EventItem }) {
  const pct = percent(event.registeredCount, event.capacity);
  return (
    <Link
      href={`/events/${event.id}`}
      className="card group flex w-full flex-col overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(17,19,24,0.08)]"
    >
      <EventCover cover={event.cover} coverUrl={event.coverUrl} startsAt={event.startsAt} className="h-32">
        <StatusBadge event={event} className="bg-white/95" />
      </EventCover>
      <div className="flex flex-1 flex-col gap-3 p-[18px]">
        <h3 className="text-lg leading-snug font-bold group-hover:text-brand-700">{event.title}</h3>
        <div className="flex flex-col gap-1.5 text-sm text-muted">
          <span className="flex items-center gap-2">
            <Clock className="size-4 shrink-0" aria-hidden /> {formatWhen(event.startsAt)}
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0" aria-hidden />
            <span className="truncate">{formatLocation(event)}</span>
          </span>
        </div>
        <div className="mt-auto flex flex-col gap-2 pt-1.5">
          <div className="flex justify-between text-[13px]">
            <span className="text-muted">Registrations</span>
            <span className="font-bold">
              {event.registeredCount}
              {event.capacity !== null && ` / ${event.capacity}`}
            </span>
          </div>
          <Progress value={event.capacity ? pct : 100} label={`${event.title} registrations`} />
        </div>
      </div>
    </Link>
  );
}
