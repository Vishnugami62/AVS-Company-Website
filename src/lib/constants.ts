// Shared vocabulary for the app. SQLite has no enums, so these string unions are
// the single source of truth and are validated at the edges with zod.

export const ORDER_STATUS = {
  CONFIRMED: "CONFIRMED",
  ARRANGING: "ARRANGING",
  PACKING: "PACKING",
  READY: "READY",
  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
  DELIVERED: "DELIVERED",
  PARTIALLY_DELIVERED: "PARTIALLY_DELIVERED",
  ON_HOLD: "ON_HOLD",
  CANCELLED: "CANCELLED",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

// The six public stages, in order, that form the tracking timeline.
export const STATUS_FLOW: OrderStatus[] = [
  ORDER_STATUS.CONFIRMED,
  ORDER_STATUS.ARRANGING,
  ORDER_STATUS.PACKING,
  ORDER_STATUS.READY,
  ORDER_STATUS.OUT_FOR_DELIVERY,
  ORDER_STATUS.DELIVERED,
];

export const STATUS_LABEL: Record<string, string> = {
  CONFIRMED: "Order confirmed",
  ARRANGING: "Items being arranged",
  PACKING: "Being packed",
  READY: "Ready for dispatch",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
  PARTIALLY_DELIVERED: "Partially delivered",
  ON_HOLD: "On hold",
  CANCELLED: "Cancelled",
};

export const RECEIVED_VIA = ["WEBSITE", "WHATSAPP", "PHONE", "EMAIL", "IN_PERSON"] as const;
export const RECEIVED_VIA_LABEL: Record<string, string> = {
  WEBSITE: "Website",
  WHATSAPP: "WhatsApp",
  PHONE: "Phone",
  EMAIL: "Email",
  IN_PERSON: "In person",
};

export const DELIVERY_TYPE = ["STANDARD", "SCHEDULED", "URGENT", "PARTIAL"] as const;
export const DELIVERY_TYPE_LABEL: Record<string, string> = {
  STANDARD: "Standard delivery",
  SCHEDULED: "Scheduled delivery",
  URGENT: "Urgent delivery",
  PARTIAL: "Partial delivery",
};

export const REQUEST_TYPE = ["SCHEDULE", "PARTIAL", "URGENT"] as const;
export const REQUEST_TYPE_LABEL: Record<string, string> = {
  SCHEDULE: "Scheduled delivery",
  PARTIAL: "Partial delivery",
  URGENT: "Urgent delivery",
};

export const REQUEST_STATUS_LABEL: Record<string, string> = {
  WAITING: "Waiting",
  APPROVED: "Approved",
  DECLINED: "Declined",
  SLOT_SUGGESTED: "New slot suggested",
};

export const FREQUENCY = ["ONE_TIME", "WEEKLY", "MONTHLY", "QUARTERLY"] as const;
export const FREQUENCY_LABEL: Record<string, string> = {
  ONE_TIME: "One-time",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  QUARTERLY: "Quarterly",
};

export const TIME_SLOTS = [
  "10 am – 12 pm",
  "12 pm – 2 pm",
  "2 pm – 4 pm",
  "4 pm – 6 pm",
] as const;

export const STAFF_ROLES = ["OWNER", "ADMIN", "STAFF"] as const;

export const CATEGORY_SLUGS = [
  "stationery",
  "housekeeping",
  "pantry",
  "gifting",
  "printing",
  "facility-bulk",
] as const;

export const MUMBAI_HUBS = [
  { slug: "bkc", name: "BKC" },
  { slug: "lower-parel", name: "Lower Parel" },
  { slug: "andheri-east", name: "Andheri East" },
  { slug: "powai", name: "Powai" },
  { slug: "thane", name: "Thane" },
  { slug: "navi-mumbai", name: "Navi Mumbai" },
];
