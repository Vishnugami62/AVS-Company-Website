"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import { updateOrderStatus } from "@/app/actions/admin";
import { STATUS_FLOW, STATUS_LABEL, ORDER_STATUS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const EXTRA = [ORDER_STATUS.PARTIALLY_DELIVERED, ORDER_STATUS.ON_HOLD, ORDER_STATUS.CANCELLED];

export function StatusUpdateForm({
  orderId,
  currentStatus,
  expectedDate,
}: {
  orderId: string;
  currentStatus: string;
  expectedDate: string | null;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [expected, setExpected] = useState(expectedDate ?? "");
  const [note, setNote] = useState("");
  const [emailCustomer, setEmailCustomer] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function save() {
    setBusy(true);
    setMsg(null);
    const res = await updateOrderStatus({
      orderId,
      status,
      expectedDate: expected,
      internalNote: note,
      emailCustomer,
    });
    setBusy(false);
    if (!res.ok) return setMsg({ ok: false, text: res.error });
    setMsg({ ok: true, text: "Order updated. The website now shows the new status." });
    setNote("");
    router.refresh();
  }

  return (
    <div className="card p-6">
      <h2 className="text-lg font-bold text-navy">Update status</h2>

      <div className="mt-4">
        <label className="field-label">New status</label>
        <div className="flex flex-wrap gap-2">
          {[...STATUS_FLOW, ...EXTRA].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={cn(
                "chip",
                status === s && "border-gold bg-gold/15 text-gold-text",
              )}
            >
              {STATUS_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <label className="field-label">Expected delivery</label>
        <input
          type="date"
          className="field"
          value={expected}
          onChange={(e) => setExpected(e.target.value)}
        />
      </div>

      <div className="mt-4">
        <label className="field-label">Internal note — staff only, never shown to the customer</label>
        <textarea
          className="field min-h-20"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Packed in 3 cartons, van booked for 10 am"
        />
      </div>

      <label className="mt-4 flex items-center gap-2 text-sm text-ink">
        <input
          type="checkbox"
          checked={emailCustomer}
          onChange={(e) => setEmailCustomer(e.target.checked)}
        />
        Email the customer about this update
      </label>

      {msg && (
        <p className={cn("mt-3 text-sm", msg.ok ? "text-whatsapp" : "text-red-600")}>{msg.text}</p>
      )}

      <button onClick={save} disabled={busy} className="btn btn-gold mt-5 w-full">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : (<><Save className="h-4 w-4" /> Save &amp; update website</>)}
      </button>
      <p className="mt-3 text-center text-xs text-muted">
        Customer sees only: PO number, AVS order no., status and dates.
      </p>
    </div>
  );
}
