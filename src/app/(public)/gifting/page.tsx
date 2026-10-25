import type { Metadata } from "next";
import { Gift, MapPin, MessageSquareText, PackageCheck, Truck } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { LogoPreview } from "@/components/public/LogoPreview";

export const metadata: Metadata = {
  title: "Corporate Gifting",
  description:
    "Festive hampers, onboarding kits and client gifts — curated to your budget, branded with your logo and delivered on time.",
};

const OCCASIONS = [
  { title: "Diwali & festive", body: "Hampers, sweets and décor" },
  { title: "Welcome kits", body: "Day-one kits for new joiners" },
  { title: "Client gifts", body: "Premium gifts that build trust" },
  { title: "Events & conferences", body: "Delegate kits and giveaways" },
  { title: "Rewards & milestones", body: "Work anniversaries and awards" },
];

const TIERS = [
  { tag: "Essentials", price: "Under ₹500", per: "per person", items: ["Branded pens & diaries", "Mugs & bottles", "Sweet & dry-fruit boxes"] },
  { tag: "Premium", price: "₹500 – ₹1,500", per: "per person", items: ["Curated welcome kits", "Tech accessories", "Gourmet hampers"] },
  { tag: "Luxury", price: "₹1,500 +", per: "per person", items: ["Leather & desk sets", "Smart gadgets", "Signature festive hampers"] },
];

const FEATURES = [
  { icon: Truck, title: "Multi-address delivery", body: "Upload one sheet — we pack and ship to every address." },
  { icon: MessageSquareText, title: "Personal message cards", body: "A printed note from your leadership in every box." },
  { icon: PackageCheck, title: "Live order tracking", body: "Status for every parcel, shared on WhatsApp and email." },
];

export default function GiftingPage() {
  return (
    <>
      <section className="bg-cream py-14">
        <div className="shell grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="eyebrow">Corporate gifting</span>
            <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Gifts your people actually keep</h1>
            <p className="mt-3 font-tagline text-lg italic text-gold-text">
              Thoughtful. Branded. Delivered on time.
            </p>
            <p className="mt-5 text-[17px] leading-relaxed text-muted">
              Festive hampers, onboarding kits and client gifts — curated to your budget, branded
              with your logo and delivered to one office or hundreds of homes.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="/quote">Plan a gifting order</Button>
              <Button href="/contact" variant="outline">
                Gift catalogue (PDF)
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Logo branding", "Multi-address delivery", "Pan-India dispatch"].map((c) => (
                <span key={c} className="chip">
                  <Gift className="h-4 w-4 text-gold" /> {c}
                </span>
              ))}
            </div>
          </div>
          <div className="card p-6">
            <LogoPreview />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="shell">
          <SectionHeading eyebrow="Shop by occasion" title="A gift for every moment that matters" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {OCCASIONS.map((o) => (
              <div key={o.title} className="card p-6">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-navy text-gold-light">
                  <Gift className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-bold">{o.title}</h3>
                <p className="mt-1 text-[15px] text-muted">{o.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-16">
        <div className="shell">
          <SectionHeading
            eyebrow="Plan by budget"
            title="A tier for every team and occasion"
            intro="Prices exclude GST and branding."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {TIERS.map((t) => (
              <div key={t.tag} className="card flex flex-col p-6">
                <span className="font-head text-xs font-bold uppercase tracking-wider text-gold-text">
                  {t.tag}
                </span>
                <div className="mt-2 font-head text-2xl font-bold text-navy">{t.price}</div>
                <div className="text-xs text-muted">{t.per}</div>
                <ul className="mt-4 flex-1 space-y-1.5 text-[15px] text-muted">
                  {t.items.map((i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                      {i}
                    </li>
                  ))}
                </ul>
                <Button href="/quote" variant="outline" size="sm" className="mt-5">
                  View gift ideas
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="shell">
          <SectionHeading eyebrow="Gifting, done for you" title="From one office to five hundred doorsteps" />
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="card p-6">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-gold-gradient text-navy-deep">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
                <p className="mt-1.5 text-[15px] text-muted">{f.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 rounded-card bg-navy-gradient p-8 text-white">
            <div className="flex items-center gap-2 text-gold-light">
              <MapPin className="h-5 w-5" />
              <span className="font-head text-xs font-bold uppercase tracking-wider">
                Plan ahead — key gifting dates
              </span>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-4">
              {[
                ["Jan", "New Year"],
                ["Mar", "Year-end rewards"],
                ["Oct – Nov", "Diwali"],
                ["All year", "Welcome kits"],
              ].map(([m, l]) => (
                <div key={l} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="font-head text-lg font-bold text-gold-light">{m}</div>
                  <div className="mt-1 text-sm text-white/80">{l}</div>
                </div>
              ))}
            </div>
            <Button href="/quote" className="mt-6">
              Plan a gifting order
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
