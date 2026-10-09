"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/motion";
import { TicketScan } from "@/components/illustrations/ticket-scan";
import { SectionHeading } from "@/components/ui/section-heading";
import { SectionEdge } from "@/components/ui/section-edge";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { lookupTicket } from "@/lib/firebase-actions";
import { formatLocation, formatWhen } from "@/lib/utils";
import type { TicketLookup as Ticket } from "@/types";

export function TicketLookup() {
  const [code, setCode] = useState("");
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim())
      return setError("Enter the code from your confirmation email.");
    setLoading(true);
    setError(null);
    setTicket(null);
    try {
      setTicket(await lookupTicket(code));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="tickets"
      className="relative scroll-mt-20 overflow-hidden bg-night-900 text-white"
    >
      <SectionEdge variant="skew" position="top" color="#f5f6f8" />
      <SectionEdge variant="skew" position="bottom" color="#ffffff" />
      <div className="container-page relative flex flex-col gap-10 py-24 sm:py-32 lg:flex-row lg:items-center lg:gap-12">
        <Reveal className="flex flex-col gap-8 lg:flex-1">
          <SectionHeading
            light
            eyebrow="For attendees"
            title="Already registered? Find your ticket."
            lead={
              <>
                No account, no password. Enter the code from your confirmation
                email to see your ticket. Try{" "}
                <span className="font-mono text-white">EVT-7K2Q9X</span>.
              </>
            }
          />
          <TicketScan className="max-w-[420px]" />
        </Reveal>
        <Reveal delay={0.15} className="lg:flex-1">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 rounded-[22px] bg-white p-5 text-ink shadow-[0_30px_60px_rgba(0,0,0,0.35)] sm:p-6"
          >
            <Field label="Ticket code">
              {(p) => (
                <Input
                  {...p}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="EVT-XXXXXX"
                  autoComplete="off"
                  className="h-14 font-mono text-[17px] tracking-[0.06em] uppercase"
                />
              )}
            </Field>
            <AnimatePresence mode="popLayout">
              {ticket && (
                <motion.div
                  key={ticket.ticketCode}
                  role="status"
                  className="flex flex-col gap-1.5 rounded-2xl border border-success-200 bg-success-50 p-4"
                  initial={{ opacity: 0, scale: 0.92, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 420, damping: 26 }}
                >
                  <span className="inline-flex items-center gap-2 font-extrabold text-success-700">
                    <CheckCircle2 className="size-[18px]" aria-hidden />
                    {ticket.checkedInAt
                      ? "Ticket confirmed · Checked in"
                      : "Ticket confirmed"}
                  </span>
                  <span>
                    {ticket.name} · {ticket.event.title}
                  </span>
                  <span className="text-sm text-ink-soft">
                    {formatWhen(ticket.event.startsAt)} ·{" "}
                    {formatLocation(ticket.event)}
                  </span>
                </motion.div>
              )}
              {error && (
                <motion.p
                  key={error}
                  role="alert"
                  className="rounded-2xl border border-danger-200 bg-danger-50 p-4 font-semibold text-danger-700"
                  initial={{ opacity: 0, x: 0 }}
                  animate={{ opacity: 1, x: [0, -10, 9, -6, 4, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45 }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
            <Button type="submit" size="lg" block loading={loading}>
              Look up ticket
            </Button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
