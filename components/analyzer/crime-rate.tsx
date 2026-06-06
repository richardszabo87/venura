"use client";

import type { CrimeRateData } from "@/lib/location-intelligence";
import { getTrendStyle } from "@/lib/location-intelligence";

type CrimeRateProps = {
  data: CrimeRateData | null;
  loading: boolean;
};

function getCrimeLevelStyle(level: CrimeRateData["level"]): string {
  switch (level) {
    case "Very Safe":
    case "Safe":
      return "bg-emerald-500/20 text-emerald-200 border-emerald-400/40";
    case "Moderate":
      return "bg-amber-500/20 text-amber-200 border-amber-400/40";
    case "Elevated":
    case "High":
      return "bg-red-500/20 text-red-200 border-red-400/40";
    default:
      return "bg-white/10 text-white/80 border-white/20";
  }
}

function CrimeRateSkeleton() {
  return (
    <section className="animate-pulse rounded-2xl border border-white/10 bg-[#1B4332] p-6 shadow-xl">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="h-5 w-36 rounded bg-white/10" />
        <div className="h-5 w-24 rounded-full bg-white/10" />
      </div>
      <div className="mb-4 flex items-baseline gap-3">
        <div className="h-10 w-16 rounded bg-white/10" />
        <div className="h-6 w-20 rounded-full bg-white/10" />
      </div>
      <div className="h-5 w-28 rounded bg-white/10" />
      <div className="mt-4 space-y-2">
        <div className="h-4 w-full rounded bg-white/10" />
        <div className="h-4 w-3/4 rounded bg-white/10" />
      </div>
      <div className="mt-4 h-4 w-full rounded bg-white/10" />
    </section>
  );
}

export function CrimeRate({ data, loading }: CrimeRateProps) {
  if (loading) return <CrimeRateSkeleton />;

  if (!data) {
    return (
      <section className="rounded-2xl border border-white/10 bg-[#1B4332] p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-[#E8D5B7]">
          Crime Rate Indicator
        </h2>
        <p className="mt-3 text-sm text-white/60">
          Add a zip code to your address to see neighborhood crime data.
        </p>
      </section>
    );
  }

  const trend = getTrendStyle(data.trend);

  return (
    <section className="rounded-2xl border border-[#E8D5B7]/20 bg-[#1B4332] p-6 shadow-xl">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <h2 className="text-lg font-semibold text-[#E8D5B7]">
          Crime Rate Indicator
        </h2>
        <span className="rounded-full border border-[#E8D5B7]/30 bg-[#E8D5B7]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#E8D5B7]">
          Updated weekly
        </span>
      </div>

      <div className="mb-3 flex flex-wrap items-baseline gap-3">
        <span className="text-4xl font-black tabular-nums text-[#E8D5B7]">
          {data.score}
        </span>
        <span className="text-sm text-white/60">/ 100 safety index</span>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${getCrimeLevelStyle(data.level)}`}
        >
          {data.level}
        </span>
      </div>

      <p className={`text-sm font-semibold ${trend.className}`}>{trend.label}</p>

      <div className="mt-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-white/60">
          Top crime types
        </p>
        <ul className="space-y-1.5">
          {data.topCrimes.map((crime) => (
            <li
              key={crime}
              className="flex items-center gap-2 text-sm text-white/85"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#E8D5B7]/60" />
              {crime}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-[#E8D5B7]/90">
        {data.insight}
      </p>
    </section>
  );
}
