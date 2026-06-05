import type { InvestorProfile } from "./investor-profile";
import type { UserProfileRow, UserProfileUpsert } from "./user-profile";

export async function fetchUserProfile(): Promise<UserProfileRow | null> {
  const res = await fetch("/api/profile");
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(
      (data as { error?: string }).error ?? "Failed to fetch profile",
    );
  }
  const data = (await res.json()) as { profile: UserProfileRow | null };
  return data.profile;
}

export async function syncQuizProfileToServer(
  investorProfile: InvestorProfile,
): Promise<UserProfileRow> {
  const res = await fetch("/api/profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      syncFromQuiz: true,
      investorProfile,
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(
      (data as { error?: string }).error ?? "Failed to sync profile",
    );
  }

  const data = (await res.json()) as { profile: UserProfileRow };
  return data.profile;
}

export async function saveProfileFields(
  fields: UserProfileUpsert,
): Promise<UserProfileRow> {
  const res = await fetch("/api/profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fields),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(
      (data as { error?: string }).error ?? "Failed to save profile",
    );
  }

  const data = (await res.json()) as { profile: UserProfileRow };
  return data.profile;
}

export async function incrementPropertiesAnalyzed(): Promise<void> {
  await fetch("/api/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ properties_analyzed: 1 }),
  });
}

export async function patchProfileFields(
  fields: UserProfileUpsert,
): Promise<UserProfileRow> {
  const res = await fetch("/api/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fields),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(
      (data as { error?: string }).error ?? "Failed to update profile",
    );
  }

  const data = (await res.json()) as { profile: UserProfileRow };
  return data.profile;
}
