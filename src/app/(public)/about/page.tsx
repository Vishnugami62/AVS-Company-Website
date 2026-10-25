import type { Metadata } from "next";
import Link from "next/link";
import { Award, Clock3, Leaf, ShieldCheck, Linkedin } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { Button } from "@/components/ui/Button";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "AVS Company brings stationery, housekeeping, pantry, gifting and printing under one roof for Mumbai's workplaces.",
};

const FOUNDERS = [
  { initials: "VG", name: "Vishnu Gami", role: "Co-founder" },
  { initials: "AT", name: "Aryan Thakkar", role: "Co-founder" },
];

const VALUES = [
  { icon: ShieldCheck, title: "Quality you can trust", body: "Every product is checked before it leaves our warehouse." },
  { icon: Clock3, title: "On time, every time", body: "Delivery slots you can plan your week around." },
  { icon: Award, title: "Fair, transparent pricing", body: "Itemised quotes and no hidden charges, ever." },
  { icon: Leaf, title: "Greener choices", body: "Eco-friendly options offered in every category." },
];

const JOURNEY = [
  { tag: "2026", title: "Launch in Mumbai", body: "Six business hubs, six categories." },
  { tag: "Next", title: "Pan-India supply", body: "Serving multi-city offices." },
  { tag: "Then", title: "Own manufacturing", body: "Starting with packaged water." },
  { tag: "Future", title: "Global sourcing", body: "Exporting to first markets." },
];

export default async function AboutPage() {
  const s = await getSettings();
  return (
    <>
      <section className="bg-cream py-14">
        <div className="shell grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="eyebrow">About AVS Company</span>
            <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Made for Mumbai&apos;s workplaces</h1>
            <p className="mt-3 font-tagline text-lg italic text-gold-text">{s.tagline}</p>
            <p className="mt-5 text-[17px] leading-relaxed text-muted">
              AVS Company was founded to fix a problem every office admin knows — six vendors, six
              invoices and endless follow-ups for everyday supplies. We bring stationery,
              housekeeping, pantry, gifting and printing under one roof, delivered on schedule.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="/quote">Get a Bulk Quote</Button>
              <Button href="/catalogue" variant="outline">
                Explore Catalogue
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              [`Est. ${s.foundedYear}`, "Founded"],
              [s.city, "Based in"],
              ["6 categories", "One supplier"],
              ["24 h", "Quote turnaround"],
            ].map(([big, small]) => (
              <div key={small} className="rounded-card bg-paper p-5 text-center shadow-soft">
                <div className="font-head text-xl font-bold text-navy">{big}</div>
                <div className="mt-1 text-xs text-muted">{small}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founders */}
      <section className="py-16">
        <div className="shell">
          <SectionHeading
            eyebrow="The people behind AVS"
            title="Meet our founders"
            intro="Two founders with one goal: make workplace buying effortless for every office in Mumbai."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {FOUNDERS.map((f) => (
              <div key={f.name} className="card flex gap-5 p-6">
                <div className="relative">
                  <PhotoSlot label="Add photo" className="h-28 w-28 shrink-0" />
                  <span className="absolute -bottom-2 -right-2 grid h-10 w-10 place-items-center rounded-full bg-navy font-head text-sm font-bold text-gold-light">
                    {f.initials}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">{f.name}</h3>
                  <p className="text-sm text-gold-text">{f.role}</p>
                  <p className="mt-2 text-sm text-muted">
                    A short profile — background, experience and what they lead at AVS — can be
                    added here.
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted">
                    <Linkedin className="h-4 w-4 text-navy" /> LinkedIn profile
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission / vision */}
      <section className="bg-navy-gradient py-16 text-white">
        <div className="shell grid gap-8 md:grid-cols-2">
          <div className="rounded-card border border-white/10 bg-white/5 p-8">
            <span className="eyebrow text-gold-light">Our mission</span>
            <p className="mt-3 text-xl font-head leading-snug text-white">
              To be the single, dependable source for every workplace supply — fair prices, on
              time, every time.
            </p>
          </div>
          <div className="rounded-card border border-white/10 bg-white/5 p-8">
            <span className="eyebrow text-gold-light">Our vision</span>
            <p className="mt-3 text-xl font-head leading-snug text-white">
              To grow from Mumbai&apos;s trusted office partner into a global sourcing company for
              workplaces everywhere.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="shell">
          <SectionHeading eyebrow="What we stand for" title="Our promise to every client" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div key={v.title} className="card p-6">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-gold-gradient text-navy-deep">
                  <v.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-bold">{v.title}</h3>
                <p className="mt-1.5 text-[15px] text-muted">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="bg-cream py-16">
        <div className="shell">
          <SectionHeading eyebrow="Our journey" title="Where we're headed" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {JOURNEY.map((j, i) => (
              <div key={j.title} className="relative rounded-card bg-paper p-6 shadow-card">
                <span className="font-head text-xs font-bold uppercase tracking-wider text-gold-text">
                  {j.tag}
                </span>
                <h3 className="mt-2 text-lg font-bold">{j.title}</h3>
                <p className="mt-1.5 text-[15px] text-muted">{j.body}</p>
                <span className="absolute right-5 top-5 font-head text-3xl font-bold text-gold/20">
                  {i + 1}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {["GST Registered", "MSME · Udyam Registered", "ISO 9001 — planned"].map((b) => (
              <span key={b} className="chip">
                <ShieldCheck className="h-4 w-4 text-gold" /> {b}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
