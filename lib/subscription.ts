import type { UserProfileRow } from "./user-profile";

export type SubscriptionTier = "free" | "investor" | "pro";

export type UpgradeReason =
  | "analyses"
  | "saved_deals"
  | "ai_messages"
  | "deal_alerts"
  | "pdf_download"
  | "deal_score"
  | "hoa_health"
  | "projection_export"
  | "portfolio"
  | "city_intelligence"
  | "api_access";

export const TIER_LIMITS = {
  free: {
    analysesPerMonth: 3,
    savedDeals: 5,
    aiMessagesPerMonth: 5,
    dealAlerts: 1,
  },
  investor: {
    analysesPerMonth: Infinity,
    savedDeals: 50,
    aiMessagesPerMonth: Infinity,
    dealAlerts: 10,
  },
  pro: {
    analysesPerMonth: Infinity,
    savedDeals: Infinity,
    aiMessagesPerMonth: Infinity,
    dealAlerts: Infinity,
  },
} as const;

export const INVESTOR_FEATURES = [
  "Unlimited property analyses",
  "Up to 50 saved deals",
  "PDF report downloads",
  "Full Deal Score™ on every analysis",
  "HOA Health Report in dashboard",
  "Unlimited VenuraAI messages",
  "Up to 10 active deal alerts",
  "10-year projections with export",
  "Zip-level market data & neighborhood scores",
] as const;

export const UPGRADE_MESSAGES: Record<UpgradeReason, string> = {
  analyses: "You've used all 3 free analyses this month",
  saved_deals: "You've reached the 5 saved deal limit on the free plan",
  ai_messages: "You've used all 5 free VenuraAI messages this month",
  deal_alerts: "Free accounts are limited to 1 active deal alert",
  pdf_download: "PDF downloads are available on the Investor plan",
  deal_score: "Full Deal Score™ is available on the Investor plan",
  hoa_health: "HOA Health Report is available on the Investor plan",
  projection_export: "Projection export is available on the Investor plan",
  portfolio: "Portfolio tracker is available on the Pro plan",
  city_intelligence: "City Intelligence is available on the Pro plan",
  api_access: "API access is available on the Pro plan",
};

export function getSubscriptionTier(
  profile: UserProfileRow | null | undefined,
): SubscriptionTier {
  const tier = profile?.subscription_tier ?? "free";
  if (tier === "investor" || tier === "pro") return tier;
  return "free";
}

export function getTierLimits(tier: SubscriptionTier) {
  return TIER_LIMITS[tier];
}

export function canDownloadPdf(tier: SubscriptionTier): boolean {
  return tier === "investor" || tier === "pro";
}

export function canViewDealScore(tier: SubscriptionTier): boolean {
  return tier === "investor" || tier === "pro";
}

export function canViewHoaHealth(tier: SubscriptionTier): boolean {
  return tier === "investor" || tier === "pro";
}

export function canExportProjections(tier: SubscriptionTier): boolean {
  return tier === "investor" || tier === "pro";
}

export function canAccessPortfolio(tier: SubscriptionTier): boolean {
  return tier === "pro";
}

export function canAccessCityIntelligence(tier: SubscriptionTier): boolean {
  return tier === "pro";
}

export function canAccessApi(tier: SubscriptionTier): boolean {
  return tier === "pro";
}

export function getUsageSnapshot(profile: UserProfileRow) {
  const tier = getSubscriptionTier(profile);
  const limits = getTierLimits(tier);

  return {
    tier,
    analyses: {
      used: profile.analyses_this_month ?? 0,
      limit: limits.analysesPerMonth,
    },
    aiMessages: {
      used: profile.ai_messages_this_month ?? 0,
      limit: limits.aiMessagesPerMonth,
    },
    savedDeals: {
      used: profile.properties_saved ?? 0,
      limit: limits.savedDeals,
    },
  };
}

export function formatUsageLabel(
  used: number,
  limit: number,
  noun: string,
): string {
  if (!Number.isFinite(limit)) {
    return `${noun}: unlimited`;
  }
  return `${noun}: ${used}/${limit} used`;
}

export function usagePercent(used: number, limit: number): number {
  if (!Number.isFinite(limit) || limit <= 0) return 0;
  return Math.min(100, Math.round((used / limit) * 100));
}
