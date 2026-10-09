"use client";

import {
  Gauge,
  MailCheck,
  ScanLine,
  Ticket,
  UserRoundCheck,
  Users,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Spotlight } from "@/components/motion/interactive";
import { FeatureIcon } from "./feature-icon";

const features = [
  {
    icon: MailCheck,
    tone: "bg-warning-50 text-warning-700",
    title: "One registration per email",
    body: "Each email address can register once per event, so your guest list stays accurate.",
  },
  {
    icon: Users,
    tone: "bg-brand-100 text-brand-700",
    title: "Limits & deadlines",
    body: "Cap attendance, set a registration deadline, and close sign-ups automatically when you’re full.",
  },
  {
    icon: UserRoundCheck,
    tone: "bg-success-50 text-success-700",
    title: "No sign-up for guests",
    body: "Attendees register with a short form. Pick which fields to collect for each event.",
  },
  {
    icon: Ticket,
    tone: "bg-sky-100 text-sky-800",
    title: "Unique ticket codes",
    body: "Every registration gets its own code, like EVT-7K2Q9X, emailed straight to the attendee.",
  },
  {
    icon: ScanLine,
    tone: "bg-pink-100 text-pink-800",
    title: "Fast door check-in",
    body: "Sign in on any phone at the door and confirm guests by name or ticket code.",
  },
  {
    icon: Gauge,
    tone: "bg-hover text-ink",
    title: "Live dashboard",
    body: "Track registrations, spots left and check-ins across all your events in one view.",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="container-page flex scroll-mt-20 flex-col gap-10 py-20 sm:gap-12 sm:py-24"
    >
      <Reveal>
        <SectionHeading
          eyebrow="Features"
          title="Everything between “save the date” and “you’re in”."
          lead="Built for free meetups, workshops, conferences and parties, small or large."
        />
      </Reveal>
      <Stagger className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {features.map(({ icon, tone, title, body }) => (
          <StaggerItem key={title} className="flex">
            <Spotlight className="group card flex w-full flex-col gap-3 rounded-[18px] p-6 transition duration-300 hover:-translate-y-1.5 hover:border-brand-200 hover:shadow-[0_18px_40px_rgba(79,63,224,0.12)]">
              <FeatureIcon
                icon={icon}
                className={cn(
                  "inline-flex size-12 items-center justify-center rounded-[14px]",
                  tone,
                )}
              />
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="leading-relaxed text-[#4A5060]">{body}</p>
            </Spotlight>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
