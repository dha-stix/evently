import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Hero } from "@/components/home/hero";
import { Features } from "@/components/home/features";
import { HowItWorks } from "@/components/home/how-it-works";
import { TicketLookup } from "@/components/home/ticket-lookup";
import { FaqCta } from "@/components/home/faq-cta";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <TicketLookup />
        <FaqCta />
      </main>
      <SiteFooter />
    </>
  );
}
