import type { Metadata } from "next";
import { CheckInView } from "@/components/checkin/checkin-view";
import { RequireAuth } from "@/components/layout/require-auth";

export const metadata: Metadata = { title: "Check-in" };

export default async function EventSearchPage({ params }: PageProps<"/events/[id]/search">) {
  const { id } = await params;
  // Organizer-only: signed-out visitors are sent to /auth/login and returned here afterwards.
  return (
    <RequireAuth>
      <CheckInView id={id} />
    </RequireAuth>
  );
}
