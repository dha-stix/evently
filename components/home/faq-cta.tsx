"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion";
import { Balloons } from "@/components/illustrations/balloons";
import { Fireworks } from "@/components/illustrations/fireworks";
import { Magnetic } from "@/components/motion/interactive";

const faqs = [
  [
    "Do attendees need an account?",
    "No. Attendees fill a short registration form and receive a unique ticket code by email. They use that code to find their ticket or check in.",
  ],
  [
    "Can the same person register twice?",
    "No. Each email address can register once per event, and every registration is one attendee with its own ticket code.",
  ],
  [
    "What happens when my event is full?",
    "Set an attendee limit and registration closes automatically when it is reached. You can also close or reopen registration manually at any time.",
  ],
  [
    "How does check-in work at the venue?",
    "Sign in on any phone or laptop and open check-in from your event page. Search by name or ticket code and confirm each guest with one tap. Only you, the organizer, can access it.",
  ],
  [
    "Can I see who has registered?",
    "Every event has a private page, visible only to you, with the full attendee list, contact details, check-in status and a CSV export.",
  ],
] as const;

export function FaqCta() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative scroll-mt-20 overflow-hidden bg-gradient-to-b from-white via-brand-50 to-[#EEECFD]"
    >
      {/* soft purple glows; the gradient carries on into the footer */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="ev-aurora absolute top-24 -left-40 size-[520px] rounded-full bg-[#7B6BFF]/15 blur-3xl" />
        <div
          className="ev-aurora absolute -right-40 bottom-10 size-[560px] rounded-full bg-[#A855F7]/15 blur-3xl"
          style={{ animationDelay: "-8s" }}
        />
        {/* fade the glows out so the gradient meets the footer without a seam */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#EEECFD]" />
      </div>
      <div className="container-page relative flex flex-col gap-16 pt-20 pb-24 sm:pt-24">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          <Reveal className="lg:flex-1">
            <SectionHeading eyebrow="FAQ" title="Questions, answered." />
          </Reveal>
          <div className="border-t border-line lg:flex-2">
            {faqs.map(([q, a], i) => {
              const isOpen = open === i;
              return (
                <Reveal
                  key={q}
                  delay={i * 0.06}
                  y={14}
                  className="border-b border-line"
                >
                  <h3 className="font-sans tracking-normal">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`faq-${i}`}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex w-full items-center justify-between gap-4 py-5 text-left text-[17px] font-bold sm:text-lg"
                    >
                      {q}
                      <span
                        className={cn(
                          "inline-flex size-8 shrink-0 items-center justify-center rounded-full transition duration-200",
                          isOpen
                            ? "rotate-45 bg-brand-600 text-white"
                            : "bg-hover",
                        )}
                      >
                        <Plus
                          className="size-4"
                          strokeWidth={2.4}
                          aria-hidden
                        />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`faq-${i}`}
                    className={cn(
                      "grid transition-[grid-template-rows] duration-300",
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <p className="overflow-hidden pr-12 leading-relaxed text-[#4A5060]">
                      <span className="block pb-5">{a}</span>
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        <Reveal
          y={40}
          className="relative flex flex-col gap-7 overflow-hidden rounded-[28px] bg-[linear-gradient(120deg,#3A2BC0_0%,#4F3FE0_40%,#6D4AE8_70%,#7C3AED_100%)] p-8 text-white shadow-[0_24px_50px_rgba(79,63,224,0.28)] sm:p-12 lg:flex-row lg:items-center lg:justify-between lg:p-16"
        >
          <Fireworks className="absolute -top-6 right-4 hidden w-[380px] opacity-80 md:block" />
          <Balloons className="absolute -right-4 -bottom-10 hidden w-48 opacity-90 md:block lg:right-[34%]" />
          <div className="relative flex max-w-xl flex-col gap-3">
            <h2 className="text-[clamp(1.9rem,4vw,2.75rem)] leading-[1.08] font-bold">
              Your next event is one form away.
            </h2>
            <p className="text-lg leading-relaxed text-white/90">
              Create an account, publish an event, and share your link today.
            </p>
          </div>
          <div className="relative flex flex-col gap-3 sm:flex-row">
            <Magnetic>
              <ButtonLink
                href="/auth/register"
                variant="white"
                size="lg"
                className="relative w-full overflow-hidden ev-shine"
              >
                Get started free
              </ButtonLink>
            </Magnetic>
            <Magnetic>
              <ButtonLink
                href="/auth/login"
                variant="outline-light"
                size="lg"
                className="w-full"
              >
                Sign in
              </ButtonLink>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
