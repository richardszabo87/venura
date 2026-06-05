"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  calculateRentVsBuy,
  DEFAULT_RENT_VS_BUY_INPUT,
  VERDICT_STYLES,
  type RentVsBuyInput,
} from "@/lib/rent-vs-buy";
import { formatCurrency } from "@/lib/format";

export function RentVsBuyCalculator() {
  const [form, setForm] = useState<RentVsBuyInput>(DEFAULT_RENT_VS_BUY_INPUT);
  const result = useMemo(() => calculateRentVsBuy(form), [form]);

  function updateField<K extends keyof RentVsBuyInput>(
    field: K,
    value: RentVsBuyInput[K],
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const verdictStyle = result ? VERDICT_STYLES[result.verdict] : null;
  const chartMax =
    result?.wealthChart.reduce(
      (max, point) => Math.max(max, point.buyWealth, point.rentWealth),
      0,
    ) ?? 0;

  return (
    <div className="min-h-full bg-[#F7F1E8] text-[#1B4332]">
      <header className="border-b border-[#1B4332]/10 bg-[#F7F1E8]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
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

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1B4332]/60">
            Free Housing Decision Tool
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#1B4332] sm:text-3xl">
            Rent vs Buy Calculator
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-[#1B4332]/70 sm:text-base">
            Compare wealth-building over time — mortgage, appreciation, and equity
            on the buy side vs rent growth and invested savings on the rent side.
          </p>
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="grid gap-6 lg:grid-cols-2"
        >
          <InputPanel title="Buy" accent="bg-[#1B4332] text-[#E8D5B7]">
            <Field label="Purchase price">
              <CurrencyInput
                value={form.purchasePrice}
                onChange={(v) => updateField("purchasePrice", v)}
              />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Down payment %">
                <PercentInput
                  value={form.downPaymentPercent}
                  onChange={(v) => updateField("downPaymentPercent", v)}
                />
              </Field>
              <Field label="Interest rate %">
                <PercentInput
                  value={form.interestRate}
                  onChange={(v) => updateField("interestRate", v)}
                  step={0.01}
                />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
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
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="HOA / mo">
                <CurrencyInput
                  value={form.hoa}
                  onChange={(v) => updateField("hoa", v)}
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
          </InputPanel>

          <InputPanel title="Rent" accent="bg-[#E8D5B7] text-[#1B4332]">
            <Field label="Monthly rent">
              <CurrencyInput
                value={form.monthlyRent}
                onChange={(v) => updateField("monthlyRent", v)}
              />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Renters insurance / mo">
                <CurrencyInput
                  value={form.rentersInsurance}
                  onChange={(v) => updateField("rentersInsurance", v)}
                />
              </Field>
              <Field label="Annual rent increase %">
                <PercentInput
                  value={form.annualRentIncrease}
                  onChange={(v) => updateField("annualRentIncrease", v)}
                  step={0.1}
                />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Investment return on savings %">
                <PercentInput
                  value={form.investmentReturn}
                  onChange={(v) => updateField("investmentReturn", v)}
                  step={0.1}
                />
              </Field>
              <Field label="Years planning to stay">
                <NumberInput
                  value={form.yearsToStay}
                  onChange={(v) => updateField("yearsToStay", v)}
                  min={1}
                  max={30}
                />
              </Field>
            </div>
            <Field label="Annual household income">
              <CurrencyInput
                value={form.annualIncome}
                onChange={(v) => updateField("annualIncome", v)}
              />
            </Field>
          </InputPanel>
        </form>

        {result && verdictStyle && (
          <div className="mt-8 space-y-6">
            <div
              className={`rounded-2xl border px-6 py-8 text-center sm:px-8 ${verdictStyle.bg} ${verdictStyle.border}`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
                Recommendation
              </p>
              <p
                className={`mt-3 text-5xl font-black tracking-tight sm:text-6xl ${verdictStyle.text}`}
              >
                {verdictStyle.label}
              </p>
              <p
                className={`mx-auto mt-4 max-w-xl text-sm ${
                  result.verdict === "buy" ? "text-white/75" : "text-[#1B4332]/70"
                }`}
              >
                After {form.yearsToStay} years,{" "}
                {result.verdict === "buy" ? "buying" : "renting"} leaves you{" "}
                {formatCurrency(result.wealthDifference)} ahead.
                {result.breakEvenYear && (
                  <>
                    {" "}
                    Break-even year:{" "}
                    <span className="font-semibold">Year {result.breakEvenYear}</span>
                    {result.breakEvenYear > form.yearsToStay && (
                      <> (after your planned stay)</>
                    )}
                    .
                  </>
                )}
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-[#1B4332]/10 bg-white shadow-sm">
              <div className="border-b border-[#1B4332]/10 px-5 py-4 sm:px-8">
                <h2 className="text-lg font-semibold text-[#1B4332]">
                  Side-by-side comparison
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#1B4332]/10 bg-[#F7F1E8]">
                      <th className="px-5 py-3 font-semibold text-[#1B4332]/60 sm:px-8">
                        Metric
                      </th>
                      <th className="px-5 py-3 font-semibold text-[#1B4332] sm:px-8">
                        Buy
                      </th>
                      <th className="px-5 py-3 font-semibold text-[#1B4332] sm:px-8">
                        Rent
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.comparisonTable.map((row) => (
                      <tr
                        key={row.label}
                        className="border-b border-[#1B4332]/5 last:border-0"
                      >
                        <td className="px-5 py-3.5 text-[#1B4332]/70 sm:px-8">
                          {row.label}
                        </td>
                        <td
                          className={`px-5 py-3.5 font-semibold sm:px-8 ${
                            row.winner === "buy"
                              ? "bg-[#1B4332]/5 text-[#1B4332]"
                              : "text-[#1B4332]/80"
                          }`}
                        >
                          {row.buyValue}
                        </td>
                        <td
                          className={`px-5 py-3.5 font-semibold sm:px-8 ${
                            row.winner === "rent"
                              ? "bg-[#E8D5B7]/30 text-[#1B4332]"
                              : "text-[#1B4332]/80"
                          }`}
                        >
                          {row.rentValue}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl border border-[#1B4332]/10 bg-white p-5 shadow-sm sm:p-8">
              <h2 className="text-lg font-semibold text-[#1B4332]">
                10-year wealth building
              </h2>
              <p className="mt-1 text-sm text-[#1B4332]/70">
                Net worth after estimated 5% selling costs vs invested rental
                savings.
              </p>

              <div className="mt-6 flex items-center gap-4 text-xs font-semibold uppercase tracking-wider text-[#1B4332]/60">
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm bg-[#1B4332]" />
                  Buy
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 rounded-sm bg-[#E8D5B7] ring-1 ring-[#1B4332]/20" />
                  Rent
                </span>
              </div>

              <div className="mt-5 space-y-4">
                {result.wealthChart.map((point) => (
                  <div key={point.year}>
                    <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-[#1B4332]/70">
                      <span>Year {point.year}</span>
                      <span>
                        {formatCurrency(point.buyWealth)} vs{" "}
                        {formatCurrency(point.rentWealth)}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <WealthBar
                        amount={point.buyWealth}
                        max={chartMax}
                        className="bg-[#1B4332]"
                      />
                      <WealthBar
                        amount={point.rentWealth}
                        max={chartMax}
                        className="bg-[#E8D5B7] ring-1 ring-[#1B4332]/15"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#1B4332]/10 bg-white p-5 shadow-sm sm:p-8">
              <h2 className="text-lg font-semibold text-[#1B4332]">
                Key insights
              </h2>
              <ul className="mt-4 space-y-3">
                {result.insights.map((insight) => (
                  <li
                    key={insight}
                    className="flex gap-3 rounded-xl border border-[#1B4332]/10 bg-[#F7F1E8] px-4 py-3 text-sm leading-relaxed text-[#1B4332]/85"
                  >
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#E8D5B7] ring-2 ring-[#1B4332]/20" />
                    {insight}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-[#1B4332]/10 bg-[#1B4332] px-6 py-8 text-center sm:px-8">
              <h2 className="text-lg font-semibold text-[#E8D5B7]">
                {result.cta.headline}
              </h2>
              <p className="mx-auto mt-2 max-w-lg text-sm text-white/75">
                {result.cta.description}
              </p>
              <Link
                href={result.cta.href}
                className="mt-6 inline-flex rounded-xl bg-[#E8D5B7] px-6 py-3.5 text-sm font-semibold text-[#1B4332] transition hover:bg-[#F0E4CE]"
              >
                {result.cta.label}
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function InputPanel({
  title,
  accent,
  children,
}: {
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[#1B4332]/10 bg-white p-5 shadow-sm sm:p-8">
      <div
        className={`mb-6 inline-flex rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-[0.25em] ${accent}`}
      >
        {title}
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function WealthBar({
  amount,
  max,
  className,
}: {
  amount: number;
  max: number;
  className: string;
}) {
  return (
    <div className="h-3 overflow-hidden rounded-full bg-[#1B4332]/8">
      <div
        className={`h-full rounded-full transition-all duration-300 ${className}`}
        style={{ width: `${max > 0 ? (amount / max) * 100 : 0}%` }}
      />
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-[#1B4332]/15 bg-[#F7F1E8] px-3 py-2.5 text-sm text-[#1B4332] outline-none transition placeholder:text-[#1B4332]/30 focus:border-[#1B4332] focus:ring-2 focus:ring-[#E8D5B7]/60";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
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
