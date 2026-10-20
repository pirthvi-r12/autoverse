"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HeroCircularShowcase } from "@/components/home/hero-circular-showcase";
import { BRAND, SITE } from "@/lib/constants";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(19,131,161,0.2),transparent_50%),radial-gradient(circle_at_80%_0%,rgba(96,219,251,0.1),transparent_45%)]" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 lg:grid-cols-2 lg:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Premium Auto Showroom · {SITE.city}
          </p>
          <h1 className="text-4xl font-black leading-tight text-white md:text-6xl">
            {BRAND.tagline} with{" "}
            <span className="text-accent">{SITE.name}</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/65">
            Curated used cars, transparent pricing, and certified inspections.
            Browse inventory or book an expert inspection today.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/cars"
              className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-brand-ink shadow-[0_0_30px_rgba(96,219,251,0.35)]"
            >
              Browse Cars
            </Link>
            <Link
              href="/#inspection"
              className="glass-cta rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:border-accent/50 hover:text-accent"
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
