"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { AnalysisHistoryRow } from "@/lib/analysis-history-server";
import { formatCashFlow } from "@/lib/format";
import { VERDICT_STYLES } from "@/lib/calculator";

const VERDICT_ROW_STYLES = {
  go: "border-emerald-400/40 bg-emerald-500/10",
  "no-go": "border-red-400/40 bg-red-500/10",
  caution: "border-amber-400/40 bg-amber-500/10",
} as const;

function formatAnalyzedDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function RecentlyAnalyzed() {
  const [history, setHistory] = useState<AnalysisHistoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analysis-history")
      .then((res) => res.json())
      .then((data: { history?: AnalysisHistoryRow[] }) => {
        setHistory(data.history ?? []);
      })
      .catch((err) => {
        console.error("Failed to load analysis history:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="mb-8">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#E8D5B7]">
          Recently analyzed
        </h2>
        <p className="text-sm text-white/50">Loading…</p>
      </section>
    );
  }

  if (history.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#E8D5B7]">
        Recently analyzed
      </h2>
      <div className="space-y-2">
        {history.map((item) => {
          const verdictStyle = VERDICT_STYLES[item.verdict];
          const rowStyle = VERDICT_ROW_STYLES[item.verdict];

          return (
            <Link
              key={item.id}
              href={`/analyzer?historyId=${item.id}`}
              className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 transition hover:brightness-110 ${rowStyle}`}
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-white">
                  {item.property_name || item.address || "Untitled property"}
                </p>
                <p className="text-xs text-white/50">
                  {formatAnalyzedDate(item.analyzed_at)}
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${verdictStyle.bg} ${verdictStyle.border} border`}
                >
                  {verdictStyle.label}
                </span>
                <span className="tabular-nums text-white/80">
                  {formatCashFlow(item.monthly_cash_flow ?? 0)}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
