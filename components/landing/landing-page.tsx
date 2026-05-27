import Link from "next/link";
import { LandingHeader } from "./landing-header";
import { MiniCalculator } from "./mini-calculator";

const TRUST_SIGNALS = [
  "No credit card required",
  "3 free analyses per month",
  "Cancel anytime",
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Enter the numbers",
    description:
      "Add purchase price, rent, HOA, taxes, and financing. Venura handles the math instantly.",
  },
  {
    step: "02",
    title: "Get your verdict",
    description:
      "See a clear Go, Caution, or No-Go with cash flow, cap rate, and the 50% rule explained.",
  },
  {
    step: "03",
    title: "Plan with confidence",
    description:
      "Save deals, compare side-by-side, and model 10-year equity and cash flow projections.",
  },
];

const FEATURES = [
  {
    title: "Instant Go / No-Go",
    description:
      "Underwrite any rental in under a minute with professional-grade verdict scoring.",
  },
  {
    title: "Cash flow & cap rate",
    description:
      "Monthly P&L, NOI-based cap rate, and cash-on-cash return — no spreadsheet required.",
  },
  {
    title: "Negotiation calculator",
    description:
      "Open offer, target, and walk-away prices derived from your assumptions.",
  },
  {
    title: "Deal comparison",
    description:
      "Stack saved properties side-by-side and spot the best metrics at a glance.",
  },
  {
    title: "10-year projections",
    description:
      "Chart equity growth, cash flow trends, and property value over a decade.",
  },
  {
    title: "VenuraAI advisor",
    description:
      "Ask about DC metro markets, rent control, financing, and deal analysis strategies.",
  },
];

const PRICING_TIERS = [
  {
    name: "Free",
    price: 0,
    description: "3 analyses per month",
    features: ["Go / No-Go verdict", "Cash flow & cap rate", "50% rule check"],
    cta: "Start free",
    href: "/analyzer",
    highlighted: false,
  },
  {
    name: "Investor",
    price: 19,
    description: "Unlimited analyses",
    features: [
      "Saved deals & compare",
      "Negotiation calculator",
      "10-year projections",
    ],
    cta: "Upgrade",
    href: "/pricing",
    highlighted: true,
  },
  {
    name: "Pro",
    price: 29,
    description: "Full investor toolkit",
    features: [
      "VenuraAI assistant",
      "Portfolio dashboard",
      "Unlimited deal alerts",
    ],
    cta: "Go Pro",
    href: "/pricing",
    highlighted: false,
  },
];

export function LandingPage() {
  return (
    <div className="min-h-full bg-[#0d2818] text-white">
      <LandingHeader />

      {/* Hero */}
      <section className="bg-[#1B4332]">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-8 lg:py-24">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#74C69D]">
              Real estate investment analysis
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Analyze any property.{" "}
              <span className="text-[#74C69D]">Know in 60 seconds.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
              Stop building spreadsheets. Venura gives first-time investors a
              clear Go or No-Go on any deal — with cash flow, cap rate, and
              10-year projections built in.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/analyzer"
                className="rounded-xl bg-[#74C69D] px-6 py-3.5 text-sm font-semibold text-[#1B4332] transition hover:bg-[#95D5B2]"
              >
                Analyze your first deal free
              </Link>
              <a
                href="#how-it-works"
                className="rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                See how it works
              </a>
            </div>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
              {TRUST_SIGNALS.map((signal) => (
                <li
                  key={signal}
                  className="flex items-center gap-2 text-sm text-white/60"
                >
                  <svg
                    className="h-4 w-4 shrink-0 text-[#74C69D]"
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
                  {signal}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-12 lg:mt-0">
            <MiniCalculator />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-20 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#74C69D]">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              From listing to verdict in three steps
            </h2>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {HOW_IT_WORKS.map((item) => (
              <article
                key={item.step}
                className="rounded-2xl border border-white/10 bg-[#1B4332] p-8"
              >
                <span className="text-3xl font-black text-[#74C69D]/40">
                  {item.step}
                </span>
                <h3 className="mt-4 text-xl font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-20 border-t border-white/5 bg-[#1B4332]/40 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#74C69D]">
              Features
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to invest smarter
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/60">
              Built for first-time rental investors who want clarity, not
              complexity.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <article
                key={feature.title}
                className="rounded-2xl border border-white/10 bg-[#1B4332] p-6 transition hover:border-[#74C69D]/30"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#74C69D]/15">
                  <span className="h-2 w-2 rounded-full bg-[#74C69D]" />
                </div>
                <h3 className="font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="scroll-mt-20 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#74C69D]">
              Pricing
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Start free, upgrade when you&apos;re ready
            </h2>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {PRICING_TIERS.map((tier) => (
              <article
                key={tier.name}
                className={`relative flex flex-col rounded-2xl border p-6 ${
                  tier.highlighted
                    ? "border-[#74C69D] bg-[#1B4332] ring-2 ring-[#74C69D]/30"
                    : "border-white/10 bg-[#1B4332]"
                }`}
              >
                {tier.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#74C69D] px-3 py-1 text-xs font-semibold text-[#1B4332]">
                    Most popular
                  </span>
                )}
                <h3 className="text-xl font-bold">{tier.name}</h3>
                <p className="mt-1 text-sm text-white/60">{tier.description}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-black">${tier.price}</span>
                  {tier.price > 0 && (
                    <span className="text-sm text-white/50">/mo</span>
                  )}
                </div>
                <ul className="mt-6 flex-1 space-y-2">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm text-white/80"
                    >
                      <span className="text-[#74C69D]">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.href}
                  className={`mt-8 block rounded-xl py-3 text-center text-sm font-semibold transition ${
                    tier.highlighted
                      ? "bg-[#74C69D] text-[#1B4332] hover:bg-[#95D5B2]"
                      : "border border-[#74C69D]/40 bg-[#74C69D]/10 text-[#74C69D] hover:bg-[#74C69D]/20"
                  }`}
                >
                  {tier.cta}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="border-t border-white/10 bg-[#1B4332] py-16">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight">
            Ready to analyze your first deal?
          </h2>
          <p className="mt-4 text-white/60">
            Join investors using Venura to make faster, clearer rental
            decisions.
          </p>
          <Link
            href="/analyzer"
            className="mt-8 inline-block rounded-xl bg-[#74C69D] px-8 py-4 text-sm font-semibold text-[#1B4332] transition hover:bg-[#95D5B2]"
          >
            Analyze your first deal free
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-xs text-white/40">
        Venura · For illustrative purposes only · Not financial advice
      </footer>
    </div>
  );
}
