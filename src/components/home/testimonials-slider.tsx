"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Ahmed R.",
    text: "Bought a Corolla from AutoVerse — inspection report was detailed and honest. Smooth experience.",
    rating: 5,
  },
  {
    name: "Sana K.",
    text: "Their home visit inspection saved me from a bad deal. Highly recommend the Premium package.",
    rating: 5,
  },
  {
    name: "Usman T.",
    text: "Premium showroom feel, fair prices, and quick WhatsApp support throughout.",
    rating: 5,
  },
];

export function TestimonialsSlider() {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: false },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 lg:px-6">
        <h2 className="section-title text-center text-2xl sm:text-3xl">
          Customer Testimonials
        </h2>
        <div
          className="mt-6 touch-pan-y overflow-hidden sm:mt-8"
          ref={emblaRef}
        >
          <div className="flex">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="min-w-0 flex-[0_0_100%] px-1 sm:px-2">
                <article className="glass-panel rounded-2xl p-5 text-center sm:p-8">
                  <Quote className="mx-auto text-accent" size={28} />
                  <p className="mt-4 text-base leading-relaxed text-white/80 sm:text-lg">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <p className="mt-4 font-semibold text-white">{t.name}</p>
                  <p className="text-sm text-accent">{"★".repeat(t.rating)}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
