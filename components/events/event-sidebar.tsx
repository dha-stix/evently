"use client";

import { Globe, MapPin, Ticket } from "lucide-react";
import { InfoRow } from "@/components/ui/icon-box";
import { Input } from "@/components/ui/field";
import { Button, ButtonLink } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { VenueMap, venueAddress } from "@/components/ui/venue-map";
import { useNow } from "@/hooks/use-now";
import { EventWhen } from "./event-when";
import { cn, formatWhen, getEventPhase } from "@/lib/utils";
import type { EventItem } from "@/types";

export function EventDetailsCard({ event }: { event: EventItem }) {
  const { location } = event;
  return (
    <section className="card flex flex-col gap-4.5 p-5">
      <h2 className="text-lg font-bold">Event details</h2>
      <EventWhen event={event} />
      {location.type === "online" ? (
        <InfoRow icon={Globe} title="Online event" subtitle={<span className="break-all">{location.url}</span>} />
      ) : (
        <>
          <InfoRow icon={MapPin} title={location.venue} subtitle={[location.address, location.city].filter(Boolean).join(", ")} />
          <VenueMap address={venueAddress(location)} />
        </>
      )}
      <InfoRow
        icon={Ticket}
        title="Free entry"
        subtitle={`One ticket per email · Registration closes ${formatWhen(event.registrationClosesAt)}`}
      />
    </section>
  );
}

function LinkField({ label, url }: { label: string; url: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[13px] font-bold text-muted">{label}</p>
      <div className="flex gap-2">
        <Input aria-label={label} value={url} readOnly className="h-10 bg-[#FAFAFB] text-sm" onFocus={(e) => e.target.select()} />
        <CopyButton value={url} iconOnly label={`Copy ${label.toLowerCase()}`} className="h-10 w-10 px-0" />
      </div>
    </div>
  );
}

export function ShareCard({ registrationUrl }: { registrationUrl: string }) {
  return (
    <section className="card flex flex-col gap-3.5 p-5">
      <h2 className="text-lg font-bold">Share</h2>
      <LinkField label="Registration link" url={registrationUrl} />
      <p className="text-[13px] leading-relaxed text-muted">
        Check-in at the venue is only available to you. Use <strong className="text-ink">Open check-in</strong> above
        while signed in.
      </p>
    </section>
  );
}

export function RegistrationControl({
  event,
  onToggle,
  pending,
}: {
  event: EventItem;
  onToggle: () => void;
  pending: boolean;
}) {
  const now = useNow();
  const phase = getEventPhase(event, now);
  const full = event.capacity !== null && event.registeredCount >= event.capacity;
  const deadlinePassed = now >= new Date(event.registrationClosesAt).getTime();
  const editLink = (
    <ButtonLink href={`/events/${event.id}/edit`} variant="secondary" block>
      Edit event
    </ButtonLink>
  );

  let message: string;
  let action: React.ReactNode = null;
  if (phase === "ended") {
    message = "This event has ended. Registration is closed for good. You can still view and export attendees.";
  } else if (event.status === "draft") {
    message = deadlinePassed
      ? "This draft’s dates are in the past. Edit the dates before publishing."
      : "This event is a draft. Publish it to open registration.";
    action = deadlinePassed ? editLink : (
      <Button block loading={pending} onClick={onToggle}>Publish & open registration</Button>
    );
  } else if (deadlinePassed) {
    message = "The registration deadline has passed. Edit the event to extend it.";
    action = editLink;
  } else if (full) {
    message = "The event is full. Raise the attendee limit in Edit event to accept more registrations.";
    action = editLink;
  } else if (event.status === "open") {
    message = "New attendees can register using the public link. Closing stops new sign-ups; existing tickets stay valid.";
    action = (
      <Button variant="danger" block loading={pending} onClick={onToggle}>Close registration</Button>
    );
  } else {
    message = "Registration is closed. Existing attendees can still check in at the venue.";
    action = (
      <Button block loading={pending} onClick={onToggle}>Reopen registration</Button>
    );
  }

  return (
    <section className={cn("card flex flex-col gap-3 p-5", phase === "open" && "border-danger-200/70")}>
      <h2 className="text-lg font-bold">Registration</h2>
      <p className="text-sm leading-relaxed text-muted">{message}</p>
      {action}
    </section>
  );
}
