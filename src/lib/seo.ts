import type { Metadata } from "next";
import { BRAND, SITE } from "./constants";
import type { Car } from "@/types";

const defaultDescription = `Buy quality used cars in ${SITE.city}. ${SITE.name} offers inspected vehicles, transparent pricing, and premium car inspection services.`;

export function defaultMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: `${SITE.name} | Buy Used Cars in ${SITE.city}`,
      template: `%s | ${SITE.name}`,
    },
    description: defaultDescription,
    keywords: [
      `used cars ${SITE.city}`,
      `car showroom ${SITE.city}`,
      "car inspection service",
      SITE.name,
    ],
    openGraph: {
      type: "website",
      locale: "en_PK",
      url: SITE.url,
      siteName: SITE.name,
      title: `${SITE.name} | Car Showroom in ${SITE.city}`,
      description: defaultDescription,
      images: [{ url: BRAND.logoSrc, alt: SITE.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: SITE.name,
      description: defaultDescription,
    },
    alternates: { canonical: SITE.url },
    robots: { index: true, follow: true },
  };
}

export function carMetadata(car: Car): Metadata {
  const title = `${car.name} ${car.year} for Sale in ${SITE.city}`;
  const description = `${car.brand} ${car.model} ${car.year} — ${car.mileage.toLocaleString()} km, ${car.fuel_type}, ${car.transmission}. PKR ${car.price.toLocaleString()}. View at ${SITE.name}.`;
  const cover = car.images?.find((i) => i.is_cover)?.url ?? car.images?.[0]?.url;
  const url = `${SITE.url}/cars/${car.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: cover ? [{ url: cover, alt: car.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: cover ? [cover] : undefined,
    },
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: SITE.name,
    url: SITE.url,
    telephone: SITE.phone,
    email: SITE.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address,
      addressLocality: SITE.city,
      addressCountry: "PK",
    },
    priceRange: "$$",
    image: `${SITE.url}/og-default.jpg`,
  };
}

export function vehicleJsonLd(car: Car) {
  const cover = car.images?.find((i) => i.is_cover)?.url ?? car.images?.[0]?.url;
  return {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: car.name,
    brand: { "@type": "Brand", name: car.brand },
    model: car.model,
    vehicleModelDate: String(car.year),
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: car.mileage,
      unitCode: "KMT",
    },
    fuelType: car.fuel_type,
    vehicleTransmission: car.transmission,
    color: car.color,
    image: cover,
    offers: {
      "@type": "Offer",
      price: car.price,
      priceCurrency: "PKR",
      availability:
        car.status === "available"
          ? "https://schema.org/InStock"
          : "https://schema.org/SoldOut",
      url: `${SITE.url}/cars/${car.slug}`,
    },
  };
}

export function faqJsonLd(
  items: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function breadcrumbJsonLd(
  items: { name: string; href: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE.url}${item.href}`,
    })),
  };
}
