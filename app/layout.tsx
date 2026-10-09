import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, JetBrains_Mono, Manrope } from "next/font/google";
import { Providers } from "@/components/providers";
import "@/styles/globals.css";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });
const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"] });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"] });

const description =
  "Publish free events, take registrations and check attendees in at the door. No accounts needed for guests.";

/** Absolute site URL, used to build full links to the share-preview images. */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Evently: events, tickets and check-in", template: "%s · Evently" },
  description,
  applicationName: "Evently",
  // Link previews on WhatsApp, LinkedIn, Slack, iMessage, Facebook… (image: app/opengraph-image.tsx)
  openGraph: {
    type: "website",
    siteName: "Evently",
    title: "Evently: host events, fill every seat, check guests in",
    description,
    locale: "en_US",
  },
  // X / Twitter: show the big image card
  twitter: {
    card: "summary_large_image",
    title: "Evently: host events, fill every seat, check guests in",
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#4F3FE0",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${manrope.variable} ${bricolage.variable} ${jetbrains.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
