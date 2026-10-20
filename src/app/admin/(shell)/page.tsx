import { getCarStats } from "@/lib/data/cars";
import { getInspections, getLeads } from "@/lib/data/inspections";

export default async function AdminDashboardPage() {
  const [stats, inspections, leads] = await Promise.all([
    getCarStats(),
    getInspections(),
    getLeads(),
  ]);

  const pendingInspections = inspections.filter((i) => i.status === "pending").length;
  const completedInspections = inspections.filter(
    (i) => i.status === "completed"
  ).length;

  const cards = [
    { label: "Total cars", value: stats.total },
    { label: "Available", value: stats.available },
    { label: "Sold", value: stats.sold },
    { label: "Pending inspections", value: pendingInspections },
    { label: "Completed inspections", value: completedInspections },
    { label: "Recent leads", value: leads.length },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-white/60">Overview of inventory and enquiries.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="glass rounded-2xl p-5">
            <p className="text-sm text-white/50">{c.label}</p>
            <p className="mt-2 text-3xl font-black text-accent">{c.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <a
          href="/admin/inspections"
          className="glass rounded-2xl p-5 transition hover:border-accent/40 border border-transparent"
        >
          <h2 className="font-semibold">Inspection bookings</h2>
          <p className="mt-2 text-sm text-white/60">
            See who booked inspections, contact details, and complete reports.
          </p>
          <p className="mt-3 text-accent text-sm">Open inspections →</p>
        </a>
        <a
          href="/admin/cars"
          className="glass rounded-2xl p-5 transition hover:border-accent/40 border border-transparent"
        >
          <h2 className="font-semibold">Manage cars & photos</h2>
          <p className="mt-2 text-sm text-white/60">
            Add cars, upload gallery photos, edit prices, mark sold.
          </p>
          <p className="mt-3 text-accent text-sm">Open car management →</p>
        </a>
      </div>

      <div className="mt-10 glass rounded-2xl p-6">
        <h2 className="font-semibold">Recent enquiries</h2>
        <ul className="mt-4 space-y-2 text-sm text-white/70">
          {leads.slice(0, 5).map((lead) => (
            <li key={lead.id}>
              [{lead.type}] {lead.full_name ?? lead.email} —{" "}
              {new Date(lead.created_at).toLocaleString()}
            </li>
          ))}
          {!leads.length && <li>No leads yet.</li>}
        </ul>
      </div>
    </div>
  );
}
