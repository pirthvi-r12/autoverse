import Link from "next/link";
import { Quote } from "lucide-react";
import { getSoldShowcaseCars } from "@/lib/data/cars";
import { CarPhoto } from "@/components/cars/car-photo";

export async function SoldShowcaseSection() {
  const sold = await getSoldShowcaseCars(8);
  if (!sold.length) return null;

  return (
    <section className="border-y border-white/10 bg-white/[0.02] py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white">Recently Sold</h2>
            <p className="mt-2 max-w-xl text-white/60">
              Real cars from our showroom — photos and feedback from happy buyers at
              AutoVerse.
            </p>
          </div>
          <Link href="/cars?status=sold" className="text-sm font-semibold text-accent">
            View all sold →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {sold.map((car) => {
            const cover =
              car.images?.find((i) => i.is_cover)?.url ?? car.images?.[0]?.url ?? "";
            const quote =
              car.customer_feedback?.trim() ||
              "Great experience buying from AutoVerse — honest inspection and smooth handover.";
            return (
              <article
                key={car.id}
                className="glass-panel group overflow-hidden rounded-2xl"
              >
                <div className="relative">
                  {cover ? (
                    <CarPhoto src={cover} alt={car.name} variant="card" />
                  ) : (
                    <div className="flex aspect-[810/1013] items-center justify-center bg-white/5 text-sm text-white/40">
                      Sold vehicle
                    </div>
                  )}
                  <span className="absolute left-3 top-3 rounded-full bg-red-600/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    Sold
                  </span>
                </div>
                <div className="space-y-3 p-4">
                  <h3 className="font-semibold text-white">{car.name}</h3>
                  <p className="text-xs text-white/50">
                    {car.year} · {car.brand}
                  </p>
                  <div className="flex gap-2 text-sm text-white/75">
                    <Quote className="mt-0.5 shrink-0 text-accent" size={16} />
                    <p className="line-clamp-4">&ldquo;{quote}&rdquo;</p>
                  </div>
                  <Link
                    href={`/cars/${car.slug}`}
                    className="inline-block text-sm font-medium text-accent hover:underline"
                  >
                    View listing
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
