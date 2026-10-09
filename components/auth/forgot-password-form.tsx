"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FormError, Input } from "@/components/ui/field";
import { sendPasswordReset } from "@/lib/firebase-actions";
import { AuthHeading } from "./auth-layout";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) return setError("Please enter a valid email address.");
    setError(null);
    setSending(true);
    try {
      await sendPasswordReset(email);
      setSentTo(email.trim());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSending(false);
    }
  }

  if (sentTo) {
    return (
      <div role="status" className="flex flex-col gap-5">
        <span className="inline-flex size-14 items-center justify-center rounded-full bg-success-50 text-success-600">
          <MailCheck className="size-7" aria-hidden />
        </span>
        <AuthHeading
          title="Check your email"
          subtitle={`If an account exists for ${sentTo}, we’ve sent a link to reset your password. It can take a minute to arrive, so check your spam folder too.`}
        />
        <Button variant="secondary" size="lg" block onClick={() => setSentTo(null)}>
          Use a different email
        </Button>
        <Link href="/auth/login" className="text-center text-[15px] font-bold text-brand-600 hover:text-brand-700">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <>
      <AuthHeading title="Reset your password" subtitle="Enter your account email and we’ll send you a reset link." />
      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <FormError message={error} />
        <Field label="Email">
          {(p) => (
            <Input {...p} type="email" autoComplete="email" required autoFocus placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          )}
        </Field>
        <Button type="submit" size="lg" block loading={sending}>
          Send reset link
        </Button>
        <Link href="/auth/login" className="inline-flex items-center justify-center gap-2 text-[15px] font-bold text-brand-600 hover:text-brand-700">
          <ArrowLeft className="size-4" aria-hidden /> Back to sign in
        </Link>
      </form>
    </>
  );
}
