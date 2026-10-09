import type { Metadata } from "next";
import { RegisterView } from "@/components/register/register-view";

export const metadata: Metadata = { title: "Register" };

export default async function EventRegisterPage({ params }: PageProps<"/events/[id]/register">) {
  const { id } = await params;
  return <RegisterView id={id} />;
}
