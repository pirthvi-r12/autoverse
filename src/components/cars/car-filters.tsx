"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { BRANDS } from "@/lib/constants";

export function CarFilters() {
  const router = useRouter();
  const params = useSearchParams();

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`/cars?${next.toString()}`);
  }

  return (
    <div className="glass-panel grid gap-3 rounded-2xl p-4 md:grid-cols-4 lg:grid-cols-6">
      <input
        defaultValue={params.get("search") ?? ""}
        placeholder="Search..."
        className="field md:col-span-2"
        onKeyDown={(e) => {
          if (e.key === "Enter") update("search", (e.target as HTMLInputElement).value);
        }}
      />
      <select
        className="field"
        defaultValue={params.get("brand") ?? ""}
        onChange={(e) => update("brand", e.target.value)}
      >
        <option value="">All brands</option>
        {BRANDS.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </select>
      <select
        className="field"
        defaultValue={params.get("status") ?? "available"}
        onChange={(e) => update("status", e.target.value)}
      >
        <option value="all">All status</option>
        <option value="available">Available</option>
        <option value="sold">Sold</option>
        <option value="reserved">Reserved</option>
      </select>
      <select
        className="field"
        defaultValue={params.get("fuelType") ?? ""}
        onChange={(e) => update("fuelType", e.target.value)}
      >
        <option value="">Fuel type</option>
        <option value="Petrol">Petrol</option>
        <option value="Diesel">Diesel</option>
        <option value="Hybrid">Hybrid</option>
      </select>
      <select
        className="field"
        defaultValue={params.get("sort") ?? "newest"}
        onChange={(e) => update("sort", e.target.value)}
      >
        <option value="newest">Newest</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="year_desc">Year: Newest</option>
      </select>
    </div>
  );
}
