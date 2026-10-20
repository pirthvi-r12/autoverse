"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { HERO_SHOWCASE_CARS } from "@/lib/hero-showcase-cars";
import { SITE } from "@/lib/constants";

const COUNT = HERO_SHOWCASE_CARS.length;
const INTERVAL_MS = 2200;

export function HeroCircularShowcase() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % COUNT),
      INTERVAL_MS
    );
    return () => window.clearInterval(id);
  }, [paused]);

  const current = HERO_SHOWCASE_CARS[active];

  return (
    <div
      className="hero-orbit-root relative mx-auto w-full max-w-[min(100%,440px)] select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="hero-orbit-glow pointer-events-none" aria-hidden />

      <div className="hero-orbit-stage glass-panel relative aspect-square overflow-visible rounded-full p-3">
        <div
          className="hero-orbit-ring pointer-events-none absolute inset-0 rounded-full border border-accent/25"
          aria-hidden
        />
        <div
          className="hero-orbit-ring hero-orbit-ring--inner pointer-events-none absolute inset-[12%] rounded-full border border-white/10"
          aria-hidden
        />

        <div
          className="hero-orbit-spinner absolute inset-0"
          style={{ animationPlayState: paused ? "paused" : "running" }}
          aria-hidden
        >
          {HERO_SHOWCASE_CARS.map((car, i) => {
            const angle = (360 / COUNT) * i;
            return (
              <div
                key={car.slug}
                className="hero-orbit-node absolute left-1/2 top-1/2"
                style={{
                  transform: `rotate(${angle}deg) translateY(calc(-1 * var(--orbit-radius))) rotate(${-angle}deg)`,
                }}
              >
                <button
                  type="button"
                  className={`hero-orbit-thumb block overflow-hidden rounded-full border-2 shadow-lg transition ${
                    i === active
                      ? "border-accent ring-2 ring-accent/50 scale-110"
                      : "border-white/20 opacity-85 hover:border-accent/40"
                  }`}
                  onClick={() => setActive(i)}
                  aria-label={`Show ${car.name}`}
                >
                  <Image
                    src={car.src}
                    alt=""
                    width={72}
                    height={72}
                    className="h-[var(--thumb-size)] w-[var(--thumb-size)] object-cover"
                    unoptimized
                  />
                </button>
              </div>
            );
          })}
        </div>

        <div className="absolute inset-[18%] flex items-center justify-center">
          <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-accent/40 bg-brand-ink shadow-[0_0_60px_rgba(96,219,251,0.2)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.slug}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.45 }}
                className="absolute inset-0"
              >
                <Image
                  src={current.src}
                  alt={current.name}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 280px, 320px"
                  priority={active === 0}
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/80 via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="mt-5 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.slug}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Featured at {SITE.name}
            </p>
            <p className="mt-1 text-lg font-bold text-white">{current.name}</p>
            <Link
              href={`/cars/${current.slug}`}
              className="mt-2 inline-block text-sm font-semibold text-white/70 underline-offset-4 hover:text-accent hover:underline"
            >
              View this car →
            </Link>
          </motion.div>
        </AnimatePresence>

        <div className="mt-4 flex justify-center gap-1.5" role="tablist" aria-label="Showcase slides">
          {HERO_SHOWCASE_CARS.map((car, i) => (
            <button
              key={car.slug}
              type="button"
              role="tab"
              aria-selected={i === active}
              className={`h-2 rounded-full transition-all ${
                i === active ? "w-6 bg-accent" : "w-2 bg-white/25 hover:bg-white/40"
              }`}
              onClick={() => setActive(i)}
              aria-label={car.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
