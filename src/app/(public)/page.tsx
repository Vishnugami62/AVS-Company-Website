import Link from "next/link";
import {
  ArrowRight,
  BadgeIndianRupee,
  Boxes,
  CalendarClock,
  CheckCircle2,
  FileCheck2,
  MapPin,
  PackageCheck,
  Truck,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/public/Reveal";
import { HeroArt } from "@/components/art/HeroArt";
import { IconBadge } from "@/components/public/CategoryIcon";
import { CATEGORIES } from "@/lib/catalogue-data";
import { MUMBAI_HUBS } from "@/lib/constants";

const QUICK_PROMISES = [
  "Better bulk pricing",
  "Six categories, one supplier",
  "Track every order online",
  "Delivery in 6 Mumbai hubs",
];

const WHY = [
  {
    icon: FileCheck2,
    title: "One vendor, one PO",
    body: "Stationery to gifting on a single purchase order, with a GST invoice.",
  },
  {
    icon: BadgeIndianRupee,
    title: "Better bulk pricing",
    body: "Competitive rates on the brands you already use, with volume savings passed on to you.",
  },
  {
    icon: Truck,
    title: "Scheduled delivery",
    body: "Reliable, planned drops across Mumbai, Thane and Navi Mumbai.",
  },
  {
    icon: UserRound,
    title: "Your own account manager",
    body: "One person who knows your office, your list and your deadlines.",
  },
];

const STEPS = [
  { n: "1", title: "Share your list", body: "Upload an Excel sheet, type it in, or simply WhatsApp it to us." },
  { n: "2", title: "Get an itemised quote", body: "Clear prices for every item, within 24 hours." },
  { n: "3", title: "Approve & schedule", body: "Confirm with a PO and choose one-time or recurring delivery." },
  { n: "4", title: "Delivered & invoiced", body: "Track it online until it reaches your desk, with a GST invoice." },
];

const INDUSTRIES = [
  { title: "IT & GCC offices", body: "Onboarding kits, stationery and pantry for fast-growing teams." },
  { title: "Banking & finance", body: "Compliance-ready stationery, files and branded print." },
  { title: "Co-working spaces", body: "High-volume pantry and housekeeping, restocked on schedule." },
  { title: "Hospitals & clinics", body: "Hygiene, housekeeping and front-desk supplies." },
  { title: "Manufacturing units", body: "Facility, safety and bulk consumables for plants and offices." },
  { title: "Hotels & hospitality", body: "Guest-room, housekeeping and back-office supplies." },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-cream">
        <div className="shell grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
          <Reveal>
            <span className="eyebrow">Single-source corporate supplies</span>
            <h1 className="mt-3 text-4xl font-bold leading-[1.05] sm:text-5xl xl:text-6xl">
              Your office,
              <br />
              <span className="text-gold-text">fully supplied</span>
            </h1>
            <p className="mt-3 font-tagline text-lg italic text-gold-text">
              Better Supplies for a Smoother Tomorrow
            </p>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-muted">
              Your single-source partner for Stationery, Housekeeping, Pantry, Gifting and
              Printing — delivered across Mumbai&apos;s corporate hubs.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="/quote">Request a Quote</Button>
              <Button href="/catalogue" variant="outline">
                Explore Catalogue
              </Button>
            </div>
            <p className="mt-6 flex items-center gap-2 text-sm text-muted">
              <MapPin className="h-4 w-4 text-gold" />
              Delivering to BKC, Lower Parel, Andheri, Powai, Navi Mumbai &amp; Thane
            </p>
          </Reveal>

          <Reveal delay={120} className="relative">
            <div className="relative mx-auto max-w-md">
              <HeroArt className="w-full drop-shadow-xl" />
              <div className="absolute -left-2 top-6 chip shadow-soft">
                <PackageCheck className="h-4 w-4 text-gold" /> 500+ products
              </div>
              <div className="absolute -right-1 bottom-10 chip shadow-soft">
                <CalendarClock className="h-4 w-4 text-gold" /> 24 h quote
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Quick promises */}
      <section className="border-y border-black/5 bg-navy-deep">
        <div className="shell grid grid-cols-2 gap-4 py-5 lg:grid-cols-4">
          {QUICK_PROMISES.map((p) => (
            <div key={p} className="flex items-center gap-2 text-sm font-semibold text-white/90">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-gold-light" />
              {p}
            </div>
          ))}
        </div>
      </section>

      {/* What we supply */}
      <section className="py-16 sm:py-20">
        <div className="shell">
          <SectionHeading
            eyebrow="What we supply"
            title="Everything your workplace runs on"
            intro="Six categories. One supplier. One account to manage."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((c, i) => (
              <Reveal key={c.slug} delay={i * 60}>
                <Link
                  href={`/catalogue/${c.slug}`}
                  className="group flex h-full flex-col rounded-card border border-black/5 bg-paper p-6 shadow-card transition hover:-translate-y-1 hover:shadow-lift"
                >
                  <IconBadge icon={c.icon} />
                  <h3 className="mt-4 text-xl font-bold">{c.name}</h3>
                  <p className="mt-2 flex-1 text-[15px] text-muted">{c.blurb}</p>
                  <span className="link-arrow mt-4">
                    Explore range <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why AVS */}
      <section className="bg-cream py-16 sm:py-20">
        <div className="shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading
              eyebrow="Why AVS"
              title="One partner instead of six vendors"
              intro="Office admins know the drill — too many suppliers, too many invoices, too much follow-up. AVS replaces all of it with one dependable partner."
            />
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { big: "6", small: "product categories" },
                { big: "1", small: "supplier for every category" },
                { big: "24h", small: "quote turnaround" },
              ].map((s) => (
                <div key={s.small} className="rounded-card bg-paper p-4 text-center shadow-soft">
                  <div className="font-head text-3xl font-bold text-gold-text">{s.big}</div>
                  <div className="mt-1 text-xs text-muted">{s.small}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {WHY.map((w, i) => (
              <Reveal key={w.title} delay={i * 60}>
                <div className="flex h-full flex-col rounded-card bg-paper p-6 shadow-card">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-navy text-gold-light">
                    <w.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-lg font-bold">{w.title}</h3>
                  <p className="mt-1.5 text-[15px] text-muted">{w.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-20">
        <div className="shell">
          <SectionHeading
            eyebrow="How it works"
            title="From your list to your desk in four steps"
            intro="No catalogues to chase and no follow-up calls — here's how ordering with AVS works."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 70}>
                <div className="relative h-full rounded-card border border-black/5 bg-paper p-6 shadow-card">
                  <span className="font-head text-4xl font-bold text-gold/35">{s.n}</span>
                  <h3 className="mt-2 text-lg font-bold">{s.title}</h3>
                  <p className="mt-1.5 text-[15px] text-muted">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-8">
            <Button href="/how-it-works" variant="outline">
              See the full process <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="bg-navy-gradient py-16 text-white sm:py-20">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Industries we serve"
              title="Built for every kind of workplace"
              tone="light"
            />
            <Link href="/quote" className="link-arrow text-gold-light">
              Not sure what you need? Talk to us <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {INDUSTRIES.map((ind, i) => (
              <Reveal key={ind.title} delay={i * 50}>
                <div className="h-full rounded-card border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <h3 className="text-lg font-bold text-white">{ind.title}</h3>
                  <p className="mt-1.5 text-[15px] text-white/75">{ind.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Where we deliver */}
      <section className="py-16 sm:py-20">
        <div className="shell">
          <SectionHeading
            eyebrow="Where we deliver"
            title="Delivering across Mumbai's business hubs"
            intro="Scheduled deliveries to offices, plants and co-working spaces — with priority dispatch for urgent orders."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MUMBAI_HUBS.map((hub, i) => (
              <Reveal key={hub.slug} delay={i * 40}>
                <Link
                  href={`/service-areas/${hub.slug}`}
                  className="flex items-center justify-between rounded-card border border-black/5 bg-paper p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card"
                >
                  <span className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gold" />
                    <span>
                      <span className="block font-head font-bold text-navy">{hub.name}</span>
                      <span className="block text-xs text-muted">Delivery: next working day</span>
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted" />
                </Link>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted">
            Don&apos;t see your area?{" "}
            <Link href="/contact" className="font-semibold text-gold-text hover:underline">
              Ask us — we&apos;re expanding →
            </Link>
          </p>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-cream py-16">
        <div className="shell">
          <div className="relative overflow-hidden rounded-card bg-navy-gradient px-8 py-12 text-center shadow-lift sm:px-12">
            <Boxes className="absolute -right-6 -top-6 h-40 w-40 text-white/5" />
            <h2 className="mx-auto max-w-2xl text-3xl font-bold text-white sm:text-4xl">
              Ready to simplify your office supplies?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/80">
              Send us your list and get an itemised quote within 24 hours.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button href="/quote">Request a Quote</Button>
              <Button href="/contact" variant="whatsapp">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
