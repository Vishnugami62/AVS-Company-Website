import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";
import { prisma } from "@/lib/db";
import { StatusUpdateForm } from "@/components/admin/StatusUpdateForm";
import { StatusPill } from "@/components/admin/StatusPill";
import { OrderTimeline } from "@/components/public/OrderTimeline";
import { RECEIVED_VIA_LABEL, REQUEST_TYPE_LABEL, REQUEST_STATUS_LABEL } from "@/lib/constants";
import { formatDate, formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-muted">{label}</div>
      <div className="mt-0.5 text-sm font-semibold text-navy">{children}</div>
    </div>
  );
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      customer: true,
      events: { orderBy: { createdAt: "asc" } },
      activityLogs: { orderBy: { createdAt: "desc" }, include: { staff: true } },
      deliveryRequests: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!order) notFound();

  const expectedInput = order.expectedDate
    ? new Date(order.expectedDate).toISOString().slice(0, 10)
    : null;

  return (
    <div>
      <Link href="/admin/orders" className="link-arrow">
        <ArrowLeft className="h-4 w-4" /> All orders
      </Link>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-navy">Order {order.avsNumber}</h1>
        <StatusPill status={order.status} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        {/* Left: details + activity */}
        <div className="space-y-6">
          <div className="card p-6">
            <div className="mb-4 flex items-center gap-2">
              <h2 className="text-lg font-bold text-navy">Order details</h2>
              <span className="rounded-pill bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase text-red-700">
                Staff only
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Detail label="Customer">{order.customer.company}</Detail>
              <Detail label="Contact">
                {order.customer.contactName ?? "—"}
                <div className="font-normal text-muted">
                  {order.customer.email ?? ""} {order.customer.phone ? `· ${order.customer.phone}` : ""}
                </div>
              </Detail>
              <Detail label="Deliver to">{order.deliveryAddress ?? "—"}</Detail>
              <Detail label="Customer PO">{order.poNumber ?? "—"}</Detail>
              <Detail label="Received via">{RECEIVED_VIA_LABEL[order.receivedVia]}</Detail>
              <Detail label="Tracking email">{order.trackingEmail}</Detail>
            </div>
            {order.itemsSummary && (
              <div className="mt-4 rounded-xl bg-cream p-4 text-sm text-ink">
                <div className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase text-muted">
                  <FileText className="h-3.5 w-3.5" /> Items
                </div>
                {order.itemsSummary}
              </div>
            )}
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-bold text-navy">Activity log</h2>
            <ol className="mt-4 space-y-3">
              {order.activityLogs.map((log) => (
                <li key={log.id} className="border-l-2 border-gold/40 pl-4">
                  <div className="text-sm font-semibold text-navy">{log.action}</div>
                  <div className="text-xs text-muted">
                    {formatDateTime(log.createdAt)} ·{" "}
                    {log.actorType === "SYSTEM" ? "automatic" : (log.staff?.name ?? "staff")}
                  </div>
                  {log.detail && <div className="mt-0.5 text-xs text-muted">{log.detail}</div>}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Right: timeline + update + requests */}
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="mb-5 text-lg font-bold text-navy">Customer-facing progress</h2>
            <OrderTimeline status={order.status} events={order.events} />
          </div>

          <StatusUpdateForm
            orderId={order.id}
            currentStatus={order.status}
            expectedDate={expectedInput}
          />

          {order.deliveryRequests.length > 0 && (
            <div className="card p-6">
              <h2 className="text-lg font-bold text-navy">Delivery requests</h2>
              <ul className="mt-4 space-y-3">
                {order.deliveryRequests.map((r) => (
                  <li key={r.id} className="rounded-xl border border-navy/10 p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-head text-sm font-bold text-navy">
                        {REQUEST_TYPE_LABEL[r.type] ?? r.type}
                      </span>
                      <span className="chip text-xs">{REQUEST_STATUS_LABEL[r.status]}</span>
                    </div>
                    <div className="mt-1 text-sm text-muted">
                      {r.requestedDate ? formatDate(r.requestedDate) : ""}
                      {r.requestedSlot ? ` · ${r.requestedSlot}` : ""}
                    </div>
                    {r.customerNote && (
                      <div className="mt-1 text-xs text-muted">Note: {r.customerNote}</div>
                    )}
                  </li>
                ))}
              </ul>
              <Link href="/admin/requests" className="link-arrow mt-4">
                Manage requests
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
