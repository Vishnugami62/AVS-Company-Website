"use server";

import { prisma } from "@/lib/db";
import { contactSchema, firstError } from "@/lib/validation";
import { rateLimit, getClientIp, assertSameOrigin } from "@/lib/security";
import { sendEmail, teamAlertHtml } from "@/lib/email";

export type ContactResult = { ok: true } | { ok: false; error: string };

export async function submitContact(input: unknown): Promise<ContactResult> {
  try {
    await assertSameOrigin();
    const ip = await getClientIp();
    if (!rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000).ok) {
      return { ok: false, error: "Too many messages. Please try again shortly." };
    }

    const parsed = contactSchema.safeParse(input);
    if (!parsed.success) return { ok: false, error: firstError(parsed.error) };
    const d = parsed.data;

    await prisma.contactMessage.create({
      data: {
        name: d.name,
        company: d.company || null,
        email: d.email,
        phone: d.phone || null,
        interest: d.interest || null,
        message: d.message,
      },
    });

    await sendEmail({
      to: process.env.TEAM_ALERT_EMAIL ?? "orders@example.com",
      subject: `New contact message from ${d.name}`,
      html: teamAlertHtml({
        heading: "New contact message",
        rows: [
          ["Name", d.name],
          ["Company", d.company || "—"],
          ["Email", d.email],
          ["Phone", d.phone || "—"],
          ["Interested in", d.interest || "—"],
        ],
        note: d.message.slice(0, 400),
      }),
      template: "contact_message",
    });

    return { ok: true };
  } catch {
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}
