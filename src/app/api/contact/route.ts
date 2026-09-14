import { NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { notifyIntake } from "@/lib/intake-notifications";

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
async function storeSubmission(payload: ContactPayload, request: Request) {
  if (!process.env.DATABASE_URL) return null;

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

  return id;
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
    const id = await storeSubmission(payload, request);
    if (id) {
      const receipt = await notifyIntake("contact_submissions", id);
      return NextResponse.json({ ok: true, delivery: receipt?.provider ?? "queued", id });
    }
    if (await storeLocalFallback(payload, request)) {
      return NextResponse.json({ ok: true, delivery: "local-file" });
    }
    return NextResponse.json(
      { ok: false, error: "Contact storage is unavailable. Please try again later." },
      { status: 503 },
    );
  } catch (error) {
    console.error("Contact form delivery failed", error);
    return NextResponse.json(
      { ok: false, error: "Unable to send this message right now." },
      { status: 502 }
    );
  }
}
