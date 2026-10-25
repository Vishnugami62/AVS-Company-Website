"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import { updateSettings } from "@/app/actions/admin";
import { cn } from "@/lib/utils";

const FIELDS: { key: string; label: string; hint?: string }[] = [
  { key: "companyName", label: "Company name" },
  { key: "tagline", label: "Tagline" },
  { key: "phone", label: "Phone number" },
  { key: "whatsapp", label: "WhatsApp number", hint: "Digits only work best, e.g. 919812345678" },
  { key: "salesEmail", label: "Sales email" },
  { key: "ordersEmail", label: "Orders email" },
  { key: "address", label: "Office address" },
  { key: "city", label: "City / state" },
  { key: "pincode", label: "Pincode" },
  { key: "hours", label: "Working hours" },
  { key: "gstin", label: "GSTIN" },
  { key: "minOrder", label: "Minimum order value" },
  { key: "freeDeliveryThreshold", label: "Free delivery above" },
  { key: "foundedYear", label: "Founded year" },
];

export function SettingsForm({ initial }: { initial: Record<string, string> }) {
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const res = await updateSettings(values);
    setBusy(false);
    setMsg(
      res.ok
        ? { ok: true, text: "Saved. Your website now shows these details." }
        : { ok: false, text: res.error },
    );
  }

  return (
    <form onSubmit={submit} className="card max-w-3xl p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <div key={f.key} className={cn(["address", "tagline"].includes(f.key) && "sm:col-span-2")}>
            <label className="field-label">{f.label}</label>
            <input
              className="field"
              value={values[f.key] ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
            />
            {f.hint && <p className="mt-1 text-xs text-muted">{f.hint}</p>}
          </div>
        ))}
      </div>
      {msg && (
        <p className={cn("mt-4 text-sm", msg.ok ? "text-whatsapp" : "text-red-600")}>{msg.text}</p>
      )}
      <button type="submit" disabled={busy} className="btn btn-gold mt-5">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : (<><Save className="h-4 w-4" /> Save settings</>)}
      </button>
    </form>
  );
}
