"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { LoadingState } from "@/components/ui/page-states";

/** Redirects signed-out visitors to the login page. */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user)
      router.replace(`/auth/login?next=${encodeURIComponent(pathname)}`);
  }, [loading, user, router, pathname]);

  if (loading || !user)
    return (
      <LoadingState label="Checking your session…" className="min-h-[60vh]" />
    );
  return <>{children}</>;
}
