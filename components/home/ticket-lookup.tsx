"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
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
    if (!code.trim()) return setError("Enter the code from your confirmation email.");
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
    <section id="tickets" className="scroll-mt-20 bg-night-900 text-white">
      <div className="container-page flex flex-col gap-10 py-20 sm:py-24 lg:flex-row lg:items-center lg:gap-12">
        <div className="lg:flex-1">
          <SectionHeading
            light
            eyebrow="For attendees"
            title="Already registered? Find your ticket."
            lead={
              <>
                No account, no password. Enter the code from your confirmation email to see your ticket. Try{" "}
                <span className="font-mono text-white">EVT-7K2Q9X</span>.
              </>
            }
          />
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-[22px] bg-white p-5 text-ink sm:p-6 lg:flex-1">
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
          {ticket && (
            <div role="status" className="flex flex-col gap-1.5 rounded-2xl border border-success-200 bg-success-50 p-4">
              <span className="inline-flex items-center gap-2 font-extrabold text-success-700">
                <CheckCircle2 className="size-[18px]" aria-hidden />
                {ticket.checkedInAt ? "Ticket confirmed · Checked in" : "Ticket confirmed"}
              </span>
              <span>
                {ticket.name} · {ticket.event.title}
              </span>
              <span className="text-sm text-ink-soft">
                {formatWhen(ticket.event.startsAt)} · {formatLocation(ticket.event)}
              </span>
            </div>
          )}
          {error && (
            <p role="alert" className="rounded-2xl border border-danger-200 bg-danger-50 p-4 font-semibold text-danger-700">
              {error}
            </p>
          )}
          <Button type="submit" size="lg" block loading={loading}>
            Look up ticket
          </Button>
        </form>
      </div>
    </section>
  );
}
