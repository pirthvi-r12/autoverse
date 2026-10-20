"use client";

import { useMemo, useState } from "react";
import { upsertCar } from "@/lib/admin/actions";
import { CarImageManager } from "@/components/admin/car-image-manager";
import type { Car, CarStatus } from "@/types";
import { SITE } from "@/lib/constants";

export function CarForm({ car }: { car?: Car }) {
  const draftId = useMemo(() => car?.id ?? crypto.randomUUID(), [car?.id]);
  const [message, setMessage] = useState("");
  const [imagesJson, setImagesJson] = useState(
    () =>
      JSON.stringify(
        (car?.images ?? [])
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((img, index) => ({
            id: img.id,
            url: img.url,
            alt_text: img.alt_text,
            sort_order: index,
            is_cover: img.is_cover,
          }))
      )
  );
  const [displayName, setDisplayName] = useState(car?.name ?? "New car");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    const fd = new FormData(e.currentTarget);
    const result = await upsertCar({
      id: draftId,
      name: String(fd.get("name")),
      brand: String(fd.get("brand")),
      model: String(fd.get("model")),
      year: Number(fd.get("year")),
      price: Number(fd.get("price")),
      mileage: Number(fd.get("mileage")),
      fuel_type: String(fd.get("fuel_type")),
      transmission: String(fd.get("transmission")),
      engine_capacity: String(fd.get("engine_capacity") ?? "") || undefined,
      color: String(fd.get("color") ?? "") || undefined,
      body_type: String(fd.get("body_type")),
      registration_city: String(fd.get("registration_city") ?? SITE.city),
      owners: Number(fd.get("owners") ?? 1),
      condition: String(fd.get("condition") ?? "") || undefined,
      status: String(fd.get("status")) as CarStatus,
      description: String(fd.get("description") ?? ""),
      features: String(fd.get("features") ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      is_featured: fd.get("is_featured") === "on",
      images_json: String(fd.get("images_json") ?? imagesJson),
    });
    setMessage(
      result.ok
        ? car
          ? "Saved. Refresh the public car page to see updates."
          : "Car added. Upload photos above, then save again if needed."
        : "Failed"
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <CarImageManager
        carId={draftId}
        carName={displayName}
        initialImages={car?.images}
        onChange={setImagesJson}
      />

      <div className="glass space-y-3 rounded-2xl p-6">
        <h2 className="text-lg font-semibold">Car details</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            name="name"
            defaultValue={car?.name}
            placeholder="Display name *"
            className="field"
            required
            onChange={(e) => setDisplayName(e.target.value || "New car")}
          />
          <input
            name="brand"
            defaultValue={car?.brand}
            placeholder="Brand *"
            className="field"
            required
          />
          <input
            name="model"
            defaultValue={car?.model}
            placeholder="Model *"
            className="field"
            required
          />
          <input
            name="year"
            type="number"
            defaultValue={car?.year ?? 2024}
            className="field"
            required
          />
          <input
            name="price"
            type="number"
            defaultValue={car?.price ?? 0}
            className="field"
            required
          />
          <input
            name="mileage"
            type="number"
            defaultValue={car?.mileage ?? 0}
            className="field"
            required
          />
          <input
            name="fuel_type"
            defaultValue={car?.fuel_type ?? "Petrol"}
            className="field"
          />
          <input
            name="transmission"
            defaultValue={car?.transmission ?? "Automatic"}
            className="field"
          />
          <input
            name="engine_capacity"
            defaultValue={car?.engine_capacity ?? ""}
            placeholder="Engine (e.g. 1.5T)"
            className="field"
          />
          <input
            name="color"
            defaultValue={car?.color ?? ""}
            placeholder="Color"
            className="field"
          />
          <input
            name="body_type"
            defaultValue={car?.body_type ?? "Sedan"}
            className="field"
          />
          <input
            name="registration_city"
            defaultValue={car?.registration_city ?? SITE.city}
            placeholder="Registration city"
            className="field"
          />
          <input
            name="owners"
            type="number"
            min={1}
            defaultValue={car?.owners ?? 1}
            className="field"
          />
          <input
            name="condition"
            defaultValue={car?.condition ?? "Excellent"}
            placeholder="Condition"
            className="field"
          />
          <select name="status" defaultValue={car?.status ?? "available"} className="field">
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="reserved">Reserved</option>
          </select>
          <input
            name="features"
            defaultValue={car?.features?.join(", ") ?? ""}
            placeholder="Features (comma separated)"
            className="field md:col-span-2"
          />
          <textarea
            name="description"
            defaultValue={car?.description ?? ""}
            rows={4}
            placeholder="Description for buyers"
            className="field md:col-span-2"
          />
          <label className="flex items-center gap-2 text-sm md:col-span-2">
            <input name="is_featured" type="checkbox" defaultChecked={car?.is_featured} />
            Featured on homepage
          </label>
        </div>
        <input type="hidden" name="images_json" value={imagesJson} readOnly />
        <button type="submit" className="rounded-xl bg-accent px-4 py-2 font-semibold text-black">
          Save car
        </button>
        {message && <p className="text-sm text-accent">{message}</p>}
        {!car && (
          <p className="text-xs text-white/45">
            Tip: photos upload to this draft ID immediately. Click Save car when details are ready.
          </p>
        )}
      </div>
    </form>
  );
}
