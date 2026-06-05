import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import {
  updateSubscriptionByStripeCustomer,
  updateSubscriptionTier,
} from "@/lib/user-profile-server";
import type { SubscriptionTier } from "@/lib/user-profile";
import { getSupabaseAdmin } from "@/lib/supabase";

function tierFromMetadata(
  metadata: Stripe.Metadata | null | undefined,
): SubscriptionTier | null {
  const plan = metadata?.plan;
  if (plan === "investor" || plan === "pro") return plan;
  return null;
}

async function findClerkIdByCustomer(customerId: string): Promise<string | null> {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("user_profiles")
    .select("clerk_user_id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();

  return (data as { clerk_user_id?: string } | null)?.clerk_user_id ?? null;
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET is not configured" },
      { status: 500 },
    );
  }

  const stripe = getStripe();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature error:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const clerkUserId =
          session.client_reference_id ??
          session.metadata?.clerk_user_id ??
          null;
        const customerId =
          typeof session.customer === "string" ? session.customer : null;
        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : null;
        const tier = tierFromMetadata(session.metadata) ?? "investor";

        if (clerkUserId) {
          await updateSubscriptionTier(clerkUserId, tier, {
            customerId: customerId ?? undefined,
            subscriptionId: subscriptionId ?? undefined,
          });
        } else if (customerId) {
          await updateSubscriptionByStripeCustomer(
            customerId,
            tier,
            subscriptionId ?? undefined,
          );
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : null;
        if (!customerId) break;

        const tier = tierFromMetadata(subscription.metadata);
        if (subscription.status === "active" || subscription.status === "trialing") {
          if (tier) {
            await updateSubscriptionByStripeCustomer(
              customerId,
              tier,
              subscription.id,
            );
          }
        } else if (
          subscription.status === "canceled" ||
          subscription.status === "unpaid" ||
          subscription.status === "past_due"
        ) {
          const clerkId = await findClerkIdByCustomer(customerId);
          if (clerkId) {
            await updateSubscriptionTier(clerkId, "free");
          } else {
            await updateSubscriptionByStripeCustomer(customerId, "free");
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : null;
        if (customerId) {
          await updateSubscriptionByStripeCustomer(customerId, "free");
        }
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook handler error:", error);
    const message = error instanceof Error ? error.message : "Webhook failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
