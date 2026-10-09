"use client";

import Link from "next/link";
import { CalendarPlus, CheckCircle2, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { EmptyState, LoadingState } from "@/components/ui/page-states";
import { TicketCard } from "@/components/ui/ticket-card";
import { formatLocation, formatWhen } from "@/lib/utils";
import { readRegistrationContact } from "@/lib/firebase-actions";
import type { EventItem } from "@/types";
import { useRegistration } from "./use-registration";
import { FlowLayout } from "./flow-layout";

/** Builds a Google Calendar link so attendees can save the event. */
function calendarUrl(event: EventItem) {
  const fmt = (iso: string) => iso.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${fmt(event.startsAt)}/${fmt(event.endsAt)}`,
    details: event.description,
    location: event.location.type === "online" ? "Online" : formatLocation(event),
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

export function SuccessView({ eventId, ticketCode }: { eventId: string; ticketCode?: string }) {
  const { event, record, loading, notFound } = useRegistration(eventId, ticketCode);
  const contact = record ? readRegistrationContact(record.ticketCode) : null;

  return (
    <FlowLayout step={2} narrow>
      {loading && <LoadingState label="Loading your ticket…" />}
      {!loading && notFound && (
        <EmptyState icon={SearchX} title="Ticket not found" description="Check your confirmation email for your ticket code." />
      )}
      {!loading && event && record && (
        <div className="flex flex-col items-center gap-7 text-center">
          <div role="status" className="flex flex-col items-center gap-3.5">
            <span className="inline-flex size-[72px] items-center justify-center rounded-full bg-[#D7F5E3] text-success-600">
              <CheckCircle2 className="size-9" strokeWidth={2.2} aria-hidden />
            </span>
            <h1 className="text-[clamp(2rem,6vw,2.4rem)] font-bold">You’re registered!</h1>
            <p className="max-w-md leading-relaxed text-[#4A5060]">
              We’ve sent your ticket to{" "}
              {contact ? <strong className="break-words text-ink">{contact.email}</strong> : "your email"}. Show your ticket
              code at the door to check in.
            </p>
          </div>

          <TicketCard
            className="w-full text-left"
            title={event.title}
            meta={`${formatWhen(event.startsAt)} · ${formatLocation(event)}`}
            attendee={record.name}
            status="Confirmed"
            code={record.ticketCode}
            actions={<CopyButton value={record.ticketCode} label="Copy code" />}
          />

          <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row">
            <Button onClick={() => window.print()}>Save ticket</Button>
            <a
              href={calendarUrl(event)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-[10px] border border-line-strong bg-white px-4 font-bold hover:bg-hover"
            >
              <CalendarPlus className="size-[18px]" aria-hidden /> Add to calendar
            </a>
          </div>
          <p className="text-sm text-muted">
            Lost your code later?{" "}
            <Link href="/#tickets" className="font-bold text-brand-600">Look up your ticket</Link>
          </p>
        </div>
      )}
    </FlowLayout>
  );
}
