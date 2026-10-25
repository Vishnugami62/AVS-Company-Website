"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/catalogue", label: "Our Catalogue" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/track", label: "Track Order" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40">
      <div className="hidden bg-navy-deep py-1.5 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-light sm:block">
        Founded by Vishnu Gami &amp; Aryan Thakkar
      </div>
      <div
        className={cn(
          "border-b transition-all",
          scrolled
            ? "border-black/5 bg-paper/95 backdrop-blur shadow-soft"
            : "border-transparent bg-paper",
        )}
      >
        <div className="shell flex items-center justify-between gap-4 py-3">
          <Link href="/" className="flex items-center gap-2.5" aria-label="AVS Company home">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy font-head text-sm font-bold text-gold-light">
              AVS
            </span>
            <span className="leading-none">
              <span className="block font-head text-lg font-bold text-navy">AVS Company</span>
              <span className="block font-tagline text-[11px] italic text-gold-text">
                Better Supplies for a Smoother Tomorrow
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-pill px-3.5 py-2 font-head text-[13.5px] font-semibold transition",
                  isActive(item.href)
                    ? "bg-navy/5 text-navy"
                    : "text-navy/70 hover:bg-navy/5 hover:text-navy",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/quote" className="btn btn-gold btn-sm hidden sm:inline-flex">
              Get Bulk Quote
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-navy/15 text-navy lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="border-t border-black/5 bg-paper lg:hidden">
            <nav className="shell flex flex-col py-3">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-xl px-3 py-3 font-head text-[15px] font-semibold",
                    isActive(item.href) ? "bg-navy/5 text-navy" : "text-navy/80",
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <Link href="/quote" className="btn btn-gold mt-2">
                Get Bulk Quote
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
