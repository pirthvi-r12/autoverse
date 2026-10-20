"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
const schema = z.object({
  full_name: z.string().min(2),
  phone: z.string().min(8),
  email: z.string().email(),
  city: z.string().min(2),
  car_brand: z.string().min(1),
  car_model: z.string().min(1),
  car_year: z.coerce.number().optional(),
  registration_number: z.string().optional(),
  mileage: z.coerce.number().optional(),
  color: z.string().optional(),
  fuel_type: z.string().optional(),
  transmission: z.string().optional(),
  inspection_type: z.enum(["basic", "standard", "full_premium"]),
  preferred_date: z.string().optional(),
  preferred_time: z.string().optional(),
  location_type: z.enum(["showroom", "home_visit"]),
  address: z.string().optional(),
  notes: z.string().optional(),
  website: z.string().max(0).optional(),
});

type FormValues = z.infer<typeof schema>;

export function InspectionFormModal({
  open,
  onClose,
  defaultCar,
}: {
  open: boolean;
  onClose: () => void;
  defaultCar?: { brand?: string; model?: string; year?: number; name?: string };
}) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      inspection_type: "standard",
      location_type: "showroom",
      car_brand: defaultCar?.brand ?? "",
      car_model: defaultCar?.model ?? "",
      car_year: defaultCar?.year,
    },
  });

  if (!open) return null;

  async function onSubmit(values: FormValues) {
    setError("");
    const res = await fetch("/api/inspections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, honeypot: values.website }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error ?? "Submission failed");
      return;
    }
    setSuccess(true);
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-0 sm:p-4 md:items-center"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="max-h-[min(92dvh,900px)] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-white/10 bg-[#0a1018] p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl sm:rounded-2xl sm:p-6 md:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="inspection-modal-title"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 id="inspection-modal-title" className="text-lg font-bold text-white sm:text-xl">
            Book Inspection
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg"
          >
            <X className="text-white/70" />
          </button>
        </div>
        {success ? (
          <p className="text-accent">
            Request submitted! Status: Pending. We&apos;ll confirm via email/WhatsApp.
          </p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 md:grid-cols-2">
            <input {...register("full_name")} placeholder="Full name *" className="field md:col-span-1" />
            <input {...register("phone")} placeholder="Phone / WhatsApp *" className="field" />
            <input {...register("email")} type="email" placeholder="Email *" className="field" />
            <input {...register("city")} placeholder="City *" className="field" />
            <input {...register("car_brand")} placeholder="Car brand *" className="field" />
            <input {...register("car_model")} placeholder="Car model *" className="field" />
            <input {...register("car_year")} placeholder="Year" className="field" />
            <input {...register("registration_number")} placeholder="Registration #" className="field" />
            <input {...register("mileage")} placeholder="Mileage (km)" className="field" />
            <input {...register("color")} placeholder="Color" className="field" />
            <input {...register("fuel_type")} placeholder="Fuel type" className="field" />
            <input {...register("transmission")} placeholder="Transmission" className="field" />
            <select {...register("inspection_type")} className="field">
              <option value="basic">Basic</option>
              <option value="standard">Standard</option>
              <option value="full_premium">Full Premium</option>
            </select>
            <input {...register("preferred_date")} type="date" className="field" />
            <input {...register("preferred_time")} type="time" className="field" />
            <select {...register("location_type")} className="field">
              <option value="showroom">Showroom</option>
              <option value="home_visit">Home visit</option>
            </select>
            <input {...register("address")} placeholder="Address (if home visit)" className="field md:col-span-2" />
            <textarea {...register("notes")} placeholder="Additional notes" rows={3} className="field md:col-span-2" />
            <input {...register("website")} tabIndex={-1} autoComplete="off" className="hidden" />
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-touch md:col-span-2 w-full rounded-xl bg-accent text-black disabled:opacity-60"
            >
              {isSubmitting ? "Submitting..." : "Submit Inspection Request"}
            </button>
            {error && <p className="md:col-span-2 text-sm text-red-400">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
