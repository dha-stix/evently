"use client";

import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState, LoadingState } from "@/components/ui/page-states";
import { useAuth } from "@/components/providers/auth-provider";
import { useSubscription } from "@/hooks/use-subscription";
import { subscribeToEvent } from "@/lib/firebase-actions";
import { EventForm } from "./event-form";

/** Owner-only edit page: loads the event, then shows the form pre-filled. */
export function EditEventView({ id }: { id: string }) {
  const { user } = useAuth();
  const { data: event, loading, error } = useSubscription(subscribeToEvent, [id]);

  if (loading) return <LoadingState label="Loading event…" />;
  if (!event || event.ownerId !== user?.id) {
    return (
      <EmptyState
        icon={Lock}
        title={event ? "You don’t have access to this event" : "Event not found"}
        description={event ? "Only the organizer who created this event can edit it." : (error?.message ?? "It may have been deleted.")}
        action={<ButtonLink href="/dashboard">Back to dashboard</ButtonLink>}
      />
    );
  }

  return (
    <>
      <div className="flex flex-col gap-2.5">
        <Link href={`/events/${event.id}`} className="inline-flex items-center gap-2 self-start text-sm font-bold text-ink-soft hover:text-ink">
          <ArrowLeft className="size-4" aria-hidden /> Back to event
        </Link>
        <h1 className="text-3xl font-bold sm:text-[34px]">Edit event</h1>
        <p className="text-muted">Update the details below. Registered attendees and their tickets aren’t affected.</p>
      </div>
      {/* `key` resets the form if a different event loads */}
      <EventForm key={event.id} event={event} />
    </>
  );
}
