import Link from "next/link";
import { prisma } from "@/lib/db";
import { RequestCard, type RequestView } from "@/components/admin/RequestCard";
import { formatDate, formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const TABS = [
  { key: "waiting", label: "Waiting" },
  { key: "all", label: "All" },
  { key: "done", label: "Done" },
];

function whenText(type: string, date: Date | null, slot: string | null): string {
  if (type === "URGENT") return date ? `by ${formatDate(date)}` : "as soon as possible";
  if (date) return `${formatDate(date)}${slot ? ` · ${slot}` : ""}`;
  return slot ?? "—";
}

export default async function RequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab = "waiting" } = await searchParams;
  const where =
    tab === "waiting"
      ? { status: "WAITING" }
      : tab === "done"
        ? { status: { not: "WAITING" } }
        : {};

  const requests = await prisma.deliveryRequest.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { order: { include: { customer: true } } },
  });

  const views: RequestView[] = requests.map((r) => ({
    id: r.id,
    type: r.type,
    status: r.status,
    avsNumber: r.order.avsNumber,
    poNumber: r.order.poNumber,
    company: r.order.customer.company,
    requestedWhen: whenText(r.type, r.requestedDate, r.requestedSlot),
    details: r.details,
    customerNote: r.customerNote,
    emailVerified: r.emailVerified,
    receivedAt: formatDateTime(r.createdAt),
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Delivery requests</h1>
      <p className="mt-1 text-muted">
        Requests arrive only after the customer passes the email code check.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={`/admin/requests?tab=${t.key}`}
            className={cn("chip", tab === t.key && "border-gold bg-gold/15 text-gold-text")}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {views.length === 0 ? (
          <div className="card p-10 text-center text-muted lg:col-span-2">
            No requests here.
          </div>
        ) : (
          views.map((v) => <RequestCard key={v.id} req={v} />)
        )}
      </div>
    </div>
  );
}
