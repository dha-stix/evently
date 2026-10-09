"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Plus, ScanLine, Ticket, UserPlus } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { TicketCard } from "@/components/ui/ticket-card";
import {
  AnimatedHeadline,
  CountUp,
  Reveal,
  RotatingWords,
} from "@/components/motion";
import { EventStage } from "@/components/illustrations/event-stage";
import { CursorGlow, Magnetic, Tilt } from "@/components/motion/interactive";

type View = "organizer" | "attendee";

const previewEvents = [
  {
    title: "Product Design Meetup",
    mon: "NOV",
    day: "14",
    spots: "86 / 120",
    pct: 72,
    bg: "bg-night-800",
  },
  {
    title: "Founders Breakfast",
    mon: "OCT",
    day: "22",
    spots: "38 / 40",
    pct: 95,
    bg: "bg-[#0F766E]",
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

function OrganizerPreview() {
  return (
    <div className="card flex w-full max-w-[500px] flex-col gap-4 rounded-[22px] p-5 shadow-[0_30px_60px_rgba(30,26,77,0.12)] sm:p-6">
      <div className="flex items-center justify-between">
        <p className="font-extrabold">Your events</p>
        <motion.span
          className="relative inline-flex items-center gap-1 overflow-hidden rounded-lg bg-brand-600 px-3 py-1.5 text-[13px] font-bold text-white ev-shine"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
        >
          <Plus className="size-3.5" aria-hidden /> New event
        </motion.span>
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {[
          ["Registered", 86],
          ["Spots left", 34],
          ["Checked in", 52],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl bg-brand-50 p-3">
            <p className="text-xs font-semibold text-muted">{label}</p>
            <p className="font-display text-xl font-bold sm:text-2xl">
              <CountUp value={value as number} />
            </p>
          </div>
        ))}
      </div>
      {previewEvents.map((e, i) => (
        <motion.div
          key={e.title}
          className="flex items-center gap-3.5 rounded-2xl border border-line-soft p-3.5"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 + i * 0.15, ease: EASE }}
          whileHover={{ y: -3, boxShadow: "0 12px 28px rgba(30,26,77,0.12)" }}
        >
          <div
            className={`flex size-13 shrink-0 flex-col items-center justify-center rounded-xl text-white ${e.bg}`}
          >
            <span className="text-[10px] font-extrabold opacity-80">
              {e.mon}
            </span>
            <span className="font-display text-xl leading-none font-bold">
              {e.day}
            </span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex justify-between gap-2">
              <span className="truncate text-[15px] font-bold">{e.title}</span>
              <span className="shrink-0 text-[13px] font-bold text-muted">
                {e.spots}
              </span>
            </div>
            {/* capacity bar fills up on load */}
            <div
              role="progressbar"
              aria-valuenow={e.pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${e.title} capacity`}
              className="h-1.5 overflow-hidden rounded-full bg-[#EBECF0]"
            >
              <motion.div
                className="h-full rounded-full bg-brand-600"
                initial={{ width: 0 }}
                animate={{ width: `${e.pct}%` }}
                transition={{
                  duration: 1.2,
                  delay: 0.8 + i * 0.15,
                  ease: EASE,
                }}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* Sample activity for the floating "live" notifications around the preview */
const activity = [
  [
    {
      icon: UserPlus,
      tone: "bg-brand-100 text-brand-700",
      title: "Ada Okafor registered",
      meta: "Product Design Meetup · just now",
    },
    {
      icon: UserPlus,
      tone: "bg-brand-100 text-brand-700",
      title: "Kemi Ade registered",
      meta: "Founders Breakfast · 1m ago",
    },
    {
      icon: Ticket,
      tone: "bg-warning-50 text-warning-700",
      title: "Ticket EVT-3HQ8LM sent",
      meta: "Delivered to inbox",
    },
  ],
  [
    {
      icon: ScanLine,
      tone: "bg-success-50 text-success-700",
      title: "Tolu B. checked in",
      meta: "Door A · 6:02 PM",
    },
    {
      icon: ScanLine,
      tone: "bg-success-50 text-success-700",
      title: "Sam E. checked in",
      meta: "Door A · 6:04 PM",
    },
    {
      icon: UserPlus,
      tone: "bg-pink-100 text-pink-800",
      title: "+12 registrations",
      meta: "In the last hour",
    },
  ],
] as const;

// one notification at a time, alternating registrations and check-ins
const feed = [0, 1, 2].flatMap((n) => [activity[0][n], activity[1][n]]);

function LiveToast({ className }: { className?: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % feed.length), 4000);
    return () => clearInterval(id);
  }, []);
  const a = feed[i];
  const Icon = a.icon;
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute z-20 hidden md:block ${className}`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/90 py-2.5 pr-4 pl-2.5 shadow-[0_18px_40px_rgba(30,26,77,0.16)] backdrop-blur"
          initial={{ opacity: 0, y: 14, scale: 0.9, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, scale: 0.95, filter: "blur(4px)" }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <span
            className={`inline-flex size-9 items-center justify-center rounded-xl ${a.tone}`}
          >
            <Icon className="size-[18px]" />
          </span>
          <span className="flex flex-col">
            <span className="text-sm font-extrabold whitespace-nowrap">
              {a.title}
            </span>
            <span className="text-xs font-semibold whitespace-nowrap text-muted">
              {a.meta}
            </span>
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function Hero() {
  const [view, setView] = useState<View>("organizer");

  return (
    <section className="relative overflow-hidden border-b border-brand-100 bg-brand-50">
      {/* backdrop: grid, drifting aurora blobs and a glow that follows the cursor */}
      <div
        aria-hidden
        className="ev-grid pointer-events-none absolute inset-0"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="ev-aurora absolute -top-40 -left-32 size-[520px] rounded-full bg-[#7B6BFF]/25 blur-3xl" />
        <div
          className="ev-aurora absolute top-1/3 -right-40 size-[560px] rounded-full bg-[#F472B6]/20 blur-3xl"
          style={{ animationDelay: "-6s" }}
        />
        <div
          className="ev-aurora absolute -bottom-48 left-1/3 size-[480px] rounded-full bg-[#2DD4BF]/15 blur-3xl"
          style={{ animationDelay: "-12s" }}
        />
      </div>
      <CursorGlow />
      <div className="container-page flex flex-col items-center gap-12 pt-[calc(72px+3.5rem)] pb-14 sm:pt-[calc(72px+5rem)] sm:pb-20 lg:flex-row lg:gap-14">
        <div className="relative z-10 flex w-full flex-col gap-6 lg:flex-1">
          <motion.span
            className="inline-flex items-center gap-2 self-start rounded-full border border-brand-200 bg-white px-3.5 py-1.5 text-sm font-bold text-brand-700"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <span className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-success-600 opacity-60 motion-reduce:hidden" />
              <span className="relative size-2 rounded-full bg-success-600" />
            </span>
            Free events for{" "}
            <RotatingWords
              words={[
                "meetups",
                "workshops",
                "conferences",
                "parties",
                "hackathons",
              ]}
              className="text-brand-600"
            />
          </motion.span>

          <AnimatedHeadline
            className="text-[clamp(2.5rem,6vw,4.25rem)] leading-[1.02] font-extrabold"
            delay={0.15}
            lines={[
              { text: "Host events." },
              { text: "Fill every seat." },
              { text: "Check guests in.", wordClassName: "ev-gradient-text" },
            ]}
          />

          <Reveal delay={0.55}>
            <p className="max-w-xl text-lg leading-relaxed text-[#4A5060] sm:text-[19px]">
              Evently gives organizers one place to publish a free event, take
              registrations and confirm attendees at the door. Your guests don’t
              need an account.
            </p>
          </Reveal>
          <Reveal delay={0.7} className="flex flex-col gap-3 sm:flex-row">
            <Magnetic>
              <ButtonLink
                href="/auth/register"
                size="lg"
                className="group relative w-full overflow-hidden shadow-[0_12px_30px_rgba(79,63,224,0.35)] ev-shine"
              >
                Create your first event
                <ArrowRight
                  className="size-[18px] transition-transform group-hover:translate-x-1"
                  aria-hidden
                />
              </ButtonLink>
            </Magnetic>
            <Magnetic>
              <ButtonLink
                href="/#how"
                size="lg"
                variant="secondary"
                className="w-full"
              >
                See how it works
              </ButtonLink>
            </Magnetic>
          </Reveal>
          <Reveal delay={0.85}>
            <p className="text-sm text-muted">
              Free to start · No card required
            </p>
          </Reveal>
        </div>

        <motion.div
          className="relative flex w-full flex-col items-center gap-4 lg:flex-1"
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
        >
          {/* spotlights, party lights and confetti behind the preview */}
          <EventStage className="-inset-x-10 -top-4 -bottom-16 sm:-inset-x-16 sm:-top-16" />

          <SegmentedControl
            label="Preview"
            value={view}
            onChange={setView}
            className="relative"
            options={[
              { value: "organizer", label: "For organizers" },
              { value: "attendee", label: "For attendees" },
            ]}
          />
          <Tilt className="relative flex w-full justify-center">
            <div className="ev-float relative flex w-full justify-center">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={view}
                  className="flex w-full justify-center"
                  initial={{ opacity: 0, y: 16, rotateX: -8 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, y: -12, rotateX: 8 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
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
                </motion.div>
              </AnimatePresence>
            </div>
            <LiveToast className="-right-4 -bottom-10 lg:-right-10" />
          </Tilt>
        </motion.div>
      </div>
    </section>
  );
}
