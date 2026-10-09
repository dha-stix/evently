import { cn } from "@/lib/utils";

/** Eyebrow + title + optional lead paragraph, used on the homepage sections. */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  light,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  light?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex max-w-2xl flex-col gap-3.5", className)}>
      <span className={cn("eyebrow", light && "text-brand-300")}>{eyebrow}</span>
      <h2 className="text-[clamp(2rem,4.4vw,2.9rem)] leading-[1.08] font-bold">{title}</h2>
      {lead && <p className={cn("text-lg leading-relaxed", light ? "text-night-300" : "text-[#4A5060]")}>{lead}</p>}
    </div>
  );
}
