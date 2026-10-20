"use client";

import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { SITE } from "@/lib/constants";

export function ContactSection({ embedded = false }: { embedded?: boolean }) {
  const [status, setStatus] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(fd.entries())),
    });
    setStatus(res.ok ? "Message sent. We'll reply soon." : "Failed to send.");
    if (res.ok) e.currentTarget.reset();
  }

  return (
    <section
      id={embedded ? undefined : "contact"}
      className={embedded ? "" : "border-t border-white/10 py-12 sm:py-16"}
    >
      <div
        className={
          embedded
            ? "grid gap-8 lg:grid-cols-2 lg:gap-10"
            : "mx-auto grid max-w-7xl gap-8 px-4 sm:gap-10 lg:grid-cols-2 lg:px-6"
        }
      >
        <div>
          <h2 className="section-title">Contact Us</h2>
          <ul className="mt-6 space-y-4 text-white/70">
            <li className="flex items-start gap-3">
              <MapPin className="mt-1 shrink-0 text-accent" size={18} />
              <a
                href={SITE.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent"
              >
                {SITE.address}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="text-accent" size={18} />
              <a href={`tel:${SITE.phone}`} className="hover:text-accent">
                {SITE.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="text-accent" size={18} />
              <a href={`mailto:${SITE.email}`} className="hover:text-accent">
                {SITE.email}
              </a>
            </li>
          </ul>
          <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
            <iframe
              title="AutoVerse location on Google Maps"
              src={SITE.mapsEmbedUrl}
              className="h-52 w-full grayscale contrast-125 sm:h-56 md:h-72"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="border-t border-white/10 bg-black/20 px-4 py-3">
              <a
                href={SITE.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-accent"
              >
                Open in Google Maps →
              </a>
            </div>
          </div>
        </div>
        <form onSubmit={submit} className="glass-panel rounded-2xl p-5 sm:p-6">
          <h3 className="text-lg font-semibold text-white sm:text-xl">
            Send an enquiry
          </h3>
          <div className="mt-4 grid gap-3">
            <input name="full_name" required placeholder="Full name" className="field" />
            <input name="email" type="email" required placeholder="Email" className="field" />
            <input name="phone" required placeholder="Phone / WhatsApp" className="field" />
            <textarea name="message" required rows={4} placeholder="Message" className="field" />
            <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
          </div>
          <button
            type="submit"
            className="btn-touch mt-4 w-full rounded-xl bg-accent text-black"
          >
            Send Message
          </button>
          {status && <p className="mt-2 text-sm text-accent">{status}</p>}
        </form>
      </div>
    </section>
  );
}
