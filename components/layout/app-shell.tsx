import { AppHeader } from "./app-header";
import { RequireAuth } from "./require-auth";

/** Layout for organizer pages: auth guard + header + page container. */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-canvas">
      <AppHeader />
      <RequireAuth>
        <main className="container-page flex flex-col gap-6 pt-7 pb-16 sm:gap-8 sm:pt-9">{children}</main>
      </RequireAuth>
    </div>
  );
}
