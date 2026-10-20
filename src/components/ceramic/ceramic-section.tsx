import Image from "next/image";
import Link from "next/link";
import { Check, Droplets, MapPin, Phone, Sparkles } from "lucide-react";
import {
  CERAMIC_BOOKING,
  CERAMIC_FEATURED,
  CERAMIC_GALLERY,
  CERAMIC_HEADLINE,
  CERAMIC_PACKAGE_INCLUDES,
  CERAMIC_PROTECTION_FROM,
} from "@/lib/ceramic-coating";
import {
  ceramicCoatingWhatsAppMessage,
  ceramicCoatingWhatsAppUrl,
} from "@/lib/whatsapp";
import { PpfGallery } from "@/components/ppf/ppf-gallery";

type Variant = "home" | "page";

export function CeramicSection({ variant = "page" }: { variant?: Variant }) {
  const isHome = variant === "home";
  const gallery = isHome ? CERAMIC_GALLERY.slice(0, 3) : CERAMIC_GALLERY;

  return (
    <section
      id="ceramic-coating"
      className={
        isHome
          ? "border-y border-white/10 bg-white/[0.02] py-12 sm:py-16"
          : "pb-12 pt-6 sm:pb-16"
      }
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
            <Droplets size={14} aria-hidden />
            AutoVerse Detailing
          </p>
          <h2 className="section-title mt-4 text-2xl sm:text-3xl md:text-4xl">
            {CERAMIC_HEADLINE.title}
          </h2>
          <p className="section-lead mx-auto max-w-2xl">{CERAMIC_HEADLINE.subtitle}</p>
          <div className="mt-6 grid grid-cols-1 gap-2.5 sm:flex sm:flex-wrap sm:justify-center sm:gap-3">
            <a
              href={ceramicCoatingWhatsAppUrl(ceramicCoatingWhatsAppMessage({}))}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-touch rounded-full bg-[#25D366] text-white sm:w-auto"
            >
              Book ceramic coating on WhatsApp
            </a>
            {!isHome && (
              <a
                href={`tel:${CERAMIC_BOOKING.phoneTel}`}
                className="btn-touch rounded-full border border-white/20 text-white sm:w-auto"
              >
                Call {CERAMIC_BOOKING.phoneDisplay}
              </a>
            )}
            {isHome && (
              <Link
                href="/ceramic-coating"
                className="btn-touch rounded-full border border-white/20 text-white sm:w-auto"
              >
                View ceramic coating page
              </Link>
            )}
          </div>
        </div>

        {!isHome && (
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <div className="glass-panel rounded-2xl p-6 sm:p-8">
              <h3 className="text-lg font-bold text-white sm:text-xl">
                AutoVerse ceramic coating package
              </h3>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {CERAMIC_PACKAGE_INCLUDES.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-white/70">
                    <Check className="mt-0.5 shrink-0 text-accent" size={16} aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-panel rounded-2xl p-6 sm:p-8 ring-1 ring-accent/25">
              <h3 className="text-lg font-bold text-white sm:text-xl">
                Ceramic coating protects from
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {CERAMIC_PROTECTION_FROM.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-sm text-white/75"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 space-y-2 border-t border-white/10 pt-5 text-sm text-white/65">
                <p className="flex items-center gap-2">
                  <Phone size={16} className="text-accent" aria-hidden />
                  <a
                    href={`tel:${CERAMIC_BOOKING.phoneTel}`}
                    className="font-semibold text-white hover:text-accent"
                  >
                    {CERAMIC_BOOKING.phoneDisplay}
                  </a>
                </p>
                <p className="flex items-start gap-2">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden />
                  {CERAMIC_BOOKING.location}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative aspect-[4/3] min-h-[240px] lg:aspect-auto lg:min-h-[320px]">
              <Image
                src={CERAMIC_FEATURED.heroImage}
                alt={`${CERAMIC_FEATURED.vehicle} ceramic coating at AutoVerse`}
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={!isHome}
                unoptimized
              />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                Featured detail
              </p>
              <h3 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                {CERAMIC_FEATURED.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/65 sm:text-base">
                {CERAMIC_FEATURED.summary}
              </p>
              <a
                href={ceramicCoatingWhatsAppUrl(
                  ceramicCoatingWhatsAppMessage({
                    carModel: CERAMIC_FEATURED.vehicle,
                  })
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-touch mt-6 w-fit rounded-full bg-accent/15 text-accent ring-1 ring-accent/40"
              >
                Book — {CERAMIC_FEATURED.vehicle}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="text-center text-xl font-bold text-white sm:text-2xl">
            {CERAMIC_FEATURED.vehicle} — gallery
          </h3>
          <p className="mt-2 text-center text-sm text-white/50">
            Real results from the AutoVerse studio.
          </p>
          <div className="mt-6">
            <PpfGallery items={gallery} />
          </div>
        </div>

        {isHome && (
          <div className="mt-8 text-center">
            <Link
              href="/ceramic-coating"
              className="text-sm font-semibold text-accent hover:underline"
            >
              See full package & gallery →
            </Link>
          </div>
        )}

        {isHome && (
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {CERAMIC_PACKAGE_INCLUDES.slice(0, 3).map((item) => (
              <div key={item} className="glass-panel rounded-xl p-4 text-sm text-white/65">
                <Sparkles className="text-accent" size={18} aria-hidden />
                <p className="mt-2">{item}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
