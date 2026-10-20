import type { CarFilters } from "@/types";

type RawParams = Record<string, string | string[] | undefined>;

function one(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" ? value : undefined;
}

/** Shared URL → filter mapping for /cars (server + client). */
export function parseCarFiltersFromSearchParams(
  sp: URLSearchParams | RawParams
): CarFilters {
  const get = (key: string): string | undefined => {
    if (sp instanceof URLSearchParams) {
      const v = sp.get(key);
      return v && v.length > 0 ? v : undefined;
    }
    return one(sp[key]);
  };

  const statusRaw = get("status");
  const status =
    (statusRaw as CarFilters["status"] | undefined) ?? "available";

  return {
    brand: get("brand")?.trim() || undefined,
    search: get("search")?.trim() || undefined,
    fuelType: get("fuelType")?.trim() || undefined,
    transmission: get("transmission")?.trim() || undefined,
    bodyType: get("bodyType")?.trim() || undefined,
    sort: (get("sort") as CarFilters["sort"]) ?? "newest",
    status,
    yearMin: get("yearMin") ? Number(get("yearMin")) : undefined,
    yearMax: get("yearMax") ? Number(get("yearMax")) : undefined,
    priceMin: get("priceMin") ? Number(get("priceMin")) : undefined,
    priceMax: get("priceMax") ? Number(get("priceMax")) : undefined,
  };
}

export function carFiltersToSearchParams(filters: Partial<CarFilters>): string {
  const next = new URLSearchParams();
  const status = filters.status ?? "available";

  if (filters.search) next.set("search", filters.search);
  if (filters.brand) next.set("brand", filters.brand);
  if (filters.fuelType) next.set("fuelType", filters.fuelType);
  if (filters.transmission) next.set("transmission", filters.transmission);
  if (filters.bodyType) next.set("bodyType", filters.bodyType);
  if (filters.sort && filters.sort !== "newest") next.set("sort", filters.sort);

  const hasFilters =
    filters.brand ||
    filters.search ||
    filters.fuelType ||
    filters.transmission ||
    filters.bodyType ||
    status !== "available" ||
    (filters.sort && filters.sort !== "newest");

  if (hasFilters) {
    next.set("status", status);
  }

  if (filters.yearMin != null) next.set("yearMin", String(filters.yearMin));
  if (filters.yearMax != null) next.set("yearMax", String(filters.yearMax));
  if (filters.priceMin != null) next.set("priceMin", String(filters.priceMin));
  if (filters.priceMax != null) next.set("priceMax", String(filters.priceMax));
  return next.toString();
}
