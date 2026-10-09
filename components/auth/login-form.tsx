"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, FormError, Input } from "@/components/ui/field";
import { useAuth } from "@/components/providers/auth-provider";
import { AuthHeading } from "./auth-layout";
import { PasswordInput } from "./password-input";

export function LoginForm({ next = "/dashboard" }: { next?: string }) {
  const router = useRouter();
  const { user, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) router.replace(next);
  }, [user, next, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setError((err as Error).message);
      setSubmitting(false);
    }
  }

  return (
    <>
      <AuthHeading title="Welcome back" subtitle="Sign in to manage your events." />
      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <FormError message={error} />
        <Field label="Email">
          {(p) => (
            <Input {...p} type="email" autoComplete="email" required placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          )}
        </Field>
        <Field
          label="Password"
          aside={
            <Link href="/auth/forgot-password" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
              Forgot password?
            </Link>
          }
        >
          {(p) => (
            <PasswordInput {...p} autoComplete="current-password" required placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
          )}
        </Field>
        <Button type="submit" size="lg" block loading={submitting}>
          Sign in
        </Button>
        <p className="text-center text-[15px] text-muted">
          New to Evently?{" "}
          <Link href="/auth/register" className="font-bold text-brand-600 hover:text-brand-700">
            Create an account
          </Link>
        </p>
      </form>
    </>
  );
}
