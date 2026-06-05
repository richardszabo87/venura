"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/dashboard/page-header";
import { useSubscription } from "@/components/subscription/subscription-provider";
import { getLastAnalysis } from "@/lib/analyzer-session";
import { canExportProjections } from "@/lib/subscription";
import {
  calculateMortgagePayment,
  type PropertyInputs,
} from "@/lib/calculator";
import { formatCurrency } from "@/lib/format";

type ProjectionTab = "equity" | "cashflow" | "value";

const TABS: { id: ProjectionTab; label: string }[] = [
  { id: "equity", label: "Equity Growth" },
  { id: "cashflow", label: "Cash Flow Growth" },
  { id: "value", label: "Property Value" },
];

const APPRECIATION_RATE = 0.03;
const RENT_GROWTH_RATE = 0.025;
const EXPENSE_GROWTH_RATE = 0.02;

function buildProjectionData(inputs: PropertyInputs) {
  const {
    purchasePrice,
    monthlyRent,
    hoaFee,
    propertyTaxes,
    downPaymentPercent,
    interestRate,
    insurance,
    loanTerm,
  } = inputs;

  const downPayment = purchasePrice * (downPaymentPercent / 100);
  const loanAmount = purchasePrice - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const monthlyMortgage = calculateMortgagePayment(
    loanAmount,
    interestRate,
    loanTerm,
  );
  const operatingExpenses = hoaFee + propertyTaxes + insurance;

  let balance = loanAmount;
  const data = [];

  for (let year = 0; year <= 10; year++) {
    const propertyValue = purchasePrice * Math.pow(1 + APPRECIATION_RATE, year);
    const rent = monthlyRent * Math.pow(1 + RENT_GROWTH_RATE, year);
    const expenses =
      operatingExpenses * Math.pow(1 + EXPENSE_GROWTH_RATE, year);
    const cashFlow = (rent - expenses - monthlyMortgage) * 12;

    if (year > 0) {
      for (let m = 0; m < 12; m++) {
        const interestPayment = balance * monthlyRate;
        const principalPayment = monthlyMortgage - interestPayment;
        balance = Math.max(0, balance - principalPayment);
      }
    }

    const equity = propertyValue - balance;

    data.push({
      year: `Year ${year}`,
      yearNum: year,
      equity: Math.round(equity),
      cashFlow: Math.round(cashFlow),
      propertyValue: Math.round(propertyValue),
    });
  }

  return data;
}

function exportProjectionCsv(
  data: ReturnType<typeof buildProjectionData>,
) {
  const header = "Year,Equity,Annual Cash Flow,Property Value";
  const rows = data.map(
    (row) =>
      `${row.yearNum},${row.equity},${row.cashFlow},${row.propertyValue}`,
  );
  const blob = new Blob([[header, ...rows].join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "venura-projections.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export default function ProjectionsPage() {
  const { tier, showUpgrade } = useSubscription();
  const [activeTab, setActiveTab] = useState<ProjectionTab>("equity");
  const [inputs, setInputs] = useState<PropertyInputs | null>(null);

  useEffect(() => {
    setInputs(getLastAnalysis());
  }, []);

  const data = useMemo(
    () => (inputs ? buildProjectionData(inputs) : []),
    [inputs],
  );

  const chartConfig = {
    equity: {
      dataKey: "equity" as const,
      label: "Equity",
      color: "#E8D5B7",
    },
    cashflow: {
      dataKey: "cashFlow" as const,
      label: "Annual Cash Flow",
      color: "#52B788",
    },
    value: {
      dataKey: "propertyValue" as const,
      label: "Property Value",
      color: "#40916C",
    },
  };

  const config = chartConfig[activeTab];

  return (
    <>
      <PageHeader
        eyebrow="10-Year Outlook"
        title="Projections"
        description="Model equity growth, cash flow trends, and property appreciation over 10 years."
      />

      {!inputs ? (
        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-[#1B4332]/50 p-8 text-center">
          <p className="max-w-md text-base text-white/70">
            Analyze a property first to see projections.
          </p>
          <Link
            href="/analyzer"
            className="mt-6 rounded-xl bg-[#E8D5B7] px-5 py-2.5 text-sm font-semibold text-[#1B4332] transition hover:bg-[#F0E4CE]"
          >
            Go to Analyzer
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "bg-[#E8D5B7] text-[#1B4332]"
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#1B4332] p-6 shadow-xl">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-[#E8D5B7]">
                  {config.label}
                </h2>
                <p className="mt-1 text-sm text-white/60">
                  Based on your last analysis · 3% appreciation · 2.5% rent
                  growth
                </p>
              </div>
              <div className="flex items-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    if (!canExportProjections(tier)) {
                      showUpgrade("projection_export");
                      return;
                    }
                    exportProjectionCsv(data);
                  }}
                  className="rounded-lg border border-[#E8D5B7]/40 bg-[#E8D5B7]/10 px-4 py-2 text-sm font-medium text-[#E8D5B7] transition hover:bg-[#E8D5B7]/20"
                >
                  Export CSV
                </button>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-wider text-white/50">
                    Year 10
                  </p>
                  <p className="text-2xl font-bold tabular-nums text-white">
                    {formatCurrency(data[10][config.dataKey])}
                  </p>
                </div>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={config.color} stopOpacity={0.4} />
                      <stop offset="100%" stopColor={config.color} stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis
                    dataKey="year"
                    tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
                    axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
                    axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                    tickLine={false}
                    tickFormatter={(v) =>
                      `$${(v / 1000).toFixed(0)}k`
                    }
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1B4332",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                    formatter={(value: number) => [formatCurrency(value), config.label]}
                  />
                  <Area
                    type="monotone"
                    dataKey={config.dataKey}
                    stroke={config.color}
                    strokeWidth={2}
                    fill="url(#chartGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </>
  );
}
