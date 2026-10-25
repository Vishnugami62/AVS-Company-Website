import { prisma } from "./db";

// Default site settings. The owner can override any of these from the admin
// panel; values are stored in the Setting table. Bracketed values are
// placeholders to be replaced with real details before launch.
export const DEFAULT_SETTINGS = {
  companyName: "AVS Company",
  tagline: "Better Supplies for a Smoother Tomorrow",
  phone: "+91 [XXXXX XXXXX]",
  whatsapp: "+91 [XXXXX XXXXX]",
  salesEmail: "[sales@yourdomain.com]",
  ordersEmail: "[orders@yourdomain.com]",
  address: "[Office address]",
  city: "Mumbai, Maharashtra",
  pincode: "[400 0__]",
  hours: "Mon – Sat, [9:30 am – 6:30 pm]",
  gstin: "[__________]",
  minOrder: "[____]",
  freeDeliveryThreshold: "[____]",
  foundedYear: "2026",
} as const;

export type SiteSettings = Record<keyof typeof DEFAULT_SETTINGS, string>;

export async function getSettings(): Promise<SiteSettings> {
  const rows = await prisma.setting.findMany();
  const overrides = Object.fromEntries(
    rows.filter((r) => r.value != null).map((r) => [r.key, r.value as string]),
  );
  return { ...DEFAULT_SETTINGS, ...overrides } as SiteSettings;
}

export async function setSetting(key: string, value: string): Promise<void> {
  await prisma.setting.upsert({
    where: { key },
    create: { key, value },
    update: { value },
  });
}

/** A WhatsApp click-to-chat URL from a (possibly placeholder) number. */
export function whatsappLink(number: string, text?: string): string {
  const digits = number.replace(/\D/g, "");
  const base = digits ? `https://wa.me/${digits}` : "https://wa.me/";
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
