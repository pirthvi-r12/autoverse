import type { CarImage } from "@/types";

export type CarImageInput = {
  id?: string;
  url: string;
  alt_text?: string;
  sort_order: number;
  is_cover: boolean;
};

export function parseCarImagesJson(raw: string | null | undefined): CarImageInput[] {
  if (!raw?.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as CarImageInput[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((i) => typeof i.url === "string" && i.url.length > 0);
  } catch {
    return [];
  }
}

export function normalizeCarImages(
  carId: string,
  images: CarImageInput[],
  carName: string
): CarImage[] {
  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);
  let coverSet = false;
  return sorted.map((img, index) => {
    const is_cover = img.is_cover && !coverSet ? true : !coverSet && index === 0;
    if (is_cover) coverSet = true;
    return {
      id: img.id ?? crypto.randomUUID(),
      car_id: carId,
      url: img.url,
      alt_text: img.alt_text ?? `${carName} — photo ${index + 1}`,
      sort_order: index,
      is_cover,
    };
  });
}
