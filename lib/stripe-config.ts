/** Client-safe Stripe publishable key (used for Stripe.js / Elements when added). */
export const stripePublishableKey =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";

export function isStripeConfigured(): boolean {
  return Boolean(stripePublishableKey);
}
