import type { Metadata } from "next";
import { CreditCard, Truck } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Five simple steps from your requirement to your desk — with a clear timeline at every stage.",
};

const STEPS = [
  { n: "1", title: "Share your requirement", body: "Use the website form, upload an Excel sheet, email us or WhatsApp your list.", time: "2 minutes" },
  { n: "2", title: "Receive your quote", body: "An itemised quote with prices, pack sizes and a delivery date.", time: "Within 24 hours" },
  { n: "3", title: "Approve & raise a PO", body: "Approve online or send your purchase order — we confirm straight away.", time: "Same day" },
  { n: "4", title: "Scheduled delivery", body: "Packed, labelled and delivered — track every stage with your PO number.", time: "1–2 working days" },
  { n: "5", title: "Invoice & reorder", body: "A GST invoice with every delivery; repeat any order in one click.", time: "On demand" },
];

const FAQ = [
  { q: "Can I order on WhatsApp?", a: "Yes. Send your list and we'll reply with an itemised quote. You can approve it on WhatsApp too — we'll send the GST invoice by email." },
  { q: "Do you deliver outside Mumbai?", a: "We currently deliver across Mumbai, Thane and Navi Mumbai, and we're expanding. Tell us your location and we'll let you know." },
  { q: "Can you source items that aren't in the catalogue?", a: "Yes. Send us the product name or a photo and we'll source it and add it to your quote." },
  { q: "How do returns and replacements work?", a: "Damaged or incorrect items are replaced free of charge — just let your account manager know." },
  { q: "How do I track my order?", a: "Use your PO number or AVS order number on the Track Order page. No login is needed." },
  { q: "Can we set up a monthly auto-order?", a: "Yes. Recurring orders can be scheduled with pricing locked for a set period, and you can pause or change them any time." },
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="bg-cream py-14">
        <div className="shell">
          <nav className="text-sm text-muted">
            <span className="text-navy">Home</span> / How It Works
          </nav>
          <div className="mt-4 max-w-2xl">
            <span className="eyebrow">How it works</span>
            <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Ordering made effortless</h1>
            <p className="mt-3 text-[17px] text-muted">
              Five simple steps from your requirement to your desk — with a clear timeline at
              every stage.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="shell space-y-4">
          {STEPS.map((s) => (
            <div key={s.n} className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gold-gradient font-head text-lg font-bold text-navy-deep">
                {s.n}
              </span>
              <div className="flex-1">
                <h3 className="text-lg font-bold">{s.title}</h3>
                <p className="mt-1 text-[15px] text-muted">{s.body}</p>
              </div>
              <span className="chip shrink-0">{s.time}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-cream py-14">
        <div className="shell grid gap-6 md:grid-cols-2">
          <div className="card p-6">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-gold" />
              <h2 className="text-lg font-bold">Delivery promise</h2>
            </div>
            <ul className="mt-4 space-y-2 text-[15px] text-muted">
              <li>Order by 4 pm for next-day delivery</li>
              <li>Mumbai, Thane &amp; Navi Mumbai covered</li>
              <li>Minimum order value applies</li>
              <li>Free delivery above a set order value</li>
            </ul>
          </div>
          <div className="card p-6">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-gold" />
              <h2 className="text-lg font-bold">Payment terms</h2>
            </div>
            <ul className="mt-4 space-y-2 text-[15px] text-muted">
              <li>Purchase orders accepted</li>
              <li>30-day credit for approved accounts</li>
              <li>UPI, NEFT / RTGS or cheque</li>
              <li>GST invoice with every delivery</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="shell max-w-3xl">
          <SectionHeading eyebrow="FAQ" title="Questions you might have" />
          <div className="mt-8 space-y-3">
            {FAQ.map((f) => (
              <details key={f.q} className="card group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between font-head font-bold text-navy">
                  {f.q}
                  <span className="ml-4 text-gold transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-[15px] text-muted">{f.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-muted">Still have a question?</p>
            <Button href="/contact" variant="outline" className="mt-3">
              Chat with us
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
