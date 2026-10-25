import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, PackageCheck, ReceiptIndianRupee, RefreshCw } from "lucide-react";
import { prisma } from "@/lib/db";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { ProductQuote } from "@/components/public/ProductQuote";
import { AddToQuote } from "@/components/public/AddToQuote";
import { formatINR } from "@/lib/utils";
import { getCategory } from "@/lib/catalogue-data";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await prisma.product.findUnique({ where: { slug } });
  return { title: p?.name ?? "Product", description: p?.shortDesc ?? undefined };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      priceSlabs: { orderBy: [{ sortOrder: "asc" }, { minQty: "asc" }] },
    },
  });
  if (!product) notFound();

  const specs = (() => {
    try {
      return JSON.parse(product.specsJson ?? "[]") as Array<{ label: string; value: string }>;
    } catch {
      return [];
    }
  })();

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, active: true, NOT: { id: product.id } },
    take: 4,
    orderBy: { sortOrder: "asc" },
  });

  const catName = product.category.name ?? getCategory(category)?.name ?? "Catalogue";

  return (
    <section className="py-12">
      <div className="shell">
        <nav className="text-sm text-muted">
          <Link href="/" className="hover:text-navy">Home</Link> /{" "}
          <Link href="/catalogue" className="hover:text-navy">Our Catalogue</Link> /{" "}
          <Link href={`/catalogue/${category}`} className="hover:text-navy">{catName}</Link> /{" "}
          <span className="text-navy">{product.name}</span>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          {/* Gallery */}
          <div>
            <PhotoSlot label="Product photo" className="aspect-square" />
            <div className="mt-3 grid grid-cols-4 gap-3">
              {["Front", "Pack", "In use", "360°"].map((l) => (
                <PhotoSlot key={l} label={l} className="aspect-square" />
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center gap-2 text-xs text-muted">
              {product.badge && (
                <span className="rounded-pill bg-gold px-2 py-0.5 font-bold uppercase text-navy-deep">
                  {product.badge === "ECO" ? "Eco" : "Bestseller"}
                </span>
              )}
              <span>SKU {product.sku}</span>
            </div>
            <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-whatsapp">
              <CheckCircle2 className="h-4 w-4" /> In stock · ready to ship
            </p>
            {product.description && (
              <p className="mt-4 text-[16px] leading-relaxed text-muted">{product.description}</p>
            )}

            {specs.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {specs.slice(0, 4).map((s) => (
                  <span key={s.label} className="chip text-xs">
                    {s.value}
                  </span>
                ))}
              </div>
            )}

            {/* Price slabs */}
            <div className="mt-6 overflow-hidden rounded-card border border-navy/10">
              <table className="w-full text-sm">
                <thead className="bg-cream text-navy">
                  <tr>
                    <th className="px-4 py-2.5 text-left font-head text-xs uppercase tracking-wide">
                      Quantity
                    </th>
                    <th className="px-4 py-2.5 text-left font-head text-xs uppercase tracking-wide">
                      Price per {product.unit ?? "unit"} (excl. GST)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {product.priceSlabs.length > 0 ? (
                    product.priceSlabs.map((slab) => (
                      <tr key={slab.id} className="border-t border-navy/5">
                        <td className="px-4 py-2.5">
                          {slab.minQty}
                          {slab.maxQty ? ` – ${slab.maxQty}` : " +"}
                        </td>
                        <td className="px-4 py-2.5 font-semibold text-navy">
                          {slab.pricePaise != null
                            ? formatINR(slab.pricePaise)
                            : (slab.savingsLabel ?? "Best quote — talk to us")}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="border-t border-navy/5">
                      <td className="px-4 py-3 text-muted" colSpan={2}>
                        Price is confirmed in your quote. GST extra.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6">
              <ProductQuote
                sku={product.sku}
                name={product.name}
                pack={product.packInfo ?? undefined}
                unit={product.unit ?? "units"}
              />
            </div>

            <ul className="mt-6 space-y-2 text-sm text-muted">
              <li className="flex items-center gap-2">
                <PackageCheck className="h-4 w-4 text-gold" /> Delivered within 1–2 working days
                across Mumbai
              </li>
              <li className="flex items-center gap-2">
                <ReceiptIndianRupee className="h-4 w-4 text-gold" /> GST invoice included
                {product.hsnCode ? ` · HSN ${product.hsnCode}` : ""}
              </li>
              <li className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-gold" /> Free replacement for damaged or wrong
                items
              </li>
            </ul>
          </div>
        </div>

        {/* Details */}
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <div className="card p-6">
            <h2 className="text-lg font-bold">Specifications</h2>
            <table className="mt-3 w-full text-sm">
              <tbody>
                {(specs.length > 0
                  ? specs
                  : [{ label: "Pack", value: product.packInfo ?? "—" }]
                ).map((s) => (
                  <tr key={s.label} className="border-b border-navy/5 last:border-0">
                    <td className="py-2 text-muted">{s.label}</td>
                    <td className="py-2 text-right font-semibold text-navy">{s.value}</td>
                  </tr>
                ))}
                {product.gstRate != null && (
                  <tr className="border-b border-navy/5 last:border-0">
                    <td className="py-2 text-muted">GST rate</td>
                    <td className="py-2 text-right font-semibold text-navy">{product.gstRate}%</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="card p-6">
            <h2 className="text-lg font-bold">Packaging &amp; delivery</h2>
            <p className="mt-3 text-sm text-muted">
              Supplied as {product.packInfo ?? "standard packs"}. Scheduled delivery across
              Mumbai, Thane and Navi Mumbai, with priority dispatch available for urgent orders.
            </p>
          </div>
          <div className="card p-6">
            <h2 className="text-lg font-bold">Bulk &amp; contract pricing</h2>
            <p className="mt-3 text-sm text-muted">
              Ordering every month? Put it on an auto-order with pricing locked for a set period,
              delivered on your chosen date. Pause or change any time.
            </p>
            <Link href="/quote" className="link-arrow mt-3">
              Set up a recurring order
            </Link>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold">Often ordered together</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r) => (
                <div key={r.id} className="card flex flex-col p-4">
                  <Link
                    href={`/catalogue/${category}/${r.slug}`}
                    className="font-head font-bold text-navy hover:text-gold-text"
                  >
                    {r.name}
                  </Link>
                  <p className="mt-1 flex-1 text-[13px] text-muted">{r.packInfo}</p>
                  <div className="mt-3">
                    <AddToQuote sku={r.sku} name={r.name} pack={r.packInfo ?? undefined} block />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
