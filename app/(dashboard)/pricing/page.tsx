import { PageHeader } from "@/components/dashboard/page-header";

const PLANS = [
  {
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
    cta: "Current Plan",
    highlighted: false,
  },
  {
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
    ],
    cta: "Upgrade to Investor",
    highlighted: true,
  },
  {
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
    ],
    cta: "Upgrade to Pro",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Plans"
        title="Pricing"
        description="Choose the plan that fits your investment workflow."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <article
            key={plan.name}
            className={`relative flex flex-col rounded-2xl border p-6 shadow-xl ${
              plan.highlighted
                ? "border-[#74C69D] bg-[#1B4332] ring-2 ring-[#74C69D]/30"
                : "border-white/10 bg-[#1B4332]"
            }`}
          >
            {plan.highlighted && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#74C69D] px-3 py-1 text-xs font-semibold text-[#1B4332]">
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
                <li key={feature} className="flex items-start gap-2.5 text-sm">
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#74C69D]"
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
              className={`w-full rounded-xl py-3 text-sm font-semibold transition ${
                plan.highlighted
                  ? "bg-[#74C69D] text-[#1B4332] hover:bg-[#95D5B2]"
                  : plan.price === 0
                    ? "border border-white/20 bg-white/5 text-white/60"
                    : "border border-[#74C69D]/40 bg-[#74C69D]/10 text-[#74C69D] hover:bg-[#74C69D]/20"
              }`}
            >
              {plan.cta}
            </button>
          </article>
        ))}
      </div>
    </>
  );
}
