"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { NAV_LINKS } from "@/lib/constants";
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
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-[110] bg-[#020a0e]/75 backdrop-blur-sm md:hidden"
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
                  transition={{ type: "tween", duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
                  className="fixed inset-y-0 right-0 z-[115] flex w-[min(100%,20.5rem)] flex-col border-l border-white/10 bg-[#041820] shadow-[-16px_0_48px_rgba(0,0,0,0.45)] md:hidden"
                  style={{
                    paddingTop: "max(0.75rem, env(safe-area-inset-top))",
                    paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
                  }}
                >
                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                      Menu
                    </span>
                    <button
                      type="button"
                      className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-white"
                      aria-label="Close menu"
                      onClick={() => setOpen(false)}
                    >
                      <X size={22} />
                    </button>
                  </div>

                  <nav className="flex flex-1 flex-col gap-1 overflow-y-auto overscroll-contain px-3 py-4">
                    {NAV_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "rounded-xl px-4 py-3.5 text-base font-medium",
                          pathname === link.href ||
                            pathname.startsWith(link.href + "/")
                            ? "bg-accent/15 text-accent"
                            : "text-white/85 active:bg-white/5"
                        )}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>

                  <div className="border-t border-white/10 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                    <Link
                      href="/cars"
                      onClick={() => setOpen(false)}
                      className="btn-touch block rounded-full bg-accent text-center font-bold text-brand-ink"
                    >
                      Browse Cars
                    </Link>
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
