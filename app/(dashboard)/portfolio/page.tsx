import Link from "next/link";
import { PageHeader } from "@/components/dashboard/page-header";
import { SAMPLE_SAVED_DEALS } from "@/lib/sample-deals";
import { formatCashFlow, formatCurrency } from "@/lib/format";

export default function PortfolioPage() {
  const ownedProperties = SAMPLE_SAVED_DEALS.filter((d) => d.owned);
  const totalPassiveIncome = ownedProperties.reduce(
    (sum, d) => sum + d.monthlyCashFlow,
    0,
  );
  const totalEquity = ownedProperties.reduce(
    (sum, d) => sum + (d.equity ?? 0),
    0,
  );
  const maxEquity = Math.max(
    ...ownedProperties.map((d) => d.equity ?? 0),
    1,
  );

  return (
    <>
      <PageHeader
        eyebrow="Your Holdings"
        title="Portfolio"
        description="Track owned properties, equity positions, and passive income."
      />

      {ownedProperties.length === 0 ? (
        <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-[#1B4332]/50 p-8 text-center">
          <p className="max-w-md text-base text-white/70">
            No properties in your portfolio yet.
          </p>
          <Link
            href="/analyzer"
            className="mt-6 rounded-xl bg-[#74C69D] px-5 py-2.5 text-sm font-semibold text-[#1B4332] transition hover:bg-[#95D5B2]"
          >
            Analyze a Property
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <SummaryCard
              label="Total Passive Income"
              value={formatCashFlow(totalPassiveIncome)}
              sub="Combined monthly cash flow"
              highlight={totalPassiveIncome >= 0 ? "positive" : "negative"}
            />
            <SummaryCard
              label="Total Equity"
              value={formatCurrency(totalEquity)}
              sub="Across owned properties"
            />
            <SummaryCard
              label="Properties Owned"
              value={String(ownedProperties.length)}
              sub="Active investments"
            />
          </div>

          <div className="space-y-6">
            {ownedProperties.map((property) => {
              const equity = property.equity ?? 0;
              const equityPercent = (equity / maxEquity) * 100;

              return (
                <article
                  key={property.id}
                  className="rounded-2xl border border-white/10 bg-[#1B4332] p-6 shadow-xl"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-white">
                        {property.address}
                      </h2>
                      <p className="mt-1 text-sm text-white/60">
                        {property.city}, {property.state} {property.zip}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-wider text-white/50">
                        Monthly Cash Flow
                      </p>
                      <p className="text-xl font-bold tabular-nums text-[#74C69D]">
                        {formatCashFlow(property.monthlyCashFlow)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="mb-2 flex items-end justify-between">
                      <p className="text-xs font-medium uppercase tracking-wider text-white/60">
                        Equity Position
                      </p>
                      <p className="text-sm font-semibold tabular-nums text-white">
                        {formatCurrency(equity)}
                      </p>
                    </div>
                    <div className="h-4 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#1B4332] to-[#74C69D] transition-all"
                        style={{ width: `${equityPercent}%` }}
                      />
                    </div>
                    <div className="mt-2 flex justify-between text-xs text-white/40">
                      <span>Purchase: {formatCurrency(property.purchasePrice)}</span>
                      <span>
                        Current value: {formatCurrency(property.currentValue ?? 0)}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}

function SummaryCard({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub: string;
  highlight?: "positive" | "negative";
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#1B4332] p-5 shadow-xl">
      <p className="text-xs font-medium uppercase tracking-wider text-white/60">
        {label}
      </p>
      <p
        className={`mt-2 text-3xl font-bold tabular-nums tracking-tight ${
          highlight === "positive"
            ? "text-[#74C69D]"
            : highlight === "negative"
              ? "text-red-400"
              : "text-white"
        }`}
      >
        {value}
      </p>
      <p className="mt-1 text-xs text-white/50">{sub}</p>
    </div>
  );
}
