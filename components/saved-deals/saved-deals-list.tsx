"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { dealRowToPayload } from "@/lib/saved-deals";
import type { SavedDealRow } from "@/lib/saved-deals";
import { VERDICT_STYLES } from "@/lib/calculator";
import { formatCashFlow, formatCurrency, formatPercent } from "@/lib/format";

export function SavedDealsList() {
  const [deals, setDeals] = useState<SavedDealRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchDeals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/deals");
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to load saved deals");
      }
      const data = await res.json();
      setDeals(data.deals ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load saved deals");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/deals/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to delete deal");
      }
      setDeals((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete deal");
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-white/10 bg-[#1B4332]/50 p-8">
        <p className="text-white/60">Loading saved deals…</p>
      </div>
    );
  }

  if (error && deals.length === 0) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-red-400/30 bg-red-500/10 p-8 text-center">
        <p className="text-red-300">{error}</p>
        <button
          type="button"
          onClick={fetchDeals}
          className="mt-4 rounded-xl bg-[#E8D5B7] px-5 py-2.5 text-sm font-semibold text-[#1B4332]"
        >
          Retry
        </button>
      </div>
    );
  }

  if (deals.length === 0) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-[#1B4332]/50 p-8 text-center">
        <p className="max-w-md text-base text-white/70">
          No saved deals yet. Analyze a property and save it here.
        </p>
        <Link
          href="/analyzer"
          className="mt-6 rounded-xl bg-[#E8D5B7] px-5 py-2.5 text-sm font-semibold text-[#1B4332] transition hover:bg-[#F0E4CE]"
        >
          Go to Analyzer
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
          {error}
        </p>
      )}
      {deals.map((row) => {
        const deal = dealRowToPayload(row);
        const isPositive = deal.monthlyCashFlow >= 0;
        const verdictStyle = VERDICT_STYLES[deal.verdict];

        return (
          <article
            key={deal.id}
            className="group rounded-2xl border border-white/10 bg-[#1B4332] p-6 shadow-xl transition hover:border-[#E8D5B7]/30"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">{deal.name}</h2>
                <p className="mt-1 text-sm text-white/60">{deal.address}</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${verdictStyle.bg} ${verdictStyle.border}`}
                >
                  {verdictStyle.label}
                </span>
                <div
                  className={`rounded-xl px-4 py-2 text-right ${
                    isPositive
                      ? "border border-emerald-400/40 bg-emerald-500/15"
                      : "border border-red-400/40 bg-red-500/15"
                  }`}
                >
                  <p className="text-xs font-medium uppercase tracking-wider text-white/60">
                    Cash Flow
                  </p>
                  <p
                    className={`text-xl font-bold tabular-nums ${
                      isPositive ? "text-[#E8D5B7]" : "text-red-400"
                    }`}
                  >
                    {formatCashFlow(deal.monthlyCashFlow)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-4 border-t border-white/10 pt-5 sm:grid-cols-4 lg:grid-cols-6">
              <Stat label="Purchase Price" value={formatCurrency(deal.purchasePrice)} />
              <Stat label="Monthly Rent" value={formatCurrency(deal.monthlyRent)} />
              <Stat label="HOA" value={formatCurrency(deal.hoaFee)} />
              <Stat label="Down Payment" value={`${deal.downPaymentPercent}%`} />
              <Stat label="Cap Rate" value={formatPercent(deal.capRate)} />
              <Stat label="Cash-on-Cash" value={formatPercent(deal.cashOnCash)} />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link
                href="/analyzer"
                className="rounded-lg bg-[#E8D5B7]/20 px-4 py-2 text-sm font-medium text-[#E8D5B7] transition hover:bg-[#E8D5B7]/30"
              >
                Open in Analyzer
              </Link>
              <Link
                href="/compare"
                className="rounded-lg px-4 py-2 text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
              >
                Compare
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(deal.id)}
                disabled={deletingId === deal.id}
                className="ml-auto rounded-lg border border-red-400/40 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"
              >
                {deletingId === deal.id ? "Deleting…" : "Delete"}
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-white/50">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold tabular-nums text-white">{value}</p>
    </div>
  );
}
