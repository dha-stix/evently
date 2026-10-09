import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Hero } from "@/components/home/hero";
import { Features } from "@/components/home/features";
import { HowItWorks } from "@/components/home/how-it-works";
import { TicketLookup } from "@/components/home/ticket-lookup";
import { FaqCta } from "@/components/home/faq-cta";
import { EventMarquee } from "@/components/illustrations/event-marquee";
import { LiveRoom } from "@/components/home/live-room";
import { ScrollProgress } from "@/components/motion/interactive";

export default function HomePage() {
  return (
    <>
      <ScrollProgress />
      <SiteHeader />
      <main>
        <Hero />
        <EventMarquee />
        <Features />
        <LiveRoom />
        <HowItWorks />
        <TicketLookup />
        <FaqCta />
      </main>
      <SiteFooter />
    </>
  );
}
