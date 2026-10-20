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
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 lg:px-6">
      <JsonLd data={vehicleJsonLd(car)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", href: "/" },
          { name: "Cars", href: "/cars" },
          { name: car.name, href: `/cars/${car.slug}` },
        ])}
      />
      <nav className="mb-6 text-sm text-white/50">
        <Link href="/" className="hover:text-accent">
          Home
        </Link>{" "}
        /{" "}
        <Link href="/cars" className="hover:text-accent">
          Cars
        </Link>{" "}
        / <span className="text-white/80">{car.name}</span>
      </nav>
      <CarDetailClient car={car} related={related} />
    </div>
  );
}
