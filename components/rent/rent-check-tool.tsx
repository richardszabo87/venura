"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  calculateRentCheck,
  DEFAULT_RENT_INPUT,
  PROPERTY_TYPE_LABEL,
  type RentCheckInput,
  type RentCondition,
  type RentPropertyType,
} from "@/lib/rent-check";
import { formatCurrency } from "@/lib/format";

const BEDROOM_OPTIONS = [1, 2, 3, 4];

const PROPERTY_TYPES: { value: RentPropertyType; label: string }[] = [
  { value: "condo", label: "Condo" },
  { value: "townhouse", label: "Townhouse" },
  { value: "single-family", label: "Single family" },
  { value: "multi-family", label: "Multi-family" },
];

const CONDITION_OPTIONS: { value: RentCondition; label: string }[] = [
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "needs-work", label: "Needs work" },
];

export function RentCheckTool() {
  const [form, setForm] = useState<RentCheckInput>(DEFAULT_RENT_INPUT);
  const [submitted, setSubmitted] = useState(false);

  const result = useMemo(() => {
    if (!submitted) return null;
    return calculateRentCheck(form);
  }, [form, submitted]);

  function updateField<K extends keyof RentCheckInput>(
    field: K,
    value: RentCheckInput[K],
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSubmitted(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.addressOrZip.trim()) {
      setSubmitted(true);
    }
  }

  return (
    <div className="min-h-full bg-[#F7F1E8] text-[#1B4332]">
      <header className="border-b border-[#1B4332]/10 bg-[#F7F1E8]">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-5 sm:px-6">
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

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1B4332]/60">
            Free Rent Analysis
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#1B4332] sm:text-3xl">
            RentCheck
          </h1>
          <p className="mt-3 text-sm text-[#1B4332]/70 sm:text-base">
            Estimate market rent, compare nearby listings, and understand local
            rental trends across DC metro, Baltimore, NoVA, Atlanta, Miami, and
            Phoenix before you analyze a deal.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[#1B4332]/10 bg-white p-5 shadow-sm sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Address or zip code" className="sm:col-span-2">
              <input
                type="text"
                value={form.addressOrZip}
                onChange={(e) => updateField("addressOrZip", e.target.value)}
                onFocus={(e) => e.target.select()}
                tabIndex={1}
                placeholder="20901 or 1234 Fenton St, Silver Spring MD"
                className={inputClass}
                required
              />
            </Field>

            <Field label="Bedrooms">
              <select
                value={form.bedrooms}
                onChange={(e) =>
                  updateField("bedrooms", Number(e.target.value))
                }
                tabIndex={2}
                className={inputClass}
              >
                {BEDROOM_OPTIONS.map((beds) => (
                  <option key={beds} value={beds}>
                    {beds} {beds === 1 ? "bedroom" : "bedrooms"}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Property type">
              <select
                value={form.propertyType}
                onChange={(e) =>
                  updateField("propertyType", e.target.value as RentPropertyType)
                }
                tabIndex={3}
                className={inputClass}
              >
                {PROPERTY_TYPES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Condition" className="sm:col-span-2">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {CONDITION_OPTIONS.map((option, index) => {
                  const selected = form.condition === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      tabIndex={4 + index}
                      onClick={() => updateField("condition", option.value)}
                      className={`rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${
                        selected
                          ? "border-[#1B4332] bg-[#1B4332] text-[#E8D5B7]"
                          : "border-[#1B4332]/15 bg-[#F7F1E8] text-[#1B4332] hover:border-[#1B4332]/40"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </Field>
          </div>

          <button
            type="submit"
            tabIndex={8}
            className="mt-8 w-full rounded-xl bg-[#1B4332] px-6 py-3.5 text-sm font-semibold text-[#E8D5B7] transition hover:bg-[#163828] sm:w-auto"
          >
            Check rent estimate
          </button>
        </form>

        {result && (
          <div className="mt-8 space-y-6">
            <div className="rounded-2xl border border-[#E8D5B7]/40 bg-[#1B4332] px-6 py-8 text-center sm:px-8">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#E8D5B7]/70">
                Estimated monthly rent
              </p>
              <p className="mt-3 text-4xl font-black tracking-tight text-[#E8D5B7] sm:text-5xl">
                {formatCurrency(result.rentRange.low)} –{" "}
                {formatCurrency(result.rentRange.high)}
              </p>
              <p className="mt-2 text-sm text-white/70">
                Mid estimate: {formatCurrency(result.rentRange.mid)}/mo
              </p>
              <p className="mt-4 text-sm text-white/80">
                {result.areaLabel} · ZIP {result.zipCode} ·{" "}
                {form.bedrooms} bed {PROPERTY_TYPE_LABEL[form.propertyType].toLowerCase()}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard
                label="Rent growth"
                value={`+${result.marketStats.rentGrowth.toFixed(1)}%`}
                detail="YoY in this submarket"
              />
              <StatCard
                label="Vacancy rate"
                value={`${result.marketStats.vacancyRate.toFixed(1)}%`}
                detail="Average local vacancy"
              />
              <StatCard
                label="Days on market"
                value={`${result.marketStats.daysOnMarket}`}
                detail="Avg. time to lease"
              />
            </div>

            <div className="rounded-2xl border border-[#1B4332]/10 bg-white p-5 shadow-sm sm:p-8">
              <h2 className="text-lg font-semibold text-[#1B4332]">
                Comparable rentals nearby
              </h2>
              <p className="mt-1 text-sm text-[#1B4332]/70">
                Similar units recently listed within ~1 mile.
              </p>

              <ul className="mt-5 space-y-3">
                {result.comparables.map((comp) => (
                  <li
                    key={comp.address}
                    className="flex flex-col gap-2 rounded-xl border border-[#1B4332]/10 bg-[#F7F1E8] p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-[#1B4332]">
                        {comp.address}
                      </p>
                      <p className="mt-1 text-sm text-[#1B4332]/70">
                        {comp.bedrooms} bed · {comp.bathrooms} bath ·{" "}
                        {PROPERTY_TYPE_LABEL[comp.propertyType]} · {comp.distance}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-[#1B4332]">
                      {formatCurrency(comp.rent)}
                      <span className="text-sm font-normal text-[#1B4332]/60">
                        /mo
                      </span>
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-[#1B4332]/10 bg-white p-5 shadow-sm sm:p-8">
              <h2 className="text-lg font-semibold text-[#1B4332]">
                Market insights
              </h2>
              <ul className="mt-4 space-y-3">
                {result.insights.map((insight) => (
                  <li
                    key={insight}
                    className="flex gap-3 rounded-xl border border-[#1B4332]/10 bg-[#F7F1E8] px-4 py-3 text-sm leading-relaxed text-[#1B4332]/85"
                  >
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#E8D5B7]" />
                    {insight}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-[#1B4332]/10 bg-[#1B4332] px-6 py-8 text-center sm:px-8">
              <h2 className="text-lg font-semibold text-[#E8D5B7]">
                Ready to underwrite the full deal?
              </h2>
              <p className="mx-auto mt-2 max-w-lg text-sm text-white/75">
                Plug this rent estimate into Venura&apos;s analyzer for cash
                flow, cap rate, and a Go / No-Go verdict.
              </p>
              <Link
                href="/analyzer"
                className="mt-6 inline-flex rounded-xl bg-[#E8D5B7] px-6 py-3.5 text-sm font-semibold text-[#1B4332] transition hover:bg-[#F0E4CE]"
              >
                Analyze the full deal on Venura →
              </Link>
            </div>
          </div>
        )}
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

function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-[#1B4332]/10 bg-white p-5 text-center shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-[#1B4332]/60">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black text-[#1B4332]">{value}</p>
      <p className="mt-1 text-xs text-[#1B4332]/60">{detail}</p>
    </div>
  );
}
