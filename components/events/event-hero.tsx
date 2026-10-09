import { Pencil, ScanLine } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";
import type { EventItem } from "@/types";
import { StatusBadge } from "./event-badges";

export function EventHero({ event, registrationUrl }: { event: EventItem; registrationUrl: string }) {
  return (
    <section className="flex flex-col gap-6 rounded-[20px] bg-night-800 p-6 text-white sm:p-8 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex min-w-0 flex-col gap-3.5">
        <div className="flex flex-wrap gap-2">
          <StatusBadge event={event} long />
          <Badge tone="night">{event.category}</Badge>
        </div>
        <h1 className="text-[clamp(1.9rem,4.5vw,2.75rem)] leading-[1.08] font-bold">{event.title}</h1>
        {event.description && <p className="max-w-2xl leading-relaxed text-night-300">{event.description}</p>}
      </div>
      <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap lg:flex-nowrap">
        <ButtonLink href={`/events/${event.id}/edit`} variant="outline-light">
          <Pencil className="size-[17px]" aria-hidden /> Edit event
        </ButtonLink>
        <CopyButton value={registrationUrl} label="Copy registration link" variant="outline-light" />
        <ButtonLink href={`/events/${event.id}/search`} variant="white">
          <ScanLine className="size-[18px]" aria-hidden /> Open check-in
        </ButtonLink>
      </div>
    </section>
  );
}
