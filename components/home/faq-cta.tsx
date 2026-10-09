"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const faqs = [
  ["Do attendees need an account?", "No. Attendees fill a short registration form and receive a unique ticket code by email. They use that code to find their ticket or check in."],
  ["Can the same person register twice?", "No. Each email address can register once per event, and every registration is one attendee with its own ticket code."],
  ["What happens when my event is full?", "Set an attendee limit and registration closes automatically when it is reached. You can also close or reopen registration manually at any time."],
  ["How does check-in work at the venue?", "Sign in on any phone or laptop and open check-in from your event page. Search by name or ticket code and confirm each guest with one tap. Only you, the organizer, can access it."],
  ["Can I see who has registered?", "Every event has a private page, visible only to you, with the full attendee list, contact details, check-in status and a CSV export."],
] as const;

export function FaqCta() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="container-page flex scroll-mt-20 flex-col gap-16 pt-20 pb-16 sm:pt-24">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        <SectionHeading eyebrow="FAQ" title="Questions, answered." className="lg:flex-1" />
        <div className="border-t border-line lg:flex-2">
          {faqs.map(([q, a], i) => {
            const isOpen = open === i;
            return (
              <div key={q} className="border-b border-line">
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
                        isOpen ? "rotate-45 bg-brand-600 text-white" : "bg-hover",
                      )}
                    >
                      <Plus className="size-4" strokeWidth={2.4} aria-hidden />
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-${i}`}
                  className={cn("grid transition-[grid-template-rows] duration-300", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
                >
                  <p className="overflow-hidden pr-12 leading-relaxed text-[#4A5060]">
                    <span className="block pb-5">{a}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-7 rounded-[28px] bg-brand-600 p-8 text-white sm:p-12 lg:flex-row lg:items-center lg:justify-between lg:p-16">
        <div className="flex max-w-xl flex-col gap-3">
          <h2 className="text-[clamp(1.9rem,4vw,2.75rem)] leading-[1.08] font-bold">Your next event is one form away.</h2>
          <p className="text-lg leading-relaxed text-brand-100">Create an account, publish an event, and share your link today.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/auth/register" variant="white" size="lg">Get started free</ButtonLink>
          <ButtonLink href="/auth/login" variant="outline-light" size="lg">Sign in</ButtonLink>
        </div>
      </div>
    </section>
  );
}
