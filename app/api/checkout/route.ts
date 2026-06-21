import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { fetchProfileByClerkId } from "@/lib/user-profile-server";
import { getPriceIdForPlan, getStripe, type SubscriptionPlan } from "@/lib/stripe";

function isSubscriptionPlan(value: unknown): value is SubscriptionPlan {
  return value === "investor" || value === "pro";
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

    const profile = await fetchProfileByClerkId(userId).catch(() => null);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      client_reference_id: userId,
      customer: profile?.stripe_customer_id ?? undefined,
      subscription_data: {
        metadata: { plan, clerk_user_id: userId },
      },
      success_url: `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?canceled=true`,
      metadata: {
        plan,
        clerk_user_id: userId,
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
