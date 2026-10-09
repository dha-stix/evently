import { ImageResponse } from "next/og";
import { OG_SIZE, SiteCard, ogFonts } from "@/lib/og";

export const alt = "Evently: host free events, register guests with unique tickets and check them in at the door.";
export const size = OG_SIZE;
export const contentType = "image/png";

/** Site-wide link preview (homepage and any page without its own). */
export default async function Image() {
  return new ImageResponse(<SiteCard />, { ...size, fonts: await ogFonts() });
}
