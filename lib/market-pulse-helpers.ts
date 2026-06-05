import type {
  ClimateWarning,
  KeyZipCode,
  MarketPulse,
  RentByBedroom,
  RentControlWarning,
  RentGrowthPoint,
  MarketTemperature,
} from "./market-pulse-types";

export function bedroomRentsFrom2Bed(avg2Bed: number): RentByBedroom[] {
  return [
    { bedrooms: 1, label: "1 BR", averageRent: Math.round(avg2Bed * 0.78) },
    { bedrooms: 2, label: "2 BR", averageRent: avg2Bed },
    { bedrooms: 3, label: "3 BR", averageRent: Math.round(avg2Bed * 1.32) },
    { bedrooms: 4, label: "4 BR", averageRent: Math.round(avg2Bed * 1.58) },
  ];
}

export function rentGrowthTrend(latestGrowth: number): RentGrowthPoint[] {
  return [
    { year: "2023", growth: Math.round((latestGrowth - 0.4) * 10) / 10 },
    { year: "2024", growth: Math.round((latestGrowth - 0.2) * 10) / 10 },
    { year: "2025", growth: latestGrowth },
  ];
}

export function deriveTemperature(
  investorScore: number,
  vacancyRate: number,
): { temperature: MarketTemperature; temperatureLabel: string } {
  if (vacancyRate >= 7.5 || investorScore < 60) {
    return { temperature: "cool", temperatureLabel: "Cool" };
  }
  if (investorScore >= 74 && vacancyRate < 5) {
    return { temperature: "hot", temperatureLabel: "Hot" };
  }
  if (investorScore >= 65) {
    return { temperature: "warm", temperatureLabel: "Warm" };
  }
  return { temperature: "balanced", temperatureLabel: "Balanced" };
}

export function deriveDaysOnMarket(vacancyRate: number): number {
  return Math.round(10 + vacancyRate * 1.2);
}

type ZipInput = {
  zip: string;
  neighborhood: string;
  investorScore: number;
  averageRent: number;
};

type MetroInput = {
  id: string;
  name: string;
  region: string;
  usRegion: MarketPulse["usRegion"];
  zip: string;
  investorScore: number;
  avg2Bed: number;
  rentGrowth: number;
  vacancy: number;
  rentControl: RentControlWarning | null;
  climate: ClimateWarning | null;
  zips: ZipInput[];
  bullish: string[];
  bearish: string[];
  neutral: string[];
};

export function createMetro(input: MetroInput): MarketPulse {
  const { temperature, temperatureLabel } = deriveTemperature(
    input.investorScore,
    input.vacancy,
  );

  const keyZipCodes: KeyZipCode[] = input.zips.map((z) => ({
    zip: z.zip,
    neighborhood: z.neighborhood,
    investorScore: z.investorScore,
    averageRent: z.averageRent,
  }));

  return {
    id: input.id,
    name: input.name,
    region: input.region,
    usRegion: input.usRegion,
    zip: input.zip,
    investorScore: input.investorScore,
    temperature,
    temperatureLabel,
    averageRentByBedroom: bedroomRentsFrom2Bed(input.avg2Bed),
    vacancyRate: input.vacancy,
    daysOnMarket: deriveDaysOnMarket(input.vacancy),
    rentGrowthTrend: rentGrowthTrend(input.rentGrowth),
    keyZipCodes,
    bullishSignals: input.bullish.map((text) => ({ text })),
    bearishSignals: input.bearish.map((text) => ({ text })),
    neutralSignals: input.neutral.map((text) => ({ text })),
    rentControlWarning: input.rentControl,
    climateWarning: input.climate,
  };
}

const LEGACY_US_REGIONS: Record<string, MarketPulse["usRegion"]> = {
  landover: "northeast",
  hyattsville: "northeast",
  "silver-spring": "northeast",
  "takoma-park": "northeast",
  "dc-20011": "northeast",
  bowie: "northeast",
  baltimore: "northeast",
  "northern-virginia": "northeast",
  atlanta: "southeast",
  miami: "southeast",
  phoenix: "southwest",
};

type LegacyZip = Omit<KeyZipCode, "averageRent"> & { averageRent?: number };

export function enrichLegacyMarket(
  market: Omit<MarketPulse, "usRegion" | "neutralSignals"> & {
    keyZipCodes: LegacyZip[];
    usRegion?: MarketPulse["usRegion"];
    neutralSignals?: MarketPulse["neutralSignals"];
  },
): MarketPulse {
  const base2 =
    market.averageRentByBedroom.find((r) => r.bedrooms === 2)?.averageRent ?? 0;

  return {
    ...market,
    usRegion: market.usRegion ?? LEGACY_US_REGIONS[market.id] ?? "northeast",
    neutralSignals: market.neutralSignals ?? [
      {
        text: "Underwrite block-by-block — submarket variation is high within this area.",
      },
    ],
    keyZipCodes: market.keyZipCodes.map((z) => ({
      ...z,
      averageRent:
        z.averageRent ??
        Math.round(base2 * (z.investorScore / market.investorScore)),
    })),
  };
}
