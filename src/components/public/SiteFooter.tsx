import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { getSettings } from "@/lib/settings";

const CATALOGUE = [
  { href: "/catalogue/stationery", label: "Office Stationery" },
  { href: "/catalogue/housekeeping", label: "Housekeeping" },
  { href: "/catalogue/pantry", label: "Pantry Supplies" },
  { href: "/catalogue/gifting", label: "Corporate Gifting" },
  { href: "/catalogue/printing", label: "Printing" },
  { href: "/catalogue/facility-bulk", label: "Facility & Bulk" },
];

const COMPANY = [
  { href: "/about", label: "About Us" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/track", label: "Track Your Order" },
  { href: "/service-areas/andheri-east", label: "Service Areas" },
  { href: "/quote", label: "Get a Bulk Quote" },
  { href: "/contact", label: "Contact" },
];

export async function SiteFooter() {
  const s = await getSettings();
  return (
    <footer className="bg-navy-gradient text-white/80">
      <div className="shell grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:pr-6">
          <div className="font-head text-xl font-bold text-white">AVS Company</div>
          <p className="mt-1 font-tagline text-sm italic text-gold-light">{s.tagline}</p>
          <p className="mt-4 text-sm leading-relaxed">
            Office supplies, housekeeping, pantry, gifting and printing for Mumbai&apos;s
            workplaces — from one trusted partner.
          </p>
        </div>

        <div>
          <h3 className="font-head text-xs font-bold uppercase tracking-[0.18em] text-gold-light">
            Catalogue
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {CATALOGUE.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-head text-xs font-bold uppercase tracking-[0.18em] text-gold-light">
            Company
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {COMPANY.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-head text-xs font-bold uppercase tracking-[0.18em] text-gold-light">
            Get in touch
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-light" />
              <span>
                {s.address}, {s.city}
              </span>
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-light" />
              <span>{s.phone}</span>
            </li>
            <li className="flex gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-light" />
              <span>{s.salesEmail}</span>
            </li>
            <li className="flex gap-2.5">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold-light" />
              <span>{s.hours}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="shell flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/60 sm:flex-row">
          <span>© {new Date().getFullYear()} AVS Company. All rights reserved.</span>
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>GSTIN {s.gstin}</span>
            <span aria-hidden>·</span>
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <span aria-hidden>·</span>
            <Link href="/terms" className="hover:text-white">
              Terms of Service
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
