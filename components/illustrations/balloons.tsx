import { cn } from "@/lib/utils";

const BALLOONS = [
  { x: 40, y: 40, color: "#FFD84D", delay: 0 },
  { x: 100, y: 10, color: "#F472B6", delay: -1.5 },
  { x: 160, y: 50, color: "#2DD4BF", delay: -3 },
];

/** Three bobbing balloons with strings (decorative). */
export function Balloons({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 220 240" className={cn("pointer-events-none", className)}>
      {BALLOONS.map((b) => (
        <g key={b.x} className="ev-bob" style={{ animationDelay: `${b.delay}s` }}>
          <path d={`M${b.x} ${b.y + 58} q -8 30 6 60 t -4 60`} stroke="rgba(255,255,255,.55)" strokeWidth="2" fill="none" />
          <ellipse cx={b.x} cy={b.y + 28} rx="26" ry="32" fill={b.color} />
          <ellipse cx={b.x - 9} cy={b.y + 16} rx="6" ry="10" fill="#fff" opacity=".35" />
          <path d={`M${b.x - 5} ${b.y + 60} h10 l-5 -6z`} fill={b.color} />
        </g>
      ))}
    </svg>
  );
}
