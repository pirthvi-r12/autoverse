import { BRANDS } from "@/lib/constants";
import { SOLD_DELIVERIES, type SoldDelivery } from "@/lib/sold-deliveries";
import type { Car, CarImage } from "@/types";

const SOLD_SLUG_PREFIX = "sold-delivery-";

function inferBrand(name: string): string {
  const lower = name.toLowerCase();
  for (const brand of BRANDS) {
    if (lower.startsWith(brand.toLowerCase())) return brand;
  }
  return name.split(/\s+/)[0] ?? "AutoVerse";
}

function soldDeliveryToCar(item: SoldDelivery): Car {
  const brand = inferBrand(item.name);
  const slug = `${SOLD_SLUG_PREFIX}${item.id}`;
  const image: CarImage = {
    id: `img-sold-${item.id}`,
    car_id: `sold-${item.id}`,
    url: item.image,
    alt_text: item.name,
    sort_order: 0,
    is_cover: true,
  };

  return {
    id: `sold-${item.id}`,
    slug,
    name: item.name,
    brand,
    model: item.model,
    year: item.year,
    price: 0,
    mileage: 0,
    fuel_type: "Petrol",
    transmission: "Automatic",
    body_type: "Hatchback",
    features: [],
    description: "Sold and delivered by AutoVerse — handover photo from our showroom.",
    customer_feedback: item.feedback,
    status: "sold",
    is_featured: false,
    created_at: new Date(item.year, 0, 1).toISOString(),
    images: [image],
  };
}

/** Real sold handovers (homepage Sold & Delivered section). */
export function getSoldDeliveryInventory(): Car[] {
  return SOLD_DELIVERIES.map(soldDeliveryToCar);
}

export function getSoldDeliveryCarBySlug(slug: string): Car | null {
  if (!slug.startsWith(SOLD_SLUG_PREFIX)) return null;
  const id = slug.slice(SOLD_SLUG_PREFIX.length);
  const item = SOLD_DELIVERIES.find((d) => d.id === id);
  return item ? soldDeliveryToCar(item) : null;
}

export function isSoldDeliverySlug(slug: string): boolean {
  return slug.startsWith(SOLD_SLUG_PREFIX);
}
