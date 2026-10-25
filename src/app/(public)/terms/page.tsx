import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <section className="py-14">
      <div className="shell max-w-3xl">
        <h1 className="text-4xl font-bold">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted">
          This is a starting template. Please have it reviewed before launch.
        </p>
        <div className="mt-8 space-y-6 text-[15px] leading-relaxed">
          <div>
            <h2 className="text-xl font-bold text-navy">Quotes & orders</h2>
            <p className="mt-2 text-muted">
              Quotes are itemised and valid for the period stated. Prices exclude GST unless
              noted. An order is confirmed once you approve the quote or send a purchase order.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-navy">Delivery</h2>
            <p className="mt-2 text-muted">
              We deliver across Mumbai, Thane and Navi Mumbai on the schedule agreed in your
              order. Urgent and partial deliveries are subject to stock and availability and may
              carry an additional charge, confirmed in advance.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-navy">Payment</h2>
            <p className="mt-2 text-muted">
              We accept purchase orders, UPI, NEFT/RTGS and cheque. Approved accounts may be
              offered credit terms. A GST invoice is issued with every delivery.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-navy">Returns & replacements</h2>
            <p className="mt-2 text-muted">
              Damaged or incorrect items are replaced free of charge when reported promptly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
