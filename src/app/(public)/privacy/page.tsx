import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <section className="py-14">
      <div className="shell max-w-3xl">
        <h1 className="text-4xl font-bold">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted">
          This is a starting template. Please have it reviewed before launch.
        </p>
        <div className="prose mt-8 space-y-6 text-[15px] leading-relaxed text-ink">
          <div>
            <h2 className="text-xl font-bold text-navy">What we collect</h2>
            <p className="mt-2 text-muted">
              When you request a quote, contact us or place an order, we collect the details you
              provide — such as your name, company, email, phone number and delivery address — so
              we can prepare your quote, fulfil your order and keep you updated.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-navy">How we use it</h2>
            <p className="mt-2 text-muted">
              We use your details only to respond to you, process and deliver your orders, and
              send order updates. We do not sell your information. Order tracking shows only the
              order status and dates — never names, addresses, items or prices.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-navy">Keeping it safe</h2>
            <p className="mt-2 text-muted">
              Access to customer information is limited to authorised AVS staff. Delivery-change
              requests are verified by a one-time code sent to the email registered for the order.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-navy">Contact</h2>
            <p className="mt-2 text-muted">
              For any question about your data, contact us through the details on our Contact page.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
