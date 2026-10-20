import { filterCars } from "@/lib/filter-cars";
import type { Car, CarFilters } from "@/types";

/** Pure filter pipeline (inventory + sold handovers) — safe for client + server. */
export function applyPublicCarFilters(
  inventory: Car[],
  soldShowcase: Car[],
  filters?: CarFilters
): Car[] {
  const status = filters?.status ?? "available";
  const soldFiltered = filterCars(soldShowcase, { ...filters, status: "sold" });

  if (status === "sold") {
    return soldFiltered;
  }

  if (status === "available") {
    return filterCars(inventory, { ...filters, status: "available" });
  }

  if (status === "reserved") {
    return filterCars(inventory, { ...filters, status: "reserved" });
  }

  const active = filterCars(inventory, { ...filters, status: "all" });
  const combined = [...active, ...soldFiltered];
  return filterCars(combined, { ...filters, status: "all" });
}
