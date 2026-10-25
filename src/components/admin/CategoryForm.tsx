"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { saveCategory } from "@/app/actions/products";

const ICONS = ["pen", "spray", "coffee", "gift", "printer", "boxes"];

type CategoryInit = {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  icon: string | null;
  active: boolean;
  sortOrder: number;
};

export function CategoryForm({
  category,
  onDone,
}: {
  category?: CategoryInit;
  onDone?: () => void;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: category?.name ?? "",
    slug: category?.slug ?? "",
    tagline: category?.tagline ?? "",
    description: category?.description ?? "",
    icon: category?.icon ?? "boxes",
    active: category?.active ?? true,
    sortOrder: category?.sortOrder != null ? String(category.sortOrder) : "0",
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
    const res = await saveCategory({ ...form, sortOrder: Number(form.sortOrder) || 0 }, category?.id);
    setBusy(false);
    if (!res.ok) return setError(res.error);
    router.refresh();
    onDone?.();
  }

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <div>
        <label className="field-label">Name *</label>
        <input className="field" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Office Stationery" />
      </div>
      <div>
        <label className="field-label">Slug *</label>
        <input className="field" value={form.slug} onChange={(e) => set("slug", e.target.value.toLowerCase())} placeholder="e.g. stationery" />
      </div>
      <div>
        <label className="field-label">Tagline</label>
        <input className="field" value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
      </div>
      <div>
        <label className="field-label">Icon</label>
        <select className="field" value={form.icon} onChange={(e) => set("icon", e.target.value)}>
          {ICONS.map((i) => (
            <option key={i} value={i}>{i}</option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className="field-label">Description</label>
        <textarea className="field min-h-20" value={form.description} onChange={(e) => set("description", e.target.value)} />
      </div>
      <div>
        <label className="field-label">Display order</label>
        <input className="field" inputMode="numeric" value={form.sortOrder} onChange={(e) => set("sortOrder", e.target.value.replace(/\D/g, ""))} />
      </div>
      <label className="flex items-center gap-2 self-end pb-3 text-sm text-ink">
        <input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} />
        Show on website
      </label>
      {error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}
      <div className="sm:col-span-2">
        <button type="submit" disabled={busy} className="btn btn-gold">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : category ? "Save changes" : "Add category"}
        </button>
      </div>
    </form>
  );
}
