"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ImagePlus, X } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Checkbox, Field, FormError, Input, Select, Textarea } from "@/components/ui/field";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/components/providers/toast-provider";
import { coverOptions, covers } from "@/lib/images";
import { cn, toDateInput, toDateTimeInput, toTimeInput, viewerTimeZone } from "@/lib/utils";
import { createEvent, updateEvent } from "@/lib/firebase-actions";
import type { AttendeeFormField, CoverKey, EventFormInput, EventItem, LocationType } from "@/types";
import { FormSection } from "./form-section";
import { EventPreviewCard } from "./event-preview-card";

const CATEGORIES = ["Meetup", "Conference", "Workshop", "Party", "Webinar", "Other"];
const OPTIONAL_FIELDS: { value: AttendeeFormField; label: string }[] = [
  { value: "phone", label: "Phone number" },
  { value: "company", label: "Company / organisation" },
];

const MAX_COVER_BYTES = 5 * 1024 * 1024;

/** Date + time typed in the viewer's time zone → exact instant (ISO, UTC). */
const toIso = (date: string, time: string) => (date && time ? new Date(`${date}T${time}`).toISOString() : "");

function emptyState() {
  return {
    title: "",
    description: "",
    category: "Meetup",
    cover: "violet" as CoverKey,
    startDate: "",
    startTime: "18:00",
    endDate: "",
    endTime: "21:00",
    timezone: viewerTimeZone(),
    locationType: "in_person" as LocationType,
    venue: "",
    address: "",
    city: "",
    url: "",
    capacity: "",
    deadline: "",
    autoCloseWhenFull: true,
    formFields: ["name", "email", "phone"] as AttendeeFormField[],
  };
}

type FormState = ReturnType<typeof emptyState>;
type Errors = Partial<Record<keyof FormState, string>>;

/** Existing event → form values (dates shown in the viewer's time zone). */
function stateFromEvent(e: EventItem): FormState {
  return {
    title: e.title,
    description: e.description,
    category: e.category,
    cover: e.cover,
    startDate: toDateInput(e.startsAt),
    startTime: toTimeInput(e.startsAt),
    endDate: toDateInput(e.endsAt),
    endTime: toTimeInput(e.endsAt),
    timezone: e.timezone, // the event keeps its own zone, even when edited from elsewhere
    locationType: e.location.type,
    venue: e.location.venue ?? "",
    address: e.location.address ?? "",
    city: e.location.city ?? "",
    url: e.location.url ?? "",
    capacity: e.capacity === null ? "" : String(e.capacity),
    deadline: e.registrationDeadline ? toDateTimeInput(e.registrationDeadline) : "",
    autoCloseWhenFull: e.autoCloseWhenFull,
    formFields: e.formFields,
  };
}

function validate(f: FormState, original?: EventItem): Errors {
  const e: Errors = {};
  const now = Date.now();
  if (!f.title.trim()) e.title = "Give your event a title.";

  const start = toIso(f.startDate, f.startTime);
  const end = toIso(f.endDate || f.startDate, f.endTime);
  // When editing, an unchanged start is fine even if the event has already begun (e.g. fixing a typo).
  const startChanged = !original || start !== original.startsAt;
  if (!f.startDate) e.startDate = "Pick a start date.";
  else if (startChanged && new Date(start).getTime() <= now) e.startDate = "The event must start in the future.";
  if (start && end && new Date(end) <= new Date(start)) e.endTime = "The event must end after it starts.";

  if (f.deadline) {
    const deadline = new Date(f.deadline).toISOString();
    const deadlineChanged = !original || deadline !== original.registrationDeadline;
    if (deadlineChanged && new Date(deadline).getTime() <= now) e.deadline = "The deadline must be in the future.";
    else if (end && new Date(deadline) > new Date(end)) e.deadline = "Registration must close before the event ends.";
  }

  if (f.locationType === "in_person" && !f.venue.trim()) e.venue = "Add a venue name.";
  if (f.locationType === "online" && !/^https?:\/\//.test(f.url)) e.url = "Add a valid meeting link (https://…).";
  if (f.capacity && !(Number.isInteger(Number(f.capacity)) && Number(f.capacity) > 0)) {
    e.capacity = "Use a whole number above 0, or leave empty.";
  } else if (original && f.capacity && Number(f.capacity) < original.registeredCount) {
    e.capacity = `${original.registeredCount} people are already registered, so the limit can’t be lower.`;
  }
  return e;
}

/** Create a new event, or edit `event` when it's passed in. */
export function EventForm({ event }: { event?: EventItem }) {
  const editing = !!event;
  const router = useRouter();
  const notify = useToast();
  const { user } = useAuth();
  const [form, setForm] = useState<FormState>(() => (event ? stateFromEvent(event) : emptyState()));
  const [newCover, setNewCover] = useState<string | null>(null); // freshly chosen upload (data URL)
  const [removedUpload, setRemovedUpload] = useState(false); // existing upload removed during this edit
  const [errors, setErrors] = useState<Errors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<"draft" | "publish" | "save" | null>(null);

  const coverImage = newCover ?? (removedUpload ? null : (event?.coverUrl ?? null));
  const today = toDateInput(new Date().toISOString());
  const zoneNote = useMemo(() => {
    const viewer = viewerTimeZone();
    return viewer === form.timezone ? viewer : `${viewer} (the event itself is in ${form.timezone})`;
  }, [form.timezone]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };
  const bind = (key: keyof FormState) => ({
    value: form[key] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => set(key, e.target.value as never),
  });

  const preview = useMemo(
    () => ({
      title: form.title,
      cover: form.cover,
      coverUrl: coverImage,
      startsAt: toIso(form.startDate, form.startTime),
      capacity: form.capacity ? Number(form.capacity) : null,
      location: { type: form.locationType, venue: form.venue, city: form.city },
    }),
    [form, coverImage],
  );

  function removeCover() {
    setNewCover(null);
    if (event?.coverUrl) setRemovedUpload(true);
  }

  async function submit(mode: "draft" | "publish" | "save") {
    const found = validate(form, event);
    setErrors(found);
    if (Object.keys(found).length) {
      setSubmitError("Please fix the highlighted fields.");
      // Move focus to the first invalid field once errors have rendered.
      requestAnimationFrame(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    setSubmitError(null);
    setSubmitting(mode);

    const input: EventFormInput = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      cover: form.cover,
      startsAt: toIso(form.startDate, form.startTime),
      endsAt: toIso(form.endDate || form.startDate, form.endTime),
      timezone: form.timezone,
      location:
        form.locationType === "online"
          ? { type: "online", url: form.url.trim() }
          : { type: "in_person", venue: form.venue.trim(), address: form.address.trim(), city: form.city.trim() },
      capacity: form.capacity ? Number(form.capacity) : null,
      registrationDeadline: form.deadline ? new Date(form.deadline).toISOString() : null,
      autoCloseWhenFull: form.autoCloseWhenFull,
      formFields: form.formFields,
    };

    try {
      if (event) {
        await updateEvent(event.id, input, { image: newCover, removeUploaded: removedUpload && !newCover });
        notify({ title: "Changes saved", description: input.title });
        router.push(`/events/${event.id}`);
      } else {
        const id = await createEvent(user!.id, { ...input, publish: mode === "publish" }, newCover);
        notify({ title: mode === "publish" ? "Event published" : "Draft saved", description: input.title });
        router.push(`/events/${id}`);
      }
    } catch (err) {
      setSubmitError((err as Error).message);
      setSubmitting(null);
    }
  }

  function handleCoverFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return notify({ title: "Please choose an image file", tone: "error" });
    if (file.size > MAX_COVER_BYTES) return notify({ title: "Image is too large", description: "Use an image under 5 MB.", tone: "error" });
    const reader = new FileReader();
    reader.onload = () => setNewCover(reader.result as string);
    reader.readAsDataURL(file);
  }

  const toggleField = (field: AttendeeFormField) =>
    set("formFields", form.formFields.includes(field) ? form.formFields.filter((f) => f !== field) : [...form.formFields, field]);

  const backHref = event ? `/events/${event.id}` : "/dashboard";

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <form
        className="flex min-w-0 flex-col gap-5 lg:flex-1"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          submit(editing ? "save" : "publish");
        }}
      >
        <FormSection step={1} title="Basics">
          <Field label="Event title" error={errors.title}>
            {(p) => <Input {...p} placeholder="e.g. Product Design Meetup" maxLength={90} {...bind("title")} />}
          </Field>
          <Field label="Description" hint="What should attendees expect?">
            {(p) => <Textarea {...p} rows={4} placeholder="Agenda, speakers, what to bring…" {...bind("description")} />}
          </Field>
          <Field label="Category" className="sm:max-w-xs">
            {(p) => (
              <Select {...p} {...bind("category")}>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </Select>
            )}
          </Field>
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-sm font-semibold">Cover image</legend>
            {coverImage ? (
              <div className="relative aspect-[2/1] overflow-hidden rounded-xl border border-line sm:max-w-md">
                <Image src={coverImage} alt="Cover preview" fill className="object-cover" sizes="448px" />
                <button
                  type="button"
                  onClick={removeCover}
                  aria-label="Remove uploaded image"
                  className="absolute top-2 right-2 inline-flex size-9 items-center justify-center rounded-full bg-white/90 text-ink shadow"
                >
                  <X className="size-4" aria-hidden />
                </button>
              </div>
            ) : (
              <div role="radiogroup" aria-label="Preset covers" className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
                {coverOptions.map((key) => (
                  <button
                    key={key}
                    type="button"
                    role="radio"
                    aria-checked={form.cover === key}
                    aria-label={`${key} cover`}
                    onClick={() => set("cover", key)}
                    className={cn(
                      "relative aspect-[2/1] overflow-hidden rounded-xl ring-offset-2 transition",
                      form.cover === key ? "ring-2 ring-brand-600" : "hover:opacity-85",
                    )}
                  >
                    <Image src={covers[key]} alt="" fill className="object-cover" sizes="120px" />
                    {form.cover === key && (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/20 text-white">
                        <Check className="size-5" strokeWidth={3} aria-hidden />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
            <label className="mt-1 inline-flex cursor-pointer items-center gap-2 self-start rounded-[10px] border border-line-strong bg-white px-4 py-2.5 text-sm font-bold hover:bg-hover">
              <ImagePlus className="size-4" aria-hidden />
              {coverImage ? "Choose a different image" : "Upload your own image"}
              <input type="file" accept="image/*" className="sr-only" onChange={handleCoverFile} />
            </label>
            <p className="text-[13px] text-muted">PNG or JPG up to 5 MB. 1600 × 800 works best.</p>
          </fieldset>
        </FormSection>

        <FormSection step={2} title="Date & time">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Field label="Start date" error={errors.startDate}>
              {(p) => <Input {...p} type="date" min={editing ? undefined : today} {...bind("startDate")} />}
            </Field>
            <Field label="Start time">{(p) => <Input {...p} type="time" {...bind("startTime")} />}</Field>
            <Field label="End date" hint="Defaults to start date">
              {(p) => <Input {...p} type="date" min={form.startDate || today} {...bind("endDate")} />}
            </Field>
            <Field label="End time" error={errors.endTime}>
              {(p) => <Input {...p} type="time" {...bind("endTime")} />}
            </Field>
          </div>
          <p className="text-[13px] leading-relaxed text-muted">
            Times are in your time zone: {zoneNote}. Attendees see them converted to their own time zone.
          </p>
        </FormSection>

        <FormSection step={3} title="Location">
          <SegmentedControl
            label="Location type"
            className="self-start"
            value={form.locationType}
            onChange={(v) => set("locationType", v)}
            options={[
              { value: "in_person", label: "In person" },
              { value: "online", label: "Online" },
            ]}
          />
          {form.locationType === "in_person" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Venue name" error={errors.venue}>
                {(p) => <Input {...p} placeholder="e.g. Landmark Centre, Hall B" {...bind("venue")} />}
              </Field>
              <Field label="City">{(p) => <Input {...p} placeholder="e.g. Lagos" {...bind("city")} />}</Field>
              <Field label="Street address" className="sm:col-span-2" hint="Used for the map and directions.">
                {(p) => <Input {...p} placeholder="Street and number" autoComplete="street-address" {...bind("address")} />}
              </Field>
            </div>
          ) : (
            <Field label="Meeting link" error={errors.url} hint="Only shared with registered attendees.">
              {(p) => <Input {...p} type="url" placeholder="https://meet.google.com/…" {...bind("url")} />}
            </Field>
          )}
        </FormSection>

        <FormSection
          step={4}
          title="Capacity"
          description="All events are free. Each email address can register once, and each registration is one attendee."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Attendee limit" hint="Leave empty for unlimited." error={errors.capacity}>
              {(p) => <Input {...p} type="number" min={event?.registeredCount || 1} inputMode="numeric" placeholder="e.g. 120" {...bind("capacity")} />}
            </Field>
            <Field label="Registration closes" hint="Optional. Otherwise it closes when the event ends." error={errors.deadline}>
              {(p) => <Input {...p} type="datetime-local" min={`${today}T00:00`} {...bind("deadline")} />}
            </Field>
          </div>
          <Checkbox
            label="Close registration automatically when the limit is reached"
            checked={form.autoCloseWhenFull}
            onChange={(e) => set("autoCloseWhenFull", e.target.checked)}
          />
        </FormSection>

        <FormSection step={5} title="Attendee form" description="Choose what attendees fill in when they register.">
          <div className="grid gap-2.5 sm:grid-cols-2">
            {(["Full name", "Email"] as const).map((label) => (
              <div key={label} className="flex items-center gap-3 rounded-[10px] border border-line p-3.5 font-semibold">
                <input type="checkbox" checked disabled className="size-[18px] accent-brand-600" aria-label={label} />
                {label}
                <span className="ml-auto text-xs font-semibold text-muted">Required</span>
              </div>
            ))}
            {OPTIONAL_FIELDS.map((f) => (
              <Checkbox
                key={f.value}
                label={f.label}
                checked={form.formFields.includes(f.value)}
                onChange={() => toggleField(f.value)}
                className="items-center rounded-[10px] border border-line p-3.5 font-semibold text-ink [&>input]:mt-0"
              />
            ))}
          </div>
        </FormSection>

        <FormError message={submitError} />
        <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
          <ButtonLink href={backHref} variant="secondary">Cancel</ButtonLink>
          {editing ? (
            <Button type="submit" loading={submitting === "save"} disabled={!!submitting}>
              Save changes
            </Button>
          ) : (
            <>
              <Button variant="secondary" loading={submitting === "draft"} disabled={!!submitting} onClick={() => submit("draft")}>
                Save draft
              </Button>
              <Button type="submit" loading={submitting === "publish"} disabled={!!submitting}>
                Publish event
              </Button>
            </>
          )}
        </div>
      </form>

      <aside className="flex flex-col gap-3 lg:sticky lg:top-24 lg:w-[340px] lg:shrink-0">
        <p className="text-[13px] font-extrabold tracking-[0.06em] text-muted">PREVIEW</p>
        <EventPreviewCard event={preview} />
        <p className="rounded-xl bg-brand-100 px-4 py-3.5 text-sm leading-relaxed text-brand-800">
          {editing
            ? "Registrations, check-ins and the event link stay the same when you save changes."
            : "After publishing you’ll get a public registration link to share, and a private check-in page for the venue."}{" "}
          <Link href={backHref} className="font-bold underline">
            {editing ? "Back to event" : "Back to dashboard"}
          </Link>
        </p>
      </aside>
    </div>
  );
}
