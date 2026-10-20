"use client";

import { finalizeInspectionReport } from "@/lib/admin/actions";
import type { InspectionReport } from "@/types";

const CHECKLIST_KEYS = [
  "engine",
  "transmission",
  "suspension",
  "brakes",
  "tyres",
  "electrical",
  "ac",
  "interior",
  "exterior_paint",
  "accident_history",
] as const;

export function InspectionChecklistForm({
  inspectionId,
  report,
}: {
  inspectionId: string;
  report: InspectionReport | null;
}) {
  return (
    <form action={finalizeInspectionReport} className="glass space-y-4 rounded-2xl p-6">
      <input type="hidden" name="inspection_id" value={inspectionId} />
      <div>
        <h2 className="text-xl font-semibold">Inspection checklist & report</h2>
        <p className="mt-1 text-sm text-white/50">
          Score each area 0–10, add notes, then generate the customer PDF and share link.
        </p>
      </div>
      {CHECKLIST_KEYS.map((key) => {
        const existing = report?.checklist?.[key];
        return (
          <div key={key} className="grid gap-2 md:grid-cols-[140px_80px_1fr]">
            <label className="capitalize text-white/70">{key.replace(/_/g, " ")}</label>
            <input
              name={`${key}_score`}
              type="number"
              min={0}
              max={10}
              defaultValue={existing?.score ?? 0}
              className="field"
            />
            <input
              name={`${key}_notes`}
              defaultValue={existing?.notes ?? ""}
              placeholder="Notes"
              className="field"
            />
          </div>
        );
      })}
      <input
        name="rating"
        type="number"
        min={0}
        max={10}
        step={0.1}
        defaultValue={report?.rating ?? ""}
        placeholder="Overall rating (0–10)"
        className="field"
      />
      <textarea
        name="inspector_remarks"
        rows={3}
        defaultValue={report?.inspector_remarks ?? ""}
        placeholder="Inspector remarks (shown on report)"
        className="field"
      />
      <button type="submit" className="rounded-xl bg-accent px-4 py-2 font-semibold text-black">
        {report ? "Update report & mark completed" : "Mark completed & generate report"}
      </button>
    </form>
  );
}
