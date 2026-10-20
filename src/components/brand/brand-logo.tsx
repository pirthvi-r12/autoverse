import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { BRAND } from "@/lib/constants";

type Variant = "mark" | "full";

export function BrandLogo({
  className,
  imageClassName,
  href = "/",
  priority = false,
  variant = "mark",
  showWordmark = true,
}: {
  className?: string;
  imageClassName?: string;
  href?: string;
  priority?: boolean;
  variant?: Variant;
  showWordmark?: boolean;
}) {
  const src = variant === "mark" ? BRAND.markSrc : BRAND.logoSrc;

  const wheelMark = (size: "nav" | "inline") => (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full bg-brand shadow-[0_0_0_2px_rgba(96,219,251,0.45),0_8px_24px_rgba(6,32,40,0.45)]",
        size === "nav" ? "h-11 w-11 sm:h-12 sm:w-12" : "h-6 w-6 sm:h-7 sm:w-7",
        size === "nav" ? imageClassName : undefined
      )}
    >
      <Image
        src={BRAND.markSrc}
        alt=""
        fill
        priority={priority}
        unoptimized
        sizes={size === "nav" ? "48px" : "28px"}
        className="object-cover object-center scale-[1.15]"
      />
    </div>
  );

  const content =
    variant === "mark" ? (
      showWordmark ? (
        <div className={cn("flex items-center gap-3", className)}>
          {wheelMark("nav")}
          <div className="min-w-0 leading-none">
            <div
              className="flex items-center gap-1 sm:gap-1.5"
              aria-label={BRAND.name}
            >
              <span className="text-base font-extrabold uppercase tracking-[0.2em] text-white sm:text-lg">
                AUT
              </span>
              {wheelMark("inline")}
              <span className="text-base font-extrabold uppercase tracking-[0.2em] text-white sm:text-lg">
                VERSE
              </span>
            </div>
            <p className="mt-1 truncate text-right text-[9px] font-semibold uppercase tracking-[0.22em] text-accent sm:text-[10px]">
              {BRAND.tagline}
            </p>
          </div>
        </div>
      ) : (
        <div className={cn("flex items-center", className)}>{wheelMark("nav")}</div>
      )
    ) : (
      <div
        className={cn(
          "overflow-hidden rounded-2xl bg-brand/90 p-2 ring-1 ring-accent/30",
          className
        )}
      >
        <Image
          src={src}
          alt={`${BRAND.name} — ${BRAND.tagline}`}
          width={220}
          height={80}
          priority={priority}
          unoptimized
          className={cn("h-auto w-[180px] max-w-full", imageClassName)}
        />
      </div>
    );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} className="inline-flex shrink-0 transition opacity-95 hover:opacity-100">
      {content}
    </Link>
  );
}
