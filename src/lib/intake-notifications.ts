import sql from "@/lib/db-query";
import { sendEmailWithReceipt, type OutboundEmail } from "@/lib/email";

export type IntakeSource = "contact_submissions" | "data_flags" | "topic_proposals" | "pcb_applications";

export function buildIntakeEmail(source: IntakeSource, payload: Record<string, unknown>): OutboundEmail {
  const to = process.env.CONTACT_TO_EMAIL?.trim();
  const from = process.env.CONTACT_FROM_EMAIL?.trim();
  if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) throw new Error("CONTACT_TO_EMAIL must be a valid inbox");
  if (!from) throw new Error("CONTACT_FROM_EMAIL is required");
  const titles: Record<IntakeSource, string> = {
    contact_submissions: "contact",
    data_flags: "data correction",
    topic_proposals: "topic proposal",
    pcb_applications: "application",
  };
  const detail = payload.topic || payload.title || payload.question || payload.business_name;
  const reply = payload.email || payload.reporter_email;
  const fields = Object.entries(payload).filter(([key, value]) =>
    !["client_ip", "user_agent", "raw_payload", "delivery", "_recovered"].includes(key) && value !== null,
  );
  return {
    to,
    from,
    subject: `${payload._recovered ? "[Recovered] " : ""}Portland Civic Lab ${titles[source]}${detail ? `: ${String(detail).replace(/[\r\n]/g, " ").slice(0, 120)}` : ""}`,
    replyTo: typeof reply === "string" && reply ? reply : undefined,
    text: [
      `${payload._recovered ? "Recovered" : "New"} Portland Civic Lab ${titles[source]}`,
      "",
      ...fields.map(([key, value]) => `${key.replaceAll("_", " ")}: ${typeof value === "object" ? JSON.stringify(value, null, 2) : String(value)}`),
      "",
      "This submission is saved in the Lab database. Reply to this email to contact the sender when a reply address was provided.",
    ].join("\n\n"),
  };
}

/** Atomically claim one notification; a crashed worker's lease expires. */
export async function deliverIntakeNotification(source: IntakeSource, sourceId: string) {
  const [row] = await sql`
    update intake_notifications set status = 'sending', attempts = attempts + 1,
      next_attempt_at = now() + interval '2 minutes'
    where source = ${source} and source_id = ${sourceId}
      and status in ('pending', 'sending') and next_attempt_at <= now()
    returning *
  `;
  if (!row) return null;
  try {
    // Resend's idempotency window is 24h. After 23h, require review rather
    // than risking a duplicate when an earlier response may have been lost.
    if (row.first_attempt_at && Date.now() - new Date(row.first_attempt_at).getTime() > 23 * 60 * 60 * 1000) {
      throw new Error("Manual review required: provider idempotency window is expiring");
    }
    if (!process.env.RESEND_API_KEY && !process.env.SMTP_HOST) {
      throw new Error("No email provider is configured");
    }
    const email = (row.request_payload as OutboundEmail | null) ?? {
      ...buildIntakeEmail(source, row.payload),
      idempotencyKey: `intake/${row.id}`,
    };
    if (!row.request_payload) {
      await sql`update intake_notifications set request_payload = ${sql.json(email as unknown as Parameters<typeof sql.json>[0])}, first_attempt_at = now() where id = ${row.id}`;
    }
    const receipt = await sendEmailWithReceipt(email);
    if (!receipt) throw new Error("No email provider is configured");
    await sql`update intake_notifications set status = 'sent', provider = ${receipt.provider}, provider_id = ${receipt.id}, accepted_at = now(), last_error = null where id = ${row.id}`;
    if (source === "contact_submissions") {
      await sql`update contact_submissions set delivery = ${receipt.provider} where id = ${sourceId}`;
    }
    return receipt;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Notification failed";
    const expired = message.startsWith("Manual review required:");
    await sql`update intake_notifications set status = ${expired ? "failed" : "pending"}, last_error = ${message.slice(0, 1000)}, next_attempt_at = now() + interval '5 minutes' where id = ${row.id}`;
    console.error("[intake-notifications] delivery pending", { id: row.id, source, error: message });
    return null;
  }
}

/** Original submission is already committed. A failed send must not lose it. */
export async function notifyIntake(source: IntakeSource, sourceId: string) {
  try {
    return await deliverIntakeNotification(source, sourceId);
  } catch (error) {
    console.error("[intake-notifications] worker unavailable", { source, sourceId, error: error instanceof Error ? error.message : "Unknown error" });
    return null;
  }
}
