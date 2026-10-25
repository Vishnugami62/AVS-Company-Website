import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Download, Search } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IconBadge } from "@/components/public/CategoryIcon";
import { Button } from "@/components/ui/Button";
import { CATEGORIES } from "@/lib/catalogue-data";

export const metadata: Metadata = {
  title: "Our Catalogue",
  description:
    "Browse AVS supplies across six categories — stationery, housekeeping, pantry, corporate gifting, printing and facility & bulk.",
};

export default function CatalogueOverviewPage() {
  return (
    <>
      <section className="bg-cream py-14">
        <div className="shell">
          <SectionHeading
            eyebrow="Our catalogue"
            title="Your office, fully supplied"
            intro="Six categories, hundreds of office-ready products — in packs and bulk cartons. Add items to a quote list and we'll confirm pricing within 24 hours."
          />
        </div>
      </section>

      <section className="py-14">
        <div className="shell grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => (
            <div key={c.slug} className="flex h-full flex-col rounded-card border border-black/5 bg-paper p-6 shadow-card">
              <div className="flex items-center gap-3">
                <IconBadge icon={c.icon} />
                <h2 className="text-xl font-bold">{c.name}</h2>
              </div>
              <ul className="mt-4 flex-1 space-y-1.5 text-[15px] text-muted">
                {c.items.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href={`/catalogue/${c.slug}`} className="link-arrow mt-5">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>

        <div className="shell mt-10">
          <div className="flex flex-col items-start justify-between gap-5 rounded-card bg-navy-gradient p-8 text-white sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">Can&apos;t find an item? We source it for you</h2>
              <p className="mt-2 max-w-xl text-white/80">
                Send us the product name or a photo — we&apos;ll find it at the best price and add
                it to your quote.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href="/quote">
                <Search className="h-4 w-4" /> Request a custom item
              </Button>
              <Button href="/contact" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                <Download className="h-4 w-4" /> PDF catalogue
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
