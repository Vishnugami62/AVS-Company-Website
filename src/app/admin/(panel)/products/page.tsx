import Link from "next/link";
import { PlusCircle, Pencil } from "lucide-react";
import { prisma } from "@/lib/db";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }],
    include: { category: true },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy">Products</h1>
          <p className="mt-1 text-muted">Add, edit and manage everything shown in your catalogue.</p>
        </div>
        <Link href="/admin/products/new" className="btn btn-gold btn-sm">
          <PlusCircle className="h-4 w-4" /> New product
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-card bg-paper shadow-soft">
        <div className="scroll-slim overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-cream text-left text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-muted">
                    No products yet. Add your first product.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="border-t border-black/5 hover:bg-cream/50">
                    <td className="px-4 py-3">
                      <Link href={`/admin/products/${p.id}`} className="font-semibold text-navy hover:text-gold-text">
                        {p.name}
                      </Link>
                      {p.badge && (
                        <span className="ml-2 rounded-pill bg-gold/20 px-1.5 py-0.5 text-[10px] font-bold uppercase text-gold-text">
                          {p.badge === "ECO" ? "Eco" : "Best"}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted">{p.sku}</td>
                    <td className="px-4 py-3">{p.category.name}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "rounded-pill px-2 py-0.5 text-xs font-semibold",
                          p.active ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-600",
                        )}
                      >
                        {p.active ? "Live" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <Link href={`/admin/products/${p.id}`} className="text-muted hover:text-navy" aria-label="Edit">
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <DeleteProductButton id={p.id} name={p.name} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
