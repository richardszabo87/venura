"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getAnalyzerDefaultsFromProfile,
  getInvestorProfile,
  getInvestorProfileSummary,
  type InvestorProfile,
} from "@/lib/investor-profile";
import { formatCurrency } from "@/lib/format";

export function InvestorProfileWelcome() {
  const [profile, setProfile] = useState<InvestorProfile | null>(null);

  useEffect(() => {
    setProfile(getInvestorProfile());
  }, []);

  if (!profile) return null;

  const summary = getInvestorProfileSummary(profile);
  const defaults = getAnalyzerDefaultsFromProfile(profile);

  return (
    <div className="mb-8 rounded-2xl border border-[#E8D5B7]/30 bg-[#E8D5B7]/10 px-6 py-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-[#E8D5B7]">
        Your investor profile
      </p>
      <p className="mt-2 font-semibold text-white">{summary.headline}</p>
      <p className="mt-1 text-sm text-white/80">{summary.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {defaults.purchasePrice != null && (
          <ProfileChip label={`Budget ~${formatCurrency(defaults.purchasePrice)}`} />
        )}
        {defaults.downPaymentPercent != null && (
          <ProfileChip label={`${defaults.downPaymentPercent}% down`} />
        )}
        <ProfileChip label={`Target: ${summary.targetCashFlow}`} />
      </div>

      <Link
        href="/analyzer"
        className="mt-5 inline-flex rounded-lg bg-[#E8D5B7] px-4 py-2 text-sm font-semibold text-[#1B4332] transition hover:bg-[#F0E4CE]"
      >
        Analyze a property with your defaults
      </Link>
    </div>
  );
}

function ProfileChip({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
      {label}
    </span>
  );
}
