"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { createOfflineOrder } from "@/app/actions/admin";
import { RECEIVED_VIA, RECEIVED_VIA_LABEL, DELIVERY_TYPE, DELIVERY_TYPE_LABEL } from "@/lib/constants";
import { cn } from "@/lib/utils";

const OFFLINE_VIA = RECEIVED_VIA.filter((v) => v !== "WEBSITE");

export function OfflineOrderForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    receivedVia: "PHONE",
    company: "",
    contactName: "",
    trackingEmail: "",
    phone: "",
    poNumber: "",
    expectedDate: "",
    deliveryAddress: "",
    deliveryType: "STANDARD",
    itemsSummary: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState<string | null>(null);

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await createOfflineOrder(form);
    setBusy(false);
    if (!res.ok) return setError(res.error);
    setCreated(res.data?.avsNumber ?? null);
    router.refresh();
  }

  if (created) {
    return (
      <div className="card p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-whatsapp" />
        <h2 className="mt-3 text-xl font-bold text-navy">Order created</h2>
        <p className="mt-2 text-muted">
          AVS order number <strong className="text-navy">{created}</strong> was created and a
          tracking email was sent to the customer.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/admin/orders" className="btn btn-gold">
            View orders
          </Link>
          <button
            className="btn btn-outline"
            onClick={() => {
              setCreated(null);
              setForm({
                receivedVia: "PHONE", company: "", contactName: "", trackingEmail: "",
                phone: "", poNumber: "", expectedDate: "", deliveryAddress: "",
                deliveryType: "STANDARD", itemsSummary: "",
              });
            }}
          >
            Create another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card p-6 sm:p-8">
      <div>
        <label className="field-label">Order received via *</label>
        <div className="flex flex-wrap gap-2">
          {OFFLINE_VIA.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => set("receivedVia", v)}
              className={cn("chip", form.receivedVia === v && "border-gold bg-gold/15 text-gold-text")}
            >
              {RECEIVED_VIA_LABEL[v]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label">Customer company *</label>
          <input className="field" value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Company name" />
        </div>
        <div>
          <label className="field-label">Contact name</label>
          <input className="field" value={form.contactName} onChange={(e) => set("contactName", e.target.value)} placeholder="Contact person" />
        </div>
        <div>
          <label className="field-label">Email for tracking updates *</label>
          <input type="email" className="field" value={form.trackingEmail} onChange={(e) => set("trackingEmail", e.target.value)} placeholder="name@company.com" />
        </div>
        <div>
          <label className="field-label">Phone / WhatsApp</label>
          <input className="field" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 98XXX XXXXX" />
        </div>
        <div>
          <label className="field-label">Customer PO number</label>
          <input className="field" value={form.poNumber} onChange={(e) => set("poNumber", e.target.value)} placeholder="e.g. PO-4500012345" />
        </div>
        <div>
          <label className="field-label">Expected delivery</label>
          <input type="date" className="field" value={form.expectedDate} onChange={(e) => set("expectedDate", e.target.value)} />
        </div>
      </div>

      <div className="mt-4">
        <label className="field-label">Delivery address *</label>
        <input className="field" value={form.deliveryAddress} onChange={(e) => set("deliveryAddress", e.target.value)} placeholder="Office address, floor, landmark" />
      </div>

      <div className="mt-4">
        <label className="field-label">Delivery type</label>
        <div className="flex flex-wrap gap-2">
          {DELIVERY_TYPE.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => set("deliveryType", t)}
              className={cn("chip", form.deliveryType === t && "border-gold bg-gold/15 text-gold-text")}
            >
              {DELIVERY_TYPE_LABEL[t].replace(" delivery", "")}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <label className="field-label">Items / notes</label>
        <textarea className="field min-h-20" value={form.itemsSummary} onChange={(e) => set("itemsSummary", e.target.value)} placeholder="Item list or a short summary of the order" />
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={busy} className="btn btn-gold mt-5">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create order & email tracking details"}
      </button>
    </form>
  );
}
