import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div>
      <Link href="/admin/products" className="link-arrow">
        <ArrowLeft className="h-4 w-4" /> Products
      </Link>
      <h1 className="mt-3 text-2xl font-bold text-navy">New product</h1>
      <p className="mt-1 text-muted">It appears on the website as soon as you save it (if set to show).</p>
      <div className="mt-6">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
