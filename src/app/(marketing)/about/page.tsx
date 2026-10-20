import type { Metadata } from "next";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `About ${SITE.name} — Car Showroom in ${SITE.city}`,
  description: `${SITE.name} is a premium used car showroom and inspection service in ${SITE.city}.`,
};

export default function AboutPage() {
  return (
    <div className="page-shell-narrow">
      <h1 className="section-title">About {SITE.name}</h1>
      <p className="mt-5 text-base leading-relaxed text-white/70 sm:mt-6 sm:text-lg">
        {SITE.name} helps drivers in {SITE.city} buy and sell used cars with
        confidence. Our showroom features carefully selected vehicles, while our
        inspection team delivers transparent reports you can trust — whether
        you&apos;re buying from us or anywhere else.
      </p>
      <p className="mt-4 text-white/70">
        Visit us at {SITE.address}, call {SITE.phone}, or message us on WhatsApp
        anytime.
      </p>
    </div>
  );
}
