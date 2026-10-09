import { FlowHeader } from "@/components/layout/flow-header";

export function FlowLayout({
  step,
  children,
  narrow,
}: {
  step: 1 | 2;
  children: React.ReactNode;
  narrow?: boolean;
}) {
  return (
    <div className="min-h-dvh bg-canvas">
      <FlowHeader step={step} />
      <main className={narrow ? "mx-auto w-full max-w-2xl px-4 pt-10 pb-16 sm:px-6" : "container-page pt-7 pb-16 sm:pt-10"}>
        {children}
      </main>
    </div>
  );
}
