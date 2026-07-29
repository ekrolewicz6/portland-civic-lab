/**
 * Generic transactional email sender.
 *
 * Mirrors the delivery ladder in src/app/api/contact/route.ts (Resend → SMTP),
 * minus the contact-form-specific fallbacks. Returns the mode that delivered,
 * or null when nothing is configured — callers decide what to do then. The
 * business invite flow surfaces a shareable link instead of failing, so a
 * local demo works with no mail credentials at all.
 */

export interface OutboundEmail {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}

export type EmailDelivery = "resend" | "smtp";

export function htmlEscape(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function sendViaResend(email: OutboundEmail): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !from) return false;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: email.to,
      reply_to: email.replyTo,
      subject: email.subject,
      text: email.text,
      html: email.html,
    }),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "Unknown Resend error");
    throw new Error(`Resend delivery failed: ${response.status} ${details}`);
  }
  return true;
}

async function sendViaSmtp(email: OutboundEmail): Promise<boolean> {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.CONTACT_FROM_EMAIL || user;
  if (!host || !from) return false;

  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === "true" || port === 465,
    auth: user && pass ? { user, pass } : undefined,
  });

  await transporter.sendMail({
    to: email.to,
    from,
    replyTo: email.replyTo,
    subject: email.subject,
    text: email.text,
    html: email.html,
  });
  return true;
}

/**
 * Attempts delivery, returning the mode used or null if unconfigured.
 * Throws only when a configured provider actively fails.
 */
export async function sendEmail(
  email: OutboundEmail
): Promise<EmailDelivery | null> {
  if (await sendViaResend(email)) return "resend";
  if (await sendViaSmtp(email)) return "smtp";
  return null;
}
