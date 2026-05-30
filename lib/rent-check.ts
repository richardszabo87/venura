import { formatCurrency } from "./format";

export type RentPropertyType = "condo" | "townhouse" | "single-family" | "multi-family";

export type RentCondition = "excellent" | "good" | "fair" | "needs-work";

export type RentCheckInput = {
  addressOrZip: string;
  bedrooms: number;
  propertyType: RentPropertyType;
  condition: RentCondition;
};

export type RentRange = {
  low: number;
  mid: number;
  high: number;
};

export type MarketStats = {
  rentGrowth: number;
  vacancyRate: number;
  daysOnMarket: number;
};

export type ComparableRental = {
  address: string;
  bedrooms: number;
  bathrooms: number;
  rent: number;
  distance: string;
  propertyType: RentPropertyType;
};

export type RentCheckResult = {
  zipCode: string;
  areaLabel: string;
  rentRange: RentRange;
  marketStats: MarketStats;
  comparables: ComparableRental[];
  insights: string[];
};

type ZipMarket = {
  zip: string;
  area: string;
  baseRent2Br: number;
  rentGrowth: number;
  vacancyRate: number;
  daysOnMarket: number;
  streetNames: string[];
};

const ZIP_MARKETS: ZipMarket[] = [
  {
    zip: "20785",
    area: "Hyattsville / Landover, MD",
    baseRent2Br: 1850,
    rentGrowth: 4.2,
    vacancyRate: 5.8,
    daysOnMarket: 18,
    streetNames: ["Kanawha St", "Belle Pre Way", "Evans Trail", "Larchmont Ave"],
  },
  {
    zip: "20782",
    area: "Hyattsville, MD",
    baseRent2Br: 1920,
    rentGrowth: 3.9,
    vacancyRate: 5.5,
    daysOnMarket: 16,
    streetNames: ["Nicholson St", "Topeka St", "Adelphi Rd", "Queens Chapel Rd"],
  },
  {
    zip: "20901",
    area: "Silver Spring, MD",
    baseRent2Br: 2250,
    rentGrowth: 3.4,
    vacancyRate: 4.9,
    daysOnMarket: 14,
    streetNames: ["Fenton St", "Sligo Creek Pkwy", "East West Hwy", "Wayne Ave"],
  },
  {
    zip: "20910",
    area: "Silver Spring, MD",
    baseRent2Br: 2380,
    rentGrowth: 3.1,
    vacancyRate: 4.6,
    daysOnMarket: 13,
    streetNames: ["Georgia Ave", "Colesville Rd", "Bonifant St", "Cameron St"],
  },
  {
    zip: "20850",
    area: "Rockville, MD",
    baseRent2Br: 2450,
    rentGrowth: 2.8,
    vacancyRate: 4.2,
    daysOnMarket: 12,
    streetNames: ["Rockville Pike", "Twinbrook Pkwy", "Veirs Mill Rd", "Rollins Ave"],
  },
  {
    zip: "20011",
    area: "Petworth / Brightwood, DC",
    baseRent2Br: 2550,
    rentGrowth: 2.5,
    vacancyRate: 4.0,
    daysOnMarket: 11,
    streetNames: ["Upshur St NW", "Georgia Ave NW", "Kennedy St NW", "Missouri Ave NW"],
  },
  {
    zip: "20002",
    area: "Capitol Hill / H Street, DC",
    baseRent2Br: 2900,
    rentGrowth: 2.2,
    vacancyRate: 3.8,
    daysOnMarket: 10,
    streetNames: ["H St NE", "8th St SE", "Massachusetts Ave NE", "Maryland Ave NE"],
  },
  {
    zip: "20009",
    area: "Columbia Heights / Adams Morgan, DC",
    baseRent2Br: 2750,
    rentGrowth: 2.0,
    vacancyRate: 3.5,
    daysOnMarket: 9,
    streetNames: ["14th St NW", "Columbia Rd NW", "Calvert St NW", "U St NW"],
  },
  {
    zip: "22201",
    area: "Arlington, VA",
    baseRent2Br: 2850,
    rentGrowth: 2.3,
    vacancyRate: 4.1,
    daysOnMarket: 10,
    streetNames: ["Wilson Blvd", "Clarendon Blvd", "Washington Blvd", "Key Blvd"],
  },
  {
    zip: "22304",
    area: "Alexandria, VA",
    baseRent2Br: 2300,
    rentGrowth: 3.0,
    vacancyRate: 4.8,
    daysOnMarket: 13,
    streetNames: ["Duke St", "Van Dorn St", "Edsall Rd", "Holland Ln"],
  },
  {
    zip: "22191",
    area: "Woodbridge, VA",
    baseRent2Br: 2100,
    rentGrowth: 3.6,
    vacancyRate: 5.2,
    daysOnMarket: 15,
    streetNames: ["Dale Blvd", "Minnieville Rd", "Opitz Blvd", "Fitzgerald Dr"],
  },
  {
    zip: "20601",
    area: "Waldorf, MD",
    baseRent2Br: 1750,
    rentGrowth: 4.5,
    vacancyRate: 6.1,
    daysOnMarket: 20,
    streetNames: ["Crain Hwy", "Smallwood Dr", "St Patrick Dr", "Old Washington Rd"],
  },
];

const DEFAULT_MARKET: ZipMarket = {
  zip: "20901",
  area: "DC Metro",
  baseRent2Br: 2200,
  rentGrowth: 3.2,
  vacancyRate: 5.0,
  daysOnMarket: 15,
  streetNames: ["Main St", "Oak Ave", "Maple Dr", "Park Rd"],
};

const BEDROOM_MULTIPLIER: Record<number, number> = {
  0: 0.65,
  1: 0.78,
  2: 1,
  3: 1.32,
  4: 1.58,
  5: 1.82,
};

const PROPERTY_MULTIPLIER: Record<RentPropertyType, number> = {
  condo: 1,
  townhouse: 1.08,
  "single-family": 1.18,
  "multi-family": 0.94,
};

const CONDITION_MULTIPLIER: Record<RentCondition, number> = {
  excellent: 1.07,
  good: 1,
  fair: 0.93,
  "needs-work": 0.86,
};

const PROPERTY_TYPE_LABEL: Record<RentPropertyType, string> = {
  condo: "Condo",
  townhouse: "Townhouse",
  "single-family": "Single family",
  "multi-family": "Multi-family",
};

function extractZip(input: string): string | null {
  const match = input.match(/\b(\d{5})\b/);
  return match?.[1] ?? null;
}

function resolveMarket(zip: string | null): ZipMarket {
  if (!zip) return DEFAULT_MARKET;
  return ZIP_MARKETS.find((market) => market.zip === zip) ?? DEFAULT_MARKET;
}

function bedroomMultiplier(bedrooms: number): number {
  const beds = Math.max(0, Math.min(bedrooms, 5));
  return BEDROOM_MULTIPLIER[beds] ?? 1;
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function buildComparables(
  market: ZipMarket,
  input: RentCheckInput,
  midRent: number,
): ComparableRental[] {
  const seed = hashString(`${market.zip}-${input.bedrooms}-${input.propertyType}`);
  const bathOptions = [1, 1.5, 2, 2.5];

  return Array.from({ length: 4 }, (_, index) => {
    const offset = ((seed + index * 17) % 11) - 5;
    const rent = Math.round(midRent * (1 + offset / 100));
    const bedDelta = (seed + index) % 3 === 0 ? -1 : 0;
    const beds = Math.max(1, input.bedrooms + bedDelta);
    const street = market.streetNames[index % market.streetNames.length];
    const houseNumber = 1200 + ((seed + index * 113) % 800);
    const distance = `${0.2 + ((seed + index * 7) % 15) / 10} mi`;

    return {
      address: `${houseNumber} ${street}, ${market.zip}`,
      bedrooms: beds,
      bathrooms: bathOptions[(seed + index) % bathOptions.length],
      rent,
      distance,
      propertyType:
        index % 2 === 0
          ? input.propertyType
          : (["condo", "townhouse", "single-family"] as RentPropertyType[])[
              (seed + index) % 3
            ],
    };
  }).sort((a, b) => a.rent - b.rent);
}

function buildInsights(
  market: ZipMarket,
  input: RentCheckInput,
  midRent: number,
): string[] {
  const insights: string[] = [];

  if (market.rentGrowth >= 4) {
    insights.push(
      `${market.area} has above-average rent growth at ${market.rentGrowth.toFixed(1)}% — strong for income-focused investors.`,
    );
  } else if (market.rentGrowth <= 2.5) {
    insights.push(
      `Rent growth is moderate at ${market.rentGrowth.toFixed(1)}% — prioritize purchase price and long-term appreciation.`,
    );
  } else {
    insights.push(
      `Rent growth of ${market.rentGrowth.toFixed(1)}% is in line with the DC metro average.`,
    );
  }

  if (market.vacancyRate <= 4.5) {
    insights.push(
      `Low vacancy (${market.vacancyRate.toFixed(1)}%) suggests strong tenant demand for ${input.bedrooms}-bedroom ${PROPERTY_TYPE_LABEL[input.propertyType].toLowerCase()} units.`,
    );
  } else {
    insights.push(
      `Vacancy is ${market.vacancyRate.toFixed(1)}% — budget for slightly longer leasing cycles when underwriting.`,
    );
  }

  if (market.daysOnMarket <= 12) {
    insights.push(
      `Units lease quickly here (${market.daysOnMarket} days on market on average).`,
    );
  } else {
    insights.push(
      `Average days on market is ${market.daysOnMarket} — factor in 2–4 weeks of vacancy in your cash flow model.`,
    );
  }

  if (input.condition === "needs-work" || input.condition === "fair") {
    insights.push(
      `Condition is marked "${input.condition.replace("-", " ")}" — upside exists after renovations, but model a lower starting rent of ~${formatCurrency(midRent)}.`,
    );
  } else {
    insights.push(
      `Estimated market rent for this profile is ~${formatCurrency(midRent)}/mo before HOA, taxes, and financing costs.`,
    );
  }

  return insights;
}

export function calculateRentCheck(input: RentCheckInput): RentCheckResult | null {
  const trimmed = input.addressOrZip.trim();
  if (!trimmed) return null;

  const zipCode = extractZip(trimmed) ?? DEFAULT_MARKET.zip;
  const market = resolveMarket(extractZip(trimmed));

  const mid = Math.round(
    market.baseRent2Br *
      bedroomMultiplier(input.bedrooms) *
      PROPERTY_MULTIPLIER[input.propertyType] *
      CONDITION_MULTIPLIER[input.condition],
  );

  const rentRange: RentRange = {
    low: Math.round(mid * 0.92),
    mid,
    high: Math.round(mid * 1.08),
  };

  return {
    zipCode: market.zip,
    areaLabel: market.area,
    rentRange,
    marketStats: {
      rentGrowth: market.rentGrowth,
      vacancyRate: market.vacancyRate,
      daysOnMarket: market.daysOnMarket,
    },
    comparables: buildComparables(market, input, mid),
    insights: buildInsights(market, input, mid),
  };
}

export const DEFAULT_RENT_INPUT: RentCheckInput = {
  addressOrZip: "",
  bedrooms: 2,
  propertyType: "condo",
  condition: "good",
};

export { PROPERTY_TYPE_LABEL };
