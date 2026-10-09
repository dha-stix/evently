import Link from "next/link";
import { DeveloperCredit } from "./developer-credit";

export function SiteFooter() {
  return (
    <footer className="border-t border-line-soft">
      <div className="container-page flex flex-col gap-4 py-7 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
          <span>© {new Date().getFullYear()} Evently</span>
          <span aria-hidden className="hidden text-line-strong sm:inline">·</span>
          <DeveloperCredit />
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-5">
          <Link href="/#features" className="text-ink-soft hover:text-ink">Features</Link>
          <Link href="/#faq" className="text-ink-soft hover:text-ink">FAQ</Link>
          <Link href="/auth/login" className="text-ink-soft hover:text-ink">Sign in</Link>
        </nav>
      </div>
    </footer>
  );
}
