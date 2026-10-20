"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { BRAND, NAV_LINKS } from "@/lib/constants";
import { BrandLogo } from "@/components/brand/brand-logo";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";

function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const scrollY = window.scrollY;
    const { style } = document.body;
    const prev = {
      position: style.position,
      top: style.top,
      left: style.left,
      right: style.right,
      overflow: style.overflow,
      width: style.width,
    };

    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.left = "0";
    style.right = "0";
    style.width = "100%";
    style.overflow = "hidden";

    return () => {
      style.position = prev.position;
      style.top = prev.top;
      style.left = prev.left;
      style.right = prev.right;
      style.overflow = prev.overflow;
      style.width = prev.width;
      window.scrollTo(0, scrollY);
    };
  }, [active]);
}

function isNavLinkActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href.startsWith("/#")) return pathname === "/";
  const path = href.split("#")[0];
  return pathname === path || pathname.startsWith(`${path}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const menuId = useId();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useScrollLock(open);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "glass-nav fixed inset-x-0 top-0 z-[120] transition-all duration-300",
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
                  isNavLinkActive(pathname, link.href)
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
            aria-controls={menuId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <>
                <motion.button
                  type="button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="fixed inset-0 z-[110] bg-[#020a0e]/80 backdrop-blur-md md:hidden"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                />
                <motion.div
                  id={menuId}
                  role="dialog"
                  aria-modal="true"
                  aria-label="Main navigation"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "tween", duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="mobile-nav-drawer fixed inset-y-0 right-0 z-[115] flex w-[min(100%,22rem)] flex-col border-l border-white/[0.08] md:hidden"
                  style={{
                    paddingTop: "env(safe-area-inset-top, 0px)",
                    paddingBottom: "env(safe-area-inset-bottom, 0px)",
                  }}
                >
                  <div className="relative flex h-[4.25rem] shrink-0 items-center gap-3 border-b border-white/10 px-5">
                    <BrandLogo
                      href="/"
                      variant="mark"
                      showWordmark={false}
                      priority
                      className="pointer-events-none scale-90"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-bold leading-tight text-white">
                        {BRAND.name}
                      </p>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent/85">
                        {BRAND.tagline}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white transition hover:border-accent/40 hover:bg-white/10"
                      aria-label="Close menu"
                      onClick={() => setOpen(false)}
                    >
                      <X size={20} strokeWidth={2.25} />
                    </button>
                  </div>

                  <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto overscroll-contain px-4 py-5">
                    <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                      Explore
                    </p>
                    {NAV_LINKS.map((link) => {
                      const active = isNavLinkActive(pathname, link.href);
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "group flex min-h-[48px] items-center justify-between rounded-xl px-3.5 text-[16px] font-semibold tracking-tight transition",
                            active
                              ? "border border-accent/25 bg-accent/10 text-accent shadow-[inset_3px_0_0_0_var(--color-accent)]"
                              : "border border-transparent text-white/80 active:bg-white/[0.06]"
                          )}
                        >
                          <span>{link.label}</span>
                          {!active && (
                            <ChevronRight
                              size={18}
                              className="text-white/25 transition group-active:translate-x-0.5 group-active:text-white/40"
                              aria-hidden
                            />
                          )}
                        </Link>
                      );
                    })}
                  </nav>

                  <div className="shrink-0 border-t border-white/10 bg-gradient-to-t from-black/35 to-transparent px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
                    <Link
                      href="/cars"
                      onClick={() => setOpen(false)}
                      className="btn-touch flex w-full items-center justify-center rounded-full bg-accent px-6 py-3.5 text-[15px] font-bold text-brand-ink shadow-[0_0_28px_rgba(96,219,251,0.35)] transition hover:bg-accent/90"
                    >
                      Browse Cars
                    </Link>
                    <p className="mt-3 text-center text-[11px] leading-relaxed text-white/40">
                      Premium used cars · PPF · Ceramic · Karachi
                    </p>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
