import { cn } from "@/lib/cn";
import { forwardRef, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-brand-ink hover:bg-accent/90 shadow-[0_0_24px_rgba(96,219,251,0.35)]",
  secondary:
    "glass-cta text-white hover:border-white/30 hover:bg-white/10 backdrop-blur-md",
  ghost: "text-white/80 hover:text-white hover:bg-white/5 backdrop-blur-sm",
  outline:
    "glass-cta border-white/20 text-white hover:border-accent/50 hover:text-accent hover:bg-accent/10",
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }
>(function Button({ className, variant = "primary", ...props }, ref) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});
