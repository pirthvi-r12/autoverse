"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { BRANDS } from "@/lib/constants";
import { cn } from "@/lib/cn";

export function CarFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [moreOpen, setMoreOpen] = useState(false);

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`/cars?${next.toString()}`);
  }

  const hasExtraFilters =
    Boolean(params.get("brand")) ||
    Boolean(params.get("fuelType")) ||
    Boolean(params.get("transmission")) ||
    Boolean(params.get("bodyType"));

  return (
    <div className="glass-panel space-y-3 rounded-2xl p-4">
      <input
        defaultValue={params.get("search") ?? ""}
        placeholder="Search by name, brand, model…"
        className="field"
        onKeyDown={(e) => {
          if (e.key === "Enter")
            update("search", (e.target as HTMLInputElement).value);
        }}
      />

      <div className="grid grid-cols-2 gap-3 md:hidden">
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
          defaultValue={params.get("sort") ?? "newest"}
          onChange={(e) => update("sort", e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
          <option value="year_desc">Year: Newest</option>
        </select>

        <button
          type="button"
          className={cn(
            "col-span-2 flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 text-sm font-medium text-white/80",
            (moreOpen || hasExtraFilters) && "border-accent/40 text-accent"
          )}
          onClick={() => setMoreOpen((v) => !v)}
          aria-expanded={moreOpen}
        >
          {moreOpen ? "Hide filters" : "More filters"}
          <ChevronDown
            size={16}
            className={cn("transition", moreOpen && "rotate-180")}
          />
        </button>

        {(moreOpen || hasExtraFilters) && (
          <>
            <select
              className="field col-span-2"
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
              className="field col-span-2"
              defaultValue={params.get("fuelType") ?? ""}
              onChange={(e) => update("fuelType", e.target.value)}
            >
              <option value="">Any fuel type</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </>
        )}
      </div>

      <div className="hidden gap-3 md:grid md:grid-cols-4 lg:grid-cols-6">
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
          className="field md:col-span-2 lg:col-span-1"
          defaultValue={params.get("sort") ?? "newest"}
          onChange={(e) => update("sort", e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="year_desc">Year: Newest</option>
        </select>
      </div>
    </div>
  );
}
