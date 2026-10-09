import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "border-transparent bg-brand-600 text-white hover:bg-brand-700",
  secondary: "border-line-strong bg-white text-ink hover:bg-hover",
  ghost: "border-transparent text-ink-soft hover:bg-hover hover:text-ink",
  danger: "border-danger-200 bg-white text-danger-600 hover:bg-danger-50",
  white: "border-transparent bg-white text-night-800 hover:bg-brand-50",
  "outline-light": "border-white/30 bg-white/5 text-white hover:bg-white/10",
} as const;

const sizes = {
  sm: "h-9 px-3 text-sm rounded-lg",
  md: "h-11 px-4 text-[15px] rounded-[10px]",
  lg: "h-13 px-5 text-base rounded-xl",
} as const;

type StyleProps = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  block?: boolean;
};

export function buttonStyles({ variant = "primary", size = "md", block }: StyleProps = {}) {
  return cn(
    "inline-flex shrink-0 items-center justify-center gap-2 border font-bold whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-60",
    variants[variant],
    sizes[size],
    block && "w-full",
  );
}

type ButtonProps = React.ComponentProps<"button"> & StyleProps & { loading?: boolean };

export function Button({ variant, size, block, loading, className, children, disabled, type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(buttonStyles({ variant, size, block }), className)}
      {...props}
    >
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

type ButtonLinkProps = React.ComponentProps<typeof Link> & StyleProps;

export function ButtonLink({ variant, size, block, className, ...props }: ButtonLinkProps) {
  return <Link className={cn(buttonStyles({ variant, size, block }), className)} {...props} />;
}
