import type { Listing } from "./listings";

export const SAMPLE_DC_METRO_LISTINGS: Listing[] = [
  {
    propertyId: "sample-landover-1",
    address: "6721 Kanawha St",
    city: "Landover",
    state: "MD",
    zipCode: "20785",
    listPrice: 289000,
    beds: 3,
    baths: 2,
    sqft: 1240,
    propertyType: "townhouse",
    daysOnMarket: 12,
    hoaFee: 85,
    taxAmount: 3180,
  },
  {
    propertyId: "sample-landover-2",
    address: "5402 Belle Pre Way",
    city: "Landover",
    state: "MD",
    zipCode: "20785",
    listPrice: 315000,
    beds: 4,
    baths: 2.5,
    sqft: 1580,
    propertyType: "single_family",
    daysOnMarket: 8,
    hoaFee: null,
    taxAmount: 3465,
  },
  {
    propertyId: "sample-hyattsville-1",
    address: "4312 Nicholson St",
    city: "Hyattsville",
    state: "MD",
    zipCode: "20782",
    listPrice: 365000,
    beds: 3,
    baths: 2,
    sqft: 1320,
    propertyType: "townhouse",
    daysOnMarket: 15,
    hoaFee: 120,
    taxAmount: 4015,
  },
  {
    propertyId: "sample-hyattsville-2",
    address: "6200 Adelphi Rd",
    city: "Hyattsville",
    state: "MD",
    zipCode: "20783",
    listPrice: 339000,
    beds: 3,
    baths: 1.5,
    sqft: 1180,
    propertyType: "single_family",
    daysOnMarket: 21,
    hoaFee: null,
    taxAmount: 3729,
  },
  {
    propertyId: "sample-silver-spring-1",
    address: "812 Fenton St",
    city: "Silver Spring",
    state: "MD",
    zipCode: "20910",
    listPrice: 425000,
    beds: 2,
    baths: 2,
    sqft: 980,
    propertyType: "condo",
    daysOnMarket: 9,
    hoaFee: 285,
    taxAmount: 4675,
  },
  {
    propertyId: "sample-silver-spring-2",
    address: "1204 East West Hwy",
    city: "Silver Spring",
    state: "MD",
    zipCode: "20901",
    listPrice: 459000,
    beds: 3,
    baths: 2.5,
    sqft: 1450,
    propertyType: "townhouse",
    daysOnMarket: 11,
    hoaFee: 175,
    taxAmount: 5049,
  },
  {
    propertyId: "sample-capitol-heights-1",
    address: "801 Brooks Dr",
    city: "Capitol Heights",
    state: "MD",
    zipCode: "20743",
    listPrice: 275000,
    beds: 3,
    baths: 2,
    sqft: 1160,
    propertyType: "single_family",
    daysOnMarket: 18,
    hoaFee: null,
    taxAmount: 3025,
  },
  {
    propertyId: "sample-bowie-1",
    address: "15402 Pointer Ridge Dr",
    city: "Bowie",
    state: "MD",
    zipCode: "20715",
    listPrice: 485000,
    beds: 4,
    baths: 3,
    sqft: 2100,
    propertyType: "single_family",
    daysOnMarket: 14,
    hoaFee: 65,
    taxAmount: 5335,
  },
];

export function filterSampleListings(options: {
  zipCode?: string | null;
  minBeds?: number | null;
  maxPrice?: number | null;
  propertyType?: string | null;
}): Listing[] {
  return SAMPLE_DC_METRO_LISTINGS.filter((listing) => {
    if (options.zipCode && listing.zipCode !== options.zipCode) {
      const cityMatch = listing.city
        .toLowerCase()
        .includes(options.zipCode.toLowerCase());
      if (!cityMatch) return false;
    }
    if (options.minBeds != null && listing.beds < options.minBeds) return false;
    if (options.maxPrice != null && listing.listPrice > options.maxPrice) {
      return false;
    }
    if (options.propertyType) {
      const normalized = options.propertyType.toLowerCase().replace(/_/g, "-");
      const listingType = listing.propertyType.toLowerCase().replace(/_/g, "-");
      if (listingType !== normalized && !listingType.includes(normalized)) {
        return false;
      }
    }
    return true;
  });
}
