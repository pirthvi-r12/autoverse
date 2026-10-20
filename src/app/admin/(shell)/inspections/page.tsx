import Link from "next/link";
import { getInspections } from "@/lib/data/inspections";
import { InspectionsAdminTable } from "@/components/admin/inspections-admin-table";

export default async function AdminInspectionsPage() {
  const inspections = await getInspections();

  const csv = [
    "booked_at,customer,phone,email,city,car_brand,car_model,package,status,preferred_date,location",
    ...inspections.map((i) =>
      [
        i.created_at,
        `"${i.full_name.replace(/"/g, '""')}"`,
        i.phone,
        i.email,
        i.city,
        i.car_brand,
        i.car_model,
        i.inspection_type,
        i.status,
        i.preferred_date ?? "",
        i.location_type,
      ].join(",")
    ),
  ].join("\n");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Inspection bookings</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/60">
            Every customer who submits the inspection form on the website appears here. Open{" "}
            <strong className="text-white/80">Details</strong> to see full info, update status, and
            publish the PDF report.
          </p>
        </div>
        <a
          href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`}
          download="autoverse-inspections.csv"
          className="rounded-full border border-white/20 px-4 py-2 text-sm hover:border-accent"
        >
          Export CSV
        </a>
      </div>

      <InspectionsAdminTable inspections={inspections} />

      <p className="text-xs text-white/40">
        Also listed under{" "}
        <Link href="/admin/leads" className="text-accent">
          Leads
        </Link>{" "}
        with contact & newsletter entries.
      </p>
    </div>
  );
}
