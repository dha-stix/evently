import { CalendarDays, CheckCircle2, Users } from "lucide-react";
import { TicketCard } from "@/components/ui/ticket-card";
import { AnimatedHeadline, Stagger, StaggerItem } from "@/components/motion";
import { FadeIn } from "@/components/motion/fade-in";

export function LoginPanel() {
  return (
    <>
      <div className="flex max-w-lg flex-col gap-5">
        <AnimatedHeadline
          as="h2"
          className="text-5xl leading-[1.04] font-bold"
          delay={0.2}
          lines={[{ text: "Plan it. Share it." }, { text: "Check them in.", className: "text-brand-300" }]}
        />
        <FadeIn delay={0.6}>
          <p className="text-lg leading-relaxed text-night-300">
            Create free events, take registrations and confirm attendees at the door, all from one dashboard.
          </p>
        </FadeIn>
      </div>
      <FadeIn delay={0.8}>
        <div className="ev-float-rot max-w-[380px]">
          <TicketCard
            className="shadow-[0_30px_60px_rgba(0,0,0,0.35)]"
            title="Product Design Meetup"
            meta="Sat, Nov 14 · 6:00 PM · Landmark Centre"
            code="EVT-7K2Q9X"
          />
        </div>
      </FadeIn>
    </>
  );
}

const benefits = [
  { icon: CalendarDays, title: "Publish in minutes", body: "Set the venue, time and attendee limit, then share one link." },
  { icon: Users, title: "No accounts for attendees", body: "Guests register with a form and get a unique ticket code." },
  { icon: CheckCircle2, title: "Fast check-in at the door", body: "Search by name or code and confirm attendees in a tap." },
];

export function RegisterPanel() {
  return (
    <div className="flex max-w-lg flex-col gap-8">
      <AnimatedHeadline
        as="h2"
        className="text-5xl leading-[1.06] font-bold"
        delay={0.2}
        lines={[{ text: "Your next event" }, { text: "starts with one form.", className: "text-brand-300" }]}
      />
      <Stagger onMount className="flex flex-col gap-5">
        {benefits.map(({ icon: Icon, title, body }) => (
          <StaggerItem key={title} className="flex items-start gap-4">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#2A2552] text-brand-300">
              <Icon className="size-5" strokeWidth={1.8} aria-hidden />
            </span>
            <div>
              <p className="font-bold">{title}</p>
              <p className="mt-1 leading-normal text-night-300">{body}</p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
