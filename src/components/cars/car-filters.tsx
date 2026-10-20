"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BRANDS } from "@/lib/constants";
import { cn } from "@/lib/cn";
import {
  carFiltersToSearchParams,
  parseCarFiltersFromSearchParams,
} from "@/lib/cars-search-params";

export function CarFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const parsed = parseCarFiltersFromSearchParams(params);

  const [searchDraft, setSearchDraft] = useState(parsed.search ?? "");
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    setSearchDraft(parsed.search ?? "");
  }, [parsed.search]);

  const hasExtraFilters = Boolean(
    parsed.brand ||
      parsed.fuelType ||
      parsed.transmission ||
      parsed.bodyType
  );

  useEffect(() => {
    if (hasExtraFilters) setMoreOpen(true);
  }, [hasExtraFilters]);

  function apply(partial: Parameters<typeof carFiltersToSearchParams>[0]) {
    const merged = { ...parsed, ...partial };
    const qs = carFiltersToSearchParams(merged);
    const href = qs ? `/cars?${qs}` : "/cars";
    router.push(href, { scroll: false });
    router.refresh();
  }

  function patch(key: keyof typeof parsed, value: string) {
    apply({ [key]: value || undefined } as Partial<typeof parsed>);
  }

  function clearAll() {
    setSearchDraft("");
    router.push("/cars", { scroll: false });
    router.refresh();
  }

  const activeChips: { label: string; clear: () => void }[] = [];
  if (parsed.brand)
    activeChips.push({ label: `Brand: ${parsed.brand}`, clear: () => patch("brand", "") });
  if (parsed.fuelType)
    activeChips.push({
      label: `Fuel: ${parsed.fuelType}`,
      clear: () => patch("fuelType", ""),
    });
  if (parsed.status && parsed.status !== "available")
    activeChips.push({
      label: `Status: ${parsed.status}`,
      clear: () => patch("status", "available"),
    });
  if (parsed.search)
    activeChips.push({
      label: `Search: ${parsed.search}`,
      clear: () => {
        setSearchDraft("");
        apply({ search: undefined });
      },
    });
  if (parsed.sort && parsed.sort !== "newest")
    activeChips.push({
      label: `Sort: ${parsed.sort.replace(/_/g, " ")}`,
      clear: () => patch("sort", "newest"),
    });

  const statusValue = parsed.status ?? "available";

  return (
    <div className="glass-panel space-y-3 rounded-2xl p-4">
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          apply({ search: searchDraft.trim() || undefined });
        }}
      >
        <input
          value={searchDraft}
          onChange={(e) => setSearchDraft(e.target.value)}
          placeholder="Search by name, brand, model…"
          className="field min-w-0 flex-1"
          aria-label="Search cars"
        />
        <button
          type="submit"
          className="btn-touch shrink-0 rounded-xl bg-accent px-4 text-black"
          aria-label="Search"
        >
          <Search size={18} />
        </button>
      </form>

      <div className="grid grid-cols-2 gap-3 md:hidden">
        <select
          className="field"
          value={statusValue}
          onChange={(e) => patch("status", e.target.value)}
          aria-label="Availability"
        >
          <option value="all">All status</option>
          <option value="available">Available</option>
          <option value="sold">Sold</option>
          <option value="reserved">Reserved</option>
        </select>
        <select
          className="field"
          value={parsed.sort ?? "newest"}
          onChange={(e) => patch("sort", e.target.value)}
          aria-label="Sort"
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
          {moreOpen ? "Hide filters" : "Brand & fuel"}
          <ChevronDown
            size={16}
            className={cn("transition", moreOpen && "rotate-180")}
          />
        </button>

        {(moreOpen || hasExtraFilters) && (
          <>
            <select
              className="field col-span-2"
              value={parsed.brand ?? ""}
              onChange={(e) => patch("brand", e.target.value)}
              aria-label="Brand"
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
              value={parsed.fuelType ?? ""}
              onChange={(e) => patch("fuelType", e.target.value)}
              aria-label="Fuel type"
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
          className="field md:col-span-2 lg:col-span-1"
          value={parsed.brand ?? ""}
          onChange={(e) => patch("brand", e.target.value)}
          aria-label="Brand"
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
          value={statusValue}
          onChange={(e) => patch("status", e.target.value)}
          aria-label="Availability"
        >
          <option value="all">All status</option>
          <option value="available">Available</option>
          <option value="sold">Sold</option>
          <option value="reserved">Reserved</option>
        </select>
        <select
          className="field"
          value={parsed.fuelType ?? ""}
          onChange={(e) => patch("fuelType", e.target.value)}
          aria-label="Fuel type"
        >
          <option value="">Any fuel type</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="Hybrid">Hybrid</option>
        </select>
        <select
          className="field md:col-span-2 lg:col-span-1"
          value={parsed.sort ?? "newest"}
          onChange={(e) => patch("sort", e.target.value)}
          aria-label="Sort"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="year_desc">Year: Newest</option>
        </select>
      </div>

      {activeChips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeChips.map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={chip.clear}
              className="inline-flex items-center gap-1.5 rounded-full border border-accent/35 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent"
            >
              {chip.label}
              <X size={14} aria-hidden />
            </button>
          ))}
        </div>
      )}

      {(parsed.brand ||
        parsed.search ||
        parsed.fuelType ||
        parsed.status !== "available" ||
        (parsed.sort && parsed.sort !== "newest")) && (
        <button
          type="button"
          onClick={clearAll}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 py-2.5 text-sm font-medium text-white/70 hover:border-accent/40 hover:text-accent md:w-auto md:px-4"
        >
          <X size={16} />
          Clear all filters
        </button>
      )}
    </div>
  );
}
