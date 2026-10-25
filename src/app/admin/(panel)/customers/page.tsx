import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Customers</h1>
      <p className="mt-1 text-muted">Companies that have ordered or requested a quote.</p>

      <div className="mt-6 overflow-hidden rounded-card bg-paper shadow-soft">
        <div className="scroll-slim overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead className="bg-cream text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Orders</th>
                <th className="px-4 py-3">Added</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-muted">
                    No customers yet.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="border-t border-black/5 hover:bg-cream/50">
                    <td className="px-4 py-3 font-semibold text-navy">{c.company}</td>
                    <td className="px-4 py-3 text-muted">{c.contactName ?? "—"}</td>
                    <td className="px-4 py-3 text-muted">{c.email ?? "—"}</td>
                    <td className="px-4 py-3 text-muted">{c.phone ?? "—"}</td>
                    <td className="px-4 py-3">{c._count.orders}</td>
                    <td className="px-4 py-3 text-xs text-muted">{formatDate(c.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
