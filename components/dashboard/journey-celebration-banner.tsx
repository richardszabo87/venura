"use client";

import { useEffect, useState } from "react";
import {
  clearJourneyCelebration,
  JOURNEY_CELEBRATION_MESSAGES,
  readJourneyCelebration,
  stageLabel,
} from "@/lib/journey-advancement";
import type { JourneyStage } from "@/lib/user-profile";

export function JourneyCelebrationBanner() {
  const [stage, setStage] = useState<JourneyStage | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const advanced = readJourneyCelebration();
    if (!advanced) return;

    setStage(advanced);
    setVisible(true);
    clearJourneyCelebration();

    const timer = window.setTimeout(() => {
      setVisible(false);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, []);

  if (!visible || !stage) return null;

  const message =
    JOURNEY_CELEBRATION_MESSAGES[stage] ??
    `You just moved to the ${stageLabel(stage)} stage!`;

  return (
    <div className="mb-8 rounded-2xl border border-[#E8D5B7]/40 bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] px-6 py-5 shadow-xl">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#E8D5B7]/80">
        Milestone reached
      </p>
      <p className="mt-2 text-sm font-medium text-white sm:text-base">
        {message}
      </p>
    </div>
  );
}
