import Link from "next/link";
import { getInspections, getLeads } from "@/lib/data/inspections";

export default async function AdminLeadsPage() {
  const [leads, inspections] = await Promise.all([getLeads(), getInspections()]);

  // Inspection bookings live in `inspections`; lead rows with type "inspection" are duplicates.
  const contactLeads = leads.filter((l) => l.type !== "inspection");

  const rows = [
    ...contactLeads.map((l) => ({
      id: l.id,
      type: l.type,
      name: l.full_name ?? l.email ?? "—",
      phone: l.phone ?? "—",
      email: l.email ?? "—",
      created_at: l.created_at,
      inspectionId: null as string | null,
    })),
    ...inspections.map((i) => ({
      id: i.id,
      type: "inspection" as const,
      name: i.full_name,
      phone: i.phone,
      email: i.email,
      created_at: i.created_at,
      inspectionId: i.id,
    })),
  ].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const csv = [
    "type,name,phone,email,created_at",
    ...rows.map(
      (r) =>
        `${r.type},"${r.name}","${r.phone}","${r.email}",${r.created_at}`
    ),
  ].join("\n");

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <h1 className="text-2xl font-bold sm:text-3xl">Leads & Contacts</h1>
        <a
          href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`}
          download="autoverse-leads.csv"
          className="btn-touch w-full rounded-full border border-white/20 text-center text-sm sm:w-auto"
        >
          Export CSV
        </a>
      </div>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5 text-white/60">
            <tr>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Open</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={`${r.type}-${r.id}`} className="border-t border-white/10">
                <td className="px-4 py-3">{r.type}</td>
                <td className="px-4 py-3">{r.name}</td>
                <td className="px-4 py-3">{r.phone}</td>
                <td className="px-4 py-3">{r.email}</td>
                <td className="px-4 py-3">
                  {new Date(r.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  {r.inspectionId ? (
                    <Link
                      href={`/admin/inspections/${r.inspectionId}`}
                      className="text-accent"
                    >
                      Details
                    </Link>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
