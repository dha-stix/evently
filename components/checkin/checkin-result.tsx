"use client";

import { motion } from "motion/react";
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
    <motion.li
      layout
      initial={false}
      // pulse green the moment an attendee is checked in
      animate={{
        scale: checked ? [1, 1.025, 1] : 1,
        boxShadow: checked
          ? ["0 0 0 0 rgba(34,197,94,0)", "0 0 0 10px rgba(34,197,94,0.18)", "0 0 0 0 rgba(34,197,94,0)"]
          : "0 0 0 0 rgba(34,197,94,0)",
      }}
      transition={{ duration: 0.7, ease: "easeOut" }}
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
          <motion.span
            className="inline-flex items-center gap-1.5 text-sm font-bold text-success-700"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
          >
            <motion.span
              className="inline-flex"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 14 }}
            >
              <CheckCircle2 className="size-[18px]" aria-hidden />
            </motion.span>
            Checked in at {formatTime(attendee.checkedInAt!)}
          </motion.span>
          <Button variant="secondary" size="sm" className="h-10" loading={pending} onClick={() => onToggle(false)}>
            Undo
          </Button>
        </div>
      ) : (
        <Button size="lg" className="w-full sm:w-auto" loading={pending} onClick={() => onToggle(true)}>
          {!pending && <CheckIcon className="size-[18px]" strokeWidth={2.4} aria-hidden />} Check in
        </Button>
      )}
    </motion.li>
  );
}
