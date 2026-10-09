import { cn } from "@/lib/utils";

/** A circle and tick that draw themselves, with a soft pulse ring. */
export function SuccessCheck({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 120 120" className={cn("size-[96px]", className)}>
      <circle className="ev-ring" cx="60" cy="60" r="40" fill="#22C55E" opacity=".25" />
      <circle cx="60" cy="60" r="44" fill="#E7F6EE" />
      <circle className="ev-draw" cx="60" cy="60" r="44" fill="none" stroke="#157F4A" strokeWidth="5" strokeLinecap="round" strokeDasharray="277" strokeDashoffset="277" transform="rotate(-90 60 60)" />
      <path className="ev-draw" style={{ animationDelay: ".55s" }} d="M40 62 l13 13 l27 -29" fill="none" stroke="#157F4A" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="70" strokeDashoffset="70" />
    </svg>
  );
}
