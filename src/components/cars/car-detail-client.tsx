"use client";

import { useState } from "react";
import { CarPhoto } from "@/components/cars/car-photo";
import { getCarCoverUrl } from "@/lib/car-image";
import { Share2, Phone } from "lucide-react";
import type { Car } from "@/types";
import { formatPrice, formatKm } from "@/lib/format";
import { StatusBadge } from "@/components/ui/badge";
import { carInquiryMessage, whatsappUrl } from "@/lib/whatsapp";
import { SITE } from "@/lib/constants";
import { InspectionFormModal } from "@/components/inspection/inspection-form-modal";
import { CarCard } from "./car-card";

export function CarDetailClient({
  car,
  related,
}: {
  car: Car;
  related: Car[];
}) {
  const images = car.images ?? [];
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [inspectOpen, setInspectOpen] = useState(false);
  const cover = images[active]?.url ?? getCarCoverUrl(images);

  async function share() {
    const url = `${SITE.url}/cars/${car.slug}`;
    if (navigator.share) {
      await navigator.share({ title: car.name, url });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied");
    }
  }

  const specs: [string, string | number][] = [
    ["Year", car.year],
    ["Mileage", formatKm(car.mileage)],
    ["Fuel", car.fuel_type],
    ["Transmission", car.transmission],
    ["Engine", car.engine_capacity ?? "—"],
    ["Color", car.color ?? "—"],
    ["Body", car.body_type],
    ["City", car.registration_city ?? "—"],
    ["Owners", car.owners ?? "—"],
    ["Condition", car.condition ?? "—"],
  ];

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <div className="min-w-0">
          <button
            type="button"
            className="block w-full overflow-hidden rounded-2xl border border-white/10"
            onClick={() => setLightbox(true)}
          >
            {cover && (
              <CarPhoto src={cover} alt={car.name} variant="detail" priority />
            )}
          </button>
          {images.length > 1 && (
            <div className="scroll-touch mt-3 flex snap-x snap-mandatory gap-2.5 overflow-x-auto pb-2 pt-0.5">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`relative h-[88px] w-[70px] shrink-0 snap-center overflow-hidden rounded-lg border bg-[#0a0e14] sm:h-[101px] sm:w-[81px] ${
                    i === active
                      ? "border-accent ring-2 ring-accent/35"
                      : "border-white/15 opacity-90"
                  }`}
                  aria-label={`Photo ${i + 1}`}
                  aria-current={i === active ? "true" : undefined}
                >
                  <CarPhoto src={img.url} alt="" variant="thumb" />
                </button>
              ))}
            </div>
          )}
          {car.video_url && (
            <video
              controls
              className="mt-4 w-full rounded-xl"
              src={car.video_url}
            />
          )}
        </div>

        <div className="min-w-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold leading-tight text-white sm:text-3xl">
                {car.name}
              </h1>
              <p className="mt-1.5 text-sm font-medium text-white/55">
                {car.brand} {car.model} · {car.year}
              </p>
            </div>
            <div className="shrink-0 self-start">
              <StatusBadge status={car.status} />
            </div>
          </div>

          <p className="mt-3 text-2xl font-black text-accent sm:text-3xl">
            {car.status === "sold" && car.price <= 0
              ? "Sold out"
              : formatPrice(car.price)}
          </p>

          <dl className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-6 sm:gap-3">
            {specs.map(([k, v]) => (
              <div key={k} className="car-detail-spec">
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>

          {car.features?.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {car.features.map((f) => (
                <li
                  key={f}
                  className="rounded-full bg-accent/10 px-3 py-1 text-xs text-accent"
                >
                  {f}
                </li>
              ))}
            </ul>
          )}

          {car.description?.trim() && (
            <p className="mt-5 text-sm leading-relaxed text-white/70 sm:mt-6 sm:text-base">
              {car.description}
            </p>
          )}

          {car.status === "sold" && car.customer_feedback?.trim() && (
            <blockquote className="mt-5 rounded-2xl border border-accent/20 bg-accent/5 p-4 text-sm text-white/85">
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                Buyer feedback
              </p>
              <p className="mt-2">&ldquo;{car.customer_feedback.trim()}&rdquo;</p>
            </blockquote>
          )}

          <div className="mt-6 grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:gap-3">
            {car.status !== "sold" && (
              <>
                <a
                  href={whatsappUrl(carInquiryMessage(car))}
                  className="car-detail-cta col-span-2 bg-[#25D366] text-white sm:col-span-1"
                >
                  WhatsApp Us
                </a>
                <a
                  href={`tel:${SITE.phone}`}
                  className="car-detail-cta border border-white/20 text-white"
                >
                  <Phone size={16} aria-hidden />
                  Call Now
                </a>
                <button
                  type="button"
                  onClick={() => setInspectOpen(true)}
                  className="car-detail-cta col-span-2 bg-accent text-black sm:col-span-1"
                >
                  <span className="sm:hidden">Book inspection</span>
                  <span className="hidden sm:inline">
                    Book Inspection for this Car
                  </span>
                </button>
              </>
            )}
            {car.status === "sold" && (
              <a
                href={whatsappUrl(
                  `Hi ${SITE.name}, I'm interested in a car like the ${car.name}.`
                )}
                className="car-detail-cta col-span-2 bg-[#25D366] text-white sm:col-span-1"
              >
                Ask about similar cars
              </a>
            )}
            <button
              type="button"
              onClick={share}
              className="car-detail-cta border border-white/20 text-white"
            >
              <Share2 size={16} aria-hidden />
              Share
            </button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-12 border-t border-white/10 pt-10 sm:mt-16">
          <h2 className="text-xl font-bold text-white sm:text-2xl">Related Cars</h2>
          <p className="mt-1 text-sm text-white/50">More from {car.brand}</p>
          <div className="mt-5 grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {related.map((c) => (
              <CarCard key={c.id} car={c} />
            ))}
          </div>
        </section>
      )}

      {lightbox && cover && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(false)}
          role="dialog"
          aria-modal="true"
        >
          <CarPhoto src={cover} alt={car.name} variant="lightbox" />
        </div>
      )}

      <InspectionFormModal
        open={inspectOpen}
        onClose={() => setInspectOpen(false)}
        defaultCar={{
          brand: car.brand,
          model: car.model,
          year: car.year,
          name: car.name,
        }}
      />
    </>
  );
}
