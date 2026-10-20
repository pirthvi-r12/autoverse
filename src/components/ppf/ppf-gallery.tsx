"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageIcon, X } from "lucide-react";
import type { PpfGalleryItem } from "@/lib/ppf-services";

export function PpfGallery({ items }: { items: PpfGalleryItem[] }) {
  const [lightbox, setLightbox] = useState<PpfGalleryItem | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="glass-panel overflow-hidden rounded-2xl"
          >
            {item.image ? (
              <button
                type="button"
                className="relative block aspect-[3/4] w-full bg-black/40"
                onClick={() => setLightbox(item)}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  unoptimized={item.image.startsWith("/images/")}
                />
              </button>
            ) : (
              <div className="flex aspect-[3/4] flex-col items-center justify-center gap-2 bg-white/[0.04] px-4 text-center">
                <ImageIcon className="text-accent/70" size={32} aria-hidden />
                <p className="text-xs font-medium text-white/45">
                  Photo coming soon
                </p>
              </div>
            )}
            <div className="border-t border-white/10 p-4">
              <h3 className="font-semibold text-white">{item.title}</h3>
              {item.description && (
                <p className="mt-1 text-sm text-white/55">{item.description}</p>
              )}
            </div>
          </article>
        ))}
      </div>

      {lightbox?.image && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-white/10 text-white"
            aria-label="Close"
            onClick={() => setLightbox(null)}
          >
            <X size={22} />
          </button>
          <div className="relative max-h-[85vh] w-full max-w-4xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightbox.image}
              alt={lightbox.title}
              className="max-h-[85vh] w-full object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
