"use client";

import Link from "next/link";
import { CarPhoto } from "@/components/cars/car-photo";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Car } from "@/types";
import { formatPrice, formatKm } from "@/lib/format";
import { StatusBadge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { getCarCoverUrl } from "@/lib/car-image";

export function CarCard({ car }: { car: Car }) {
  const cover = getCarCoverUrl(car.images);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), {
    stiffness: 300,
    damping: 30,
  });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.article
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn(
        "glass-card group relative overflow-hidden rounded-2xl max-md:!transform-none",
        car.status === "sold" && "opacity-95"
      )}
    >
      <div className="relative overflow-hidden rounded-t-2xl">
        <div className="transition duration-500 group-hover:scale-[1.02]">
          <CarPhoto src={cover} alt={car.name} variant="card" />
        </div>
        {car.status === "sold" && (
          <div className="pointer-events-none absolute inset-0 bg-black/10" aria-hidden />
        )}
        {car.status === "sold" && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md sm:text-xs">
            Sold
          </span>
        )}
        <div className="absolute right-3 top-3 z-10">
          <StatusBadge status={car.status} />
        </div>
      </div>
      <div className="space-y-1.5 p-4">
        <h3 className="text-base font-semibold leading-snug text-white sm:text-lg">
          {car.name}
        </h3>
        <p className="text-xs font-medium text-accent/90 sm:text-sm">
          {car.brand} {car.model}
        </p>
        <p className="text-sm text-white/55">
          {car.year} · {formatKm(car.mileage)} · {car.transmission}
        </p>
        <p className="text-xl font-bold text-accent">{formatPrice(car.price)}</p>
        <Link
          href={`/cars/${car.slug}`}
          className="glass-cta btn-touch inline-flex w-full items-center justify-center rounded-xl text-white transition hover:border-accent/50 hover:bg-accent/20 hover:text-accent"
        >
          View Details
        </Link>
      </div>
    </motion.article>
  );
}
