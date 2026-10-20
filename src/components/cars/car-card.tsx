"use client";

import Link from "next/link";
import { CarPhoto } from "@/components/cars/car-photo";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Car } from "@/types";
import { formatPrice, formatKm } from "@/lib/format";
import { StatusBadge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

export function CarCard({ car }: { car: Car }) {
  const cover =
    car.images?.find((i) => i.is_cover)?.url ?? car.images?.[0]?.url ?? "";
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
        "glass-card group relative rounded-2xl",
        car.status === "sold" && "opacity-90"
      )}
    >
      {car.status === "sold" && (
        <div className="pointer-events-none absolute left-0 top-4 z-10 -rotate-45 bg-red-600 px-16 py-1 text-xs font-bold uppercase tracking-widest text-white shadow-lg">
          Sold
        </div>
      )}
      <div className="relative overflow-hidden">
        {cover ? (
          <div className="transition duration-500 group-hover:scale-[1.02]">
            <CarPhoto src={cover} alt={car.name} variant="card" />
          </div>
        ) : (
          <div className="flex aspect-[810/1013] items-center justify-center bg-white/5 text-white/30">
            No image
          </div>
        )}
        <div className="absolute right-3 top-3">
          <StatusBadge status={car.status} />
        </div>
      </div>
      <div className="space-y-2 p-4">
        <h3 className="text-lg font-semibold text-white">{car.name}</h3>
        <p className="text-sm text-white/55">
          {car.year} · {formatKm(car.mileage)} · {car.transmission}
        </p>
        <p className="text-xl font-bold text-accent">{formatPrice(car.price)}</p>
        <Link
          href={`/cars/${car.slug}`}
          className="glass-cta inline-flex w-full items-center justify-center rounded-xl py-2 text-sm font-semibold text-white transition hover:border-accent/50 hover:bg-accent/20 hover:text-accent"
        >
          View Details
        </Link>
      </div>
    </motion.article>
  );
}
