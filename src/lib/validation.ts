import { z } from "zod";
import {
  DELIVERY_TYPE,
  FREQUENCY,
  ORDER_STATUS,
  RECEIVED_VIA,
  REQUEST_TYPE,
} from "./constants";

const str = (max = 500) => z.string().trim().max(max);
const email = z.string().trim().email("Enter a valid email address").max(200);
const phone = z
  .string()
  .trim()
  .min(7, "Enter a valid phone number")
  .max(20)
  .regex(/^[+]?[0-9 ()-]+$/, "Enter a valid phone number");

export const quoteSchema = z.object({
  categories: z.array(z.string().max(40)).max(10).optional().default([]),
  listText: str(5000).optional().default(""),
  frequency: z.enum(FREQUENCY).optional(),
  deliveryLocations: str(1000).optional().default(""),
  requiredBy: str(40).optional().default(""),
  budget: str(60).optional().default(""),
  customPrint: z.boolean().optional().default(false),
  separateInvoice: z.boolean().optional().default(false),
  fullName: str(120).min(2, "Please enter your name"),
  company: str(160).min(2, "Please enter your company"),
  email,
  phone,
  gstin: str(20).optional().default(""),
  hearAbout: str(120).optional().default(""),
  whatsappOptin: z.boolean().optional().default(false),
  emailOptin: z.boolean().optional().default(false),
});
export type QuoteInput = z.infer<typeof quoteSchema>;

export const contactSchema = z.object({
  name: str(120).min(2, "Please enter your name"),
  company: str(160).optional().default(""),
  email,
  phone: phone.optional(),
  interest: str(80).optional().default(""),
  message: str(3000).min(5, "Please enter a short message"),
});

export const trackSchema = z.object({
  number: z.string().trim().min(4, "Enter your order or PO number").max(60),
});

export const deliveryRequestSchema = z.object({
  avsNumber: str(40),
  type: z.enum(REQUEST_TYPE),
  requestedDate: str(40).optional().default(""),
  requestedSlot: str(40).optional().default(""),
  details: str(2000).optional().default(""),
  customerNote: str(500).optional().default(""),
});

export const otpVerifySchema = z.object({
  otpId: str(40),
  code: z.string().trim().regex(/^\d{6}$/, "Enter the 6-digit code"),
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password").max(200),
});

export const priceSlabInputSchema = z.object({
  minQty: z.number().int().min(1).max(1_000_000),
  maxQty: z.number().int().min(1).max(1_000_000).nullable().optional(),
  // price per unit in rupees (may be a decimal); null = "price on request / talk to us"
  pricePerUnit: z.number().min(0).max(100_000_000).nullable().optional(),
  savingsLabel: str(60).optional().default(""),
});

export const productSchema = z.object({
  name: str(160).min(2),
  sku: str(60).min(2),
  categoryId: str(40).min(1, "Choose a category"),
  slabs: z.array(priceSlabInputSchema).max(12).optional(),
  shortDesc: str(300).optional().default(""),
  description: str(4000).optional().default(""),
  packInfo: str(120).optional().default(""),
  unit: str(40).optional().default(""),
  moq: str(60).optional().default(""),
  hsnCode: str(20).optional().default(""),
  gstRate: z.coerce.number().int().min(0).max(100).optional(),
  badge: z.enum(["", "BESTSELLER", "ECO"]).optional().default(""),
  priceOnRequest: z.boolean().optional().default(false),
  imageUrl: str(500).optional().default(""),
  active: z.boolean().optional().default(true),
  sortOrder: z.coerce.number().int().min(0).max(9999).optional().default(0),
});

export const categorySchema = z.object({
  name: str(120).min(2),
  slug: str(60)
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens"),
  tagline: str(160).optional().default(""),
  description: str(1000).optional().default(""),
  icon: str(40).optional().default(""),
  active: z.boolean().optional().default(true),
  sortOrder: z.coerce.number().int().min(0).max(9999).optional().default(0),
});

export const offlineOrderSchema = z.object({
  receivedVia: z.enum(RECEIVED_VIA),
  company: str(160).min(2, "Enter the customer company"),
  contactName: str(120).optional().default(""),
  trackingEmail: email,
  phone: phone.optional(),
  poNumber: str(60).optional().default(""),
  expectedDate: str(40).optional().default(""),
  deliveryAddress: str(500).min(3, "Enter a delivery address"),
  deliveryType: z.enum(DELIVERY_TYPE).optional().default("STANDARD"),
  itemsSummary: str(2000).optional().default(""),
});

export const statusUpdateSchema = z.object({
  orderId: str(40),
  status: z.enum(
    Object.values(ORDER_STATUS) as [string, ...string[]],
  ),
  expectedDate: str(40).optional().default(""),
  internalNote: str(1000).optional().default(""),
  emailCustomer: z.boolean().optional().default(false),
});

export function firstError(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Please check the form and try again.";
}
