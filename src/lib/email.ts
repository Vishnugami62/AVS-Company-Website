import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { prisma } from "./db";
import { escapeHtml } from "./security";

type SendArgs = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  template?: string;
  orderId?: string;
};

let cachedTransport: Transporter | null = null;
function getTransport(): Transporter | null {
  if (process.env.EMAIL_TRANSPORT !== "smtp") return null;
  if (cachedTransport) return cachedTransport;
  cachedTransport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT ?? 587) === 465,
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
  });
  return cachedTransport;
}

/**
 * Sends an email, or — in dev (EMAIL_TRANSPORT=log) — records and logs it
 * instead so the whole flow works with no mail server configured.
 */
export async function sendEmail(args: SendArgs): Promise<void> {
  const from = process.env.EMAIL_FROM ?? "AVS Company <orders@example.com>";
  const transport = getTransport();
  let status: "SENT" | "LOGGED" | "FAILED" = "LOGGED";

  try {
    if (transport) {
      await transport.sendMail({
        from,
        to: args.to,
        subject: args.subject,
        html: args.html,
        text: args.text ?? stripHtml(args.html),
      });
      status = "SENT";
    } else {
      // eslint-disable-next-line no-console
      console.log(
        `\n📧 [email:log] To: ${args.to}\n   Subject: ${args.subject}\n   (set EMAIL_TRANSPORT=smtp to send for real)\n`,
      );
    }
  } catch (err) {
    status = "FAILED";
    // eslint-disable-next-line no-console
    console.error("Email send failed:", err);
  }

  await prisma.emailLog.create({
    data: {
      toEmail: args.to,
      subject: args.subject,
      template: args.template ?? null,
      orderId: args.orderId ?? null,
      bodyText: stripHtml(args.html).slice(0, 4000),
      status,
    },
  });
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

const NAVY = "#13275A";
const GOLD = "#C99A3E";

function layout(title: string, bodyHtml: string): string {
  return `<!doctype html><html><body style="margin:0;background:#F6F0E4;font-family:Calibri,Segoe UI,Arial,sans-serif;color:#1A1D24;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F6F0E4;padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
        <tr><td style="background:${NAVY};border-radius:16px 16px 0 0;padding:22px 28px;color:#fff;">
          <div style="font-size:19px;font-weight:bold;letter-spacing:.5px;">AVS&nbsp;COMPANY</div>
          <div style="font-size:13px;color:${GOLD};font-style:italic;">Better Supplies for a Smoother Tomorrow</div>
        </td></tr>
        <tr><td style="background:#FFFCF6;padding:28px;border:1px solid #ecdfc8;border-top:0;">
          <h1 style="margin:0 0 14px;font-size:20px;color:${NAVY};">${title}</h1>
          ${bodyHtml}
        </td></tr>
        <tr><td style="background:#0E1D45;border-radius:0 0 16px 16px;padding:18px 28px;color:#c7cfe3;font-size:12px;">
          AVS Company · Mumbai, Maharashtra<br/>This is an automated message about your order.
        </td></tr>
      </table>
    </td></tr>
  </table></body></html>`;
}

function infoRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:7px 0;color:#5B6472;font-size:13px;width:150px;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:7px 0;color:#1A1D24;font-size:14px;font-weight:bold;">${escapeHtml(value)}</td>
  </tr>`;
}

function button(href: string, label: string): string {
  return `<a href="${escapeHtml(href)}" style="display:inline-block;margin-top:18px;background:${GOLD};color:#0E1D45;text-decoration:none;font-weight:bold;padding:12px 24px;border-radius:999px;font-size:14px;">${escapeHtml(label)}</a>`;
}

const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// --- Templates (customer-facing emails show only PO + status) ---

export function otpEmailHtml(code: string, orderRef: string): string {
  return layout(
    "Verify it's you",
    `<p style="font-size:14px;">Use this code to confirm your delivery request for order <strong>${escapeHtml(orderRef)}</strong>:</p>
     <div style="font-size:34px;letter-spacing:10px;font-weight:bold;color:${NAVY};background:#F6F0E4;border-radius:12px;padding:16px;text-align:center;margin:16px 0;">${escapeHtml(code)}</div>
     <p style="font-size:13px;color:#5B6472;">This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>`,
  );
}

export function quoteReceivedHtml(ref: string): string {
  return layout(
    "Your quote is on its way",
    `<p style="font-size:14px;">Thank you — we've received your request <strong>${escapeHtml(ref)}</strong>. Our team will send your itemised quote within 24 hours by email and WhatsApp.</p>
     <table role="presentation" width="100%">${infoRow("Reference", ref)}${infoRow("Status", "Under review")}</table>
     ${button(siteUrl(), "Visit AVS Company")}`,
  );
}

export function statusUpdateHtml(args: {
  poNumber: string | null;
  avsNumber: string;
  statusLabel: string;
  expected: string;
}): string {
  return layout(
    "Update on your order",
    `<p style="font-size:14px;">There's an update on your order.</p>
     <table role="presentation" width="100%">
       ${infoRow("PO number", args.poNumber ?? "—")}
       ${infoRow("AVS order no.", args.avsNumber)}
       ${infoRow("Status", args.statusLabel)}
       ${infoRow("Expected delivery", args.expected)}
     </table>
     ${button(`${siteUrl()}/track`, "Track your order")}`,
  );
}

export function deliveryRequestReceivedHtml(args: {
  typeLabel: string;
  when: string;
  poNumber: string | null;
}): string {
  return layout(
    "Request received",
    `<p style="font-size:14px;">We've received your delivery request for this order.</p>
     <table role="presentation" width="100%">
       ${infoRow("PO number", args.poNumber ?? "—")}
       ${infoRow("Request", args.typeLabel)}
       ${infoRow("Requested", args.when)}
       ${infoRow("Status", "Awaiting confirmation")}
     </table>
     <p style="font-size:13px;color:#5B6472;">We'll email you again as soon as our team confirms.</p>
     ${button(`${siteUrl()}/track`, "Track your order")}`,
  );
}

export function deliveryDecisionHtml(args: {
  typeLabel: string;
  decision: string;
  when: string;
  poNumber: string | null;
}): string {
  return layout(
    "Your delivery request",
    `<p style="font-size:14px;">Your delivery request has been <strong>${escapeHtml(args.decision)}</strong>.</p>
     <table role="presentation" width="100%">
       ${infoRow("PO number", args.poNumber ?? "—")}
       ${infoRow("Request", args.typeLabel)}
       ${infoRow("Decision", args.decision)}
       ${infoRow("Delivery", args.when)}
     </table>
     ${button(`${siteUrl()}/track`, "Track your order")}`,
  );
}

export function teamAlertHtml(args: {
  heading: string;
  rows: Array<[string, string]>;
  note?: string;
}): string {
  const rows = args.rows.map(([l, v]) => infoRow(l, v)).join("");
  return layout(
    args.heading,
    `<p style="font-size:14px;">Internal alert for the AVS orders team.</p>
     <table role="presentation" width="100%">${rows}</table>
     ${args.note ? `<p style="font-size:13px;color:#5B6472;">Note: ${escapeHtml(args.note)}</p>` : ""}
     ${button(`${siteUrl()}/admin`, "Open in Admin Panel")}`,
  );
}
