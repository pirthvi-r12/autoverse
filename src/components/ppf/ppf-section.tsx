import Link from "next/link";
import { Check, Layers, MapPin, Phone, Sparkles } from "lucide-react";
import {
  PPF_BENEFITS,
  PPF_BOOKING,
  PPF_FAQ,
  PPF_FILM,
  PPF_HEADLINE,
  PPF_PACKAGE_INCLUDES,
  PPF_PACKAGES,
  PPF_PROCESS,
  PPF_PRODUCT_FEATURES,
  PPF_SHOWCASES,
  PPF_STEALTH_FILM,
  PPF_STEALTH_PRODUCT_FEATURES,
} from "@/lib/ppf-services";
import { ppfWhatsAppMessage, ppfWhatsAppUrl } from "@/lib/whatsapp";
import { PpfGallery } from "./ppf-gallery";
import { PpfShowcaseCard } from "./ppf-showcase-card";

type Variant = "home" | "page";

export function PpfSection({ variant = "page" }: { variant?: Variant }) {
  const isHome = variant === "home";
  const packages = isHome ? PPF_PACKAGES.slice(0, 3) : PPF_PACKAGES;
  const homePreviewCount = 3;
  /** Keep home PPF block scannable with many showcases live. */
  const homeShowcases = PPF_SHOWCASES.slice(0, 3);

  return (
    <section
      id="ppf"
      className={
        isHome
          ? "border-y border-white/10 bg-white/[0.02] py-12 sm:py-16"
          : "pb-12 pt-6 sm:pb-16"
      }
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
            <Layers size={14} aria-hidden />
            AutoVerse Detailing
          </p>
          <h2 className="section-title mt-4 text-2xl sm:text-3xl md:text-4xl">
            {PPF_HEADLINE.title}
          </h2>
          <p className="section-lead mx-auto max-w-2xl">{PPF_HEADLINE.subtitle}</p>
          <p className="mx-auto mt-3 max-w-xl text-xs text-white/45 sm:text-sm">
            {PPF_FILM.shortName} · {PPF_FILM.substrate} · {PPF_FILM.lifespan} ·{" "}
            {PPF_FILM.warranty}
          </p>
          <div className="mt-6 grid grid-cols-1 gap-2.5 sm:flex sm:flex-wrap sm:justify-center sm:gap-3">
            <a
              href={ppfWhatsAppUrl(ppfWhatsAppMessage({}))}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-touch rounded-full bg-[#25D366] text-white sm:w-auto"
            >
              Get PPF quote on WhatsApp
            </a>
            {!isHome && (
              <a
                href={`tel:${PPF_BOOKING.phoneTel}`}
                className="btn-touch rounded-full border border-white/20 text-white sm:w-auto"
              >
                Call {PPF_BOOKING.phoneDisplay}
              </a>
            )}
            {isHome && (
              <Link
                href="/ppf"
                className="btn-touch rounded-full border border-white/20 text-white sm:w-auto"
              >
                View full PPF page
              </Link>
            )}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">
          {PPF_BENEFITS.map((b) => (
            <div key={b.title} className="glass-panel rounded-2xl p-5">
              <Sparkles className="text-accent" size={22} aria-hidden />
              <h3 className="mt-3 font-semibold text-white">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{b.body}</p>
            </div>
          ))}
        </div>

        {!isHome && (
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <div className="glass-panel rounded-2xl p-6 sm:p-8">
              <h3 className="text-lg font-bold text-white sm:text-xl">
                Miracle PPF
              </h3>
              <p className="mt-1 text-xs text-accent">
                {PPF_FILM.substrate} · {PPF_FILM.lifespan} · {PPF_FILM.warranty}
              </p>
              <p className="mt-2 text-sm text-white/55">{PPF_FILM.warrantyCovers}.</p>
              <ul className="mt-4 grid gap-2">
                {PPF_PRODUCT_FEATURES.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm text-white/70"
                  >
                    <Check
                      className="mt-0.5 shrink-0 text-accent"
                      size={16}
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-panel rounded-2xl p-6 sm:p-8">
              <h3 className="text-lg font-bold text-white sm:text-xl">
                Stealth PPF
              </h3>
              <p className="mt-1 text-xs text-accent">{PPF_STEALTH_FILM.shortName}</p>
              <p className="mt-2 text-sm text-white/55">
                {PPF_STEALTH_FILM.warrantyCovers}.
              </p>
              <ul className="mt-4 grid gap-2">
                {PPF_STEALTH_PRODUCT_FEATURES.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm text-white/70"
                  >
                    <Check
                      className="mt-0.5 shrink-0 text-accent"
                      size={16}
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-panel rounded-2xl p-6 sm:p-8 ring-1 ring-accent/25 lg:col-span-1">
              <h3 className="text-lg font-bold text-white sm:text-xl">
                What our package offers
              </h3>
              <p className="mt-2 text-sm text-white/55">
                Included with qualifying full PPF bookings at AutoVerse.
              </p>
              <ul className="mt-4 space-y-3">
                {PPF_PACKAGE_INCLUDES.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm font-medium text-white/80"
                  >
                    <Check
                      className="mt-0.5 shrink-0 text-accent"
                      size={18}
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 space-y-2 border-t border-white/10 pt-5 text-sm text-white/65">
                <p className="flex items-center gap-2">
                  <Phone size={16} className="text-accent" aria-hidden />
                  <a
                    href={`tel:${PPF_BOOKING.phoneTel}`}
                    className="font-semibold text-white hover:text-accent"
                  >
                    {PPF_BOOKING.phoneDisplay}
                  </a>
                </p>
                <p className="flex items-start gap-2">
                  <MapPin
                    size={16}
                    className="mt-0.5 shrink-0 text-accent"
                    aria-hidden
                  />
                  {PPF_BOOKING.location}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12">
          <h3 className="text-center text-xl font-bold text-white sm:text-2xl">
            PPF packages
          </h3>
          <p className="mt-2 text-center text-sm text-white/55">
            Final pricing depends on vehicle size, film brand, and paint condition.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
            {packages.map((pkg) => (
              <article
                key={pkg.id}
                className={`glass-panel rounded-2xl p-6 ${
                  pkg.highlighted
                    ? "ring-2 ring-accent/40 shadow-[0_0_40px_rgba(96,219,251,0.12)]"
                    : ""
                }`}
              >
                {pkg.highlighted && (
                  <span className="mb-2 inline-block rounded-full bg-accent/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent">
                    Popular
                  </span>
                )}
                <h4 className="text-xl font-bold text-white">{pkg.name}</h4>
                <p className="text-sm text-white/50">{pkg.tagline}</p>
                <p className="mt-3 text-2xl font-black text-accent">{pkg.price}</p>
                <ul className="mt-4 space-y-2 text-sm text-white/65">
                  {pkg.features.map((f) => (
                    <li key={f}>• {f}</li>
                  ))}
                </ul>
                <a
                  href={ppfWhatsAppUrl(
                    ppfWhatsAppMessage({ packageName: pkg.name })
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-touch mt-6 inline-flex w-full rounded-xl border border-accent/40 bg-accent/10 text-center text-sm font-semibold text-accent sm:w-auto sm:px-4"
                >
                  Enquire — {pkg.name}
                </a>
              </article>
            ))}
          </div>
        </div>

        {!isHome && (
          <>
            <div className="mt-14 space-y-8">
              {PPF_SHOWCASES.map((showcase, index) => (
                <PpfShowcaseCard
                  key={showcase.id}
                  showcase={showcase}
                  reverse={index % 2 === 1}
                />
              ))}
            </div>

            <div className="mt-14">
              <h3 className="text-center text-xl font-bold text-white sm:text-2xl">
                Our process
              </h3>
              <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {PPF_PROCESS.map((step) => (
                  <li key={step.step} className="glass-panel rounded-2xl p-5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/15 text-sm font-bold text-accent">
                      {step.step}
                    </span>
                    <h4 className="mt-3 font-semibold text-white">{step.title}</h4>
                    <p className="mt-2 text-sm text-white/60">{step.description}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-14 space-y-12">
              {PPF_SHOWCASES.map((showcase) => (
                <div key={`gallery-${showcase.id}`}>
                  <h3 className="text-center text-xl font-bold text-white sm:text-2xl">
                    {showcase.vehicle} — gallery
                  </h3>
                  <p className="mt-2 text-center text-sm text-white/50">
                    Real install photos from the AutoVerse studio.
                  </p>
                  <div className="mt-6">
                    <PpfGallery items={showcase.gallery} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-14 mx-auto max-w-2xl">
              <h3 className="text-center text-xl font-bold text-white">PPF FAQ</h3>
              <div className="mt-6 space-y-3">
                {PPF_FAQ.map((item) => (
                  <details
                    key={item.q}
                    className="glass-panel rounded-xl p-4 open:border-accent/30"
                  >
                    <summary className="cursor-pointer list-none py-1 text-base font-semibold text-white marker:content-none">
                      {item.q}
                    </summary>
                    <p className="mt-2 text-sm leading-relaxed text-white/65">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </>
        )}

        {isHome && (
          <>
            <div className="mt-10 space-y-8">
              {homeShowcases.map((showcase) => (
                <div key={`home-${showcase.id}`}>
                  <p className="text-center text-sm font-semibold text-white/80">
                    Latest work — {showcase.vehicle}
                  </p>
                  <div className="mt-4">
                    <PpfGallery
                      items={showcase.gallery.slice(0, homePreviewCount)}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/ppf"
                className="text-sm font-semibold text-accent hover:underline"
              >
                See full gallery, process & FAQ →
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
