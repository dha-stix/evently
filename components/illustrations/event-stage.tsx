import { cn } from "@/lib/utils";

const BULBS = [40, 92, 144, 196, 248, 300, 352, 404, 456, 508];

/** 4-point sparkle */
export const Sparkle = ({
  x,
  y,
  size = 14,
  color = "#FFD84D",
  delay = 0,
}: {
  x: number;
  y: number;
  size?: number;
  color?: string;
  delay?: number;
}) => (
  // position on the outer group; the CSS animation (which sets `transform`) runs on the inner path
  <g transform={`translate(${x} ${y})`}>
    <path
      className="ev-twinkle"
      style={{ animationDelay: `${delay}s` }}
      d={`M0 ${-size} C ${size * 0.15} ${-size * 0.15} ${size * 0.15} ${-size * 0.15} ${size} 0 C ${size * 0.15} ${size * 0.15} ${size * 0.15} ${size * 0.15} 0 ${size} C ${-size * 0.15} ${size * 0.15} ${-size * 0.15} ${size * 0.15} ${-size} 0 C ${-size * 0.15} ${-size * 0.15} ${-size * 0.15} ${-size * 0.15} 0 ${-size} Z`}
      fill={color}
    />
  </g>
);

/**
 * Event stage scene: sweeping spotlights, a string of party lights, sparkles and confetti.
 * Purely decorative; sits behind the hero preview.
 */
export function EventStage({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
    >
      <svg
        viewBox="0 0 560 520"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7B6BFF" stopOpacity=".38" />
            <stop offset="1" stopColor="#7B6BFF" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="beam2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2DD4BF" stopOpacity=".32" />
            <stop offset="1" stopColor="#2DD4BF" stopOpacity="0" />
          </linearGradient>
          <filter id="soft-beam" x="-40%" y="-10%" width="180%" height="120%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
          <linearGradient id="stage" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#DCD8FB" />
            <stop offset="1" stopColor="#EEECFD" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* spotlights */}
        <polygon
          className="ev-sweep"
          style={{ transformOrigin: "50% 0%" }}
          points="114,0 126,0 250,520 -10,520"
          fill="url(#beam)"
          filter="url(#soft-beam)"
        />
        <polygon
          className="ev-sweep"
          style={{ transformOrigin: "50% 0%", animationDelay: "-3.5s" }}
          points="434,0 446,0 570,520 310,520"
          fill="url(#beam2)"
          filter="url(#soft-beam)"
        />

        {/* string of party lights */}
        <path
          d="M0 26 Q 280 92 560 26"
          stroke="#B7AEFF"
          strokeWidth="2"
          fill="none"
          opacity=".7"
        />
        {BULBS.map((x, i) => {
          const t = x / 560;
          const y = 26 + 4 * 66 * t * (1 - t);
          return (
            <g key={x}>
              <line
                x1={x}
                y1={y}
                x2={x}
                y2={y + 8}
                stroke="#B7AEFF"
                strokeWidth="2"
              />
              <circle
                className="ev-twinkle"
                style={{ animationDelay: `${i * 0.25}s` }}
                cx={x}
                cy={y + 15}
                r="7"
                fill={["#FFD84D", "#F472B6", "#2DD4BF", "#7B6BFF"][i % 4]}
              />
            </g>
          );
        })}

        {/* stage floor */}
        <ellipse
          cx="280"
          cy="500"
          rx="300"
          ry="60"
          fill="url(#stage)"
          opacity=".8"
        />

        <Sparkle x={60} y={150} size={12} delay={0.2} />
        <Sparkle x={505} y={180} size={16} color="#7B6BFF" delay={0.9} />
        <Sparkle x={490} y={420} size={10} color="#2DD4BF" delay={1.6} />
        <Sparkle x={40} y={390} size={14} color="#F472B6" delay={0.5} />
      </svg>
    </div>
  );
}
