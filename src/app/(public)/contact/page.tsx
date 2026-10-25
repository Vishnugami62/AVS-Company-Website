import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/public/ContactForm";
import { getSettings, whatsappLink } from "@/lib/settings";
import { MUMBAI_HUBS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Questions, quotes or a custom requirement — AVS replies within 2 working hours.",
};

export default async function ContactPage() {
  const s = await getSettings();
  const cards = [
    { icon: Phone, title: "Call us", lines: [s.phone, s.hours] },
    { icon: MessageCircle, title: "WhatsApp", lines: [s.whatsapp, "Quick quotes & order updates"], href: whatsappLink(s.whatsapp) },
    { icon: Mail, title: "Email", lines: [s.salesEmail, "Replies within 2 hours"] },
    { icon: MapPin, title: "Visit us", lines: [s.address, `${s.city} ${s.pincode}`] },
  ];

  return (
    <section className="py-12">
      <div className="shell">
        <nav className="text-sm text-muted">
          <span className="text-navy">Home</span> / Contact
        </nav>
        <div className="mt-4 max-w-2xl">
          <span className="eyebrow">Contact us</span>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Let&apos;s talk supplies</h1>
          <p className="mt-3 text-[17px] text-muted">
            Questions, quotes or a custom requirement — we reply within 2 working hours.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => {
            const inner = (
              <>
                <span className="grid h-11 w-11 place-items-center rounded-full bg-navy text-gold-light">
                  <c.icon className="h-5 w-5" />
                </span>
                <h2 className="mt-4 font-head text-base font-bold text-navy">{c.title}</h2>
                {c.lines.map((l) => (
                  <p key={l} className="mt-1 text-sm text-muted">
                    {l}
                  </p>
                ))}
              </>
            );
            return c.href ? (
              <a key={c.title} href={c.href} target="_blank" rel="noopener noreferrer" className="card p-6 transition hover:-translate-y-0.5 hover:shadow-lift">
                {inner}
              </a>
            ) : (
              <div key={c.title} className="card p-6">
                {inner}
              </div>
            );
          })}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <ContactForm />
          <aside className="card p-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gold" />
              <h2 className="font-head text-base font-bold text-navy">We deliver to</h2>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {MUMBAI_HUBS.map((h) => (
                <span key={h.slug} className="chip">
                  {h.name}
                </span>
              ))}
            </div>
            <p className="mt-6 text-sm text-muted">
              Mon – Sat, our team is on hand for quotes, order updates and anything you need for
              your workplace.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
