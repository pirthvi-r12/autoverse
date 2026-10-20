"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Car, CarFilters } from "@/types";
import { parseCarFiltersFromSearchParams } from "@/lib/cars-search-params";
import { CarGallery } from "./car-gallery";

export function CarsListing({
  initialCars,
}: {
  initialCars: Car[];
  initialFilters?: CarFilters;
}) {
  const params = useSearchParams();
  const filters = parseCarFiltersFromSearchParams(params);
  const [cars, setCars] = useState(initialCars);
  const [loading, setLoading] = useState(false);

  const queryKey = params.toString();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const url = queryKey
      ? `/api/public/cars?${queryKey}`
      : "/api/public/cars";

    fetch(url, { cache: "no-store" })
      .then((res) => res.json())
      .then((data: { cars: Car[] }) => {
        if (!cancelled) setCars(data.cars ?? []);
      })
      .catch(() => {
        if (!cancelled) setCars([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [queryKey]);

  return (
    <div className="relative">
      {loading && (
        <p className="mb-3 text-sm text-accent" aria-live="polite">
          Updating results…
        </p>
      )}
      <CarGallery cars={cars} filters={filters} />
    </div>
  );
}
