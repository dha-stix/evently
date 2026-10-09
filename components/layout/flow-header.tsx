import { Check } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

const STEPS = ["Details", "Confirmed"] as const;

/** Public header for the attendee registration flow, with a progress stepper. */
export function FlowHeader({ step }: { step: 1 | 2 }) {
  return (
    <header className="border-b border-line bg-white">
      <div className="container-page flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-3.5">
        <Logo />
        <ol
          aria-label="Registration progress"
          className="flex items-center gap-2 text-sm font-bold sm:gap-2.5"
        >
          {STEPS.map((label, i) => {
            const n = i + 1;
            const done = n < step;
            const active = n === step;
            return (
              <li
                key={label}
                className="flex items-center gap-2 sm:gap-2.5"
                aria-current={active ? "step" : undefined}
              >
                {i > 0 && (
                  <span
                    aria-hidden
                    className={cn(
                      "h-0.5 w-4 sm:w-7",
                      done || active ? "bg-success-600" : "bg-line-strong",
                    )}
                  />
                )}
                <span
                  className={cn(
                    "inline-flex size-[26px] items-center justify-center rounded-full text-[13px]",
                    done && "bg-success-600 text-white",
                    active && "bg-brand-600 text-white",
                    !done && !active && "bg-line text-ink-soft",
                  )}
                >
                  {done ? (
                    <Check className="size-3.5" strokeWidth={3} aria-hidden />
                  ) : (
                    n
                  )}
                </span>
                <span
                  className={cn(
                    "hidden sm:inline",
                    done
                      ? "text-success-700"
                      : active
                        ? "text-ink"
                        : "text-muted",
                  )}
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </header>
  );
}
