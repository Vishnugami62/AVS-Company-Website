"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { saveProduct } from "@/app/actions/products";

type Category = { id: string; name: string };
type SlabInit = { minQty: number; maxQty: number | null; pricePerUnit: number | null; savingsLabel: string | null };
type SlabRow = { minQty: string; maxQty: string; pricePerUnit: string; savingsLabel: string };
type ProductInit = {
  id: string;
  name: string;
  sku: string;
  categoryId: string;
  shortDesc: string | null;
  description: string | null;
  packInfo: string | null;
  unit: string | null;
  moq: string | null;
  hsnCode: string | null;
  gstRate: number | null;
  badge: string | null;
  priceOnRequest: boolean;
  imageUrl: string | null;
  active: boolean;
  sortOrder: number;
  slabs?: SlabInit[];
};

function toRows(slabs?: SlabInit[]): SlabRow[] {
  if (!slabs || slabs.length === 0) return [{ minQty: "1", maxQty: "", pricePerUnit: "", savingsLabel: "" }];
  return slabs.map((s) => ({
    minQty: String(s.minQty),
    maxQty: s.maxQty != null ? String(s.maxQty) : "",
    pricePerUnit: s.pricePerUnit != null ? String(s.pricePerUnit) : "",
    savingsLabel: s.savingsLabel ?? "",
  }));
}

export function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: ProductInit;
}) {
  const [slabs, setSlabs] = useState<SlabRow[]>(toRows(product?.slabs));

  function updateSlab(i: number, key: keyof SlabRow, value: string) {
    setSlabs((rows) => rows.map((r, idx) => (idx === i ? { ...r, [key]: value } : r)));
  }
  function addSlab() {
    setSlabs((rows) => [...rows, { minQty: "", maxQty: "", pricePerUnit: "", savingsLabel: "" }]);
  }
  function removeSlab(i: number) {
    setSlabs((rows) => (rows.length <= 1 ? rows : rows.filter((_, idx) => idx !== i)));
  }
  const router = useRouter();
  const [form, setForm] = useState({
    name: product?.name ?? "",
    sku: product?.sku ?? "",
    categoryId: product?.categoryId ?? categories[0]?.id ?? "",
    shortDesc: product?.shortDesc ?? "",
    description: product?.description ?? "",
    packInfo: product?.packInfo ?? "",
    unit: product?.unit ?? "",
    moq: product?.moq ?? "",
    hsnCode: product?.hsnCode ?? "",
    gstRate: product?.gstRate != null ? String(product.gstRate) : "",
    badge: product?.badge ?? "",
    priceOnRequest: product?.priceOnRequest ?? true,
    imageUrl: product?.imageUrl ?? "",
    active: product?.active ?? true,
    sortOrder: product?.sortOrder != null ? String(product.sortOrder) : "0",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof typeof form>(k: K, v: string | boolean) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await saveProduct(
      {
        ...form,
        gstRate: form.gstRate === "" ? undefined : Number(form.gstRate),
        sortOrder: Number(form.sortOrder) || 0,
        slabs: slabs
          .filter((r) => r.minQty.trim() !== "")
          .map((r) => ({
            minQty: Number(r.minQty),
            maxQty: r.maxQty.trim() === "" ? null : Number(r.maxQty),
            pricePerUnit: r.pricePerUnit.trim() === "" ? null : Number(r.pricePerUnit),
            savingsLabel: r.savingsLabel.trim(),
          })),
      },
      product?.id,
    );
    setBusy(false);
    if (!res.ok) return setError(res.error);
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card max-w-3xl p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="field-label">Product name *</label>
          <input className="field" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. A4 Copier Paper, 75 GSM" />
        </div>
        <div>
          <label className="field-label">SKU *</label>
          <input className="field" value={form.sku} onChange={(e) => set("sku", e.target.value)} placeholder="e.g. AVS-ST-0101" />
        </div>
        <div>
          <label className="field-label">Category *</label>
          <select className="field" value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="field-label">Short description</label>
          <input className="field" value={form.shortDesc} onChange={(e) => set("shortDesc", e.target.value)} placeholder="e.g. Ream of 500 · MOQ 10" />
        </div>
        <div className="sm:col-span-2">
          <label className="field-label">Full description</label>
          <textarea className="field min-h-24" value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="A longer description shown on the product page." />
        </div>
        <div>
          <label className="field-label">Pack info</label>
          <input className="field" value={form.packInfo} onChange={(e) => set("packInfo", e.target.value)} placeholder="e.g. Ream of 500 · MOQ 10" />
        </div>
        <div>
          <label className="field-label">Unit</label>
          <input className="field" value={form.unit} onChange={(e) => set("unit", e.target.value)} placeholder="e.g. ream, box" />
        </div>
        <div>
          <label className="field-label">Minimum order qty (MOQ)</label>
          <input className="field" value={form.moq} onChange={(e) => set("moq", e.target.value)} placeholder="e.g. 10 reams" />
        </div>
        <div>
          <label className="field-label">HSN code</label>
          <input className="field" value={form.hsnCode} onChange={(e) => set("hsnCode", e.target.value)} placeholder="e.g. 4802" />
        </div>
        <div>
          <label className="field-label">GST rate (%)</label>
          <input className="field" inputMode="numeric" value={form.gstRate} onChange={(e) => set("gstRate", e.target.value.replace(/\D/g, ""))} placeholder="e.g. 18" />
        </div>
        <div>
          <label className="field-label">Badge</label>
          <select className="field" value={form.badge} onChange={(e) => set("badge", e.target.value)}>
            <option value="">None</option>
            <option value="BESTSELLER">Bestseller</option>
            <option value="ECO">Eco</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="field-label">Image URL (optional)</label>
          <input className="field" value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} placeholder="https://… (leave blank to use a placeholder)" />
        </div>
        <div>
          <label className="field-label">Display order</label>
          <input className="field" inputMode="numeric" value={form.sortOrder} onChange={(e) => set("sortOrder", e.target.value.replace(/\D/g, ""))} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-5">
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" checked={form.priceOnRequest} onChange={(e) => set("priceOnRequest", e.target.checked)} />
          Price on request
        </label>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} />
          Show on website
        </label>
      </div>

      {/* Price tiers */}
      <div className="mt-6 rounded-xl border border-navy/10 bg-cream/50 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-head text-sm font-bold text-navy">Price tiers</h3>
          <button type="button" onClick={addSlab} className="link-arrow">
            <Plus className="h-4 w-4" /> Add tier
          </button>
        </div>
        <p className="mt-1 text-xs text-muted">
          Set a price per unit for each quantity range. Leave the price blank for “best quote —
          talk to us”. Leave the “up to” blank for the top tier (and above).
        </p>

        <div className="mt-3 space-y-2">
          <div className="hidden grid-cols-[1fr_1fr_1.2fr_1.2fr_auto] gap-2 px-1 text-[11px] font-bold uppercase tracking-wide text-muted sm:grid">
            <span>From qty</span>
            <span>Up to qty</span>
            <span>Price / unit (₹)</span>
            <span>Savings label</span>
            <span></span>
          </div>
          {slabs.map((row, i) => (
            <div key={i} className="grid grid-cols-2 gap-2 sm:grid-cols-[1fr_1fr_1.2fr_1.2fr_auto]">
              <input
                className="field"
                inputMode="numeric"
                placeholder="From qty"
                value={row.minQty}
                onChange={(e) => updateSlab(i, "minQty", e.target.value.replace(/[^\d]/g, ""))}
              />
              <input
                className="field"
                inputMode="numeric"
                placeholder="and above"
                value={row.maxQty}
                onChange={(e) => updateSlab(i, "maxQty", e.target.value.replace(/[^\d]/g, ""))}
              />
              <input
                className="field"
                inputMode="decimal"
                placeholder="on request"
                value={row.pricePerUnit}
                onChange={(e) => updateSlab(i, "pricePerUnit", e.target.value.replace(/[^\d.]/g, ""))}
              />
              <input
                className="field"
                placeholder="e.g. Save 5%"
                value={row.savingsLabel}
                onChange={(e) => updateSlab(i, "savingsLabel", e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeSlab(i)}
                className="grid place-items-center text-muted hover:text-red-600"
                aria-label="Remove tier"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <div className="mt-6 flex gap-3">
        <button type="submit" disabled={busy} className="btn btn-gold">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : product ? "Save changes" : "Create product"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn btn-ghost">
          Cancel
        </button>
      </div>
    </form>
  );
}
