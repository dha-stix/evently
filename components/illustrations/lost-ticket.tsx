import { cn } from "@/lib/utils";
import { Sparkle } from "./event-stage";

/** A ticket torn in two with "404" across it — the halves drift apart for the not-found page. */
export function LostTicket({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 360 200" className={cn("w-full max-w-[360px]", className)}>
      <ellipse cx="180" cy="182" rx="120" ry="10" fill="#1E1A4D" opacity=".08" />

      {/* left half */}
      <g transform="translate(34 30) rotate(-8 70 60)">
        <g className="ev-float">
          <path
            d="M14 0 H140 l-8 14 l8 14 l-8 14 l8 14 l-8 14 l8 14 l-8 14 l8 14 H14 a14 14 0 0 1 -14 -14 V70 a12 12 0 0 0 0 -24 V14 a14 14 0 0 1 14 -14Z"
            fill="#4F3FE0"
          />
          <path d="M28 22 H96" stroke="#B7AEFF" strokeWidth="6" strokeLinecap="round" opacity=".7" />
          <text x="24" y="92" fill="#fff" fontSize="52" fontWeight="800" fontFamily="var(--font-bricolage), sans-serif">
            40
          </text>
        </g>
      </g>

      {/* right half */}
      <g transform="translate(184 36) rotate(9 70 60)">
        <g className="ev-float" style={{ animationDelay: "-2.5s" }}>
          <path
            d="M8 0 H126 a14 14 0 0 1 14 14 V46 a12 12 0 0 0 0 24 V98 a14 14 0 0 1 -14 14 H8 l8 -14 l-8 -14 l8 -14 l-8 -14 l8 -14 l-8 -14 l8 -14 Z"
            fill="#6E5CF6"
          />
          <path d="M40 22 H112" stroke="#DCD8FB" strokeWidth="6" strokeLinecap="round" opacity=".7" />
          <text x="36" y="92" fill="#fff" fontSize="52" fontWeight="800" fontFamily="var(--font-bricolage), sans-serif">
            4
          </text>
          <circle cx="104" cy="76" r="9" fill="#FFD84D" className="ev-twinkle" />
        </g>
      </g>

      <Sparkle x={30} y={28} size={10} />
      <Sparkle x={330} y={40} size={12} color="#F472B6" delay={0.8} />
      <Sparkle x={182} y={18} size={8} color="#2DD4BF" delay={1.4} />
      <Sparkle x={320} y={160} size={9} color="#7B6BFF" delay={0.4} />
    </svg>
  );
}
