import Image from "next/image";
import { cn } from "@/lib/cn";
import {
  SHOWROOM_PHOTO_HEIGHT,
  SHOWROOM_PHOTO_WIDTH,
  carPhotoQuality,
  carPhotoUnoptimized,
  isLocalCarPhoto,
} from "@/lib/car-image";

type Variant = "card" | "hero" | "detail" | "thumb" | "lightbox";

const aspectClass = "aspect-[810/1013]";

export function CarPhoto({
  src,
  alt,
  variant = "hero",
  priority = false,
  className,
}: {
  src: string;
  alt: string;
  variant?: Variant;
  priority?: boolean;
  className?: string;
}) {
  const local = isLocalCarPhoto(src);
  const quality = carPhotoQuality(src);
  const unoptimized = carPhotoUnoptimized(src);

  if (variant === "thumb") {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        quality={quality}
        unoptimized={unoptimized}
        className={cn("object-contain object-center", className)}
        sizes="81px"
      />
    );
  }

  if (variant === "lightbox") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        width={SHOWROOM_PHOTO_WIDTH}
        height={SHOWROOM_PHOTO_HEIGHT}
        className={cn(
          "max-h-[92vh] w-auto max-w-full object-contain",
          className
        )}
        decoding="async"
      />
    );
  }

  const sizes =
    variant === "card"
      ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      : variant === "detail"
        ? "100vw"
        : "(max-width: 1024px) 100vw, 50vw";

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-[#0a0e14]",
        variant === "detail"
          ? "aspect-[4/5] max-h-[min(58vh,520px)] sm:aspect-[810/1013] sm:max-h-none"
          : aspectClass,
        variant === "card" && "rounded-none",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        quality={quality}
        unoptimized={unoptimized}
        sizes={sizes}
        className={cn(
          "object-contain object-center",
          !local && "object-cover"
        )}
      />
    </div>
  );
}
