import Link from "next/link";
import { PageHeader } from "@/components/dashboard/page-header";
import { SAMPLE_SAVED_DEALS } from "@/lib/sample-deals";
import { formatCashFlow, formatCurrency } from "@/lib/format";

export default function SavedDealsPage() {
  const deals = SAMPLE_SAVED_DEALS;

  return (
    <>
      <PageHeader
        eyebrow="Deal Library"
        title="Saved Deals"
        description="Your saved property analyses with cash flow indicators at a glance."
      />

      {deals.length === 0 ? (
        <EmptyState message="No saved deals yet. Analyze a property and save it here." />
      ) : (
        <div className="space-y-4">
          {deals.map((deal) => {
            const isPositive = deal.monthlyCashFlow >= 0;

            return (
              <article
                key={deal.id}
                className="group rounded-2xl border border-white/10 bg-[#1B4332] p-6 shadow-xl transition hover:border-[#74C69D]/30"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      {deal.address}
                    </h2>
                    <p className="mt-1 text-sm text-white/60">
                      {deal.city}, {deal.state} {deal.zip}
                    </p>
                  </div>

                  <div
                    className={`rounded-xl px-4 py-2 text-right ${
                      isPositive
                        ? "bg-emerald-500/15 border border-emerald-400/40"
                        : "bg-red-500/15 border border-red-400/40"
                    }`}
                  >
                    <p className="text-xs font-medium uppercase tracking-wider text-white/60">
                      Cash Flow
                    </p>
                    <p
                      className={`text-xl font-bold tabular-nums ${
                        isPositive ? "text-[#74C69D]" : "text-red-400"
                      }`}
                    >
                      {formatCashFlow(deal.monthlyCashFlow)}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 border-t border-white/10 pt-5 sm:grid-cols-4">
                  <Stat label="Purchase Price" value={formatCurrency(deal.purchasePrice)} />
                  <Stat label="Monthly Rent" value={formatCurrency(deal.monthlyRent)} />
                  <Stat label="HOA" value={formatCurrency(deal.hoaFee)} />
                  <Stat label="Down Payment" value={`${deal.downPaymentPercent}%`} />
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <Link
                    href="/analyzer"
                    className="rounded-lg bg-[#74C69D]/20 px-4 py-2 text-sm font-medium text-[#74C69D] transition hover:bg-[#74C69D]/30"
                  >
                    Open in Analyzer
                  </Link>
                  <Link
                    href="/compare"
                    className="rounded-lg px-4 py-2 text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
                  >
                    Compare
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-[#1B4332]/50 p-8 text-center">
      <p className="max-w-md text-base text-white/70">{message}</p>
      <Link
        href="/analyzer"
        className="mt-6 rounded-xl bg-[#74C69D] px-5 py-2.5 text-sm font-semibold text-[#1B4332] transition hover:bg-[#95D5B2]"
      >
        Go to Analyzer
      </Link>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-white/50">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold tabular-nums text-white">
        {value}
      </p>
    </div>
  );
}
