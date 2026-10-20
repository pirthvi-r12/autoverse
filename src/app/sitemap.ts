import type { MetadataRoute } from "next";
import { getCars } from "@/lib/data/cars";
import { SITE } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cars = await getCars({ status: "all" });
  const staticRoutes = ["", "/cars", "/about", "/contact"].map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const carRoutes = cars.map((car) => ({
    url: `${SITE.url}/cars/${car.slug}`,
    lastModified: new Date(car.updated_at ?? car.created_at),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...carRoutes];
}
