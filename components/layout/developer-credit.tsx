import { cn } from "@/lib/utils";

export const DEVELOPER = {
  name: "David Asaolu",
  url: "https://www.linkedin.com/in/david-asaolu234/",
};

/** "Developed by …" credit linking to the developer's LinkedIn. */
export function DeveloperCredit({ className }: { className?: string }) {
  return (
    <p className={cn("text-sm text-muted", className)}>
      Developed by{" "}
      <a
        href={DEVELOPER.url}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-brand-600 underline-offset-4 hover:text-brand-700 hover:underline"
      >
        {DEVELOPER.name}
      </a>
    </p>
  );
}
