import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getInspectionById,
  getInspectionReportByInspectionId,
} from "@/lib/data/inspections";
import { createCarFromInspectionAction } from "@/lib/admin/actions";
import { SITE } from "@/lib/constants";
import { ReportActions } from "@/components/admin/report-actions";
import { InspectionStatusActions } from "@/components/admin/inspection-status-actions";
import { InspectionChecklistForm } from "@/components/admin/inspection-checklist-form";
import { INSPECTION_PACKAGES } from "@/lib/constants";

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-white/45">{label}</p>
      <p className="mt-0.5 text-sm text-white/85">{value ?? "—"}</p>
    </div>
  );
}

export default async function AdminInspectionDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { id } = await params;
  const { token: queryToken } = await searchParams;
  const inspection = await getInspectionById(id);
  if (!inspection) notFound();

  const report = await getInspectionReportByInspectionId(id);
  const reportToken = queryToken ?? report?.public_token ?? null;

  const pkg = INSPECTION_PACKAGES.find((p) => p.id === inspection.inspection_type);

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/inspections" className="text-sm text-accent">
          ← All inspection bookings
        </Link>
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{inspection.full_name}</h1>
        <p className="text-sm text-white/60 sm:text-base">
          Request ID: <span className="font-mono text-xs">{inspection.id}</span> · Booked{" "}
          {new Date(inspection.created_at).toLocaleString()}
        </p>
      </div>

      <section className="glass space-y-4 rounded-2xl p-6">
        <h2 className="text-lg font-semibold">Status</h2>
        <InspectionStatusActions id={inspection.id} current={inspection.status} />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="glass space-y-4 rounded-2xl p-6">
          <h2 className="text-lg font-semibold">Customer</h2>
          <Field label="Full name" value={inspection.full_name} />
          <Field label="Phone" value={inspection.phone} />
          <Field label="Email" value={inspection.email} />
          <Field label="City" value={inspection.city} />
          <div className="flex flex-wrap gap-3 pt-2 text-sm">
            <a href={`tel:${inspection.phone}`} className="text-accent">
              Call
            </a>
            <a
              href={`https://wa.me/${inspection.phone.replace(/\D/g, "")}`}
              className="text-accent"
            >
              WhatsApp
            </a>
            <a href={`mailto:${inspection.email}`} className="text-accent">
              Email
            </a>
          </div>
        </section>

        <section className="glass space-y-4 rounded-2xl p-6">
          <h2 className="text-lg font-semibold">Vehicle</h2>
          <Field label="Brand / model" value={`${inspection.car_brand} ${inspection.car_model}`} />
          <Field label="Year" value={inspection.car_year} />
          <Field label="Registration" value={inspection.registration_number} />
          <Field label="Mileage" value={inspection.mileage != null ? `${inspection.mileage} km` : null} />
          <Field label="Color" value={inspection.color} />
          <Field label="Fuel" value={inspection.fuel_type} />
          <Field label="Transmission" value={inspection.transmission} />
        </section>

        <section className="glass space-y-4 rounded-2xl p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold">Booking</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field
              label="Package"
              value={pkg ? `${pkg.name} (${pkg.price})` : inspection.inspection_type}
            />
            <Field
              label="Preferred date & time"
              value={`${inspection.preferred_date ?? "—"} ${inspection.preferred_time ?? ""}`.trim()}
            />
            <Field
              label="Location"
              value={
                inspection.location_type === "home_visit"
                  ? `Home visit — ${inspection.address ?? "address not provided"}`
                  : `Showroom (${SITE.city})`
              }
            />
            <Field label="Customer notes" value={inspection.notes} />
            <Field
              label="Linked showroom car"
              value={
                inspection.linked_car_id ? (
                  <Link href={`/admin/cars/${inspection.linked_car_id}/edit`} className="text-accent">
                    Edit car in admin
                  </Link>
                ) : (
                  "—"
                )
              }
            />
          </div>
        </section>
      </div>

      <form action={createCarFromInspectionAction} className="glass rounded-2xl p-4">
        <input type="hidden" name="inspection_id" value={id} />
        <p className="text-sm text-white/60">
          Create a draft inventory listing from this vehicle info (saved in admin inventory).
        </p>
        <button
          type="submit"
          className="mt-3 rounded-full border border-accent px-4 py-2 text-sm text-accent"
        >
          Create car from inspection
        </button>
      </form>

      <InspectionChecklistForm inspectionId={id} report={report} />

      <ReportActions token={reportToken} siteUrl={SITE.url} />
    </div>
  );
}
