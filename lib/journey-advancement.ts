import { JOURNEY_STAGES, journeyStageIndex } from "./journey-stage";
import type { JourneyStage } from "./user-profile";

export const JOURNEY_CELEBRATION_MESSAGES: Partial<Record<JourneyStage, string>> =
  {
    educating:
      "You just moved to the Educating stage! You ran your first property analysis — keep learning.",
    searching:
      "You just moved to the Searching stage! You have saved your first deal — time to dig deeper.",
    ready:
      "You just moved to the Ready stage! With 3 deals saved, you're getting close to making an offer.",
  };

export function stageLabel(stage: JourneyStage): string {
  return JOURNEY_STAGES.find((s) => s.id === stage)?.label ?? stage;
}

export function computeJourneyAdvancement(
  currentStage: JourneyStage,
  event:
    | { type: "analysis"; previousAnalysesThisMonth: number }
    | { type: "save"; previousSaved: number; newSaved: number },
): { nextStage: JourneyStage; advanced: boolean } {
  let nextStage = currentStage;

  if (
    event.type === "analysis" &&
    event.previousAnalysesThisMonth === 0 &&
    currentStage === "exploring"
  ) {
    nextStage = "educating";
  }

  if (
    event.type === "save" &&
    event.previousSaved === 0 &&
    event.newSaved >= 1 &&
    currentStage === "educating"
  ) {
    nextStage = "searching";
  }

  if (
    event.type === "save" &&
    event.newSaved >= 3 &&
    event.previousSaved < 3 &&
    currentStage === "searching"
  ) {
    nextStage = "ready";
  }

  const advanced =
    journeyStageIndex(nextStage) > journeyStageIndex(currentStage);

  return {
    nextStage: advanced ? nextStage : currentStage,
    advanced,
  };
}

export const JOURNEY_CELEBRATION_STORAGE_KEY = "venura:journeyCelebration";

export function storeJourneyCelebration(stage: JourneyStage) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(
    JOURNEY_CELEBRATION_STORAGE_KEY,
    JSON.stringify({ stage, at: Date.now() }),
  );
}

export function readJourneyCelebration(): JourneyStage | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(JOURNEY_CELEBRATION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { stage?: JourneyStage; at?: number };
    if (!parsed.stage) return null;
    if (parsed.at && Date.now() - parsed.at > 60_000) {
      sessionStorage.removeItem(JOURNEY_CELEBRATION_STORAGE_KEY);
      return null;
    }
    return parsed.stage;
  } catch {
    return null;
  }
}

export function clearJourneyCelebration() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(JOURNEY_CELEBRATION_STORAGE_KEY);
}
