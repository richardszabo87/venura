"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { storeJourneyCelebration } from "@/lib/journey-advancement";
import type { JourneyStage } from "@/lib/user-profile";
import {
  analyzeProperty,
  calculateNegotiationPrices,
  DEFAULTS,
  type PropertyInputs,
} from "@/lib/calculator";
import { saveLastAnalysis } from "@/lib/analyzer-session";
import {
  getAnalyzerDefaultsFromProfile,
  getInvestorProfile,
} from "@/lib/investor-profile";
import { useSubscription } from "@/components/subscription/subscription-provider";
import { fetchUserProfile } from "@/lib/profile-client";
import { userProfileToAnalyzerDefaults } from "@/lib/user-profile";
import { generateAnalysisPdf } from "@/lib/generate-analysis-pdf";
import { canDownloadPdf, canViewDealScore } from "@/lib/subscription";
import {
  formatCurrency,
  formatCurrencyDetailed,
  formatPercent,
} from "@/lib/format";
import { CrimeRate } from "@/components/analyzer/crime-rate";
import { InputField, MetricCard } from "@/components/analyzer/input-field";
import { SchoolDistrict } from "@/components/analyzer/school-district";
import {
  NegotiationCalculator,
  VerdictBanner,
} from "@/components/analyzer/verdict-banner";
import {
  extractZipCode,
  type CrimeRateData,
  type SchoolDistrictData,
} from "@/lib/location-intelligence";

function computeDealScore(analysis: ReturnType<typeof analyzeProperty>): number {
  let score = 50;
  if (analysis.monthlyCashFlow >= 200) score += 20;
  else if (analysis.monthlyCashFlow >= 100) score += 12;
  else if (analysis.monthlyCashFlow >= 0) score += 4;
  else score -= 15;

  if (analysis.capRate >= 0.07) score += 15;
  else if (analysis.capRate >= 0.05) score += 8;

  if (analysis.cashOnCashReturn >= 0.1) score += 10;
  else if (analysis.cashOnCashReturn >= 0.06) score += 5;

  if (analysis.fiftyPercentRulePass) score += 5;
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function PropertyAnalyzer() {
  const searchParams = useSearchParams();
  const historyId = searchParams.get("historyId");
  const { tier, usage, showUpgrade, refreshProfile } = useSubscription();
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
  const [schoolData, setSchoolData] = useState<SchoolDistrictData | null>(null);
  const [crimeData, setCrimeData] = useState<CrimeRateData | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    async function applyProfileDefaults() {
      try {
        const serverProfile = await fetchUserProfile();
        if (serverProfile?.onboarding_completed) {
          const fromServer = userProfileToAnalyzerDefaults(serverProfile);
          if (fromServer.purchasePrice != null) {
            setPurchasePrice(fromServer.purchasePrice);
          }
          if (fromServer.monthlyRent != null) setMonthlyRent(fromServer.monthlyRent);
          if (fromServer.hoaFee != null) setHoaFee(fromServer.hoaFee);
          if (fromServer.propertyTaxes != null) {
            setPropertyTaxes(fromServer.propertyTaxes);
          }
          return;
        }
      } catch {
        // Fall back to local quiz profile when not signed in or API unavailable.
      }

      const profile = getInvestorProfile();
      if (!profile) return;

      const defaults = getAnalyzerDefaultsFromProfile(profile);
      if (defaults.purchasePrice != null) setPurchasePrice(defaults.purchasePrice);
      if (defaults.monthlyRent != null) setMonthlyRent(defaults.monthlyRent);
      if (defaults.hoaFee != null) setHoaFee(defaults.hoaFee);
      if (defaults.propertyTaxes != null) setPropertyTaxes(defaults.propertyTaxes);
      if (defaults.downPaymentPercent != null) {
        setDownPaymentPercent(defaults.downPaymentPercent);
      }
      if (defaults.interestRate != null) setInterestRate(defaults.interestRate);
      if (defaults.insurance != null) setInsurance(defaults.insurance);
      if (defaults.loanTerm != null) setLoanTerm(defaults.loanTerm);
    }

    void applyProfileDefaults();
  }, []);

  useEffect(() => {
    if (!historyId) return;

    async function loadHistoryAnalysis() {
      try {
        const res = await fetch(`/api/analysis-history/${historyId}`);
        const data = await res.json();
        if (!res.ok || !data.analysis) return;

        const record = data.analysis as {
          property_name: string | null;
          address: string | null;
          purchase_price: number | null;
          monthly_rent: number | null;
        };

        if (record.property_name) setPropertyName(record.property_name);
        if (record.address) setPropertyAddress(record.address);

        const inputs: PropertyInputs = {
          purchasePrice: record.purchase_price ?? DEFAULTS.purchasePrice,
          monthlyRent: record.monthly_rent ?? DEFAULTS.monthlyRent,
          hoaFee: DEFAULTS.hoaFee,
          propertyTaxes: DEFAULTS.propertyTaxes,
          downPaymentPercent: DEFAULTS.downPaymentPercent,
          interestRate: DEFAULTS.interestRate,
          insurance: DEFAULTS.insurance,
          loanTerm: DEFAULTS.loanTerm,
        };

        setPurchasePrice(inputs.purchasePrice);
        setMonthlyRent(inputs.monthlyRent);
        setAnalyzedInputs(inputs);
        saveLastAnalysis(inputs);
        setHasAnalyzed(true);
      } catch (error) {
        console.error("Failed to load analysis history:", error);
      }
    }

    void loadHistoryAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once per historyId
  }, [historyId]);

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

  const analyzedZipCode = useMemo(
    () => (propertyAddress.trim() ? extractZipCode(propertyAddress) : null),
    [propertyAddress],
  );

  useEffect(() => {
    if (!hasAnalyzed || !analyzedZipCode) {
      setSchoolData(null);
      setCrimeData(null);
      setLocationLoading(false);
      return;
    }

    let cancelled = false;

    async function loadLocationIntelligence() {
      setLocationLoading(true);
      try {
        if (!analyzedZipCode) return;
        const res = await fetch(
          `/api/location-intelligence?zip=${encodeURIComponent(analyzedZipCode)}`,
        );
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;

        if (res.ok) {
          setSchoolData(data.school ?? null);
          setCrimeData(data.crime ?? null);
        } else {
          setSchoolData(null);
          setCrimeData(null);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load location intelligence:", error);
          setSchoolData(null);
          setCrimeData(null);
        }
      } finally {
        if (!cancelled) setLocationLoading(false);
      }
    }

    void loadLocationIntelligence();
    return () => {
      cancelled = true;
    };
  }, [hasAnalyzed, analyzedZipCode]);

  async function handleAnalyze() {
    const analysisResult = analyzeProperty(currentInputs);

    try {
      const res = await fetch("/api/usage/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyName: propertyName.trim() || undefined,
          address: propertyAddress.trim() || undefined,
          purchasePrice,
          monthlyRent,
          analysis: analysisResult,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.status === 403 && data.code === "LIMIT_REACHED") {
        showUpgrade("analyses");
        return;
      }

      if (!res.ok) {
        throw new Error(data.error ?? "Could not record analysis");
      }

      if (data.stageAdvanced) {
        storeJourneyCelebration(data.stageAdvanced as JourneyStage);
      }

      await refreshProfile();
      setAnalyzedInputs({ ...currentInputs });
      saveLastAnalysis(currentInputs);
      setHasAnalyzed(true);
      setSaveStatus("idle");
      setSaveError(null);
    } catch (error) {
      console.error("Failed to record analysis:", error);
    }
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
      const res = await fetch("/api/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          address,
          inputs: analyzedInputs,
          analysis,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 403 && data.code === "LIMIT_REACHED") {
        showUpgrade("saved_deals");
        setSaveStatus("idle");
        return;
      }

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to save deal");
      }

      if (data.stageAdvanced) {
        storeJourneyCelebration(data.stageAdvanced as JourneyStage);
      }

      await refreshProfile();
      setSaveStatus("saved");
    } catch (err) {
      setSaveStatus("error");
      setSaveError(err instanceof Error ? err.message : "Failed to save deal");
    }
  }

  function handleDownloadPdf() {
    if (!analyzedInputs || !analysis) return;

    if (!canDownloadPdf(tier)) {
      showUpgrade("pdf_download");
      return;
    }

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
          <h2 className="mb-5 text-lg font-semibold text-[#E8D5B7]">
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
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#E8D5B7] focus:ring-2 focus:ring-[#E8D5B7]/30"
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
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#E8D5B7] focus:ring-2 focus:ring-[#E8D5B7]/30"
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
            onClick={() => void handleAnalyze()}
            className="mt-6 w-full rounded-xl bg-[#E8D5B7] px-5 py-3 text-sm font-semibold text-[#1B4332] transition hover:bg-[#F0E4CE]"
          >
            Analyze
          </button>
          {tier === "free" && usage && Number.isFinite(usage.analyses.limit) && (
            <p className="mt-2 text-center text-xs text-white/60">
              {usage.analyses.used} of {usage.analyses.limit} analyses used this
              month
            </p>
          )}
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

              <div className="grid gap-6 sm:grid-cols-2">
                <SchoolDistrict
                  data={schoolData}
                  loading={locationLoading && !!analyzedZipCode}
                />
                <CrimeRate
                  data={crimeData}
                  loading={locationLoading && !!analyzedZipCode}
                />
              </div>

              <section className="rounded-2xl border border-white/10 bg-[#1B4332] p-6 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-[#E8D5B7]">
                      Deal Score™
                    </h2>
                    <p className="mt-1 text-sm text-white/60">
                      Composite investment quality score (0–100)
                    </p>
                  </div>
                  {canViewDealScore(tier) ? (
                    <div className="text-center">
                      <p className="text-5xl font-black text-[#E8D5B7]">
                        {computeDealScore(analysis)}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-wider text-white/50">
                        out of 100
                      </p>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => showUpgrade("deal_score")}
                      className="rounded-xl border border-[#E8D5B7]/40 bg-[#E8D5B7]/10 px-5 py-3 text-sm font-semibold text-[#E8D5B7] transition hover:bg-[#E8D5B7]/20"
                    >
                      Unlock Deal Score™
                    </button>
                  )}
                </div>
              </section>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveDeal}
                  disabled={saveStatus === "saving"}
                  className="rounded-xl bg-[#E8D5B7] px-5 py-2.5 text-sm font-semibold text-[#1B4332] transition hover:bg-[#F0E4CE] disabled:opacity-50"
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
                  className="rounded-xl border border-[#E8D5B7]/50 bg-[#E8D5B7]/10 px-5 py-2.5 text-sm font-semibold text-[#E8D5B7] transition hover:bg-[#E8D5B7]/20"
                >
                  Download PDF
                </button>
                {saveStatus === "saved" && (
                  <span className="text-sm text-[#E8D5B7]">
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
                <h2 className="mb-5 text-lg font-semibold text-[#E8D5B7]">
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
                          ? "border-[#E8D5B7]/50 bg-[#E8D5B7]/10"
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
                            ? "bg-[#E8D5B7] text-[#1B4332]"
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
                <h2 className="mb-5 text-lg font-semibold text-[#E8D5B7]">
                  Monthly Expense Breakdown
                </h2>
                <div className="space-y-1">
                  <div className="flex items-center justify-between border-b border-white/10 py-3">
                    <span className="text-sm font-medium text-[#E8D5B7]">
                      Gross rental income
                    </span>
                    <span className="font-semibold tabular-nums text-[#E8D5B7]">
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
                          ? "text-[#E8D5B7]"
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
