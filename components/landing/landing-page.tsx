import Link from "next/link";
import { CtaBanner } from "./cta-banner";
import { LandingHeader } from "./landing-header";
import { MiniCalculator } from "./mini-calculator";

const SOCIAL_PROOF = [
  "Built for DC metro investors",
  "No spreadsheet needed",
  "Free to start",
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
  {
    title: "HOA Health Report",
    description:
      "Analyzes reserve fund, fee increase history, and special assessment risk before you buy.",
  },
  {
    title: "Deal Score™",
    description:
      "A 0-100 confidence rating on every deal based on cash flow, location, HOA risk, and market data.",
  },
  {
    title: "City Intelligence",
    description:
      "Market data for DC Metro including rent growth, vacancy rates, neighborhood scores, and rent control laws.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "I spent 3 months analyzing DC properties manually. Venura does in 60 seconds what took me hours.",
    name: "Richard W.",
    role: "First-time investor",
    location: "Landover MD",
  },
  {
    quote:
      "The HOA flag saved me from a terrible deal. The calculator showed -$822/month on a property I almost made an offer on.",
    name: "Marcus K.",
    role: "Investor",
    location: "Silver Spring MD",
  },
  {
    quote:
      "The PDF report impressed my lender. Closed my first deal 3 weeks later.",
    name: "Tanya L.",
    role: "Investor",
    location: "Hyattsville MD",
  },
];

type PricingTier = {
  name: string;
  price: number;
  description: string;
  features: string[];
  excluded?: string[];
  cta: string;
  href: string;
  highlighted: boolean;
};

const PRICING_TIERS: PricingTier[] = [
  {
    name: "Free",
    price: 0,
    description: "3 analyses per month",
    features: ["Go / No-Go verdict", "Cash flow & cap rate", "50% rule check"],
    excluded: ["Saved deals", "Negotiation calculator", "10-year projections"],
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
      "HOA Health Report",
      "Deal Score™",
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
      "City Intelligence",
      "VenuraAI advisor",
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
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#E8D5B7]">
              Real estate investment analysis
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Analyze any property.{" "}
              <span className="text-[#E8D5B7]">Know in 60 seconds.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
              Stop building spreadsheets. Venura gives first-time investors a
              clear Go or No-Go on any deal — with cash flow, cap rate, and
              10-year projections built in.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/analyzer"
                className="rounded-xl bg-[#E8D5B7] px-6 py-3.5 text-sm font-semibold text-[#1B4332] transition hover:bg-[#F0E4CE]"
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

          </div>

          <div className="mt-12 lg:mt-0">
            <MiniCalculator />
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="border-y border-white/10 bg-[#0d2818]">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-8 sm:grid-cols-4 lg:px-8">
          {SOCIAL_PROOF.map((item) => (
            <p
              key={item}
              className="text-center text-sm font-semibold text-white/80"
            >
              {item}
            </p>
          ))}
        </div>
      </section>


      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-20 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#E8D5B7]">
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
                <span className="text-3xl font-black text-[#E8D5B7]/40">
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
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#E8D5B7]">
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
                className="rounded-2xl border border-white/10 bg-[#1B4332] p-6 transition hover:border-[#E8D5B7]/30"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#E8D5B7]/15">
                  <span className="h-2 w-2 rounded-full bg-[#E8D5B7]" />
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

      {/* Testimonials */}
      <section className="border-t border-white/5 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#E8D5B7]">
              Testimonials
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Trusted by DC metro investors
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((testimonial) => (
              <article
                key={testimonial.name}
                className="flex flex-col rounded-2xl border border-white/10 bg-[#1B4332] p-6"
              >
                <p className="flex-1 text-sm leading-relaxed text-white/80">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="mt-6 border-t border-white/10 pt-4">
                  <p className="font-semibold text-white">{testimonial.name}</p>
                  <p className="text-sm text-white/50">
                    {testimonial.role}, {testimonial.location}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>


      {/* Pricing */}
      <section id="pricing" className="scroll-mt-20 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#E8D5B7]">
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
                    ? "border-[#E8D5B7] bg-[#1B4332] ring-2 ring-[#E8D5B7]/30"
                    : "border-white/10 bg-[#1B4332]"
                }`}
              >
                {tier.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#E8D5B7] px-3 py-1 text-xs font-semibold text-[#1B4332]">
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
                      <span className="text-[#E8D5B7]">✓</span>
                      {f}
                    </li>
                  ))}
                  {tier.excluded?.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm text-white/40"
                    >
                      <span className="text-white/30">✗</span>
                      <span className="line-through">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.href}
                  className={`mt-8 block rounded-xl py-3 text-center text-sm font-semibold transition ${
                    tier.highlighted
                      ? "bg-[#E8D5B7] text-[#1B4332] hover:bg-[#F0E4CE]"
                      : "border border-[#E8D5B7]/40 bg-[#E8D5B7]/10 text-[#E8D5B7] hover:bg-[#E8D5B7]/20"
                  }`}
                >
                  {tier.cta}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />

      <footer className="border-t border-white/10 px-6 py-8 text-center text-xs text-white/40">
        Venura · For illustrative purposes only · Not financial advice
      </footer>
    </div>
  );
}
