import Link from "next/link";
import { DeveloperCredit } from "./developer-credit";
import { FooterWordmark } from "./footer-wordmark";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-[#EEECFD] to-[#E3DEFF]">
      {/* purple glow rising behind the wordmark */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-[radial-gradient(60%_80%_at_50%_100%,rgba(110,92,246,0.28),transparent)]"
      />
      <div className="relative container-page flex flex-col gap-4 border-t border-brand-200/60 py-7 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
          <span>© {new Date().getFullYear()} Evently</span>
          <span aria-hidden className="hidden text-line-strong sm:inline">
            ·
          </span>
          <DeveloperCredit />
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-5">
          <Link href="/#features" className="text-ink-soft hover:text-ink">
            Features
          </Link>
          <Link href="/#faq" className="text-ink-soft hover:text-ink">
            FAQ
          </Link>
          <Link href="/auth/login" className="text-ink-soft hover:text-ink">
            Sign in
          </Link>
        </nav>
      </div>
      <div className="relative container-page pb-6 sm:pb-10">
        <FooterWordmark />
      </div>
    </footer>
  );
}
