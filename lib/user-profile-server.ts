import { getSupabaseAdmin } from "./supabase";
import type {
  ProfileIncrement,
  UserProfileRow,
  UserProfileUpsert,
} from "./user-profile";

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

  return (data as UserProfileRow | null) ?? null;
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

  const { data, error } = await supabase
    .from("user_profiles")
    .insert({ clerk_user_id: clerkUserId, ...fields })
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
): Promise<UserProfileRow | null> {
  const supabase = getSupabaseAdmin();
  let profile = await fetchProfileByClerkId(clerkUserId);

  if (!profile) {
    const { data, error } = await supabase
      .from("user_profiles")
      .insert({ clerk_user_id: clerkUserId })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    profile = data as UserProfileRow;
  }

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
    return profile;
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

  return data as UserProfileRow;
}
