export type MarketTemperature = "hot" | "warm" | "balanced" | "cool";

export type UsRegion =
  | "northeast"
  | "southeast"
  | "midwest"
  | "southwest"
  | "west-coast";

export type RentByBedroom = {
  bedrooms: number;
  label: string;
  averageRent: number;
};

export type RentGrowthPoint = {
  year: string;
  growth: number;
};

export type MarketSignal = {
  text: string;
};

export type RentControlWarning = {
  title: string;
  detail: string;
};

export type ClimateWarning = {
  title: string;
  detail: string;
};

export type KeyZipCode = {
  zip: string;
  neighborhood: string;
  investorScore: number;
  averageRent: number;
};

export type MarketPulse = {
  id: string;
  name: string;
  region: string;
  usRegion: UsRegion;
  zip: string;
  investorScore: number;
  temperature: MarketTemperature;
  temperatureLabel: string;
  averageRentByBedroom: RentByBedroom[];
  vacancyRate: number;
  daysOnMarket: number;
  rentGrowthTrend: RentGrowthPoint[];
  keyZipCodes: KeyZipCode[];
  bullishSignals: MarketSignal[];
  bearishSignals: MarketSignal[];
  neutralSignals: MarketSignal[];
  rentControlWarning: RentControlWarning | null;
  climateWarning: ClimateWarning | null;
};

export const US_REGION_LABELS: Record<UsRegion, string> = {
  northeast: "Northeast",
  southeast: "Southeast",
  midwest: "Midwest",
  southwest: "Southwest",
  "west-coast": "West Coast",
};

export const US_REGION_ORDER: UsRegion[] = [
  "northeast",
  "southeast",
  "midwest",
  "southwest",
  "west-coast",
];
