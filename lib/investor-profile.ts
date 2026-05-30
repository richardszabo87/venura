import { DEFAULTS, type PropertyInputs } from "./calculator";

export type TotalBudget = "under-30k" | "30k-50k" | "50k-80k" | "80k-plus";

export type CashFlowTarget = "break-even" | "100-200" | "200-400" | "400-plus";

export type HoaComfort =
  | "fine-under-200"
  | "nervous-above-250"
  | "no-hoa"
  | "not-sure";

export type PropertyType =
  | "townhouse"
  | "single-family"
  | "condo"
  | "multi-family";

export type FinancingPlan =
  | "home-equity"
  | "conventional"
  | "all-cash"
  | "still-deciding";

export type ManagementStyle = "hire-manager" | "semi-involved" | "self-manage";

export type PrimaryGoal =
  | "monthly-income"
  | "long-term-wealth"
  | "both"
  | "learning";

export type QuizAnswers = {
  budget: TotalBudget;
  cashFlow: CashFlowTarget;
  hoa: HoaComfort;
  propertyType: PropertyType;
  financing: FinancingPlan;
  management: ManagementStyle;
  goal: PrimaryGoal;
};

export type MarketRecommendation = {
  rank: number;
  name: string;
  neighborhoods: string;
  reason: string;
  zipCodes: string[];
};

export type InvestorProfile = {
  version: 2;
  completedAt: string;
  email?: string;
  answers: QuizAnswers;
  investorTypeLabel: string;
  summary: string;
  marketRecommendations: MarketRecommendation[];
  maxPurchasePrice: number | null;
  minMonthlyCashFlow: number | null;
  maxHoa: number | null;
  targetZipCodes: string[];
  downPaymentPercent: number;
  interestRate: number;
  loanTerm: number;
  propertyType: PropertyType;
  goal: PrimaryGoal;
};

const STORAGE_KEY = "venura:investorProfile";

const BUDGET_PURCHASE_PRICE: Record<TotalBudget, number> = {
  "under-30k": 175_000,
  "30k-50k": 250_000,
  "50k-80k": 375_000,
  "80k-plus": 525_000,
};

const CASH_FLOW_MIN: Record<CashFlowTarget, number> = {
  "break-even": 0,
  "100-200": 100,
  "200-400": 200,
  "400-plus": 400,
};

const HOA_MAX: Record<HoaComfort, number> = {
  "fine-under-200": 200,
  "nervous-above-250": 250,
  "no-hoa": 0,
  "not-sure": 300,
};

const DOWN_PAYMENT_PERCENT: Record<FinancingPlan, number> = {
  "home-equity": 20,
  conventional: 20,
  "all-cash": 100,
  "still-deciding": DEFAULTS.downPaymentPercent,
};

type MetroMarket = {
  id: string;
  name: string;
  neighborhoods: string;
  zipCodes: string[];
  score: (answers: QuizAnswers) => number;
  reason: (answers: QuizAnswers) => string;
};

const METRO_MARKETS: MetroMarket[] = [
  {
    id: "prince-georges",
    name: "Prince George's County, MD",
    neighborhoods: "Hyattsville, Landover, Laurel, Bowie",
    zipCodes: ["20782", "20785", "20707", "20715"],
    score: (answers) => {
      let score = 0;
      if (answers.budget === "under-30k" || answers.budget === "30k-50k") score += 3;
      if (answers.cashFlow === "200-400" || answers.cashFlow === "400-plus") score += 2;
      if (answers.propertyType === "townhouse" || answers.propertyType === "single-family")
        score += 2;
      if (answers.hoa === "no-hoa" || answers.hoa === "nervous-above-250") score += 2;
      if (answers.goal === "monthly-income" || answers.goal === "both") score += 1;
      return score;
    },
    reason: (answers) =>
      answers.budget === "under-30k" || answers.budget === "30k-50k"
        ? "Strong entry prices and townhome inventory for first-time investors targeting cash flow."
        : "Affordable single-family and townhouse rentals with lower HOA exposure than inner suburbs.",
  },
  {
    id: "montgomery",
    name: "Montgomery County, MD",
    neighborhoods: "Silver Spring, Wheaton, Rockville, Gaithersburg",
    zipCodes: ["20901", "20902", "20850", "20877"],
    score: (answers) => {
      let score = 0;
      if (answers.budget === "50k-80k" || answers.budget === "80k-plus") score += 2;
      if (answers.cashFlow === "100-200" || answers.cashFlow === "break-even") score += 2;
      if (answers.propertyType === "condo" || answers.propertyType === "townhouse") score += 2;
      if (answers.goal === "long-term-wealth" || answers.goal === "both") score += 2;
      if (answers.management === "hire-manager") score += 1;
      return score;
    },
    reason: (answers) =>
      answers.goal === "long-term-wealth"
        ? "Stable appreciation markets with strong tenant demand near Metro corridors."
        : "Balanced rent growth and resale depth across Silver Spring and Rockville corridors.",
  },
  {
    id: "dc",
    name: "Washington, DC",
    neighborhoods: "Petworth, Congress Heights, Deanwood, Trinidad",
    zipCodes: ["20011", "20019", "20002", "20018"],
    score: (answers) => {
      let score = 0;
      if (answers.budget === "80k-plus") score += 3;
      if (answers.goal === "long-term-wealth" || answers.goal === "both") score += 2;
      if (answers.cashFlow === "break-even" || answers.cashFlow === "100-200") score += 1;
      if (answers.propertyType === "multi-family" || answers.propertyType === "single-family")
        score += 2;
      if (answers.financing === "conventional" || answers.financing === "home-equity") score += 1;
      return score;
    },
    reason: (answers) =>
      answers.propertyType === "multi-family"
        ? "Small multi-family inventory supports long-term wealth building in appreciating neighborhoods."
        : "DC rowhouses and duplex pockets reward patient investors focused on equity growth.",
  },
  {
    id: "nova",
    name: "Northern Virginia",
    neighborhoods: "Manassas, Woodbridge, Springfield, Alexandria",
    zipCodes: ["20109", "22191", "22150", "22304"],
    score: (answers) => {
      let score = 0;
      if (answers.budget === "50k-80k" || answers.budget === "80k-plus") score += 2;
      if (answers.goal === "long-term-wealth" || answers.goal === "both") score += 2;
      if (answers.propertyType === "single-family" || answers.propertyType === "townhouse")
        score += 2;
      if (answers.management === "hire-manager" || answers.management === "semi-involved")
        score += 1;
      if (answers.financing === "conventional") score += 1;
      return score;
    },
    reason: (answers) =>
      answers.management === "hire-manager"
        ? "Mature property management market supports hands-off investors in commuter suburbs."
        : "Strong job growth and family rental demand across Fairfax and Prince William corridors.",
  },
  {
    id: "southern-md",
    name: "Southern Maryland",
    neighborhoods: "Waldorf, La Plata, Indian Head, Brandywine",
    zipCodes: ["20601", "20646", "20640", "20613"],
    score: (answers) => {
      let score = 0;
      if (answers.budget === "under-30k" || answers.budget === "30k-50k") score += 2;
      if (answers.cashFlow === "200-400" || answers.cashFlow === "400-plus") score += 3;
      if (answers.hoa === "no-hoa") score += 2;
      if (answers.propertyType === "single-family") score += 2;
      if (answers.management === "self-manage") score += 1;
      return score;
    },
    reason: (answers) =>
      answers.cashFlow === "400-plus"
        ? "Lower basis prices can support stronger monthly cash flow for self-managing investors."
        : "Fee-simple single-family homes with minimal HOA friction for budget-conscious buyers.",
  },
];

export type QuizQuestion = {
  id: keyof QuizAnswers;
  prompt: string;
  options: { value: QuizAnswers[keyof QuizAnswers]; label: string }[];
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "budget",
    prompt: "What's your total budget?",
    options: [
      { value: "under-30k", label: "Under $30K" },
      { value: "30k-50k", label: "$30K–$50K" },
      { value: "50k-80k", label: "$50K–$80K" },
      { value: "80k-plus", label: "$80K+" },
    ],
  },
  {
    id: "cashFlow",
    prompt: "Target monthly cash flow?",
    options: [
      { value: "break-even", label: "Break even" },
      { value: "100-200", label: "+$100–$200" },
      { value: "200-400", label: "+$200–$400" },
      { value: "400-plus", label: "+$400+" },
    ],
  },
  {
    id: "hoa",
    prompt: "HOA comfort level?",
    options: [
      { value: "fine-under-200", label: "Fine under $200" },
      { value: "nervous-above-250", label: "Nervous above $250" },
      { value: "no-hoa", label: "No HOA" },
      { value: "not-sure", label: "Not sure" },
    ],
  },
  {
    id: "propertyType",
    prompt: "Property type?",
    options: [
      { value: "townhouse", label: "Townhouse" },
      { value: "single-family", label: "Single family" },
      { value: "condo", label: "Condo" },
      { value: "multi-family", label: "Multi-family" },
    ],
  },
  {
    id: "financing",
    prompt: "Financing plan?",
    options: [
      { value: "home-equity", label: "Home equity loan" },
      { value: "conventional", label: "Conventional loan" },
      { value: "all-cash", label: "All cash" },
      { value: "still-deciding", label: "Still deciding" },
    ],
  },
  {
    id: "management",
    prompt: "Management style?",
    options: [
      { value: "hire-manager", label: "Hire a manager" },
      { value: "semi-involved", label: "Semi-involved" },
      { value: "self-manage", label: "Self-manage" },
    ],
  },
  {
    id: "goal",
    prompt: "Primary goal?",
    options: [
      { value: "monthly-income", label: "Monthly income" },
      { value: "long-term-wealth", label: "Long-term wealth" },
      { value: "both", label: "Both" },
      { value: "learning", label: "Learning" },
    ],
  },
];

function deriveInvestorTypeLabel(answers: QuizAnswers): string {
  if (answers.goal === "learning") return "Learning-First Investor";

  const goalLabels: Record<Exclude<PrimaryGoal, "learning">, string> = {
    "monthly-income": "Cash-Flow",
    "long-term-wealth": "Wealth-Building",
    both: "Balanced",
  };

  const managementLabels: Record<ManagementStyle, string> = {
    "hire-manager": "Hands-Off",
    "semi-involved": "Semi-Active",
    "self-manage": "Active",
  };

  const goal = goalLabels[answers.goal];
  const management = managementLabels[answers.management];

  if (answers.cashFlow === "400-plus") {
    return `${management} Income Investor`;
  }

  return `${management} ${goal} Investor`;
}

function deriveSummary(answers: QuizAnswers, label: string): string {
  const propertyLabels: Record<PropertyType, string> = {
    townhouse: "townhouses",
    "single-family": "single-family homes",
    condo: "condos",
    "multi-family": "multi-family properties",
  };

  const goalText: Record<PrimaryGoal, string> = {
    "monthly-income": "prioritizing monthly income",
    "long-term-wealth": "focused on long-term wealth",
    both: "balancing income and appreciation",
    learning: "building knowledge before your first purchase",
  };

  return `${label} ${goalText[answers.goal]}, targeting ${propertyLabels[answers.propertyType]} in the DC metro with ${answers.cashFlow === "break-even" ? "break-even" : `$${CASH_FLOW_MIN[answers.cashFlow]}+`} monthly cash flow.`;
}

export function getMarketRecommendations(
  answers: QuizAnswers,
): MarketRecommendation[] {
  return METRO_MARKETS.map((market) => ({
    market,
    score: market.score(answers),
  }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ market }, index) => ({
      rank: index + 1,
      name: market.name,
      neighborhoods: market.neighborhoods,
      reason: market.reason(answers),
      zipCodes: market.zipCodes,
    }));
}

export function buildInvestorProfile(
  answers: QuizAnswers,
  email?: string,
): InvestorProfile {
  const investorTypeLabel = deriveInvestorTypeLabel(answers);
  const summary = deriveSummary(answers, investorTypeLabel);
  const marketRecommendations = getMarketRecommendations(answers);
  const topZips = marketRecommendations.flatMap((market) => market.zipCodes);

  return {
    version: 2,
    completedAt: new Date().toISOString(),
    email: email?.trim().toLowerCase(),
    answers,
    investorTypeLabel,
    summary,
    marketRecommendations,
    maxPurchasePrice: BUDGET_PURCHASE_PRICE[answers.budget],
    minMonthlyCashFlow: CASH_FLOW_MIN[answers.cashFlow],
    maxHoa: HOA_MAX[answers.hoa],
    targetZipCodes: [...new Set(topZips)].slice(0, 6),
    downPaymentPercent: DOWN_PAYMENT_PERCENT[answers.financing],
    interestRate: DEFAULTS.interestRate,
    loanTerm: DEFAULTS.loanTerm,
    propertyType: answers.propertyType,
    goal: answers.goal,
  };
}

export function saveInvestorProfile(profile: InvestorProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function getInvestorProfile(): InvestorProfile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as InvestorProfile;
  } catch {
    return null;
  }
}

export function getAnalyzerDefaultsFromProfile(
  profile: InvestorProfile,
): Partial<PropertyInputs> {
  const purchasePrice = profile.maxPurchasePrice ?? DEFAULTS.purchasePrice;
  const monthlyRent = Math.round(purchasePrice * 0.009);
  const hoaFee =
    profile.maxHoa === 0
      ? 0
      : profile.maxHoa != null
        ? Math.round(profile.maxHoa * 0.85)
        : profile.answers.propertyType === "condo" ||
            profile.answers.propertyType === "townhouse"
          ? 250
          : 0;
  const propertyTaxes = Math.round((purchasePrice * 0.01) / 12);

  return {
    purchasePrice,
    monthlyRent,
    hoaFee,
    propertyTaxes,
    downPaymentPercent: profile.downPaymentPercent,
    interestRate: profile.interestRate,
    insurance: 55,
    loanTerm: profile.loanTerm,
  };
}

export type DealAlertDefaults = {
  maxPrice: string;
  maxHoa: string;
  minCashFlow: string;
  zipCodes: string;
};

export function getDealAlertDefaultsFromProfile(
  profile: InvestorProfile,
): DealAlertDefaults {
  return {
    maxPrice: profile.maxPurchasePrice?.toString() ?? "",
    maxHoa: profile.maxHoa?.toString() ?? "",
    minCashFlow: profile.minMonthlyCashFlow?.toString() ?? "",
    zipCodes: profile.targetZipCodes.join(", "),
  };
}

export function getInvestorProfileSummary(profile: InvestorProfile) {
  return {
    headline: profile.investorTypeLabel,
    description: profile.summary,
    targetCashFlow:
      profile.minMonthlyCashFlow != null && profile.minMonthlyCashFlow > 0
        ? `$${profile.minMonthlyCashFlow}+/mo cash flow`
        : "Break-even cash flow",
  };
}
