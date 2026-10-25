import { ORDER_STATUS, STATUS_FLOW } from "./constants";

/** Index within the 6-stage public flow that a status corresponds to. */
export function flowIndexFor(status: string): number {
  const i = STATUS_FLOW.indexOf(status as (typeof STATUS_FLOW)[number]);
  if (i >= 0) return i;
  if (status === ORDER_STATUS.PARTIALLY_DELIVERED) return 4; // out for delivery stage
  return 0;
}

/** A banner message for non-linear statuses, or null for normal flow. */
export function statusBanner(status: string): string | null {
  switch (status) {
    case ORDER_STATUS.ON_HOLD:
      return "This order is currently on hold. Our team will be in touch.";
    case ORDER_STATUS.PARTIALLY_DELIVERED:
      return "Part of this order has been delivered; the rest is on the way.";
    case ORDER_STATUS.CANCELLED:
      return "This order has been cancelled.";
    default:
      return null;
  }
}
