"use client";

import Image from "next/image";
import { useState } from "react";
import type { CarImage } from "@/types";
import { carPhotoUnoptimized } from "@/lib/car-image";

type DraftImage = {
  id: string;
  url: string;
  alt_text?: string;
  sort_order: number;
  is_cover: boolean;
};

function toDraft(images: CarImage[] | undefined): DraftImage[] {
  if (!images?.length) return [];
  return [...images]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((img, index) => ({
      id: img.id,
      url: img.url,
      alt_text: img.alt_text ?? undefined,
      sort_order: index,
      is_cover: img.is_cover,
    }));
}

export function CarImageManager({
  carId,
  carName,
  initialImages,
  onChange,
}: {
  carId: string;
  carName: string;
  initialImages?: CarImage[];
  onChange: (json: string) => void;
}) {
  const [images, setImages] = useState<DraftImage[]>(() => toDraft(initialImages));
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  function commit(next: DraftImage[]) {
    const normalized = next.map((img, index) => ({
      ...img,
      sort_order: index,
      is_cover: img.is_cover,
    }));
    let cover = false;
    const withCover = normalized.map((img, index) => {
      if (img.is_cover && !cover) {
        cover = true;
        return img;
      }
      return { ...img, is_cover: false };
    });
    if (!cover && withCover.length) withCover[0].is_cover = true;
    setImages(withCover);
    onChange(JSON.stringify(withCover));
  }

  async function onFiles(selected: FileList | null) {
    if (!selected?.length) return;
    setError("");
    setUploading(true);
    try {
      const added: DraftImage[] = [];
      for (const file of Array.from(selected)) {
        const fd = new FormData();
        fd.set("car_id", carId);
        fd.set("file", file);
        const res = await fetch("/api/admin/car-images", {
          method: "POST",
          body: fd,
          credentials: "include",
        });
        const raw = await res.text();
        let data: { url?: string; error?: string } = {};
        try {
          data = raw ? (JSON.parse(raw) as { url?: string; error?: string }) : {};
        } catch {
          throw new Error(
            raw?.slice(0, 200) || `Upload failed (HTTP ${res.status}). Check Vercel Blob storage.`
          );
        }
        if (!res.ok || !data.url) {
          throw new Error(data.error ?? "Upload failed");
        }
        added.push({
          id: crypto.randomUUID(),
          url: data.url,
          alt_text: `${carName} — photo`,
          sort_order: 0,
          is_cover: images.length === 0 && added.length === 0,
        });
      }
      commit([...images, ...added]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function remove(id: string) {
    commit(images.filter((i) => i.id !== id));
  }

  function setCover(id: string) {
    commit(
      images.map((img) => ({
        ...img,
        is_cover: img.id === id,
      }))
    );
  }

  function move(id: string, dir: -1 | 1) {
    const index = images.findIndex((i) => i.id === id);
    if (index < 0) return;
    const target = index + dir;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    commit(next);
  }

  return (
    <div className="space-y-3 rounded-2xl border border-white/10 bg-brand-deep/30 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-semibold text-white">Gallery photos</h3>
          <p className="text-xs text-white/50">
            Upload JPG/PNG/WebP (max 8MB). First photo or “Set cover” shows on listings.
          </p>
        </div>
        <label className="cursor-pointer rounded-full bg-accent px-4 py-2 text-sm font-semibold text-black">
          {uploading ? "Uploading…" : "Add photos"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            disabled={uploading}
            onChange={(e) => onFiles(e.target.files)}
          />
        </label>
      </div>

      {error && <p className="text-sm text-red-300">{error}</p>}

      {!images.length ? (
        <p className="text-sm text-white/45">No photos yet. Upload showroom images here.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((img, index) => (
            <li
              key={img.id}
              className="overflow-hidden rounded-xl border border-white/10 bg-brand-ink/40"
            >
              <div className="relative aspect-[4/3] bg-black/30">
                <Image
                  src={img.url}
                  alt={img.alt_text ?? carName}
                  fill
                  unoptimized={carPhotoUnoptimized(img.url)}
                  className="object-contain"
                  sizes="240px"
                />
                {img.is_cover && (
                  <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase text-black">
                    Cover
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1 p-2 text-xs">
                <button
                  type="button"
                  className="rounded border border-white/15 px-2 py-1"
                  onClick={() => setCover(img.id)}
                >
                  Set cover
                </button>
                <button
                  type="button"
                  className="rounded border border-white/15 px-2 py-1"
                  disabled={index === 0}
                  onClick={() => move(img.id, -1)}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="rounded border border-white/15 px-2 py-1"
                  disabled={index === images.length - 1}
                  onClick={() => move(img.id, 1)}
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="rounded border border-red-400/40 px-2 py-1 text-red-300"
                  onClick={() => remove(img.id)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
