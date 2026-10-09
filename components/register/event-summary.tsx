import { Globe, MapPin, Users } from "lucide-react";
import { EventCover } from "@/components/ui/event-cover";
import { InfoRow } from "@/components/ui/icon-box";
import { Badge } from "@/components/ui/badge";
import { VenueMap, venueAddress } from "@/components/ui/venue-map";
import { EventWhen } from "@/components/events/event-when";
import { formatWhen, spotsLeft } from "@/lib/utils";
import type { EventItem } from "@/types";

export function EventSummary({ event }: { event: EventItem }) {
  const left = spotsLeft(event);
  const { location } = event;
  return (
    <section className="card overflow-hidden rounded-[20px]">
      <EventCover cover={event.cover} coverUrl={event.coverUrl} scrim className="h-48 sm:h-52">
        <div className="mt-auto flex h-full w-full flex-col justify-end gap-2.5 text-white">
          <Badge tone="success" className="self-start">Free entry</Badge>
          <h1 className="text-[clamp(1.6rem,4vw,2rem)] leading-tight font-bold drop-shadow-sm">{event.title}</h1>
        </div>
      </EventCover>
      <div className="flex flex-col gap-4.5 p-5 sm:p-6">
        <EventWhen event={event} />
        {location.type === "online" ? (
          <InfoRow icon={Globe} title="Online event" subtitle="Link shared after registration" />
        ) : (
          <>
            <InfoRow icon={MapPin} title={location.venue} subtitle={[location.address, location.city].filter(Boolean).join(", ")} />
            <VenueMap address={venueAddress(location)} />
          </>
        )}
        <InfoRow
          icon={Users}
          title={left === null ? "Open registration" : `${left} spot${left === 1 ? "" : "s"} left`}
          subtitle={`Registration closes ${formatWhen(event.registrationClosesAt)}`}
        />
        {event.description && (
          <div className="border-t border-line-soft pt-4.5">
            <p className="mb-1.5 font-bold">About this event</p>
            <p className="leading-relaxed whitespace-pre-line text-[#4A5060]">{event.description}</p>
          </div>
        )}
      </div>
    </section>
  );
}
