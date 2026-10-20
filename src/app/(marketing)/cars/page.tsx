import { Suspense } from "react";
import type { Metadata } from "next";
import { getPublicCars } from "@/lib/data/cars";
import { CarFilters } from "@/components/cars/car-filters";
import { CarsListing } from "@/components/cars/cars-listing";
import { SITE } from "@/lib/constants";
import { parseCarFiltersFromSearchParams } from "@/lib/cars-search-params";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Used Cars for Sale in ${SITE.city}`,
  description: `Browse inspected used cars at ${SITE.name} in ${SITE.city}. Filter by brand, price, year, fuel type, and more.`,
  alternates: { canonical: `${SITE.url}/cars` },
};

type SearchParams = Record<string, string | string[] | undefined>;

export default async function CarsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const filters = parseCarFiltersFromSearchParams(sp);

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
        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-3">
              {cars.slice(0, 6).map((car) => (
                <div
                  key={car.id}
                  className="h-80 animate-pulse rounded-2xl bg-white/5"
                />
              ))}
            </div>
          }
        >
          <CarsListing initialCars={cars} />
        </Suspense>
      </div>
    </div>
  );
}
