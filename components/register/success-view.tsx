"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { CalendarPlus, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { EmptyState, LoadingState } from "@/components/ui/page-states";
import { TicketCard } from "@/components/ui/ticket-card";
import { formatLocation, formatWhen } from "@/lib/utils";
import { readRegistrationContact } from "@/lib/firebase-actions";
import type { EventItem } from "@/types";
import { useRegistration } from "./use-registration";
import { FlowLayout } from "./flow-layout";
import { FadeIn } from "@/components/motion/fade-in";
import { AnimatedHeadline } from "@/components/motion";
import { ConfettiBurst } from "@/components/illustrations/confetti";
import { SuccessCheck } from "@/components/illustrations/success-check";

/** Builds a Google Calendar link so attendees can save the event. */
function calendarUrl(event: EventItem) {
  const fmt = (iso: string) => iso.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${fmt(event.startsAt)}/${fmt(event.endsAt)}`,
    details: event.description,
    location:
      event.location.type === "online" ? "Online" : formatLocation(event),
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

export function SuccessView({
  eventId,
  ticketCode,
}: {
  eventId: string;
  ticketCode?: string;
}) {
  const { event, record, loading, notFound } = useRegistration(
    eventId,
    ticketCode,
  );
  const contact = record ? readRegistrationContact(record.ticketCode) : null;

  return (
    <FlowLayout step={2} narrow>
      {loading && <LoadingState label="Loading your ticket…" />}
      {!loading && notFound && (
        <EmptyState
          icon={SearchX}
          title="Ticket not found"
          description="Check your confirmation email for your ticket code."
        />
      )}
      {!loading && event && record && (
        <div className="flex flex-col items-center gap-7 text-center">
          <div
            role="status"
            className="relative flex flex-col items-center gap-3.5"
          >
            <div className="relative">
              <ConfettiBurst />
              <SuccessCheck />
            </div>
            <AnimatedHeadline
              as="h1"
              delay={0.3}
              className="text-[clamp(2rem,6vw,2.4rem)] font-bold"
              lines={[{ text: "You’re registered!" }]}
            />
            <FadeIn delay={0.6}>
              <p className="max-w-md leading-relaxed text-[#4A5060]">
                We’ve sent your ticket to{" "}
                {contact ? (
                  <strong className="break-words text-ink">
                    {contact.email}
                  </strong>
                ) : (
                  "your email"
                )}
                . Show your ticket code at the door to check in.
              </p>
            </FadeIn>
          </div>

          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 40, rotateX: -18 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 16,
              delay: 0.75,
            }}
            style={{ transformPerspective: 900 }}
          >
            <TicketCard
              className="w-full text-left"
              title={event.title}
              meta={`${formatWhen(event.startsAt)} · ${formatLocation(event)}`}
              attendee={record.name}
              status="Confirmed"
              code={record.ticketCode}
              actions={
                <CopyButton value={record.ticketCode} label="Copy code" />
              }
            />
          </motion.div>

          <FadeIn
            delay={1}
            className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row"
          >
            <Button onClick={() => window.print()}>Save ticket</Button>
            <a
              href={calendarUrl(event)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-[10px] border border-line-strong bg-white px-4 font-bold hover:bg-hover"
            >
              <CalendarPlus className="size-[18px]" aria-hidden /> Add to
              calendar
            </a>
          </FadeIn>
          <p className="text-sm text-muted">
            Lost your code later?{" "}
            <Link href="/#tickets" className="font-bold text-brand-600">
              Look up your ticket
            </Link>
          </p>
        </div>
      )}
    </FlowLayout>
  );
}
