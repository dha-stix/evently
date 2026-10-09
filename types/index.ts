// Shared domain types.
//
// Every event is free. Each registration is one attendee with a unique email per event.
//
// Firestore layout:
//   users/{uid}                               → { username, email, createdAt }
//   events/{eventId}                          → EventItem (minus id)
//   events/{eventId}/attendees/{ticketCode}   → AttendeeRecord (public by code: no contact details)
//   events/{eventId}/contacts/{ticketCode}    → AttendeeContact (organizer only)
//   events/{eventId}/registrations/{emailKey} → RegistrationEntry (one per email: blocks duplicates)

export type EventStatus = "open" | "closed" | "draft";
export type LocationType = "in_person" | "online";
export type CoverKey = "violet" | "teal" | "amber" | "night" | "rose" | "slate";

export interface EventLocation {
  type: LocationType;
  venue?: string;
  address?: string;
  city?: string;
  url?: string;
}

export interface EventItem {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  category: string;
  cover: CoverKey;
  coverUrl: string | null; // uploaded image in Firebase Storage (overrides `cover`)
  // Instants in time. Stored as Firestore Timestamps; converted to ISO strings (UTC) for the UI,
  // then shown in each viewer's own time zone.
  startsAt: string;
  endsAt: string;
  timezone: string; // organizer's IANA zone, e.g. "Africa/Lagos", shown as the event's local time
  location: EventLocation;
  capacity: number | null; // attendee limit; null = unlimited
  registrationDeadline: string | null;
  /** When registration closes: the deadline if set, otherwise when the event ends. Enforced by rules. */
  registrationClosesAt: string;
  autoCloseWhenFull: boolean;
  status: EventStatus;
  registeredCount: number;
  checkedInCount: number;
  formFields: AttendeeFormField[];
  createdAt: string;
}

export type AttendeeFormField = "name" | "email" | "phone" | "company";

/** Full attendee as the organizer sees it (record + contact details merged). */
export interface Attendee {
  id: string; // same as ticketCode
  eventId: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  ticketCode: string;
  registeredAt: string;
  checkedInAt: string | null;
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface DashboardStats {
  totalEvents: number;
  openEvents: number;
  totalRegistrations: number;
  totalCheckedIn: number;
}

/** Fields the organizer fills in on the create/edit form. */
export type EventFormInput = Omit<
  EventItem,
  "id" | "ownerId" | "coverUrl" | "status" | "registeredCount" | "checkedInCount" | "createdAt" | "registrationClosesAt"
>;

/** Payload sent from the create-event form. */
export type CreateEventInput = EventFormInput & { publish: boolean };

/**
 * What the event looks like to people right now, combining the stored status with the clock:
 * draft, open, closed (manually, full or past the deadline) or ended.
 */
export type EventPhase = "draft" | "open" | "closed" | "ended";

/** Payload sent from the attendee registration form. */
export interface RegistrationInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
}

export type AttendeeContact = Pick<Attendee, "email" | "phone" | "company">;

/** Public attendee document. Contact details live in the private `contacts` subcollection. */
export type AttendeeRecord = Omit<Attendee, keyof AttendeeContact> & {
  ownerId: string;
  eventTitle: string;
  emailKey: string; // sha256("eventId:email"), links to events/{eventId}/registrations/{emailKey}
};

/**
 * One per email per event, so an email can't register twice.
 * Holds no personal data: the id is a hash of the email, `ticketHash` a hash of the ticket code.
 */
export interface RegistrationEntry {
  ticketHash: string;
  createdAt: string;
}

export type RecentRegistration = AttendeeRecord;

/** Public ticket lookup result (no email/phone exposed). */
export interface TicketLookup {
  name: string;
  ticketCode: string;
  checkedInAt: string | null;
  event: Pick<EventItem, "id" | "title" | "startsAt" | "location">;
}

/** Fields shown on the venue check-in page. */
export type CheckInResult = Pick<Attendee, "id" | "name" | "ticketCode" | "checkedInAt">;
