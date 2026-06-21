import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { fetchProfileByClerkId } from "@/lib/user-profile-server";
import { getStripe } from "@/lib/stripe";
import {
  getPlanName,
  getPlanPrice,
  getSubscriptionTier,
} from "@/lib/subscription";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const profile = await fetchProfileByClerkId(userId);
    const tier = getSubscriptionTier(profile);

    let nextBillingDate: string | null = null;

    if (profile?.stripe_subscription_id) {
      try {
        const stripe = getStripe();
        const subscription = await stripe.subscriptions.retrieve(
          profile.stripe_subscription_id,
        );

        const periodEnd = subscription.items.data[0]?.current_period_end;

        if (
          periodEnd &&
          (subscription.status === "active" ||
            subscription.status === "trialing")
        ) {
          nextBillingDate = new Date(periodEnd * 1000).toISOString();
        }
      } catch (error) {
        console.error("Failed to fetch Stripe subscription:", error);
      }
    }

    return NextResponse.json({
      tier,
      planName: getPlanName(tier),
      pricePerMonth: getPlanPrice(tier),
      nextBillingDate,
      hasStripeCustomer: Boolean(profile?.stripe_customer_id),
    });
  } catch (error) {
    console.error("Subscription fetch error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to load subscription";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
