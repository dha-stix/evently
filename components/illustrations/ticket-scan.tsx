import { cn } from "@/lib/utils";
import { seeded } from "./confetti";

/** A ticket being scanned: QR code, sweeping laser and a pulsing "verified" badge. */
export function TicketScan({ className }: { className?: string }) {
  const r = seeded(42);
  const cells: [number, number][] = [];
  for (let y = 0; y < 9; y++) for (let x = 0; x < 9; x++) if (r() > 0.5) cells.push([x, y]);
  const finder = (x: number, y: number) => (
    <g transform={`translate(${x} ${y})`}>
      <rect width="30" height="30" rx="5" fill="#16132E" />
      <rect x="6" y="6" width="18" height="18" rx="3" fill="#fff" />
      <rect x="10" y="10" width="10" height="10" rx="2" fill="#16132E" />
    </g>
  );
  return (
    <svg aria-hidden viewBox="0 0 360 250" className={cn("w-full", className)}>
      <defs>
        <linearGradient id="laser" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2DD4BF" stopOpacity="0" />
          <stop offset=".5" stopColor="#2DD4BF" />
          <stop offset="1" stopColor="#2DD4BF" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* ticket body with perforated notches */}
      <g className="ev-float">
        <path d="M30 30 h300 a14 14 0 0 1 0 0 v62 a18 18 0 0 0 0 36 v92 h-300 v-92 a18 18 0 0 0 0 -36 z" fill="#fff" />
        <path d="M30 30 h300 v62 a18 18 0 0 0 0 36 v92 h-300 v-92 a18 18 0 0 0 0 -36 z" fill="none" stroke="#DCD8FB" strokeWidth="2" />
        <line x1="44" y1="110" x2="316" y2="110" stroke="#DCD8FB" strokeWidth="3" strokeDasharray="7 7" />
        <rect x="30" y="30" width="300" height="52" rx="0" fill="#1E1A4D" />
        <text x="50" y="62" fill="#C9C5E8" fontFamily="var(--font-manrope)" fontWeight="700" fontSize="13" letterSpacing="3">ADMIT ONE</text>
        <circle cx="300" cy="56" r="10" fill="#2DD4BF" />
        {/* QR code */}
        <g transform="translate(58 128)">
          {cells.map(([x, y]) => (
            <rect key={`${x}-${y}`} x={x * 9.6} y={y * 9.6} width="8" height="8" rx="1.5" fill="#16132E" />
          ))}
          {finder(0, 0)}
          {finder(56, 0)}
          {finder(0, 56)}
        </g>
        <text x="170" y="160" fill="#5A6070" fontFamily="var(--font-manrope)" fontWeight="700" fontSize="11" letterSpacing="2">TICKET CODE</text>
        <text x="170" y="188" fill="#111318" fontFamily="var(--font-jetbrains)" fontWeight="600" fontSize="20" letterSpacing="2">EVT-7K2Q9X</text>
        {/* laser */}
        <g className="ev-scan" style={{ ["--ev-scan" as string]: "88px" }}>
          <rect x="40" y="124" width="280" height="4" rx="2" fill="url(#laser)" />
          <rect x="40" y="120" width="280" height="12" rx="6" fill="url(#laser)" opacity=".25" />
        </g>
      </g>
      {/* verified badge */}
      <g transform="translate(318 196)">
        <circle className="ev-ring" r="20" fill="#22C55E" opacity=".5" />
        <circle r="20" fill="#22C55E" />
        <path d="M-8 0 l5 5 l10 -11" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
    </svg>
  );
}
