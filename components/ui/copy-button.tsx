"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/providers/toast-provider";

export function CopyButton({
  value,
  label = "Copy",
  iconOnly,
  variant = "secondary",
  className,
}: {
  value: string;
  label?: string;
  iconOnly?: boolean;
  variant?: React.ComponentProps<typeof Button>["variant"];
  className?: string;
}) {
  const notify = useToast();
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      notify({ title: "Copied to clipboard" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      notify({ title: "Couldn’t copy", description: "Select the text and copy it manually.", tone: "error" });
    }
  }

  const Icon = copied ? Check : Copy;
  return (
    <Button variant={variant} onClick={copy} aria-label={iconOnly ? label : undefined} className={className}>
      <Icon className="size-[17px]" aria-hidden />
      {!iconOnly && label}
    </Button>
  );
}
