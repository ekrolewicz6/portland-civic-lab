import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@workos-inc/authkit-nextjs";
import sql from "@/lib/db-query";
import { getMemberByWorkOSId, isWorkOSConfigured } from "@/lib/membership";

export const dynamic = "force-dynamic";

/** Toggle the signed-in member's vote on a proposal. */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isWorkOSConfigured()) {
    return NextResponse.json({ ok: false, error: "Sign in to vote." }, { status: 401 });
  }

  let member;
  try {
    const { user } = await withAuth();
    member = user ? await getMemberByWorkOSId(user.id) : null;
  } catch {
    member = null;
  }
  if (!member) {
    return NextResponse.json({ ok: false, error: "Sign in to vote." }, { status: 401 });
  }
  if (member.status !== "active") {
    return NextResponse.json({ ok: false, error: "Account is not active." }, { status: 403 });
  }

  const { id } = await params;
  const proposalId = Number(id);
  if (!Number.isInteger(proposalId) || proposalId <= 0) {
    return NextResponse.json({ ok: false, error: "Invalid proposal." }, { status: 400 });
  }

  try {
    const deleted = await sql`
      DELETE FROM proposal_votes
      WHERE proposal_id = ${proposalId} AND member_id = ${member.id}
      RETURNING proposal_id
    `;
    if (deleted.length === 0) {
      await sql`
        INSERT INTO proposal_votes (proposal_id, member_id)
        VALUES (${proposalId}, ${member.id})
        ON CONFLICT DO NOTHING
      `;
    }
    const [count] = await sql`
      SELECT COUNT(*)::int AS votes FROM proposal_votes WHERE proposal_id = ${proposalId}
    `;
    return NextResponse.json({
      ok: true,
      voted: deleted.length === 0,
      votes: count.votes,
    });
  } catch (error) {
    console.error("[proposals/vote] failed:", error);
    return NextResponse.json(
      { ok: false, error: "Couldn't record your vote right now." },
      { status: 500 }
    );
  }
}
