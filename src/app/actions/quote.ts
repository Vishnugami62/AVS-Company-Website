"use server";

import { prisma } from "@/lib/db";
import { quoteSchema, firstError } from "@/lib/validation";
import { rateLimit, getClientIp, assertSameOrigin } from "@/lib/security";
import { sendEmail, quoteReceivedHtml, teamAlertHtml } from "@/lib/email";

export type ActionResult =
  | { ok: true; ref: string }
  | { ok: false; error: string };

async function nextQuoteRef(): Promise<string> {
  const count = await prisma.quoteRequest.count();
  return `AVS-${String(count + 1).padStart(4, "0")}`;
}

export async function submitQuote(input: unknown): Promise<ActionResult> {
  try {
    await assertSameOrigin();
    const ip = await getClientIp();
    const rl = rateLimit(`quote:${ip}`, 5, 10 * 60 * 1000);
    if (!rl.ok) {
      return { ok: false, error: "Too many requests. Please try again in a few minutes." };
    }

    const parsed = quoteSchema.safeParse(input);
    if (!parsed.success) return { ok: false, error: firstError(parsed.error) };
    const d = parsed.data;

    let ref = await nextQuoteRef();
    let created = false;
    for (let attempt = 0; attempt < 3 && !created; attempt++) {
      try {
        await prisma.quoteRequest.create({
          data: {
            refNumber: ref,
            categoriesJson: JSON.stringify(d.categories ?? []),
            listText: d.listText,
            frequency: d.frequency ?? null,
            deliveryLocations: d.deliveryLocations,
            budget: d.budget,
            customPrint: d.customPrint,
            separateInvoice: d.separateInvoice,
            fullName: d.fullName,
            company: d.company,
            email: d.email,
            phone: d.phone,
            gstin: d.gstin || null,
            hearAbout: d.hearAbout || null,
            whatsappOptin: d.whatsappOptin,
            emailOptin: d.emailOptin,
          },
        });
        created = true;
      } catch {
        ref = await nextQuoteRef(); // ref collided; recompute and retry
      }
    }
    if (!created) return { ok: false, error: "Could not submit right now. Please try again." };

    // Confirmation to customer + internal alert to the team.
    await sendEmail({
      to: d.email,
      subject: `Quote request received — ${ref}`,
      html: quoteReceivedHtml(ref),
      template: "quote_received",
    });
    await sendEmail({
      to: process.env.TEAM_ALERT_EMAIL ?? "orders@example.com",
      subject: `New quote request: ${ref} (${d.company})`,
      html: teamAlertHtml({
        heading: `New quote request ${ref}`,
        rows: [
          ["Company", d.company],
          ["Contact", d.fullName],
          ["Email", d.email],
          ["Phone", d.phone],
          ["Categories", (d.categories ?? []).join(", ") || "—"],
        ],
        note: d.listText?.slice(0, 300),
      }),
      template: "quote_team_alert",
    });

    return { ok: true, ref };
  } catch {
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}
