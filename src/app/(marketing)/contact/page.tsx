import type { Metadata } from "next";
import { ContactSection } from "@/components/home/contact-section";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Contact ${SITE.name}`,
  description: `Contact ${SITE.name} in ${SITE.city} for used cars and inspections.`,
};

export default function ContactPage() {
  return (
    <div className="pt-16">
      <ContactSection />
    </div>
  );
}
