import Link from "next/link";
import { Pencil } from "lucide-react";
import { prisma } from "@/lib/db";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Categories</h1>
      <p className="mt-1 text-muted">The six supply categories shown across your website.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="overflow-hidden rounded-card bg-paper shadow-soft">
          <table className="w-full text-sm">
            <thead className="bg-cream text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Products</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-t border-black/5">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-navy">{c.name}</div>
                    <div className="text-xs text-muted">/{c.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-muted">{c._count.products}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-pill px-2 py-0.5 text-xs font-semibold",
                        c.active ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-600",
                      )}
                    >
                      {c.active ? "Live" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/categories/${c.id}`} className="text-muted hover:text-navy">
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-bold text-navy">Add a category</h2>
          <div className="mt-4">
            <CategoryForm />
          </div>
        </div>
      </div>
    </div>
  );
}
