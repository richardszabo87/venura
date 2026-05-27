import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }

  if (!stripeClient) {
    stripeClient = new Stripe(secretKey, {
      apiVersion: "2026-04-22.dahlia",
      typescript: true,
    });
  }

  return stripeClient;
}

export type SubscriptionPlan = "investor" | "pro";

export function getPriceIdForPlan(plan: SubscriptionPlan): string {
  const priceId =
    plan === "investor"
      ? process.env.STRIPE_INVESTOR_PRICE_ID
      : process.env.STRIPE_PRO_PRICE_ID;

  if (!priceId) {
    throw new Error(
      plan === "investor"
        ? "STRIPE_INVESTOR_PRICE_ID is not set"
        : "STRIPE_PRO_PRICE_ID is not set",
    );
  }

  return priceId;
}
