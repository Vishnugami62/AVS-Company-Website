import Link from "next/link";
import { ArrowRight, PlusCircle } from "lucide-react";
import { prisma } from "@/lib/db";
import { StatusPill } from "@/components/admin/StatusPill";
import { RECEIVED_VIA_LABEL } from "@/lib/constants";
import { formatDate, formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [open, arranging, packing, outForDelivery, waiting, recent] = await Promise.all([
    prisma.order.count({ where: { status: { notIn: ["DELIVERED", "CANCELLED"] } } }),
    prisma.order.count({ where: { status: "ARRANGING" } }),
    prisma.order.count({ where: { status: "PACKING" } }),
    prisma.order.count({ where: { status: "OUT_FOR_DELIVERY" } }),
    prisma.deliveryRequest.count({ where: { status: "WAITING" } }),
    prisma.order.findMany({
      take: 6,
      orderBy: { updatedAt: "desc" },
      include: { customer: true },
    }),
  ]);

  const stats = [
    { label: "Open orders", value: open, href: "/admin/orders" },
    { label: "Being arranged", value: arranging, href: "/admin/orders" },
    { label: "Being packed", value: packing, href: "/admin/orders" },
    { label: "Out for delivery", value: outForDelivery, href: "/admin/orders" },
    { label: "Requests waiting", value: waiting, href: "/admin/requests" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-navy">Dashboard</h1>
        <Link href="/admin/orders/new" className="btn btn-gold btn-sm">
          <PlusCircle className="h-4 w-4" /> New offline order
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-card bg-paper p-5 shadow-soft transition hover:shadow-card"
          >
            <div className="font-head text-3xl font-bold text-navy">{s.value}</div>
            <div className="mt-1 text-xs text-muted">{s.label}</div>
          </Link>
        ))}
      </div>

      {waiting > 0 && (
        <Link
          href="/admin/requests"
          className="mt-6 flex items-center justify-between rounded-card border border-gold/40 bg-gold/10 px-5 py-4 transition hover:bg-gold/15"
        >
          <span className="text-sm font-semibold text-gold-text">
            {waiting} delivery request{waiting > 1 ? "s" : ""} waiting for your response
          </span>
          <ArrowRight className="h-4 w-4 text-gold-text" />
        </Link>
      )}

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-navy">Recent orders</h2>
          <Link href="/admin/orders" className="link-arrow">
            View all
          </Link>
        </div>
        <div className="overflow-hidden rounded-card bg-paper shadow-soft">
          <div className="scroll-slim overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-cream text-left text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3">AVS order no.</th>
                  <th className="px-4 py-3">PO number</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Via</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Delivery</th>
                  <th className="px-4 py-3">Updated</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((o) => (
                  <tr key={o.id} className="border-t border-black/5 hover:bg-cream/50">
                    <td className="px-4 py-3">
                      <Link href={`/admin/orders/${o.id}`} className="font-semibold text-navy hover:text-gold-text">
                        {o.avsNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted">{o.poNumber ?? "—"}</td>
                    <td className="px-4 py-3">{o.customer.company}</td>
                    <td className="px-4 py-3 text-muted">{RECEIVED_VIA_LABEL[o.receivedVia]}</td>
                    <td className="px-4 py-3"><StatusPill status={o.status} /></td>
                    <td className="px-4 py-3 text-muted">{formatDate(o.expectedDate)}</td>
                    <td className="px-4 py-3 text-xs text-muted">{formatDateTime(o.updatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
