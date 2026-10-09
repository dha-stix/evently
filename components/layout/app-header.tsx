"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Plus } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Avatar } from "@/components/ui/avatar";
import { ButtonLink, Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";
import { MobileMenuButton } from "./mobile-menu-button";
import { MobileMenu } from "./mobile-menu";
import { appNav } from "./nav-config";

/** Header for signed-in organizer pages. */
export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  const handleLogout = async () => {
    await logout();
    router.replace("/auth/login");
  };

  const linkClass = (href: string) =>
    cn(
      "rounded-lg px-3 py-2 text-sm font-semibold transition",
      pathname === href
        ? "bg-brand-100 text-brand-700"
        : "text-[#4A5060] hover:bg-hover hover:text-ink",
    );

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white">
      <div className="container-page flex items-center gap-4 py-3 md:gap-6">
        <Logo href="/dashboard" />
        <nav aria-label="App" className="hidden flex-1 gap-1 md:flex">
          {appNav.map((l) => (
            <Link key={l.href} href={l.href} className={linkClass(l.href)}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto hidden items-center gap-3 md:flex">
          {user && (
            <span className="flex items-center gap-2.5 text-sm font-semibold text-ink-soft">
              <Avatar name={user.username} />
              <span className="hidden lg:inline">{user.username}</span>
            </span>
          )}
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="size-4" aria-hidden />
            Sign out
          </Button>
        </div>
        <div className="ml-auto flex items-center gap-2 md:hidden">
          <ButtonLink
            href="/events/create"
            size="sm"
            aria-label="Create event"
            className="size-11 px-0"
          >
            <Plus className="size-5" aria-hidden />
          </ButtonLink>
          <MobileMenuButton
            open={open}
            onToggle={() => setOpen((o) => !o)}
            controls="app-menu"
          />
        </div>
      </div>
      <MobileMenu
        open={open}
        onClose={close}
        id="app-menu"
        label="App"
        className="md:hidden"
      >
        {user && (
          <div className="flex items-center gap-3 px-3 py-3">
            <Avatar name={user.username} />
            <div className="min-w-0">
              <p className="font-bold">{user.username}</p>
              <p className="truncate text-sm text-muted">{user.email}</p>
            </div>
          </div>
        )}
        {appNav.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={close}
            className={cn(linkClass(l.href), "block p-3 text-[15px]")}
          >
            {l.label}
          </Link>
        ))}
        <Button
          variant="secondary"
          className="mt-2 w-full"
          onClick={handleLogout}
        >
          <LogOut className="size-4" aria-hidden />
          Sign out
        </Button>
      </MobileMenu>
    </header>
  );
}
