"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HeroCircularShowcase } from "@/components/home/hero-circular-showcase";
import { BRAND, SITE } from "@/lib/constants";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[calc(100dvh-4rem)] items-center overflow-hidden pt-20 sm:min-h-screen sm:pt-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(19,131,161,0.2),transparent_50%),radial-gradient(circle_at_80%_0%,rgba(96,219,251,0.1),transparent_45%)]" />
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:gap-10 sm:py-16 lg:grid-cols-2 lg:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Premium Auto Showroom · {SITE.city}
          </p>
          <h1 className="text-3xl font-black leading-[1.15] text-white sm:text-4xl md:text-6xl">
            {BRAND.tagline} with{" "}
            <span className="text-accent">{SITE.name}</span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-white/65 sm:mt-5 sm:text-lg">
            Curated used cars, transparent pricing, and certified inspections.
            Browse inventory or book an expert inspection today.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-2.5 sm:mt-8 sm:flex sm:flex-wrap sm:gap-3">
            <Link
              href="/cars"
              className="btn-touch rounded-full bg-accent font-bold text-brand-ink shadow-[0_0_30px_rgba(96,219,251,0.35)] sm:w-auto"
            >
              Browse Cars
            </Link>
            <Link
              href="/#inspection"
              className="btn-touch glass-cta rounded-full text-white transition hover:border-accent/50 hover:text-accent sm:w-auto"
            >
              Book Inspection
            </Link>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          <HeroCircularShowcase />
        </motion.div>
      </div>
    </section>
  );
}
