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
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);

  return (
    <section className="py-16">
      <div className="mx-auto max-w-4xl px-4 lg:px-6">
        <h2 className="text-center text-3xl font-bold text-white">
          Customer Testimonials
        </h2>
        <div className="mt-8 overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="min-w-0 flex-[0_0_100%] px-2">
                <article className="glass-panel rounded-2xl p-8 text-center">
                  <Quote className="mx-auto text-accent" />
                  <p className="mt-4 text-lg text-white/80">&ldquo;{t.text}&rdquo;</p>
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
