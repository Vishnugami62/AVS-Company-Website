import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MUMBAI_HUBS } from "@/lib/constants";

export function generateStaticParams() {
  return MUMBAI_HUBS.map((h) => ({ area: h.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ area: string }>;
}): Promise<Metadata> {
  const { area } = await params;
  const hub = MUMBAI_HUBS.find((h) => h.slug === area);
  return {
    title: hub ? `Office Supplies in ${hub.name}` : "Service Area",
    description: hub
      ? `Stationery, housekeeping, pantry, gifting and printing delivered to offices in ${hub.name}, Mumbai.`
      : undefined,
  };
}

const MADE_FOR = ["Pantry restocks", "Housekeeping", "Onboarding kits", "Printing"];
const OPTIONS = [
  ["Standard", "next working day"],
  ["Scheduled", "pick your date and time slot"],
  ["Urgent", "same day, subject to stock"],
  ["Partial", "send some items first"],
];

export default async function ServiceAreaPage({
  params,
}: {
  params: Promise<{ area: string }>;
}) {
  const { area } = await params;
  const hub = MUMBAI_HUBS.find((h) => h.slug === area);
  if (!hub) notFound();
  const others = MUMBAI_HUBS.filter((h) => h.slug !== area);

  return (
    <>
      <section className="bg-cream py-14">
        <div className="shell">
          <nav className="text-sm text-muted">
            <Link href="/" className="hover:text-navy">Home</Link> / Service Areas /{" "}
            <span className="text-navy">{hub.name}</span>
          </nav>
          <div className="mt-4 max-w-2xl">
            <span className="eyebrow">Service area</span>
            <h1 className="mt-2 text-4xl font-bold sm:text-5xl">
              Office supplies in {hub.name}
            </h1>
            <p className="mt-3 text-[17px] text-muted">
              Serving offices in and around {hub.name} with scheduled, reliable delivery across
              six supply categories.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/quote">Get a Quote</Button>
              <Button href="/catalogue" variant="outline">
                Explore Catalogue
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="shell grid gap-8 lg:grid-cols-2">
          <div className="card p-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gold" />
              <h2 className="text-lg font-bold">Delivery in {hub.name}</h2>
            </div>
            <ul className="mt-4 space-y-2 text-[15px] text-muted">
              <li>Order by 4 pm → next working day</li>
              <li>Free delivery above a set order value</li>
              <li>A local account manager for your office</li>
            </ul>
          </div>
          <div className="card p-6">
            <h2 className="text-lg font-bold">Made for {hub.name} offices</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {MADE_FOR.map((m) => (
                <span key={m} className="chip">
                  <CheckCircle2 className="h-4 w-4 text-gold" /> {m}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="shell mt-8">
          <div className="card p-6">
            <h2 className="text-lg font-bold">Delivery options</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {OPTIONS.map(([t, d]) => (
                <div key={t} className="rounded-xl bg-cream p-4">
                  <div className="font-head font-bold text-navy">{t}</div>
                  <div className="mt-1 text-sm text-muted">{d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="shell mt-8">
          <h2 className="font-head text-xs font-bold uppercase tracking-[0.16em] text-gold-text">
            Other areas we serve
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {others.map((h) => (
              <Link key={h.slug} href={`/service-areas/${h.slug}`} className="chip">
                <MapPin className="h-4 w-4 text-gold" /> {h.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
