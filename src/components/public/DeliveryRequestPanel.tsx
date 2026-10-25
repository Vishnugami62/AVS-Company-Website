"use client";

import { useState } from "react";
import { CalendarClock, Split, Zap, ShieldCheck, Loader2, CheckCircle2 } from "lucide-react";
import { TIME_SLOTS } from "@/lib/constants";
import { startDeliveryRequest, verifyDeliveryOtp } from "@/app/actions/delivery";
import { cn } from "@/lib/utils";

type ReqType = "SCHEDULE" | "PARTIAL" | "URGENT";
type Stage = "choose" | "otp" | "done";

const TYPES: { key: ReqType; icon: typeof CalendarClock; label: string; desc: string }[] = [
  { key: "SCHEDULE", icon: CalendarClock, label: "Schedule delivery", desc: "Pick a date and time slot that suits you." },
  { key: "PARTIAL", icon: Split, label: "Partial delivery", desc: "Need some items first? We can split the order." },
  { key: "URGENT", icon: Zap, label: "Urgent delivery", desc: "Need it sooner? Ask for priority dispatch." },
];

export function DeliveryRequestPanel({ avsNumber }: { avsNumber: string }) {
  const [type, setType] = useState<ReqType>("SCHEDULE");
  const [stage, setStage] = useState<Stage>("choose");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [details, setDetails] = useState("");
  const [note, setNote] = useState("");
  const [otpId, setOtpId] = useState("");
  const [emailHint, setEmailHint] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function start(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await startDeliveryRequest({
      avsNumber,
      type,
      requestedDate: date,
      requestedSlot: slot,
      details,
      customerNote: note,
    });
    setBusy(false);
    if (!res.ok) return setError(res.error);
    setOtpId(res.otpId);
    setEmailHint(res.emailHint);
    setStage("otp");
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await verifyDeliveryOtp({ otpId, code });
    setBusy(false);
    if (!res.ok) return setError(res.error);
    setStage("done");
  }

  if (stage === "done") {
    return (
      <div className="card p-6 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-whatsapp" />
        <h3 className="mt-3 text-xl font-bold">Request sent</h3>
        <p className="mt-2 text-sm text-muted">
          We&apos;ve emailed a confirmation to the address registered for this order. Our team
          will confirm shortly — you&apos;ll get an email either way.
        </p>
      </div>
    );
  }

  if (stage === "otp") {
    return (
      <form onSubmit={verify} className="card p-6">
        <div className="flex items-center gap-2 text-navy">
          <ShieldCheck className="h-5 w-5 text-gold" />
          <h3 className="text-lg font-bold">Verify it&apos;s you</h3>
        </div>
        <p className="mt-2 text-sm text-muted">
          We&apos;ve emailed a 6-digit code to <strong>{emailHint}</strong>. Enter it to send your
          request. Only someone with access to that inbox can change this order.
        </p>
        <input
          inputMode="numeric"
          pattern="\d{6}"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          placeholder="______"
          className="field mt-4 text-center text-2xl tracking-[0.5em]"
          aria-label="6-digit code"
          autoFocus
        />
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={busy || code.length !== 6} className="btn btn-gold mt-4 w-full">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & send request"}
        </button>
        <button
          type="button"
          onClick={() => {
            setStage("choose");
            setCode("");
            setError("");
          }}
          className="btn btn-ghost btn-sm mt-2 w-full"
        >
          Back
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={start} className="card p-6">
      <h3 className="text-lg font-bold">Request a delivery change</h3>
      <p className="mt-1 text-sm text-muted">
        Requests go straight to our team and are confirmed by email.
      </p>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {TYPES.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setType(t.key)}
            className={cn(
              "flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition",
              type === t.key
                ? "border-gold bg-gold/10 ring-1 ring-gold"
                : "border-navy/15 hover:border-navy/30",
            )}
          >
            <t.icon className="h-5 w-5 text-gold-text" />
            <span className="font-head text-[13px] font-bold text-navy">{t.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-4">
        {type === "PARTIAL" && (
          <div>
            <label className="field-label">What do you need first?</label>
            <textarea
              className="field min-h-20"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="e.g. Please send the A4 paper and pantry items first; the rest can follow."
            />
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label">
              {type === "URGENT" ? "Needed by" : "Preferred date"}
            </label>
            <input
              type="date"
              className="field"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          {type !== "URGENT" && (
            <div>
              <label className="field-label">Time slot</label>
              <select className="field" value={slot} onChange={(e) => setSlot(e.target.value)}>
                <option value="">Choose a slot</option>
                {TIME_SLOTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div>
          <label className="field-label">Note for our team (optional)</label>
          <input
            className="field"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={type === "URGENT" ? "e.g. Needed for a client meeting" : "e.g. Please call before arriving"}
          />
        </div>
      </div>

      <p className="mt-3 text-xs text-muted">
        For your security, we&apos;ll email a code to the address registered for this order before
        sending your request.
      </p>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={busy} className="btn btn-gold mt-4 w-full">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue — verify by email"}
      </button>
    </form>
  );
}
