import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    configured: Boolean(process.env.STRIPE_SECRET_KEY?.trim()),
  });
}
