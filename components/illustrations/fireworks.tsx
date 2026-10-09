import { cn } from "@/lib/utils";

const round = (n: number) => Math.round(n * 10) / 10; // identical numbers on server and browser

const BURSTS = [
  { x: 70, y: 70, r: 46, color: "#FFD84D", delay: 0 },
  { x: 250, y: 46, r: 34, color: "#F472B6", delay: -1 },
  { x: 380, y: 110, r: 52, color: "#2DD4BF", delay: -1.9 },
];

/** Looping firework bursts (decorative). */
export function Fireworks({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 440 220" className={cn("pointer-events-none", className)}>
      {BURSTS.map((b) => (
        <g key={b.x} transform={`translate(${b.x} ${b.y})`}>
          <g className="ev-burst" style={{ animationDelay: `${b.delay}s` }}>
            {Array.from({ length: 12 }, (_, i) => {
              const a = (i / 12) * Math.PI * 2;
              return (
                <line
                  key={i}
                  x1={round(Math.cos(a) * b.r * 0.35)}
                  y1={round(Math.sin(a) * b.r * 0.35)}
                  x2={round(Math.cos(a) * b.r)}
                  y2={round(Math.sin(a) * b.r)}
                  stroke={b.color}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              );
            })}
            <circle r="3" fill={b.color} />
          </g>
        </g>
      ))}
    </svg>
  );
}
