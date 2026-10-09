import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { formatRelative } from "@/lib/utils";
import type { RecentRegistration } from "@/types";

export function RecentRegistrations({ items }: { items: RecentRegistration[] }) {
  if (!items.length) return null;
  return (
    <section className="card overflow-hidden">
      <div className="border-b border-line px-5 py-4">
        <h2 className="text-lg font-bold">Recent registrations</h2>
      </div>
      <ul className="divide-y divide-line-soft">
        {items.map((r) => (
          <li key={r.id}>
            <Link
              href={`/events/${r.eventId}`}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-x-3 gap-y-1 px-5 py-3.5 text-sm hover:bg-canvas md:grid-cols-[2fr_2fr_1.3fr_1fr] md:gap-4"
            >
              <span className="row-span-2 md:hidden">
                <Avatar name={r.name} size="sm" />
              </span>
              <span className="flex items-center gap-2.5 font-semibold">
                <Avatar name={r.name} size="sm" className="hidden md:inline-flex" />
                {r.name}
              </span>
              <span className="truncate text-ink-soft max-md:col-start-2 max-md:row-start-2 max-md:text-[13px] max-md:text-muted">
                {r.eventTitle}
              </span>
              <span className="text-right font-mono text-[13px] md:text-left">{r.ticketCode}</span>
              <span className="text-right text-[13px] text-muted max-md:col-start-3 max-md:row-start-2 md:text-left md:text-sm">
                {formatRelative(r.registeredAt)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
