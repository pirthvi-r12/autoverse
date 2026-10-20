import type { CarFilters } from "@/types";

type RawParams = Record<string, string | string[] | undefined>;

function one(value: string | string[] | undefined): string | undefined {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  return undefined;
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

  const sortRaw = get("sort");

  return {
    brand: get("brand")?.trim() || undefined,
    search: get("search")?.trim() || undefined,
    fuelType: get("fuelType")?.trim() || undefined,
    transmission: get("transmission")?.trim() || undefined,
    bodyType: get("bodyType")?.trim() || undefined,
    sort: (sortRaw as CarFilters["sort"]) ?? "newest",
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
  const sort = filters.sort ?? "newest";

  if (filters.search) next.set("search", filters.search);
  if (filters.brand) next.set("brand", filters.brand);
  if (filters.fuelType) next.set("fuelType", filters.fuelType);
  if (filters.transmission) next.set("transmission", filters.transmission);
  if (filters.bodyType) next.set("bodyType", filters.bodyType);

  const touched =
    filters.search ||
    filters.brand ||
    filters.fuelType ||
    filters.transmission ||
    filters.bodyType ||
    status !== "available" ||
    sort !== "newest";

  if (touched) {
    next.set("status", status);
    next.set("sort", sort);
  }

  if (filters.yearMin != null) next.set("yearMin", String(filters.yearMin));
  if (filters.yearMax != null) next.set("yearMax", String(filters.yearMax));
  if (filters.priceMin != null) next.set("priceMin", String(filters.priceMin));
  if (filters.priceMax != null) next.set("priceMax", String(filters.priceMax));
  return next.toString();
}
