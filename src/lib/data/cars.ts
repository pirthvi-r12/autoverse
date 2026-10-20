import { isDatabaseConfigured } from "@/lib/db/config";
import {
  dbDeleteCar,
  dbGetCarById,
  dbGetCarBySlug,
  dbGetCars,
  dbGetFeaturedCars,
  dbSetCarStatus,
  dbUpsertCar,
} from "@/lib/db/cars-repo";
import { filterCars } from "@/lib/filter-cars";
import { applyPublicCarFilters } from "@/lib/public-car-catalog";
import {
  getSoldDeliveryCarBySlug,
  getSoldDeliveryInventory,
} from "@/lib/sold-delivery-inventory";
import { MOCK_CARS } from "@/lib/mock-data";
import type { Car, CarFilters } from "@/types";

async function getActiveInventory(): Promise<Car[]> {
  const all = isDatabaseConfigured() ? await dbGetCars() : MOCK_CARS;
  return all.filter((c) => c.status !== "sold");
}

export async function getPublicCatalog() {
  return {
    inventory: await getActiveInventory(),
    sold: getSoldDeliveryInventory(),
  };
}

/** Public showroom: live inventory + sold handovers from Sold & Delivered section. */
export async function getPublicCars(filters?: CarFilters): Promise<Car[]> {
  const { inventory, sold } = await getPublicCatalog();
  return applyPublicCarFilters(inventory, sold, filters);
}

export async function getCars(filters?: CarFilters): Promise<Car[]> {
  if (isDatabaseConfigured()) {
    return dbGetCars(filters);
  }
  return filterCars(MOCK_CARS, filters);
}

export async function getFeaturedCars(limit = 6): Promise<Car[]> {
  if (isDatabaseConfigured()) {
    return dbGetFeaturedCars(limit);
  }
  return MOCK_CARS.filter((c) => c.is_featured && c.status === "available").slice(
    0,
    limit
  );
}

export async function getSoldShowcaseCars(limit = 8): Promise<Car[]> {
  return getSoldDeliveryInventory().slice(0, limit);
}

export async function getCarBySlug(slug: string): Promise<Car | null> {
  const sold = getSoldDeliveryCarBySlug(slug);
  if (sold) return sold;

  if (isDatabaseConfigured()) {
    return dbGetCarBySlug(slug);
  }
  return MOCK_CARS.find((c) => c.slug === slug) ?? null;
}

export async function getCarById(id: string): Promise<Car | null> {
  if (id.startsWith("sold-")) {
    return getSoldDeliveryCarBySlug(`sold-delivery-${id.slice("sold-".length)}`);
  }
  if (isDatabaseConfigured()) {
    return dbGetCarById(id);
  }
  return MOCK_CARS.find((c) => c.id === id) ?? null;
}

export async function getRelatedCars(car: Car, limit = 4): Promise<Car[]> {
  if (car.status === "sold") {
    const related = filterCars(getSoldDeliveryInventory(), {
      brand: car.brand,
      status: "sold",
    });
    return related.filter((c) => c.id !== car.id).slice(0, limit);
  }
  const all = await getCars({
    brand: car.brand,
    status: "available",
  });
  return all.filter((c) => c.id !== car.id).slice(0, limit);
}

export async function getCarStats() {
  const cars = await getCars();
  const soldDeliveries = getSoldDeliveryInventory().length;
  return {
    total: cars.filter((c) => c.status !== "sold").length + soldDeliveries,
    available: cars.filter((c) => c.status === "available").length,
    sold: soldDeliveries,
    reserved: cars.filter((c) => c.status === "reserved").length,
  };
}

export async function persistCar(record: Car): Promise<void> {
  if (isDatabaseConfigured()) {
    await dbUpsertCar(record);
    return;
  }
  const existing = MOCK_CARS.findIndex((c) => c.id === record.id);
  if (existing >= 0) MOCK_CARS[existing] = record;
  else MOCK_CARS.unshift(record);
}

export async function persistCarStatus(
  id: string,
  status: Car["status"]
): Promise<void> {
  if (isDatabaseConfigured()) {
    await dbSetCarStatus(id, status);
    return;
  }
  const car = MOCK_CARS.find((c) => c.id === id);
  if (car) car.status = status;
}

export async function removeCar(id: string): Promise<void> {
  if (isDatabaseConfigured()) {
    await dbDeleteCar(id);
    return;
  }
  const idx = MOCK_CARS.findIndex((c) => c.id === id);
  if (idx >= 0) MOCK_CARS.splice(idx, 1);
}
