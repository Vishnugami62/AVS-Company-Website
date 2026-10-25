import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A polished, on-brand placeholder for a photograph the owner will add later.
 * Looks intentional (navy/gold, subtle pattern) rather than broken, and labels
 * what image belongs there.
 */
export function PhotoSlot({
  label,
  className,
  tone = "cream",
}: {
  label?: string;
  className?: string;
  tone?: "cream" | "navy";
}) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-card",
        tone === "navy" ? "bg-navy-gradient text-gold-light" : "bg-cream text-navy/50",
        className,
      )}
    >
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "16px 16px",
        }}
        aria-hidden
      />
      <div className="relative flex flex-col items-center gap-2 px-4 text-center">
        <ImageIcon className="h-7 w-7 opacity-70" aria-hidden />
        <span className="font-head text-[11px] font-bold uppercase tracking-[0.16em]">
          {label ?? "Add photo"}
        </span>
      </div>
    </div>
  );
}
