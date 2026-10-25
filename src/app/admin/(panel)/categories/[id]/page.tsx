import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { CategoryForm } from "@/components/admin/CategoryForm";

export const dynamic = "force-dynamic";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) notFound();

  return (
    <div>
      <Link href="/admin/categories" className="link-arrow">
        <ArrowLeft className="h-4 w-4" /> Categories
      </Link>
      <h1 className="mt-3 text-2xl font-bold text-navy">Edit category</h1>
      <div className="mt-6 card max-w-2xl p-6">
        <CategoryForm
          category={{
            id: category.id,
            name: category.name,
            slug: category.slug,
            tagline: category.tagline,
            description: category.description,
            icon: category.icon,
            active: category.active,
            sortOrder: category.sortOrder,
          }}
        />
      </div>
    </div>
  );
}
