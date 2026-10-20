"use client";

import Link from "next/link";
import type { Car } from "@/types";
import type { CarFilters } from "@/types";
import { CarCard } from "./car-card";

export function CarGallery({
  cars,
  filters,
}: {
  cars: Car[];
  filters?: CarFilters;
}) {
  if (!cars.length) {
    const brand = filters?.brand;
    const status = filters?.status ?? "available";
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-12 text-center">
        <p className="text-lg font-semibold text-white">No cars match your filters</p>
        <p className="mt-2 text-sm text-white/55">
          {status === "reserved"
            ? "No reserved cars in stock right now — try Available or All status."
            : status === "available" && brand
              ? `No available ${brand} in stock — check Sold for delivered ${brand} cars.`
              : "Try clearing filters or choosing another status / brand."}
        </p>
        <div className="mt-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
          <Link
            href="/cars"
            className="btn-touch rounded-full border border-white/20 px-5 text-white"
          >
            Clear filters
          </Link>
          {brand && status === "available" && (
            <Link
              href={`/cars?brand=${encodeURIComponent(brand)}&status=sold`}
              className="btn-touch rounded-full bg-accent px-5 text-black"
            >
              View sold {brand}
            </Link>
          )}
          {brand && status === "sold" && (
            <Link
              href={`/cars?brand=${encodeURIComponent(brand)}&status=all`}
              className="btn-touch rounded-full border border-white/20 px-5 text-white"
            >
              All {brand} (live + sold)
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-4 text-sm text-white/50">
        {cars.length} car{cars.length === 1 ? "" : "s"} found
      </p>
      <div className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    </div>
  );
}
