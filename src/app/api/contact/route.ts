import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(180),
  organization: z.string().trim().max(160).optional().or(z.literal("")),
  topic: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().min(10).max(5000),
  website: z.string().trim().max(200).optional().or(z.literal("")),
});

type ContactPayload = z.infer<typeof contactSchema>;
type DeliveryMode = "resend" | "smtp" | "database" | "local-file";

function htmlEscape(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildSubject(payload: ContactPayload) {
  const topic = payload.topic?.trim();
  const suffix = topic ? `: ${topic}` : "";
  return `Portland Civic Lab contact${suffix}`;
}

function buildTextBody(payload: ContactPayload, request: Request) {
  return [
    "New Portland Civic Lab contact form submission",
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Organization: ${payload.organization || "Not provided"}`,
    `Topic: ${payload.topic || "Not provided"}`,
    "",
    "Message:",
    payload.message,
    "",
    `Submitted: ${new Date().toISOString()}`,
    `User agent: ${request.headers.get("user-agent") || "Unknown"}`,
  ].join("\n");
}

function buildHtmlBody(payload: ContactPayload, request: Request) {
  const fields = [
    ["Name", payload.name],
    ["Email", payload.email],
    ["Organization", payload.organization || "Not provided"],
    ["Topic", payload.topic || "Not provided"],
    ["Submitted", new Date().toISOString()],
    ["User agent", request.headers.get("user-agent") || "Unknown"],
  ];

  return `
    <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #172018; line-height: 1.5;">
      <h1 style="font-size: 20px; margin: 0 0 18px;">New Portland Civic Lab contact form submission</h1>
      <table style="border-collapse: collapse; margin-bottom: 20px;">
        <tbody>
          ${fields
            .map(
              ([label, value]) => `
                <tr>
                  <th style="text-align: left; vertical-align: top; padding: 6px 14px 6px 0; color: #667161;">${htmlEscape(label)}</th>
                  <td style="padding: 6px 0;">${htmlEscape(value)}</td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
      <div style="border-left: 3px solid #c58542; padding-left: 16px; white-space: pre-wrap;">${htmlEscape(
        payload.message
      )}</div>
    </div>
  `;
}

async function sendViaResend(payload: ContactPayload, request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) return false;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: payload.email,
      subject: buildSubject(payload),
      text: buildTextBody(payload, request),
      html: buildHtmlBody(payload, request),
    }),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "Unknown Resend error");
    throw new Error(`Resend delivery failed: ${response.status} ${details}`);
  }

  return true;
}

async function sendViaSmtp(payload: ContactPayload, request: Request) {
  const to = process.env.CONTACT_TO_EMAIL;
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.CONTACT_FROM_EMAIL || user;

  if (!to || !host || !from) return false;

  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === "true" || port === 465,
    auth: user && pass ? { user, pass } : undefined,
  });

  await transporter.sendMail({
    to,
    from,
    replyTo: payload.email,
    subject: buildSubject(payload),
    text: buildTextBody(payload, request),
    html: buildHtmlBody(payload, request),
  });

  return true;
}

function canStoreDatabaseFallback() {
  return (
    Boolean(process.env.DATABASE_URL) &&
    (Boolean(process.env.VERCEL) || process.env.CONTACT_DATABASE_FALLBACK === "true")
  );
}

async function storeDatabaseFallback(payload: ContactPayload, request: Request) {
  if (!canStoreDatabaseFallback()) return false;

  const { default: sql } = await import("@/lib/db-query");
  const id = crypto.randomUUID();
  const submittedAt = new Date().toISOString();

  // Table lives in drizzle/0007_contact_submissions.sql
  await sql`
    insert into contact_submissions (
      id,
      submitted_at,
      delivery,
      name,
      email,
      organization,
      topic,
      message,
      client_ip,
      user_agent,
      raw_payload
    )
    values (
      ${id},
      ${submittedAt},
      'database',
      ${payload.name},
      ${payload.email},
      ${payload.organization || null},
      ${payload.topic || null},
      ${payload.message},
      ${getClientIp(request)},
      ${request.headers.get("user-agent") || "Unknown"},
      ${sql.json({
        name: payload.name,
        email: payload.email,
        organization: payload.organization || null,
        topic: payload.topic || null,
        message: payload.message,
      })}
    )
  `;

  return true;
}

function canStoreLocalFallback() {
  if (process.env.CONTACT_STORE_FALLBACK === "true") return true;

  // Localhost needs a complete form flow before mail credentials exist.
  // Do not silently rely on Vercel's ephemeral filesystem in deployed builds.
  return !process.env.VERCEL;
}

async function storeLocalFallback(payload: ContactPayload, request: Request) {
  if (!canStoreLocalFallback()) return false;

  const [{ mkdir, appendFile }, path] = await Promise.all([
    import("node:fs/promises"),
    import("node:path"),
  ]);

  const directory =
    process.env.CONTACT_FALLBACK_DIR ||
    path.join(process.cwd(), "runtime-data", "contact-submissions");
  const filePath = path.join(directory, "submissions.jsonl");

  await mkdir(directory, { recursive: true });
  await appendFile(
    filePath,
    `${JSON.stringify({
      id: crypto.randomUUID(),
      submittedAt: new Date().toISOString(),
      delivery: "local-file",
      client: {
        ip: getClientIp(request),
        userAgent: request.headers.get("user-agent") || "Unknown",
      },
      payload: {
        name: payload.name,
        email: payload.email,
        organization: payload.organization || null,
        topic: payload.topic || null,
        message: payload.message,
      },
    })}\n`,
    "utf8"
  );

  return true;
}

export async function POST(request: Request) {
  if (!checkRateLimit(`contact:${getClientIp(request)}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json(
      { ok: false, error: "Too many messages. Please try again later." },
      { status: 429 }
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please complete the required fields." },
      { status: 400 }
    );
  }

  const payload = parsed.data;

  if (payload.website) {
    return NextResponse.json({ ok: true });
  }

  try {
    let delivery: DeliveryMode | null = null;

    if (await sendViaResend(payload, request)) {
      delivery = "resend";
    } else if (await sendViaSmtp(payload, request)) {
      delivery = "smtp";
    } else if (await storeDatabaseFallback(payload, request)) {
      delivery = "database";
    } else if (await storeLocalFallback(payload, request)) {
      delivery = "local-file";
    }

    if (!delivery) {
      return NextResponse.json(
        { ok: false, error: "Contact delivery is not configured yet." },
        { status: 503 }
      );
    }

    return NextResponse.json({ ok: true, delivery });
  } catch (error) {
    console.error("Contact form delivery failed", error);
    return NextResponse.json(
      { ok: false, error: "Unable to send this message right now." },
      { status: 502 }
    );
  }
}
