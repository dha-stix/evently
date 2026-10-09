"use client";

import { useMemo, useState } from "react";
import { Download, Loader2, Mail, Search, Trash2, Users } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { EmptyState } from "@/components/ui/page-states";
import { CopyButton } from "@/components/ui/copy-button";
import { useToast } from "@/components/providers/toast-provider";
import { removeAttendee } from "@/lib/firebase-actions";
import { formatShortDate, formatTime } from "@/lib/utils";
import type { Attendee, EventItem } from "@/types";

type Filter = "all" | "in" | "out";
const PAGE_SIZE = 10;

function exportCsv(event: EventItem, rows: Attendee[]) {
  const header = ["Name", "Email", "Phone", "Company", "Ticket code", "Registered", "Checked in"];
  const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = rows.map((a) =>
    [a.name, a.email, a.phone, a.company, a.ticketCode, a.registeredAt, a.checkedInAt ?? ""].map(escape).join(","),
  );
  const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = Object.assign(document.createElement("a"), { href: url, download: `${event.id}-attendees.csv` });
  link.click();
  URL.revokeObjectURL(url);
}

/** Emails of the given attendees, ready to paste into an email client or mailing tool. */
const uniqueEmails = (rows: Attendee[]) => [...new Set(rows.map((a) => a.email).filter(Boolean))];

function EmailLink({ email }: { email: string }) {
  return (
    <a href={`mailto:${email}`} className="inline-flex max-w-full items-center gap-1 truncate text-[13px] text-muted hover:text-brand-700 hover:underline">
      <Mail className="size-3.5 shrink-0" aria-hidden />
      <span className="truncate">{email}</span>
    </a>
  );
}

/** Trash button that removes one attendee after confirmation (frees their seat and email). */
function RemoveButton({ eventId, attendee }: { eventId: string; attendee: Attendee }) {
  const notify = useToast();
  const [busy, setBusy] = useState(false);

  async function remove() {
    const ok = window.confirm(
      `Remove ${attendee.name} (${attendee.email || attendee.ticketCode}) from this event?\n\n` +
        "Their ticket stops working, their seat is freed and the same email can register again.",
    );
    if (!ok) return;
    setBusy(true);
    try {
      await removeAttendee(eventId, attendee.ticketCode);
      notify({ title: "Attendee removed", description: attendee.name });
    } catch (err) {
      notify({ title: "Couldn’t remove attendee", description: (err as Error).message, tone: "error" });
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={remove}
      disabled={busy}
      aria-label={`Remove ${attendee.name}`}
      title="Remove attendee"
      className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted transition hover:bg-danger-50 hover:text-danger-600 disabled:opacity-50"
    >
      {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Trash2 className="size-4" aria-hidden />}
    </button>
  );
}

function CheckInBadge({ attendee }: { attendee: Attendee }) {
  return attendee.checkedInAt ? (
    <Badge tone="brand">
      <span title={`Checked in at ${formatTime(attendee.checkedInAt)}`}>Checked in</span>
    </Badge>
  ) : (
    <Badge tone="neutral">Not yet</Badge>
  );
}


export function AttendeesTable({ event, attendees }: { event: EventItem; attendees: Attendee[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return attendees.filter(
      (a) =>
        (filter === "all" || (filter === "in" ? a.checkedInAt : !a.checkedInAt)) &&
        (!q || [a.name, a.email, a.ticketCode].some((v) => v.toLowerCase().includes(q))),
    );
  }, [attendees, filter, query]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages - 1);
  const rows = filtered.slice(current * PAGE_SIZE, (current + 1) * PAGE_SIZE);

  return (
    <section className="card overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-line p-4 sm:p-5">
        <h2 className="text-xl font-bold">
          Attendees <span className="text-base font-semibold text-muted">({attendees.length})</span>
        </h2>
        <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="relative sm:min-w-56 sm:flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-[18px] -translate-y-1/2 text-subtle" aria-hidden />
            <Input
              type="search"
              aria-label="Search attendees"
              placeholder="Name, email or code"
              value={query}
              onChange={(e) => (setQuery(e.target.value), setPage(0))}
              className="h-10 pl-9 text-sm"
            />
          </div>
          <SegmentedControl
            label="Filter attendees"
            size="sm"
            value={filter}
            onChange={(f) => (setFilter(f), setPage(0))}
            options={[
              { value: "all", label: "All" },
              { value: "in", label: "Checked in" },
              { value: "out", label: "Not yet" },
            ]}
          />
          <CopyButton
            value={uniqueEmails(filtered).join(", ")}
            label={`Copy emails (${uniqueEmails(filtered).length})`}
            className="h-10 px-3 text-sm"
          />
          <Button variant="secondary" size="sm" className="h-10" onClick={() => exportCsv(event, filtered)} disabled={!filtered.length}>
            <Download className="size-4" aria-hidden /> Export CSV
          </Button>
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={Users}
          className="m-4 sm:m-5"
          title={attendees.length ? "No attendees match" : "No registrations yet"}
          description={attendees.length ? "Try a different search or filter." : "Share your registration link to start filling seats."}
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-[#FAFAFB] text-xs font-bold tracking-wider text-muted uppercase">
                <tr>
                  <th scope="col" className="px-5 py-3 whitespace-nowrap">Attendee</th>
                  <th scope="col" className="px-5 py-3 whitespace-nowrap">Ticket code</th>
                  <th scope="col" className="px-5 py-3 whitespace-nowrap">Phone</th>
                  <th scope="col" className="px-5 py-3 whitespace-nowrap">Registered</th>
                  <th scope="col" className="px-5 py-3 whitespace-nowrap">Check-in</th>
                  <th scope="col" className="px-3 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-soft">
                {rows.map((a) => (
                  <tr key={a.id}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={a.name} />
                        <div className="min-w-0">
                          <p className="font-bold">{a.name}</p>
                          <EmailLink email={a.email} />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-mono text-[13px] whitespace-nowrap">{a.ticketCode}</td>
                    <td className="px-5 py-3 whitespace-nowrap text-ink-soft">{a.phone || "—"}</td>
                    <td className="px-5 py-3 whitespace-nowrap text-muted">{formatShortDate(a.registeredAt)}</td>
                    <td className="px-5 py-3"><CheckInBadge attendee={a} /></td>
                    <td className="px-3 py-2 text-right"><RemoveButton eventId={event.id} attendee={a} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="divide-y divide-line-soft md:hidden">
            {rows.map((a) => (
              <li key={a.id} className="flex flex-col gap-2.5 p-4">
                <div className="flex items-center gap-3">
                  <Avatar name={a.name} />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold">{a.name}</p>
                    <EmailLink email={a.email} />
                  </div>
                  <RemoveButton eventId={event.id} attendee={a} />
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="rounded-md bg-hover px-2 py-0.5 font-mono text-[13px] font-semibold">{a.ticketCode}</span>
                  <CheckInBadge attendee={a} />
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {filtered.length > PAGE_SIZE && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3.5 text-sm text-muted sm:px-5">
          <span>
            Showing {current * PAGE_SIZE + 1}–{current * PAGE_SIZE + rows.length} of {filtered.length}
          </span>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" disabled={current === 0} onClick={() => setPage(current - 1)}>Previous</Button>
            <Button variant="secondary" size="sm" disabled={current >= pages - 1} onClick={() => setPage(current + 1)}>Next</Button>
          </div>
        </div>
      )}
    </section>
  );
}
