"use client";

import { useMemo, useState } from "react";
import { CalendarX, Lock, Search, SearchX } from "lucide-react";
import { Input } from "@/components/ui/field";
import { StatCard } from "@/components/ui/stat-card";
import { CountUp } from "@/components/motion";
import { EmptyState, LoadingState } from "@/components/ui/page-states";
import { ButtonLink } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/components/providers/toast-provider";
import { useSubscription } from "@/hooks/use-subscription";
import { setCheckIn, subscribeToCheckInList, subscribeToEvent } from "@/lib/firebase-actions";
import { formatTime } from "@/lib/utils";
import type { CheckInResult as Result } from "@/types";
import { CheckInHeader } from "./checkin-header";
import { CheckInResult } from "./checkin-result";

const RECENT_LIMIT = 10;

export function CheckInView({ id }: { id: string }) {
  const notify = useToast();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const eventSub = useSubscription(subscribeToEvent, [id]);
  // Only the event's creator may run check-in; the guest list is only loaded for them.
  const isOwner = !!eventSub.data && eventSub.data.ownerId === user?.id;
  const event = isOwner ? eventSub.data : null;
  const list = useSubscription(subscribeToCheckInList, isOwner ? [id] : null);

  // The whole guest list is synced live, so searching is instant and works with patchy venue Wi-Fi.
  const q = query.trim().toLowerCase();
  const results = useMemo(() => {
    const all = list.data ?? [];
    if (!q) return all.slice(0, RECENT_LIMIT);
    return all.filter((a) => a.name.toLowerCase().includes(q) || a.ticketCode.toLowerCase().includes(q));
  }, [list.data, q]);

  async function toggle(attendee: Result, checkedIn: boolean) {
    setPendingId(attendee.id);
    try {
      await setCheckIn(id, attendee.ticketCode, checkedIn);
      notify(
        checkedIn
          ? { title: `${attendee.name} checked in`, description: `Ticket ${attendee.ticketCode}` }
          : { title: "Check-in undone", description: attendee.name },
      );
    } catch (err) {
      notify({ title: "Couldn’t update check-in", description: (err as Error).message, tone: "error" });
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="min-h-dvh bg-canvas">
      <CheckInHeader event={event ?? undefined} />
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 pt-8 pb-16 sm:px-6 sm:pt-10">
        {eventSub.loading && <LoadingState label="Loading event…" />}
        {!eventSub.loading && !eventSub.data && (
          <EmptyState icon={CalendarX} title="Event not found" description={eventSub.error?.message ?? "It may have been deleted."} />
        )}
        {eventSub.data && !isOwner && (
          <EmptyState
            icon={Lock}
            title="Only the organizer can check guests in"
            description="Sign in with the account that created this event to open venue check-in."
            action={<ButtonLink href="/dashboard">Go to your dashboard</ButtonLink>}
          />
        )}
        {event && (
          <>
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold sm:text-[34px]">Find a ticket</h1>
              <p className="text-muted">Search by attendee name or ticket code to confirm a registration.</p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <StatCard label="Checked in" value={<><CountUp value={event.checkedInCount} /> <span className="text-base text-muted">/ {event.registeredCount}</span></>} className="p-4" />
              <StatCard label="Still expected" value={Math.max(0, event.registeredCount - event.checkedInCount)} className="p-4" />
              <StatCard label="Starts at" value={formatTime(event.startsAt)} className="col-span-2 p-4 sm:col-span-1" />
            </div>

            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-4 size-[22px] -translate-y-1/2 text-muted" aria-hidden />
              <Input
                type="search"
                autoFocus
                autoComplete="off"
                aria-label="Search by name or ticket code"
                placeholder="e.g. EVT-7K2Q9X or Tolu Bakare"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-15 rounded-[14px] border-[1.5px] pl-13 text-lg"
              />
            </div>

            <section aria-label="Results" aria-live="polite" className="flex flex-col gap-3">
              <p className="text-sm font-bold text-muted">
                {q ? `${results.length} result${results.length === 1 ? "" : "s"} for “${query.trim()}”` : "Recent registrations"}
              </p>
              {list.loading && <LoadingState label="Loading guest list…" className="py-10" />}
              {list.error && <EmptyState title="Couldn’t load the guest list" description={list.error.message} />}
              {list.data &&
                (results.length ? (
                  <ul className="flex flex-col gap-3">
                    {results.map((a) => (
                      <CheckInResult key={a.id} attendee={a} pending={pendingId === a.id} onToggle={(v) => toggle(a, v)} />
                    ))}
                  </ul>
                ) : (
                  <EmptyState
                    icon={SearchX}
                    title={q ? "No matching ticket" : "No registrations yet"}
                    description={q ? "Check the spelling or ask the attendee for the code in their confirmation email." : undefined}
                  />
                ))}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
