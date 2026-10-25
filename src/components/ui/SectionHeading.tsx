import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  tone = "dark",
  className,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <span className={cn("eyebrow", tone === "light" && "text-gold-light")}>{eyebrow}</span>
      )}
      <h2
        className={cn(
          "mt-2 text-3xl font-bold sm:text-4xl",
          tone === "light" && "text-white",
        )}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={cn(
            "mt-3 text-[17px] leading-relaxed",
            tone === "light" ? "text-white/80" : "text-muted",
          )}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
