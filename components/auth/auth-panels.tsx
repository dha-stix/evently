import { CalendarDays, CheckCircle2, Users } from "lucide-react";
import { TicketCard } from "@/components/ui/ticket-card";

export function LoginPanel() {
  return (
    <>
      <div className="flex max-w-lg flex-col gap-5">
        <h2 className="text-5xl leading-[1.04] font-bold">
          Plan it. Share it.
          <br />
          Check them in.
        </h2>
        <p className="text-lg leading-relaxed text-night-300">
          Create free events, take registrations and confirm attendees at the door, all from one dashboard.
        </p>
      </div>
      <TicketCard
        className="max-w-[380px] -rotate-3 shadow-[0_30px_60px_rgba(0,0,0,0.35)]"
        title="Product Design Meetup"
        meta="Sat, Nov 14 · 6:00 PM · Landmark Centre"
        code="EVT-7K2Q9X"
      />
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
      <h2 className="text-5xl leading-[1.06] font-bold">Your next event starts with one form.</h2>
      <ul className="flex flex-col gap-5">
        {benefits.map(({ icon: Icon, title, body }) => (
          <li key={title} className="flex items-start gap-4">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#2A2552] text-brand-300">
              <Icon className="size-5" strokeWidth={1.8} aria-hidden />
            </span>
            <div>
              <p className="font-bold">{title}</p>
              <p className="mt-1 leading-normal text-night-300">{body}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
