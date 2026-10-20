import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { AdminLogoutButton } from "@/components/admin/admin-logout-button";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/cars", label: "Cars" },
  { href: "/admin/inspections", label: "Inspections" },
  { href: "/admin/leads", label: "Leads" },
];

export default function AdminShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-ink text-white">
      <div className="border-b border-brand/30 bg-brand-deep">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-6">
          <div className="inline-flex items-center gap-2">
            <BrandLogo href="/admin" variant="mark" showWordmark={false} />
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-white/60 hover:text-accent">
              View site
            </Link>
            <AdminLogoutButton />
          </div>
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[220px_1fr] lg:px-6">
        <aside className="glass h-fit rounded-2xl p-4">
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
