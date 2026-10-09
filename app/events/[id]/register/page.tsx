import type { Metadata } from "next";
import { RegisterView } from "@/components/register/register-view";
import { getEventPreview } from "@/lib/event-preview";
import { formatWhen } from "@/lib/utils";

/** Per-event title + description, so shared registration links read like an invitation. */
export async function generateMetadata({ params }: PageProps<"/events/[id]/register">): Promise<Metadata> {
  const { id } = await params;
  const event = await getEventPreview(id);
  if (!event) return { title: "Register" };

  const where =
    event.location.type === "online" ? "Online" : [event.location.venue, event.location.city].filter(Boolean).join(", ");
  const description = `Free entry · ${formatWhen(event.startsAt, event.timezone)} · ${where}. Register in under a minute and get your ticket code by email.`;
  const title = `${event.title}: you’re invited`;

  return {
    title: event.title,
    description,
    openGraph: { type: "website", siteName: "Evently", title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function EventRegisterPage({ params }: PageProps<"/events/[id]/register">) {
  const { id } = await params;
  return <RegisterView id={id} />;
}
