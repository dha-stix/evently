import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { EventManageView } from "@/components/events/event-manage-view";

export const metadata: Metadata = { title: "Manage event" };

export default async function EventPage({ params }: PageProps<"/events/[id]">) {
  const { id } = await params;
  return (
    <AppShell>
      <EventManageView id={id} />
    </AppShell>
  );
}
