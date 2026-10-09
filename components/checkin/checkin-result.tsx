"use client";

import { CheckCircle2, CheckIcon } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn, formatTime } from "@/lib/utils";
import type { CheckInResult as Result } from "@/types";

export function CheckInResult({
  attendee,
  pending,
  onToggle,
}: {
  attendee: Result;
  pending: boolean;
  onToggle: (checkedIn: boolean) => void;
}) {
  const checked = !!attendee.checkedInAt;
  return (
    <li
      className={cn(
        "flex flex-col gap-4 rounded-2xl bg-white p-4 sm:flex-row sm:items-center sm:px-[18px]",
        checked ? "border-[1.5px] border-success-200" : "border border-line",
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <Avatar name={attendee.name} size="lg" />
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-[17px] font-extrabold">{attendee.name}</span>
          <span className="self-start rounded-md bg-hover px-2 py-0.5 font-mono text-sm font-semibold">{attendee.ticketCode}</span>
        </div>
      </div>
      {checked ? (
        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-success-700">
            <CheckCircle2 className="size-[18px]" aria-hidden /> Checked in at {formatTime(attendee.checkedInAt!)}
          </span>
          <Button variant="secondary" size="sm" className="h-10" loading={pending} onClick={() => onToggle(false)}>
            Undo
          </Button>
        </div>
      ) : (
        <Button size="lg" className="w-full sm:w-auto" loading={pending} onClick={() => onToggle(true)}>
          {!pending && <CheckIcon className="size-[18px]" strokeWidth={2.4} aria-hidden />} Check in
        </Button>
      )}
    </li>
  );
}
