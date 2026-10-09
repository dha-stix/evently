"use client";

import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

const VIEW = { w: 1000, h: 262 };
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The logo mark (ticket in a rounded square) and the wordmark, drawn as outlines only.
 * The font's glyphs are built from overlapping shapes, so the text is filled and then traced
 * with an outline filter (no stray inner lines, and the background shows through).
 */
function Outline({ color, filter }: { color: string; filter: string }) {
  return (
    <>
      <g transform="translate(8 40) scale(2.3)" fill="none" stroke={color} strokeWidth={0.6}>
        <rect x="1" y="1" width="62" height="62" rx="18" />
        <path d="M14 22h36v8a4 4 0 0 0 0 8v8H14v-8a4 4 0 0 0 0-8z" strokeLinejoin="round" />
        <path d="M40 22v24" strokeLinecap="round" strokeDasharray="3 5" />
      </g>
      <text
        x="182"
        y="192"
        textLength="806"
        lengthAdjust="spacingAndGlyphs"
        fontSize="236"
        fontWeight="800"
        letterSpacing="-6"
        fill={color}
        filter={`url(#${filter})`}
        style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
      >
        evently
      </text>
    </>
  );
}

/** Keeps only a thin ring around the shape: grow it by `radius`, then cut the original out. */
function OutlineFilter({ id, radius }: { id: string; radius: number }) {
  return (
    <filter id={id} x="-2%" y="-10%" width="104%" height="120%">
      <feMorphology in="SourceGraphic" operator="dilate" radius={radius} result="grown" />
      <feComposite in="grown" in2="SourceGraphic" operator="out" />
    </filter>
  );
}

/**
 * Giant outlined "evently" for the bottom of the footer. The outline wipes in when it
 * scrolls into view, and a spotlight under the cursor darkens the strokes it passes over
 * (on touch screens the spotlight drifts across on its own).
 */
export function FooterWordmark() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduce = useReducedMotion();
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
      className="block h-auto w-full select-none"
      aria-hidden
      onPointerMove={(e) => {
        if (e.pointerType === "touch") return;
        const r = e.currentTarget.getBoundingClientRect();
        setPointer({ x: ((e.clientX - r.left) / r.width) * VIEW.w, y: ((e.clientY - r.top) / r.height) * VIEW.h });
      }}
      onPointerLeave={() => setPointer(null)}
    >
      <defs>
        <OutlineFilter id="fw-line" radius={1.3} />
        <OutlineFilter id="fw-line-bold" radius={1.8} />
        {/* the outline wipes in from left to right on first view */}
        <clipPath id="fw-wipe">
          <motion.rect
            x="0"
            y="0"
            height={VIEW.h}
            initial={{ width: reduce ? VIEW.w : 0 }}
            animate={inView ? { width: VIEW.w } : undefined}
            transition={{ duration: 1.8, ease: EASE }}
          />
        </clipPath>
        <radialGradient id="fw-spot">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="fw-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={VIEW.w} height={VIEW.h}>
          {pointer ? (
            <circle cx={pointer.x} cy={pointer.y} r="190" fill="url(#fw-spot)" />
          ) : (
            !reduce && (
              <circle cx="0" cy={VIEW.h / 2} r="190" fill="url(#fw-spot)">
                <animate attributeName="cx" values={`-150;${VIEW.w + 150};-150`} dur="14s" repeatCount="indefinite" />
              </circle>
            )
          )}
        </mask>
      </defs>

      {/* faint base outline */}
      <g clipPath="url(#fw-wipe)">
        <Outline color="#A99FF5" filter="fw-line" />
      </g>

      {/* darker brand outline revealed only under the spotlight */}
      <g mask="url(#fw-mask)">
        <Outline color="#4F3FE0" filter="fw-line-bold" />
      </g>
    </svg>
  );
}
