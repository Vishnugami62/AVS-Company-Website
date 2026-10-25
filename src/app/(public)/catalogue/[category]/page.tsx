import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import { prisma } from "@/lib/db";
import { CATEGORIES, getCategory } from "@/lib/catalogue-data";
import { CatalogueBrowser } from "@/components/public/CatalogueBrowser";
import { cn, formatINR } from "@/lib/utils";

type ProductWithSlabs = { priceOnRequest: boolean; unit: string | null; priceSlabs: { pricePaise: number | null }[] };

function priceLabel(p: ProductWithSlabs): string {
  const prices = p.priceSlabs.map((s) => s.pricePaise).filter((v): v is number => v != null);
  if (prices.length === 0) return "Price on request";
  const min = Math.min(...prices);
  return `From ${formatINR(min)}${p.unit ? ` / ${p.unit}` : ""}`;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const c = getCategory(category);
  return {
    title: c ? c.name : "Catalogue",
    description: c?.blurb,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const dbCategory = await prisma.category.findUnique({ where: { slug: category } });
  const staticCategory = getCategory(category);
  if (!dbCategory && !staticCategory) notFound();

  const products = dbCategory
    ? await prisma.product.findMany({
        where: { categoryId: dbCategory.id, active: true },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        include: { priceSlabs: { select: { pricePaise: true } } },
      })
    : [];

  const name = dbCategory?.name ?? staticCategory!.name;
  const blurb = dbCategory?.description ?? staticCategory?.blurb ?? "";

  return (
    <section className="py-12">
      <div className="shell">
        <nav className="text-sm text-muted">
          <Link href="/" className="hover:text-navy">
            Home
          </Link>{" "}
          / <Link href="/catalogue" className="hover:text-navy">Our Catalogue</Link> /{" "}
          <span className="text-navy">{name}</span>
        </nav>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold">{name}</h1>
            <p className="mt-2 text-[17px] text-muted">{blurb}</p>
          </div>
          <Link href="/contact" className="btn btn-outline btn-sm">
            <Download className="h-4 w-4" /> Download PDF catalogue
          </Link>
        </div>

        {/* Category tabs */}
        <div className="scroll-slim mt-6 flex gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/catalogue/${c.slug}`}
              className={cn(
                "chip whitespace-nowrap",
                c.slug === category && "border-gold bg-gold/15 text-gold-text",
              )}
            >
              {c.name}
            </Link>
          ))}
        </div>

        <div className="mt-8">
          {products.length === 0 ? (
            <div className="card p-10 text-center">
              <p className="text-muted">
                Products for this category are being added. Meanwhile, send us your list for a
                quote.
              </p>
              <Link href="/quote" className="btn btn-gold mt-4">
                Request a quote
              </Link>
            </div>
          ) : (
            <CatalogueBrowser
              categorySlug={category}
              products={products.map((p) => ({
                slug: p.slug,
                sku: p.sku,
                name: p.name,
                shortDesc: p.shortDesc,
                packInfo: p.packInfo,
                badge: p.badge,
                imageUrl: p.imageUrl,
                price: priceLabel(p),
              }))}
            />
          )}
        </div>
      </div>
    </section>
  );
}
