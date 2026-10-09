// Server-side read of an event's PUBLIC details, for link previews and page titles.
// Uses the same Firestore client SDK as the app (events are publicly readable by the rules).
// If App Check enforcement blocks server reads, this returns null and callers fall back
// to the site-wide preview.
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import type { EventItem } from "@/types";

export type EventPreview = Pick<
  EventItem,
  "id" | "title" | "description" | "cover" | "coverUrl" | "startsAt" | "endsAt" | "timezone" | "location" | "capacity" | "registeredCount" | "status" | "registrationClosesAt"
>;

const toIso = (v: unknown) => (v instanceof Timestamp ? v.toDate().toISOString() : typeof v === "string" ? v : null);

export async function getEventPreview(id: string): Promise<EventPreview | null> {
  try {
    const snap = await getDoc(doc(firestore(), "events", id));
    if (!snap.exists()) return null;
    const d = snap.data();
    if (d.status === "draft") return null; // drafts aren't public yet
    const endsAt = toIso(d.endsAt)!;
    return {
      id: snap.id,
      title: d.title,
      description: d.description ?? "",
      cover: d.cover ?? "violet",
      coverUrl: d.coverUrl ?? null,
      startsAt: toIso(d.startsAt)!,
      endsAt,
      timezone: d.timezone ?? "UTC",
      location: d.location,
      capacity: d.capacity ?? null,
      registeredCount: d.registeredCount ?? 0,
      status: d.status,
      registrationClosesAt: toIso(d.registrationClosesAt) ?? toIso(d.registrationDeadline) ?? endsAt,
    };
  } catch {
    return null;
  }
}
