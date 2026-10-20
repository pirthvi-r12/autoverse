/** Native dimensions of AutoVerse showroom photos (Changan Oshan X7 set). */
export const SHOWROOM_PHOTO_WIDTH = 810;
export const SHOWROOM_PHOTO_HEIGHT = 1013;

/** Fallback when a listing has no gallery rows (common on sold inventory). */
export const CAR_PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=810&q=80&auto=format";

export function getCarCoverUrl(
  images: { url: string; is_cover?: boolean }[] | undefined | null
): string {
  if (!images?.length) return CAR_PLACEHOLDER_IMAGE;
  const cover = images.find((i) => i.is_cover)?.url ?? images[0]?.url;
  return cover?.trim() ? cover : CAR_PLACEHOLDER_IMAGE;
}

export function isLocalCarPhoto(src: string) {
  return (
    src.startsWith("/images/") ||
    src.startsWith("/cars/") ||
    src.startsWith("/uploads/") ||
    src.startsWith("/images/sold-deliveries/") ||
    src.includes("blob.vercel-storage.com")
  );
}

export function carPhotoQuality(src: string) {
  return isLocalCarPhoto(src) ? 100 : 90;
}

export function carPhotoUnoptimized(src: string) {
  return isLocalCarPhoto(src);
}
