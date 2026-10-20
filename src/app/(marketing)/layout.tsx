import { JsonLd } from "@/components/seo/json-ld";
import { localBusinessJsonLd } from "@/lib/seo";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SiteBackdrop } from "@/components/layout/site-backdrop";
import { WhatsAppFloat } from "@/components/layout/whatsapp-float";
import { SITE } from "@/lib/constants";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={localBusinessJsonLd()} />
      <SiteBackdrop />
      <div className="relative z-10">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloat />
      </div>
      <span className="sr-only">{SITE.name}</span>
    </>
  );
}
