"use client";

import type { SchoolDistrictData } from "@/lib/location-intelligence";
import { getSchoolScoreBadgeClass } from "@/lib/location-intelligence";

type SchoolDistrictProps = {
  data: SchoolDistrictData | null;
  loading: boolean;
};

function SchoolLevelBadge({ label, score }: { label: string; score: number }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
      <span className="text-sm text-white/80">{label}</span>
      <span
        className={`rounded-full border px-3 py-1 text-sm font-bold tabular-nums ${getSchoolScoreBadgeClass(score)}`}
      >
        {score}/10
      </span>
    </div>
  );
}

function SchoolDistrictSkeleton() {
  return (
    <section className="animate-pulse rounded-2xl border border-white/10 bg-[#1B4332] p-6 shadow-xl">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="h-5 w-40 rounded bg-white/10" />
          <div className="h-8 w-24 rounded bg-white/10" />
        </div>
        <div className="h-5 w-24 rounded-full bg-white/10" />
      </div>
      <div className="space-y-2">
        <div className="h-12 rounded-xl bg-white/10" />
        <div className="h-12 rounded-xl bg-white/10" />
        <div className="h-12 rounded-xl bg-white/10" />
      </div>
      <div className="mt-4 h-4 w-full rounded bg-white/10" />
    </section>
  );
}

export function SchoolDistrict({ data, loading }: SchoolDistrictProps) {
  if (loading) return <SchoolDistrictSkeleton />;

  if (!data) {
    return (
      <section className="rounded-2xl border border-white/10 bg-[#1B4332] p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-[#E8D5B7]">
          School District Intelligence
        </h2>
        <p className="mt-3 text-sm text-white/60">
          Add a zip code to your address to see school district ratings.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-[#E8D5B7]/20 bg-[#1B4332] p-6 shadow-xl">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[#E8D5B7]">
            School District Intelligence
          </h2>
          <p className="mt-1 text-sm font-medium text-white/90">
            {data.districtName}
          </p>
        </div>
        <span className="rounded-full border border-[#E8D5B7]/30 bg-[#E8D5B7]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#E8D5B7]">
          Updated weekly
        </span>
      </div>

      <div className="mb-5 flex items-baseline gap-2">
        <span className="text-4xl font-black tabular-nums text-[#E8D5B7]">
          {data.overallScore.toFixed(1)}
        </span>
        <span className="text-sm text-white/60">/ 10 overall</span>
      </div>

      <div className="space-y-2">
        <SchoolLevelBadge label="Elementary" score={data.elementary} />
        <SchoolLevelBadge label="Middle school" score={data.middle} />
        <SchoolLevelBadge label="High school" score={data.high} />
      </div>

      <p className="mt-4 text-sm leading-relaxed text-[#E8D5B7]/90">
        {data.summary}
      </p>
    </section>
  );
}
