"use client";

import { useMemo, useState } from "react";
import {
  analyzeProperty,
  calculateNegotiationPrices,
  DEFAULTS,
  type PropertyInputs,
} from "@/lib/calculator";
import { saveLastAnalysis } from "@/lib/analyzer-session";
import { generateAnalysisPdf } from "@/lib/generate-analysis-pdf";
import {
  formatCurrency,
  formatCurrencyDetailed,
  formatPercent,
} from "@/lib/format";
import { InputField, MetricCard } from "@/components/analyzer/input-field";
import {
  NegotiationCalculator,
  VerdictBanner,
} from "@/components/analyzer/verdict-banner";

export function PropertyAnalyzer() {
  const [propertyName, setPropertyName] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
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
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [analyzedInputs, setAnalyzedInputs] = useState<PropertyInputs | null>(
    null,
  );
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [saveError, setSaveError] = useState<string | null>(null);

  const currentInputs = useMemo(
    () => ({
      purchasePrice,
      monthlyRent,
      hoaFee,
      propertyTaxes,
      downPaymentPercent,
      interestRate,
      insurance,
      loanTerm,
    }),
    [
      purchasePrice,
      monthlyRent,
      hoaFee,
      propertyTaxes,
      downPaymentPercent,
      interestRate,
      insurance,
      loanTerm,
    ],
  );

  const analysis = useMemo(
    () =>
      analyzedInputs ? analyzeProperty(analyzedInputs) : null,
    [analyzedInputs],
  );

  const negotiation = useMemo(
    () =>
      analyzedInputs ? calculateNegotiationPrices(analyzedInputs) : null,
    [analyzedInputs],
  );

  function handleAnalyze() {
    setAnalyzedInputs({ ...currentInputs });
    saveLastAnalysis(currentInputs);
    setHasAnalyzed(true);
    setSaveStatus("idle");
    setSaveError(null);
  }

  async function handleSaveDeal() {
    if (!analyzedInputs || !analysis) return;

    const name = propertyName.trim() || "Untitled deal";
    const address = propertyAddress.trim();
    if (!address) {
      setSaveError("Enter a property address before saving.");
      setSaveStatus("error");
      return;
    }

    setSaveStatus("saving");
    setSaveError(null);

    try {
      const res = await fetch("/api/saved-deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          address,
          inputs: analyzedInputs,
          analysis,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to save deal");
      }

      setSaveStatus("saved");
    } catch (err) {
      setSaveStatus("error");
      setSaveError(err instanceof Error ? err.message : "Failed to save deal");
    }
  }

  function handleDownloadPdf() {
    if (!analyzedInputs || !analysis) return;

    generateAnalysisPdf({
      propertyName: propertyName.trim() || "Property Analysis",
      address: propertyAddress.trim(),
      inputs: analyzedInputs,
      analysis,
    });
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-5 lg:gap-8">
        <section className="rounded-2xl border border-white/10 bg-[#1B4332] p-6 shadow-xl lg:col-span-2">
          <h2 className="mb-5 text-lg font-semibold text-[#74C69D]">
            Property Inputs
          </h2>
          <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/60">
                Property name
              </span>
              <input
                type="text"
                value={propertyName}
                onChange={(e) => setPropertyName(e.target.value)}
                placeholder="e.g. Capitol Hill Duplex"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#74C69D] focus:ring-2 focus:ring-[#74C69D]/30"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/60">
                Address
              </span>
              <input
                type="text"
                value={propertyAddress}
                onChange={(e) => setPropertyAddress(e.target.value)}
                placeholder="123 Main St, Arlington, VA"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#74C69D] focus:ring-2 focus:ring-[#74C69D]/30"
              />
            </label>
          </div>
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
          <button
            type="button"
            onClick={handleAnalyze}
            className="mt-6 w-full rounded-xl bg-[#74C69D] px-5 py-3 text-sm font-semibold text-[#1B4332] transition hover:bg-[#95D5B2]"
          >
            Analyze
          </button>
        </section>

        <div className="flex flex-col gap-6 lg:col-span-3">
          {!hasAnalyzed || !analysis || !negotiation ? (
            <section className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-[#1B4332]/50 p-8 text-center shadow-xl">
              <p className="text-lg font-medium text-white/80">
                Enter your property details and click Analyze
              </p>
              <p className="mt-2 max-w-sm text-sm text-white/50">
                Your verdict, metrics, and negotiation targets will appear here.
              </p>
            </section>
          ) : (
            <>
              <VerdictBanner analysis={analysis} />

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveDeal}
                  disabled={saveStatus === "saving"}
                  className="rounded-xl bg-[#74C69D] px-5 py-2.5 text-sm font-semibold text-[#1B4332] transition hover:bg-[#95D5B2] disabled:opacity-50"
                >
                  {saveStatus === "saving"
                    ? "Saving…"
                    : saveStatus === "saved"
                      ? "Saved"
                      : "Save Deal"}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="rounded-xl border border-[#74C69D]/50 bg-[#74C69D]/10 px-5 py-2.5 text-sm font-semibold text-[#74C69D] transition hover:bg-[#74C69D]/20"
                >
                  Download PDF
                </button>
                {saveStatus === "saved" && (
                  <span className="text-sm text-[#74C69D]">
                    Deal saved to your library.
                  </span>
                )}
                {saveError && (
                  <span className="text-sm text-red-400">{saveError}</span>
                )}
              </div>

              <NegotiationCalculator
                openOfferPrice={negotiation.openOfferPrice}
                targetPrice={negotiation.targetPrice}
                walkAwayPrice={negotiation.walkAwayPrice}
                currentPrice={purchasePrice}
              />

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
                  <div className="mt-2 flex items-center justify-between rounded-xl bg-white/5 px-4 py-4">
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
