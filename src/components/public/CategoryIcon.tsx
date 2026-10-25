import {
  PenLine,
  SprayCan,
  Coffee,
  Gift,
  Printer,
  Boxes,
  Package,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MAP: Record<string, LucideIcon> = {
  pen: PenLine,
  spray: SprayCan,
  coffee: Coffee,
  gift: Gift,
  printer: Printer,
  boxes: Boxes,
};

export function CategoryIcon({
  icon,
  className,
}: {
  icon: string;
  className?: string;
}) {
  const Icon = MAP[icon] ?? Package;
  return <Icon className={className} aria-hidden />;
}

/** Icon inside the brand's gold circle motif. */
export function IconBadge({
  icon,
  className,
}: {
  icon: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "grid h-12 w-12 place-items-center rounded-full bg-gold-gradient text-navy-deep shadow-soft",
        className,
      )}
    >
      <CategoryIcon icon={icon} className="h-6 w-6" />
    </span>
  );
}
