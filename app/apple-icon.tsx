import { ImageResponse } from "next/og";
import { LogoMark } from "@/lib/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon for iPhone/iPad ("Add to Home Screen"). */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center", background: "#4F3FE0" }}>
        <LogoMark size={180} />
      </div>
    ),
    size,
  );
}
