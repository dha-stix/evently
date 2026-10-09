"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox, Field, FormError, Input } from "@/components/ui/field";
import { useAuth } from "@/components/providers/auth-provider";
import { AuthHeading } from "./auth-layout";
import { PasswordInput, PasswordStrength } from "./password-input";

const USERNAME_RE = /^[a-z0-9_]{3,24}$/i;

export function RegisterForm() {
  const router = useRouter();
  const { user, register } = useAuth();
  const [form, setForm] = useState({ username: "", email: "", password: "", terms: false });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!USERNAME_RE.test(form.username)) return setError("Usernames are 3–24 letters, numbers or underscores.");
    if (form.password.length < 8) return setError("Password must be at least 8 characters.");
    if (!form.terms) return setError("Please accept the Terms and Privacy Policy.");
    setError(null);
    setSubmitting(true);
    try {
      await register(form.username, form.email, form.password);
    } catch (err) {
      setError((err as Error).message);
      setSubmitting(false);
    }
  }

  return (
    <>
      <AuthHeading title="Create your account" subtitle="Start hosting events for free." />
      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <FormError message={error} />
        <Field label="Username" hint="Shown on your public event pages.">
          {(p) => <Input {...p} autoComplete="username" placeholder="e.g. ada_events" value={form.username} onChange={update("username")} />}
        </Field>
        <Field label="Email">
          {(p) => <Input {...p} type="email" autoComplete="email" placeholder="you@company.com" value={form.email} onChange={update("email")} />}
        </Field>
        <Field label="Password">
          {(p) => (
            <div className="flex flex-col gap-2.5">
              <PasswordInput {...p} autoComplete="new-password" placeholder="At least 8 characters" value={form.password} onChange={update("password")} />
              <PasswordStrength password={form.password} />
            </div>
          )}
        </Field>
        <Checkbox
          checked={form.terms}
          onChange={update("terms")}
          label={
            <>
              I agree to the <Link href="#" className="font-semibold text-brand-600">Terms</Link> and{" "}
              <Link href="#" className="font-semibold text-brand-600">Privacy Policy</Link>
            </>
          }
        />
        <Button type="submit" size="lg" block loading={submitting}>
          Create account
        </Button>
        <p className="text-center text-[15px] text-muted">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-bold text-brand-600 hover:text-brand-700">
            Sign in
          </Link>
        </p>
      </form>
    </>
  );
}
