"use server";

import { revalidatePath } from "next/cache";
import { buildCarSlug } from "@/lib/slug";
import { completeInspectionWithReport, updateInspectionStatus } from "@/lib/data/inspections";
import {
  getCarById,
  persistCar,
  persistCarStatus,
  removeCar,
} from "@/lib/data/cars";
import { getInspectionById } from "@/lib/data/inspections";
import { redirect } from "next/navigation";
import type { Car, CarStatus } from "@/types";
import {
  normalizeCarImages,
  parseCarImagesJson,
} from "@/lib/admin/car-images";

export async function upsertCar(input: {
  id?: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  body_type: string;
  status: CarStatus;
  description?: string;
  features?: string[];
  is_featured?: boolean;
  cover_url?: string;
  engine_capacity?: string;
  color?: string;
  registration_city?: string;
  owners?: number;
  condition?: string;
  images_json?: string;
}) {
  const id = input.id ?? crypto.randomUUID();
  const slug = buildCarSlug(input.brand, input.model, input.year, id);

  const parsedImages = parseCarImagesJson(input.images_json);
  const imageInputs =
    parsedImages.length > 0
      ? parsedImages
      : input.cover_url
        ? [{ url: input.cover_url, sort_order: 0, is_cover: true }]
        : [];
  const images = normalizeCarImages(id, imageInputs, input.name);

  const prev = input.id ? await getCarById(input.id) : null;
  const record: Car = {
    id,
    slug,
    name: input.name,
    brand: input.brand,
    model: input.model,
    year: input.year,
    price: input.price,
    mileage: input.mileage,
    fuel_type: input.fuel_type,
    transmission: input.transmission,
    engine_capacity: input.engine_capacity,
    color: input.color,
    body_type: input.body_type,
    registration_city: input.registration_city,
    owners: input.owners,
    condition: input.condition,
    status: input.status,
    description: input.description,
    features: input.features ?? [],
    is_featured: input.is_featured ?? false,
    created_at: prev?.created_at ?? new Date().toISOString(),
    images,
  };
  await persistCar(record);
  revalidatePath("/cars");
  revalidatePath(`/cars/${slug}`);
  revalidatePath("/admin/cars");
  return { ok: true, id };
}

export async function setCarStatus(id: string, status: CarStatus) {
  await persistCarStatus(id, status);
  revalidatePath("/cars");
  return { ok: true };
}

export async function deleteCar(id: string) {
  await removeCar(id);
  revalidatePath("/cars");
  return { ok: true };
}

export async function createCarFromInspectionAction(
  formData: FormData
): Promise<void> {
  const inspectionId = String(formData.get("inspection_id"));
  await createCarFromInspection(inspectionId);
}

export async function createCarFromInspection(inspectionId: string) {
  const inspection = await getInspectionById(inspectionId);
  if (!inspection) return { ok: false, error: "Inspection not found" };

  return upsertCar({
    name: `${inspection.car_brand} ${inspection.car_model}`,
    brand: inspection.car_brand,
    model: inspection.car_model,
    year: inspection.car_year ?? new Date().getFullYear(),
    price: 0,
    mileage: inspection.mileage ?? 0,
    fuel_type: inspection.fuel_type ?? "Petrol",
    transmission: inspection.transmission ?? "Automatic",
    body_type: "Sedan",
    status: "available",
    description: `Auto-created from inspection ${inspectionId}`,
  });
}

export async function changeInspectionStatus(
  id: string,
  status: Parameters<typeof updateInspectionStatus>[1]
) {
  const result = await updateInspectionStatus(id, status);
  revalidatePath("/admin/inspections");
  return result;
}

export async function finalizeInspectionReport(
  formData: FormData
): Promise<void> {
  const id = String(formData.get("inspection_id"));
  const rating = Number(formData.get("rating"));
  const inspector_remarks = String(formData.get("inspector_remarks") ?? "");
  const checklist: Record<string, { score: number; notes: string }> = {};
  for (const key of [
    "engine",
    "transmission",
    "suspension",
    "brakes",
    "tyres",
    "electrical",
    "ac",
    "interior",
    "exterior_paint",
    "accident_history",
  ]) {
    checklist[key] = {
      score: Number(formData.get(`${key}_score`) ?? 0),
      notes: String(formData.get(`${key}_notes`) ?? ""),
    };
  }

  const result = await completeInspectionWithReport(id, {
    checklist,
    rating,
    inspector_remarks,
  });
  revalidatePath("/admin/inspections");
  revalidatePath(`/admin/inspections/${id}`);
  if (result.ok && result.token) {
    redirect(`/admin/inspections/${id}?token=${result.token}`);
  }
}

export async function markCarSoldAction(formData: FormData) {
  const id = String(formData.get("id"));
  await setCarStatus(id, "sold");
}

export async function deleteCarAction(formData: FormData) {
  const id = String(formData.get("id"));
  await deleteCar(id);
}

export async function setInspectionStatusAction(formData: FormData) {
  const id = String(formData.get("id"));
  const status = String(formData.get("status")) as Parameters<
    typeof changeInspectionStatus
  >[1];
  await changeInspectionStatus(id, status);
}
