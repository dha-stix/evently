import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginPanel } from "@/components/auth/auth-panels";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Sign in" };

/** Only allow same-site relative redirects. */
const safeNext = (value: unknown) =>
  typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : "/dashboard";

export default async function LoginPage({ searchParams }: PageProps<"/auth/login">) {
  const { next } = await searchParams;
  return (
    <AuthLayout panel={<LoginPanel />}>
      <LoginForm next={safeNext(next)} />
    </AuthLayout>
  );
}
