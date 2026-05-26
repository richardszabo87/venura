"use client";

import { useMemo } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { analyzeProperty } from "@/lib/calculator";
import { SAMPLE_SAVED_DEALS } from "@/lib/sample-deals";
import {
  formatCashFlow,
  formatCurrency,
  formatPercent,
} from "@/lib/format";

type CompareMetric = {
  label: string;
  values: (string | number)[];
  bestIndex: number;
  higherIsBetter: boolean;
};

export default function ComparePage() {
  const deals = SAMPLE_SAVED_DEALS;

  const metrics: CompareMetric[] = useMemo(() => {
    const analyses = deals.map((d) =>
      analyzeProperty({
        purchasePrice: d.purchasePrice,
        monthlyRent: d.monthlyRent,
        hoaFee: d.hoaFee,
        propertyTaxes: d.propertyTaxes,
        downPaymentPercent: d.downPaymentPercent,
        interestRate: d.interestRate,
        insurance: d.insurance,
        loanTerm: d.loanTerm,
      }),
    );

    const rawMetrics = [
      {
        label: "Purchase Price",
        values: deals.map((d) => d.purchasePrice),
        higherIsBetter: false,
      },
      {
        label: "Monthly Rent",
        values: deals.map((d) => d.monthlyRent),
        higherIsBetter: true,
      },
      {
        label: "Cash Flow",
        values: deals.map((d) => d.monthlyCashFlow),
        higherIsBetter: true,
      },
      {
        label: "Cap Rate",
        values: analyses.map((a) => a.capRate),
        higherIsBetter: true,
      },
      {
        label: "Cash-on-Cash",
        values: analyses.map((a) => a.cashOnCashReturn),
        higherIsBetter: true,
      },
      {
        label: "HOA Fee",
        values: deals.map((d) => d.hoaFee),
        higherIsBetter: false,
      },
    ];

    return rawMetrics.map((m) => {
      const numericValues = m.values as number[];
      const bestValue = m.higherIsBetter
        ? Math.max(...numericValues)
        : Math.min(...numericValues);
      const bestIndex = numericValues.indexOf(bestValue);

      return { ...m, bestIndex };
    });
  }, [deals]);

  function formatValue(label: string, value: string | number): string {
    if (label === "Cash Flow") return formatCashFlow(value as number);
    if (label === "Cap Rate" || label === "Cash-on-Cash")
      return formatPercent(value as number);
    if (typeof value === "number") return formatCurrency(value);
    return String(value);
  }

  return (
    <>
      <PageHeader
        eyebrow="Side by Side"
        title="Compare Deals"
        description="Compare saved properties and see which metrics lead the pack."
      />

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#1B4332] shadow-xl">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-6 py-4 font-semibold text-[#74C69D]">Metric</th>
              {deals.map((deal) => (
                <th
                  key={deal.id}
                  className="px-6 py-4 font-semibold text-white"
                >
                  <span className="block">{deal.address}</span>
                  <span className="mt-0.5 block text-xs font-normal text-white/50">
                    {deal.city}, {deal.state}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric) => (
              <tr
                key={metric.label}
                className="border-b border-white/5 last:border-0"
              >
                <td className="px-6 py-4 font-medium text-white/70">
                  {metric.label}
                </td>
                {metric.values.map((value, i) => {
                  const isBest = i === metric.bestIndex;

                  return (
                    <td
                      key={i}
                      className={`px-6 py-4 tabular-nums ${
                        isBest
                          ? "bg-emerald-500/10 font-bold text-[#74C69D]"
                          : "text-white/90"
                      }`}
                    >
                      {formatValue(metric.label, value)}
                      {isBest && (
                        <span className="ml-2 text-xs font-normal text-emerald-400/80">
                          Best
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
