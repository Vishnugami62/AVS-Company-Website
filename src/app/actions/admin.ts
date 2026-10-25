"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentStaff } from "@/lib/auth";
import { assertSameOrigin } from "@/lib/security";
import {
  statusUpdateSchema,
  offlineOrderSchema,
  firstError,
} from "@/lib/validation";
import {
  sendEmail,
  statusUpdateHtml,
  deliveryDecisionHtml,
  teamAlertHtml,
} from "@/lib/email";
import { STATUS_LABEL, REQUEST_TYPE_LABEL } from "@/lib/constants";
import { generateAvsNumber, formatDate } from "@/lib/utils";

async function guard() {
  await assertSameOrigin();
  const staff = await getCurrentStaff();
  if (!staff) throw new Error("Not authorised");
  return staff;
}

export type AdminResult<T = unknown> = { ok: true; data?: T } | { ok: false; error: string };

export async function updateOrderStatus(input: unknown): Promise<AdminResult> {
  try {
    const staff = await guard();
    const parsed = statusUpdateSchema.safeParse(input);
    if (!parsed.success) return { ok: false, error: firstError(parsed.error) };
    const d = parsed.data;

    const order = await prisma.order.findUnique({ where: { id: d.orderId } });
    if (!order) return { ok: false, error: "Order not found." };

    const expectedDate = d.expectedDate ? new Date(d.expectedDate) : order.expectedDate;

    await prisma.$transaction([
      prisma.order.update({
        where: { id: order.id },
        data: {
          status: d.status,
          expectedDate,
          onHold: d.status === "ON_HOLD",
        },
      }),
      prisma.orderEvent.create({
        data: { orderId: order.id, status: d.status, staffId: staff.id },
      }),
      prisma.activityLog.create({
        data: {
          orderId: order.id,
          actorType: "STAFF",
          staffId: staff.id,
          action: `Status changed to ${STATUS_LABEL[d.status] ?? d.status}`,
          detail: d.internalNote || null,
        },
      }),
    ]);

    if (d.emailCustomer) {
      await sendEmail({
        to: order.trackingEmail,
        subject: `Update on your order ${order.avsNumber}`,
        html: statusUpdateHtml({
          poNumber: order.poNumber,
          avsNumber: order.avsNumber,
          statusLabel: STATUS_LABEL[d.status] ?? d.status,
          expected: formatDate(expectedDate),
        }),
        template: "status_update",
        orderId: order.id,
      });
      await prisma.activityLog.create({
        data: {
          orderId: order.id,
          actorType: "SYSTEM",
          action: "Status email sent to customer",
        },
      });
    }

    revalidatePath(`/admin/orders/${order.id}`);
    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not update the order." };
  }
}

export async function createOfflineOrder(input: unknown): Promise<AdminResult<{ avsNumber: string }>> {
  try {
    const staff = await guard();
    const parsed = offlineOrderSchema.safeParse(input);
    if (!parsed.success) return { ok: false, error: firstError(parsed.error) };
    const d = parsed.data;

    let customer = await prisma.customer.findFirst({
      where: { company: d.company, email: d.trackingEmail },
    });
    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          company: d.company,
          contactName: d.contactName || null,
          email: d.trackingEmail,
          phone: d.phone || null,
          address: d.deliveryAddress,
        },
      });
    }

    let avsNumber = generateAvsNumber();
    for (let i = 0; i < 5; i++) {
      const exists = await prisma.order.findUnique({ where: { avsNumber } });
      if (!exists) break;
      avsNumber = generateAvsNumber();
    }

    const order = await prisma.order.create({
      data: {
        avsNumber,
        poNumber: d.poNumber || null,
        customerId: customer.id,
        receivedVia: d.receivedVia,
        status: "CONFIRMED",
        deliveryType: d.deliveryType,
        expectedDate: d.expectedDate ? new Date(d.expectedDate) : null,
        deliveryAddress: d.deliveryAddress,
        trackingEmail: d.trackingEmail,
        itemsSummary: d.itemsSummary || null,
        events: { create: [{ status: "CONFIRMED", staffId: staff.id }] },
        activityLogs: {
          create: [
            {
              actorType: "STAFF",
              staffId: staff.id,
              action: `Order created from ${d.receivedVia.toLowerCase()} order`,
            },
          ],
        },
      },
    });

    await sendEmail({
      to: d.trackingEmail,
      subject: `Your AVS order ${avsNumber} — tracking details`,
      html: statusUpdateHtml({
        poNumber: order.poNumber,
        avsNumber,
        statusLabel: "Order confirmed",
        expected: formatDate(order.expectedDate),
      }),
      template: "offline_order_created",
      orderId: order.id,
    });

    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    return { ok: true, data: { avsNumber } };
  } catch {
    return { ok: false, error: "Could not create the order." };
  }
}

export async function respondDeliveryRequest(input: {
  requestId: string;
  decision: "APPROVE" | "DECLINE" | "SUGGEST";
  suggestedDate?: string;
  suggestedSlot?: string;
  reply?: string;
}): Promise<AdminResult> {
  try {
    const staff = await guard();
    const req = await prisma.deliveryRequest.findUnique({
      where: { id: input.requestId },
      include: { order: true },
    });
    if (!req) return { ok: false, error: "Request not found." };

    const status =
      input.decision === "APPROVE"
        ? "APPROVED"
        : input.decision === "DECLINE"
          ? "DECLINED"
          : "SLOT_SUGGESTED";

    await prisma.deliveryRequest.update({
      where: { id: req.id },
      data: {
        status,
        staffId: staff.id,
        staffReply: input.reply || null,
        suggestedDate: input.suggestedDate ? new Date(input.suggestedDate) : null,
        suggestedSlot: input.suggestedSlot || null,
      },
    });

    await prisma.activityLog.create({
      data: {
        orderId: req.orderId,
        actorType: "STAFF",
        staffId: staff.id,
        action: `Delivery request ${status.toLowerCase()}`,
        detail: input.reply || null,
      },
    });

    const decisionLabel =
      input.decision === "APPROVE" ? "approved" : input.decision === "DECLINE" ? "declined" : "updated with a new slot";
    const when =
      input.decision === "SUGGEST" && input.suggestedDate
        ? `${formatDate(new Date(input.suggestedDate))}${input.suggestedSlot ? ` · ${input.suggestedSlot}` : ""}`
        : req.requestedDate
          ? `${formatDate(req.requestedDate)}${req.requestedSlot ? ` · ${req.requestedSlot}` : ""}`
          : "—";

    await sendEmail({
      to: req.order.trackingEmail,
      subject: `Your delivery request — ${req.order.avsNumber}`,
      html: deliveryDecisionHtml({
        typeLabel: REQUEST_TYPE_LABEL[req.type] ?? req.type,
        decision: decisionLabel,
        when,
        poNumber: req.order.poNumber,
      }),
      template: "delivery_decision",
      orderId: req.orderId,
    });

    revalidatePath("/admin/requests");
    revalidatePath("/admin");
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not respond to the request." };
  }
}

export async function updateSettings(entries: Record<string, string>): Promise<AdminResult> {
  try {
    await guard();
    const ops = Object.entries(entries).map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        create: { key, value },
        update: { value },
      }),
    );
    await prisma.$transaction(ops);
    revalidatePath("/", "layout");
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not save settings." };
  }
}
