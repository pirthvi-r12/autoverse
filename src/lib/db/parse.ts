import type { Car, CarImage, Inspection, Lead } from "@/types";
import type { RowDataPacket } from "mysql2";

export function toIso(value: Date | string | null | undefined): string {
  if (!value) return new Date().toISOString();
  if (value instanceof Date) return value.toISOString();
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

export function parseJsonArray(value: unknown): string[] {
  if (Array.isArray(value)) return value as string[];
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      return Array.isArray(parsed) ? (parsed as string[]) : [];
    } catch {
      return [];
    }
  }
  return [];
}

export function parseJsonObject(
  value: unknown
): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
    } catch {
      /* empty */
    }
  }
  return {};
}

export function rowToCarImage(row: RowDataPacket): CarImage {
  return {
    id: String(row.id),
    car_id: String(row.car_id),
    url: String(row.url),
    alt_text: row.alt_text != null ? String(row.alt_text) : null,
    sort_order: Number(row.sort_order),
    is_cover: Boolean(row.is_cover),
  };
}

export function rowToCar(row: RowDataPacket, images: CarImage[]): Car {
  return {
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    brand: String(row.brand),
    model: String(row.model),
    year: Number(row.year),
    price: Number(row.price),
    mileage: Number(row.mileage),
    fuel_type: String(row.fuel_type),
    transmission: String(row.transmission),
    engine_capacity: row.engine_capacity != null ? String(row.engine_capacity) : null,
    color: row.color != null ? String(row.color) : null,
    body_type: String(row.body_type),
    registration_city:
      row.registration_city != null ? String(row.registration_city) : null,
    owners: row.owners != null ? Number(row.owners) : null,
    condition: row.condition != null ? String(row.condition) : null,
    features: parseJsonArray(row.features),
    description: row.description != null ? String(row.description) : null,
    status: row.status as Car["status"],
    video_url: row.video_url != null ? String(row.video_url) : null,
    is_featured: Boolean(row.is_featured),
    created_at: toIso(row.created_at),
    updated_at: row.updated_at ? toIso(row.updated_at) : undefined,
    images,
  };
}

export function rowToInspection(row: RowDataPacket): Inspection {
  return {
    id: String(row.id),
    full_name: String(row.full_name),
    phone: String(row.phone),
    email: String(row.email),
    city: String(row.city),
    car_brand: String(row.car_brand),
    car_model: String(row.car_model),
    car_year: row.car_year != null ? Number(row.car_year) : null,
    registration_number:
      row.registration_number != null ? String(row.registration_number) : null,
    mileage: row.mileage != null ? Number(row.mileage) : null,
    color: row.color != null ? String(row.color) : null,
    fuel_type: row.fuel_type != null ? String(row.fuel_type) : null,
    transmission: row.transmission != null ? String(row.transmission) : null,
    inspection_type: row.inspection_type as Inspection["inspection_type"],
    preferred_date:
      row.preferred_date != null ? String(row.preferred_date).slice(0, 10) : null,
    preferred_time:
      row.preferred_time != null ? String(row.preferred_time) : null,
    location_type: row.location_type as Inspection["location_type"],
    address: row.address != null ? String(row.address) : null,
    photo_urls: parseJsonArray(row.photo_urls),
    notes: row.notes != null ? String(row.notes) : null,
    linked_car_id: row.linked_car_id != null ? String(row.linked_car_id) : null,
    status: row.status as Inspection["status"],
    created_at: toIso(row.created_at),
    updated_at: row.updated_at ? toIso(row.updated_at) : undefined,
  };
}

export function rowToLead(row: RowDataPacket): Lead {
  return {
    id: String(row.id),
    type: row.type as Lead["type"],
    full_name: row.full_name != null ? String(row.full_name) : null,
    email: row.email != null ? String(row.email) : null,
    phone: row.phone != null ? String(row.phone) : null,
    message: row.message != null ? String(row.message) : null,
    metadata: parseJsonObject(row.metadata),
    created_at: toIso(row.created_at),
  };
}
