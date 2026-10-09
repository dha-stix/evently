import { Sparkle } from "./event-stage";

/**
 * Decoration for the dark auth panel: sparkles (kept in the right margin, clear of the text), a calendar whose page flips,
 * and a bouncing map pin with a ripple. Sits behind the panel content.
 */
export function AuthScene() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <svg
        viewBox="0 0 600 900"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        {/* calendar card, top right */}
        <g transform="translate(445 110) rotate(8)">
          <g className="ev-float">
            <rect
              width="104"
              height="112"
              rx="18"
              fill="#1E1A4D"
              stroke="#2E2966"
              strokeWidth="2"
            />
            <rect width="104" height="34" rx="18" fill="#4F3FE0" />
            <rect y="18" width="104" height="16" fill="#4F3FE0" />
            <circle cx="30" cy="8" r="5" fill="#16132E" />
            <circle cx="74" cy="8" r="5" fill="#16132E" />
            <text
              x="52"
              y="27"
              textAnchor="middle"
              fill="#fff"
              fontFamily="var(--font-manrope)"
              fontWeight="800"
              fontSize="13"
              letterSpacing="2"
            >
              NOV
            </text>
            <g className="ev-flip" style={{ transformOrigin: "52px 40px" }}>
              <text
                x="52"
                y="88"
                textAnchor="middle"
                fill="#fff"
                fontFamily="var(--font-bricolage)"
                fontWeight="800"
                fontSize="44"
              >
                14
              </text>
            </g>
          </g>
        </g>
        {/* map pin, lower right */}
        <g transform="translate(500 640)">
          <ellipse
            className="ev-ring"
            cx="0"
            cy="44"
            rx="22"
            ry="7"
            fill="#2DD4BF"
            opacity=".5"
          />
          <ellipse cx="0" cy="44" rx="16" ry="5" fill="#2DD4BF" opacity=".35" />
          <g className="ev-bob">
            <path
              d="M0 40 C -22 14 -26 4 -26 -6 a26 26 0 0 1 52 0 c0 10 -4 20 -26 46z"
              fill="#2DD4BF"
            />
            <circle cy="-6" r="9" fill="#16132E" />
          </g>
        </g>
        <Sparkle x={540} y={300} size={12} delay={0.4} />
        <Sparkle x={575} y={390} size={9} color="#B7AEFF" delay={1.2} />
        <Sparkle x={560} y={470} size={14} color="#F472B6" delay={0.8} />
        <Sparkle x={520} y={700} size={10} color="#2DD4BF" delay={1.8} />
      </svg>
    </div>
  );
}
