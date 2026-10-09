import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { EventForm } from "@/components/events/event-form";

export const metadata: Metadata = { title: "Create event" };

export default function CreateEventPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-2.5">
        <Link href="/dashboard" className="inline-flex items-center gap-2 self-start text-sm font-bold text-ink-soft hover:text-ink">
          <ArrowLeft className="size-4" aria-hidden /> Back to dashboard
        </Link>
        <h1 className="text-3xl font-bold sm:text-[34px]">Create a new event</h1>
        <p className="text-muted">Fill in the details below. You can save a draft and publish later.</p>
      </div>
      <EventForm />
    </AppShell>
  );
}
