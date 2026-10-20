import { Suspense } from "react";
import type { Metadata } from "next";
import { getPublicCars } from "@/lib/data/cars";
import { CarFilters } from "@/components/cars/car-filters";
import { CarGallery } from "@/components/cars/car-gallery";
import { SITE } from "@/lib/constants";
import type { CarFilters as Filters } from "@/types";

export const metadata: Metadata = {
  title: `Used Cars for Sale in ${SITE.city}`,
  description: `Browse inspected used cars at ${SITE.name} in ${SITE.city}. Filter by brand, price, year, fuel type, and more.`,
  alternates: { canonical: `${SITE.url}/cars` },
};

type SearchParams = Record<string, string | string[] | undefined>;

function param(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}

export default async function CarsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const filters: Filters = {
    brand: param(sp.brand),
    search: param(sp.search),
    fuelType: param(sp.fuelType),
    transmission: param(sp.transmission),
    bodyType: param(sp.bodyType),
    sort: (param(sp.sort) as Filters["sort"]) ?? "newest",
    status: (param(sp.status) as Filters["status"]) ?? "available",
    yearMin: param(sp.yearMin) ? Number(param(sp.yearMin)) : undefined,
    yearMax: param(sp.yearMax) ? Number(param(sp.yearMax)) : undefined,
    priceMin: param(sp.priceMin) ? Number(param(sp.priceMin)) : undefined,
    priceMax: param(sp.priceMax) ? Number(param(sp.priceMax)) : undefined,
  };

  const cars = await getPublicCars(filters);

  return (
    <div className="page-shell">
      <h1 className="section-title">
        Car Gallery — Buy Used Cars in {SITE.city}
      </h1>
      <p className="section-lead max-w-2xl">
        Explore our showroom inventory with transparent pricing and detailed specs.
      </p>
      <div className="mt-6 sm:mt-8">
        <Suspense fallback={<div className="h-24 animate-pulse rounded-2xl bg-white/5" />}>
          <CarFilters />
        </Suspense>
      </div>
      <div className="mt-6 sm:mt-8">
        <CarGallery cars={cars} />
      </div>
    </div>
  );
}
