"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { ButtonLink } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { MobileMenuButton } from "./mobile-menu-button";
import { MobileMenu } from "./mobile-menu";
import { siteNav } from "./nav-config";

/** Public marketing header used on the homepage. */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const { user } = useAuth();
  const close = useCallback(() => setOpen(false), []);
  const [hovered, setHovered] = useState<string | null>(null);

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
    <header
      // floats over the hero: transparent at the top, frosted glass once you scroll (or open the menu)
      className={`fixed inset-x-0 top-0 z-40 border-b transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ${
        scrolled || open
          ? "border-line/80 bg-white/90 shadow-[0_8px_24px_rgba(17,19,24,0.06)] backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="container-page flex items-center gap-5 py-3.5">
        <Logo className="mr-auto" />
        <nav
          aria-label="Main"
          className="hidden items-center gap-1 lg:flex"
          onMouseLeave={() => setHovered(null)}
        >
          {siteNav.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onMouseEnter={() => setHovered(l.href)}
              className="relative isolate rounded-lg px-3 py-2 text-[15px] font-semibold text-ink-soft transition-colors hover:text-ink"
            >
              {/* highlight glides between links as you hover */}
              {hovered === l.href && (
                <motion.span
                  layoutId="nav-hover"
                  className="absolute inset-0 -z-10 rounded-lg bg-hover"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2.5 lg:flex">{actions()}</div>
        <MobileMenuButton
          open={open}
          onToggle={() => setOpen((o) => !o)}
          controls="site-menu"
          className="lg:hidden"
        />
      </div>
      <MobileMenu
        open={open}
        onClose={close}
        id="site-menu"
        label="Main"
        className="lg:hidden"
      >
        {siteNav.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={close}
            className="group flex items-center justify-between rounded-xl p-3 text-[17px] font-bold text-ink-soft transition-colors hover:bg-brand-50 hover:text-brand-700"
          >
            {l.label}
            <ChevronRight
              className="size-4 text-subtle transition-transform group-hover:translate-x-1 group-hover:text-brand-600"
              aria-hidden
            />
          </Link>
        ))}
        <div className="mt-2 grid grid-cols-2 gap-2.5 [&>*:only-child]:col-span-2">
          {actions(true)}
        </div>
      </MobileMenu>
    </header>
  );
}
