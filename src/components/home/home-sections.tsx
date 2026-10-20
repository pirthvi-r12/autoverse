import Link from "next/link";
import { Shield, Gauge, Wrench, Star } from "lucide-react";
import { getFeaturedCars, getCarStats } from "@/lib/data/cars";
import { CarCard } from "@/components/cars/car-card";
import { BRANDS, INSPECTION_PACKAGES, SITE } from "@/lib/constants";
import { AnimatedCounter } from "./animated-counter";
import { InspectionSection } from "@/components/inspection/inspection-section";
import { SoldShowcaseSection } from "./sold-showcase-section";
import { TestimonialsSlider } from "./testimonials-slider";
import { FaqSection } from "./faq-section";
import { ContactSection } from "./contact-section";

export async function HomeSections() {
  const [featured, stats] = await Promise.all([
    getFeaturedCars(6),
    getCarStats(),
  ]);

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white">Featured Cars</h2>
            <p className="mt-2 text-white/60">Hand-picked inventory ready to drive.</p>
          </div>
          <Link href="/cars" className="text-sm font-semibold text-accent">
            View all →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <h2 className="text-center text-3xl font-bold text-white">
            Why Choose {SITE.name}
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-4">
            {[
              { icon: Shield, title: "Inspected Cars", desc: "150-point checks" },
              { icon: Gauge, title: "Transparent Pricing", desc: "No hidden fees" },
              { icon: Wrench, title: "Expert Mechanics", desc: "Certified team" },
              { icon: Star, title: "5-Star Service", desc: "Trusted locally" },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="glass-panel rounded-2xl p-6"
              >
                <Icon className="text-accent" size={28} />
                <h3 className="mt-4 font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm text-white/55">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { label: "Cars in stock", value: stats.total },
              { label: "Available now", value: stats.available },
              { label: "Sold", value: stats.sold },
              { label: "Happy clients", value: 1200, suffix: "+" },
            ].map((item) => (
              <div
                key={item.label}
                className="glass-stat rounded-2xl p-5 text-center"
              >
                <p className="text-3xl font-black text-accent">
                  <AnimatedCounter value={item.value} suffix={item.suffix} />
                </p>
                <p className="mt-1 text-sm text-white/60">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <InspectionSection packages={INSPECTION_PACKAGES} />

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
        <h2 className="text-center text-3xl font-bold text-white">Brands We Deal In</h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {BRANDS.map((brand) => (
            <Link
              key={brand}
              href={`/cars?brand=${encodeURIComponent(brand)}`}
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:border-accent hover:text-accent"
            >
              {brand}
            </Link>
          ))}
        </div>
      </section>

      <SoldShowcaseSection />
      <TestimonialsSlider />
      <FaqSection />
      <ContactSection />
    </>
  );
}
