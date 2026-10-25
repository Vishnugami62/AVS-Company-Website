"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { deliveryRequestSchema, otpVerifySchema, firstError } from "@/lib/validation";
import { rateLimit, getClientIp, assertSameOrigin } from "@/lib/security";
import {
  sendEmail,
  otpEmailHtml,
  deliveryRequestReceivedHtml,
  teamAlertHtml,
} from "@/lib/email";
import { numericCode } from "@/lib/nanoid";
import { normalizeLookup } from "@/lib/utils";
import { REQUEST_TYPE_LABEL } from "@/lib/constants";

const OTP_TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  if (!domain) return "your registered email";
  const u = user.length <= 2 ? user[0] + "•" : user.slice(0, 2) + "•••";
  const [dName, ...rest] = domain.split(".");
  const d = dName.length <= 1 ? dName + "•" : dName[0] + "•••";
  return `${u}@${d}.${rest.join(".")}`;
}

function describeWhen(type: string, date: Date | null, slot: string): string {
  if (type === "URGENT") return date ? `Needed by ${date.toDateString()}` : "As soon as possible";
  if (date) return `${date.toDateString()}${slot ? ` · ${slot}` : ""}`;
  return slot || "—";
}

export type StartResult =
  | { ok: true; otpId: string; emailHint: string }
  | { ok: false; error: string };

/** Step 1: validate the request and email a one-time code to the order's address. */
export async function startDeliveryRequest(input: unknown): Promise<StartResult> {
  try {
    await assertSameOrigin();
    const parsed = deliveryRequestSchema.safeParse(input);
    if (!parsed.success) return { ok: false, error: firstError(parsed.error) };
    const d = parsed.data;

    const ip = await getClientIp();
    if (!rateLimit(`delivery:${ip}:${normalizeLookup(d.avsNumber)}`, 5, 15 * 60 * 1000).ok) {
      return { ok: false, error: "Too many requests for this order. Please try again later." };
    }

    const order = await prisma.order.findUnique({
      where: { avsNumber: normalizeLookup(d.avsNumber) },
      select: { id: true, trackingEmail: true },
    });
    // Always behave the same whether or not the order exists / for which email,
    // to avoid leaking which orders or emails are valid.
    if (!order || !order.trackingEmail) {
      return {
        ok: true,
        otpId: "pending",
        emailHint: "the email registered for this order",
      };
    }

    const date = d.requestedDate ? new Date(d.requestedDate) : null;
    const code = numericCode(6);
    const codeHash = await bcrypt.hash(code, 10);

    const otp = await prisma.otpCode.create({
      data: {
        email: order.trackingEmail,
        codeHash,
        purpose: "DELIVERY_REQUEST",
        orderId: order.id,
        expiresAt: new Date(Date.now() + OTP_TTL_MS),
        payloadJson: JSON.stringify({
          type: d.type,
          requestedDate: date ? date.toISOString() : null,
          requestedSlot: d.requestedSlot,
          details: d.details,
          customerNote: d.customerNote,
        }),
      },
    });

    await sendEmail({
      to: order.trackingEmail,
      subject: "Your AVS verification code",
      html: otpEmailHtml(code, normalizeLookup(d.avsNumber)),
      template: "otp",
      orderId: order.id,
    });

    return { ok: true, otpId: otp.id, emailHint: maskEmail(order.trackingEmail) };
  } catch {
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

export type VerifyResult = { ok: true } | { ok: false; error: string };

/** Step 2: verify the code and create the delivery request. */
export async function verifyDeliveryOtp(input: unknown): Promise<VerifyResult> {
  try {
    await assertSameOrigin();
    const parsed = otpVerifySchema.safeParse(input);
    if (!parsed.success) return { ok: false, error: firstError(parsed.error) };
    const { otpId, code } = parsed.data;

    const ip = await getClientIp();
    if (!rateLimit(`otp:${ip}`, 10, 15 * 60 * 1000).ok) {
      return { ok: false, error: "Too many attempts. Please try again later." };
    }

    const otp = await prisma.otpCode.findUnique({ where: { id: otpId } });
    if (!otp || otp.consumedAt || otp.expiresAt < new Date()) {
      return { ok: false, error: "This code has expired. Please request a new one." };
    }
    if (otp.attempts >= MAX_ATTEMPTS) {
      return { ok: false, error: "Too many incorrect attempts. Please request a new code." };
    }

    const match = await bcrypt.compare(code, otp.codeHash);
    if (!match) {
      await prisma.otpCode.update({
        where: { id: otp.id },
        data: { attempts: { increment: 1 } },
      });
      return { ok: false, error: "That code isn't right. Please check and try again." };
    }

    const payload = JSON.parse(otp.payloadJson ?? "{}") as {
      type: string;
      requestedDate: string | null;
      requestedSlot: string;
      details: string;
      customerNote: string;
    };
    const reqDate = payload.requestedDate ? new Date(payload.requestedDate) : null;

    const order = await prisma.order.findUnique({
      where: { id: otp.orderId ?? "" },
      select: { id: true, avsNumber: true, poNumber: true, trackingEmail: true },
    });
    if (!order) return { ok: false, error: "Order not found." };

    await prisma.$transaction([
      prisma.deliveryRequest.create({
        data: {
          orderId: order.id,
          type: payload.type,
          requestedDate: reqDate,
          requestedSlot: payload.requestedSlot || null,
          details: payload.details || null,
          customerNote: payload.customerNote || null,
          emailVerified: true,
        },
      }),
      prisma.otpCode.update({
        where: { id: otp.id },
        data: { consumedAt: new Date() },
      }),
      prisma.activityLog.create({
        data: {
          orderId: order.id,
          actorType: "SYSTEM",
          action: "Delivery change requested",
          detail: `${REQUEST_TYPE_LABEL[payload.type] ?? payload.type} · verified by email`,
        },
      }),
    ]);

    const when = describeWhen(payload.type, reqDate, payload.requestedSlot);
    await sendEmail({
      to: order.trackingEmail,
      subject: `Request received — ${order.avsNumber}`,
      html: deliveryRequestReceivedHtml({
        typeLabel: REQUEST_TYPE_LABEL[payload.type] ?? payload.type,
        when,
        poNumber: order.poNumber,
      }),
      template: "delivery_request_received",
      orderId: order.id,
    });
    await sendEmail({
      to: process.env.TEAM_ALERT_EMAIL ?? "orders@example.com",
      subject: `New delivery request: ${order.avsNumber}`,
      html: teamAlertHtml({
        heading: `New request: ${REQUEST_TYPE_LABEL[payload.type] ?? payload.type}`,
        rows: [
          ["Order", order.avsNumber],
          ["PO", order.poNumber ?? "—"],
          ["Requested", when],
          ["Verified", "Email code confirmed"],
        ],
        note: payload.customerNote || payload.details,
      }),
      template: "delivery_request_team",
      orderId: order.id,
    });

    return { ok: true };
  } catch {
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}
