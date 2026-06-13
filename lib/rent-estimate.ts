/** DC metro baseline monthly rent yield (1.1% of list price). */
export const DC_METRO_RENT_YIELD = 0.011;

/** Baseline zip for DC metro rent multiplier (Landover). */
export const DC_METRO_BASE_ZIP = "20785";

const BASE_RENT_2BR: Record<string, number> = {
  "20785": 1850,
  "20784": 1880,
  "20782": 1920,
  "20783": 1920,
  "20743": 1800,
  "20770": 1850,
  "20705": 1780,
  "20901": 2250,
  "20910": 2380,
  "20902": 2180,
  "20903": 2250,
  "20904": 2350,
  "20906": 2220,
  "20912": 2100,
  "20715": 2200,
  "20850": 2450,
  "20011": 2550,
  "20002": 2900,
  "20009": 2750,
  "22201": 2850,
  "22304": 2300,
  "22191": 2100,
};

const BEDROOM_MULTIPLIER: Record<number, number> = {
  0: 0.65,
  1: 0.78,
  2: 1,
  3: 1.32,
  4: 1.58,
  5: 1.82,
};

const PROPERTY_TYPE_MULTIPLIER: Record<string, number> = {
  condo: 1,
  townhome: 1.08,
  townhouse: 1.08,
  "single-family": 1.18,
  single_family: 1.18,
  "multi-family": 0.94,
  multi_family: 0.94,
  mobile: 0.82,
  land: 0.5,
  other: 1,
};

const DC_METRO_BASE_RENT = BASE_RENT_2BR[DC_METRO_BASE_ZIP];

export function getZipRentMultiplier(zipCode: string): number {
  const baseRent = BASE_RENT_2BR[zipCode] ?? DC_METRO_BASE_RENT;
  return baseRent / DC_METRO_BASE_RENT;
}

export function bedroomRentMultiplier(beds: number): number {
  const normalized = Math.max(0, Math.min(Math.round(beds), 5));
  return BEDROOM_MULTIPLIER[normalized] ?? 1;
}

export function propertyTypeRentMultiplier(propertyType?: string | null): number {
  if (!propertyType) return 1;
  const key = propertyType.toLowerCase().replace(/\s+/g, "-");
  return (
    PROPERTY_TYPE_MULTIPLIER[key] ??
    PROPERTY_TYPE_MULTIPLIER[propertyType.toLowerCase()] ??
    1
  );
}

export function estimateMonthlyRent(options: {
  price: number;
  zipCode: string;
  beds?: number;
  propertyType?: string | null;
}): number {
  if (options.price <= 0) return 0;

  const zipMultiplier = getZipRentMultiplier(options.zipCode);
  const bedMultiplier = bedroomRentMultiplier(options.beds ?? 2);
  const typeMultiplier = propertyTypeRentMultiplier(options.propertyType);

  return Math.round(
    options.price * DC_METRO_RENT_YIELD * zipMultiplier * bedMultiplier * typeMultiplier,
  );
}

export function extractZipFromAddress(address: string): string | null {
  const match = address.match(/\b(\d{5})\b/);
  return match?.[1] ?? null;
}
