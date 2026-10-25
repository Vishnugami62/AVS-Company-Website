import { OfflineOrderForm } from "@/components/admin/OfflineOrderForm";

export const dynamic = "force-dynamic";

const STEPS = [
  ["AVS order number is created", "Unique for every order, online or offline."],
  ["The customer gets an email", "With their AVS order number and a tracking link — even if they ordered by phone."],
  ["It appears on Track Order", "Customers see only the PO number, status and dates."],
  ["Update the status as you go", "Each update can email the customer automatically."],
];

export default function NewOfflineOrderPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">New offline order</h1>
      <p className="mt-1 text-muted">
        Log an order received by phone, WhatsApp, email or in person — the customer gets a tracking
        link automatically.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <OfflineOrderForm />
        <aside className="card h-fit p-6">
          <h2 className="font-head text-xs font-bold uppercase tracking-[0.16em] text-gold-text">
            When you save
          </h2>
          <ol className="mt-4 space-y-4">
            {STEPS.map(([t, d], i) => (
              <li key={t} className="flex gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold-gradient text-xs font-bold text-navy-deep">
                  {i + 1}
                </span>
                <div>
                  <div className="text-sm font-semibold text-navy">{t}</div>
                  <div className="text-xs text-muted">{d}</div>
                </div>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </div>
  );
}
