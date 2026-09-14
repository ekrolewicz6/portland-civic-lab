/**
 * Generic transactional email sender.
 *
 * Shared by intake notifications and business invitations (Resend → SMTP),
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
  from?: string;
  idempotencyKey?: string;
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

async function sendViaResend(email: OutboundEmail): Promise<EmailReceipt | null> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = email.from || process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !from) return null;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...(email.idempotencyKey ? { "Idempotency-Key": email.idempotencyKey } : {}),
    },
    signal: AbortSignal.timeout(15000),
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
  const result = await response.json() as { id?: string };
  if (!result.id) throw new Error("Resend accepted email without a receipt ID");
  return { provider: "resend", id: result.id };
}

async function sendViaSmtp(email: OutboundEmail): Promise<EmailReceipt | null> {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = email.from || process.env.CONTACT_FROM_EMAIL || user;
  if (!host || !from) return null;

  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === "true" || port === 465,
    auth: user && pass ? { user, pass } : undefined,
    connectionTimeout: 10000,
    socketTimeout: 15000,
  });

  const result = await transporter.sendMail({
    to: email.to,
    from,
    replyTo: email.replyTo,
    subject: email.subject,
    text: email.text,
    html: email.html,
  });
  if (!result.accepted?.length) throw new Error("SMTP accepted no recipients");
  return { provider: "smtp", id: result.messageId };
}

export interface EmailReceipt {
  provider: EmailDelivery;
  id: string;
}

/** A receipt means provider acceptance, not confirmed inbox delivery. */
export async function sendEmailWithReceipt(email: OutboundEmail): Promise<EmailReceipt | null> {
  // Do not switch providers after an ambiguous failure: retries use the same
  // Resend idempotency key and cannot create a second SMTP copy.
  return (await sendViaResend(email)) ?? (await sendViaSmtp(email));
}

export async function sendEmail(email: OutboundEmail): Promise<EmailDelivery | null> {
  return (await sendEmailWithReceipt(email))?.provider ?? null;
}
