"use client";

import { CalendarX } from "lucide-react";
import { EmptyState, LoadingState } from "@/components/ui/page-states";
import { useSubscription } from "@/hooks/use-subscription";
import { useNow } from "@/hooks/use-now";
import { subscribeToEvent } from "@/lib/firebase-actions";
import { getEventPhase, spotsLeft } from "@/lib/utils";
import { FlowLayout } from "./flow-layout";
import { EventSummary } from "./event-summary";
import { AttendeeForm } from "./attendee-form";

export function RegisterView({ id }: { id: string }) {
  const { data: found, loading, error } = useSubscription(subscribeToEvent, [id]);
  const event = found && found.status !== "draft" ? found : null;
  const now = useNow();
  const phase = event ? getEventPhase(event, now) : null;

  return (
    <FlowLayout step={1}>
      {loading && <LoadingState label="Loading event…" />}
      {!loading && !event && <EmptyState icon={CalendarX} title="Event not found" description={error?.message ?? "Check the link you were given and try again."} />}
      {event && (
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-7">
          <div className="lg:flex-1">
            <EventSummary event={event} />
          </div>
          <div className="lg:flex-1">
            {phase === "open" ? (
              <AttendeeForm event={event} />
            ) : (
              <EmptyState
                icon={CalendarX}
                title={
                  phase === "ended"
                    ? "This event has ended"
                    : spotsLeft(event) === 0
                      ? "This event is full"
                      : "Registration is closed"
                }
                description={
                  phase === "ended"
                    ? "Thanks for your interest. Registration is no longer available."
                    : "The organizer is no longer accepting registrations for this event."
                }
              />
            )}
          </div>
        </div>
      )}
    </FlowLayout>
  );
}
