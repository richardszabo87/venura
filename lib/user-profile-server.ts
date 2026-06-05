import { computeJourneyAdvancement } from "./journey-advancement";
import { getSubscriptionTier, getTierLimits } from "./subscription";
import { getSupabaseAdmin } from "./supabase";
import type {
  JourneyStage,
  ProfileIncrement,
  SubscriptionTier,
  UserProfileRow,
  UserProfileUpsert,
} from "./user-profile";

export type ProfileUpdateResult = {
  profile: UserProfileRow;
  stageAdvanced?: JourneyStage;
  previousStage?: JourneyStage;
};

function firstOfMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
}

function needsMonthReset(resetDate: string | null | undefined): boolean {
  if (!resetDate) return true;
  const reset = new Date(resetDate);
  const now = new Date();
  return (
    reset.getFullYear() !== now.getFullYear() ||
    reset.getMonth() !== now.getMonth()
  );
}

function withResetUsage(profile: UserProfileRow): UserProfileRow {
  const monthStart = firstOfMonth();
  let updated = { ...profile };

  if (needsMonthReset(profile.analyses_month_reset ?? null)) {
    updated = {
      ...updated,
      analyses_this_month: 0,
      analyses_month_reset: monthStart,
    };
  }

  if (needsMonthReset(profile.ai_month_reset ?? null)) {
    updated = {
      ...updated,
      ai_messages_this_month: 0,
      ai_month_reset: monthStart,
    };
  }

  return updated;
}

export async function fetchProfileByClerkId(
  clerkUserId: string,
): Promise<UserProfileRow | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) return null;

  const profile = data as UserProfileRow;
  const normalized = withResetUsage(profile);

  if (
    normalized.analyses_this_month !== profile.analyses_this_month ||
    normalized.analyses_month_reset !== profile.analyses_month_reset ||
    normalized.ai_messages_this_month !== profile.ai_messages_this_month ||
    normalized.ai_month_reset !== profile.ai_month_reset
  ) {
    const { data: refreshed, error: updateError } = await supabase
      .from("user_profiles")
      .update({
        analyses_this_month: normalized.analyses_this_month,
        analyses_month_reset: normalized.analyses_month_reset,
        ai_messages_this_month: normalized.ai_messages_this_month,
        ai_month_reset: normalized.ai_month_reset,
      })
      .eq("clerk_user_id", clerkUserId)
      .select()
      .single();

    if (updateError) {
      throw new Error(updateError.message);
    }

    return refreshed as UserProfileRow;
  }

  return profile;
}

export async function upsertProfile(
  clerkUserId: string,
  fields: UserProfileUpsert,
): Promise<UserProfileRow> {
  const supabase = getSupabaseAdmin();
  const existing = await fetchProfileByClerkId(clerkUserId);

  if (existing) {
    const { data, error } = await supabase
      .from("user_profiles")
      .update(fields)
      .eq("clerk_user_id", clerkUserId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as UserProfileRow;
  }

  const monthStart = firstOfMonth();
  const { data, error } = await supabase
    .from("user_profiles")
    .insert({
      clerk_user_id: clerkUserId,
      analyses_month_reset: monthStart,
      ai_month_reset: monthStart,
      ...fields,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as UserProfileRow;
}

export async function incrementProfileStats(
  clerkUserId: string,
  increment: ProfileIncrement,
): Promise<ProfileUpdateResult | null> {
  const supabase = getSupabaseAdmin();
  let profile = await fetchProfileByClerkId(clerkUserId);

  if (!profile) {
    const monthStart = firstOfMonth();
    const { data, error } = await supabase
      .from("user_profiles")
      .insert({
        clerk_user_id: clerkUserId,
        analyses_month_reset: monthStart,
        ai_month_reset: monthStart,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    profile = data as UserProfileRow;
  }

  const previousStage = profile.journey_stage;
  const previousSaved = profile.properties_saved;
  const updates: Partial<UserProfileRow> = {};

  if (increment.properties_analyzed) {
    updates.properties_analyzed =
      profile.properties_analyzed + increment.properties_analyzed;
  }

  if (increment.properties_saved) {
    updates.properties_saved =
      profile.properties_saved + increment.properties_saved;
  }

  if (Object.keys(updates).length === 0) {
    return { profile };
  }

  if (increment.properties_saved) {
    const advancement = computeJourneyAdvancement(profile.journey_stage, {
      type: "save",
      previousSaved,
      newSaved: updates.properties_saved!,
    });
    if (advancement.advanced) {
      updates.journey_stage = advancement.nextStage;
    }
  }

  const { data, error } = await supabase
    .from("user_profiles")
    .update(updates)
    .eq("clerk_user_id", clerkUserId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const nextProfile = data as UserProfileRow;
  const stageAdvanced =
    nextProfile.journey_stage !== previousStage
      ? nextProfile.journey_stage
      : undefined;

  return {
    profile: nextProfile,
    stageAdvanced,
    previousStage: stageAdvanced ? previousStage : undefined,
  };
}

export type UsageLimitError = {
  code: "LIMIT_REACHED";
  reason: string;
  tier: SubscriptionTier;
};

export async function incrementAnalysisUsage(
  clerkUserId: string,
): Promise<ProfileUpdateResult | { error: UsageLimitError }> {
  const profile = await fetchProfileByClerkId(clerkUserId);
  if (!profile) {
    throw new Error("Profile not found");
  }

  const tier = getSubscriptionTier(profile);
  const limits = getTierLimits(tier);
  const previousAnalysesThisMonth = profile.analyses_this_month ?? 0;

  if (
    Number.isFinite(limits.analysesPerMonth) &&
    previousAnalysesThisMonth >= limits.analysesPerMonth
  ) {
    return {
      error: {
        code: "LIMIT_REACHED",
        reason: "analyses",
        tier,
      },
    };
  }

  const previousStage = profile.journey_stage;
  const advancement = computeJourneyAdvancement(profile.journey_stage, {
    type: "analysis",
    previousAnalysesThisMonth,
  });

  const supabase = getSupabaseAdmin();
  const monthStart = firstOfMonth();
  const updates: Partial<UserProfileRow> = {
    analyses_this_month: previousAnalysesThisMonth + 1,
    analyses_month_reset: monthStart,
    properties_analyzed: profile.properties_analyzed + 1,
  };

  if (advancement.advanced) {
    updates.journey_stage = advancement.nextStage;
  }

  const { data, error } = await supabase
    .from("user_profiles")
    .update(updates)
    .eq("clerk_user_id", clerkUserId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const nextProfile = data as UserProfileRow;
  const stageAdvanced =
    nextProfile.journey_stage !== previousStage
      ? nextProfile.journey_stage
      : undefined;

  return {
    profile: nextProfile,
    stageAdvanced,
    previousStage: stageAdvanced ? previousStage : undefined,
  };
}

export async function incrementAiMessageUsage(
  clerkUserId: string,
): Promise<{ profile: UserProfileRow } | { error: UsageLimitError }> {
  const profile = await fetchProfileByClerkId(clerkUserId);
  if (!profile) {
    throw new Error("Profile not found");
  }

  const tier = getSubscriptionTier(profile);
  const limits = getTierLimits(tier);

  if (
    Number.isFinite(limits.aiMessagesPerMonth) &&
    (profile.ai_messages_this_month ?? 0) >= limits.aiMessagesPerMonth
  ) {
    return {
      error: {
        code: "LIMIT_REACHED",
        reason: "ai_messages",
        tier,
      },
    };
  }

  const supabase = getSupabaseAdmin();
  const monthStart = firstOfMonth();
  const { data, error } = await supabase
    .from("user_profiles")
    .update({
      ai_messages_this_month: (profile.ai_messages_this_month ?? 0) + 1,
      ai_month_reset: monthStart,
    })
    .eq("clerk_user_id", clerkUserId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return { profile: data as UserProfileRow };
}

export async function updateSubscriptionTier(
  clerkUserId: string,
  tier: SubscriptionTier,
  stripeIds?: { customerId?: string; subscriptionId?: string },
): Promise<UserProfileRow> {
  const updates: Record<string, string> = { subscription_tier: tier };
  if (stripeIds?.customerId) updates.stripe_customer_id = stripeIds.customerId;
  if (stripeIds?.subscriptionId) {
    updates.stripe_subscription_id = stripeIds.subscriptionId;
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("user_profiles")
    .update(updates)
    .eq("clerk_user_id", clerkUserId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as UserProfileRow;
}

export async function updateSubscriptionByStripeCustomer(
  customerId: string,
  tier: SubscriptionTier,
  subscriptionId?: string,
): Promise<void> {
  const supabase = getSupabaseAdmin();
  const updates: Record<string, string> = { subscription_tier: tier };
  if (subscriptionId) updates.stripe_subscription_id = subscriptionId;

  const { error } = await supabase
    .from("user_profiles")
    .update(updates)
    .eq("stripe_customer_id", customerId);

  if (error) {
    throw new Error(error.message);
  }
}
