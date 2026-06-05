"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AFFORDABILITY_STYLES,
  calculateTrueCost,
  DEFAULT_TRUE_COST_INPUT,
  type TrueCostInput,
} from "@/lib/true-cost";
import {
  formatCurrency,
  formatCurrencyDetailed,
  formatPercentOneDecimal,
} from "@/lib/format";

export function TrueCostCalculator() {
  const [form, setForm] = useState<TrueCostInput>(DEFAULT_TRUE_COST_INPUT);

  const result = useMemo(() => calculateTrueCost(form), [form]);

  function updateField<K extends keyof TrueCostInput>(
    field: K,
    value: TrueCostInput[K],
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const maxBreakdown =
    result?.breakdown.reduce((max, item) => Math.max(max, item.amount), 0) ?? 0;

  const affordabilityStyle = result
    ? AFFORDABILITY_STYLES[result.affordability]
    : null;

  return (
    <div className="min-h-full bg-[#F7F1E8] text-[#1B4332]">
      <header className="border-b border-[#1B4332]/10 bg-[#F7F1E8]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
          <Link href="/" className="inline-flex items-baseline gap-0.5">
            <span className="text-2xl font-bold tracking-tight text-[#1B4332]">
              Venura
            </span>
            <span className="text-2xl font-bold text-[#E8D5B7]">.</span>
          </Link>
          <Link
            href="/sign-in"
            className="text-sm font-medium text-[#1B4332]/70 transition hover:text-[#1B4332]"
          >
            Log in
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1B4332]/60">
            Free Ownership Analysis
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#1B4332] sm:text-3xl">
            True Cost of Ownership
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-[#1B4332]/70 sm:text-base">
            See what a home really costs beyond the mortgage — taxes, insurance,
            HOA, utilities, PMI, and maintenance — plus equity growth over time.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="rounded-2xl border border-[#1B4332]/10 bg-white p-5 shadow-sm sm:p-8"
          >
            <h2 className="text-lg font-semibold text-[#1B4332]">
              Property & financing
            </h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field label="Purchase price" className="sm:col-span-2">
                <CurrencyInput
                  value={form.purchasePrice}
                  onChange={(v) => updateField("purchasePrice", v)}
                />
              </Field>

              <Field label="Down payment %">
                <PercentInput
                  value={form.downPaymentPercent}
                  onChange={(v) => updateField("downPaymentPercent", v)}
                  max={100}
                />
              </Field>

              <Field label="Interest rate %">
                <PercentInput
                  value={form.interestRate}
                  onChange={(v) => updateField("interestRate", v)}
                  step={0.01}
                />
              </Field>

              <Field label="Loan term (years)">
                <NumberInput
                  value={form.loanTerm}
                  onChange={(v) => updateField("loanTerm", v)}
                  min={1}
                  max={40}
                />
              </Field>

              <Field label="Appreciation rate %">
                <PercentInput
                  value={form.appreciationRate}
                  onChange={(v) => updateField("appreciationRate", v)}
                  step={0.1}
                />
              </Field>
            </div>

            <h2 className="mt-8 text-lg font-semibold text-[#1B4332]">
              Monthly carrying costs
            </h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field label="Property taxes / mo">
                <CurrencyInput
                  value={form.propertyTaxes}
                  onChange={(v) => updateField("propertyTaxes", v)}
                />
              </Field>

              <Field label="Home insurance / mo">
                <CurrencyInput
                  value={form.homeInsurance}
                  onChange={(v) => updateField("homeInsurance", v)}
                />
              </Field>

              <Field label="HOA / mo">
                <CurrencyInput
                  value={form.hoa}
                  onChange={(v) => updateField("hoa", v)}
                />
              </Field>

              <Field label="Utilities / mo">
                <CurrencyInput
                  value={form.utilities}
                  onChange={(v) => updateField("utilities", v)}
                />
              </Field>
            </div>

            <h2 className="mt-8 text-lg font-semibold text-[#1B4332]">
              Your finances
            </h2>
            <div className="mt-5">
              <Field label="Annual household income">
                <CurrencyInput
                  value={form.annualIncome}
                  onChange={(v) => updateField("annualIncome", v)}
                />
              </Field>
            </div>
          </form>

          {result && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-[#E8D5B7]/40 bg-[#1B4332] px-6 py-8 sm:px-8">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#E8D5B7]/70">
                  True monthly cost
                </p>
                <p className="mt-3 text-4xl font-black tracking-tight text-[#E8D5B7] sm:text-5xl">
                  {formatCurrencyDetailed(result.trueMonthlyCost)}
                  <span className="text-lg font-semibold text-white/60">/mo</span>
                </p>
                <p className="mt-3 text-sm text-white/70">
                  Mortgage only:{" "}
                  <span className="font-semibold text-white">
                    {formatCurrencyDetailed(result.monthlyMortgage)}/mo
                  </span>
                  <span className="text-white/50">
                    {" "}
                    (+{formatCurrencyDetailed(
                      result.trueMonthlyCost - result.monthlyMortgage,
                    )}{" "}
                    in other costs)
                  </span>
                </p>
              </div>

              <div
                className={`rounded-2xl border px-6 py-6 ${affordabilityStyle?.bg} ${affordabilityStyle?.border}`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#1B4332]/60">
                  Affordability (28% rule)
                </p>
                <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p
                      className={`text-2xl font-bold ${affordabilityStyle?.text ?? "text-[#1B4332]"}`}
                    >
                      {result.affordabilityLabel}
                    </p>
                    <p className="mt-1 text-sm text-[#1B4332]/70">
                      Housing is {formatPercentOneDecimal(result.housingRatio)} of
                      gross income
                      {result.monthlyIncome > 0 && (
                        <>
                          {" "}
                          ({formatCurrencyDetailed(result.trueMonthlyCost)} of{" "}
                          {formatCurrencyDetailed(result.monthlyIncome)})
                        </>
                      )}
                    </p>
                  </div>
                  <div className="text-right text-sm text-[#1B4332]/60">
                    <p>28% guideline</p>
                    <p className="font-semibold text-[#1B4332]">
                      ≤ {formatCurrencyDetailed(result.monthlyIncome * 0.28)}/mo
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#1B4332]/10 bg-white p-5 shadow-sm sm:p-8">
                <h2 className="text-lg font-semibold text-[#1B4332]">
                  Monthly breakdown
                </h2>
                <ul className="mt-5 space-y-4">
                  {result.breakdown.map((item) => (
                    <li key={item.label}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="font-medium text-[#1B4332]">
                          {item.label}
                        </span>
                        <span className="font-semibold text-[#1B4332]">
                          {formatCurrencyDetailed(item.amount)}
                        </span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-[#1B4332]/10">
                        <div
                          className="h-full rounded-full bg-[#1B4332] transition-all duration-300"
                          style={{
                            width: `${maxBreakdown > 0 ? (item.amount / maxBreakdown) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex items-center justify-between border-t border-[#1B4332]/10 pt-4">
                  <span className="font-semibold text-[#1B4332]">Total</span>
                  <span className="text-lg font-bold text-[#1B4332]">
                    {formatCurrencyDetailed(result.trueMonthlyCost)}/mo
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-[#1B4332]/10 bg-white p-5 shadow-sm sm:p-8">
                <h2 className="text-lg font-semibold text-[#1B4332]">
                  Equity projection
                </h2>
                <p className="mt-1 text-sm text-[#1B4332]/70">
                  Based on {formatPercentOneDecimal(form.appreciationRate)}{" "}
                  annual appreciation.
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {result.equityProjections.map((projection) => (
                    <div
                      key={projection.year}
                      className="rounded-xl border border-[#1B4332]/10 bg-[#F7F1E8] p-4"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#1B4332]/60">
                        Year {projection.year}
                      </p>
                      <p className="mt-2 text-2xl font-black text-[#1B4332]">
                        {formatCurrency(projection.equity)}
                      </p>
                      <p className="mt-1 text-xs text-[#1B4332]/60">
                        Home value {formatCurrency(projection.homeValue)} · Loan{" "}
                        {formatCurrency(projection.loanBalance)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[#1B4332]/10 bg-white p-5 shadow-sm sm:p-8">
                <h2 className="text-lg font-semibold text-[#1B4332]">
                  Hidden costs
                </h2>
                <p className="mt-1 text-sm text-[#1B4332]/70">
                  Costs buyers often overlook at closing and after move-in.
                </p>
                <ul className="mt-5 space-y-3">
                  <HiddenCostRow
                    label="PMI"
                    detail={
                      form.downPaymentPercent < 20
                        ? "Required with less than 20% down"
                        : "Not required at this down payment"
                    }
                    monthly={result.hiddenCosts.pmi}
                    oneTime={null}
                  />
                  <HiddenCostRow
                    label="Maintenance reserve"
                    detail="Budget ~1% of home value annually"
                    monthly={result.hiddenCosts.maintenance}
                    oneTime={null}
                  />
                  <HiddenCostRow
                    label="Closing costs"
                    detail="Estimated at 3% of purchase price"
                    monthly={null}
                    oneTime={result.hiddenCosts.closingCosts}
                  />
                </ul>
              </div>

              <div className="rounded-2xl border border-[#E8D5B7]/30 bg-[#1B4332]/80 p-5 sm:p-8">
                <h2 className="text-lg font-semibold text-[#E8D5B7]">
                  Total upfront cash needed
                </h2>
                <p className="mt-3 text-3xl font-black text-white">
                  {formatCurrency(result.totalUpfrontCash)}
                </p>
                <p className="mt-2 text-sm text-white/70">
                  Down payment {formatCurrency(result.downPayment)} + closing
                  costs {formatCurrency(result.hiddenCosts.closingCosts)}
                </p>
              </div>

              <div className="rounded-2xl border border-[#1B4332]/10 bg-[#1B4332] px-6 py-8 text-center sm:px-8">
                <h2 className="text-lg font-semibold text-[#E8D5B7]">
                  Ready to underwrite the full deal?
                </h2>
                <p className="mx-auto mt-2 max-w-lg text-sm text-white/75">
                  Run cash flow, cap rate, and a Go / No-Go verdict on Venura with
                  rent, HOA, and financing built in.
                </p>
                <Link
                  href="/analyzer"
                  className="mt-6 inline-flex rounded-xl bg-[#E8D5B7] px-6 py-3.5 text-sm font-semibold text-[#1B4332] transition hover:bg-[#F0E4CE]"
                >
                  Analyze on Venura →
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-[#1B4332]/15 bg-[#F7F1E8] px-3 py-2.5 text-sm text-[#1B4332] outline-none transition placeholder:text-[#1B4332]/30 focus:border-[#1B4332] focus:ring-2 focus:ring-[#E8D5B7]/60";

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#1B4332]/70">
        {label}
      </span>
      {children}
    </label>
  );
}

function CurrencyInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#1B4332]/50">
        $
      </span>
      <input
        type="number"
        min={0}
        step={1}
        value={value || ""}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
        className={`${inputClass} pl-7`}
      />
    </div>
  );
}

function PercentInput({
  value,
  onChange,
  step = 0.1,
  max = 100,
}: {
  value: number;
  onChange: (value: number) => void;
  step?: number;
  max?: number;
}) {
  return (
    <div className="relative">
      <input
        type="number"
        min={0}
        max={max}
        step={step}
        value={value || ""}
        onChange={(e) =>
          onChange(Math.max(0, Math.min(max, Number(e.target.value) || 0)))
        }
        className={`${inputClass} pr-8`}
      />
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#1B4332]/50">
        %
      </span>
    </div>
  );
}

function NumberInput({
  value,
  onChange,
  min,
  max,
}: {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
}) {
  return (
    <input
      type="number"
      min={min}
      max={max}
      step={1}
      value={value || ""}
      onChange={(e) =>
        onChange(
          Math.max(min, Math.min(max, Math.round(Number(e.target.value) || 0))),
        )
      }
      className={inputClass}
    />
  );
}

function HiddenCostRow({
  label,
  detail,
  monthly,
  oneTime,
}: {
  label: string;
  detail: string;
  monthly: number | null;
  oneTime: number | null;
}) {
  return (
    <li className="flex flex-col gap-1 rounded-xl border border-[#1B4332]/10 bg-[#F7F1E8] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-semibold text-[#1B4332]">{label}</p>
        <p className="text-xs text-[#1B4332]/60">{detail}</p>
      </div>
      <p className="text-sm font-bold text-[#1B4332]">
        {oneTime !== null
          ? formatCurrency(oneTime)
          : monthly !== null && monthly > 0
            ? `${formatCurrencyDetailed(monthly)}/mo`
            : "$0"}
      </p>
    </li>
  );
}
