"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ALL_GUIDE_ITEM_IDS,
  BUYER_GUIDE_STAGES,
  GUIDE_STORAGE_KEY,
} from "@/lib/buyer-guide";

export function BuyerGuide() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(GUIDE_STORAGE_KEY);
      if (stored) {
        setChecked(JSON.parse(stored) as Record<string, boolean>);
      }
    } catch {
      setChecked({});
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(GUIDE_STORAGE_KEY, JSON.stringify(checked));
  }, [checked, hydrated]);

  const totalItems = ALL_GUIDE_ITEM_IDS.length;
  const completedCount = useMemo(
    () => ALL_GUIDE_ITEM_IDS.filter((id) => checked[id]).length,
    [checked],
  );
  const progressPercent =
    totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  function toggleItem(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function resetProgress() {
    setChecked({});
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
            Free Buyer Roadmap
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#1B4332] sm:text-3xl">
            First-Time Buyer Guide
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-[#1B4332]/70 sm:text-base">
            A 6-stage checklist from getting your finances in order to closing
            day — with Venura tools linked at every step.
          </p>
        </div>

        <div className="rounded-2xl border border-[#1B4332]/10 bg-white p-5 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#1B4332]/60">
                Overall progress
              </p>
              <p className="mt-1 text-lg font-bold text-[#1B4332]">
                {completedCount} of {totalItems} complete
              </p>
            </div>
            <button
              type="button"
              onClick={resetProgress}
              className="text-sm font-medium text-[#1B4332]/60 transition hover:text-[#1B4332]"
            >
              Reset checklist
            </button>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#1B4332]/10">
            <div
              className="h-full rounded-full bg-[#1B4332] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="mt-2 text-right text-xs font-semibold text-[#1B4332]/60">
            {progressPercent}%
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {BUYER_GUIDE_STAGES.map((stage) => {
            const stageCompleted = stage.items.filter(
              (item) => checked[item.id],
            ).length;
            const stageTotal = stage.items.length;
            const stagePercent = Math.round(
              (stageCompleted / stageTotal) * 100,
            );

            return (
              <article
                key={stage.id}
                className="overflow-hidden rounded-2xl border border-[#1B4332]/10 bg-white shadow-sm"
              >
                <div className="border-b border-[#1B4332]/10 bg-[#1B4332] px-5 py-5 sm:px-8">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#E8D5B7]/70">
                        Stage {stage.number}
                      </p>
                      <h2 className="mt-1 text-xl font-bold text-[#E8D5B7] sm:text-2xl">
                        {stage.title}
                      </h2>
                      <p className="mt-1 text-sm text-white/70">
                        {stage.subtitle}
                      </p>
                    </div>
                    <div className="rounded-lg border border-[#E8D5B7]/30 bg-[#E8D5B7]/10 px-3 py-2 text-center">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#E8D5B7]/80">
                        Stage progress
                      </p>
                      <p className="text-sm font-bold text-[#E8D5B7]">
                        {stageCompleted}/{stageTotal}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/15">
                    <div
                      className="h-full rounded-full bg-[#E8D5B7] transition-all duration-300"
                      style={{ width: `${stagePercent}%` }}
                    />
                  </div>
                </div>

                <div className="px-5 py-5 sm:px-8">
                  <ul className="space-y-3">
                    {stage.items.map((item) => {
                      const isChecked = Boolean(checked[item.id]);
                      return (
                        <li key={item.id}>
                          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#1B4332]/10 bg-[#F7F1E8] px-4 py-3 transition hover:border-[#1B4332]/25">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleItem(item.id)}
                              className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#1B4332]/30 text-[#1B4332] focus:ring-[#E8D5B7]"
                            />
                            <span
                              className={`text-sm leading-relaxed ${
                                isChecked
                                  ? "text-[#1B4332]/50 line-through"
                                  : "text-[#1B4332]"
                              }`}
                            >
                              {item.label}
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="mt-6 rounded-xl border border-[#E8D5B7]/50 bg-[#E8D5B7]/20 px-4 py-4">
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#1B4332]/60">
                      Venura tip
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-[#1B4332]/85">
                      {stage.venuraTip}
                    </p>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#1B4332]/60">
                      Relevant tools
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {stage.tools.map((tool) => (
                        <Link
                          key={tool.href + tool.label}
                          href={tool.href}
                          className="rounded-lg border border-[#1B4332]/15 bg-white px-3 py-2 text-sm font-semibold text-[#1B4332] transition hover:border-[#1B4332] hover:bg-[#1B4332] hover:text-[#E8D5B7]"
                        >
                          {tool.label} →
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {progressPercent === 100 && (
          <div className="mt-8 rounded-2xl border border-[#E8D5B7]/40 bg-[#1B4332] px-6 py-8 text-center sm:px-8">
            <h2 className="text-lg font-semibold text-[#E8D5B7]">
              You&apos;ve completed the roadmap!
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-white/75">
              Ready to analyze your first deal like an investor? Run the numbers
              on Venura before you sign at closing.
            </p>
            <Link
              href="/analyzer"
              className="mt-6 inline-flex rounded-xl bg-[#E8D5B7] px-6 py-3.5 text-sm font-semibold text-[#1B4332] transition hover:bg-[#F0E4CE]"
            >
              Analyze on Venura →
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
