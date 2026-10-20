"use client";

import { useState } from "react";
import { CarPhoto } from "@/components/cars/car-photo";
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
  const cover = images[active]?.url ?? images[0]?.url;

  async function share() {
    const url = `${SITE.url}/cars/${car.slug}`;
    if (navigator.share) {
      await navigator.share({ title: car.name, url });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied");
    }
  }

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <button
            type="button"
            className="w-full overflow-hidden rounded-2xl border border-white/10"
            onClick={() => setLightbox(true)}
          >
            {cover && (
              <CarPhoto src={cover} alt={car.name} variant="hero" priority />
            )}
          </button>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setActive(i)}
                className={`relative h-[101px] w-[81px] shrink-0 overflow-hidden rounded-lg border bg-[#0a0e14] ${i === active ? "border-accent ring-1 ring-accent/40" : "border-white/10"}`}
                aria-label={`Photo ${i + 1}`}
              >
                <CarPhoto src={img.url} alt="" variant="thumb" />
              </button>
            ))}
          </div>
          {car.video_url && (
            <video controls className="mt-4 w-full rounded-xl" src={car.video_url} />
          )}
        </div>
        <div>
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-3xl font-bold text-white">{car.name}</h1>
            <StatusBadge status={car.status} />
          </div>
          <p className="mt-2 text-3xl font-black text-accent">{formatPrice(car.price)}</p>
          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            {[
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
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-white/5 px-3 py-2">
                <dt className="text-white/45">{k}</dt>
                <dd className="font-medium text-white">{v}</dd>
              </div>
            ))}
          </dl>
          {car.features?.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {car.features.map((f) => (
                <li key={f} className="rounded-full bg-accent/10 px-3 py-1 text-xs text-accent">
                  {f}
                </li>
              ))}
            </ul>
          )}
          <p className="mt-6 text-white/70">{car.description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={whatsappUrl(carInquiryMessage(car))}
              className="rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-white"
            >
              WhatsApp Us
            </a>
            <a href={`tel:${SITE.phone}`} className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm text-white">
              <Phone size={16} /> Call Now
            </a>
            <button
              type="button"
              onClick={() => setInspectOpen(true)}
              className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-black"
            >
              Book Inspection for this Car
            </button>
            <button type="button" onClick={share} className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm text-white">
              <Share2 size={16} /> Share
            </button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-white">Related Cars</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
