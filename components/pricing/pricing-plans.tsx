"use client";

import { useState } from "react";
import { isStripeConfigured } from "@/lib/stripe-config";
import type { SubscriptionTier } from "@/lib/user-profile";

type PlanId = "free" | "investor" | "pro";

const PLANS: {
  id: PlanId;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
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
      "3 analyses per month",
      "5 saved deals",
      "5 VenuraAI messages/month",
      "1 deal alert",
      "Basic projections (no export)",
      "Cash flow & cap rate metrics",
    ],
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
      "Unlimited analyses",
      "Up to 50 saved deals",
      "PDF report downloads",
      "Full Deal Score™",
      "HOA Health Report",
      "Unlimited VenuraAI",
      "10 deal alerts",
      "10-year projections with export",
      "Zip-level market data",
    ],
    cta: "Start 7-day free trial",
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
      "Unlimited saved deals",
      "Unlimited deal alerts",
      "City Intelligence",
      "VenuraAI priority responses",
      "Portfolio tracker",
      "API access",
      "White label reports",
    ],
    cta: "Upgrade to Pro",
    highlighted: false,
  },
];

const COMPARISON_FEATURES: {
  label: string;
  free: string | boolean;
  investor: string | boolean;
  pro: string | boolean;
}[] = [
  { label: "Analyses per month", free: "3", investor: "Unlimited", pro: "Unlimited" },
  { label: "Saved deals", free: "5", investor: "50", pro: "Unlimited" },
  { label: "VenuraAI messages", free: "5/mo", investor: "Unlimited", pro: "Unlimited" },
  { label: "Deal alerts", free: "1", investor: "10", pro: "Unlimited" },
  { label: "PDF downloads", free: false, investor: true, pro: true },
  { label: "Deal Score™", free: false, investor: true, pro: true },
  { label: "HOA Health Report", free: false, investor: true, pro: true },
  { label: "Projection export", free: false, investor: true, pro: true },
  { label: "Portfolio tracker", free: false, investor: false, pro: true },
  { label: "City Intelligence", free: false, investor: false, pro: true },
  { label: "API access", free: false, investor: false, pro: true },
  { label: "White label reports", free: false, investor: false, pro: true },
];

function CellValue({ value }: { value: string | boolean }) {
  if (typeof value === "string") {
    return <span className="text-white/80">{value}</span>;
  }
  return value ? (
    <svg
      className="mx-auto h-4 w-4 text-[#E8D5B7]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ) : (
    <span className="text-white/30">—</span>
  );
}

type PricingPlansProps = {
  currentTier?: SubscriptionTier;
};

export function PricingPlans({ currentTier = "free" }: PricingPlansProps) {
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
          const isCurrent = plan.id === currentTier;

          return (
            <article
              key={plan.id}
              className={`relative flex flex-col rounded-2xl border p-6 shadow-xl ${
                plan.highlighted
                  ? "border-[#E8D5B7] bg-[#1B4332] ring-2 ring-[#E8D5B7]/30"
                  : "border-white/10 bg-[#1B4332]"
              }`}
            >
              {isCurrent && (
                <span className="absolute -top-3 right-4 rounded-full border border-[#E8D5B7]/40 bg-[#0d2818] px-3 py-1 text-xs font-semibold text-[#E8D5B7]">
                  Current plan
                </span>
              )}
              {plan.highlighted && !isCurrent && (
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
              </ul>

              <button
                type="button"
                disabled={isCurrent || !isPaid || isLoading || loadingPlan !== null}
                onClick={() => {
                  if (plan.id === "investor" || plan.id === "pro") {
                    void startCheckout(plan.id);
                  }
                }}
                className={`w-full rounded-xl py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  isCurrent
                    ? "border border-white/20 bg-white/5 text-white/60"
                    : plan.highlighted
                      ? "bg-[#E8D5B7] text-[#1B4332] hover:bg-[#F0E4CE]"
                      : plan.price === 0
                        ? "border border-white/20 bg-white/5 text-white/60"
                        : "border border-[#E8D5B7]/40 bg-[#E8D5B7]/10 text-[#E8D5B7] hover:bg-[#E8D5B7]/20"
                }`}
              >
                {isCurrent
                  ? "Current Plan"
                  : isLoading
                    ? "Redirecting to checkout…"
                    : plan.cta}
              </button>
            </article>
          );
        })}
      </div>

      <section className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-[#1B4332] shadow-xl">
        <div className="border-b border-white/10 px-6 py-5">
          <h2 className="text-lg font-semibold text-[#E8D5B7]">
            Feature comparison
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/60">
                <th className="px-6 py-4 font-medium">Feature</th>
                <th className="px-4 py-4 text-center font-medium">Free</th>
                <th className="px-4 py-4 text-center font-medium">Investor</th>
                <th className="px-4 py-4 text-center font-medium">Pro</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_FEATURES.map((row) => (
                <tr key={row.label} className="border-b border-white/5">
                  <td className="px-6 py-3 text-white/80">{row.label}</td>
                  <td className="px-4 py-3 text-center">
                    <CellValue value={row.free} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <CellValue value={row.investor} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <CellValue value={row.pro} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
