export type PropertyType = "condo" | "townhouse" | "co-op" | "pud";

export type LitigationStatus = "none" | "pending" | "active" | "recently-resolved";

export type HoaScoreInput = {
  buildingName: string;
  yearBuilt: number;
  currentHoaFee: number;
  hoaFee1YearAgo: number;
  hoaFee2YearsAgo: number;
  numberOfUnits: number;
  propertyType: PropertyType;
  reserveFundBalance: number;
  pendingSpecialAssessments: number;
  litigationStatus: LitigationStatus;
  expectedMonthlyRent: number;
};

export type RiskBand = "healthy" | "watch" | "high-risk";

export type RiskFactor = {
  id: string;
  label: string;
  score: number;
  maxScore: number;
  detail: string;
  status: "good" | "moderate" | "poor";
};

export type HoaDangerScoreResult = {
  score: number;
  band: RiskBand;
  bandLabel: string;
  summary: string;
  factors: RiskFactor[];
};

const PROPERTY_TYPE_RESERVE_MULTIPLIER: Record<PropertyType, number> = {
  condo: 1.2,
  "co-op": 1.25,
  townhouse: 0.9,
  pud: 1.0,
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function factorStatus(score: number, maxScore: number): RiskFactor["status"] {
  const ratio = score / maxScore;
  if (ratio >= 0.75) return "good";
  if (ratio >= 0.45) return "moderate";
  return "poor";
}

function scoreFeeIncreases(input: HoaScoreInput): RiskFactor {
  const maxScore = 20;
  const increases: number[] = [];

  if (input.hoaFee1YearAgo > 0) {
    increases.push(
      ((input.currentHoaFee - input.hoaFee1YearAgo) / input.hoaFee1YearAgo) * 100,
    );
  }
  if (input.hoaFee2YearsAgo > 0) {
    increases.push(
      ((input.hoaFee1YearAgo - input.hoaFee2YearsAgo) / input.hoaFee2YearsAgo) *
        100,
    );
  }

  const avgIncrease =
    increases.length > 0
      ? increases.reduce((sum, value) => sum + value, 0) / increases.length
      : 0;

  let score = 0;
  if (avgIncrease <= 3) score = 20;
  else if (avgIncrease <= 5) score = 17;
  else if (avgIncrease <= 8) score = 14;
  else if (avgIncrease <= 12) score = 10;
  else if (avgIncrease <= 18) score = 5;

  return {
    id: "fee-increases",
    label: "Fee increase rate",
    score,
    maxScore,
    detail:
      increases.length > 0
        ? `Average annual HOA increase of ${avgIncrease.toFixed(1)}% over the last two years.`
        : "Not enough historical fee data to calculate increase trend.",
    status: factorStatus(score, maxScore),
  };
}

function scoreReserveAdequacy(input: HoaScoreInput): RiskFactor {
  const maxScore = 20;
  const buildingAge = Math.max(new Date().getFullYear() - input.yearBuilt, 0);
  const perUnitTarget =
    (2500 + Math.min(buildingAge * 100, 3000)) *
    PROPERTY_TYPE_RESERVE_MULTIPLIER[input.propertyType];
  const expectedReserve = input.numberOfUnits * perUnitTarget;
  const ratio =
    expectedReserve > 0 ? input.reserveFundBalance / expectedReserve : 0;

  let score = 0;
  if (ratio >= 1.2) score = 20;
  else if (ratio >= 1) score = 17;
  else if (ratio >= 0.75) score = 13;
  else if (ratio >= 0.5) score = 8;
  else if (ratio >= 0.25) score = 4;

  return {
    id: "reserve-fund",
    label: "Reserve fund adequacy",
    score,
    maxScore,
    detail: `Reserve fund is ${Math.round(ratio * 100)}% of the recommended level for a ${buildingAge}-year-old ${input.propertyType.replace("-", " ")} building.`,
    status: factorStatus(score, maxScore),
  };
}

function scoreSpecialAssessments(input: HoaScoreInput): RiskFactor {
  const maxScore = 15;
  const perUnit =
    input.numberOfUnits > 0
      ? input.pendingSpecialAssessments / input.numberOfUnits
      : input.pendingSpecialAssessments;

  let score = 0;
  if (perUnit <= 0) score = 15;
  else if (perUnit <= 1000) score = 12;
  else if (perUnit <= 3000) score = 8;
  else if (perUnit <= 7500) score = 4;

  return {
    id: "special-assessments",
    label: "Pending special assessments",
    score,
    maxScore,
    detail:
      perUnit <= 0
        ? "No pending special assessments reported."
        : `$${Math.round(perUnit).toLocaleString()} pending per unit in special assessments.`,
    status: factorStatus(score, maxScore),
  };
}

function scoreHoaVsRent(input: HoaScoreInput): RiskFactor {
  const maxScore = 20;
  const ratio =
    input.expectedMonthlyRent > 0
      ? (input.currentHoaFee / input.expectedMonthlyRent) * 100
      : 100;

  let score = 0;
  if (ratio < 12) score = 20;
  else if (ratio < 18) score = 17;
  else if (ratio < 25) score = 13;
  else if (ratio < 35) score = 8;
  else if (ratio < 45) score = 4;

  return {
    id: "hoa-vs-rent",
    label: "HOA as % of rent",
    score,
    maxScore,
    detail: `HOA fees consume ${ratio.toFixed(1)}% of expected monthly rent.`,
    status: factorStatus(score, maxScore),
  };
}

function scoreBuildingAge(input: HoaScoreInput): RiskFactor {
  const maxScore = 15;
  const buildingAge = Math.max(new Date().getFullYear() - input.yearBuilt, 0);

  let score = 0;
  if (buildingAge <= 10) score = 15;
  else if (buildingAge <= 20) score = 12;
  else if (buildingAge <= 30) score = 9;
  else if (buildingAge <= 40) score = 5;
  else score = 2;

  return {
    id: "building-age",
    label: "Building age risk",
    score,
    maxScore,
    detail: `Building is ${buildingAge} years old, which affects maintenance and reserve pressure.`,
    status: factorStatus(score, maxScore),
  };
}

function scoreLitigation(input: HoaScoreInput): RiskFactor {
  const maxScore = 10;
  const scores: Record<LitigationStatus, number> = {
    none: 10,
    "recently-resolved": 7,
    pending: 4,
    active: 0,
  };

  const labels: Record<LitigationStatus, string> = {
    none: "No known litigation.",
    "recently-resolved": "Recently resolved litigation may still affect reserves.",
    pending: "Pending litigation creates uncertainty for future assessments.",
    active: "Active litigation is a major financial and operational risk.",
  };

  const score = scores[input.litigationStatus];

  return {
    id: "litigation",
    label: "Litigation status",
    score,
    maxScore,
    detail: labels[input.litigationStatus],
    status: factorStatus(score, maxScore),
  };
}

function getBand(score: number): { band: RiskBand; bandLabel: string; summary: string } {
  if (score >= 75) {
    return {
      band: "healthy",
      bandLabel: "Healthy",
      summary:
        "This HOA profile shows manageable fee growth, adequate reserves, and limited near-term risk flags.",
    };
  }

  if (score >= 50) {
    return {
      band: "watch",
      bandLabel: "Watch",
      summary:
        "Some risk factors need attention. Review reserve trends, fee increases, and assessment exposure before buying.",
    };
  }

  return {
    band: "high-risk",
    bandLabel: "High Risk",
    summary:
      "Multiple red flags suggest elevated HOA risk. Proceed with caution and stress-test cash flow assumptions.",
  };
}

export function calculateHoaDangerScore(input: HoaScoreInput): HoaDangerScoreResult {
  const factors = [
    scoreFeeIncreases(input),
    scoreReserveAdequacy(input),
    scoreSpecialAssessments(input),
    scoreHoaVsRent(input),
    scoreBuildingAge(input),
    scoreLitigation(input),
  ];

  const score = clamp(
    Math.round(factors.reduce((sum, factor) => sum + factor.score, 0)),
    0,
    100,
  );

  const { band, bandLabel, summary } = getBand(score);

  return {
    score,
    band,
    bandLabel,
    summary,
    factors,
  };
}

export const DEFAULT_HOA_INPUT: HoaScoreInput = {
  buildingName: "",
  yearBuilt: new Date().getFullYear() - 15,
  currentHoaFee: 0,
  hoaFee1YearAgo: 0,
  hoaFee2YearsAgo: 0,
  numberOfUnits: 0,
  propertyType: "condo",
  reserveFundBalance: 0,
  pendingSpecialAssessments: 0,
  litigationStatus: "none",
  expectedMonthlyRent: 0,
};
