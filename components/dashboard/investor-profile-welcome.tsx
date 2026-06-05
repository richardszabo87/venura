"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import {
  getAnalyzerDefaultsFromProfile,
  getInvestorProfile,
  getInvestorProfileSummary,
  type InvestorProfile,
} from "@/lib/investor-profile";
import { fetchUserProfile } from "@/lib/profile-client";
import { formatCurrency } from "@/lib/format";
import type { UserProfileRow } from "@/lib/user-profile";
import { userProfileToAnalyzerDefaults } from "@/lib/user-profile";

export function InvestorProfileWelcome() {
  const { isSignedIn } = useAuth();
  const [localProfile, setLocalProfile] = useState<InvestorProfile | null>(null);
  const [serverProfile, setServerProfile] = useState<UserProfileRow | null>(null);

  useEffect(() => {
    setLocalProfile(getInvestorProfile());
  }, []);

  useEffect(() => {
    if (!isSignedIn) return;

    fetchUserProfile()
      .then(setServerProfile)
      .catch((error) => {
        console.error("Failed to load user profile:", error);
      });
  }, [isSignedIn]);

  const investorProfile = localProfile;
  const headline =
    serverProfile?.investor_profile_name ??
    (investorProfile ? getInvestorProfileSummary(investorProfile).headline : null);
  const description = investorProfile
    ? getInvestorProfileSummary(investorProfile).description
    : serverProfile?.onboarding_completed
      ? "Your saved investor preferences are ready in Venura."
      : null;

  if (!headline) return null;

  const defaults = serverProfile
    ? userProfileToAnalyzerDefaults(serverProfile)
    : investorProfile
      ? getAnalyzerDefaultsFromProfile(investorProfile)
      : {};

  const targetCashFlow =
    serverProfile?.min_cash_flow != null && serverProfile.min_cash_flow > 0
      ? `$${serverProfile.min_cash_flow}+/mo cash flow`
      : investorProfile
        ? getInvestorProfileSummary(investorProfile).targetCashFlow
        : "Break-even cash flow";

  const topMarket = investorProfile?.marketRecommendations[0]?.name;
  const journeyLabel = serverProfile?.journey_stage
    ? serverProfile.journey_stage.replace(/_/g, " ")
    : null;

  return (
    <div className="mb-8 rounded-2xl border border-[#E8D5B7]/30 bg-[#E8D5B7]/10 px-6 py-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-[#E8D5B7]">
        Your investor profile
      </p>
      <p className="mt-2 font-semibold text-white">{headline}</p>
      {description && (
        <p className="mt-1 text-sm text-white/80">{description}</p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {defaults.purchasePrice != null && defaults.purchasePrice > 0 && (
          <ProfileChip label={`Budget ~${formatCurrency(defaults.purchasePrice)}`} />
        )}
        <ProfileChip label={`Target: ${targetCashFlow}`} />
        {topMarket && <ProfileChip label={`Top market: ${topMarket}`} />}
        {journeyLabel && (
          <ProfileChip label={`Stage: ${journeyLabel}`} />
        )}
        {serverProfile && serverProfile.properties_analyzed > 0 && (
          <ProfileChip
            label={`${serverProfile.properties_analyzed} properties analyzed`}
          />
        )}
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
