import { cn } from "@/lib/utils";

/**
 * On-brand image slot: an isometric navy-and-gold motif that looks designed
 * (not like a broken image) until the real photograph is dropped in.
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
  const dark = tone === "navy";
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-card",
        dark ? "bg-navy-gradient" : "bg-gradient-to-br from-cream to-[#EFE6D2]",
        className,
      )}
    >
      {/* soft gold bloom */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(closest-side at 50% 42%, rgba(226,191,114,.30), rgba(226,191,114,0) 70%)",
        }}
      />
      <div className="relative flex flex-col items-center gap-3 px-4 text-center">
        {/* isometric cube */}
        <svg viewBox="0 0 64 68" className="h-12 w-12 drop-shadow-sm" aria-hidden>
          <polygon points="32,2 61,19 32,36 3,19" fill="#E2BF72" />
          <polygon points="3,19 32,36 32,66 3,49" fill={dark ? "#1B336E" : "#24417F"} />
          <polygon points="61,19 32,36 32,66 61,49" fill="#0E1D45" />
        </svg>
        {label && (
          <span
            className={cn(
              "font-head text-[11px] font-bold uppercase tracking-[0.16em]",
              dark ? "text-gold-light" : "text-navy/55",
            )}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
