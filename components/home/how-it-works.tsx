"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion";

const STEP_MS = 5000;

const MockBox = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("rounded-[10px] border border-line-strong px-3.5 py-3 text-ink-soft", className)}>{children}</div>
);

const steps = [
  {
    title: "Create your event",
    short: "Details, venue and attendee limit.",
    label: "New event",
    body: "Add a title, venue or online link, date and attendee limit. Save a draft or publish when it’s ready.",
    preview: (
      <>
        <MockBox className="font-semibold text-ink">Product Design Meetup</MockBox>
        <div className="grid grid-cols-2 gap-2.5">
          <MockBox>Nov 14 · 6:00 PM</MockBox>
          <MockBox>Limit: 120</MockBox>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <MockBox className="border-2 border-brand-600 bg-brand-50 text-center font-extrabold text-brand-800">Free entry</MockBox>
          <MockBox className="text-center font-bold">1 ticket per email</MockBox>
        </div>
      </>
    ),
  },
  {
    title: "Share your link",
    short: "Guests register free, without an account.",
    label: "Registration link",
    body: "Share one link anywhere. Guests fill a short form and get a unique ticket code by email. Registration closes itself when you hit your limit.",
    preview: (
      <>
        <div className="flex items-center gap-2 rounded-[10px] border border-line-strong py-1.5 pr-1.5 pl-3.5">
          <span className="min-w-0 flex-1 truncate font-mono text-sm">evently.app/events/pdm-14/register</span>
          <span className="rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-bold text-white">Copy</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#4A5060]">Registrations</span>
          <span className="font-extrabold">86 / 120</span>
        </div>
        <Progress value={72} className="h-2" label="Registrations" />
      </>
    ),
  },
  {
    title: "Check guests in",
    short: "Search a name or code at the door.",
    label: "At the door",
    body: "Open check-in on your phone, search a name or code, and confirm the guest in one tap. Only you can access it.",
    preview: (
      <>
        <MockBox className="border-[1.5px] border-brand-600 font-mono font-semibold text-ink">EVT-7K2Q9X</MockBox>
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border-[1.5px] border-success-200 p-3.5">
          <span className="font-extrabold">Tolu Bakare</span>
          <span className="inline-flex items-center gap-1.5 font-bold text-success-700">
            <CheckCircle2 className="size-[18px]" aria-hidden /> Checked in
          </span>
        </div>
      </>
    ),
  },
];

export function HowItWorks() {
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.35 });
  const reduceMotion = useReducedMotion();
  const playing = autoplay && inView && !reduceMotion;
  const step = steps[active]!;

  // Walk through the steps on their own while the section is on screen.
  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % steps.length), STEP_MS);
    return () => clearTimeout(id);
  }, [playing, active]);

  return (
    <section ref={sectionRef} id="how" className="scroll-mt-20 bg-canvas">
      <div className="container-page flex flex-col gap-10 py-20 sm:py-24">
        <Reveal>
          <SectionHeading eyebrow="How it works" title="Three steps from idea to a full room." />
        </Reveal>
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-7">
          <div role="tablist" aria-label="Steps" className="flex flex-col gap-3 lg:flex-1">
            {steps.map((s, i) => (
              <button
                key={s.title}
                type="button"
                role="tab"
                aria-selected={i === active}
                onClick={() => {
                  setActive(i);
                  setAutoplay(false);
                }}
                className={cn(
                  "relative flex w-full items-start gap-4 overflow-hidden rounded-2xl border-[1.5px] p-5 text-left transition-colors",
                  i === active ? "border-brand-600" : "border-transparent hover:bg-white/60",
                )}
              >
                {i === active && (
                  <motion.span
                    layoutId="step-highlight"
                    className="absolute inset-0 -z-0 bg-white shadow-[0_10px_24px_rgba(79,63,224,0.10)]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span
                  className={cn(
                    "relative inline-flex size-9 shrink-0 items-center justify-center rounded-[10px] font-extrabold transition-colors",
                    i === active ? "bg-brand-600 text-white" : "bg-line text-ink-soft",
                  )}
                >
                  {i + 1}
                </span>
                <span className="relative flex flex-col gap-1">
                  <span className="text-lg font-extrabold">{s.title}</span>
                  <span className="text-[15px] leading-normal font-medium text-[#4A5060]">{s.short}</span>
                </span>
                {/* time until the next step */}
                {i === active && playing && (
                  <motion.span
                    key={`bar-${active}`}
                    className="absolute bottom-0 left-0 h-[3px] bg-brand-600"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: STEP_MS / 1000, ease: "linear" }}
                  />
                )}
              </button>
            ))}
          </div>
          <div role="tabpanel" className="card relative flex min-h-[300px] flex-col justify-center overflow-hidden rounded-[22px] p-6 sm:p-7 lg:flex-[1.3]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                className="flex flex-col gap-3.5"
                initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="text-[13px] font-extrabold tracking-[0.06em] text-muted uppercase">{step.label}</p>
                {step.preview}
                <p className="leading-relaxed text-[#4A5060]">{step.body}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
