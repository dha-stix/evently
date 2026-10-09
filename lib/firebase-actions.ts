/**
 * Every Firebase call the app makes lives in this file (Auth, Firestore, Storage + EmailJS).
 *
 * Components never import the Firebase SDK directly. They call these functions, which:
 *  - return a Promise and throw an Error with a user-friendly message, or
 *  - take (onData, onError) callbacks for live data and return an unsubscribe function.
 *
 * Dates are stored as Firestore Timestamps (exact instants) and handed to the UI as ISO strings,
 * which the formatters in lib/utils.ts show in each viewer's own time zone.
 *
 * Deploy firestore.rules, storage.rules and firestore.indexes.json from the project root
 * so the security rules and indexes these queries rely on are in place.
 */
import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
  type DocumentReference,
  type DocumentSnapshot,
} from "firebase/firestore";
import { deleteObject, getDownloadURL, ref as storageRef, uploadString } from "firebase/storage";
import emailjs from "@emailjs/browser";
import { auth, firestore, storage } from "@/lib/firebase";
import { formatLocation, formatWhen, generateEventId, generateTicketCode, getEventPhase } from "@/lib/utils";
import type {
  Attendee,
  AttendeeContact,
  AttendeeRecord,
  CheckInResult,
  CreateEventInput,
  EventFormInput,
  EventItem,
  EventStatus,
  RegistrationInput,
  TicketLookup,
  User,
} from "@/types";

export type Unsubscribe = () => void;
type OnData<T> = (data: T) => void;
type OnError = (error: Error) => void;

/* ================================ Errors ================================= */

const FRIENDLY_ERRORS: Record<string, string> = {
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/wrong-password": "Incorrect email or password.",
  "auth/user-not-found": "Incorrect email or password.",
  "auth/email-already-in-use": "An account with this email already exists.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/weak-password": "Password must be at least 6 characters.",
  "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
  "auth/network-request-failed": "Network error. Check your connection and try again.",
  "permission-denied": "You don’t have permission to do that.",
  unavailable: "Can’t reach the server. Check your connection and try again.",
  "storage/unauthorized": "You don’t have permission to change this event’s cover image.",
  "appCheck/recaptcha-error": "We couldn’t verify you’re human. Refresh the page and try again.",
};

export function toFriendlyError(error: unknown): Error {
  if (error instanceof FirebaseError) {
    console.error(error);
    return new Error(FRIENDLY_ERRORS[error.code] ?? "Something went wrong. Please try again.");
  }
  return error instanceof Error ? error : new Error("Something went wrong. Please try again.");
}

/** Runs an async Firebase call and rethrows errors with a readable message. */
async function run<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    throw toFriendlyError(error);
  }
}

/* ============================== References =============================== */

const eventsCol = () => collection(firestore(), "events");
const eventRef = (eventId: string) => doc(firestore(), "events", eventId);
const attendeesCol = (eventId: string) => collection(firestore(), "events", eventId, "attendees");
const attendeeRef = (eventId: string, code: string) => doc(firestore(), "events", eventId, "attendees", code);
const contactsCol = (eventId: string) => collection(firestore(), "events", eventId, "contacts");
const contactRef = (eventId: string, code: string) => doc(firestore(), "events", eventId, "contacts", code);
const registrationsCol = (eventId: string) => collection(firestore(), "events", eventId, "registrations");
const registrationRef = (eventId: string, emailKey: string) =>
  doc(firestore(), "events", eventId, "registrations", emailKey);
const coverRef = (eventId: string) => storageRef(storage(), `events/${eventId}/cover`);

async function sha256Hex(text: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Stable, non-reversible key for "this email at this event" (emails are compared case-insensitively). */
const emailKeyFor = (eventId: string, email: string) => sha256Hex(`${eventId}:${email.trim().toLowerCase()}`);

export const DUPLICATE_EMAIL_ERROR =
  "This email is already registered for this event. Check your inbox for your ticket code.";

/* ======================= Timestamp <-> ISO conversion ===================== */

/** Firestore Timestamp (or an older ISO string) → ISO string. */
const toIso = (value: unknown): string | null =>
  value instanceof Timestamp ? value.toDate().toISOString() : typeof value === "string" ? value : null;

const toTimestamp = (iso: string) => Timestamp.fromDate(new Date(iso));

/** Reads a document, using the local estimate for server timestamps that are still being written. */
const readData = (snap: DocumentSnapshot) => snap.data({ serverTimestamps: "estimate" }) as Record<string, unknown>;

function toEvent(snap: DocumentSnapshot): EventItem {
  const d = readData(snap);
  const endsAt = toIso(d.endsAt)!;
  const registrationDeadline = toIso(d.registrationDeadline);
  return {
    ...(d as Omit<EventItem, "id">),
    id: snap.id,
    startsAt: toIso(d.startsAt)!,
    endsAt,
    registrationDeadline,
    registrationClosesAt: toIso(d.registrationClosesAt) ?? registrationDeadline ?? endsAt,
    createdAt: toIso(d.createdAt) ?? new Date().toISOString(),
  };
}

function toRecord(snap: DocumentSnapshot): AttendeeRecord {
  const d = readData(snap);
  return {
    ...(d as AttendeeRecord),
    registeredAt: toIso(d.registeredAt) ?? new Date().toISOString(),
    checkedInAt: toIso(d.checkedInAt),
  };
}

/** Form values → Firestore fields. Registration closes at the deadline, or when the event ends. */
function eventFields(input: EventFormInput) {
  const closesAt =
    input.registrationDeadline && new Date(input.registrationDeadline) < new Date(input.endsAt)
      ? input.registrationDeadline
      : input.endsAt;
  return {
    ...input,
    startsAt: toTimestamp(input.startsAt),
    endsAt: toTimestamp(input.endsAt),
    registrationDeadline: input.registrationDeadline ? toTimestamp(input.registrationDeadline) : null,
    registrationClosesAt: toTimestamp(closesAt),
  };
}

const byNewest = <T extends { registeredAt: string }>(a: T, b: T) => b.registeredAt.localeCompare(a.registeredAt);

const BATCH_LIMIT = 450; // Firestore allows 500 writes per batch

/** Applies `write` to each ref in batches that stay under Firestore's limit. */
async function inBatches(refs: DocumentReference[], write: (batch: ReturnType<typeof writeBatch>, ref: DocumentReference) => void) {
  for (let i = 0; i < refs.length; i += BATCH_LIMIT) {
    const batch = writeBatch(firestore());
    refs.slice(i, i + BATCH_LIMIT).forEach((ref) => write(batch, ref));
    await batch.commit();
  }
}

/* ================================= Auth ================================== */

const toUser = (u: { uid: string; email: string | null; displayName: string | null }): User => ({
  id: u.uid,
  email: u.email ?? "",
  username: u.displayName ?? u.email?.split("@")[0] ?? "organizer",
});

export function subscribeToAuth(onChange: OnData<User | null>): Unsubscribe {
  return onAuthStateChanged(auth(), (u) => onChange(u ? toUser(u) : null));
}

export const registerUser = (username: string, email: string, password: string) =>
  run(async () => {
    const { user } = await createUserWithEmailAndPassword(auth(), email, password);
    await updateProfile(user, { displayName: username });
    await setDoc(doc(firestore(), "users", user.uid), { username, email, createdAt: serverTimestamp() });
    return toUser({ uid: user.uid, email, displayName: username });
  });

export const loginUser = (email: string, password: string) =>
  run(async () => toUser((await signInWithEmailAndPassword(auth(), email, password)).user));

export const logoutUser = () => run(() => signOut(auth()));

/**
 * Emails a password-reset link. Always resolves for unknown emails too, so the form
 * can't be used to discover which addresses have accounts.
 */
export const sendPasswordReset = (email: string) =>
  run(async () => {
    try {
      await sendPasswordResetEmail(auth(), email.trim(), { url: `${window.location.origin}/auth/login` });
    } catch (error) {
      if (error instanceof FirebaseError && error.code === "auth/user-not-found") return;
      throw error;
    }
  });

/* ================================ Events ================================= */

/** Removes the event's uploaded cover from Storage. Succeeds if there was no upload. */
async function deleteCoverImage(eventId: string) {
  try {
    await deleteObject(coverRef(eventId));
  } catch (error) {
    if (error instanceof FirebaseError && error.code === "storage/object-not-found") return; // preset cover
    throw error;
  }
}

/** Uploads a cover (data URL) and returns its download URL. Replaces any previous upload. */
async function uploadCoverImage(eventId: string, dataUrl: string) {
  await uploadString(coverRef(eventId), dataUrl, "data_url");
  return getDownloadURL(coverRef(eventId));
}

/** Creates an event. `coverImage` is an optional data URL uploaded to Storage. Returns the new id. */
export const createEvent = (ownerId: string, input: CreateEventInput, coverImage?: string | null) =>
  run(async () => {
    const { publish, ...form } = input;
    // Readable id from the title plus a random suffix, so events with the same name never collide.
    let ref = eventRef(generateEventId(form.title));
    while ((await getDoc(ref)).exists()) ref = eventRef(generateEventId(form.title));

    await setDoc(ref, {
      ...eventFields(form),
      ownerId,
      coverUrl: null,
      status: publish ? "open" : "draft",
      registeredCount: 0,
      checkedInCount: 0,
      createdAt: serverTimestamp(),
    });
    if (coverImage) await updateDoc(ref, { coverUrl: await uploadCoverImage(ref.id, coverImage) });
    return ref.id;
  });

/**
 * Saves edits to an event. Registrations, counts and status are kept.
 * `cover.image` (data URL) uploads a new cover; `cover.removeUploaded` goes back to the preset.
 */
export const updateEvent = (
  eventId: string,
  input: EventFormInput,
  cover: { image?: string | null; removeUploaded?: boolean } = {},
) =>
  run(async () => {
    const snap = await getDoc(eventRef(eventId));
    if (!snap.exists()) throw new Error("This event no longer exists.");
    const current = toEvent(snap);
    if (input.capacity !== null && input.capacity < current.registeredCount) {
      throw new Error(`${current.registeredCount} people are already registered, so the limit can’t be lower than that.`);
    }

    let coverUrl = current.coverUrl;
    if (cover.image) coverUrl = await uploadCoverImage(eventId, cover.image);
    else if (cover.removeUploaded && current.coverUrl) {
      await deleteCoverImage(eventId);
      coverUrl = null;
    }

    await updateDoc(eventRef(eventId), { ...eventFields(input), coverUrl });

    // Attendee records keep a copy of the title for the dashboard; keep it in sync.
    if (input.title !== current.title) {
      const attendees = await getDocs(attendeesCol(eventId));
      await inBatches(attendees.docs.map((d) => d.ref), (batch, ref) => batch.update(ref, { eventTitle: input.title }));
    }
  });

/** Live list of the organizer's events, newest event date first. */
export function subscribeToUserEvents(ownerId: string, onData: OnData<EventItem[]>, onError: OnError): Unsubscribe {
  return onSnapshot(
    query(eventsCol(), where("ownerId", "==", ownerId)),
    (snap) => onData(snap.docs.map(toEvent).sort((a, b) => b.startsAt.localeCompare(a.startsAt))),
    (error) => onError(toFriendlyError(error)),
  );
}

/** Live single event (null if it doesn't exist). */
export function subscribeToEvent(eventId: string, onData: OnData<EventItem | null>, onError: OnError): Unsubscribe {
  return onSnapshot(
    eventRef(eventId),
    (snap) => onData(snap.exists() ? toEvent(snap) : null),
    (error) => onError(toFriendlyError(error)),
  );
}

/** Opens, closes or publishes registration. */
export const setEventStatus = (eventId: string, status: EventStatus) =>
  run(() => updateDoc(eventRef(eventId), { status }));

/**
 * Deletes an event with its cover image, attendees, contacts and email entries.
 * The cover goes first: the Storage rule checks event ownership in Firestore, so it
 * must run while the event document still exists (otherwise the image would be orphaned).
 */
export const deleteEvent = (eventId: string) =>
  run(async () => {
    await deleteCoverImage(eventId);

    const [attendees, contacts, registrations] = await Promise.all([
      getDocs(attendeesCol(eventId)),
      getDocs(contactsCol(eventId)),
      getDocs(registrationsCol(eventId)),
    ]);
    const refs = [...attendees.docs, ...contacts.docs, ...registrations.docs].map((d) => d.ref);
    await inBatches(refs, (batch, ref) => batch.delete(ref));
    // The event document goes last, because the subcollection rules check its owner.
    await writeBatch(firestore()).delete(eventRef(eventId)).commit();
  });

/* =============================== Attendees =============================== */

/** Organizer view: live attendee list merged with private contact details. */
export function subscribeToAttendees(eventId: string, onData: OnData<Attendee[]>, onError: OnError): Unsubscribe {
  let records: AttendeeRecord[] | null = null;
  let contacts: Map<string, AttendeeContact> | null = null;

  const emit = () => {
    if (!records || !contacts) return;
    const merged = records
      .map((r): Attendee => ({
        id: r.id,
        eventId: r.eventId,
        name: r.name,
        ticketCode: r.ticketCode,
        registeredAt: r.registeredAt,
        checkedInAt: r.checkedInAt,
        email: "",
        ...contacts!.get(r.id),
      }))
      .sort(byNewest);
    onData(merged);
  };
  const fail = (error: unknown) => onError(toFriendlyError(error));

  const stopRecords = onSnapshot(attendeesCol(eventId), (snap) => {
    records = snap.docs.map(toRecord);
    emit();
  }, fail);
  const stopContacts = onSnapshot(contactsCol(eventId), (snap) => {
    contacts = new Map(snap.docs.map((d) => [d.id, d.data() as AttendeeContact]));
    emit();
  }, fail);

  return () => {
    stopRecords();
    stopContacts();
  };
}

/** Venue check-in (event owner only): live list of attendees. */
export function subscribeToCheckInList(eventId: string, onData: OnData<CheckInResult[]>, onError: OnError): Unsubscribe {
  return onSnapshot(
    attendeesCol(eventId),
    (snap) =>
      onData(
        snap.docs
          .map(toRecord)
          .sort(byNewest)
          .map(({ id, name, ticketCode, checkedInAt }) => ({ id, name, ticketCode, checkedInAt })),
      ),
    (error) => onError(toFriendlyError(error)),
  );
}

/** Latest registrations across all of an organizer's events (needs the index in firestore.indexes.json). */
export function subscribeToRecentRegistrations(
  ownerId: string,
  onData: OnData<AttendeeRecord[]>,
  onError: OnError,
): Unsubscribe {
  return onSnapshot(
    query(collectionGroup(firestore(), "attendees"), where("ownerId", "==", ownerId), orderBy("registeredAt", "desc"), limit(5)),
    (snap) => onData(snap.docs.map(toRecord)),
    (error) => onError(toFriendlyError(error)),
  );
}

/** Live single registration, used by the confirmation page. */
export function subscribeToRegistration(
  eventId: string,
  ticketCode: string,
  onData: OnData<AttendeeRecord | null>,
  onError: OnError,
): Unsubscribe {
  return onSnapshot(
    attendeeRef(eventId, ticketCode),
    (snap) => onData(snap.exists() ? toRecord(snap) : null),
    (error) => onError(toFriendlyError(error)),
  );
}

/**
 * Registers one attendee. Runs in a transaction so the event can't be overfilled, the same
 * email can't register twice, and nobody can register after registration closes.
 */
export const registerAttendee = (eventId: string, input: RegistrationInput) =>
  run(async () => {
    const emailKey = await emailKeyFor(eventId, input.email);
    const result = await runTransaction(firestore(), async (tx) => {
      const snap = await tx.get(eventRef(eventId));
      if (!snap.exists()) throw new Error("This event no longer exists.");
      const event = toEvent(snap);

      const phase = getEventPhase(event);
      if (phase === "ended") throw new Error("This event has already ended.");
      if (event.capacity !== null && event.registeredCount >= event.capacity) throw new Error("Sorry, this event is full.");
      if (phase !== "open") throw new Error("Registration for this event is closed.");

      if ((await tx.get(registrationRef(eventId, emailKey))).exists()) throw new Error(DUPLICATE_EMAIL_ERROR);

      let ticketCode = generateTicketCode();
      if ((await tx.get(attendeeRef(eventId, ticketCode))).exists()) ticketCode = generateTicketCode();

      const registeredCount = event.registeredCount + 1;
      const nowFull = event.capacity !== null && registeredCount >= event.capacity;

      tx.set(attendeeRef(eventId, ticketCode), {
        id: ticketCode,
        ticketCode,
        eventId,
        ownerId: event.ownerId,
        eventTitle: event.title,
        name: input.name,
        registeredAt: serverTimestamp(),
        checkedInAt: null,
        emailKey,
      });
      tx.set(contactRef(eventId, ticketCode), { email: input.email, phone: input.phone, company: input.company });
      tx.set(registrationRef(eventId, emailKey), { ticketHash: await sha256Hex(ticketCode), createdAt: serverTimestamp() });
      tx.update(eventRef(eventId), { registeredCount, ...(event.autoCloseWhenFull && nowFull ? { status: "closed" } : {}) });
      return { ticketCode, event };
    });

    // Contact details are private in Firestore, so keep them in this tab for the confirmation page.
    saveRegistrationContact(result.ticketCode, { email: input.email, phone: input.phone, company: input.company });
    void sendConfirmationEmail(result.event, { name: input.name, email: input.email, ticketCode: result.ticketCode });
    return { ticketCode: result.ticketCode };
  });

/** Checks an attendee in (or undoes it) and keeps the event's checked-in count in sync. */
export const setCheckIn = (eventId: string, ticketCode: string, checkedIn: boolean) =>
  run(() =>
    runTransaction(firestore(), async (tx) => {
      const [eventSnap, attendeeSnap] = await Promise.all([tx.get(eventRef(eventId)), tx.get(attendeeRef(eventId, ticketCode))]);
      if (!eventSnap.exists() || !attendeeSnap.exists()) throw new Error("Ticket not found for this event.");
      const was = attendeeSnap.data().checkedInAt != null;
      if (was === checkedIn) return;
      const count = eventSnap.data().checkedInCount as number;
      tx.update(attendeeSnap.ref, { checkedInAt: checkedIn ? serverTimestamp() : null });
      tx.update(eventSnap.ref, { checkedInCount: Math.max(0, count + (checkedIn ? 1 : -1)) });
    }),
  );

/**
 * Removes one attendee (e.g. spam or a test sign-up): deletes their ticket, contact details and
 * email entry, frees their seat and adjusts the checked-in count. Their email can register again.
 */
export const removeAttendee = (eventId: string, ticketCode: string) =>
  run(() =>
    runTransaction(firestore(), async (tx) => {
      const [eventSnap, attendeeSnap] = await Promise.all([tx.get(eventRef(eventId)), tx.get(attendeeRef(eventId, ticketCode))]);
      if (!eventSnap.exists() || !attendeeSnap.exists()) throw new Error("This attendee was already removed.");
      const event = eventSnap.data();
      const attendee = attendeeSnap.data();

      tx.delete(attendeeSnap.ref);
      tx.delete(contactRef(eventId, ticketCode));
      if (attendee.emailKey) tx.delete(registrationRef(eventId, attendee.emailKey as string));
      tx.update(eventSnap.ref, {
        registeredCount: Math.max(0, (event.registeredCount as number) - 1),
        ...(attendee.checkedInAt != null ? { checkedInCount: Math.max(0, (event.checkedInCount as number) - 1) } : {}),
      });
    }),
  );

/** Finds a ticket by its code across all events (homepage lookup). */
export const lookupTicket = (code: string) =>
  run(async (): Promise<TicketLookup> => {
    const ticketCode = code.trim().toUpperCase();
    const snap = await getDocs(query(collectionGroup(firestore(), "attendees"), where("ticketCode", "==", ticketCode), limit(1)));
    if (snap.empty) throw new Error("No ticket matches that code.");
    const record = toRecord(snap.docs[0]!);

    const eventSnap = await getDoc(eventRef(record.eventId));
    if (!eventSnap.exists()) throw new Error("The event for this ticket no longer exists.");
    const event = toEvent(eventSnap);
    return {
      name: record.name,
      ticketCode: record.ticketCode,
      checkedInAt: record.checkedInAt,
      event: { id: event.id, title: event.title, startsAt: event.startsAt, location: event.location },
    };
  });

/* ========================= Contact (this browser) ========================= */

const CONTACT_KEY = (code: string) => `evently.registration.${code}`;

function saveRegistrationContact(code: string, contact: AttendeeContact) {
  try {
    sessionStorage.setItem(CONTACT_KEY(code), JSON.stringify(contact));
  } catch {}
}

/** Contact details the attendee typed in this browser tab (Firestore keeps them organizer-only). */
export function readRegistrationContact(code: string): AttendeeContact | null {
  try {
    const raw = sessionStorage.getItem(CONTACT_KEY(code));
    return raw ? (JSON.parse(raw) as AttendeeContact) : null;
  } catch {
    return null;
  }
}

/* ================================= Email ================================= */

const EMAILJS = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
};

/**
 * Sends the ticket confirmation email through EmailJS.
 * Set the template's "To Email" to {{email}} (or {{to_email}}).
 * Template variables: name, email, title, when, location, description, ticket_code, register_url.
 */
export async function sendConfirmationEmail(
  event: EventItem,
  attendee: { name: string; email: string; ticketCode: string },
) {
  if (!EMAILJS.serviceId || !EMAILJS.templateId || !EMAILJS.publicKey) {
    console.info("EmailJS isn’t configured, so no confirmation email was sent.");
    return;
  }
  try {
    await emailjs.send(
      EMAILJS.serviceId,
      EMAILJS.templateId,
      {
        name: attendee.name,
        email: attendee.email,
        to_name: attendee.name,
        to_email: attendee.email, // so templates using {{to_email}} as "To Email" also work
        title: event.title,
        // In the event's own time zone, with the zone named, e.g. "Sat, Nov 14 · 6:00 PM GMT+1"
        when: formatWhen(event.startsAt, event.timezone),
        location: event.location.type === "online" ? event.location.url ?? "Online" : formatLocation(event),
        description: event.description,
        ticket_code: attendee.ticketCode,
        register_url: `${window.location.origin}/events/${event.id}/register`,
      },
      { publicKey: EMAILJS.publicKey },
    );
  } catch (error) {
    // The registration is already saved; a failed email shouldn't block the attendee.
    console.error("Confirmation email failed", error);
  }
}
