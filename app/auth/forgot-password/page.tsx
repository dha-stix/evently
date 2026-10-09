import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginPanel } from "@/components/auth/auth-panels";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = { title: "Reset password" };

export default function ForgotPasswordPage() {
  return (
    <AuthLayout panel={<LoginPanel />}>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
