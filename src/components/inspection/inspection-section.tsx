"use client";

import { useState } from "react";
import Link from "next/link";
import { inspectionWhatsAppMessage, whatsappUrl } from "@/lib/whatsapp";
import { InspectionFormModal } from "./inspection-form-modal";

export function InspectionSection({
  packages,
}: {
  packages: {
    id: string;
    name: string;
    price: string;
    features: string[];
  }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <section id="inspection" className="section-block">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="section-title text-2xl sm:text-3xl">Car Inspection Service</h2>
        <p className="section-lead">
          Buy with confidence. Choose a package or book instantly on WhatsApp.
        </p>
        <div className="mt-5 grid grid-cols-1 gap-2.5 sm:mt-6 sm:flex sm:flex-wrap sm:justify-center sm:gap-3">
          <a
            href={whatsappUrl(inspectionWhatsAppMessage({}))}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-touch rounded-full bg-[#25D366] text-white sm:w-auto"
          >
            Book on WhatsApp
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="btn-touch rounded-full border border-white/20 text-white hover:border-accent sm:w-auto"
          >
            Fill Inspection Form
          </button>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:gap-6 md:grid-cols-3">
        {packages.map((pkg) => (
          <article
            key={pkg.id}
            className="glass-panel rounded-2xl p-6"
          >
            <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
            <p className="mt-2 text-2xl font-black text-accent">{pkg.price}</p>
            <ul className="mt-4 space-y-2 text-sm text-white/65">
              {pkg.features.map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>
            <Link
              href={whatsappUrl(
                inspectionWhatsAppMessage({ packageName: pkg.name })
              )}
              className="mt-6 inline-block text-sm font-semibold text-accent"
            >
              Book {pkg.name} →
            </Link>
          </article>
        ))}
      </div>
      <InspectionFormModal open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
