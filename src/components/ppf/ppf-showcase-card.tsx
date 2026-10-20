import Image from "next/image";
import type { PpfShowcase } from "@/lib/ppf-services";
import { ppfWhatsAppMessage, ppfWhatsAppUrl } from "@/lib/whatsapp";

export function PpfShowcaseCard({
  showcase,
  reverse,
}: {
  showcase: PpfShowcase;
  reverse?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
      <div
        className={`grid grid-cols-1 lg:grid-cols-2 ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}
      >
        <div className="relative aspect-[4/3] min-h-[240px] lg:aspect-auto lg:min-h-[320px]">
          <Image
            src={showcase.heroImage}
            alt={`${showcase.vehicle} PPF installation at AutoVerse`}
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 50vw"
            unoptimized
          />
        </div>
        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            Featured install
          </p>
          <h3 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            {showcase.title}
          </h3>
          {showcase.filmBrand && (
            <p className="mt-2 text-sm font-medium text-white/75">
              {showcase.filmBrand}
              {showcase.warrantyNote ? ` · ${showcase.warrantyNote}` : ""}
            </p>
          )}
          <p className="mt-3 text-sm leading-relaxed text-white/65 sm:text-base">
            {showcase.summary}
          </p>
          <a
            href={ppfWhatsAppUrl(
              ppfWhatsAppMessage({ carModel: showcase.vehicle })
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-touch mt-6 w-fit rounded-full bg-accent/15 text-accent ring-1 ring-accent/40"
          >
            Book PPF — {showcase.vehicle}
          </a>
        </div>
      </div>
    </div>
  );
}
