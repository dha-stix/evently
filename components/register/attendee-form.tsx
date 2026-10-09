"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FormError, Input } from "@/components/ui/field";
import { useToast } from "@/components/providers/toast-provider";
import { DUPLICATE_EMAIL_ERROR, registerAttendee } from "@/lib/firebase-actions";
import type { EventItem, RegistrationInput } from "@/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Humans take a few seconds to fill the form; bots submit instantly. */
const MIN_FILL_MS = 2500;

export function AttendeeForm({ event }: { event: EventItem }) {
  const router = useRouter();
  const notify = useToast();
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", website: "" });
  const shownAt = useRef(0);
  useEffect(() => {
    shownAt.current = Date.now();
  }, []);
  const [errors, setErrors] = useState<Partial<Record<"name" | "email", string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const has = (f: string) => event.formFields.includes(f as never);

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found: typeof errors = {};
    if (!form.name.trim()) found.name = "Please enter your full name.";
    if (!EMAIL_RE.test(form.email.trim())) found.email = "Please enter a valid email address.";
    setErrors(found);
    if (Object.keys(found).length) return;

    // Spam traps: the hidden "website" field is only filled in by bots, and humans need a moment to type.
    if (form.website || Date.now() - shownAt.current < MIN_FILL_MS) {
      setSubmitError("Please check your details and submit again.");
      shownAt.current = Date.now();
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    const input: RegistrationInput = {
      name: form.name.trim(),
      email: form.email.trim(),
      ...(has("phone") && form.phone ? { phone: form.phone.trim() } : {}),
      ...(has("company") && form.company ? { company: form.company.trim() } : {}),
    };
    try {
      const { ticketCode } = await registerAttendee(event.id, input);
      notify({ title: "You’re registered!", description: `Your ticket code is ${ticketCode}` });
      router.push(`/events/${event.id}/register/success?code=${ticketCode}`);
    } catch (err) {
      const message = (err as Error).message;
      if (message === DUPLICATE_EMAIL_ERROR) setErrors({ email: message });
      else setSubmitError(message);
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="card relative flex flex-col gap-5 rounded-[20px] p-5 sm:p-7">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-2xl font-bold sm:text-[26px]">Your details</h2>
        <p className="text-[15px] text-muted">Free entry, no account needed. We’ll email your ticket code.</p>
      </div>
      <FormError message={submitError} />
      <Field label="Full name" error={errors.name}>
        {(p) => <Input {...p} autoComplete="name" placeholder="As it should appear on your ticket" value={form.name} onChange={update("name")} />}
      </Field>
      <Field label="Email address" error={errors.email} hint="Each email address can register once for this event.">
        {(p) => <Input {...p} type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={update("email")} />}
      </Field>
      {has("phone") && (
        <Field label="Phone number" hint="Optional">
          {(p) => <Input {...p} type="tel" autoComplete="tel" placeholder="+234 800 000 0000" value={form.phone} onChange={update("phone")} />}
        </Field>
      )}
      {has("company") && (
        <Field label="Company / organisation" hint="Optional">
          {(p) => <Input {...p} autoComplete="organization" value={form.company} onChange={update("company")} />}
        </Field>
      )}
      {/* Honeypot: invisible to people (and screen readers), irresistible to form-filling bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={update("website")} />
        </label>
      </div>
      <Button type="submit" size="lg" block loading={submitting}>
        Register for free
        <ArrowRight className="size-[18px]" aria-hidden />
      </Button>
    </form>
  );
}
