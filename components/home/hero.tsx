"use client";

import { useState } from "react";
import { ArrowRight, Plus } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { TicketCard } from "@/components/ui/ticket-card";
import { Progress } from "@/components/ui/progress";

type View = "organizer" | "attendee";

const previewEvents = [
  { title: "Product Design Meetup", mon: "NOV", day: "14", spots: "86 / 120", pct: 72, bg: "bg-night-800" },
  { title: "Founders Breakfast", mon: "OCT", day: "22", spots: "38 / 40", pct: 95, bg: "bg-[#0F766E]" },
];

function OrganizerPreview() {
  return (
    <div className="card flex w-full max-w-[500px] flex-col gap-4 rounded-[22px] p-5 shadow-[0_30px_60px_rgba(30,26,77,0.12)] sm:p-6">
      <div className="flex items-center justify-between">
        <p className="font-extrabold">Your events</p>
        <span className="inline-flex items-center gap-1 rounded-lg bg-brand-600 px-3 py-1.5 text-[13px] font-bold text-white">
          <Plus className="size-3.5" aria-hidden /> New event
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {[
          ["Registered", "86"],
          ["Spots left", "34"],
          ["Checked in", "52"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl bg-brand-50 p-3">
            <p className="text-xs font-semibold text-muted">{label}</p>
            <p className="font-display text-xl font-bold sm:text-2xl">{value}</p>
          </div>
        ))}
      </div>
      {previewEvents.map((e) => (
        <div key={e.title} className="flex items-center gap-3.5 rounded-2xl border border-line-soft p-3.5">
          <div className={`flex size-13 shrink-0 flex-col items-center justify-center rounded-xl text-white ${e.bg}`}>
            <span className="text-[10px] font-extrabold opacity-80">{e.mon}</span>
            <span className="font-display text-xl leading-none font-bold">{e.day}</span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex justify-between gap-2">
              <span className="truncate text-[15px] font-bold">{e.title}</span>
              <span className="shrink-0 text-[13px] font-bold text-muted">{e.spots}</span>
            </div>
            <Progress value={e.pct} label={`${e.title} capacity`} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Hero() {
  const [view, setView] = useState<View>("organizer");

  return (
    <section className="border-b border-brand-100 bg-brand-50">
      <div className="container-page flex flex-col items-center gap-12 py-14 sm:py-20 lg:flex-row lg:gap-14">
        <div className="flex w-full flex-col gap-6 lg:flex-1">
          <span className="inline-flex items-center gap-2 self-start rounded-full border border-brand-200 bg-white px-3.5 py-1.5 text-sm font-bold text-brand-700">
            <span className="size-2 rounded-full bg-success-600" aria-hidden />
            Free events, one ticket per guest
          </span>
          <h1 className="text-[clamp(2.5rem,6vw,4.25rem)] leading-[1.02] font-extrabold">
            Host events.
            <br />
            Fill every seat.
            <br />
            <span className="text-brand-600">Check guests in.</span>
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-[#4A5060] sm:text-[19px]">
            Evently gives organizers one place to publish a free event, take registrations and confirm
            attendees at the door. Your guests don’t need an account.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/auth/register" size="lg">
              Create your first event <ArrowRight className="size-[18px]" aria-hidden />
            </ButtonLink>
            <ButtonLink href="/#how" size="lg" variant="secondary">
              See how it works
            </ButtonLink>
          </div>
          <p className="text-sm text-muted">Free to start · No card required</p>
        </div>

        <div className="flex w-full flex-col items-center gap-4 lg:flex-1">
          <SegmentedControl
            label="Preview"
            value={view}
            onChange={setView}
            options={[
              { value: "organizer", label: "For organizers" },
              { value: "attendee", label: "For attendees" },
            ]}
          />
          {view === "organizer" ? (
            <OrganizerPreview />
          ) : (
            <TicketCard
              className="w-full max-w-[440px]"
              title="Product Design Meetup"
              meta="Sat, Nov 14 · 6:00 PM · Landmark Centre"
              attendee="Tolu Bakare"
              code="EVT-7K2Q9X"
              footer="Registered in under a minute, without creating an account."
            />
          )}
        </div>
      </div>
    </section>
  );
}
