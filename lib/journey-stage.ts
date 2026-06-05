import type { JourneyStage } from "./user-profile";

export const JOURNEY_STAGES: { id: JourneyStage; label: string }[] = [
  { id: "exploring", label: "Exploring" },
  { id: "educating", label: "Educating" },
  { id: "searching", label: "Searching" },
  { id: "ready", label: "Ready" },
  { id: "under_contract", label: "Under Contract" },
  { id: "owner", label: "Owner" },
];

export const JOURNEY_STAGE_TIPS: Record<
  JourneyStage,
  { text: string; href: string }
> = {
  exploring: {
    text: "Start by taking the investor quiz to find your ideal market",
    href: "/quiz",
  },
  educating: {
    text: "Run your first property analysis in the Analyzer",
    href: "/analyzer",
  },
  searching: {
    text: "Set up deal alerts so matching properties come to you",
    href: "/deal-alerts",
  },
  ready: {
    text: "You have saved deals — time to make an offer. Check your HOA Health Reports first",
    href: "/hoa",
  },
  under_contract: {
    text: "Track your closing checklist",
    href: "/saved-deals",
  },
  owner: {
    text: "Your portfolio is live. Track your cash flow in Portfolio",
    href: "/portfolio",
  },
};

export function journeyStageIndex(stage: JourneyStage): number {
  return JOURNEY_STAGES.findIndex((s) => s.id === stage);
}
