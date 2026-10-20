import Link from "next/link";
import { Quote } from "lucide-react";
import { SOLD_DELIVERIES } from "@/lib/sold-deliveries";
import { CarPhoto } from "@/components/cars/car-photo";

export function SoldShowcaseSection() {
  if (!SOLD_DELIVERIES.length) return null;

  return (
    <section className="border-y border-white/10 bg-white/[0.02] py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white">Sold & Delivered</h2>
            <p className="mt-2 max-w-xl text-white/60">
              Real AutoVerse handovers — each photo with car name and model.
            </p>
          </div>
          <Link href="/cars?status=sold" className="text-sm font-semibold text-accent">
            Inventory sold →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {SOLD_DELIVERIES.map((item) => (
            <article
              key={item.id}
              className="glass-panel overflow-hidden rounded-2xl"
            >
              <div className="relative">
                <CarPhoto src={item.image} alt={item.name} variant="card" />
                <span className="absolute left-3 top-3 rounded-full bg-red-600/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                  Sold
                </span>
              </div>
              <div className="space-y-2 border-t border-white/10 bg-black/20 p-4">
                <h3 className="text-lg font-bold leading-snug text-white">
                  {item.name}
                </h3>
                <p className="text-sm font-semibold text-accent">
                  Model: {item.model} · {item.year}
                </p>
                <div className="flex gap-2 pt-1 text-sm text-white/75">
                  <Quote className="mt-0.5 shrink-0 text-accent/80" size={16} />
                  <p className="line-clamp-3">&ldquo;{item.feedback}&rdquo;</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
