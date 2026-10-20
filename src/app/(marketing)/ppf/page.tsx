import type { Metadata } from "next";
import Link from "next/link";
import { PpfSection } from "@/components/ppf/ppf-section";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `PPF Paint Protection Film — ${SITE.name}`,
  description: `Miracle & Stealth PPF in D.H.A Phase 2 Ext, ${SITE.city} — Fortuner 2021, Corolla Cross, KIA Sportage, paint correction & detailing. Book ${SITE.name}.`,
  alternates: { canonical: `${SITE.url}/ppf` },
};

export default function PpfPage() {
  return (
    <div className="page-shell">
      <nav
        className="mb-4 text-xs text-white/50 sm:mb-6 sm:text-sm"
        aria-label="Breadcrumb"
      >
        <Link href="/" className="hover:text-accent">
          Home
        </Link>
        <span className="mx-1">/</span>
        <span className="text-white/80">PPF Services</span>
      </nav>
      <PpfSection variant="page" />
    </div>
  );
}
