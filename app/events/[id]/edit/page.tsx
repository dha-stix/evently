import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { EditEventView } from "@/components/events/edit-event-view";

export const metadata: Metadata = { title: "Edit event" };

export default async function EditEventPage({ params }: PageProps<"/events/[id]/edit">) {
  const { id } = await params;
  return (
    <AppShell>
      <EditEventView id={id} />
    </AppShell>
  );
}
