import { NextResponse } from "next/server";
import { parseCarFiltersFromSearchParams } from "@/lib/cars-search-params";
import { getPublicCars } from "@/lib/data/cars";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filters = parseCarFiltersFromSearchParams(searchParams);
  const cars = await getPublicCars(filters);
  return NextResponse.json({ cars, filters });
}
