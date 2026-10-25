"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  UploadCloud,
} from "lucide-react";
import { submitQuote } from "@/app/actions/quote";
import { readCart, clearCart } from "@/lib/quote-cart";
import { FREQUENCY, FREQUENCY_LABEL } from "@/lib/constants";
import { cn } from "@/lib/utils";

const CATEGORY_OPTIONS = [
  "Stationery",
  "Housekeeping",
  "Pantry",
  "Corporate Gifting",
  "Printing",
  "Facility & Bulk",
];

export function QuoteWizard() {
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [ref, setRef] = useState<string | null>(null);

  const [categories, setCategories] = useState<string[]>([]);
  const [listText, setListText] = useState("");
  const [fileName, setFileName] = useState("");
  const [frequency, setFrequency] = useState<string>("");
  const [deliveryLocations, setDeliveryLocations] = useState("");
  const [requiredBy, setRequiredBy] = useState("");
  const [budget, setBudget] = useState("");
  const [customPrint, setCustomPrint] = useState(false);
  const [separateInvoice, setSeparateInvoice] = useState(false);
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gstin, setGstin] = useState("");
  const [hearAbout, setHearAbout] = useState("");
  const [whatsappOptin, setWhatsappOptin] = useState(false);
  const [emailOptin, setEmailOptin] = useState(false);

  // Prefill the list from the visitor's "Add to quote" selections, if any.
  useEffect(() => {
    const cart = readCart();
    if (cart.length > 0) {
      setListText((prev) =>
        prev
          ? prev
          : cart.map((i) => `${i.name} — ${i.qty}${i.pack ? ` (${i.pack})` : ""}`).join("\n"),
      );
    }
  }, []);

  function toggleCategory(c: string) {
    setCategories((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  }

  async function submit() {
    setBusy(true);
    setError("");
    const note = fileName ? `${listText}\n[Attached list: ${fileName}]` : listText;
    const res = await submitQuote({
      categories,
      listText: note,
      frequency: frequency || undefined,
      deliveryLocations,
      requiredBy,
      budget,
      customPrint,
      separateInvoice,
      fullName,
      company,
      email,
      phone,
      gstin,
      hearAbout,
      whatsappOptin,
      emailOptin,
    });
    setBusy(false);
    if (!res.ok) return setError(res.error);
    clearCart();
    setRef(res.ref);
  }

  if (ref) {
    return (
      <div className="card p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-whatsapp" />
        <h2 className="mt-4 text-2xl font-bold">Thank you — your quote is on its way</h2>
        <p className="mx-auto mt-2 max-w-md text-muted">
          We&apos;ve received request <strong className="text-navy">{ref}</strong>. Our team will
          send your itemised quote within 24 hours by email and WhatsApp.
        </p>
        <div className="mx-auto mt-6 grid max-w-lg gap-3 text-left sm:grid-cols-3">
          {[
            ["We review your list", "Today"],
            ["You get your quote", "Within 24 hours"],
            ["We deliver & invoice", "1–2 working days"],
          ].map(([t, w]) => (
            <div key={t} className="rounded-xl bg-cream p-4">
              <div className="font-head text-sm font-bold text-navy">{t}</div>
              <div className="mt-1 text-xs text-muted">{w}</div>
            </div>
          ))}
        </div>
        <a href="/" className="btn btn-outline mt-6">
          Back to home
        </a>
      </div>
    );
  }

  const steps = ["What you need", "Quantity & delivery", "Your details"];

  return (
    <div className="card p-6 sm:p-8">
      {/* Stepper */}
      <div className="flex items-center gap-2">
        {steps.map((label, i) => {
          const n = i + 1;
          return (
            <div key={label} className="flex flex-1 items-center gap-2">
              <span
                className={cn(
                  "grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-bold",
                  step >= n ? "bg-gold text-navy-deep" : "border border-navy/15 text-muted",
                )}
              >
                {n}
              </span>
              <span
                className={cn(
                  "hidden text-[13px] font-semibold sm:block",
                  step >= n ? "text-navy" : "text-muted",
                )}
              >
                {label}
              </span>
              {i < steps.length - 1 && <span className="h-px flex-1 bg-navy/10" />}
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-muted">Step {step} of 3</p>

      <div className="mt-6">
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="field-label">Which categories do you need?</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_OPTIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleCategory(c)}
                    className={cn(
                      "chip transition",
                      categories.includes(c) && "border-gold bg-gold/15 text-gold-text",
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="field-label">Your list</label>
              <textarea
                className="field min-h-28"
                value={listText}
                onChange={(e) => setListText(e.target.value)}
                placeholder="e.g. A4 paper – 20 reams · Blue ball pens – 10 boxes · Green tea – 5 packs · Floor cleaner – 10 L"
              />
            </div>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-card border border-dashed border-navy/25 bg-cream/60 px-4 py-6 text-sm text-muted transition hover:border-gold">
              <UploadCloud className="h-5 w-5 text-gold" />
              {fileName ? (
                <span className="text-navy">{fileName}</span>
              ) : (
                <span>Attach your Excel, PDF or a photo of your list (optional)</span>
              )}
              <input
                type="file"
                className="hidden"
                accept=".xlsx,.csv,.pdf,.jpg,.jpeg,.png"
                onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
              />
            </label>
            <div className="flex justify-end">
              <button className="btn btn-gold" onClick={() => setStep(2)}>
                Next: Quantity &amp; delivery <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="field-label">How often do you need these?</label>
              <div className="flex flex-wrap gap-2">
                {FREQUENCY.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFrequency(f)}
                    className={cn(
                      "chip transition",
                      frequency === f && "border-gold bg-gold/15 text-gold-text",
                    )}
                  >
                    {FREQUENCY_LABEL[f]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="field-label">Delivery location(s)</label>
              <input
                className="field"
                value={deliveryLocations}
                onChange={(e) => setDeliveryLocations(e.target.value)}
                placeholder="e.g. Andheri East, Mumbai 400093"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="field-label">Required by</label>
                <input type="date" className="field" value={requiredBy} onChange={(e) => setRequiredBy(e.target.value)} />
              </div>
              <div>
                <label className="field-label">Approx. budget (optional)</label>
                <input className="field" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="e.g. 25,000" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-ink">
                <input type="checkbox" checked={customPrint} onChange={(e) => setCustomPrint(e.target.checked)} />
                I need branded or custom-printed items
              </label>
              <label className="flex items-center gap-2 text-sm text-ink">
                <input type="checkbox" checked={separateInvoice} onChange={(e) => setSeparateInvoice(e.target.checked)} />
                Send the GST invoice to a different address
              </label>
            </div>
            <div className="flex justify-between">
              <button className="btn btn-ghost" onClick={() => setStep(1)}>
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button className="btn btn-gold" onClick={() => setStep(3)}>
                Next: Your details <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="field-label">Full name *</label>
                <input className="field" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Priya Sharma" />
              </div>
              <div>
                <label className="field-label">Company name *</label>
                <input className="field" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Company Pvt Ltd" />
              </div>
              <div>
                <label className="field-label">Work email *</label>
                <input type="email" className="field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" />
              </div>
              <div>
                <label className="field-label">Phone / WhatsApp *</label>
                <input className="field" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98XXX XXXXX" />
              </div>
              <div>
                <label className="field-label">GSTIN (optional)</label>
                <input className="field" value={gstin} onChange={(e) => setGstin(e.target.value)} placeholder="e.g. 27ABCDE1234F1Z5" />
              </div>
              <div>
                <label className="field-label">How did you hear about us?</label>
                <select className="field" value={hearAbout} onChange={(e) => setHearAbout(e.target.value)}>
                  <option value="">Select an option</option>
                  <option>Search / Google</option>
                  <option>Referral</option>
                  <option>WhatsApp</option>
                  <option>Social media</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-ink">
                <input type="checkbox" checked={whatsappOptin} onChange={(e) => setWhatsappOptin(e.target.checked)} />
                Send me quote updates on WhatsApp
              </label>
              <label className="flex items-center gap-2 text-sm text-ink">
                <input type="checkbox" checked={emailOptin} onChange={(e) => setEmailOptin(e.target.checked)} />
                Email me monthly offers (optional)
              </label>
            </div>
            <p className="text-xs text-muted">
              We use your details only to prepare and send your quote.
            </p>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex justify-between">
              <button className="btn btn-ghost" onClick={() => setStep(2)} disabled={busy}>
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <button className="btn btn-gold" onClick={submit} disabled={busy}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send my quote request"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
