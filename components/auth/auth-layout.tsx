import { Logo } from "@/components/ui/logo";
import { DeveloperCredit } from "@/components/layout/developer-credit";
import { AuthScene } from "@/components/illustrations/auth-scene";
import { AnimatedHeadline } from "@/components/motion";
import { FadeIn } from "@/components/motion/fade-in";

/** Split-screen layout shared by the login and register pages. */
export function AuthLayout({ panel, children }: { panel: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-white lg:flex-row">
      <aside className="relative flex flex-col gap-10 overflow-hidden bg-night-900 px-5 py-8 text-white sm:px-10 lg:w-1/2 lg:justify-between lg:p-12">
        <div className="hidden lg:block">
          <AuthScene />
        </div>
        <Logo light className="relative" />
        <div className="relative hidden lg:flex lg:flex-col lg:gap-10">{panel}</div>
        <p className="relative hidden text-sm text-[#9C97C2] lg:block">© {new Date().getFullYear()} Evently</p>
      </aside>
      <main className="flex flex-1 items-start justify-center px-5 py-10 sm:px-6 sm:py-14 lg:items-center">
        <FadeIn delay={0.1} className="w-full max-w-[420px]">
          {children}
          <DeveloperCredit className="mt-10 border-t border-line-soft pt-6 text-center" />
        </FadeIn>
      </main>
    </div>
  );
}

export function AuthHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-7 flex flex-col gap-2">
      <AnimatedHeadline className="text-3xl font-bold sm:text-[34px]" delay={0.15} lines={[{ text: title }]} />
      <p className="text-muted">{subtitle}</p>
    </div>
  );
}
