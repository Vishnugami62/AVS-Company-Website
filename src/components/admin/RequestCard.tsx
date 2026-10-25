"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, ShieldCheck, X } from "lucide-react";
import { respondDeliveryRequest } from "@/app/actions/admin";
import { REQUEST_TYPE_LABEL, REQUEST_STATUS_LABEL, TIME_SLOTS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export type RequestView = {
  id: string;
  type: string;
  status: string;
  avsNumber: string;
  poNumber: string | null;
  company: string;
  requestedWhen: string;
  details: string | null;
  customerNote: string | null;
  emailVerified: boolean;
  receivedAt: string;
};

export function RequestCard({ req }: { req: RequestView }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [suggestedDate, setSuggestedDate] = useState("");
  const [suggestedSlot, setSuggestedSlot] = useState("");
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");

  const waiting = req.status === "WAITING";

  async function respond(decision: "APPROVE" | "DECLINE" | "SUGGEST") {
    if (decision === "SUGGEST" && !suggesting) {
      setSuggesting(true);
      return;
    }
    setBusy(true);
    setError("");
    const res = await respondDeliveryRequest({
      requestId: req.id,
      decision,
      suggestedDate: decision === "SUGGEST" ? suggestedDate : undefined,
      suggestedSlot: decision === "SUGGEST" ? suggestedSlot : undefined,
      reply,
    });
    setBusy(false);
    if (!res.ok) return setError(res.error);
    router.refresh();
  }

  return (
    <div className="card p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="font-head text-base font-bold text-navy">
            {REQUEST_TYPE_LABEL[req.type] ?? req.type}
          </h3>
          <span
            className={cn(
              "rounded-pill px-2.5 py-0.5 text-xs font-semibold",
              waiting ? "bg-gold/20 text-gold-text" : "bg-green-100 text-green-800",
            )}
          >
            {REQUEST_STATUS_LABEL[req.status]}
          </span>
        </div>
        {req.emailVerified && (
          <span className="flex items-center gap-1 text-xs text-whatsapp">
            <ShieldCheck className="h-3.5 w-3.5" /> Email verified
          </span>
        )}
      </div>

      <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <span className="text-muted">Order</span>{" "}
          <span className="font-semibold text-navy">{req.avsNumber}</span>
          <span className="text-muted"> · PO {req.poNumber ?? "—"}</span>
        </div>
        <div>
          <span className="text-muted">Customer</span>{" "}
          <span className="font-semibold text-navy">{req.company}</span>
        </div>
        <div>
          <span className="text-muted">Requested</span>{" "}
          <span className="font-semibold text-navy">{req.requestedWhen}</span>
        </div>
        <div>
          <span className="text-muted">Received</span> {req.receivedAt}
        </div>
      </div>

      {(req.details || req.customerNote) && (
        <div className="mt-3 rounded-xl bg-cream p-3 text-sm text-ink">
          {req.details && <div>{req.details}</div>}
          {req.customerNote && <div className="text-muted">Note: “{req.customerNote}”</div>}
        </div>
      )}

      {waiting && (
        <>
          {suggesting && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input
                type="date"
                className="field"
                value={suggestedDate}
                onChange={(e) => setSuggestedDate(e.target.value)}
              />
              <select className="field" value={suggestedSlot} onChange={(e) => setSuggestedSlot(e.target.value)}>
                <option value="">Choose a slot</option>
                {TIME_SLOTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          )}
          <input
            className="field mt-3"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Optional note to the customer"
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={() => respond("APPROVE")} disabled={busy} className="btn btn-gold btn-sm">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : (<><Check className="h-4 w-4" /> Approve</>)}
            </button>
            <button onClick={() => respond("SUGGEST")} disabled={busy} className="btn btn-outline btn-sm">
              {suggesting ? "Send suggested slot" : "Suggest another slot"}
            </button>
            <button onClick={() => respond("DECLINE")} disabled={busy} className="btn btn-ghost btn-sm text-red-600">
              <X className="h-4 w-4" /> Decline
            </button>
          </div>
        </>
      )}
    </div>
  );
}
