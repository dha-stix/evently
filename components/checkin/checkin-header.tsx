import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { images } from "@/lib/images";
import { formatLocation, formatShortDate } from "@/lib/utils";
import type { EventItem } from "@/types";

export function CheckInHeader({ event }: { event?: EventItem }) {
  return (
    <header className="bg-night-900 text-white">
      <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link href={event ? `/events/${event.id}` : "/dashboard"} className="flex min-w-0 items-center gap-3">
          <Image src={images.logoMark} alt="Evently" width={34} height={34} className="size-[34px] shrink-0" />
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-[15px] font-extrabold">{event?.title ?? "Event check-in"}</span>
            {event && (
              <span className="truncate text-[13px] text-night-300">
                {formatShortDate(event.startsAt)} · {formatLocation(event)}
              </span>
            )}
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Badge tone="night">Venue check-in</Badge>
          {event && (
            <Link
              href={`/events/${event.id}`}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-bold text-night-300 hover:bg-night-700 hover:text-white"
            >
              <ArrowLeft className="size-4" aria-hidden /> Event
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
