import { ImageResponse } from "next/og";
import { getEventPreview } from "@/lib/event-preview";
import { EventCard, OG_SIZE, SiteCard, imageDataUri, ogFonts, remoteImageDataUri } from "@/lib/og";

export const alt = "Event invitation: register for free on Evently";
export const size = OG_SIZE;
export const contentType = "image/png";

/** Per-event link preview for /events/[id]/register, the link organizers share. */
export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [event, fonts] = await Promise.all([getEventPreview(id), ogFonts()]);
  if (!event) return new ImageResponse(<SiteCard />, { ...size, fonts });

  const cover =
    (event.coverUrl && (await remoteImageDataUri(event.coverUrl))) || (await imageDataUri(`covers/${event.cover}.svg`));
  return new ImageResponse(<EventCard event={event} cover={cover} />, { ...size, fonts });
}
