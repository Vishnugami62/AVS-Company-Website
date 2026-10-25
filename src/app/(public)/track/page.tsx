import type { Metadata } from "next";
import { Activity, CalendarCog, Mail, PhoneCall, ShieldCheck } from "lucide-react";
import { TrackSearch } from "@/components/public/TrackSearch";

export const metadata: Metadata = {
  title: "Track Your Order",
  description:
    "Track your AVS order with your PO number or AVS order number — live status, delivery changes and email updates.",
};

const FEATURES = [
  { icon: Activity, title: "Live order status", body: "See every stage — confirmed, arranged, packed, dispatched and delivered." },
  { icon: CalendarCog, title: "Change your delivery", body: "Ask for a scheduled slot, urgent delivery or a partial delivery." },
  { icon: Mail, title: "Email updates", body: "Get an email at every stage, and when we reply to your request." },
  { icon: PhoneCall, title: "Offline orders too", body: "Ordered by phone, email or WhatsApp? Use the number in your confirmation email." },
];

export default function TrackLandingPage() {
  return (
    <>
      <section className="bg-cream py-14">
        <div className="shell max-w-3xl">
          <span className="eyebrow">Order tracking</span>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Track your order, anytime</h1>
          <p className="mt-4 text-[17px] text-muted">
            Enter your PO number or AVS order number to see where your order is — whether you
            ordered online, by phone, email or WhatsApp.
          </p>
          <div className="mt-6 rounded-card bg-paper p-5 shadow-card">
            <TrackSearch autoFocus />
            <p className="mt-3 flex items-center gap-2 text-xs text-muted">
              <ShieldCheck className="h-4 w-4 text-gold" />
              For your privacy, we show only the order status — no names, addresses, items or
              prices.
            </p>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="shell grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-6">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-navy text-gold-light">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-lg font-bold">{f.title}</h3>
              <p className="mt-1.5 text-[15px] text-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
