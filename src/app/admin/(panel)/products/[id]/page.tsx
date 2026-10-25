import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { priceSlabs: { orderBy: [{ sortOrder: "asc" }, { minQty: "asc" }] } },
    }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!product) notFound();

  return (
    <div>
      <Link href="/admin/products" className="link-arrow">
        <ArrowLeft className="h-4 w-4" /> Products
      </Link>
      <h1 className="mt-3 text-2xl font-bold text-navy">Edit product</h1>
      <div className="mt-6">
        <ProductForm
          categories={categories}
          product={{
            id: product.id,
            name: product.name,
            sku: product.sku,
            categoryId: product.categoryId,
            shortDesc: product.shortDesc,
            description: product.description,
            packInfo: product.packInfo,
            unit: product.unit,
            moq: product.moq,
            hsnCode: product.hsnCode,
            gstRate: product.gstRate,
            badge: product.badge,
            priceOnRequest: product.priceOnRequest,
            imageUrl: product.imageUrl,
            active: product.active,
            sortOrder: product.sortOrder,
            slabs: product.priceSlabs.map((s) => ({
              minQty: s.minQty,
              maxQty: s.maxQty,
              pricePerUnit: s.pricePaise != null ? s.pricePaise / 100 : null,
              savingsLabel: s.savingsLabel,
            })),
          }}
        />
      </div>
    </div>
  );
}
