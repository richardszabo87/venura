"use client";

import { useState } from "react";
import { isStripeConfigured } from "@/lib/stripe-config";

type PlanId = "free" | "investor" | "pro";

const PLANS: {
  id: PlanId;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  excluded?: string[];
  cta: string;
  highlighted: boolean;
}[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "forever",
    description: "Get started with basic property analysis.",
    features: [
      "Property analyzer (3 deals/mo)",
      "Cash flow & cap rate metrics",
      "50% rule check",
      "Basic verdict scoring",
    ],
    excluded: ["Saved deals", "Negotiation calculator", "10-year projections"],
    cta: "Current Plan",
    highlighted: false,
  },
  {
    id: "investor",
    name: "Investor",
    price: 19,
    period: "mo",
    description: "For active investors analyzing multiple deals.",
    features: [
      "Unlimited deal analysis",
      "Saved deals library",
      "Side-by-side comparison",
      "Negotiation price calculator",
      "Deal alerts (5 active)",
      "10-year projections",
      "HOA Health Report",
      "Deal Score™",
    ],
    cta: "Upgrade to Investor",
    highlighted: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    period: "mo",
    description: "Full toolkit for serious portfolio builders.",
    features: [
      "Everything in Investor",
      "VenuraAI assistant",
      "Portfolio dashboard",
      "Unlimited deal alerts",
      "Export reports (PDF/CSV)",
      "Priority support",
      "API access",
      "City Intelligence",
      "VenuraAI advisor",
    ],
    cta: "Upgrade to Pro",
    highlighted: false,
  },
];

export function PricingPlans() {
  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout(plan: "investor" | "pro") {
    setLoadingPlan(plan);
    setError(null);

    if (!isStripeConfigured()) {
      setError(
        "Stripe is not configured. Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY and server keys to .env.local.",
      );
      setLoadingPlan(null);
      return;
    }

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Could not start checkout");
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error("No checkout URL returned");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setLoadingPlan(null);
    }
  }

  return (
    <>
      {error && (
        <div className="mb-6 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {PLANS.map((plan) => {
          const isPaid = plan.id === "investor" || plan.id === "pro";
          const isLoading = loadingPlan === plan.id;

          return (
            <article
              key={plan.id}
              className={`relative flex flex-col rounded-2xl border p-6 shadow-xl ${
                plan.highlighted
                  ? "border-[#E8D5B7] bg-[#1B4332] ring-2 ring-[#E8D5B7]/30"
                  : "border-white/10 bg-[#1B4332]"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#E8D5B7] px-3 py-1 text-xs font-semibold text-[#1B4332]">
                  Most Popular
                </span>
              )}

              <div className="mb-6">
                <h2 className="text-xl font-bold text-white">{plan.name}</h2>
                <p className="mt-1 text-sm text-white/60">{plan.description}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-black tabular-nums text-white">
                    ${plan.price}
                  </span>
                  <span className="text-sm text-white/50">/{plan.period}</span>
                </div>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm"
                  >
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#E8D5B7]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-white/80">{feature}</span>
                  </li>
                ))}
                {plan.excluded?.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm text-white/40"
                  >
                    <span className="mt-0.5 shrink-0 text-white/30">✗</span>
                    <span className="line-through">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                disabled={!isPaid || isLoading || loadingPlan !== null}
                onClick={() => {
                  if (plan.id === "investor" || plan.id === "pro") {
                    void startCheckout(plan.id);
                  }
                }}
                className={`w-full rounded-xl py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  plan.highlighted
                    ? "bg-[#E8D5B7] text-[#1B4332] hover:bg-[#F0E4CE]"
                    : plan.price === 0
                      ? "border border-white/20 bg-white/5 text-white/60"
                      : "border border-[#E8D5B7]/40 bg-[#E8D5B7]/10 text-[#E8D5B7] hover:bg-[#E8D5B7]/20"
                }`}
              >
                {isLoading ? "Redirecting to checkout…" : plan.cta}
              </button>
            </article>
          );
        })}
      </div>
    </>
  );
}
