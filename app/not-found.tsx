import { ButtonLink } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";
import { ConfettiRain } from "@/components/illustrations/confetti";
import { LostTicket } from "@/components/illustrations/lost-ticket";

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-canvas px-4">
      <ConfettiRain count={18} seed={11} className="opacity-60" />
      <div className="relative flex w-full max-w-md flex-col items-center gap-5 text-center">
        <LostTicket />
        <FadeIn delay={0.15} className="flex flex-col items-center gap-2">
          <h1 className="text-3xl font-bold">This ticket doesn’t lead anywhere</h1>
          <p className="leading-relaxed text-muted">The page you’re looking for doesn’t exist or has moved.</p>
        </FadeIn>
        <FadeIn delay={0.3}>
          <ButtonLink href="/" className="relative overflow-hidden ev-shine">
            Go home
          </ButtonLink>
        </FadeIn>
      </div>
    </main>
  );
}
