"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  CalendarClock,
  PlusCircle,
  Boxes,
  Tags,
  Users,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS: { href: string; label: string; icon: LucideIcon; badgeKey?: "waiting" }[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: Package },
  { href: "/admin/requests", label: "Delivery requests", icon: CalendarClock, badgeKey: "waiting" },
  { href: "/admin/orders/new", label: "New offline order", icon: PlusCircle },
  { href: "/admin/products", label: "Products", icon: Boxes },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminNav({ waiting = 0 }: { waiting?: number }) {
  const pathname = usePathname();

  // Highlight the nav item whose href is the longest prefix of the path.
  const activeHref = ITEMS.map((i) => i.href)
    .filter((href) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href)))
    .sort((a, b) => b.length - a.length)[0];

  return (
    <nav className="space-y-1">
      {ITEMS.map((item) => {
        const active = item.href === activeHref;
        const badge = item.badgeKey === "waiting" ? waiting : 0;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
              active ? "bg-gold/15 text-navy" : "text-white/70 hover:bg-white/5 hover:text-white",
            )}
          >
            <item.icon className="h-4.5 w-4.5" style={{ height: 18, width: 18 }} />
            <span className="flex-1">{item.label}</span>
            {badge > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1.5 text-xs font-bold text-navy-deep">
                {badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
