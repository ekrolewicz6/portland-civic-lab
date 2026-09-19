import { beforeAll, beforeEach, afterAll, describe, expect, it, vi } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { NextRequest } from "next/server";

const state = vi.hoisted(() => ({ db: null as unknown as PGlite }));
vi.mock("@/lib/db-query", () => {
  const sql = Object.assign(async (parts: TemplateStringsArray, ...params: unknown[]) => {
    const query = parts.reduce((s, part, i) => s + (i ? `$${i}` : "") + part, "");
    return (await state.db.query(query, params)).rows;
  }, { json: (value: unknown) => JSON.stringify(value) });
  return { default: sql };
});
vi.mock("@workos-inc/authkit-nextjs", () => ({ withAuth: async () => ({ user: { id: "test-user" } }) }));
vi.mock("@/lib/membership", () => ({
  isWorkOSConfigured: () => true,
  getMemberByWorkOSId: async () => ({ id: 1, status: "active" }),
}));
import { POST as contact } from "@/app/api/contact/route";
import { POST as flag } from "@/app/api/data-flags/route";
import { POST as proposal } from "@/app/api/proposals/route";
import { POST as application } from "@/app/api/pcb/apply/route";
import { GET as retry } from "@/app/api/cron/retry-notifications/route";
import { notifyIntake } from "@/lib/intake-notifications";

const send = vi.fn<typeof fetch>();
const contactPayload = { name: "Audit Tester", email: "sender@example.com", topic: "General note", message: "A real-length test message for the notification pipeline.", website: "" };
function request(path: string, payload: unknown) {
  return new NextRequest(`https://example.com${path}`, { method: "POST", headers: { "Content-Type": "application/json", "x-forwarded-for": crypto.randomUUID() }, body: JSON.stringify(payload) });
}
async function rows(table = "intake_notifications") { return (await state.db.query<Record<string, unknown>>(`select * from ${table}`)).rows; }

beforeAll(async () => {
  state.db = new PGlite();
  await state.db.exec(`
    CREATE TABLE members (id serial primary key, workos_user_id text, email text, first_name text, last_name text, avatar_url text, role text default 'member', status text default 'active', neighborhood text, interests jsonb, joined_at timestamptz default now(), last_seen_at timestamptz default now());
    INSERT INTO members (id, email) VALUES (1, 'member@example.com'); SELECT setval('members_id_seq', 1);
    CREATE TABLE data_flags (id serial primary key, question text, metric text, message text, reporter_email text, member_id integer);
    CREATE TABLE topic_proposals (id serial primary key, title text, description text, member_id integer);
    CREATE TABLE proposal_votes (proposal_id integer, member_id integer, primary key (proposal_id,member_id));
  `);
  for (const file of ["0007_contact_submissions.sql", "0012_pcb_applications.sql", "0015_intake_notifications.sql", "0016_member_registration_notifications.sql"]) {
    await state.db.exec(readFileSync(`drizzle/${file}`, "utf8"));
  }
});
beforeEach(async () => {
  await state.db.exec("TRUNCATE contact_submissions, data_flags, topic_proposals, proposal_votes, pcb_applications, intake_notifications RESTART IDENTITY");
  await state.db.exec("DELETE FROM members WHERE id <> 1");
  vi.stubEnv("DATABASE_URL", "postgres://test-only");
  vi.stubEnv("RESEND_API_KEY", "test-key");
  vi.stubEnv("CONTACT_FROM_EMAIL", "Lab <lab@example.com>");
  vi.stubEnv("CONTACT_TO_EMAIL", "owner@example.com");
  vi.stubEnv("CRON_SECRET", "test-cron");
  send.mockReset().mockImplementation(async () => Response.json({ id: "receipt-test" }));
  vi.stubGlobal("fetch", send);
});
afterAll(async () => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); await state.db.close(); });

describe("durable contact notifications", () => {
  it.each(["General note", "Commission research or a build", "Property screening", "Institutional work", "Founding support", "Backing the company", "Advising the Lab", "Work on a topic", "Partnership", "Data correction", "Volunteering", "Permitting tools", "Dashboard or analysis request"])("stores and emails the %s form", async (topic) => {
    const response = await contact(request("/api/contact", { ...contactPayload, topic }));
    expect(response.status).toBe(200);
    expect((await response.json()).delivery).toBe("resend");
    expect(await rows("contact_submissions")).toHaveLength(1);
    const [notification] = await rows();
    expect(notification).toMatchObject({ status: "sent", provider_id: "receipt-test", attempts: 1 });
    const body = JSON.parse(String(send.mock.calls[0][1]?.body));
    expect(body).toMatchObject({ to: "owner@example.com", from: "Lab <lab@example.com>", reply_to: "sender@example.com" });
    expect(body.text).toContain(contactPayload.message);
    expect(body.subject).toContain(topic);
  });
  it("saves during provider failure, then retries exactly the same request once", async () => {
    send.mockResolvedValueOnce(Response.json({ message: "Unavailable" }, { status: 503 }));
    const response = await contact(request("/api/contact", contactPayload));
    expect((await response.json()).delivery).toBe("queued");
    const [saved] = await rows("contact_submissions");
    expect((await rows())[0]).toMatchObject({ status: "pending", attempts: 1 });
    await state.db.exec("UPDATE intake_notifications SET next_attempt_at = now()");
    await Promise.all([notifyIntake("contact_submissions", String(saved.id)), notifyIntake("contact_submissions", String(saved.id))]);
    expect(send).toHaveBeenCalledTimes(2);
    expect(send.mock.calls[1][1]?.body).toBe(send.mock.calls[0][1]?.body);
    expect(send.mock.calls[1][1]?.headers).toEqual(send.mock.calls[0][1]?.headers);
    expect((await rows())[0].status).toBe("sent");
    await notifyIntake("contact_submissions", String(saved.id));
    expect(send).toHaveBeenCalledTimes(2);
  });
  it("keeps records when configuration is missing", async () => {
    vi.stubEnv("CONTACT_TO_EMAIL", "");
    const response = await contact(request("/api/contact", contactPayload));
    expect((await response.json()).delivery).toBe("queued");
    expect((await rows())[0].status).toBe("pending");
    expect(send).not.toHaveBeenCalled();
  });
  it("does not acknowledge or email a record whose transaction failed", async () => {
    await state.db.exec("ALTER TABLE intake_notifications ADD CONSTRAINT simulate_storage_failure CHECK (false) NOT VALID");
    try {
      const response = await contact(request("/api/contact", contactPayload));
      expect(response.status).toBe(502);
      expect(await rows("contact_submissions")).toHaveLength(0);
      expect(send).not.toHaveBeenCalled();
    } finally { await state.db.exec("ALTER TABLE intake_notifications DROP CONSTRAINT simulate_storage_failure"); }
  });
  it("rejects invalid payloads and silently drops honeypot submissions", async () => {
    expect((await contact(request("/api/contact", { ...contactPayload, email: "invalid" }))).status).toBe(400);
    expect((await contact(request("/api/contact", { ...contactPayload, website: "spam.example" }))).status).toBe(200);
    expect(await rows()).toHaveLength(0);
    expect(send).not.toHaveBeenCalled();
  });
  it("queues a dashboard correction and preserves reply-to", async () => {
    expect((await flag(request("/api/data-flags", { question: "housing", message: "Please check this housing figure.", email: "reporter@example.com" }))).status).toBe(200);
    expect((await rows())[0]).toMatchObject({ source: "data_flags", status: "sent" });
    expect(JSON.parse(String(send.mock.calls[0][1]?.body)).reply_to).toBe("reporter@example.com");
  });
  it("queues member proposals with the member's reply address", async () => {
    expect((await proposal(request("/api/proposals", { title: "A new research question", description: "Please investigate this important local question." }))).status).toBe(200);
    expect((await rows())[0]).toMatchObject({ source: "topic_proposals", status: "sent" });
    expect(JSON.parse(String(send.mock.calls[0][1]?.body)).reply_to).toBe("member@example.com");
  });
  it("queues legacy applications with their full details", async () => {
    const payload = { businessName: "Test business", address: "123 Test St", entityType: "llc", ownerNames: "Test Owner", email: "owner-business@example.com", phone: "5035550100", numEmployees: 2, pctOregonResidents: 100, description: "A test application for routing verification.", sector: "other", yearFounded: "2026", eligibility: { headquarteredInPortland: true, fewerThan500Employees: true, oregonResidentEmployees: true, majorityOwnedByNaturalPersons: true, newOrGrowing: true, threeYearCommitment: true } };
    expect((await application(request("/api/pcb/apply", payload))).status).toBe(200);
    expect((await rows())[0]).toMatchObject({ source: "pcb_applications", status: "sent" });
    expect(JSON.parse(String(send.mock.calls[0][1]?.body)).text).toContain(payload.description);
  });
  it("protects retries and recovers an expired worker lease", async () => {
    await state.db.query("insert into contact_submissions (id,delivery,name,email,message,raw_payload) values ($1,'database','Test','sender@example.com','A test message','{}')", [crypto.randomUUID()]);
    await state.db.exec("update intake_notifications set status='sending', next_attempt_at=now()-interval '1 minute'");
    expect((await retry(new Request("https://example.com/api/cron/retry-notifications"))).status).toBe(401);
    const response = await retry(new Request("https://example.com/api/cron/retry-notifications", { headers: { authorization: "Bearer test-cron" } }));
    expect(await response.json()).toMatchObject({ ok: true, sent: 1, pending: 0 });
  });
  it("requires review beyond the provider idempotency window", async () => {
    const id = crypto.randomUUID();
    await state.db.query("insert into contact_submissions (id,delivery,name,email,message,raw_payload) values ($1,'database','Test','sender@example.com','A test message','{}')", [id]);
    await state.db.exec("update intake_notifications set first_attempt_at=now()-interval '24 hours'");
    await notifyIntake("contact_submissions", id);
    expect((await rows())[0].status).toBe("failed");
    expect(send).not.toHaveBeenCalled();
  });
});

describe("member registration notifications", () => {
  it("emails the inbox when a new member row is inserted, and not on later sign-ins", async () => {
    const [{ id }] = (await state.db.query<{ id: number }>(
      "insert into members (workos_user_id, email, first_name, last_name, avatar_url) values ('user_new', 'new@example.com', 'New', 'Member', 'https://img.example/x.png') returning id",
    )).rows;
    expect(await rows()).toHaveLength(1);
    expect(await notifyIntake("members", String(id))).toEqual({ provider: "resend", id: "receipt-test" });
    const body = JSON.parse(String(send.mock.calls[0][1]?.body));
    expect(body.to).toBe("owner@example.com");
    expect(body.subject).toBe("Portland Civic Lab new member: New Member");
    expect(body.reply_to).toBe("new@example.com");
    expect(body.text).toContain("email: new@example.com");
    expect(body.text).not.toContain("user_new");
    expect(body.text).not.toContain("img.example");
    // A returning member's sign-in has nothing pending: no second email.
    expect(await notifyIntake("members", String(id))).toBeNull();
    expect(send).toHaveBeenCalledTimes(1);
    expect((await rows())[0].status).toBe("sent");
  });
});
