"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/constants";
import { BrandLogo } from "@/components/brand/brand-logo";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "glass-nav fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "glass-nav-solid shadow-[0_12px_40px_rgba(0,0,0,0.25)]"
          : "glass-nav-top"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:py-4 lg:px-6">
        <BrandLogo priority href="/" variant="mark" showWordmark />

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition hover:text-accent",
                pathname === link.href || pathname.startsWith(link.href + "/")
                  ? "text-accent"
                  : "text-white/70"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link href="/cars" className="hidden md:inline-flex">
          <Button type="button">Browse Cars</Button>
        </Link>

        <button
          type="button"
          className="-mr-1 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-white md:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="fixed inset-x-0 top-[calc(3.25rem+env(safe-area-inset-top,0px))] bottom-0 z-40 overflow-y-auto border-t border-white/10 bg-[#041820]/98 px-4 py-5 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-xl px-4 py-3.5 text-base font-medium",
                  pathname === link.href || pathname.startsWith(link.href + "/")
                    ? "bg-accent/15 text-accent"
                    : "text-white/85 active:bg-white/5"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/cars"
              onClick={() => setOpen(false)}
              className="btn-touch mt-3 rounded-full bg-accent text-center font-bold text-brand-ink"
            >
              Browse Cars
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
