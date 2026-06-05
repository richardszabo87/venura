import { formatCurrency } from "./format";
import type { ProfileGoal } from "./user-profile";

export const GOAL_LABELS: Record<ProfileGoal, string> = {
  cash_flow: "Monthly cash flow",
  appreciation: "Long-term appreciation",
  both: "Both equally",
  learning: "Learning the market",
  primary_home: "Finding my perfect home",
};

export function formatBudgetRange(
  min: number | null,
  max: number | null,
): string {
  if (min != null && max != null) {
    return `${formatCurrency(min)} – ${formatCurrency(max)}`;
  }
  if (max != null) return `Up to ${formatCurrency(max)}`;
  if (min != null) return `From ${formatCurrency(min)}`;
  return "Not set";
}

export function extractMarketChips(markets: string[]): string[] {
  if (!markets.length) return [];

  return markets.map((market) => {
    const zip = market.match(/\b\d{5}\b/);
    return zip ? zip[0] : market;
  });
}

export function daysOnVenura(createdAt: string): number {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  return Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1);
}

export function GoalIcon({ goal }: { goal: ProfileGoal }) {
  const className = "h-5 w-5 shrink-0 text-[#E8D5B7]";

  switch (goal) {
    case "cash_flow":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 2v20M17 7H9.5a3.5 3.5 0 100 7H14a3.5 3.5 0 110 7H7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "appreciation":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M3 17l6-6 4 4 8-10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17 5h4v4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "both":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 3v18M8 7h8M8 17h8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case "learning":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4 19.5A2.5 2.5 0 016.5 17H20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "primary_home":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}
