import type { Metadata } from "next";
import { SuccessView } from "@/components/register/success-view";

export const metadata: Metadata = { title: "You’re registered" };

export default async function SuccessPage({ params, searchParams }: PageProps<"/events/[id]/register/success">) {
  const [{ id }, { code }] = await Promise.all([params, searchParams]);
  return <SuccessView eventId={id} ticketCode={typeof code === "string" ? code.toUpperCase() : undefined} />;
}
