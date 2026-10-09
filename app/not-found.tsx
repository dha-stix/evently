import { SearchX } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/page-states";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-canvas px-4">
      <EmptyState
        icon={SearchX}
        title="Page not found"
        description="The page you’re looking for doesn’t exist or has moved."
        action={<ButtonLink href="/">Go home</ButtonLink>}
        className="w-full max-w-md"
      />
    </main>
  );
}
