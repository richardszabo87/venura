export type MarketTemperature = "hot" | "warm" | "balanced" | "cool";

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

export type MarketPulse = {
  id: string;
  name: string;
  zip: string;
  investorScore: number;
  temperature: MarketTemperature;
  temperatureLabel: string;
  averageRentByBedroom: RentByBedroom[];
  vacancyRate: number;
  daysOnMarket: number;
  rentGrowthTrend: RentGrowthPoint[];
  bullishSignals: MarketSignal[];
  bearishSignals: MarketSignal[];
  rentControlWarning: RentControlWarning | null;
};

export const MARKET_PULSE_DATA: MarketPulse[] = [
  {
    id: "landover",
    name: "Landover",
    zip: "20785",
    investorScore: 78,
    temperature: "warm",
    temperatureLabel: "Warm",
    averageRentByBedroom: [
      { bedrooms: 1, label: "1 BR", averageRent: 1450 },
      { bedrooms: 2, label: "2 BR", averageRent: 1850 },
      { bedrooms: 3, label: "3 BR", averageRent: 2350 },
      { bedrooms: 4, label: "4 BR", averageRent: 2750 },
    ],
    vacancyRate: 5.8,
    daysOnMarket: 18,
    rentGrowthTrend: [
      { year: "2021", growth: 2.8 },
      { year: "2022", growth: 3.4 },
      { year: "2023", growth: 3.9 },
      { year: "2024", growth: 4.2 },
      { year: "2025", growth: 4.5 },
    ],
    bullishSignals: [
      { text: "Strong cash-flow potential with lower entry prices than inner Beltway markets." },
      { text: "Metro access via Landover and New Carrollton supports tenant demand." },
      { text: "Townhouse inventory offers fee-simple alternatives to condo HOA risk." },
    ],
    bearishSignals: [
      { text: "Higher vacancy than Montgomery County — budget 2–3 weeks between tenants." },
      { text: "Appreciation lags closer-in DC submarkets over a 5-year horizon." },
    ],
    rentControlWarning: null,
  },
  {
    id: "hyattsville",
    name: "Hyattsville",
    zip: "20783",
    investorScore: 74,
    temperature: "warm",
    temperatureLabel: "Warm",
    averageRentByBedroom: [
      { bedrooms: 1, label: "1 BR", averageRent: 1520 },
      { bedrooms: 2, label: "2 BR", averageRent: 1920 },
      { bedrooms: 3, label: "3 BR", averageRent: 2450 },
      { bedrooms: 4, label: "4 BR", averageRent: 2900 },
    ],
    vacancyRate: 5.5,
    daysOnMarket: 16,
    rentGrowthTrend: [
      { year: "2021", growth: 2.5 },
      { year: "2022", growth: 3.1 },
      { year: "2023", growth: 3.6 },
      { year: "2024", growth: 3.9 },
      { year: "2025", growth: 4.1 },
    ],
    bullishSignals: [
      { text: "Arts District revitalization is attracting younger professional tenants." },
      { text: "Proximity to DC and Purple Line corridor supports rent stability." },
      { text: "Mixed housing stock allows value-add townhouse strategies." },
    ],
    bearishSignals: [
      { text: "Some blocks still carry higher crime perception — vet block-by-block." },
      { text: "Older building stock may require higher capex reserves." },
    ],
    rentControlWarning: null,
  },
  {
    id: "silver-spring",
    name: "Silver Spring",
    zip: "20901",
    investorScore: 71,
    temperature: "balanced",
    temperatureLabel: "Balanced",
    averageRentByBedroom: [
      { bedrooms: 1, label: "1 BR", averageRent: 1750 },
      { bedrooms: 2, label: "2 BR", averageRent: 2250 },
      { bedrooms: 3, label: "3 BR", averageRent: 2850 },
      { bedrooms: 4, label: "4 BR", averageRent: 3350 },
    ],
    vacancyRate: 4.9,
    daysOnMarket: 14,
    rentGrowthTrend: [
      { year: "2021", growth: 1.8 },
      { year: "2022", growth: 2.4 },
      { year: "2023", growth: 2.9 },
      { year: "2024", growth: 3.2 },
      { year: "2025", growth: 3.4 },
    ],
    bullishSignals: [
      { text: "Red Line Metro access drives consistent rental demand." },
      { text: "Low vacancy supports stable occupancy assumptions in underwriting." },
      { text: "Strong employer base from federal and biotech sectors nearby." },
    ],
    bearishSignals: [
      { text: "Higher purchase prices compress cash-on-cash returns." },
      { text: "Condo HOA fees can erode margins — run HOA Danger Score first." },
    ],
    rentControlWarning: {
      title: "Montgomery County rent stabilization may apply",
      detail:
        "Montgomery County limits annual rent increases on covered units. Verify whether a property is subject to county rent stabilization before projecting growth.",
    },
  },
  {
    id: "takoma-park",
    name: "Takoma Park",
    zip: "20912",
    investorScore: 65,
    temperature: "balanced",
    temperatureLabel: "Balanced",
    averageRentByBedroom: [
      { bedrooms: 1, label: "1 BR", averageRent: 1680 },
      { bedrooms: 2, label: "2 BR", averageRent: 2180 },
      { bedrooms: 3, label: "3 BR", averageRent: 2720 },
      { bedrooms: 4, label: "4 BR", averageRent: 3200 },
    ],
    vacancyRate: 4.4,
    daysOnMarket: 12,
    rentGrowthTrend: [
      { year: "2021", growth: 1.5 },
      { year: "2022", growth: 2.0 },
      { year: "2023", growth: 2.3 },
      { year: "2024", growth: 2.6 },
      { year: "2025", growth: 2.8 },
    ],
    bullishSignals: [
      { text: "Walkable, transit-oriented neighborhood with strong tenant retention." },
      { text: "Low days-on-market indicates healthy leasing velocity." },
      { text: "Historic housing stock supports long-term appreciation thesis." },
    ],
    bearishSignals: [
      { text: "Rent control caps limit upside on annual rent increases." },
      { text: "Smaller inventory pool makes deal sourcing competitive." },
    ],
    rentControlWarning: {
      title: "Takoma Park rent stabilization in effect",
      detail:
        "Takoma Park limits annual rent increases and requires registration for rental properties. Factor capped rent growth into your 10-year projections.",
    },
  },
  {
    id: "dc-20011",
    name: "Washington, DC",
    zip: "20011",
    investorScore: 68,
    temperature: "hot",
    temperatureLabel: "Hot",
    averageRentByBedroom: [
      { bedrooms: 1, label: "1 BR", averageRent: 1950 },
      { bedrooms: 2, label: "2 BR", averageRent: 2550 },
      { bedrooms: 3, label: "3 BR", averageRent: 3200 },
      { bedrooms: 4, label: "4 BR", averageRent: 3850 },
    ],
    vacancyRate: 4.0,
    daysOnMarket: 11,
    rentGrowthTrend: [
      { year: "2021", growth: 1.2 },
      { year: "2022", growth: 1.8 },
      { year: "2023", growth: 2.1 },
      { year: "2024", growth: 2.4 },
      { year: "2025", growth: 2.5 },
    ],
    bullishSignals: [
      { text: "Petworth and Brightwood seeing sustained gentrification-driven demand." },
      { text: "Low vacancy and fast leasing reduce holding cost risk." },
      { text: "Rowhouse conversions offer multi-unit income potential." },
    ],
    bearishSignals: [
      { text: "DC rent control limits increases on most rental units." },
      { text: "Higher basis prices require precise underwriting to hit cash-flow targets." },
    ],
    rentControlWarning: {
      title: "DC rent control applies to most rental units",
      detail:
        "District of Columbia rent control limits annual increases on covered units built before 2006 (with exceptions). Registration with DCRA is required. Model conservative rent growth.",
    },
  },
  {
    id: "bowie",
    name: "Bowie",
    zip: "20715",
    investorScore: 76,
    temperature: "warm",
    temperatureLabel: "Warm",
    averageRentByBedroom: [
      { bedrooms: 1, label: "1 BR", averageRent: 1380 },
      { bedrooms: 2, label: "2 BR", averageRent: 1780 },
      { bedrooms: 3, label: "3 BR", averageRent: 2280 },
      { bedrooms: 4, label: "4 BR", averageRent: 2680 },
    ],
    vacancyRate: 5.2,
    daysOnMarket: 15,
    rentGrowthTrend: [
      { year: "2021", growth: 2.6 },
      { year: "2022", growth: 3.2 },
      { year: "2023", growth: 3.7 },
      { year: "2024", growth: 4.0 },
      { year: "2025", growth: 4.3 },
    ],
    bullishSignals: [
      { text: "Family-oriented market with strong single-family rental demand." },
      { text: "MARC commuter rail access supports professional tenant pool." },
      { text: "Lower HOA exposure than condo-heavy inner suburbs." },
    ],
    bearishSignals: [
      { text: "Car-dependent market — factor parking and yard maintenance costs." },
      { text: "Rent growth strong but appreciation slower than closer-in DC." },
    ],
    rentControlWarning: null,
  },
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
