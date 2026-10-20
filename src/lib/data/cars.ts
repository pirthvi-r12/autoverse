import { isDatabaseConfigured } from "@/lib/db/config";
import {
  dbDeleteCar,
  dbGetCarById,
  dbGetCarBySlug,
  dbGetCars,
  dbGetFeaturedCars,
  dbGetPublicCars,
  dbGetSoldShowcaseCars,
  dbSetCarStatus,
  dbUpsertCar,
} from "@/lib/db/cars-repo";
import { MOCK_CARS } from "@/lib/mock-data";
import type { Car, CarFilters } from "@/types";

function filterMock(cars: Car[], filters?: CarFilters): Car[] {
  let list = [...cars];
  if (!filters) return list;

  if (filters.status && filters.status !== "all") {
    list = list.filter((c) => c.status === filters.status);
  }
  if (filters.brand) {
    list = list.filter(
      (c) => c.brand.toLowerCase() === filters.brand!.toLowerCase()
    );
  }
  if (filters.model) {
    list = list.filter((c) =>
      c.model.toLowerCase().includes(filters.model!.toLowerCase())
    );
  }
  if (filters.yearMin) list = list.filter((c) => c.year >= filters.yearMin!);
  if (filters.yearMax) list = list.filter((c) => c.year <= filters.yearMax!);
  if (filters.priceMin) list = list.filter((c) => c.price >= filters.priceMin!);
  if (filters.priceMax) list = list.filter((c) => c.price <= filters.priceMax!);
  if (filters.fuelType) {
    list = list.filter(
      (c) => c.fuel_type.toLowerCase() === filters.fuelType!.toLowerCase()
    );
  }
  if (filters.transmission) {
    list = list.filter(
      (c) =>
        c.transmission.toLowerCase() === filters.transmission!.toLowerCase()
    );
  }
  if (filters.bodyType) {
    list = list.filter(
      (c) => c.body_type.toLowerCase() === filters.bodyType!.toLowerCase()
    );
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.brand.toLowerCase().includes(q) ||
        c.model.toLowerCase().includes(q)
    );
  }

  switch (filters.sort) {
    case "price_asc":
      list.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      list.sort((a, b) => b.price - a.price);
      break;
    case "year_desc":
      list.sort((a, b) => b.year - a.year);
      break;
    case "newest":
    default:
      list.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  }

  return list;
}

/** Public showroom listing — hides sold unless the visitor picks “Sold”. */
export async function getPublicCars(filters?: CarFilters): Promise<Car[]> {
  if (isDatabaseConfigured()) {
    return dbGetPublicCars(filters);
  }
  const status = filters?.status ?? "available";
  return filterMock(MOCK_CARS, { ...filters, status });
}

export async function getCars(filters?: CarFilters): Promise<Car[]> {
  if (isDatabaseConfigured()) {
    return dbGetCars(filters);
  }
  return filterMock(MOCK_CARS, filters);
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
  if (isDatabaseConfigured()) {
    return dbGetSoldShowcaseCars(limit);
  }
  return MOCK_CARS.filter((c) => c.status === "sold").slice(0, limit);
}

export async function getCarBySlug(slug: string): Promise<Car | null> {
  if (isDatabaseConfigured()) {
    return dbGetCarBySlug(slug);
  }
  return MOCK_CARS.find((c) => c.slug === slug) ?? null;
}

export async function getCarById(id: string): Promise<Car | null> {
  if (isDatabaseConfigured()) {
    return dbGetCarById(id);
  }
  return MOCK_CARS.find((c) => c.id === id) ?? null;
}

export async function getRelatedCars(car: Car, limit = 4): Promise<Car[]> {
  const all = await getCars({
    brand: car.brand,
    status: "available",
  });
  return all.filter((c) => c.id !== car.id).slice(0, limit);
}

export async function getCarStats() {
  const cars = await getCars();
  return {
    total: cars.length,
    available: cars.filter((c) => c.status === "available").length,
    sold: cars.filter((c) => c.status === "sold").length,
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
