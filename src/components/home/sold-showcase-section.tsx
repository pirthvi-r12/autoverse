import Link from "next/link";
import { Quote } from "lucide-react";
import { SOLD_DELIVERIES } from "@/lib/sold-deliveries";
import { CarPhoto } from "@/components/cars/car-photo";

export function SoldShowcaseSection() {
  if (!SOLD_DELIVERIES.length) return null;

  return (
    <section className="border-y border-white/10 bg-white/[0.02] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div>
            <h2 className="section-title text-2xl sm:text-3xl">Sold & Delivered</h2>
            <p className="section-lead max-w-xl">
              Real AutoVerse handovers — each photo with car name and model.
            </p>
          </div>
          <Link
            href="/cars?status=sold"
            className="btn-touch w-fit rounded-full border border-white/15 px-4 text-sm font-semibold text-accent sm:border-transparent sm:px-0"
          >
            Inventory sold →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
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
                <h3 className="text-base font-bold leading-snug text-white sm:text-lg">
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
