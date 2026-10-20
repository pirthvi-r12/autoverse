import { NextResponse } from "next/server";
import { getPublicCatalog } from "@/lib/data/cars";

export const dynamic = "force-dynamic";

export async function GET() {
  const catalog = await getPublicCatalog();
  return NextResponse.json(catalog);
}
