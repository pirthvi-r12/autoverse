"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Inspection, InspectionStatus } from "@/types";

const STATUS_LABELS: Record<InspectionStatus, string> = {
  pending: "Pending",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
  rescheduled: "Rescheduled",
};

const PACKAGE_LABELS = {
  basic: "Basic",
  standard: "Standard",
  full_premium: "Full Premium",
};

export function InspectionsAdminTable({
  inspections,
}: {
  inspections: Inspection[];
}) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<InspectionStatus | "all">("all");

  const stats = useMemo(() => {
    const counts: Record<string, number> = { all: inspections.length };
    for (const s of Object.keys(STATUS_LABELS) as InspectionStatus[]) {
      counts[s] = inspections.filter((i) => i.status === s).length;
    }
    return counts;
  }, [inspections]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return inspections.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (!q) return true;
      const haystack = [
        item.full_name,
        item.phone,
        item.email,
        item.city,
        item.car_brand,
        item.car_model,
        item.inspection_type,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [inspections, query, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {(
          [
            ["all", "All bookings"],
            ["pending", "Pending"],
            ["in_progress", "In progress"],
            ["completed", "Completed"],
            ["cancelled", "Cancelled"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setStatusFilter(key)}
            className={`rounded-2xl border px-4 py-3 text-left transition ${
              statusFilter === key
                ? "border-accent bg-accent/10"
                : "border-white/10 bg-brand-deep/30 hover:border-white/20"
            }`}
          >
            <p className="text-xs text-white/50">{label}</p>
            <p className="text-2xl font-bold text-accent">{stats[key] ?? 0}</p>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, phone, email, car…"
          className="field max-w-md"
        />
        <p className="text-sm text-white/50">
          Showing {filtered.length} of {inspections.length} inspection requests
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5 text-white/60">
            <tr>
              <th className="px-4 py-3">Booked</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Vehicle</th>
              <th className="px-4 py-3">Package</th>
              <th className="px-4 py-3">When / where</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-t border-white/10 align-top">
                <td className="whitespace-nowrap px-4 py-3 text-white/70">
                  {new Date(item.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-white">{item.full_name}</p>
                  <p className="text-xs text-white/50">{item.city}</p>
                </td>
                <td className="px-4 py-3 text-white/75">
                  <a href={`tel:${item.phone}`} className="block text-accent hover:underline">
                    {item.phone}
                  </a>
                  <a
                    href={`mailto:${item.email}`}
                    className="block text-xs text-white/60 hover:text-accent"
                  >
                    {item.email}
                  </a>
                </td>
                <td className="px-4 py-3">
                  {item.car_brand} {item.car_model}
                  {item.car_year ? ` (${item.car_year})` : ""}
                </td>
                <td className="px-4 py-3 capitalize">
                  {PACKAGE_LABELS[item.inspection_type] ?? item.inspection_type}
                </td>
                <td className="px-4 py-3 text-white/70">
                  <p>
                    {item.preferred_date ?? "—"}
                    {item.preferred_time ? ` · ${item.preferred_time}` : ""}
                  </p>
                  <p className="text-xs capitalize text-white/50">
                    {item.location_type.replace("_", " ")}
                    {item.address ? ` — ${item.address}` : ""}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full border border-white/15 px-2 py-0.5 text-xs capitalize">
                    {STATUS_LABELS[item.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    <Link href={`/admin/inspections/${item.id}`} className="text-accent">
                      Open details →
                    </Link>
                    <a
                      href={`https://wa.me/${item.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                        `Hi ${item.full_name}, this is ${"AutoVerse"} about your inspection request.`
                      )}`}
                      className="text-xs text-white/60 hover:text-accent"
                    >
                      WhatsApp
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!filtered.length && (
          <p className="p-8 text-center text-white/50">
            No inspection bookings match your filters yet. New requests from the website appear here
            automatically.
          </p>
        )}
      </div>
    </div>
  );
}
