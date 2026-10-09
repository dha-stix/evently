import Image from "next/image";
import { covers } from "@/lib/images";
import { cn, formatDay, formatMonth } from "@/lib/utils";
import type { CoverKey } from "@/types";

/** Cover artwork with an optional calendar-style date chip. */
export function EventCover({
  cover,
  coverUrl,
  scrim,
  startsAt,
  className,
  children,
}: {
  cover: CoverKey;
  /** Uploaded image (Firebase Storage URL or a data URL preview). Overrides `cover`. */
  coverUrl?: string | null;
  /** Darkens the bottom of the image so overlaid text stays readable. */
  scrim?: boolean;
  startsAt?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image src={coverUrl || covers[cover]} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 480px" />
      {scrim && <div aria-hidden className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />}
      <div className="relative flex h-full items-start justify-between gap-3 p-4">
        {startsAt && <DateChip iso={startsAt} />}
        {children}
      </div>
    </div>
  );
}

export function DateChip({ iso, className }: { iso: string; className?: string }) {
  return (
    <div className={cn("flex w-14 flex-col rounded-xl bg-white py-1.5 text-center text-ink shadow-sm", className)}>
      <span className="text-[11px] font-extrabold tracking-wider text-danger-600">{formatMonth(iso)}</span>
      <span className="font-display text-2xl leading-tight font-bold">{formatDay(iso)}</span>
    </div>
  );
}
