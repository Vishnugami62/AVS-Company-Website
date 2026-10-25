import { STATUS_LABEL } from "@/lib/constants";
import { cn } from "@/lib/utils";

const TONE: Record<string, string> = {
  CONFIRMED: "bg-navy/10 text-navy",
  ARRANGING: "bg-blue-100 text-blue-800",
  PACKING: "bg-amber-100 text-amber-800",
  READY: "bg-indigo-100 text-indigo-800",
  OUT_FOR_DELIVERY: "bg-gold/20 text-gold-text",
  DELIVERED: "bg-green-100 text-green-800",
  PARTIALLY_DELIVERED: "bg-teal-100 text-teal-800",
  ON_HOLD: "bg-red-100 text-red-700",
  CANCELLED: "bg-gray-200 text-gray-600",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-2.5 py-0.5 text-xs font-semibold",
        TONE[status] ?? "bg-gray-100 text-gray-700",
      )}
    >
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}
