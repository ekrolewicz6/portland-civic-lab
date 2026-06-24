import Stripe from "stripe";
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const checkoutSchema = z.object({
  amount: z.coerce
    .number()
    .min(1, "Minimum support amount is $1")
    .max(10000, "Maximum online support amount is $10,000"),
  frequency: z.enum(["monthly", "once"]),
});

function getBaseUrl(request: Request) {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");

  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secretKey) return null;
  return new Stripe(secretKey);
}

export async function POST(request: Request) {
  const stripe = getStripe();

  if (!stripe) {
    return NextResponse.json(
      {
        error:
          "Stripe support payments are not fully configured. Add STRIPE_SECRET_KEY on the server.",
      },
      { status: 503 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid support request." },
      { status: 400 },
    );
  }

  const { amount, frequency } = parsed.data;
  const unitAmount = Math.round(amount * 100);
  const baseUrl = getBaseUrl(request);
  const isMonthly = frequency === "monthly";

  const session = await stripe.checkout.sessions.create({
    mode: isMonthly ? "subscription" : "payment",
    submit_type: isMonthly ? undefined : "pay",
    billing_address_collection: "auto",
    allow_promotion_codes: false,
    customer_creation: isMonthly ? undefined : "if_required",
    success_url: `${baseUrl}/donate/thank-you?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/donate?canceled=true`,
    metadata: {
      product: "portland_civic_lab_donation",
      frequency,
    },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: unitAmount,
          product_data: {
            name: isMonthly
              ? "Monthly support for Portland Civic Lab"
              : "One-time support for Portland Civic Lab",
            description:
              "Supports public dashboards, civic measurement, and practical tools for Portland.",
          },
          ...(isMonthly ? { recurring: { interval: "month" as const } } : {}),
        },
      },
    ],
  });

  if (!session.url) {
    return NextResponse.json(
      { error: "Stripe did not return a Checkout URL." },
      { status: 502 },
    );
  }

  return NextResponse.json({ url: session.url });
}
