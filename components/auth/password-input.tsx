"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/field";
import { cn } from "@/lib/utils";

export function PasswordInput({ className, ...props }: Omit<React.ComponentProps<"input">, "type">) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Input type={visible ? "text" : "password"} className={cn("pr-12", className)} {...props} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute top-1 right-1 inline-flex size-10 items-center justify-center rounded-lg text-muted hover:text-ink"
      >
        {visible ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
      </button>
    </div>
  );
}

const LEVELS = [
  { label: "Too short", color: "bg-danger-600", text: "text-danger-600" },
  { label: "Weak", color: "bg-danger-600", text: "text-danger-600" },
  { label: "Fair", color: "bg-[#D97706]", text: "text-warning-700" },
  { label: "Good", color: "bg-success-600", text: "text-success-700" },
  { label: "Strong", color: "bg-success-600", text: "text-success-700" },
];

export function passwordScore(pw: string) {
  if (pw.length < 8) return 0;
  return 1 + [/[A-Z]/.test(pw) && /[a-z]/.test(pw), /\d/.test(pw), /[^A-Za-z0-9]/.test(pw)].filter(Boolean).length;
}

export function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const score = passwordScore(password);
  const level = LEVELS[score]!;
  return (
    <div className="flex flex-col gap-1.5" aria-live="polite">
      <div className="grid grid-cols-4 gap-1.5">
        {[1, 2, 3, 4].map((i) => (
          <span key={i} className={cn("h-1 rounded-full", i <= score ? level.color : "bg-line")} />
        ))}
      </div>
      <p className={cn("text-[13px] font-semibold", level.text)}>{level.label} password</p>
    </div>
  );
}
