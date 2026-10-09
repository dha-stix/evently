import { clsx, type ClassValue } from "clsx";
import type { EventItem, EventPhase } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

/* -------------------------------- Dates & time zones -------------------------------- */
// Dates are stored as exact instants (UTC). Every formatter below shows them in the
// VIEWER's own time zone unless a `timeZone` is passed, and times carry a zone label
// (e.g. "6:00 PM GMT+1") so nobody has to guess.

const fmt = (iso: string, opts: Intl.DateTimeFormatOptions, timeZone?: string) =>
  new Intl.DateTimeFormat("en-US", { ...opts, timeZone }).format(new Date(iso));

export const formatShortDate = (iso: string, timeZone?: string) =>
  fmt(iso, { weekday: "short", month: "short", day: "numeric" }, timeZone);
export const formatLongDate = (iso: string, timeZone?: string) =>
  fmt(iso, { weekday: "long", month: "long", day: "numeric", year: "numeric" }, timeZone);
export const formatMonth = (iso: string) => fmt(iso, { month: "short" }).toUpperCase();
export const formatDay = (iso: string) => fmt(iso, { day: "2-digit" });

/** "6:00 PM GMT+1" */
export const formatTime = (iso: string, timeZone?: string) =>
  fmt(iso, { hour: "numeric", minute: "2-digit", timeZoneName: "short" }, timeZone);

/** Time without the zone label, for the first half of a range. */
const formatClock = (iso: string, timeZone?: string) => fmt(iso, { hour: "numeric", minute: "2-digit" }, timeZone);

/** "Sat, Nov 14 · 6:00 PM GMT+1" */
export function formatWhen(iso: string, timeZone?: string) {
  return `${formatShortDate(iso, timeZone)} · ${formatTime(iso, timeZone)}`;
}

/** "6:00 PM – 9:30 PM GMT+1" (adds the end date when the event spans several days). */
export function formatTimeRange(startIso: string, endIso: string, timeZone?: string) {
  const sameDay = formatShortDate(startIso, timeZone) === formatShortDate(endIso, timeZone);
  const end = sameDay ? formatTime(endIso, timeZone) : `${formatShortDate(endIso, timeZone)}, ${formatTime(endIso, timeZone)}`;
  return `${formatClock(startIso, timeZone)} – ${end}`;
}

export const viewerTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

/** True when the event's local time reads differently from the viewer's local time. */
export function isDifferentTimeZone(iso: string, eventTimeZone: string) {
  try {
    return formatWhen(iso) !== formatWhen(iso, eventTimeZone);
  } catch {
    return false; // unknown zone name
  }
}

const pad = (n: number) => String(n).padStart(2, "0");
/** ISO → "YYYY-MM-DD" in the viewer's zone, for <input type="date">. */
export const toDateInput = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
/** ISO → "HH:mm" in the viewer's zone, for <input type="time">. */
export const toTimeInput = (iso: string) => {
  const d = new Date(iso);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
/** ISO → "YYYY-MM-DDTHH:mm", for <input type="datetime-local">. */
export const toDateTimeInput = (iso: string) => `${toDateInput(iso)}T${toTimeInput(iso)}`;

/**
 * The event's state right now: drafts stay drafts, anything past its end time has ended,
 * and registration is closed when the organizer closed it, the deadline passed or it's full.
 */
export function getEventPhase(
  event: Pick<EventItem, "status" | "endsAt" | "registrationClosesAt" | "capacity" | "registeredCount">,
  now = Date.now(),
): EventPhase {
  if (event.status === "draft") return "draft";
  if (now >= new Date(event.endsAt).getTime()) return "ended";
  const full = event.capacity !== null && event.registeredCount >= event.capacity;
  if (event.status === "closed" || full || now >= new Date(event.registrationClosesAt).getTime()) return "closed";
  return "open";
}

export function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? "s" : ""} ago`;
  const days = Math.round(hrs / 24);
  return days === 1 ? "Yesterday" : `${days} days ago`;
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

export function percent(part: number, total: number | null) {
  if (!total) return 0;
  return Math.min(100, Math.round((part / total) * 100));
}

export function spotsLeft(event: Pick<EventItem, "capacity" | "registeredCount">) {
  return event.capacity === null ? null : Math.max(0, event.capacity - event.registeredCount);
}

export function formatLocation(event: Pick<EventItem, "location">) {
  const { location } = event;
  if (location.type === "online") return "Online event";
  return [location.venue, location.city].filter(Boolean).join(", ");
}

// Characters that are easy to read aloud and type (no 0/O, 1/I).
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** Generates a unique-looking ticket code such as EVT-7K2Q9X. */
export function generateTicketCode(length = 6) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  const body = Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join("");
  return `EVT-${body}`;
}

export function computeDashboardStats(events: EventItem[]) {
  return {
    totalEvents: events.length,
    openEvents: events.filter((e) => getEventPhase(e) === "open").length,
    totalRegistrations: events.reduce((sum, e) => sum + e.registeredCount, 0),
    totalCheckedIn: events.reduce((sum, e) => sum + e.checkedInCount, 0),
  };
}

/** "Lagos Product Design Meetup!" → "lagos-product-design-meetup" (max 50 chars). */
export function slugify(text: string) {
  return (
    text
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "") // strip accents: "café" → "cafe"
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50)
      .replace(/-+$/, "") || "event"
  );
}

const ID_ALPHABET = "abcdefghijkmnpqrstuvwxyz23456789"; // no look-alikes (0/o, 1/l)

/** Readable, URL-safe event id: "<title-slug>-<6 random chars>", e.g. "lagos-product-design-meetup-k7x2qp". */
export function generateEventId(title: string, length = 6) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  const suffix = Array.from(bytes, (b) => ID_ALPHABET[b % ID_ALPHABET.length]).join("");
  return `${slugify(title)}-${suffix}`;
}
