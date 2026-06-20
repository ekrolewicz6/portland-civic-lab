import { NextResponse } from "next/server";
import {
  lookupParcel,
  normalizeHouseholdIncomeBand,
  normalizeRelationship,
  parseCurrencyInput,
  type ParcelLookupResponse,
} from "@/lib/growth-politics/parcel-lookup";

export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<NextResponse<ParcelLookupResponse>> {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address")?.trim() ?? "";
  const assessedValue = parseCurrencyInput(searchParams.get("assessedValue"));
  const monthlyRent = parseCurrencyInput(searchParams.get("monthlyRent"));
  const relationship = normalizeRelationship(searchParams.get("relationship"));
  const householdIncomeBand = normalizeHouseholdIncomeBand(searchParams.get("householdIncomeBand"));

  if (!address) {
    return NextResponse.json({ ok: false, error: "Enter an address first." }, { status: 400 });
  }

  try {
    const lookup = await lookupParcel({ address, assessedValue, relationship, monthlyRent, householdIncomeBand });
    return NextResponse.json({ ok: true, lookup });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Parcel lookup failed.",
      },
      { status: 502 },
    );
  }
}
