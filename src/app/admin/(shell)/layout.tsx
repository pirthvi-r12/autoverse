import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { AdminLogoutButton } from "@/components/admin/admin-logout-button";

/** Always read live TiDB data — never cache dashboard at build time. */
export const dynamic = "force-dynamic";

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
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:py-4 lg:px-6">
          <div className="inline-flex min-w-0 items-center gap-2">
            <BrandLogo href="/admin" variant="mark" showWordmark={false} />
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/"
              className="text-xs text-white/60 hover:text-accent sm:text-sm"
            >
              View site
            </Link>
            <AdminLogoutButton />
          </div>
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-4 sm:gap-6 sm:py-6 lg:grid-cols-[220px_1fr] lg:px-6">
        <aside className="glass h-fit rounded-2xl p-3 sm:p-4">
          <nav className="scroll-touch flex gap-2 overflow-x-auto lg:flex-col lg:gap-1 lg:overflow-visible">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="shrink-0 rounded-lg px-3 py-2.5 text-sm text-white/70 hover:bg-white/5 hover:text-white lg:py-2"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="min-w-0 pb-8">{children}</div>
      </div>
    </div>
  );
}
