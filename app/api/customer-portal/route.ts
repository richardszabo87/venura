import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { fetchProfileByClerkId } from "@/lib/user-profile-server";
import { getStripe } from "@/lib/stripe";

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await fetchProfileByClerkId(userId);
  const customerId = profile?.stripe_customer_id;

  if (!customerId) {
    return NextResponse.json(
      { error: "No Stripe customer found. Subscribe to a plan first." },
      { status: 400 },
    );
  }

  try {
    const stripe = getStripe();
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: "https://venura.io/settings",
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error("Portal error:", error);
    const message =
      error instanceof Error ? error.message : "Could not open billing portal";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
