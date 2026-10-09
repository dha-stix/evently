"use client";

import { AuthProvider } from "./auth-provider";
import { MotionConfig } from "motion/react";
import { ToastProvider } from "./toast-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // reducedMotion="user": animations calm down for visitors who ask their device to reduce motion
    <MotionConfig reducedMotion="user">
      <AuthProvider>
        <ToastProvider>{children}</ToastProvider>
      </AuthProvider>
    </MotionConfig>
  );
}
