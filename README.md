# Evently: event management UI

Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + **Firebase client SDK** (Auth, Firestore, Storage),
with optional **EmailJS** confirmation emails. Organizers create **free** events and take registrations (one per email address);
attendees register without an account and are checked in at the door with a unique ticket code.

## Set up

1. Create a Firebase project, then add a **Web app**. Enable **Authentication → Email/Password**,
   **Firestore** and **Storage**.
2. Copy `.env.example` to `.env.local` and paste your web app config. The EmailJS keys are optional.
3. Deploy the security rules and indexes in this repo:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase use --add          # pick your project
   firebase deploy --only firestore:rules,firestore:indexes,storage
   ```
   The storage rule checks event ownership in Firestore. Accept the cross-service permission prompt
   when you deploy it.
4. Run the app:
   ```bash
   npm install
   npm run dev
   ```
   Open http://localhost:3000, create an account at `/auth/register`, then create your first event.

## Pages

| Route | What it does | Access |
| --- | --- | --- |
| `/` | Marketing homepage (hero, features, how it works, ticket lookup, FAQ + CTA) | Public |
| `/auth/login` | Email + password sign in | Public |
| `/auth/register` | Username, email, password sign up | Public |
| `/auth/forgot-password` | Email a password-reset link | Public |
| `/dashboard` | Stats, events (filter + search), recent registrations | Organizer |
| `/events/create` | Create event: basics, date, location, capacity, form fields | Organizer |
| `/events/[id]/edit` | Edit an event (registrations are kept) | Event owner only |
| `/events/[id]` | Manage event: attendees, check-in status, CSV export, close/reopen registration | Event owner only |
| `/events/[id]/register` | Attendee registration form (no account needed) | Public |
| `/events/[id]/register/success` | Confirmation + unique ticket code | Public |
| `/events/[id]/search` | Venue check-in: search by name or ticket code | Event owner only |

## Project structure

```
lib/
  firebase.ts           ← Firebase app/auth/firestore/storage setup (reads .env.local)
  firebase-actions.ts   ← EVERY Firebase call lives here (auth, events, attendees, check-in, email)
  utils.ts images.ts
app/                    ← routes (pages only, no server code)
components/
  ui/                   ← reusable primitives (Button, Field, Badge, StatCard, TicketCard…)
  layout/               ← headers, footer, AppShell, RequireAuth
  home/ auth/ dashboard/ events/ register/ checkin/   ← page sections
  providers/            ← AuthProvider (Firebase Auth state), ToastProvider
hooks/use-subscription.ts  ← subscribes components to live Firestore data
images/                 ← logo + preset event cover artwork
styles/globals.css      ← Tailwind theme tokens + shared utilities
types/                  ← shared TypeScript types (and the Firestore layout)
firestore.rules  storage.rules  firestore.indexes.json  firebase.json
```

Components never import the Firebase SDK directly. They call functions from `lib/firebase-actions.ts`:

```ts
// one-off actions return a Promise and throw a readable Error
await createEvent(user.id, input, coverDataUrl);
await registerAttendee(eventId, { name, email, tickets: 1 });

// live data: subscribe + unsubscribe, wrapped by the useSubscription hook
const { data: event, loading } = useSubscription(subscribeToEvent, [eventId]);
```

## Optional services

**Google Maps (venue maps):** in Google Cloud, enable the **Maps Embed API**, create an API key
restricted to your site's domains, and set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`. The Embed API is free.

**App Check (spam protection):**
1. Create a **reCAPTCHA v3** key at https://www.google.com/recaptcha/admin and add your domains (and `localhost`).
2. Firebase console → **App Check** → register your web app with that site key, and paste the reCAPTCHA secret.
3. Set `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` and restart the dev server.
4. On localhost the browser console prints an **App Check debug token**. Add it under App Check → Apps → ⋮ →
   *Manage debug tokens*.
5. Once requests show as "verified" in App Check's metrics, click **Enforce** for Firestore and Storage.

The registration form also has a hidden honeypot field and a minimum fill time, which stop simple bots.

## Dates and time zones

Event times are stored as Firestore **Timestamps**, which are exact moments in time. Everyone sees them in
their own time zone with a label (e.g. *6:00 PM GMT+1*). If a viewer is in a different zone from the event,
the event's local time is shown as well. Registration closes at the deadline, or when the event ends.
The database rules enforce that with the server's clock.

## Firestore data model

| Path | Contents | Who can read |
| --- | --- | --- |
| `users/{uid}` | username, email | That user |
| `events/{eventId}` | event details, `ownerId`, `registeredCount`, `checkedInCount` | Everyone |
| `events/{eventId}/attendees/{ticketCode}` | name, ticket code, check-in status | One ticket by its code: anyone. Full list + check-in: event owner |
| `events/{eventId}/contacts/{ticketCode}` | email, phone, company | Event owner only |
| `events/{eventId}/registrations/{emailKey}` | one entry per email (SHA-256 of `eventId:email`, no personal data) so an email can only register once per event | Anyone can check one; list: event owner |

Contact details are kept in a separate subcollection because Firestore rules can't hide individual
fields, so a ticket can be looked up by its code without exposing the attendee's email.

Registration runs in a **transaction**, so an event can't be overfilled and an email can't register twice.

### Things to finish

- **Check-in access:** only the event creator can open `/events/[id]/search` and check guests in (enforced by
  `firestore.rules`). To let others help at the door, add a staff role or PIN.
- **Emails:** set the EmailJS env vars. Your template can use `name`, `email`, `title`, `when`,
  `location`, `description`, `ticket_code` and `register_url`.

## Responsive design

Every page is built mobile-first with Tailwind breakpoints (`sm` 640, `md` 768, `lg` 1024, `xl` 1280).
Navigation collapses into a menu button. Two-column layouts stack on small screens. The attendee table
switches to cards on phones. All tap targets are at least 44px.
