import { JsonLd } from "@/components/seo/json-ld";
import { faqJsonLd } from "@/lib/seo";
import { SITE } from "@/lib/constants";

const FAQS = [
  {
    q: "Do you provide car inspection before purchase?",
    a: `Yes. ${SITE.name} offers Basic, Standard, and Full Premium inspection packages with downloadable PDF reports.`,
  },
  {
    q: "Can I book a home visit inspection?",
    a: "Absolutely. Choose home visit during booking and our inspector will come to your location in supported cities.",
  },
  {
    q: "Are your used cars verified?",
    a: "Every car in our showroom is evaluated for condition, documentation, and roadworthiness before listing.",
  },
  {
    q: "Do you help with financing?",
    a: "We can connect you with partner banks for used car financing. Ask our team on WhatsApp for current offers.",
  },
];

export function FaqSection() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:py-16 lg:px-6">
      <JsonLd data={faqJsonLd(FAQS.map((f) => ({ question: f.q, answer: f.a })))} />
      <h2 className="section-title text-center text-2xl sm:text-3xl">FAQ</h2>
      <div className="mt-6 space-y-2.5 sm:mt-8 sm:space-y-3">
        {FAQS.map((item) => (
          <details
            key={item.q}
            className="glass-panel group rounded-xl p-4 open:border-accent/30"
          >
            <summary className="cursor-pointer list-none py-1 text-base font-semibold leading-snug text-white marker:content-none sm:text-[1.05rem]">
              {item.q}
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-white/65">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
