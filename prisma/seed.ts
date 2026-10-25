import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { CATEGORIES } from "../src/lib/catalogue-data";

const prisma = new PrismaClient();

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const ADMIN_EMAIL = "admin@avscompany.in";
const ADMIN_PASSWORD = "AvsAdmin@2026"; // change after first login

function daysFromNow(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(10, 0, 0, 0);
  return d;
}
function at(day: number, hour: number, min = 0): Date {
  const d = new Date();
  d.setDate(d.getDate() + day);
  d.setHours(hour, min, 0, 0);
  return d;
}

async function main() {
  console.log("Clearing existing data…");
  await prisma.emailLog.deleteMany();
  await prisma.otpCode.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.orderEvent.deleteMany();
  await prisma.deliveryRequest.deleteMany();
  await prisma.order.deleteMany();
  await prisma.priceSlab.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.quoteRequest.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.staff.deleteMany();

  console.log("Creating admin user…");
  await prisma.staff.create({
    data: {
      name: "AVS Admin",
      email: ADMIN_EMAIL,
      passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 12),
      role: "OWNER",
    },
  });

  console.log("Seeding catalogue…");
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
          description: p.specs ? `${p.shortDesc}` : p.shortDesc,
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
    }
  }

  console.log("Seeding customers & orders…");
  const companies = ["Company A", "Company B", "Company C", "Company D", "Company E", "Company F"];
  const customers: Record<string, string> = {};
  for (const company of companies) {
    const cust = await prisma.customer.create({
      data: {
        company,
        contactName: "Contact Person",
        email: "customer@example.com",
        phone: "+91 90000 00000",
        address: "Office address, Andheri East, Mumbai",
      },
    });
    customers[company] = cust.id;
  }

  type Seed = {
    avs: string;
    po: string | null;
    company: string;
    via: string;
    status: string;
    deliveryType?: string;
    expected: Date | null;
    events: Array<{ status: string; at: Date }>;
  };

  const orders: Seed[] = [
    {
      avs: "AVS-2610-0042", po: "PO-4500012345", company: "Company A", via: "WEBSITE",
      status: "PACKING", expected: daysFromNow(2),
      events: [
        { status: "CONFIRMED", at: at(-2, 10, 15) },
        { status: "ARRANGING", at: at(-1, 15, 30) },
        { status: "PACKING", at: at(0, 11, 40) },
      ],
    },
    {
      avs: "AVS-2610-0041", po: "PO/2026/118", company: "Company B", via: "WHATSAPP",
      status: "ARRANGING", expected: daysFromNow(2),
      events: [
        { status: "CONFIRMED", at: at(-1, 9, 0) },
        { status: "ARRANGING", at: at(0, 10, 5) },
      ],
    },
    {
      avs: "AVS-2610-0040", po: null, company: "Company C", via: "PHONE",
      status: "CONFIRMED", expected: daysFromNow(5),
      events: [{ status: "CONFIRMED", at: at(-1, 18, 20) }],
    },
    {
      avs: "AVS-2610-0039", po: "PO-88231", company: "Company D", via: "EMAIL",
      status: "OUT_FOR_DELIVERY", expected: daysFromNow(0),
      events: [
        { status: "CONFIRMED", at: at(-3, 10, 0) },
        { status: "ARRANGING", at: at(-2, 12, 0) },
        { status: "PACKING", at: at(-1, 14, 0) },
        { status: "READY", at: at(0, 8, 30) },
        { status: "OUT_FOR_DELIVERY", at: at(0, 9, 20) },
      ],
    },
    {
      avs: "AVS-2610-0038", po: "PO-4500012290", company: "Company A", via: "WEBSITE",
      status: "READY", expected: daysFromNow(1),
      events: [
        { status: "CONFIRMED", at: at(-2, 9, 0) },
        { status: "ARRANGING", at: at(-1, 11, 0) },
        { status: "PACKING", at: at(-1, 16, 0) },
        { status: "READY", at: at(0, 9, 45) },
      ],
    },
    {
      avs: "AVS-2610-0037", po: "7781", company: "Company E", via: "IN_PERSON",
      status: "ON_HOLD", expected: null,
      events: [{ status: "CONFIRMED", at: at(-2, 16, 10) }],
    },
    {
      avs: "AVS-2610-0035", po: "PO/2026/101", company: "Company B", via: "WHATSAPP",
      status: "PARTIALLY_DELIVERED", deliveryType: "PARTIAL", expected: daysFromNow(1),
      events: [
        { status: "CONFIRMED", at: at(-3, 10, 0) },
        { status: "ARRANGING", at: at(-2, 12, 0) },
        { status: "PACKING", at: at(-1, 15, 0) },
        { status: "PARTIALLY_DELIVERED", at: at(0, 10, 0) },
      ],
    },
    {
      avs: "AVS-2610-0033", po: "PO-87990", company: "Company F", via: "EMAIL",
      status: "DELIVERED", expected: daysFromNow(-1),
      events: [
        { status: "CONFIRMED", at: at(-4, 10, 0) },
        { status: "ARRANGING", at: at(-3, 12, 0) },
        { status: "PACKING", at: at(-2, 14, 0) },
        { status: "READY", at: at(-2, 16, 0) },
        { status: "OUT_FOR_DELIVERY", at: at(-1, 9, 0) },
        { status: "DELIVERED", at: at(-1, 13, 30) },
      ],
    },
  ];

  for (const o of orders) {
    await prisma.order.create({
      data: {
        avsNumber: o.avs,
        poNumber: o.po,
        customerId: customers[o.company],
        receivedVia: o.via,
        status: o.status,
        deliveryType: o.deliveryType ?? "STANDARD",
        expectedDate: o.expected,
        onHold: o.status === "ON_HOLD",
        trackingEmail: "customer@example.com",
        deliveryAddress: "Office address, Andheri East, Mumbai",
        itemsSummary: "Sample order items",
        amountPaise: null,
        events: {
          create: o.events.map((e) => ({ status: e.status, createdAt: e.at })),
        },
        activityLogs: {
          create: [{ actorType: "SYSTEM", action: "Order created (seed data)" }],
        },
      },
    });
  }

  // A few delivery requests to populate the admin inbox.
  const o42 = await prisma.order.findUnique({ where: { avsNumber: "AVS-2610-0042" } });
  const o41 = await prisma.order.findUnique({ where: { avsNumber: "AVS-2610-0041" } });
  const o35 = await prisma.order.findUnique({ where: { avsNumber: "AVS-2610-0035" } });
  if (o42) {
    await prisma.deliveryRequest.create({
      data: {
        orderId: o42.id, type: "SCHEDULE", status: "WAITING",
        requestedDate: daysFromNow(5), requestedSlot: "2 pm – 4 pm",
        customerNote: "Please call before arriving", emailVerified: true,
      },
    });
  }
  if (o41) {
    await prisma.deliveryRequest.create({
      data: {
        orderId: o41.id, type: "URGENT", status: "WAITING",
        requestedDate: daysFromNow(1), details: "Needed by 12 pm", emailVerified: true,
      },
    });
  }
  if (o35) {
    await prisma.deliveryRequest.create({
      data: {
        orderId: o35.id, type: "PARTIAL", status: "APPROVED",
        requestedDate: daysFromNow(1), requestedSlot: "10 am – 12 pm",
        details: "Send A4 paper and pantry first", emailVerified: true,
      },
    });
  }

  console.log("\n✅ Seed complete.");
  console.log(`   Admin login:  ${ADMIN_EMAIL}`);
  console.log(`   Password:     ${ADMIN_PASSWORD}  (change after first login)\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
