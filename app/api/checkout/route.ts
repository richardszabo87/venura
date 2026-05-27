import { NextResponse } from "next/server";
import { getPriceIdForPlan, getStripe, type SubscriptionPlan } from "@/lib/stripe";

function isSubscriptionPlan(value: unknown): value is SubscriptionPlan {
  return value === "investor" || value === "pro";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const plan = body?.plan;

    if (!isSubscriptionPlan(plan)) {
      return NextResponse.json(
        { error: "Invalid plan. Use investor or pro." },
        { status: 400 },
      );
    }

    const stripe = getStripe();
    const priceId = getPriceIdForPlan(plan);
    const origin =
      request.headers.get("origin") ??
      process.env.NEXT_PUBLIC_APP_URL ??
      "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?canceled=true`,
      metadata: {
        plan,
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Failed to create checkout session" },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout session error:", error);
    const message =
      error instanceof Error ? error.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
