import Link from "next/link";
import { AlertCircle, ArrowLeft, Mail } from "lucide-react";
import { prisma } from "@/lib/db";
import { normalizeLookup, formatDate, formatDateTime } from "@/lib/utils";
import { STATUS_LABEL, REQUEST_TYPE_LABEL, REQUEST_STATUS_LABEL } from "@/lib/constants";
import { statusBanner } from "@/lib/tracking";
import { OrderTimeline } from "@/components/public/OrderTimeline";
import { DeliveryRequestPanel } from "@/components/public/DeliveryRequestPanel";
import { TrackSearch } from "@/components/public/TrackSearch";

export const dynamic = "force-dynamic";

export default async function OrderStatusPage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number } = await params;
  const raw = decodeURIComponent(number).trim();
  const norm = normalizeLookup(raw);

  const order = await prisma.order.findFirst({
    where: { OR: [{ avsNumber: norm }, { poNumber: raw }, { poNumber: norm }] },
    include: {
      events: { orderBy: { createdAt: "asc" } },
      deliveryRequests: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!order) {
    return (
      <section className="bg-cream py-16">
        <div className="shell max-w-2xl">
          <Link href="/track" className="link-arrow mb-6">
            <ArrowLeft className="h-4 w-4" /> Track order
          </Link>
          <div className="card p-8 text-center">
            <AlertCircle className="mx-auto h-10 w-10 text-gold" />
            <h1 className="mt-3 text-2xl font-bold">We couldn&apos;t find that order</h1>
            <p className="mx-auto mt-2 max-w-md text-muted">
              Please check the PO number or AVS order number and try again. You&apos;ll find your
              AVS order number in your confirmation email.
            </p>
            <div className="mx-auto mt-6 max-w-md text-left">
              <TrackSearch />
            </div>
          </div>
        </div>
      </section>
    );
  }

  const banner = statusBanner(order.status);

  return (
    <section className="bg-cream py-12">
      <div className="shell">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-sm">
          <nav className="text-muted">
            <Link href="/" className="hover:text-navy">
              Home
            </Link>{" "}
            / <Link href="/track" className="hover:text-navy">Track Order</Link> /{" "}
            <span className="text-navy">Order status</span>
          </nav>
          <Link href="/track" className="link-arrow">
            Track another order
          </Link>
        </div>

        {/* Summary */}
        <div className="card grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="text-xs uppercase tracking-wide text-muted">PO number</div>
            <div className="mt-1 font-head font-bold text-navy">{order.poNumber ?? "—"}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-muted">AVS order no.</div>
            <div className="mt-1 font-head font-bold text-navy">{order.avsNumber}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-muted">Current status</div>
            <div className="mt-1 font-head font-bold text-gold-text">
              {STATUS_LABEL[order.status] ?? order.status}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-muted">Expected delivery</div>
            <div className="mt-1 font-head font-bold text-navy">
              {formatDate(order.expectedDate)}
              {order.expectedSlot ? ` · ${order.expectedSlot}` : ""}
            </div>
          </div>
        </div>

        {banner && (
          <div className="mt-4 flex items-center gap-2 rounded-card border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-gold-text">
            <AlertCircle className="h-4 w-4" />
            {banner}
          </div>
        )}

        <div className="mt-3 flex items-center gap-2 text-xs text-muted">
          <Mail className="h-3.5 w-3.5" />
          Last updated {formatDateTime(order.updatedAt)} · Updates go to the email registered for
          this order.
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.05fr]">
          <div className="card p-6">
            <h2 className="mb-5 text-lg font-bold">Order progress</h2>
            <OrderTimeline status={order.status} events={order.events} />
          </div>

          <div className="space-y-6">
            <DeliveryRequestPanel avsNumber={order.avsNumber} />

            <div className="card p-6">
              <h3 className="text-lg font-bold">Your requests</h3>
              {order.deliveryRequests.length === 0 ? (
                <p className="mt-2 text-sm text-muted">
                  No requests yet. Your requests and our replies appear here.
                </p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {order.deliveryRequests.map((r) => (
                    <li key={r.id} className="rounded-xl border border-navy/10 bg-white p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-head text-[13px] font-bold text-navy">
                          {REQUEST_TYPE_LABEL[r.type] ?? r.type}
                        </span>
                        <span className="chip text-xs">
                          {REQUEST_STATUS_LABEL[r.status] ?? r.status}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-muted">
                        {r.requestedDate ? formatDate(r.requestedDate) : ""}
                        {r.requestedSlot ? ` · ${r.requestedSlot}` : ""}
                      </div>
                      {r.staffReply && (
                        <div className="mt-2 text-sm text-navy">AVS: {r.staffReply}</div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          For your privacy, this page shows only the order status and dates — no names,
          addresses, items or prices.
        </p>
      </div>
    </section>
  );
}
