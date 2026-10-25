import { customAlphabet } from "./nanoid";

/** Tailwind-friendly className joiner. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Format integer paise as Indian rupees. */
export function formatINR(paise: number | null | undefined): string {
  if (paise === null || paise === undefined) return "Price on request";
  const rupees = paise / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: rupees % 1 === 0 ? 0 : 2,
  }).format(rupees);
}

const DATE_FMT = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
});
const DATETIME_FMT = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

export function formatDate(d: Date | string | null | undefined): string {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  if (isNaN(date.getTime())) return "—";
  return DATE_FMT.format(date);
}

export function formatDateTime(d: Date | string | null | undefined): string {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  if (isNaN(date.getTime())) return "—";
  return DATETIME_FMT.format(date).replace(",", " ·");
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const numericId = customAlphabet("0123456789", 4);

/** AVS order number, e.g. AVS-2610-0042 (ddMM + 4 digits). */
export function generateAvsNumber(date = new Date()): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `AVS-${dd}${mm}-${numericId()}`;
}

/** Normalise a PO / order number for case-insensitive lookup. */
export function normalizeLookup(input: string): string {
  return input.trim().replace(/\s+/g, "").toUpperCase();
}
