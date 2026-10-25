import "server-only";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import { CATEGORIES } from "./catalogue-data";
import { slugify } from "./utils";

export type SeedResult =
  | { seeded: true; adminEmail: string; categories: number; products: number }
  | { seeded: false; reason: "already_set_up" | "missing_admin_env" };

/**
 * One-time production seed. Creates the admin user (from ADMIN_EMAIL /
 * ADMIN_PASSWORD env vars — never a hard-coded secret) and the full catalogue,
 * but only on an empty database. Safe to call more than once: it no-ops once a
 * staff user exists.
 */
export async function seedIfEmpty(): Promise<SeedResult> {
  const staffCount = await prisma.staff.count();
  if (staffCount > 0) return { seeded: false, reason: "already_set_up" };

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return { seeded: false, reason: "missing_admin_env" };

  await prisma.staff.create({
    data: {
      name: "AVS Admin",
      email,
      passwordHash: await bcrypt.hash(password, 12),
      role: "OWNER",
    },
  });

  let productCount = 0;
  const existingCategories = await prisma.category.count();
  if (existingCategories === 0) {
    for (let ci = 0; ci < CATEGORIES.length; ci++) {
      const c = CATEGORIES[ci];
      const category = await prisma.category.create({
        data: {
          slug: c.slug,
          name: c.name,
          tagline: c.tagline,
          description: c.blurb,
          icon: c.icon,
          sortOrder: ci,
        },
      });
      for (let pi = 0; pi < c.products.length; pi++) {
        const p = c.products[pi];
        await prisma.product.create({
          data: {
            sku: p.sku,
            slug: slugify(p.name),
            name: p.name,
            categoryId: category.id,
            shortDesc: p.shortDesc,
            description: p.shortDesc,
            specsJson: p.specs ? JSON.stringify(p.specs) : null,
            packInfo: p.packInfo,
            unit: p.unit ?? null,
            moq: p.moq ?? null,
            hsnCode: p.hsnCode ?? null,
            gstRate: p.gstRate ?? null,
            badge: p.badge ?? null,
            priceOnRequest: p.priceOnRequest ?? false,
            sortOrder: pi,
            priceSlabs: p.slabs
              ? {
                  create: p.slabs.map((s, i) => ({
                    minQty: s.minQty,
                    maxQty: s.maxQty,
                    pricePaise: s.pricePaise,
                    savingsLabel: s.savingsLabel ?? null,
                    sortOrder: i,
                  })),
                }
              : undefined,
          },
        });
        productCount += 1;
      }
    }
  }

  return { seeded: true, adminEmail: email, categories: CATEGORIES.length, products: productCount };
}
