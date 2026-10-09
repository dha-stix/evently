// Shared building blocks for the link-preview (Open Graph) images rendered by next/og.
// Satori, the renderer behind next/og, only supports flexbox layouts and inline styles.
import { formatDay, formatMonth, formatWhen, getEventPhase } from "@/lib/utils";
import type { EventPreview } from "@/lib/event-preview";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const OG_SIZE = { width: 1200, height: 630 };

export const C = {
  night900: "#16132E",
  night800: "#1E1A4D",
  night700: "#2E2966",
  lilac: "#C9C5E8",
  brand: "#4F3FE0",
  brandBright: "#7B6BFF",
  brandSoft: "#B7AEFF",
  white: "#FFFFFF",
  ink: "#111318",
  muted: "#5A6070",
  green: "#D7F5E3",
  greenInk: "#0F5C35",
};

const font = (file: string) => readFile(join(process.cwd(), "assets/fonts", file));

/** Brand fonts (TTF) for ImageResponse. */
export async function ogFonts() {
  const [display, displayBold, body, bodyBold, mono] = await Promise.all([
    font("BricolageGrotesque-ExtraBold.ttf"),
    font("BricolageGrotesque-Bold.ttf"),
    font("Manrope-Medium.ttf"),
    font("Manrope-Bold.ttf"),
    font("JetBrainsMono-SemiBold.ttf"),
  ]);
  return [
    { name: "Display", data: display, weight: 800 as const, style: "normal" as const },
    { name: "Display", data: displayBold, weight: 700 as const, style: "normal" as const },
    { name: "Body", data: body, weight: 500 as const, style: "normal" as const },
    { name: "Body", data: bodyBold, weight: 700 as const, style: "normal" as const },
    { name: "Mono", data: mono, weight: 600 as const, style: "normal" as const },
  ];
}

/** A file from /images as a data URI (Satori can't read local paths). */
export async function imageDataUri(relativePath: string, mime = "image/svg+xml") {
  const data = await readFile(join(process.cwd(), "images", relativePath));
  return `data:${mime};base64,${data.toString("base64")}`;
}

/** Remote image as a data URI, only if it's a format Satori can draw (PNG/JPEG). */
export async function remoteImageDataUri(url: string) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    const type = res.headers.get("content-type") ?? "";
    if (!res.ok || !/image\/(png|jpe?g)/.test(type)) return null;
    return `data:${type};base64,${Buffer.from(await res.arrayBuffer()).toString("base64")}`;
  } catch {
    return null;
  }
}

/** The purple ticket logo mark. */
export function LogoMark({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect width="64" height="64" rx="18" fill={C.brand} />
      <path d="M14 22h36v8a4 4 0 0 0 0 8v8H14v-8a4 4 0 0 0 0-8z" stroke="#fff" strokeWidth="4" strokeLinejoin="round" />
      <path d="M40 22v24" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeDasharray="3 5" />
    </svg>
  );
}

export function Wordmark({ size = 56 }: { size?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.3 }}>
      <LogoMark size={size} />
      <span style={{ fontFamily: "Display", fontWeight: 700, fontSize: size * 0.62, color: C.white, letterSpacing: -0.5 }}>
        Evently
      </span>
    </div>
  );
}

/** Soft glows + faint dot grid that give the dark background depth. */
export function Backdrop() {
  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage:
            "radial-gradient(circle at 88% 18%, rgba(110,92,246,0.55) 0%, rgba(22,19,46,0) 46%), radial-gradient(circle at 2% 98%, rgba(20,184,166,0.30) 0%, rgba(22,19,46,0) 38%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: "radial-gradient(rgba(201,197,232,0.12) 1.5px, rgba(0,0,0,0) 1.5px)",
          backgroundSize: "28px 28px",
        }}
      />
    </div>
  );
}

export const CheckIcon = ({ size = 22, color = C.greenInk }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

export function Pill({ children, tone = "dark" }: { children: React.ReactNode; tone?: "dark" | "green" | "brand" }) {
  const styles = {
    dark: { background: "rgba(255,255,255,0.08)", color: C.lilac, border: "1.5px solid rgba(201,197,232,0.22)" },
    green: { background: C.green, color: C.greenInk, border: `1.5px solid ${C.green}` },
    brand: { background: C.brand, color: C.white, border: `1.5px solid ${C.brand}` },
  }[tone];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "9px 18px",
        borderRadius: 999,
        fontFamily: "Body",
        fontWeight: 700,
        fontSize: 20,
        ...styles,
      }}
    >
      {children}
    </div>
  );
}

/** "Admit one" ticket used in the previews. */
export function Ticket({
  title,
  meta,
  code,
  width = 440,
  rotate = 0,
}: {
  title: string;
  meta: string;
  code: string;
  width?: number;
  rotate?: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width,
        borderRadius: 28,
        overflow: "hidden",
        background: C.white,
        transform: `rotate(${rotate}deg)`,
        boxShadow: "0 40px 80px rgba(0,0,0,0.45)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "28px 30px", background: C.night800 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "Body", fontWeight: 700, fontSize: 16, letterSpacing: 3, color: C.lilac }}>ADMIT ONE</span>
          <span
            style={{
              display: "flex",
              fontFamily: "Body",
              fontWeight: 700,
              fontSize: 16,
              padding: "6px 14px",
              borderRadius: 999,
              background: C.green,
              color: C.greenInk,
            }}
          >
            Confirmed
          </span>
        </div>
        <span style={{ fontFamily: "Display", fontWeight: 700, fontSize: 32, color: C.white, lineHeight: 1.1 }}>{title}</span>
        <span style={{ fontFamily: "Body", fontWeight: 500, fontSize: 19, color: C.lilac }}>{meta}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "24px 30px 30px", borderTop: "3px dashed #E4E6EB" }}>
        <span style={{ fontFamily: "Body", fontWeight: 700, fontSize: 15, letterSpacing: 3, color: C.muted }}>TICKET CODE</span>
        <span style={{ fontFamily: "Mono", fontWeight: 600, fontSize: 40, letterSpacing: 5, color: C.ink }}>{code}</span>
      </div>
    </div>
  );
}

export const CalendarIcon = ({ size = 30, color = C.brandSoft }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
    <path d="M3 9.5h18M8 2.5v4M16 2.5v4" />
  </svg>
);

export const PinIcon = ({ size = 30, color = C.brandSoft }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);

export const GlobeIcon = ({ size = 30, color = C.brandSoft }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
  </svg>
);

/** The site-wide preview card (homepage, and fallback for anything without its own). */
export function SiteCard() {
  return (
    <div style={{ display: "flex", width: "100%", height: "100%", background: C.night900, position: "relative", overflow: "hidden" }}>
      <Backdrop />

      {/* Left: message */}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 690, padding: "64px 0 60px 72px" }}>
        <Wordmark size={58} />

        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div style={{ display: "flex", flexDirection: "column", fontFamily: "Display", fontWeight: 800, fontSize: 78, lineHeight: 1.0, letterSpacing: -2.5, color: C.white }}>
            <span>Host events.</span>
            <span>Fill every seat.</span>
            <span style={{ color: C.brandSoft }}>Check guests in.</span>
          </div>
          <span style={{ fontFamily: "Body", fontWeight: 500, fontSize: 27, lineHeight: 1.45, color: C.lilac, maxWidth: 560 }}>
            Free event registration with unique ticket codes and one-tap check-in at the door.
          </span>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <Pill tone="green">
            <CheckIcon size={20} /> Free events
          </Pill>
          <Pill>1 ticket per email</Pill>
          <Pill>Live check-in</Pill>
        </div>
      </div>

      {/* Right: product visual */}
      <div style={{ display: "flex", position: "relative", flex: 1 }}>
        {/* stats card behind the ticket */}
        <div
          style={{
            position: "absolute",
            top: 96,
            right: 44,
            display: "flex",
            flexDirection: "column",
            gap: 14,
            width: 330,
            padding: "24px 26px",
            borderRadius: 24,
            background: C.night800,
            border: "1.5px solid rgba(183,174,255,0.25)",
            transform: "rotate(5deg)",
            boxShadow: "0 30px 60px rgba(0,0,0,0.35)",
          }}
        >
          <span style={{ fontFamily: "Body", fontWeight: 700, fontSize: 17, color: C.lilac }}>Registrations</span>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontFamily: "Display", fontWeight: 800, fontSize: 52, color: C.white }}>86</span>
            <span style={{ fontFamily: "Body", fontWeight: 700, fontSize: 24, color: C.lilac }}>/ 120</span>
          </div>
          <div style={{ display: "flex", height: 12, borderRadius: 99, background: "rgba(255,255,255,0.12)" }}>
            <div style={{ display: "flex", width: "72%", height: 12, borderRadius: 99, background: C.brandBright }} />
          </div>
        </div>

        <div style={{ position: "absolute", top: 232, right: 110, display: "flex" }}>
          <Ticket title="Product Design Meetup" meta="Sat, Nov 14 · 6:00 PM" code="EVT-7K2Q9X" width={420} rotate={-6} />
        </div>
      </div>
    </div>
  );
}

const clip = (text: string, max: number) => (text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text);

/** Per-event invitation card. `cover` is a data URI (uploaded image or preset artwork). */
export function EventCard({ event, cover }: { event: EventPreview; cover: string }) {
  const title = clip(event.title, 80);
  const titleSize = title.length <= 26 ? 76 : title.length <= 48 ? 62 : 50;
  const where =
    event.location.type === "online"
      ? "Online event"
      : clip([event.location.venue, event.location.city].filter(Boolean).join(", "), 44);

  const phase = getEventPhase(event);
  const spotsLeft = event.capacity === null ? null : Math.max(0, event.capacity - event.registeredCount);
  const status =
    phase === "ended"
      ? "This event has ended"
      : phase === "open"
        ? spotsLeft === null
          ? event.registeredCount >= 10
            ? `${event.registeredCount} people going`
            : "Open to everyone"
          : `${spotsLeft} spot${spotsLeft === 1 ? "" : "s"} left`
        : "Registration closed";

  return (
    <div style={{ display: "flex", width: "100%", height: "100%", background: C.night900, position: "relative", overflow: "hidden" }}>
      <Backdrop />

      {/* Left: invitation */}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 700, padding: "60px 0 56px 72px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Wordmark size={46} />
          <Pill tone="green">
            <CheckIcon size={18} /> Free entry
          </Pill>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <span style={{ fontFamily: "Body", fontWeight: 700, fontSize: 22, letterSpacing: 5, color: C.brandSoft }}>YOU’RE INVITED</span>
          <span style={{ fontFamily: "Display", fontWeight: 800, fontSize: titleSize, lineHeight: 1.04, letterSpacing: -2, color: C.white }}>
            {title}
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <CalendarIcon size={30} />
              <span style={{ fontFamily: "Body", fontWeight: 700, fontSize: 28, color: C.white }}>
                {formatWhen(event.startsAt, event.timezone)}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              {event.location.type === "online" ? <GlobeIcon size={30} /> : <PinIcon size={30} />}
              <span style={{ fontFamily: "Body", fontWeight: 500, fontSize: 28, color: C.lilac }}>{where}</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          {phase === "open" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "16px 30px",
                borderRadius: 18,
                background: C.brand,
                color: C.white,
                fontFamily: "Body",
                fontWeight: 700,
                fontSize: 28,
                boxShadow: "0 16px 36px rgba(79,63,224,0.45)",
              }}
            >
              Register free
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </div>
          )}
          <span style={{ fontFamily: "Body", fontWeight: 700, fontSize: 24, color: phase === "open" ? C.lilac : C.brandSoft }}>
            {status}
          </span>
        </div>
      </div>

      {/* Right: cover art with a calendar date chip */}
      <div
        style={{
          position: "absolute",
          top: 52,
          right: 56,
          width: 380,
          height: 526,
          display: "flex",
          borderRadius: 34,
          overflow: "hidden",
          border: "2px solid rgba(183,174,255,0.25)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.45)",
          transform: "rotate(2.5deg)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- rendered by next/og, not the browser */}
        <img src={cover} width={380} height={526} style={{ objectFit: "cover", width: 380, height: 526 }} alt="" />
        <div
          style={{
            position: "absolute",
            top: 26,
            left: 26,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 104,
            padding: "12px 0 10px",
            borderRadius: 22,
            background: C.white,
            boxShadow: "0 12px 28px rgba(0,0,0,0.25)",
          }}
        >
          <span style={{ fontFamily: "Body", fontWeight: 700, fontSize: 22, letterSpacing: 2, color: "#B42318" }}>
            {formatMonth(event.startsAt, event.timezone)}
          </span>
          <span style={{ fontFamily: "Display", fontWeight: 800, fontSize: 54, lineHeight: 1, color: C.ink }}>
            {formatDay(event.startsAt, event.timezone)}
          </span>
        </div>
        {/* Ticket stub along the bottom of the cover */}
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: 380,
            height: 104,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 30px",
            background: C.white,
            borderTop: "3px dashed #D5D8E0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <LogoMark size={40} />
            <span style={{ fontFamily: "Body", fontWeight: 700, fontSize: 20, letterSpacing: 4, color: C.muted }}>ADMIT ONE</span>
          </div>
          <span style={{ fontFamily: "Display", fontWeight: 800, fontSize: 30, color: C.brand }}>FREE</span>
        </div>
      </div>
    </div>
  );
}
