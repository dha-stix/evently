"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, Trash2 } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { EmptyState, LoadingState } from "@/components/ui/page-states";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/components/providers/toast-provider";
import { useSubscription } from "@/hooks/use-subscription";
import { deleteEvent, setEventStatus, subscribeToAttendees, subscribeToEvent } from "@/lib/firebase-actions";
import type { EventItem } from "@/types";
import { EventHero } from "./event-hero";
import { EventStats } from "./event-stats";
import { AttendeesTable } from "./attendees-table";
import { EventDetailsCard, RegistrationControl, ShareCard } from "./event-sidebar";

/** Owner-only management page for a single event. */
export function EventManageView({ id }: { id: string }) {
  const { user } = useAuth();
  const eventSub = useSubscription(subscribeToEvent, [id]);
  const event = eventSub.data;
  const isOwner = !!event && event.ownerId === user?.id;

  if (eventSub.loading) return <LoadingState label="Loading event…" />;
  if (!event || !isOwner) {
    return (
      <EmptyState
        icon={Lock}
        title={event ? "You don’t have access to this event" : "Event not found"}
        description={
          event ? "Only the organizer who created this event can manage it." : (eventSub.error?.message ?? "It may have been deleted.")
        }
        action={<ButtonLink href="/dashboard">Back to dashboard</ButtonLink>}
      />
    );
  }
  return <OwnerEventView event={event} />;
}

function OwnerEventView({ event }: { event: EventItem }) {
  const router = useRouter();
  const notify = useToast();
  const attendees = useSubscription(subscribeToAttendees, [event.id]);
  const [pending, setPending] = useState<"status" | "delete" | null>(null);

  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const registrationUrl = `${origin}/events/${event.id}/register`;

  async function toggleRegistration() {
    const next = event.status === "open" ? "closed" : "open";
    setPending("status");
    try {
      await setEventStatus(event.id, next);
      notify({ title: next === "open" ? "Registration is open" : "Registration closed", description: event.title });
    } catch (err) {
      notify({ title: "Couldn’t update registration", description: (err as Error).message, tone: "error" });
    } finally {
      setPending(null);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Delete “${event.title}” and all of its registrations? This can’t be undone.`)) return;
    setPending("delete");
    try {
      await deleteEvent(event.id);
      notify({ title: "Event deleted", description: event.title });
      router.replace("/dashboard");
    } catch (err) {
      notify({ title: "Couldn’t delete event", description: (err as Error).message, tone: "error" });
      setPending(null);
    }
  }

  return (
    <>
      <Link href="/dashboard" className="inline-flex items-center gap-2 self-start text-sm font-bold text-ink-soft hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden /> All events
      </Link>
      <EventHero event={event} registrationUrl={registrationUrl} />
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-col gap-6 lg:flex-1">
          <EventStats event={event} />
          {attendees.loading && <LoadingState label="Loading attendees…" className="card py-16" />}
          {attendees.error && <EmptyState title="Couldn’t load attendees" description={attendees.error.message} />}
          {attendees.data && <AttendeesTable event={event} attendees={attendees.data} />}
        </div>
        <aside className="flex flex-col gap-4 lg:w-[340px] lg:shrink-0">
          <RegistrationControl event={event} onToggle={toggleRegistration} pending={pending === "status"} />
          <EventDetailsCard event={event} />
          <ShareCard registrationUrl={registrationUrl} />
          <Button variant="danger" loading={pending === "delete"} onClick={handleDelete}>
            <Trash2 className="size-4" aria-hidden /> Delete event
          </Button>
        </aside>
      </div>
    </>
  );
}
