"use client";

import { useMemo, useState } from "react";
import { CalendarPlus, Search } from "lucide-react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Input } from "@/components/ui/field";
import { EmptyState } from "@/components/ui/page-states";
import { ButtonLink } from "@/components/ui/button";
import { phaseLabel } from "@/components/events/event-badges";
import { getEventPhase } from "@/lib/utils";
import { useNow } from "@/hooks/use-now";
import type { EventItem, EventPhase } from "@/types";
import { EventCard } from "./event-card";
import { Stagger, StaggerItem } from "@/components/motion";

type Filter = "all" | EventPhase;

export function EventsSection({ events }: { events: EventItem[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  // Phases depend on the clock (e.g. an event ends), so they're worked out at render time.
  const now = useNow();
  const phases = useMemo(() => new Map(events.map((e) => [e.id, getEventPhase(e, now)])), [events, now]);
  const count = (f: Filter) => (f === "all" ? events.length : events.filter((e) => phases.get(e.id) === f).length);
  const options = (["all", "open", "closed", "draft", "ended"] as Filter[])
    .filter((f) => f === "all" || count(f) > 0)
    .map((f) => ({ value: f, label: `${f === "all" ? "All" : phaseLabel(f)} (${count(f)})` }));

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((e) => (filter === "all" || phases.get(e.id) === filter) && (!q || e.title.toLowerCase().includes(q)));
  }, [events, phases, filter, query]);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <h2 className="text-[22px] font-bold">Your events</h2>
          <div className="max-w-full overflow-x-auto">
            <SegmentedControl label="Filter events" value={filter} onChange={setFilter} options={options} />
          </div>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-[18px] -translate-y-1/2 text-subtle" aria-hidden />
          <Input type="search" aria-label="Search events" placeholder="Search events" value={query} onChange={(e) => setQuery(e.target.value)} className="h-11 pl-10" />
        </div>
      </div>

      {visible.length > 0 ? (
        <Stagger key={filter} onMount className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
          {visible.map((e) => (
            <StaggerItem key={e.id} className="flex">
              <EventCard event={e} />
            </StaggerItem>
          ))}
        </Stagger>
      ) : (
        <EmptyState
          icon={CalendarPlus}
          title={events.length ? "No events match" : "No events yet"}
          description={events.length ? "Try a different search or filter." : "Create your first event and share the link to start taking registrations."}
          action={!events.length && <ButtonLink href="/events/create">Create event</ButtonLink>}
        />
      )}
    </section>
  );
}
