import type { Car, CarFilters } from "@/types";

export function carMatchesBrand(car: Car, brand: string): boolean {
  const b = brand.toLowerCase().trim();
  return (
    car.brand.toLowerCase() === b ||
    car.name.toLowerCase().startsWith(`${b} `) ||
    car.name.toLowerCase().includes(b)
  );
}

export function filterCars(cars: Car[], filters?: CarFilters): Car[] {
  let list = [...cars];
  if (!filters) return list;

  if (filters.status && filters.status !== "all") {
    list = list.filter((c) => c.status === filters.status);
  }
  if (filters.brand) {
    list = list.filter((c) => carMatchesBrand(c, filters.brand!));
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
    const fuel = filters.fuelType.toLowerCase();
    list = list.filter((c) => {
      const ft = c.fuel_type.toLowerCase();
      if (fuel === "hybrid") return ft.includes("hybrid");
      if (fuel === "petrol") return ft.includes("petrol") && !ft.includes("diesel");
      if (fuel === "diesel") return ft.includes("diesel");
      return ft === fuel;
    });
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
    const q = filters.search.toLowerCase().trim();
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
