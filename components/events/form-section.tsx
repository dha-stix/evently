export function FormSection({ step, title, description, children }: { step: number; title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="card flex flex-col gap-5 p-5 sm:p-6">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-3">
          <span className="inline-flex size-7 items-center justify-center rounded-lg bg-brand-100 text-sm font-extrabold text-brand-700">{step}</span>
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
        {description && <p className="text-sm text-muted">{description}</p>}
      </div>
      {children}
    </section>
  );
}
