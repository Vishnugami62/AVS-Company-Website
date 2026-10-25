"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { submitContact } from "@/app/actions/contact";

const INTERESTS = [
  "Office stationery",
  "Housekeeping",
  "Pantry supplies",
  "Corporate gifting",
  "Printing",
  "Facility & bulk",
  "Something else",
];

export function ContactForm() {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    interest: "",
    message: "",
  });

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await submitContact(form);
    setBusy(false);
    if (!res.ok) return setError(res.error);
    setDone(true);
  }

  if (done) {
    return (
      <div className="card p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-whatsapp" />
        <h3 className="mt-3 text-xl font-bold">Thanks — we&apos;ve got your message</h3>
        <p className="mt-2 text-muted">We&apos;ll get back to you within 2 working hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card p-6 sm:p-8">
      <h2 className="text-xl font-bold">Send us a message</h2>
      <p className="mt-1 text-sm text-muted">We&apos;ll get back to you within 2 working hours.</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label">Name *</label>
          <input className="field" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your name" />
        </div>
        <div>
          <label className="field-label">Company</label>
          <input className="field" value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Company name" />
        </div>
        <div>
          <label className="field-label">Email *</label>
          <input type="email" className="field" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="name@company.com" />
        </div>
        <div>
          <label className="field-label">Phone *</label>
          <input className="field" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 98XXX XXXXX" />
        </div>
      </div>
      <div className="mt-4">
        <label className="field-label">I&apos;m interested in</label>
        <select className="field" value={form.interest} onChange={(e) => set("interest", e.target.value)}>
          <option value="">Select an option</option>
          {INTERESTS.map((i) => (
            <option key={i}>{i}</option>
          ))}
        </select>
      </div>
      <div className="mt-4">
        <label className="field-label">Message *</label>
        <textarea className="field min-h-28" value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="Tell us what you need…" />
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={busy} className="btn btn-gold mt-5">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send message"}
      </button>
      <p className="mt-3 text-xs text-muted">Your details are used only to reply to you.</p>
    </form>
  );
}
