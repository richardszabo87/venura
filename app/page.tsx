"use client";

import { useMemo, useState } from "react";

const DEFAULTS = {
  purchasePrice: 174999,
  monthlyRent: 1850,
  hoaFee: 274,
  propertyTaxes: 165,
  downPaymentPercent: 20,
  interestRate: 6.99,
  insurance: 55,
  loanTerm: 30,
};

type Verdict = "go" | "no-go" | "caution";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCurrencyDetailed(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

function calculateMortgagePayment(
  principal: number,
  annualRate: number,
  years: number,
): number {
  if (principal <= 0) return 0;
  if (annualRate <= 0) return principal / (years * 12);

  const monthlyRate = annualRate / 100 / 12;
  const payments = years * 12;
  const factor = Math.pow(1 + monthlyRate, payments);

  return (principal * monthlyRate * factor) / (factor - 1);
}

type InputFieldProps = {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  step?: number;
};

function InputField({
  id,
  label,
  value,
  onChange,
  prefix,
  suffix,
  step = 1,
}: InputFieldProps) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/70">
        {label}
      </span>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#74C69D]">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type="number"
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className={`w-full rounded-lg border border-white/10 bg-white/5 py-2.5 text-sm text-white outline-none transition focus:border-[#74C69D] focus:ring-2 focus:ring-[#74C69D]/30 ${
            prefix ? "pl-7" : "pl-3"
          } ${suffix ? "pr-9" : "pr-3"}`}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-white/50">
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
}

const VERDICT_STYLES: Record<
  Verdict,
  { label: string; bg: string; border: string; glow: string }
> = {
  go: {
    label: "GO",
    bg: "bg-emerald-500/20",
    border: "border-emerald-400",
    glow: "shadow-[0_0_60px_rgba(74,222,128,0.25)]",
  },
  "no-go": {
    label: "NO-GO",
    bg: "bg-red-500/20",
    border: "border-red-400",
    glow: "shadow-[0_0_60px_rgba(248,113,113,0.25)]",
  },
  caution: {
    label: "CAUTION",
    bg: "bg-amber-500/20",
    border: "border-amber-400",
    glow: "shadow-[0_0_60px_rgba(251,191,36,0.2)]",
  },
};

export default function Home() {
  const [purchasePrice, setPurchasePrice] = useState(DEFAULTS.purchasePrice);
  const [monthlyRent, setMonthlyRent] = useState(DEFAULTS.monthlyRent);
  const [hoaFee, setHoaFee] = useState(DEFAULTS.hoaFee);
  const [propertyTaxes, setPropertyTaxes] = useState(DEFAULTS.propertyTaxes);
  const [downPaymentPercent, setDownPaymentPercent] = useState(
    DEFAULTS.downPaymentPercent,
  );
  const [interestRate, setInterestRate] = useState(DEFAULTS.interestRate);
  const [insurance, setInsurance] = useState(DEFAULTS.insurance);
  const [loanTerm, setLoanTerm] = useState(DEFAULTS.loanTerm);

  const analysis = useMemo(() => {
    const downPayment = purchasePrice * (downPaymentPercent / 100);
    const loanAmount = purchasePrice - downPayment;
    const monthlyMortgage = calculateMortgagePayment(
      loanAmount,
      interestRate,
      loanTerm,
    );

    const operatingExpenses = hoaFee + propertyTaxes + insurance;
    const totalMonthlyExpenses = monthlyMortgage + operatingExpenses;
    const monthlyCashFlow = monthlyRent - totalMonthlyExpenses;

    const annualRent = monthlyRent * 12;
    const annualOperatingExpenses = operatingExpenses * 12;
    const annualNoi = annualRent - annualOperatingExpenses;
    const capRate =
      purchasePrice > 0 ? (annualNoi / purchasePrice) * 100 : 0;

    const annualCashFlow = monthlyCashFlow * 12;
    const cashInvested = downPayment;
    const cashOnCashReturn =
      cashInvested > 0 ? (annualCashFlow / cashInvested) * 100 : 0;

    const fiftyPercentThreshold = monthlyRent * 0.5;
    const fiftyPercentRulePass = operatingExpenses <= fiftyPercentThreshold;

    let verdict: Verdict;
    if (monthlyCashFlow < 0) {
      verdict = "no-go";
    } else if (monthlyCashFlow > 150 && capRate > 5) {
      verdict = "go";
    } else {
      verdict = "caution";
    }

    return {
      downPayment,
      loanAmount,
      monthlyMortgage,
      operatingExpenses,
      totalMonthlyExpenses,
      monthlyCashFlow,
      capRate,
      cashOnCashReturn,
      fiftyPercentRulePass,
      fiftyPercentThreshold,
      verdict,
      expenseBreakdown: [
        { label: "Mortgage (P&I)", amount: monthlyMortgage },
        { label: "HOA", amount: hoaFee },
        { label: "Property taxes", amount: propertyTaxes },
        { label: "Insurance", amount: insurance },
      ],
    };
  }, [
    purchasePrice,
    monthlyRent,
    hoaFee,
    propertyTaxes,
    downPaymentPercent,
    interestRate,
    insurance,
    loanTerm,
  ]);

  const verdictStyle = VERDICT_STYLES[analysis.verdict];

  return (
    <div className="min-h-full bg-[#0d2818] font-sans text-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <header className="mb-8 text-center sm:mb-10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-[#74C69D]">
            Investment Analysis
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Venura
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/60">
            Professional rental property underwriting — cash flow, returns, and
            the 50% rule at a glance.
          </p>
        </header>

        <div
          className={`mb-8 rounded-2xl border-2 px-6 py-8 text-center ${verdictStyle.bg} ${verdictStyle.border} ${verdictStyle.glow}`}
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

        <div className="grid gap-6 lg:grid-cols-5 lg:gap-8">
          <section className="rounded-2xl border border-white/10 bg-[#1B4332] p-6 shadow-xl lg:col-span-2">
            <h2 className="mb-5 text-lg font-semibold text-[#74C69D]">
              Property Inputs
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <InputField
                id="purchasePrice"
                label="Purchase price"
                value={purchasePrice}
                onChange={setPurchasePrice}
                prefix="$"
              />
              <InputField
                id="monthlyRent"
                label="Monthly rent"
                value={monthlyRent}
                onChange={setMonthlyRent}
                prefix="$"
              />
              <InputField
                id="hoaFee"
                label="HOA fee"
                value={hoaFee}
                onChange={setHoaFee}
                prefix="$"
              />
              <InputField
                id="propertyTaxes"
                label="Property taxes"
                value={propertyTaxes}
                onChange={setPropertyTaxes}
                prefix="$"
              />
              <InputField
                id="downPayment"
                label="Down payment"
                value={downPaymentPercent}
                onChange={setDownPaymentPercent}
                suffix="%"
                step={0.5}
              />
              <InputField
                id="interestRate"
                label="Interest rate"
                value={interestRate}
                onChange={setInterestRate}
                suffix="%"
                step={0.01}
              />
              <InputField
                id="insurance"
                label="Insurance"
                value={insurance}
                onChange={setInsurance}
                prefix="$"
              />
              <InputField
                id="loanTerm"
                label="Loan term"
                value={loanTerm}
                onChange={setLoanTerm}
                suffix="yr"
              />
            </div>
          </section>

          <div className="flex flex-col gap-6 lg:col-span-3">
            <section className="rounded-2xl border border-white/10 bg-[#1B4332] p-6 shadow-xl">
              <h2 className="mb-5 text-lg font-semibold text-[#74C69D]">
                Key Metrics
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <MetricCard
                  label="Monthly mortgage"
                  value={formatCurrencyDetailed(analysis.monthlyMortgage)}
                  sub={`Loan ${formatCurrency(analysis.loanAmount)} · ${loanTerm} yr`}
                />
                <MetricCard
                  label="Monthly cash flow"
                  value={formatCurrencyDetailed(analysis.monthlyCashFlow)}
                  highlight={
                    analysis.monthlyCashFlow >= 0 ? "positive" : "negative"
                  }
                />
                <MetricCard
                  label="Cap rate"
                  value={formatPercent(analysis.capRate)}
                  sub="NOI ÷ purchase price"
                />
                <MetricCard
                  label="Cash-on-cash return"
                  value={formatPercent(analysis.cashOnCashReturn)}
                  sub={`${formatCurrency(analysis.downPayment)} invested`}
                />
                <div className="sm:col-span-2">
                  <div
                    className={`flex items-center justify-between rounded-xl border px-5 py-4 ${
                      analysis.fiftyPercentRulePass
                        ? "border-[#74C69D]/50 bg-[#74C69D]/10"
                        : "border-red-400/50 bg-red-500/10"
                    }`}
                  >
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-white/60">
                        50% Rule
                      </p>
                      <p className="mt-1 text-sm text-white/80">
                        Operating expenses vs. 50% of gross rent (
                        {formatCurrency(analysis.fiftyPercentThreshold)}/mo)
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-4 py-1.5 text-sm font-bold uppercase tracking-wide ${
                        analysis.fiftyPercentRulePass
                          ? "bg-[#74C69D] text-[#1B4332]"
                          : "bg-red-400 text-[#1B4332]"
                      }`}
                    >
                      {analysis.fiftyPercentRulePass ? "Pass" : "Fail"}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-[#1B4332] p-6 shadow-xl">
              <h2 className="mb-5 text-lg font-semibold text-[#74C69D]">
                Monthly Expense Breakdown
              </h2>
              <div className="space-y-1">
                <div className="flex items-center justify-between border-b border-white/10 py-3">
                  <span className="text-sm font-medium text-[#74C69D]">
                    Gross rental income
                  </span>
                  <span className="font-semibold tabular-nums text-[#74C69D]">
                    +{formatCurrencyDetailed(monthlyRent)}
                  </span>
                </div>
                {analysis.expenseBreakdown.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between border-b border-white/5 py-3"
                  >
                    <span className="text-sm text-white/80">{item.label}</span>
                    <span className="tabular-nums text-white/90">
                      −{formatCurrencyDetailed(item.amount)}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between border-b border-white/10 py-3">
                  <span className="text-sm font-medium text-white/90">
                    Total expenses
                  </span>
                  <span className="font-medium tabular-nums text-red-300">
                    −{formatCurrencyDetailed(analysis.totalMonthlyExpenses)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-4 mt-2">
                  <span className="font-semibold">Net cash flow</span>
                  <span
                    className={`text-xl font-bold tabular-nums ${
                      analysis.monthlyCashFlow >= 0
                        ? "text-[#74C69D]"
                        : "text-red-400"
                    }`}
                  >
                    {analysis.monthlyCashFlow >= 0 ? "+" : ""}
                    {formatCurrencyDetailed(analysis.monthlyCashFlow)}
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>

        <footer className="mt-10 text-center text-xs text-white/40">
          Venura · For illustrative purposes only · Not financial advice
        </footer>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: "positive" | "negative";
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-white/60">
        {label}
      </p>
      <p
        className={`mt-2 text-2xl font-bold tabular-nums tracking-tight ${
          highlight === "positive"
            ? "text-[#74C69D]"
            : highlight === "negative"
              ? "text-red-400"
              : "text-white"
        }`}
      >
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-white/50">{sub}</p>}
    </div>
  );
}
