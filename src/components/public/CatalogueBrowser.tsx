"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Leaf, Search } from "lucide-react";
import { AddToQuote } from "@/components/public/AddToQuote";
import { cn } from "@/lib/utils";

export type BrowserProduct = {
  slug: string;
  sku: string;
  name: string;
  shortDesc: string | null;
  packInfo: string | null;
  badge: string | null;
  imageUrl: string | null;
  price: string;
};

export function CatalogueBrowser({
  categorySlug,
  products,
}: {
  categorySlug: string;
  products: BrowserProduct[];
}) {
  const [query, setQuery] = useState("");
  const [ecoOnly, setEcoOnly] = useState(false);
  const [sort, setSort] = useState<"popular" | "name">("popular");

  const filtered = useMemo(() => {
    let list = products.slice();
    const q = query.trim().toLowerCase();
    if (q) list = list.filter((p) => p.name.toLowerCase().includes(q));
    if (ecoOnly) list = list.filter((p) => p.badge === "ECO");
    if (sort === "name") list = list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, query, ecoOnly, sort]);

  return (
    <div className="grid gap-8 lg:grid-cols-[230px_1fr]">
      {/* Filters */}
      <aside className="space-y-5">
        <div className="card p-5">
          <div className="font-head text-xs font-bold uppercase tracking-[0.16em] text-gold-text">
            Filter by
          </div>
          <label className="mt-4 flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" checked={ecoOnly} onChange={(e) => setEcoOnly(e.target.checked)} />
            <Leaf className="h-4 w-4 text-whatsapp" /> Eco-friendly only
          </label>
          {(ecoOnly || query) && (
            <button
              className="mt-4 text-xs font-semibold text-gold-text hover:underline"
              onClick={() => {
                setEcoOnly(false);
                setQuery("");
              }}
            >
              Clear all
            </button>
          )}
        </div>
      </aside>

      {/* Results */}
      <div>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              className="field pl-9"
              placeholder="Search this category…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted">
              Showing {filtered.length} of {products.length}
            </span>
            <select
              className="field w-auto py-2"
              value={sort}
              onChange={(e) => setSort(e.target.value as "popular" | "name")}
            >
              <option value="popular">Sort: Popular</option>
              <option value="name">Sort: Name</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="card p-8 text-center text-muted">
            No products match your search.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p) => (
              <div key={p.sku} className="flex flex-col rounded-card border border-black/5 bg-paper p-4 shadow-soft">
                <Link
                  href={`/catalogue/${categorySlug}/${p.slug}`}
                  className="relative mb-3 block aspect-[4/3] overflow-hidden rounded-xl bg-cream"
                >
                  <div
                    className="absolute inset-0 opacity-[0.12]"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 1px 1px, #13275A 1px, transparent 0)",
                      backgroundSize: "14px 14px",
                    }}
                  />
                  {p.badge && (
                    <span
                      className={cn(
                        "absolute left-2 top-2 rounded-pill px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                        p.badge === "ECO" ? "bg-whatsapp text-white" : "bg-gold text-navy-deep",
                      )}
                    >
                      {p.badge === "ECO" ? "Eco" : "Bestseller"}
                    </span>
                  )}
                </Link>
                <Link
                  href={`/catalogue/${categorySlug}/${p.slug}`}
                  className="font-head font-bold text-navy hover:text-gold-text"
                >
                  {p.name}
                </Link>
                <p className="mt-1 text-[13px] text-muted">{p.packInfo ?? p.shortDesc}</p>
                <p className="mt-1 flex-1 font-head text-sm font-bold text-gold-text">{p.price}</p>
                <div className="mt-3">
                  <AddToQuote sku={p.sku} name={p.name} pack={p.packInfo ?? undefined} block />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
