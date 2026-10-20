"use client";

import Link from "next/link";
import { useState } from "react";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { BrandLogo } from "@/components/brand/brand-logo";

export function Footer() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  async function onNewsletter(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setMsg(res.ok ? "Subscribed. Thank you!" : "Something went wrong.");
    if (res.ok) setEmail("");
  }

  return (
    <footer className="glass-footer">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 pb-[max(3rem,env(safe-area-inset-bottom))] sm:gap-10 sm:py-14 md:grid-cols-4 lg:px-6">
        <div className="md:col-span-2">
          <BrandLogo href="/" variant="full" />
          <p className="mt-3 max-w-md text-sm text-white/65">
            Premium used cars and certified inspections in {SITE.city}. Drive
            with confidence — every vehicle is vetted by our experts.
          </p>
        </div>
        <div>
          <p className="font-semibold text-white">Quick Links</p>
          <ul className="mt-4 space-y-2 text-sm text-white/60">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/admin" className="hover:text-accent">
                Admin
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white">Newsletter</p>
          <form onSubmit={onNewsletter} className="mt-4 space-y-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="field"
            />
            <button
              type="submit"
              className="btn-touch w-full rounded-xl bg-accent text-brand-ink"
            >
              Subscribe
            </button>
            {msg && <p className="text-xs text-accent">{msg}</p>}
          </form>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-white/40">
        © {new Date().getFullYear()} {SITE.name}. All rights reserved.
      </div>
    </footer>
  );
}
