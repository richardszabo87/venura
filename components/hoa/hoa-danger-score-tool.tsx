"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  calculateHoaDangerScore,
  DEFAULT_HOA_INPUT,
  type HoaScoreInput,
  type LitigationStatus,
  type PropertyType,
  type RiskBand,
} from "@/lib/hoa-danger-score";

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: "condo", label: "Condo" },
  { value: "townhouse", label: "Townhouse" },
  { value: "co-op", label: "Co-op" },
  { value: "pud", label: "Planned Unit Development" },
];

const LITIGATION_OPTIONS: { value: LitigationStatus; label: string }[] = [
  { value: "none", label: "None" },
  { value: "pending", label: "Pending" },
  { value: "active", label: "Active" },
  { value: "recently-resolved", label: "Recently resolved" },
];

const BAND_STYLES: Record<
  RiskBand,
  { card: string; badge: string; score: string; label: string }
> = {
  healthy: {
    card: "border-emerald-400/40 bg-emerald-950/20",
    badge: "bg-emerald-500/20 text-emerald-200",
    score: "text-emerald-300",
    label: "Healthy",
  },
  watch: {
    card: "border-amber-400/40 bg-amber-950/20",
    badge: "bg-amber-500/20 text-amber-200",
    score: "text-amber-300",
    label: "Watch",
  },
  "high-risk": {
    card: "border-red-400/40 bg-red-950/20",
    badge: "bg-red-500/20 text-red-200",
    score: "text-red-300",
    label: "High Risk",
  },
};

export function HoaDangerScoreTool() {
  const [form, setForm] = useState<HoaScoreInput>(DEFAULT_HOA_INPUT);
  const [submitted, setSubmitted] = useState(false);

  const result = useMemo(() => {
    if (!submitted) return null;
    return calculateHoaDangerScore(form);
  }, [form, submitted]);

  function updateField<K extends keyof HoaScoreInput>(
    field: K,
    value: HoaScoreInput[K],
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSubmitted(false);
  }

  function updateNumber(field: keyof HoaScoreInput, raw: string) {
    const value = raw === "" ? 0 : Number(raw);
    updateField(field, Number.isFinite(value) ? value : 0);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  const styles = result ? BAND_STYLES[result.band] : null;

  return (
    <div className="min-h-full bg-[#F7F1E8] text-[#1B4332]">
      <header className="border-b border-[#1B4332]/10 bg-[#F7F1E8]">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-5 sm:px-6">
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

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1B4332]/60">
            Free HOA Analysis Tool
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#1B4332] sm:text-3xl">
            HOA Danger Score
          </h1>
          <p className="mt-3 text-sm text-[#1B4332]/70 sm:text-base">
            Evaluate reserve health, fee trends, and assessment risk before you
            buy. Score ranges from 0–100 — higher is healthier.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-[#1B4332]/10 bg-white p-5 shadow-sm sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Building name" className="sm:col-span-2">
              <input
                type="text"
                value={form.buildingName}
                onChange={(e) => updateField("buildingName", e.target.value)}
                placeholder="e.g. Riverside Commons"
                className={inputClass}
              />
            </Field>

            <Field label="Year built">
              <input
                type="number"
                min={1900}
                max={new Date().getFullYear()}
                value={form.yearBuilt || ""}
                onChange={(e) => updateNumber("yearBuilt", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Number of units">
              <input
                type="number"
                min={1}
                value={form.numberOfUnits || ""}
                onChange={(e) => updateNumber("numberOfUnits", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Property type">
              <select
                value={form.propertyType}
                onChange={(e) =>
                  updateField("propertyType", e.target.value as PropertyType)
                }
                className={inputClass}
              >
                {PROPERTY_TYPES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Litigation status">
              <select
                value={form.litigationStatus}
                onChange={(e) =>
                  updateField(
                    "litigationStatus",
                    e.target.value as LitigationStatus,
                  )
                }
                className={inputClass}
              >
                {LITIGATION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Current HOA fee" prefix="$" suffix="/mo">
              <input
                type="number"
                min={0}
                value={form.currentHoaFee || ""}
                onChange={(e) => updateNumber("currentHoaFee", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="HOA fee 1 year ago" prefix="$" suffix="/mo">
              <input
                type="number"
                min={0}
                value={form.hoaFee1YearAgo || ""}
                onChange={(e) => updateNumber("hoaFee1YearAgo", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="HOA fee 2 years ago" prefix="$" suffix="/mo">
              <input
                type="number"
                min={0}
                value={form.hoaFee2YearsAgo || ""}
                onChange={(e) => updateNumber("hoaFee2YearsAgo", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Expected monthly rent" prefix="$" suffix="/mo">
              <input
                type="number"
                min={0}
                value={form.expectedMonthlyRent || ""}
                onChange={(e) =>
                  updateNumber("expectedMonthlyRent", e.target.value)
                }
                className={inputClass}
              />
            </Field>

            <Field label="Reserve fund balance" prefix="$">
              <input
                type="number"
                min={0}
                value={form.reserveFundBalance || ""}
                onChange={(e) =>
                  updateNumber("reserveFundBalance", e.target.value)
                }
                className={inputClass}
              />
            </Field>

            <Field label="Pending special assessments" prefix="$" className="sm:col-span-2">
              <input
                type="number"
                min={0}
                value={form.pendingSpecialAssessments || ""}
                onChange={(e) =>
                  updateNumber("pendingSpecialAssessments", e.target.value)
                }
                className={inputClass}
              />
            </Field>
          </div>

          <button
            type="submit"
            className="mt-8 w-full rounded-xl bg-[#1B4332] px-6 py-3.5 text-sm font-semibold text-[#E8D5B7] transition hover:bg-[#163828] sm:w-auto"
          >
            Calculate HOA Danger Score
          </button>
        </form>

        {result && styles && (
          <div className="mt-8 space-y-6">
            <div
              className={`rounded-2xl border px-6 py-8 text-center sm:px-8 ${styles.card} bg-[#1B4332]`}
            >
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${styles.badge}`}
              >
                {result.bandLabel}
              </span>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#E8D5B7]/70">
                HOA Danger Score
              </p>
              <p className={`mt-2 text-5xl font-black tracking-tight ${styles.score}`}>
                {result.score}
                <span className="text-2xl font-semibold text-white/50">/100</span>
              </p>
              {form.buildingName && (
                <p className="mt-3 text-lg font-semibold text-white">
                  {form.buildingName}
                </p>
              )}
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/80">
                {result.summary}
              </p>
            </div>

            <div className="rounded-2xl border border-[#1B4332]/10 bg-white p-5 shadow-sm sm:p-8">
              <h2 className="text-lg font-semibold text-[#1B4332]">
                Risk factor breakdown
              </h2>
              <p className="mt-1 text-sm text-[#1B4332]/70">
                How each factor contributed to your score.
              </p>

              <ul className="mt-5 space-y-4">
                {result.factors.map((factor) => (
                  <li
                    key={factor.id}
                    className="rounded-xl border border-[#1B4332]/10 bg-[#F7F1E8] p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-[#1B4332]">
                          {factor.label}
                        </p>
                        <p className="mt-1 text-sm text-[#1B4332]/70">
                          {factor.detail}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-[#1B4332]">
                          {factor.score}/{factor.maxScore}
                        </p>
                        <FactorBadge status={factor.status} />
                      </div>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E8D5B7]/40">
                      <div
                        className={`h-full rounded-full ${
                          factor.status === "good"
                            ? "bg-emerald-600"
                            : factor.status === "moderate"
                              ? "bg-amber-500"
                              : "bg-red-500"
                        }`}
                        style={{
                          width: `${(factor.score / factor.maxScore) * 100}%`,
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-[#1B4332]/10 bg-[#1B4332] px-6 py-8 text-center sm:px-8">
              <h2 className="text-lg font-semibold text-[#E8D5B7]">
                Run the full deal analysis on Venura
              </h2>
              <p className="mx-auto mt-2 max-w-lg text-sm text-white/75">
                Combine HOA risk with cash flow, cap rate, and a Go / No-Go
                verdict on any DC metro rental property.
              </p>
              <Link
                href="/analyzer"
                className="mt-6 inline-flex rounded-xl bg-[#E8D5B7] px-6 py-3.5 text-sm font-semibold text-[#1B4332] transition hover:bg-[#F0E4CE]"
              >
                Analyze this property on Venura →
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
  prefix,
  suffix,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#1B4332]/70">
        {label}
      </span>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#1B4332]/50">
            {prefix}
          </span>
        )}
        <div className={prefix ? "[&_input]:pl-7 [&_select]:pl-7" : ""}>
          {children}
        </div>
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#1B4332]/50">
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
}

function FactorBadge({ status }: { status: "good" | "moderate" | "poor" }) {
  const styles = {
    good: "text-emerald-700",
    moderate: "text-amber-700",
    poor: "text-red-700",
  };
  const labels = {
    good: "Strong",
    moderate: "Moderate",
    poor: "Weak",
  };

  return (
    <p className={`text-xs font-semibold uppercase tracking-wide ${styles[status]}`}>
      {labels[status]}
    </p>
  );
}
