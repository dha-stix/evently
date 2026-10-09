import { cn } from "@/lib/utils";

// One wave period every 600 units, so the path tiles seamlessly
const WAVE = "C150,0 450,60 600,30 C750,0 1050,60 1200,30";
const WAVE_X2 = `${WAVE} C1350,0 1650,60 1800,30 C1950,0 2250,60 2400,30`;

/**
 * Wavy or diagonal edge drawn over the top or bottom of a `relative` section. `color` is the
 * neighbouring section's background, so the edge looks like the two sections meeting.
 */
export function SectionEdge({
  variant = "wave",
  position,
  color,
  className,
}: {
  variant?: "wave" | "skew";
  position: "top" | "bottom";
  color: string;
  className?: string;
}) {
  const close = position === "top" ? "V0 H0 Z" : "V60 H0 Z";
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 z-10 h-12 overflow-hidden sm:h-20",
        position === "top" ? "-top-px" : "-bottom-px",
        className,
      )}
    >
      {variant === "wave" ? (
        <>
          {/* back layer, softer and drifting */}
          <svg
            viewBox="0 0 2400 60"
            preserveAspectRatio="none"
            className="ev-wave absolute inset-y-0 left-0 h-full w-[400%] sm:w-[200%]"
          >
            <path
              d={`M0,30 ${WAVE_X2} ${close}`}
              fill={color}
              opacity=".45"
              transform={
                position === "top" ? "translate(0 8)" : "translate(0 -8)"
              }
            />
          </svg>
          <svg
            viewBox="0 0 1200 60"
            preserveAspectRatio="none"
            className="absolute inset-y-0 left-0 h-full w-[200%] sm:w-full"
          >
            <path d={`M0,30 ${WAVE} ${close}`} fill={color} />
          </svg>
        </>
      ) : (
        <svg
          viewBox="0 0 1200 60"
          preserveAspectRatio="none"
          className="absolute inset-0 size-full"
        >
          <polygon
            points={
              position === "top" ? "0,0 1200,0 0,60" : "1200,0 1200,60 0,60"
            }
            fill={color}
          />
        </svg>
      )}
    </div>
  );
}
