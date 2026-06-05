export type {
  ClimateWarning,
  KeyZipCode,
  MarketPulse,
  MarketSignal,
  MarketTemperature,
  RentByBedroom,
  RentControlWarning,
  RentGrowthPoint,
  UsRegion,
} from "./market-pulse-types";

export {
  US_REGION_LABELS,
  US_REGION_ORDER,
} from "./market-pulse-types";

import { enrichLegacyMarket } from "./market-pulse-helpers";
import { LEGACY_MARKET_DATA } from "./market-pulse-legacy";
import { NATIONAL_METRO_DATA } from "./market-pulse-national";
import type { MarketPulse, MarketTemperature } from "./market-pulse-types";

export const MARKET_PULSE_DATA: MarketPulse[] = [
  ...LEGACY_MARKET_DATA.map(enrichLegacyMarket),
  ...NATIONAL_METRO_DATA,
];

export const TEMPERATURE_STYLES: Record<
  MarketTemperature,
  { badge: string; text: string }
> = {
  hot: {
    badge: "bg-red-500/15 text-red-200 border-red-400/30",
    text: "text-red-200",
  },
  warm: {
    badge: "bg-amber-500/15 text-amber-200 border-amber-400/30",
    text: "text-amber-200",
  },
  balanced: {
    badge: "bg-sky-500/15 text-sky-200 border-sky-400/30",
    text: "text-sky-200",
  },
  cool: {
    badge: "bg-emerald-500/15 text-emerald-200 border-emerald-400/30",
    text: "text-emerald-200",
  },
};

export function getInvestorScoreLabel(score: number): string {
  if (score >= 75) return "Strong";
  if (score >= 65) return "Moderate";
  return "Cautious";
}

export function getInvestorScoreStyle(score: number): {
  bg: string;
  text: string;
  border: string;
} {
  if (score >= 75) {
    return {
      bg: "bg-emerald-600",
      text: "text-white",
      border: "border-emerald-500/40",
    };
  }
  if (score >= 65) {
    return {
      bg: "bg-[#1B4332]",
      text: "text-[#E8D5B7]",
      border: "border-[#E8D5B7]/40",
    };
  }
  if (score >= 55) {
    return {
      bg: "bg-amber-500",
      text: "text-white",
      border: "border-amber-400/40",
    };
  }
  return {
    bg: "bg-red-500",
    text: "text-white",
    border: "border-red-400/40",
  };
}

export function buildCityIntelligencePrompt(): string {
  const marketSummaries = MARKET_PULSE_DATA.map((market) => {
    const zips = market.keyZipCodes
      .map(
        (z) =>
          `${z.zip} ${z.neighborhood} (score ${z.investorScore}, 2BR ~$${z.averageRent})`,
      )
      .join("; ");
    const rents = market.averageRentByBedroom
      .map((r) => `${r.label} $${r.averageRent}`)
      .join(", ");
    const rentControl = market.rentControlWarning
      ? market.rentControlWarning.title
      : "No local rent control";
    const climate = market.climateWarning
      ? market.climateWarning.title
      : "No major climate flags";
    const growth = market.rentGrowthTrend
      .map((p) => `${p.year} +${p.growth}%`)
      .join(", ");

    return [
      `${market.name} (${market.region}, ${market.usRegion}): score ${market.investorScore}/100, ${market.temperatureLabel}, vacancy ${market.vacancyRate}%, DOM ${market.daysOnMarket}.`,
      `Avg rent: ${rents}. 3yr growth: ${growth}.`,
      `Key zips: ${zips}.`,
      `Rent control: ${rentControl}. Climate: ${climate}.`,
      `Bull: ${market.bullishSignals.map((s) => s.text).join(" ")}`,
      `Bear: ${market.bearishSignals.map((s) => s.text).join(" ")}`,
      `Neutral: ${market.neutralSignals.map((s) => s.text).join(" ")}`,
    ].join(" ");
  });

  return [
    `City intelligence for ${MARKET_PULSE_DATA.length} US markets (DC metro submarkets plus 16 national metros across Northeast, Southeast, Midwest, Southwest, and West Coast):`,
    ...marketSummaries,
  ].join("\n");
}
