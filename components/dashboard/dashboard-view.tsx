"use client";

import { useMemo } from "react";
import { Plus } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState, LoadingState } from "@/components/ui/page-states";
import { useAuth } from "@/components/providers/auth-provider";
import { useSubscription } from "@/hooks/use-subscription";
import { subscribeToRecentRegistrations, subscribeToUserEvents } from "@/lib/firebase-actions";
import { computeDashboardStats } from "@/lib/utils";
import { StatsGrid } from "./stats-grid";
import { EventsSection } from "./events-section";
import { RecentRegistrations } from "./recent-registrations";

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

export function DashboardView() {
  const { user } = useAuth();
  const uid = user?.id ?? null;
  const events = useSubscription(subscribeToUserEvents, uid ? [uid] : null);
  const recent = useSubscription(subscribeToRecentRegistrations, uid ? [uid] : null);
  const stats = useMemo(() => (events.data ? computeDashboardStats(events.data) : null), [events.data]);

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl font-bold sm:text-[34px]">
            {greeting()}, {user?.username}
          </h1>
          <p className="text-muted">Here’s how your events are doing.</p>
        </div>
        <ButtonLink href="/events/create" className="hidden sm:inline-flex">
          <Plus className="size-[18px]" aria-hidden /> Create event
        </ButtonLink>
      </div>

      {events.loading && <LoadingState label="Loading your events…" />}
      {events.error && <EmptyState title="Couldn’t load your events" description={events.error.message} />}
      {events.data && stats && (
        <>
          <StatsGrid stats={stats} />
          <EventsSection events={events.data} />
          {/* Recent registrations need the collection-group index in firestore.indexes.json. */}
          {recent.data && <RecentRegistrations items={recent.data} />}
        </>
      )}
    </>
  );
}
