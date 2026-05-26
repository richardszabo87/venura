import type { AnalysisResult } from "@/lib/calculator";
import { VERDICT_STYLES } from "@/lib/calculator";

type VerdictBannerProps = {
  analysis: AnalysisResult;
};

export function VerdictBanner({ analysis }: VerdictBannerProps) {
  const verdictStyle = VERDICT_STYLES[analysis.verdict];

  return (
    <div
      className={`rounded-2xl border-2 px-6 py-8 text-center ${verdictStyle.bg} ${verdictStyle.border} ${verdictStyle.glow}`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
        Investment Verdict
      </p>
      <p className="mt-2 text-5xl font-black tracking-tight sm:text-6xl">
        {verdictStyle.label}
      </p>
      <p className="mt-3 text-sm text-white/80">
        {analysis.verdict === "go" &&
          "Strong cash flow and cap rate — meets GO thresholds."}
        {analysis.verdict === "no-go" &&
          "Negative monthly cash flow — does not meet investment criteria."}
        {analysis.verdict === "caution" &&
          "Positive cash flow but below GO thresholds — review assumptions."}
      </p>
    </div>
  );
}

export function NegotiationCalculator({
  openOfferPrice,
  targetPrice,
  walkAwayPrice,
  currentPrice,
}: {
  openOfferPrice: number;
  targetPrice: number;
  walkAwayPrice: number;
  currentPrice: number;
}) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);

  const cards = [
    {
      label: "Open Offer Price",
      price: openOfferPrice,
      description: "Starting negotiation position — typically 8–10% below list",
      accent: "border-[#74C69D]/40 bg-[#74C69D]/10",
      labelColor: "text-[#74C69D]",
    },
    {
      label: "Target Price",
      price: targetPrice,
      description: "Meets GO thresholds: cash flow > $150/mo & cap rate > 5%",
      accent: "border-emerald-400/40 bg-emerald-500/10",
      labelColor: "text-emerald-400",
    },
    {
      label: "Walk-Away Price",
      price: walkAwayPrice,
      description: "Maximum price before cash flow turns negative",
      accent: "border-amber-400/40 bg-amber-500/10",
      labelColor: "text-amber-400",
    },
  ];

  return (
    <section className="rounded-2xl border border-white/10 bg-[#1B4332] p-6 shadow-xl">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[#74C69D]">
            Negotiation Price Calculator
          </h2>
          <p className="mt-1 text-sm text-white/60">
            Price targets based on your current assumptions · List price{" "}
            {formatPrice(currentPrice)}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`rounded-xl border p-5 ${card.accent}`}
          >
            <p
              className={`text-xs font-semibold uppercase tracking-wider ${card.labelColor}`}
            >
              {card.label}
            </p>
            <p className="mt-2 text-3xl font-bold tabular-nums text-white">
              {formatPrice(card.price)}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-white/60">
              {card.description}
            </p>
            {currentPrice > 0 && card.price > 0 && (
              <p className="mt-3 text-xs text-white/50">
                {((card.price / currentPrice - 1) * 100).toFixed(1)}% vs list
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
