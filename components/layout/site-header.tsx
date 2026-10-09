"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { ButtonLink } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { MobileMenuButton } from "./mobile-menu-button";
import { siteNav } from "./nav-config";

/** Public marketing header used on the homepage. */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const close = () => setOpen(false);

  const actions = (block = false) =>
    user ? (
      <ButtonLink href="/dashboard" block={block}>
        Go to dashboard
      </ButtonLink>
    ) : (
      <>
        <ButtonLink href="/auth/login" variant="secondary" block={block}>
          Sign in
        </ButtonLink>
        <ButtonLink href="/auth/register" block={block}>
          Get started
        </ButtonLink>
      </>
    );

  return (
    <header className="sticky top-0 z-40 border-b border-line-soft bg-white/90 backdrop-blur-md">
      <div className="container-page flex items-center gap-5 py-3.5">
        <Logo className="mr-auto" />
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {siteNav.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-lg px-3 py-2 text-[15px] font-semibold text-ink-soft hover:bg-hover hover:text-ink">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2.5 lg:flex">{actions()}</div>
        <MobileMenuButton open={open} onToggle={() => setOpen((o) => !o)} controls="site-menu" className="lg:hidden" />
      </div>
      {open && (
        <nav id="site-menu" aria-label="Main" className="container-page flex flex-col gap-1 border-t border-line-soft pt-2 pb-5 lg:hidden">
          {siteNav.map((l) => (
            <Link key={l.href} href={l.href} onClick={close} className="rounded-lg p-3 font-semibold text-ink-soft hover:bg-hover">
              {l.label}
            </Link>
          ))}
          <div className="mt-2 grid grid-cols-2 gap-2.5 [&>*:only-child]:col-span-2">{actions(true)}</div>
        </nav>
      )}
    </header>
  );
}
