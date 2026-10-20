import { cn } from "@/lib/cn";
import type { CarStatus } from "@/types";

const statusStyles: Record<CarStatus, string> = {
  available: "bg-emerald-500/20 text-emerald-300 ring-emerald-400/30",
  sold: "bg-red-500/20 text-red-300 ring-red-400/30",
  reserved: "bg-amber-500/20 text-amber-200 ring-amber-400/30",
};

export function StatusBadge({
  status,
  className,
}: {
  status: CarStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ring-1 ring-inset",
        statusStyles[status],
        className
      )}
    >
      {status}
    </span>
  );
}
