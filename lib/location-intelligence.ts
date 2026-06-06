export type SchoolDistrictData = {
  districtName: string;
  overallScore: number;
  elementary: number;
  middle: number;
  high: number;
  summary: string;
};

export type CrimeRateData = {
  score: number;
  level: "Very Safe" | "Safe" | "Moderate" | "Elevated" | "High";
  trend: "Improving" | "Stable" | "Worsening";
  topCrimes: string[];
  insight: string;
};

export type LocationIntelligenceResult = {
  school: SchoolDistrictData;
  crime: CrimeRateData;
};

type ZipSchoolEntry = SchoolDistrictData & { exact?: string };
type ZipCrimeEntry = CrimeRateData & { exact?: string };

const ZIP_SCHOOL_DATA: ZipSchoolEntry[] = [
  {
    exact: "20785",
    districtName: "Prince George's County Public Schools",
    overallScore: 5.2,
    elementary: 6,
    middle: 5,
    high: 4,
    summary: "Below state average — neutral for investors",
  },
  {
    exact: "22201",
    districtName: "Arlington Public Schools",
    overallScore: 9.1,
    elementary: 9,
    middle: 9,
    high: 9,
    summary: "Top-rated district — adds 10-15% premium to home values",
  },
  {
    exact: "20901",
    districtName: "Montgomery County Public Schools",
    overallScore: 7.8,
    elementary: 8,
    middle: 7,
    high: 8,
    summary: "Above average — strong family rental demand",
  },
];

const ZIP_SCHOOL_RANGES: Array<{
  start: number;
  end: number;
  data: SchoolDistrictData;
}> = [
  {
    start: 21201,
    end: 21299,
    data: {
      districtName: "Baltimore City Public Schools",
      overallScore: 4.4,
      elementary: 5,
      middle: 4,
      high: 4,
      summary: "Below average — investor-friendly pricing opportunity",
    },
  },
  {
    start: 30300,
    end: 30399,
    data: {
      districtName: "Atlanta Public Schools",
      overallScore: 6.1,
      elementary: 7,
      middle: 6,
      high: 6,
      summary: "Average — research individual schools before buying",
    },
  },
  {
    start: 10000,
    end: 10299,
    data: {
      districtName: "New York City Public Schools",
      overallScore: 7.4,
      elementary: 8,
      middle: 7,
      high: 7,
      summary: "Highly variable by zone — specific address matters significantly",
    },
  },
  {
    start: 77000,
    end: 77099,
    data: {
      districtName: "Houston Independent School District",
      overallScore: 5.8,
      elementary: 6,
      middle: 6,
      high: 6,
      summary: "Below state average — strong investor market despite school ratings",
    },
  },
];

const DEFAULT_SCHOOL: SchoolDistrictData = {
  districtName: "Local School District",
  overallScore: 6.0,
  elementary: 6,
  middle: 6,
  high: 6,
  summary: "Research local schools before buying",
};

const ZIP_CRIME_DATA: ZipCrimeEntry[] = [
  {
    exact: "20785",
    score: 42,
    level: "Moderate",
    trend: "Improving",
    topCrimes: ["Property theft", "Vehicle theft", "Vandalism"],
    insight:
      "Improving trend — vacancy risk moderate, factor higher insurance costs",
  },
  {
    exact: "22201",
    score: 81,
    level: "Safe",
    trend: "Stable",
    topCrimes: ["Petty theft", "Package theft"],
    insight: "Low crime supports premium rents and strong tenant quality",
  },
  {
    exact: "20901",
    score: 72,
    level: "Safe",
    trend: "Stable",
    topCrimes: ["Property theft", "Fraud"],
    insight: "Safe neighborhood — strong family rental demand",
  },
];

const ZIP_CRIME_RANGES: Array<{
  start: number;
  end: number;
  data: CrimeRateData;
}> = [
  {
    start: 21201,
    end: 21299,
    data: {
      score: 34,
      level: "Elevated",
      trend: "Stable",
      topCrimes: ["Property crime", "Vehicle theft", "Assault"],
      insight:
        "Research specific streets — crime varies significantly by block in Baltimore",
    },
  },
  {
    start: 30300,
    end: 30399,
    data: {
      score: 55,
      level: "Moderate",
      trend: "Improving",
      topCrimes: ["Property theft", "Vehicle theft"],
      insight:
        "Improving trend — gentrifying neighborhoods showing positive momentum",
    },
  },
  {
    start: 10000,
    end: 10299,
    data: {
      score: 68,
      level: "Safe",
      trend: "Stable",
      topCrimes: ["Petty theft", "Package theft", "Fraud"],
      insight: "Urban density means petty theft common but violent crime low",
    },
  },
  {
    start: 77000,
    end: 77099,
    data: {
      score: 51,
      level: "Moderate",
      trend: "Stable",
      topCrimes: ["Property theft", "Vehicle theft", "Catalytic converter theft"],
      insight:
        "Car-dependent market — vehicle theft elevated, factor comprehensive insurance",
    },
  },
];

const DEFAULT_CRIME: CrimeRateData = {
  score: 60,
  level: "Moderate",
  trend: "Stable",
  topCrimes: ["Property theft"],
  insight: "Research local crime reports before finalizing purchase decision",
};

export function extractZipCode(address: string): string | null {
  const match = address.match(/\b(\d{5})\b/);
  return match?.[1] ?? null;
}

function zipInRange(zip: string, start: number, end: number): boolean {
  const numeric = Number.parseInt(zip, 10);
  return Number.isFinite(numeric) && numeric >= start && numeric <= end;
}

export function getStaticSchoolDistrict(zipCode: string): SchoolDistrictData {
  const exact = ZIP_SCHOOL_DATA.find((entry) => entry.exact === zipCode);
  if (exact) {
    const { exact: _exact, ...data } = exact;
    return data;
  }

  for (const range of ZIP_SCHOOL_RANGES) {
    if (zipInRange(zipCode, range.start, range.end)) {
      return range.data;
    }
  }

  return DEFAULT_SCHOOL;
}

export function getStaticCrimeRate(zipCode: string): CrimeRateData {
  const exact = ZIP_CRIME_DATA.find((entry) => entry.exact === zipCode);
  if (exact) {
    const { exact: _exact, ...data } = exact;
    return data;
  }

  for (const range of ZIP_CRIME_RANGES) {
    if (zipInRange(zipCode, range.start, range.end)) {
      return range.data;
    }
  }

  return DEFAULT_CRIME;
}

export function getSchoolScoreBadgeClass(score: number): string {
  if (score >= 8) return "bg-emerald-500/20 text-emerald-200 border-emerald-400/40";
  if (score >= 5) return "bg-amber-500/20 text-amber-200 border-amber-400/40";
  return "bg-red-500/20 text-red-200 border-red-400/40";
}

export function getCrimeLevelFromScore(
  score: number,
): CrimeRateData["level"] {
  if (score >= 85) return "Very Safe";
  if (score >= 70) return "Safe";
  if (score >= 50) return "Moderate";
  if (score >= 30) return "Elevated";
  return "High";
}

export function getTrendStyle(trend: CrimeRateData["trend"]): {
  label: string;
  className: string;
} {
  switch (trend) {
    case "Improving":
      return { label: "Improving ↓", className: "text-emerald-300" };
    case "Worsening":
      return { label: "Worsening ↑", className: "text-red-300" };
    default:
      return { label: "Stable →", className: "text-[#E8D5B7]/80" };
  }
}

type GreatSchoolsDistrictResponse = {
  districts?: Array<{
    name?: string;
    rating?: number;
    schools?: Array<{
      level?: string;
      rating?: number;
    }>;
  }>;
};

export async function fetchSchoolDistrictFromApi(
  zipCode: string,
): Promise<SchoolDistrictData | null> {
  const apiKey = process.env.GREATSCHOOLS_API_KEY?.trim();
  if (!apiKey) return null;

  try {
    const url = new URL("https://api.greatschools.org/v2/districts/nearby");
    url.searchParams.set("zip", zipCode);
    url.searchParams.set("limit", "1");

    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        "X-API-Key": apiKey,
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) return null;

    const payload = (await response.json()) as GreatSchoolsDistrictResponse;
    const district = payload.districts?.[0];
    if (!district?.name) return null;

    const schools = district.schools ?? [];
    const levelScore = (level: string) =>
      schools.find((school) => school.level === level)?.rating ?? 6;

    const elementary = levelScore("elementary");
    const middle = levelScore("middle");
    const high = levelScore("high");
    const overallScore = district.rating ?? (elementary + middle + high) / 3;

    let summary = "Research local schools before buying";
    if (overallScore >= 8) {
      summary = "Strong schools — adds 10-15% to property value";
    } else if (overallScore < 5) {
      summary =
        "Below average schools — neutral for investors, consider for families";
    }

    return {
      districtName: district.name,
      overallScore: Math.round(overallScore * 10) / 10,
      elementary,
      middle,
      high,
      summary,
    };
  } catch {
    return null;
  }
}

export async function fetchLocationIntelligence(
  zipCode: string,
): Promise<LocationIntelligenceResult> {
  const apiSchool = await fetchSchoolDistrictFromApi(zipCode);
  const school = apiSchool ?? getStaticSchoolDistrict(zipCode);
  const crime = getStaticCrimeRate(zipCode);

  return { school, crime };
}
