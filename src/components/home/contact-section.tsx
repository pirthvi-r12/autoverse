"use client";

import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { SITE } from "@/lib/constants";

export function ContactSection() {
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
    <section id="contact" className="border-t border-white/10 py-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-2 lg:px-6">
        <div>
          <h2 className="text-3xl font-bold text-white">Contact Us</h2>
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
              className="h-56 w-full grayscale contrast-125 md:h-72"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a
              href={SITE.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm font-semibold text-accent"
            >
              Open in Google Maps →
            </a>
          </div>
        </div>
        <form
          onSubmit={submit}
          className="glass-panel rounded-2xl p-6"
        >
          <h3 className="text-xl font-semibold text-white">Send an enquiry</h3>
          <div className="mt-4 grid gap-3">
            <input name="full_name" required placeholder="Full name" className="field" />
            <input name="email" type="email" required placeholder="Email" className="field" />
            <input name="phone" required placeholder="Phone / WhatsApp" className="field" />
            <textarea name="message" required rows={4} placeholder="Message" className="field" />
            <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
          </div>
          <button type="submit" className="mt-4 w-full rounded-xl bg-accent py-3 font-semibold text-black">
            Send Message
          </button>
          {status && <p className="mt-2 text-sm text-accent">{status}</p>}
        </form>
      </div>
    </section>
  );
}
