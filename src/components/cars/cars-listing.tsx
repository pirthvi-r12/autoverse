"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Car } from "@/types";
import { parseCarFiltersFromSearchParams } from "@/lib/cars-search-params";
import { applyPublicCarFilters } from "@/lib/public-car-catalog";
import { CarGallery } from "./car-gallery";

type Catalog = { inventory: Car[]; sold: Car[] };

export function CarsListing({ initialCars }: { initialCars: Car[] }) {
  const params = useSearchParams();
  const queryKey = params.toString();
  const filters = parseCarFiltersFromSearchParams(params);

  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [catalogError, setCatalogError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/public/cars/catalog", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("catalog failed");
        return res.json() as Promise<Catalog>;
      })
      .then((data) => {
        if (!cancelled) {
          setCatalog(data);
          setCatalogError(false);
        }
      })
      .catch(() => {
        if (!cancelled) setCatalogError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const cars = useMemo(() => {
    const f = parseCarFiltersFromSearchParams(params);
    if (catalog) {
      return applyPublicCarFilters(catalog.inventory, catalog.sold, f);
    }
    return initialCars;
  }, [catalog, initialCars, params, queryKey]);

  return (
    <div className="relative">
      {catalogError && (
        <p className="mb-3 text-sm text-amber-300">
          Could not refresh inventory. Showing last loaded results.
        </p>
      )}
      {!catalog && (
        <p className="mb-3 text-sm text-white/45" aria-live="polite">
          Loading inventory…
        </p>
      )}
      <CarGallery cars={cars} filters={filters} />
    </div>
  );
}
