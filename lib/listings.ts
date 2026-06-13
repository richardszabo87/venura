export type Listing = {
  propertyId: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  listPrice: number;
  beds: number;
  baths: number;
  sqft: number;
  propertyType: string;
  daysOnMarket: number;
  hoaFee: number | null;
  taxAmount: number | null;
};

export type ListingsQuery = {
  zipCode?: string | null;
  minBeds?: number | null;
  maxPrice?: number | null;
  propertyType?: string | null;
};

const RAPIDAPI_HOST = "realty-in-us.p.rapidapi.com";

type RapidLocation = {
  city?: string;
  state_code?: string;
  postal_code?: string;
};

function readNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function readString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function formatAddressLine(location: Record<string, unknown> | undefined): string {
  if (!location) return "Address unavailable";

  const address = location.address;
  if (typeof address === "string" && address.trim()) return address.trim();

  if (address && typeof address === "object") {
    const addr = address as Record<string, unknown>;
    const line = readString(addr.line) ?? readString(addr.street_name);
    if (line) return line;
  }

  return readString(location.address_line) ?? "Address unavailable";
}

function parseListingResult(raw: unknown): Listing | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;

  const propertyId =
    readString(item.property_id) ??
    readString(item.propertyId) ??
    readString(item.listing_id);
  if (!propertyId) return null;

  const description =
    item.description && typeof item.description === "object"
      ? (item.description as Record<string, unknown>)
      : {};

  const location =
    item.location && typeof item.location === "object"
      ? (item.location as Record<string, unknown>)
      : {};

  const addressObj =
    location.address && typeof location.address === "object"
      ? (location.address as Record<string, unknown>)
      : location;

  const listPrice =
    readNumber(item.list_price) ??
    readNumber(item.listPrice) ??
    readNumber(item.price) ??
    0;

  const beds =
    readNumber(description.beds) ??
    readNumber(description.bed) ??
    readNumber(item.beds) ??
    0;

  const baths =
    readNumber(description.baths) ??
    readNumber(description.bath) ??
    readNumber(item.baths) ??
    0;

  const sqft =
    readNumber(description.sqft) ??
    readNumber(description.lot_sqft) ??
    readNumber(item.sqft) ??
    0;

  const propertyType =
    readString(description.type) ??
    readString(description.prop_type) ??
    readString(item.prop_type) ??
    readString(item.property_type) ??
    "unknown";

  const daysOnMarket =
    readNumber(item.days_on_market) ??
    readNumber(description.days_on_market) ??
    readNumber(item.dom) ??
    0;

  const hoaFee =
    readNumber(item.hoa_fee) ??
    readNumber(description.hoa_fee) ??
    readNumber(item.monthly_hoa_fee) ??
    null;

  const taxAmount =
    readNumber(item.tax_amount) ??
    readNumber(description.tax_amount) ??
    readNumber(item.property_tax) ??
    null;

  const city =
    readString(addressObj.city) ??
    readString(location.city) ??
    "";

  const state =
    readString(addressObj.state_code) ??
    readString(addressObj.state) ??
    readString(location.state_code) ??
    "";

  const zipCode =
    readString(addressObj.postal_code) ??
    readString(location.postal_code) ??
    "";

  return {
    propertyId,
    address: formatAddressLine(location),
    city,
    state,
    zipCode,
    listPrice,
    beds,
    baths,
    sqft,
    propertyType,
    daysOnMarket,
    hoaFee,
    taxAmount,
  };
}

export function parseListingsResponse(payload: unknown): Listing[] {
  if (!payload || typeof payload !== "object") return [];

  const root = payload as Record<string, unknown>;
  const data = root.data && typeof root.data === "object" ? root.data : root;

  const candidates: unknown[] = [];

  if (Array.isArray(data)) {
    candidates.push(...data);
  } else if (data && typeof data === "object") {
    const dataObj = data as Record<string, unknown>;
    const homeSearch = dataObj.home_search;
    if (homeSearch && typeof homeSearch === "object") {
      const results = (homeSearch as Record<string, unknown>).results;
      if (Array.isArray(results)) candidates.push(...results);
    }

    if (Array.isArray(dataObj.results)) candidates.push(...dataObj.results);
    if (Array.isArray(dataObj.properties)) candidates.push(...dataObj.properties);
  }

  if (Array.isArray(root.results)) candidates.push(...root.results);
  if (Array.isArray(root.properties)) candidates.push(...root.properties);

  return candidates
    .map(parseListingResult)
    .filter((listing): listing is Listing => listing != null && listing.listPrice > 0);
}

async function rapidFetch(path: string, init?: RequestInit): Promise<Response> {
  const apiKey = process.env.RAPIDAPI_KEY?.trim();
  if (!apiKey) {
    throw new Error("RAPIDAPI_KEY is not configured");
  }

  return fetch(`https://${RAPIDAPI_HOST}${path}`, {
    ...init,
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": RAPIDAPI_HOST,
      ...(init?.headers ?? {}),
    },
    signal: AbortSignal.timeout(12000),
  });
}

export async function resolveLocationQuery(
  query: string,
): Promise<RapidLocation | null> {
  const trimmed = query.trim();
  if (!trimmed) return null;

  if (/^\d{5}$/.test(trimmed)) {
    return { postal_code: trimmed };
  }

  const response = await rapidFetch(
    `/locations/v2/auto-complete?input=${encodeURIComponent(trimmed)}&limit=1`,
  );

  if (!response.ok) return null;

  const payload = (await response.json()) as Record<string, unknown>;
  const autocomplete =
    payload.autocomplete ??
    payload.data ??
    payload.results ??
    payload;

  const first = Array.isArray(autocomplete) ? autocomplete[0] : null;
  if (!first || typeof first !== "object") return null;

  const entry = first as Record<string, unknown>;
  const city = readString(entry.city) ?? readString(entry.name);
  const state_code =
    readString(entry.state_code) ?? readString(entry.state);
  const postal_code = readString(entry.postal_code) ?? readString(entry.zip);

  if (postal_code) return { postal_code };
  if (city && state_code) return { city, state_code };
  return null;
}

export async function fetchListingsFromRapidApi(
  query: ListingsQuery & { locationQuery?: string | null },
): Promise<Listing[]> {
  const body: Record<string, unknown> = {
    status_type: "ForSale",
    sort: "newest",
    limit: 20,
  };

  if (query.minBeds != null && query.minBeds > 0) {
    body.beds_min = query.minBeds;
  }
  if (query.maxPrice != null && query.maxPrice > 0) {
    body.price_max = query.maxPrice;
  }
  if (query.propertyType) {
    body.prop_type = query.propertyType;
  }

  const locationInput = query.locationQuery?.trim() ?? query.zipCode?.trim() ?? "";
  if (locationInput) {
    const location = await resolveLocationQuery(locationInput);
    if (location?.postal_code) {
      body.postal_code = location.postal_code;
    } else if (location?.city && location.state_code) {
      body.city = location.city;
      body.state_code = location.state_code;
    } else if (/^\d{5}$/.test(locationInput)) {
      body.postal_code = locationInput;
    } else {
      body.city = locationInput;
      body.state_code = "MD";
    }
  }

  const response = await rapidFetch("/properties/v3/list", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      text || `Listings API returned ${response.status}`,
    );
  }

  const payload = await response.json();
  return parseListingsResponse(payload);
}
