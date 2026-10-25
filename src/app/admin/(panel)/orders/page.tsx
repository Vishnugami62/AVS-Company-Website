import Link from "next/link";
import { PlusCircle, Search } from "lucide-react";
import { prisma } from "@/lib/db";
import { StatusPill } from "@/components/admin/StatusPill";
import { RECEIVED_VIA_LABEL } from "@/lib/constants";
import { formatDate, formatDateTime, normalizeLookup } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const TABS = [
  { key: "all", label: "All" },
  { key: "open", label: "Open" },
  { key: "delivered", label: "Delivered" },
  { key: "hold", label: "On hold" },
];

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status = "all", q = "" } = await searchParams;

  const where: Record<string, unknown> = {};
  if (status === "open") where.status = { notIn: ["DELIVERED", "CANCELLED"] };
  else if (status === "delivered") where.status = "DELIVERED";
  else if (status === "hold") where.status = "ON_HOLD";

  if (q.trim()) {
    const norm = normalizeLookup(q);
    where.OR = [
      { avsNumber: { contains: norm } },
      { poNumber: { contains: q.trim() } },
      { customer: { company: { contains: q.trim() } } },
    ];
  }

  const orders = await prisma.order.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    include: { customer: true },
    take: 100,
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-navy">Orders</h1>
        <Link href="/admin/orders/new" className="btn btn-gold btn-sm">
          <PlusCircle className="h-4 w-4" /> New offline order
        </Link>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <Link
              key={t.key}
              href={`/admin/orders?status=${t.key}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              className={cn(
                "chip",
                status === t.key && "border-gold bg-gold/15 text-gold-text",
              )}
            >
              {t.label}
            </Link>
          ))}
        </div>
        <form className="relative" action="/admin/orders">
          <input type="hidden" name="status" value={status} />
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            name="q"
            defaultValue={q}
            className="field w-64 pl-9"
            placeholder="Search PO, AVS no. or customer"
          />
        </form>
      </div>

      <div className="mt-5 overflow-hidden rounded-card bg-paper shadow-soft">
        <div className="scroll-slim overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="bg-cream text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">AVS order no.</th>
                <th className="px-4 py-3">PO number</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Via</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Delivery date</th>
                <th className="px-4 py-3">Last update</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-muted">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted">Showing {orders.length} order(s).</p>
    </div>
  );
}
