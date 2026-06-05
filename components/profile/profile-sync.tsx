"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import { getInvestorProfile } from "@/lib/investor-profile";
import { syncQuizProfileToServer } from "@/lib/profile-client";

const SYNCED_KEY = "venura:profileSynced";

export function ProfileSync() {
  const { isSignedIn } = useAuth();
  const started = useRef(false);

  useEffect(() => {
    if (!isSignedIn || started.current) return;
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SYNCED_KEY) === "1") return;

    const localProfile = getInvestorProfile();
    if (!localProfile) return;

    started.current = true;

    syncQuizProfileToServer(localProfile)
      .then(() => {
        sessionStorage.setItem(SYNCED_KEY, "1");
      })
      .catch((error) => {
        console.error("Profile sync failed:", error);
        started.current = false;
      });
  }, [isSignedIn]);

  return null;
}
