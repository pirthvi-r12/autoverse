"use client";

import type { Car } from "@/types";
import { CarCard } from "./car-card";

export function CarGallery({ cars }: { cars: Car[] }) {
  if (!cars.length) {
    return (
      <p className="py-16 text-center text-white/50">No cars match your filters.</p>
    );
  }
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cars.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  );
}
