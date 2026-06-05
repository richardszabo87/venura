import type { InvestorProfile } from "./investor-profile";

export type BuyerType =
  | "first_time_buyer"
  | "move_up_buyer"
  | "investor"
  | "all";

export type FinancingType =
  | "home_equity"
  | "conventional"
  | "cash"
  | "undecided";

export type ManagementStyle = "self" | "semi" | "managed";

export type ProfileGoal =
  | "cash_flow"
  | "appreciation"
  | "both"
  | "learning"
  | "primary_home";

export type ProfileTimeline =
  | "asap"
  | "3months"
  | "6months"
  | "1year"
  | "exploring";

export type JourneyStage =
  | "exploring"
  | "educating"
  | "searching"
  | "ready"
  | "under_contract"
  | "owner";

export type SubscriptionTier = "free" | "investor" | "pro";

export type UserProfileRow = {
  id: string;
  clerk_user_id: string;
  buyer_type: BuyerType | null;
  budget_min: number | null;
  budget_max: number | null;
  target_markets: string[];
  min_cash_flow: number | null;
  max_hoa: number | null;
  financing_type: FinancingType | null;
  management_style: ManagementStyle | null;
  goal: ProfileGoal | null;
  timeline: ProfileTimeline | null;
  investor_profile_name: string | null;
  properties_analyzed: number;
  properties_saved: number;
  journey_stage: JourneyStage;
  onboarding_completed: boolean;
  analyses_this_month: number;
  analyses_month_reset: string;
  ai_messages_this_month: number;
  ai_month_reset: string;
  subscription_tier: SubscriptionTier;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
  updated_at: string;
};

const BUYER_TYPES = new Set<BuyerType>([
  "first_time_buyer",
  "move_up_buyer",
  "investor",
  "all",
]);

const FINANCING_TYPES = new Set<FinancingType>([
  "home_equity",
  "conventional",
  "cash",
  "undecided",
]);

const MANAGEMENT_STYLES = new Set<ManagementStyle>(["self", "semi", "managed"]);

const PROFILE_GOALS = new Set<ProfileGoal>([
  "cash_flow",
  "appreciation",
  "both",
  "learning",
  "primary_home",
]);

const TIMELINES = new Set<ProfileTimeline>([
  "asap",
  "3months",
  "6months",
  "1year",
  "exploring",
]);

const JOURNEY_STAGES = new Set<JourneyStage>([
  "exploring",
  "educating",
  "searching",
  "ready",
  "under_contract",
  "owner",
]);

export type UserProfileUpsert = {
  buyer_type?: BuyerType | null;
  budget_min?: number | null;
  budget_max?: number | null;
  target_markets?: string[];
  min_cash_flow?: number | null;
  max_hoa?: number | null;
  financing_type?: FinancingType | null;
  management_style?: ManagementStyle | null;
  goal?: ProfileGoal | null;
  timeline?: ProfileTimeline | null;
  investor_profile_name?: string | null;
  journey_stage?: JourneyStage;
  onboarding_completed?: boolean;
};

export type ProfileIncrement = {
  properties_analyzed?: number;
  properties_saved?: number;
};

export type SyncFromQuizPayload = {
  syncFromQuiz: true;
  investorProfile: InvestorProfile;
};

function mapFinancing(
  financing: InvestorProfile["answers"]["financing"],
): FinancingType {
  const map = {
    "home-equity": "home_equity",
    conventional: "conventional",
    "all-cash": "cash",
    "still-deciding": "undecided",
  } as const;
  return map[financing];
}

function mapManagement(
  management: InvestorProfile["answers"]["management"],
): ManagementStyle {
  const map = {
    "hire-manager": "managed",
    "semi-involved": "semi",
    "self-manage": "self",
  } as const;
  return map[management];
}

function mapGoal(goal: InvestorProfile["answers"]["goal"]): ProfileGoal {
  const map = {
    "monthly-income": "cash_flow",
    "long-term-wealth": "appreciation",
    both: "both",
    learning: "learning",
  } as const;
  return map[goal];
}

export function investorProfileToUpsert(
  investor: InvestorProfile,
): UserProfileUpsert {
  const budgetMax = investor.maxPurchasePrice;
  const budgetMin =
    budgetMax != null ? Math.round(budgetMax * 0.7) : null;

  return {
    buyer_type: "investor",
    budget_min: budgetMin,
    budget_max: budgetMax,
    target_markets: investor.targetZipCodes,
    min_cash_flow: investor.minMonthlyCashFlow,
    max_hoa: investor.maxHoa,
    financing_type: mapFinancing(investor.answers.financing),
    management_style: mapManagement(investor.answers.management),
    goal: mapGoal(investor.answers.goal),
    timeline: "exploring",
    investor_profile_name: investor.investorTypeLabel,
    journey_stage: "educating",
    onboarding_completed: true,
  };
}

function parseOptionalNumber(value: unknown): number | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  return undefined;
}

function parseStringArray(value: unknown): string[] | undefined {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) return undefined;
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseProfileUpsert(body: Record<string, unknown>): {
  upsert?: UserProfileUpsert;
  increment?: ProfileIncrement;
  error?: string;
} {
  if (body.syncFromQuiz === true) {
    const investor = body.investorProfile;
    if (!investor || typeof investor !== "object") {
      return { error: "Missing investorProfile for syncFromQuiz" };
    }
    return {
      upsert: investorProfileToUpsert(investor as InvestorProfile),
    };
  }

  const upsert: UserProfileUpsert = {};
  let hasField = false;

  if ("buyer_type" in body) {
    const value = body.buyer_type;
    if (value !== null && (typeof value !== "string" || !BUYER_TYPES.has(value as BuyerType))) {
      return { error: "Invalid buyer_type" };
    }
    upsert.buyer_type = value as BuyerType | null;
    hasField = true;
  }

  if ("financing_type" in body) {
    const value = body.financing_type;
    if (
      value !== null &&
      (typeof value !== "string" || !FINANCING_TYPES.has(value as FinancingType))
    ) {
      return { error: "Invalid financing_type" };
    }
    upsert.financing_type = value as FinancingType | null;
    hasField = true;
  }

  if ("management_style" in body) {
    const value = body.management_style;
    if (
      value !== null &&
      (typeof value !== "string" ||
        !MANAGEMENT_STYLES.has(value as ManagementStyle))
    ) {
      return { error: "Invalid management_style" };
    }
    upsert.management_style = value as ManagementStyle | null;
    hasField = true;
  }

  if ("goal" in body) {
    const value = body.goal;
    if (
      value !== null &&
      (typeof value !== "string" || !PROFILE_GOALS.has(value as ProfileGoal))
    ) {
      return { error: "Invalid goal" };
    }
    upsert.goal = value as ProfileGoal | null;
    hasField = true;
  }

  if ("timeline" in body) {
    const value = body.timeline;
    if (
      value !== null &&
      (typeof value !== "string" || !TIMELINES.has(value as ProfileTimeline))
    ) {
      return { error: "Invalid timeline" };
    }
    upsert.timeline = value as ProfileTimeline | null;
    hasField = true;
  }

  if ("journey_stage" in body) {
    const value = body.journey_stage;
    if (typeof value !== "string" || !JOURNEY_STAGES.has(value as JourneyStage)) {
      return { error: "Invalid journey_stage" };
    }
    upsert.journey_stage = value as JourneyStage;
    hasField = true;
  }

  if ("onboarding_completed" in body) {
    if (typeof body.onboarding_completed !== "boolean") {
      return { error: "Invalid onboarding_completed" };
    }
    upsert.onboarding_completed = body.onboarding_completed;
    hasField = true;
  }

  if ("investor_profile_name" in body) {
    const value = body.investor_profile_name;
    if (value !== null && typeof value !== "string") {
      return { error: "Invalid investor_profile_name" };
    }
    upsert.investor_profile_name = value as string | null;
    hasField = true;
  }

  const budgetMin = parseOptionalNumber(body.budget_min);
  if (budgetMin === undefined && "budget_min" in body) {
    return { error: "Invalid budget_min" };
  }
  if (budgetMin !== undefined) {
    upsert.budget_min = budgetMin;
    hasField = true;
  }

  const budgetMax = parseOptionalNumber(body.budget_max);
  if (budgetMax === undefined && "budget_max" in body) {
    return { error: "Invalid budget_max" };
  }
  if (budgetMax !== undefined) {
    upsert.budget_max = budgetMax;
    hasField = true;
  }

  const minCashFlow = parseOptionalNumber(body.min_cash_flow);
  if (minCashFlow === undefined && "min_cash_flow" in body) {
    return { error: "Invalid min_cash_flow" };
  }
  if (minCashFlow !== undefined) {
    upsert.min_cash_flow = minCashFlow;
    hasField = true;
  }

  const maxHoa = parseOptionalNumber(body.max_hoa);
  if (maxHoa === undefined && "max_hoa" in body) {
    return { error: "Invalid max_hoa" };
  }
  if (maxHoa !== undefined) {
    upsert.max_hoa = maxHoa;
    hasField = true;
  }

  const targetMarkets = parseStringArray(body.target_markets);
  if (targetMarkets === undefined && "target_markets" in body) {
    return { error: "Invalid target_markets" };
  }
  if (targetMarkets !== undefined) {
    upsert.target_markets = targetMarkets;
    hasField = true;
  }

  const increment: ProfileIncrement = {};
  let hasIncrement = false;

  if ("properties_analyzed" in body && body.properties_analyzed === 1) {
    increment.properties_analyzed = 1;
    hasIncrement = true;
  }

  if ("properties_saved" in body && body.properties_saved === 1) {
    increment.properties_saved = 1;
    hasIncrement = true;
  }

  if (!hasField && !hasIncrement) {
    return { error: "No valid profile fields provided" };
  }

  return {
    upsert: hasField ? upsert : undefined,
    increment: hasIncrement ? increment : undefined,
  };
}

export function userProfileToAnalyzerDefaults(profile: UserProfileRow) {
  const purchasePrice = profile.budget_max ?? undefined;
  const monthlyRent =
    purchasePrice != null ? Math.round(purchasePrice * 0.009) : undefined;
  const hoaFee =
    profile.max_hoa === 0
      ? 0
      : profile.max_hoa != null
        ? Math.round(profile.max_hoa * 0.85)
        : undefined;
  const propertyTaxes =
    purchasePrice != null ? Math.round((purchasePrice * 0.01) / 12) : undefined;

  return {
    purchasePrice,
    monthlyRent,
    hoaFee,
    propertyTaxes,
  };
}
