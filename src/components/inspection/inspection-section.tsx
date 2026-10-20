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
    <section id="inspection" className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-white">Car Inspection Service</h2>
        <p className="mt-3 text-white/60">
          Buy with confidence. Choose a package or book instantly on WhatsApp.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a
            href={whatsappUrl(inspectionWhatsAppMessage({}))}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Book on WhatsApp
          </a>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white hover:border-accent"
          >
            Fill Inspection Form
          </button>
        </div>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
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
