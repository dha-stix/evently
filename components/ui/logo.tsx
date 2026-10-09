import Image from "next/image";
import Link from "next/link";
import { images } from "@/lib/images";
import { cn } from "@/lib/utils";

export function Logo({ href = "/", light = false, className }: { href?: string; light?: boolean; className?: string }) {
  return (
    <Link href={href} className={cn("flex items-center gap-2.5", light ? "text-white" : "text-ink", className)}>
      <Image src={images.logoMark} alt="" width={34} height={34} className="size-[34px]" priority />
      <span className="font-display text-xl font-bold tracking-tight">Evently</span>
    </Link>
  );
}
