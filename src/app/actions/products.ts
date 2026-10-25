"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentStaff } from "@/lib/auth";
import { assertSameOrigin } from "@/lib/security";
import { productSchema, categorySchema, firstError } from "@/lib/validation";
import { slugify } from "@/lib/utils";

async function guard() {
  await assertSameOrigin();
  const staff = await getCurrentStaff();
  if (!staff) throw new Error("Not authorised");
  return staff;
}

type Result = { ok: true; id?: string } | { ok: false; error: string };

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const root = slugify(base) || "item";
  let slug = root;
  let n = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    n += 1;
    slug = `${root}-${n}`;
  }
}

export async function saveProduct(input: unknown, id?: string): Promise<Result> {
  try {
    await guard();
    const parsed = productSchema.safeParse(input);
    if (!parsed.success) return { ok: false, error: firstError(parsed.error) };
    const d = parsed.data;

    const category = await prisma.category.findUnique({ where: { id: d.categoryId } });
    if (!category) return { ok: false, error: "Choose a valid category." };

    // Ensure SKU is unique
    const skuOwner = await prisma.product.findUnique({ where: { sku: d.sku } });
    if (skuOwner && skuOwner.id !== id) {
      return { ok: false, error: "That SKU is already used by another product." };
    }

    const data = {
      name: d.name,
      sku: d.sku,
      categoryId: d.categoryId,
      shortDesc: d.shortDesc || null,
      description: d.description || null,
      packInfo: d.packInfo || null,
      unit: d.unit || null,
      moq: d.moq || null,
      hsnCode: d.hsnCode || null,
      gstRate: d.gstRate ?? null,
      badge: d.badge || null,
      priceOnRequest: d.priceOnRequest,
      imageUrl: d.imageUrl || null,
      active: d.active,
      sortOrder: d.sortOrder,
    };

    let productId = id;
    if (id) {
      await prisma.product.update({
        where: { id },
        data: { ...data, slug: await uniqueSlug(d.name, id) },
      });
    } else {
      const created = await prisma.product.create({
        data: { ...data, slug: await uniqueSlug(d.name) },
      });
      productId = created.id;
    }

    // Replace the price tiers for this product.
    const slabs = (d.slabs ?? []).filter((s) => Number.isFinite(s.minQty) && s.minQty >= 1);
    await prisma.priceSlab.deleteMany({ where: { productId: productId! } });
    if (slabs.length > 0) {
      await prisma.priceSlab.createMany({
        data: slabs
          .sort((a, b) => a.minQty - b.minQty)
          .map((s, i) => ({
            productId: productId!,
            minQty: s.minQty,
            maxQty: s.maxQty ?? null,
            pricePaise: s.pricePerUnit != null ? Math.round(s.pricePerUnit * 100) : null,
            savingsLabel: s.savingsLabel || null,
            sortOrder: i,
          })),
      });
    }

    revalidatePath("/admin/products");
    revalidatePath(`/catalogue/${category.slug}`);
    return { ok: true, id: productId };
  } catch {
    return { ok: false, error: "Could not save the product." };
  }
}

export async function deleteProduct(id: string): Promise<Result> {
  try {
    await guard();
    await prisma.product.delete({ where: { id } });
    revalidatePath("/admin/products");
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not delete the product." };
  }
}

export async function saveCategory(input: unknown, id?: string): Promise<Result> {
  try {
    await guard();
    const parsed = categorySchema.safeParse(input);
    if (!parsed.success) return { ok: false, error: firstError(parsed.error) };
    const d = parsed.data;

    const slugOwner = await prisma.category.findUnique({ where: { slug: d.slug } });
    if (slugOwner && slugOwner.id !== id) {
      return { ok: false, error: "That slug is already used by another category." };
    }

    const data = {
      name: d.name,
      slug: d.slug,
      tagline: d.tagline || null,
      description: d.description || null,
      icon: d.icon || null,
      active: d.active,
      sortOrder: d.sortOrder,
    };

    if (id) await prisma.category.update({ where: { id }, data });
    else await prisma.category.create({ data });

    revalidatePath("/admin/categories");
    revalidatePath("/catalogue");
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not save the category." };
  }
}
