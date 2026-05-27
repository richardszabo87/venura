import { analyzeProperty, DEFAULTS, VERDICT_STYLES } from "@/lib/calculator";
import {
  formatCurrency,
  formatCurrencyDetailed,
  formatPercentOneDecimal,
} from "@/lib/format";
import { SAMPLE_SAVED_DEALS } from "@/lib/sample-deals";

const DUTCH_VILLAGE = SAMPLE_SAVED_DEALS[0];

const PREVIEW_INPUTS = {
  purchasePrice: DEFAULTS.purchasePrice,
  monthlyRent: DEFAULTS.monthlyRent,
  hoaFee: DEFAULTS.hoaFee,
  propertyTaxes: DEFAULTS.propertyTaxes,
  downPaymentPercent: DEFAULTS.downPaymentPercent,
  interestRate: DEFAULTS.interestRate,
  insurance: DEFAULTS.insurance,
  loanTerm: DEFAULTS.loanTerm,
};

const PREVIEW_METRICS = {
  monthlyCashFlow: 221,
  capRate: 5.1,
  cashOnCashReturn: 7.9,
};

export function MiniCalculator() {
  const analysis = analyzeProperty(PREVIEW_INPUTS);

  const verdictStyle = VERDICT_STYLES[analysis.verdict];

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d2818] shadow-2xl shadow-black/30">
        <div className="border-b border-white/10 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#74C69D]">
            Live preview
          </p>
          <h3 className="mt-1 font-semibold text-white">
            {DUTCH_VILLAGE.address}
          </h3>
          <p className="text-sm text-white/50">
            {DUTCH_VILLAGE.city}, {DUTCH_VILLAGE.state}
          </p>
        </div>

        <div
          className={`mx-5 mt-5 rounded-xl border-2 px-4 py-5 text-center ${verdictStyle.bg} ${verdictStyle.border}`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
            Verdict
          </p>
          <p className="mt-1 text-4xl font-black text-white">
            {verdictStyle.label}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 p-5">
          <Metric
            label="Monthly cash flow"
            value={formatCurrencyDetailed(PREVIEW_METRICS.monthlyCashFlow)}
            positive
          />
          <Metric
            label="Cap rate"
            value={formatPercentOneDecimal(PREVIEW_METRICS.capRate)}
          />
          <Metric
            label="Cash-on-cash"
            value={formatPercentOneDecimal(PREVIEW_METRICS.cashOnCashReturn)}
          />
          <Metric
            label="Purchase price"
            value={formatCurrency(PREVIEW_INPUTS.purchasePrice)}
          />
        </div>

        <div className="border-t border-white/10 px-5 py-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/50">50% rule</span>
            <span
              className={`font-semibold ${
                analysis.fiftyPercentRulePass ? "text-[#74C69D]" : "text-red-400"
              }`}
            >
              {analysis.fiftyPercentRulePass ? "Pass" : "Fail"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="rounded-lg bg-white/5 px-3 py-3">
      <p className="text-xs text-white/50">{label}</p>
      <p
        className={`mt-1 text-sm font-bold tabular-nums ${
          positive ? "text-[#74C69D]" : "text-white"
        }`}
      >
        {positive && !value.startsWith("-") ? "+" : ""}
        {value}
      </p>
    </div>
  );
}
