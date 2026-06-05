import type { BuyerType } from "./user-profile";

export type QuickAction = {
  label: string;
  href: string;
};

const INVESTOR_ACTIONS: QuickAction[] = [
  { label: "Analyze a deal", href: "/analyzer" },
  { label: "Check HOA", href: "/hoa" },
  { label: "View markets", href: "/markets" },
  { label: "Ask VenuraAI", href: "/venura-ai" },
];

const FIRST_TIME_BUYER_ACTIONS: QuickAction[] = [
  { label: "Run affordability check", href: "/analyzer" },
  { label: "Take the quiz", href: "/quiz" },
  { label: "View markets", href: "/markets" },
  { label: "Ask VenuraAI", href: "/venura-ai" },
];

const MOVE_UP_BUYER_ACTIONS: QuickAction[] = [
  { label: "Calculate equity", href: "/projections" },
  { label: "Compare neighborhoods", href: "/markets" },
  { label: "View markets", href: "/markets" },
  { label: "Ask VenuraAI", href: "/venura-ai" },
];

export function getQuickActions(buyerType: BuyerType | null): QuickAction[] {
  switch (buyerType) {
    case "investor":
      return INVESTOR_ACTIONS;
    case "first_time_buyer":
      return FIRST_TIME_BUYER_ACTIONS;
    case "move_up_buyer":
      return MOVE_UP_BUYER_ACTIONS;
    case "all":
      return [
        ...INVESTOR_ACTIONS,
        ...FIRST_TIME_BUYER_ACTIONS,
        ...MOVE_UP_BUYER_ACTIONS,
      ];
    default:
      return INVESTOR_ACTIONS;
  }
}
