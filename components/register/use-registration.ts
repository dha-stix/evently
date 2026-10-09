"use client";

import { useSubscription } from "@/hooks/use-subscription";
import { subscribeToEvent, subscribeToRegistration } from "@/lib/firebase-actions";

/** Live event + registration for the confirmation page. */
export function useRegistration(eventId: string, ticketCode?: string) {
  const event = useSubscription(subscribeToEvent, [eventId]);
  const record = useSubscription(subscribeToRegistration, ticketCode ? [eventId, ticketCode] : null);
  return {
    event: event.data,
    record: record.data,
    loading: event.loading || record.loading,
    notFound: !ticketCode || (!event.loading && !record.loading && (!event.data || !record.data)),
  };
}
