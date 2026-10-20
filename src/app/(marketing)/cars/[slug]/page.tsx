import { notFound } from "next/navigation";
import Link from "next/link";
import { getCarBySlug, getRelatedCars } from "@/lib/data/cars";
import { carMetadata, vehicleJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { CarDetailClient } from "@/components/cars/car-detail-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const car = await getCarBySlug(slug);
  if (!car) return {};
  return carMetadata(car);
}

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const car = await getCarBySlug(slug);
  if (!car) notFound();

  const related = await getRelatedCars(car);

  return (
    <div className="page-shell">
      <JsonLd data={vehicleJsonLd(car)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", href: "/" },
          { name: "Cars", href: "/cars" },
          { name: car.name, href: `/cars/${car.slug}` },
        ])}
      />
      <nav
        className="mb-4 line-clamp-2 text-xs text-white/50 sm:mb-6 sm:text-sm"
        aria-label="Breadcrumb"
      >
        <Link href="/" className="hover:text-accent">
          Home
        </Link>
        <span className="mx-1">/</span>
        <Link href="/cars" className="hover:text-accent">
          Cars
        </Link>
        <span className="mx-1">/</span>
        <span className="text-white/80">{car.name}</span>
      </nav>
      <CarDetailClient car={car} related={related} />
    </div>
  );
}
