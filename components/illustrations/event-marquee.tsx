import { Briefcase, Code2, GraduationCap, Mic2, Music2, PartyPopper, Presentation, Users } from "lucide-react";

const TYPES = [
  { label: "Meetups", icon: Users },
  { label: "Workshops", icon: GraduationCap },
  { label: "Conferences", icon: Presentation },
  { label: "Hackathons", icon: Code2 },
  { label: "Concerts", icon: Music2 },
  { label: "Talks", icon: Mic2 },
  { label: "Networking", icon: Briefcase },
  { label: "Parties", icon: PartyPopper },
];

/** Endless ribbon of event types (decorative; pauses with reduced motion). */
export function EventMarquee() {
  const row = [...TYPES, ...TYPES];
  return (
    <div className="relative overflow-hidden border-y border-brand-100 bg-white py-4 [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]">
      <p className="sr-only">Built for meetups, workshops, conferences, hackathons, concerts, talks, networking events and parties.</p>
      <div aria-hidden className="ev-marquee flex w-max gap-3">
        {row.map(({ label, icon: Icon }, i) => (
          <span key={i} className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-4 py-2 text-sm font-bold whitespace-nowrap text-ink-soft">
            <Icon className="size-4 text-brand-600" aria-hidden />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
