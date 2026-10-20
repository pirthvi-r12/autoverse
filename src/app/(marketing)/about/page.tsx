import type { Metadata } from "next";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `About ${SITE.name} — Car Showroom in ${SITE.city}`,
  description: `${SITE.name} is a premium used car showroom and inspection service in ${SITE.city}.`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-20 pt-28 lg:px-6">
      <h1 className="text-4xl font-bold text-white">About {SITE.name}</h1>
      <p className="mt-6 text-lg leading-relaxed text-white/70">
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
