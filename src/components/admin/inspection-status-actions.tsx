"use client";

import { setInspectionStatusAction } from "@/lib/admin/actions";
import type { InspectionStatus } from "@/types";

const STATUSES: InspectionStatus[] = [
  "pending",
  "in_progress",
  "completed",
  "cancelled",
  "rescheduled",
];

export function InspectionStatusActions({
  id,
  current,
}: {
  id: string;
  current: InspectionStatus;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {STATUSES.map((status) => (
        <form key={status} action={setInspectionStatusAction}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="status" value={status} />
          <button
            type="submit"
            className={`rounded-full border px-3 py-1 text-xs capitalize ${
              current === status
                ? "border-accent bg-accent/15 text-accent"
                : "border-white/15 text-white/70 hover:border-white/30"
            }`}
          >
            {status.replace("_", " ")}
          </button>
        </form>
      ))}
    </div>
  );
}
