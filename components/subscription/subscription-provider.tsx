"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { UpgradeModal } from "@/components/upgrade-modal";
import { fetchUserProfile } from "@/lib/profile-client";
import {
  getSubscriptionTier,
  getUsageSnapshot,
  type UpgradeReason,
} from "@/lib/subscription";
import type { UserProfileRow } from "@/lib/user-profile";

type SubscriptionContextValue = {
  profile: UserProfileRow | null;
  tier: ReturnType<typeof getSubscriptionTier>;
  usage: ReturnType<typeof getUsageSnapshot> | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  showUpgrade: (reason: UpgradeReason) => void;
};

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

export function SubscriptionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile, setProfile] = useState<UserProfileRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgradeReason, setUpgradeReason] = useState<UpgradeReason | null>(
    null,
  );

  const refreshProfile = useCallback(async () => {
    try {
      const next = await fetchUserProfile();
      setProfile(next);
    } catch (error) {
      console.error("Failed to load subscription profile:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshProfile();
  }, [refreshProfile]);

  const showUpgrade = useCallback((reason: UpgradeReason) => {
    setUpgradeReason(reason);
  }, []);

  const value = useMemo(() => {
    const tier = getSubscriptionTier(profile);
    return {
      profile,
      tier,
      usage: profile ? getUsageSnapshot(profile) : null,
      loading,
      refreshProfile,
      showUpgrade,
    };
  }, [profile, loading, refreshProfile, showUpgrade]);

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
      <UpgradeModal
        open={upgradeReason !== null}
        reason={upgradeReason ?? "analyses"}
        onClose={() => setUpgradeReason(null)}
      />
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error("useSubscription must be used within SubscriptionProvider");
  }
  return context;
}
