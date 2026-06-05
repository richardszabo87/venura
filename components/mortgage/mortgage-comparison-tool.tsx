"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "@/lib/format";
import {
  calculateMortgageComparison,
  CREDIT_SCORE_OPTIONS,
  DEFAULT_MORTGAGE_INPUT,
  type CreditScoreRange,
  type LoanOption,
  type MortgageComparisonInput,
} from "@/lib/mortgage-comparison";

const FOREST = "#1B4332";
const CREAM = "#E8D5B7";
const CHART_COLORS = [FOREST, CREAM, "#2D6A4F", "#40916C", "#52B788", "#74C69D"];

export function MortgageComparisonTool() {
  const [form, setForm] = useState<MortgageComparisonInput>(
    DEFAULT_MORTGAGE_INPUT,
  );
  const result = useMemo(() => calculateMortgageComparison(form), [form]);

  function updateField<K extends keyof MortgageComparisonInput>(
    field: K,
    value: MortgageComparisonInput[K],
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

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
            Free Mortgage Comparison
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#1B4332] sm:text-3xl">
            Mortgage Comparison Tool
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-[#1B4332]/70 sm:text-base">
            Compare FHA, conventional, VA, 5/1 ARM, and HELOC side by side —
            monthly payments, 30-year total cost, and a personalized
            recommendation.
          </p>
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="rounded-2xl border border-[#1B4332]/10 bg-white p-5 shadow-sm sm:p-8"
        >
          <div className="mb-6 inline-flex rounded-lg bg-[#1B4332] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-[#E8D5B7]">
            Your Profile
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Home price">
              <CurrencyInput
                value={form.homePrice}
                onChange={(v) => updateField("homePrice", v)}
              />
            </Field>
            <Field label="Annual income">
              <CurrencyInput
                value={form.annualIncome}
                onChange={(v) => updateField("annualIncome", v)}
              />
            </Field>
            <Field label="Credit score range">
              <select
                value={form.creditScoreRange}
                onChange={(e) =>
                  updateField(
                    "creditScoreRange",
                    e.target.value as CreditScoreRange,
                  )
                }
                className={inputClass}
              >
                {CREDIT_SCORE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label} ({opt.range})
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Available down payment">
              <CurrencyInput
                value={form.availableDownPayment}
                onChange={(v) => updateField("availableDownPayment", v)}
              />
            </Field>
            <Field label="Home equity (other property)">
              <CurrencyInput
                value={form.homeEquity}
                onChange={(v) => updateField("homeEquity", v)}
              />
            </Field>
            <Field label="Veteran status">
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#1B4332]/15 bg-[#F7F1E8] px-3 py-2.5">
                <input
                  type="checkbox"
                  checked={form.isVeteran}
                  onChange={(e) => updateField("isVeteran", e.target.checked)}
                  className="h-4 w-4 rounded border-[#1B4332]/30 text-[#1B4332] focus:ring-[#E8D5B7]"
                />
                <span className="text-sm text-[#1B4332]">
                  I am an eligible veteran
                </span>
              </label>
            </Field>
          </div>
        </form>

        {result && (
          <div className="mt-8 space-y-6">
            {result.winner ? (
              <div className="rounded-2xl border border-[#1B4332]/20 bg-[#1B4332] px-6 py-8 text-center sm:px-8">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#E8D5B7]/70">
                  Recommended Winner
                </p>
                <p className="mt-3 text-4xl font-black tracking-tight text-[#E8D5B7] sm:text-5xl">
                  {result.winner.name}
                </p>
                <p className="mx-auto mt-4 max-w-xl text-sm text-white/75">
                  {formatCurrency(result.winner.monthlyPayment)}/mo with{" "}
                  {formatCurrency(result.winner.totalCost30Year)} total cost over
                  30 years
                  {result.winner.housingRatio > 0 && (
                    <>
                      {" "}
                      — {result.winner.housingRatio.toFixed(1)}% of gross income
                    </>
                  )}
                  .
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-[#1B4332]/10 bg-white px-6 py-8 text-center">
                <p className="text-sm text-[#1B4332]/70">
                  No eligible loan options with your current inputs. Try
                  adjusting down payment, credit score, or veteran status.
                </p>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {result.loans.map((loan) => (
                <LoanCard key={loan.id} loan={loan} />
              ))}
            </div>

            {result.chartData.monthlyPayment.length > 0 && (
              <div className="grid gap-6 lg:grid-cols-2">
                <ChartPanel
                  title="Monthly payment comparison"
                  subtitle="P&I, insurance, taxes, and PMI/MIP included"
                  data={result.chartData.monthlyPayment}
                  winnerId={result.winner?.id}
                />
                <ChartPanel
                  title="30-year total cost"
                  subtitle="All payments plus down payment over 30 years"
                  data={result.chartData.totalCost}
                  winnerId={result.winner?.id}
                />
              </div>
            )}

            <div className="overflow-hidden rounded-2xl border border-[#1B4332]/10 bg-white shadow-sm">
              <div className="border-b border-[#1B4332]/10 px-5 py-4 sm:px-8">
                <h2 className="text-lg font-semibold text-[#1B4332]">
                  Full comparison table
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#1B4332]/10 bg-[#F7F1E8]">
                      <th className="sticky left-0 z-10 bg-[#F7F1E8] px-5 py-3 font-semibold text-[#1B4332]/60 sm:px-8">
                        Metric
                      </th>
                      {result.loans.map((loan) => (
                        <th
                          key={loan.id}
                          className={`px-4 py-3 font-semibold sm:px-5 ${
                            loan.isWinner
                              ? "bg-[#1B4332]/10 text-[#1B4332]"
                              : "text-[#1B4332]"
                          }`}
                        >
                          {loan.shortName}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.comparisonTable.map((row) => (
                      <tr
                        key={row.label}
                        className="border-b border-[#1B4332]/5 last:border-0"
                      >
                        <td className="sticky left-0 z-10 bg-white px-5 py-3.5 text-[#1B4332]/70 sm:px-8">
                          {row.label}
                        </td>
                        {result.loans.map((loan) => (
                          <td
                            key={loan.id}
                            className={`px-4 py-3.5 font-medium sm:px-5 ${
                              row.winner === loan.id
                                ? "bg-[#E8D5B7]/40 font-semibold text-[#1B4332]"
                                : loan.eligible
                                  ? "text-[#1B4332]/85"
                                  : "text-[#1B4332]/40"
                            }`}
                          >
                            {row.values[loan.id]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl border border-[#1B4332]/10 bg-white p-5 shadow-sm sm:p-8">
              <h2 className="text-lg font-semibold text-[#1B4332]">
                Personalized insights
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
                Know your true monthly cost
              </h2>
              <p className="mx-auto mt-2 max-w-lg text-sm text-white/75">
                Mortgage payment is only part of the picture. See taxes,
                insurance, HOA, PMI, and maintenance in one view.
              </p>
              <Link
                href="/cost"
                className="mt-6 inline-flex rounded-xl bg-[#E8D5B7] px-6 py-3.5 text-sm font-semibold text-[#1B4332] transition hover:bg-[#F0E4CE]"
              >
                Open True Cost Calculator
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function LoanCard({ loan }: { loan: LoanOption }) {
  return (
    <article
      className={`rounded-2xl border p-5 shadow-sm transition ${
        loan.isWinner
          ? "border-[#1B4332] bg-[#1B4332] text-white"
          : loan.eligible
            ? "border-[#1B4332]/10 bg-white"
            : "border-[#1B4332]/10 bg-white opacity-70"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3
          className={`text-base font-bold ${
            loan.isWinner ? "text-[#E8D5B7]" : "text-[#1B4332]"
          }`}
        >
          {loan.name}
        </h3>
        {loan.isWinner && (
          <span className="shrink-0 rounded-full bg-[#E8D5B7] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#1B4332]">
            Winner
          </span>
        )}
      </div>

      {loan.eligible ? (
        <>
          <p
            className={`mt-3 text-3xl font-black tracking-tight ${
              loan.isWinner ? "text-white" : "text-[#1B4332]"
            }`}
          >
            {formatCurrency(loan.monthlyPayment)}
            <span
              className={`text-sm font-semibold ${
                loan.isWinner ? "text-white/60" : "text-[#1B4332]/50"
              }`}
            >
              /mo
            </span>
          </p>
          <dl className="mt-4 space-y-1.5 text-xs">
            <Row
              label="Rate"
              value={`${loan.interestRate.toFixed(2)}%`}
              winner={loan.isWinner}
            />
            <Row
              label="Down"
              value={formatCurrency(loan.downPayment)}
              winner={loan.isWinner}
            />
            <Row
              label="30-yr total"
              value={formatCurrency(loan.totalCost30Year)}
              winner={loan.isWinner}
            />
          </dl>
        </>
      ) : (
        <p className="mt-3 text-sm text-[#1B4332]/60">
          {loan.ineligibleReason ?? "Not eligible"}
        </p>
      )}
    </article>
  );
}

function Row({
  label,
  value,
  winner,
}: {
  label: string;
  value: string;
  winner: boolean;
}) {
  return (
    <div className="flex justify-between gap-2">
      <dt className={winner ? "text-white/60" : "text-[#1B4332]/60"}>
        {label}
      </dt>
      <dd
        className={`font-semibold ${winner ? "text-[#E8D5B7]" : "text-[#1B4332]"}`}
      >
        {value}
      </dd>
    </div>
  );
}

function ChartPanel({
  title,
  subtitle,
  data,
  winnerId,
}: {
  title: string;
  subtitle: string;
  data: { name: string; value: number; id: string }[];
  winnerId?: string;
}) {
  return (
    <div className="rounded-2xl border border-[#1B4332]/10 bg-white p-5 shadow-sm sm:p-8">
      <h2 className="text-lg font-semibold text-[#1B4332]">{title}</h2>
      <p className="mt-1 text-sm text-[#1B4332]/70">{subtitle}</p>
      <div className="mt-6 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1B4332"
              strokeOpacity={0.08}
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={{ fill: "#1B4332", fontSize: 11, opacity: 0.7 }}
              axisLine={{ stroke: "#1B4332", strokeOpacity: 0.15 }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) =>
                v >= 1_000_000
                  ? `$${(v / 1_000_000).toFixed(1)}M`
                  : v >= 1000
                    ? `$${(v / 1000).toFixed(0)}k`
                    : `$${v}`
              }
              tick={{ fill: "#1B4332", fontSize: 11, opacity: 0.7 }}
              axisLine={false}
              tickLine={false}
              width={52}
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: "#F7F1E8",
                border: "1px solid rgba(27, 67, 50, 0.15)",
                borderRadius: "0.75rem",
                color: "#1B4332",
                fontSize: "0.875rem",
              }}
              cursor={{ fill: "rgba(232, 213, 183, 0.25)" }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
              {data.map((entry, index) => (
                <Cell
                  key={entry.id}
                  fill={
                    entry.id === winnerId
                      ? FOREST
                      : CHART_COLORS[index % CHART_COLORS.length]
                  }
                  fillOpacity={entry.id === winnerId ? 1 : 0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
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
