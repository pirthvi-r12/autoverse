import type { Metadata } from "next";
import Link from "next/link";
import { CeramicSection } from "@/components/ceramic/ceramic-section";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Ceramic Coating & 3M Detailing — ${SITE.name}`,
  description: `3M paint correction and ceramic coating in D.H.A Phase 2 Ext, ${SITE.city} — Land Cruiser ZX and full interior / engine detailing at ${SITE.name}. Book 0335-7344294.`,
  alternates: { canonical: `${SITE.url}/ceramic-coating` },
};

export default function CeramicCoatingPage() {
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
        <span className="text-white/80">Ceramic coating</span>
      </nav>
      <CeramicSection variant="page" />
    </div>
  );
}
