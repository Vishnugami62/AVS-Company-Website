import type { Metadata } from "next";
import { CheckCircle2, MessageCircle, Phone } from "lucide-react";
import { QuoteWizard } from "@/components/public/QuoteWizard";
import { getSettings, whatsappLink } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Get a Bulk Quote",
  description:
    "Tell us what you need and get an itemised quote within 24 hours — one supplier for stationery, housekeeping, pantry, gifting, printing and facility supplies.",
};

const WHY = [
  "One supplier for six categories",
  "Itemised quote within 24 hours",
  "GST invoice with every delivery",
  "Track every order online",
];

export default async function QuotePage() {
  const s = await getSettings();
  return (
    <section className="bg-cream py-12">
      <div className="shell">
        <div className="max-w-2xl">
          <span className="eyebrow">Get a bulk quote</span>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Get your bulk quote</h1>
          <p className="mt-3 text-[17px] text-muted">
            Tell us what you need — we reply with an itemised quote within 24 hours.
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <QuoteWizard />

          <aside className="space-y-5">
            <div className="card p-6">
              <h2 className="font-head text-xs font-bold uppercase tracking-[0.16em] text-gold-text">
                Why order from AVS
              </h2>
              <ul className="mt-4 space-y-3">
                {WHY.map((w) => (
                  <li key={w} className="flex items-start gap-2.5 text-[15px] text-ink">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    {w}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-muted">
                Once your order is confirmed, follow every step with your PO number — no login
                needed.
              </p>
            </div>

            <div className="card bg-navy-gradient p-6 text-white">
              <h2 className="text-lg font-bold text-white">Prefer WhatsApp?</h2>
              <p className="mt-1.5 text-sm text-white/80">
                Send your list as a message, photo or file.
              </p>
              <a
                href={whatsappLink(s.whatsapp, "Hi AVS, here is my supplies list for a quote:")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp mt-4 w-full"
              >
                <MessageCircle className="h-4 w-4" /> Send list on WhatsApp
              </a>
              <p className="mt-3 flex items-center gap-2 text-sm text-white/80">
                <Phone className="h-4 w-4" /> Or call {s.phone}
              </p>
              <p className="mt-3 text-xs text-white/60">Your details are never shared.</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
