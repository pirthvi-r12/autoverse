/** Native dimensions of AutoVerse showroom photos (Changan Oshan X7 set). */
export const SHOWROOM_PHOTO_WIDTH = 810;
export const SHOWROOM_PHOTO_HEIGHT = 1013;

export function isLocalCarPhoto(src: string) {
  return (
    src.startsWith("/images/") ||
    src.startsWith("/cars/") ||
    src.startsWith("/uploads/") ||
    src.includes("blob.vercel-storage.com")
  );
}

export function carPhotoQuality(src: string) {
  return isLocalCarPhoto(src) ? 100 : 90;
}

export function carPhotoUnoptimized(src: string) {
  return isLocalCarPhoto(src);
}
