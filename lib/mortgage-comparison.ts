import { calculateMortgagePayment } from "./calculator";
import { formatCurrency, formatPercentOneDecimal } from "./format";

export type CreditScoreRange = "excellent" | "good" | "fair" | "poor";

export type MortgageComparisonInput = {
  homePrice: number;
  annualIncome: number;
  creditScoreRange: CreditScoreRange;
  availableDownPayment: number;
  homeEquity: number;
  isVeteran: boolean;
};

export type LoanTypeId =
  | "fha"
  | "conventional-20"
  | "conventional-5"
  | "va"
  | "arm-5-1"
  | "heloc";

export type LoanOption = {
  id: LoanTypeId;
  name: string;
  shortName: string;
  eligible: boolean;
  ineligibleReason?: string;
  downPayment: number;
  downPaymentPercent: number;
  loanAmount: number;
  interestRate: number;
  monthlyPrincipalInterest: number;
  monthlyInsurance: number;
  monthlyPayment: number;
  upfrontFees: number;
  totalCost30Year: number;
  housingRatio: number;
  isWinner: boolean;
};

export type ComparisonTableRow = {
  label: string;
  values: Record<LoanTypeId, string>;
  winner?: LoanTypeId;
};

export type MortgageComparisonResult = {
  loans: LoanOption[];
  winner: LoanOption | null;
  chartData: {
    monthlyPayment: { name: string; value: number; id: LoanTypeId }[];
    totalCost: { name: string; value: number; id: LoanTypeId }[];
  };
  comparisonTable: ComparisonTableRow[];
  insights: string[];
};

export const DEFAULT_MORTGAGE_INPUT: MortgageComparisonInput = {
  homePrice: 400_000,
  annualIncome: 120_000,
  creditScoreRange: "good",
  availableDownPayment: 80_000,
  homeEquity: 100_000,
  isVeteran: false,
};

export const CREDIT_SCORE_OPTIONS: {
  value: CreditScoreRange;
  label: string;
  range: string;
}[] = [
  { value: "excellent", label: "Excellent", range: "740+" },
  { value: "good", label: "Good", range: "670–739" },
  { value: "fair", label: "Fair", range: "580–669" },
  { value: "poor", label: "Poor", range: "Below 580" },
];

const BASE_RATE = 6.75;
const LOAN_TERM = 30;
const FHA_ANNUAL_MIP_RATE = 0.0055;
const FHA_UPFRONT_MIP_RATE = 0.0175;
const PMI_ANNUAL_RATE = 0.005;
const VA_FUNDING_FEE_RATE = 0.0215;
const ARM_INITIAL_DISCOUNT = 0.75;
const ARM_RESET_PREMIUM = 1.0;
const HELOC_RATE_PREMIUM = 0.5;
const PROPERTY_TAX_RATE = 0.011;
const HOME_INSURANCE_RATE = 0.0035;

function getBaseRate(credit: CreditScoreRange): number {
  const adjustments: Record<CreditScoreRange, number> = {
    excellent: -0.25,
    good: 0,
    fair: 0.5,
    poor: 1.25,
  };
  return BASE_RATE + adjustments[credit];
}

function estimateTaxesAndInsurance(homePrice: number) {
  return {
    monthlyTax: (homePrice * PROPERTY_TAX_RATE) / 12,
    monthlyInsurance: (homePrice * HOME_INSURANCE_RATE) / 12,
  };
}

function calculateArmTotalCost(
  loanAmount: number,
  initialRate: number,
  resetRate: number,
): { monthlyInitial: number; monthlyReset: number; totalCost: number } {
  const monthlyInitial = calculateMortgagePayment(
    loanAmount,
    initialRate,
    LOAN_TERM,
  );
  const monthlyReset = calculateMortgagePayment(
    loanAmount,
    resetRate,
    LOAN_TERM - 5,
  );
  const totalCost = monthlyInitial * 60 + monthlyReset * 300;
  return { monthlyInitial, monthlyReset, totalCost };
}

function buildLoanOption(
  partial: Omit<LoanOption, "isWinner" | "housingRatio"> & {
    monthlyTax: number;
    monthlyHomeInsurance: number;
  },
): LoanOption {
  const { monthlyTax: _tax, monthlyHomeInsurance: _ins, ...loan } = partial;
  return {
    ...loan,
    housingRatio: 0,
    isWinner: false,
  };
}

function withHousingRatio(
  loan: LoanOption,
  annualIncome: number,
): LoanOption {
  if (!loan.eligible || annualIncome <= 0) {
    return { ...loan, housingRatio: 0 };
  }
  return {
    ...loan,
    housingRatio: (loan.monthlyPayment / (annualIncome / 12)) * 100,
  };
}

function calculateFha(
  input: MortgageComparisonInput,
  baseRate: number,
  taxes: ReturnType<typeof estimateTaxesAndInsurance>,
): LoanOption {
  const requiredDown = input.homePrice * 0.035;
  const downPayment = Math.min(input.availableDownPayment, requiredDown);
  const eligible =
    input.availableDownPayment >= requiredDown && input.creditScoreRange !== "poor";

  if (!eligible) {
    return buildLoanOption({
      id: "fha",
      name: "FHA Loan",
      shortName: "FHA",
      eligible: false,
      ineligibleReason:
        input.creditScoreRange === "poor"
          ? "Credit below FHA minimum (580)"
          : `Needs at least ${formatCurrency(requiredDown)} down (3.5%)`,
      downPayment: 0,
      downPaymentPercent: 0,
      loanAmount: 0,
      interestRate: baseRate + 0.25,
      monthlyPrincipalInterest: 0,
      monthlyInsurance: 0,
      monthlyPayment: 0,
      upfrontFees: 0,
      totalCost30Year: 0,
      monthlyTax: taxes.monthlyTax,
      monthlyHomeInsurance: taxes.monthlyInsurance,
    });
  }

  const baseLoan = input.homePrice - downPayment;
  const upfrontMip = baseLoan * FHA_UPFRONT_MIP_RATE;
  const loanAmount = baseLoan + upfrontMip;
  const interestRate = baseRate + 0.25;
  const monthlyPI = calculateMortgagePayment(loanAmount, interestRate, LOAN_TERM);
  const monthlyMip = (loanAmount * FHA_ANNUAL_MIP_RATE) / 12;
  const monthlyPayment =
    monthlyPI + monthlyMip + taxes.monthlyTax + taxes.monthlyInsurance;
  const totalCost30Year = monthlyPayment * 360 + downPayment;

  return buildLoanOption({
    id: "fha",
    name: "FHA Loan",
    shortName: "FHA",
    eligible: true,
    downPayment,
    downPaymentPercent: (downPayment / input.homePrice) * 100,
    loanAmount,
    interestRate,
    monthlyPrincipalInterest: monthlyPI,
    monthlyInsurance: monthlyMip,
    monthlyPayment,
    upfrontFees: upfrontMip,
    totalCost30Year,
    monthlyTax: taxes.monthlyTax,
    monthlyHomeInsurance: taxes.monthlyInsurance,
  });
}

function calculateConventional20(
  input: MortgageComparisonInput,
  baseRate: number,
  taxes: ReturnType<typeof estimateTaxesAndInsurance>,
): LoanOption {
  const requiredDown = input.homePrice * 0.2;
  const eligible = input.availableDownPayment >= requiredDown;

  if (!eligible) {
    return buildLoanOption({
      id: "conventional-20",
      name: "Conventional 20%",
      shortName: "Conv 20%",
      eligible: false,
      ineligibleReason: `Needs at least ${formatCurrency(requiredDown)} down (20%)`,
      downPayment: 0,
      downPaymentPercent: 0,
      loanAmount: 0,
      interestRate: baseRate,
      monthlyPrincipalInterest: 0,
      monthlyInsurance: 0,
      monthlyPayment: 0,
      upfrontFees: 0,
      totalCost30Year: 0,
      monthlyTax: taxes.monthlyTax,
      monthlyHomeInsurance: taxes.monthlyInsurance,
    });
  }

  const downPayment = requiredDown;
  const loanAmount = input.homePrice - downPayment;
  const monthlyPI = calculateMortgagePayment(loanAmount, baseRate, LOAN_TERM);
  const monthlyPayment =
    monthlyPI + taxes.monthlyTax + taxes.monthlyInsurance;
  const totalCost30Year = monthlyPayment * 360 + downPayment;

  return buildLoanOption({
    id: "conventional-20",
    name: "Conventional 20%",
    shortName: "Conv 20%",
    eligible: true,
    downPayment,
    downPaymentPercent: 20,
    loanAmount,
    interestRate: baseRate,
    monthlyPrincipalInterest: monthlyPI,
    monthlyInsurance: 0,
    monthlyPayment,
    upfrontFees: 0,
    totalCost30Year,
    monthlyTax: taxes.monthlyTax,
    monthlyHomeInsurance: taxes.monthlyInsurance,
  });
}

function calculateConventional5(
  input: MortgageComparisonInput,
  baseRate: number,
  taxes: ReturnType<typeof estimateTaxesAndInsurance>,
): LoanOption {
  const requiredDown = input.homePrice * 0.05;
  const eligible = input.availableDownPayment >= requiredDown;

  if (!eligible) {
    return buildLoanOption({
      id: "conventional-5",
      name: "Conventional 5%",
      shortName: "Conv 5%",
      eligible: false,
      ineligibleReason: `Needs at least ${formatCurrency(requiredDown)} down (5%)`,
      downPayment: 0,
      downPaymentPercent: 0,
      loanAmount: 0,
      interestRate: baseRate + 0.125,
      monthlyPrincipalInterest: 0,
      monthlyInsurance: 0,
      monthlyPayment: 0,
      upfrontFees: 0,
      totalCost30Year: 0,
      monthlyTax: taxes.monthlyTax,
      monthlyHomeInsurance: taxes.monthlyInsurance,
    });
  }

  const downPayment = Math.min(input.availableDownPayment, requiredDown);
  const loanAmount = input.homePrice - downPayment;
  const interestRate = baseRate + 0.125;
  const monthlyPI = calculateMortgagePayment(loanAmount, interestRate, LOAN_TERM);
  const monthlyPmi = (loanAmount * PMI_ANNUAL_RATE) / 12;
  const monthlyPayment =
    monthlyPI + monthlyPmi + taxes.monthlyTax + taxes.monthlyInsurance;
  const totalCost30Year = monthlyPayment * 360 + downPayment;

  return buildLoanOption({
    id: "conventional-5",
    name: "Conventional 5%",
    shortName: "Conv 5%",
    eligible: true,
    downPayment,
    downPaymentPercent: (downPayment / input.homePrice) * 100,
    loanAmount,
    interestRate,
    monthlyPrincipalInterest: monthlyPI,
    monthlyInsurance: monthlyPmi,
    monthlyPayment,
    upfrontFees: 0,
    totalCost30Year,
    monthlyTax: taxes.monthlyTax,
    monthlyHomeInsurance: taxes.monthlyInsurance,
  });
}

function calculateVa(
  input: MortgageComparisonInput,
  baseRate: number,
  taxes: ReturnType<typeof estimateTaxesAndInsurance>,
): LoanOption {
  if (!input.isVeteran) {
    return buildLoanOption({
      id: "va",
      name: "VA Loan",
      shortName: "VA",
      eligible: false,
      ineligibleReason: "Requires eligible veteran status",
      downPayment: 0,
      downPaymentPercent: 0,
      loanAmount: 0,
      interestRate: baseRate - 0.25,
      monthlyPrincipalInterest: 0,
      monthlyInsurance: 0,
      monthlyPayment: 0,
      upfrontFees: 0,
      totalCost30Year: 0,
      monthlyTax: taxes.monthlyTax,
      monthlyHomeInsurance: taxes.monthlyInsurance,
    });
  }

  const downPayment = 0;
  const baseLoan = input.homePrice;
  const fundingFee = baseLoan * VA_FUNDING_FEE_RATE;
  const loanAmount = baseLoan + fundingFee;
  const interestRate = baseRate - 0.25;
  const monthlyPI = calculateMortgagePayment(loanAmount, interestRate, LOAN_TERM);
  const monthlyPayment =
    monthlyPI + taxes.monthlyTax + taxes.monthlyInsurance;
  const totalCost30Year = monthlyPayment * 360 + downPayment;

  return buildLoanOption({
    id: "va",
    name: "VA Loan",
    shortName: "VA",
    eligible: true,
    downPayment,
    downPaymentPercent: 0,
    loanAmount,
    interestRate,
    monthlyPrincipalInterest: monthlyPI,
    monthlyInsurance: 0,
    monthlyPayment,
    upfrontFees: fundingFee,
    totalCost30Year,
    monthlyTax: taxes.monthlyTax,
    monthlyHomeInsurance: taxes.monthlyInsurance,
  });
}

function calculateArm(
  input: MortgageComparisonInput,
  baseRate: number,
  taxes: ReturnType<typeof estimateTaxesAndInsurance>,
): LoanOption {
  const downPercent = Math.min(
    20,
    (input.availableDownPayment / input.homePrice) * 100,
  );
  const requiredDown = input.homePrice * (downPercent / 100);
  const eligible = input.availableDownPayment >= input.homePrice * 0.05;

  if (!eligible) {
    return buildLoanOption({
      id: "arm-5-1",
      name: "5/1 ARM",
      shortName: "5/1 ARM",
      eligible: false,
      ineligibleReason: `Needs at least ${formatCurrency(input.homePrice * 0.05)} down (5%)`,
      downPayment: 0,
      downPaymentPercent: 0,
      loanAmount: 0,
      interestRate: baseRate - ARM_INITIAL_DISCOUNT,
      monthlyPrincipalInterest: 0,
      monthlyInsurance: 0,
      monthlyPayment: 0,
      upfrontFees: 0,
      totalCost30Year: 0,
      monthlyTax: taxes.monthlyTax,
      monthlyHomeInsurance: taxes.monthlyInsurance,
    });
  }

  const downPayment = Math.min(input.availableDownPayment, requiredDown);
  const loanAmount = input.homePrice - downPayment;
  const initialRate = baseRate - ARM_INITIAL_DISCOUNT;
  const resetRate = baseRate + ARM_RESET_PREMIUM;
  const { monthlyInitial, totalCost: piTotalCost } = calculateArmTotalCost(
    loanAmount,
    initialRate,
    resetRate,
  );
  const monthlyPmi =
    downPayment / input.homePrice < 0.2
      ? (loanAmount * PMI_ANNUAL_RATE) / 12
      : 0;
  const monthlyPayment =
    monthlyInitial + monthlyPmi + taxes.monthlyTax + taxes.monthlyInsurance;
  const ancillaryMonthly =
    monthlyPmi + taxes.monthlyTax + taxes.monthlyInsurance;
  const totalCost30Year = piTotalCost + ancillaryMonthly * 360 + downPayment;

  return buildLoanOption({
    id: "arm-5-1",
    name: "5/1 ARM",
    shortName: "5/1 ARM",
    eligible: true,
    downPayment,
    downPaymentPercent: (downPayment / input.homePrice) * 100,
    loanAmount,
    interestRate: initialRate,
    monthlyPrincipalInterest: monthlyInitial,
    monthlyInsurance: monthlyPmi,
    monthlyPayment,
    upfrontFees: 0,
    totalCost30Year,
    monthlyTax: taxes.monthlyTax,
    monthlyHomeInsurance: taxes.monthlyInsurance,
  });
}

function calculateHeloc(
  input: MortgageComparisonInput,
  baseRate: number,
  taxes: ReturnType<typeof estimateTaxesAndInsurance>,
): LoanOption {
  const maxDraw = input.homeEquity * 0.85;
  const needed = input.homePrice;
  const eligible = maxDraw >= needed * 0.2;

  if (!eligible) {
    return buildLoanOption({
      id: "heloc",
      name: "HELOC",
      shortName: "HELOC",
      eligible: false,
      ineligibleReason:
        input.homeEquity <= 0
          ? "Requires existing home equity"
          : `Equity (${formatCurrency(input.homeEquity)}) insufficient for this purchase`,
      downPayment: 0,
      downPaymentPercent: 0,
      loanAmount: 0,
      interestRate: baseRate + HELOC_RATE_PREMIUM,
      monthlyPrincipalInterest: 0,
      monthlyInsurance: 0,
      monthlyPayment: 0,
      upfrontFees: 0,
      totalCost30Year: 0,
      monthlyTax: taxes.monthlyTax,
      monthlyHomeInsurance: taxes.monthlyInsurance,
    });
  }

  const drawAmount = Math.min(maxDraw, needed);
  const interestRate = baseRate + HELOC_RATE_PREMIUM;
  const monthlyInterest = (drawAmount * (interestRate / 100)) / 12;
  const monthlyPayment =
    monthlyInterest + taxes.monthlyTax + taxes.monthlyInsurance;
  const totalCost30Year = monthlyPayment * 360;

  return buildLoanOption({
    id: "heloc",
    name: "HELOC",
    shortName: "HELOC",
    eligible: true,
    downPayment: Math.max(0, needed - drawAmount),
    downPaymentPercent: (Math.max(0, needed - drawAmount) / input.homePrice) * 100,
    loanAmount: drawAmount,
    interestRate,
    monthlyPrincipalInterest: monthlyInterest,
    monthlyInsurance: 0,
    monthlyPayment,
    upfrontFees: drawAmount * 0.01,
    totalCost30Year,
    monthlyTax: taxes.monthlyTax,
    monthlyHomeInsurance: taxes.monthlyInsurance,
  });
}

function pickWinner(loans: LoanOption[]): LoanOption | null {
  const eligible = loans.filter((l) => l.eligible);
  if (eligible.length === 0) return null;

  const affordable = eligible.filter((l) => l.housingRatio <= 36);
  const pool = affordable.length > 0 ? affordable : eligible;

  const sorted = [...pool].sort((a, b) => {
    const monthlyDiff = a.monthlyPayment - b.monthlyPayment;
    if (Math.abs(monthlyDiff) > 50) return monthlyDiff;
    return a.totalCost30Year - b.totalCost30Year;
  });

  return sorted[0];
}

function buildComparisonTable(loans: LoanOption[]): ComparisonTableRow[] {
  const byId = Object.fromEntries(loans.map((l) => [l.id, l])) as Record<
    LoanTypeId,
    LoanOption
  >;

  const rows: {
    label: string;
    getValue: (l: LoanOption) => string;
    getNumeric?: (l: LoanOption) => number;
    lowerIsBetter?: boolean;
  }[] = [
    {
      label: "Eligibility",
      getValue: (l) => (l.eligible ? "Eligible" : l.ineligibleReason ?? "No"),
    },
    {
      label: "Down payment",
      getValue: (l) =>
        l.eligible
          ? `${formatCurrency(l.downPayment)} (${formatPercentOneDecimal(l.downPaymentPercent)})`
          : "—",
      getNumeric: (l) => l.downPayment,
      lowerIsBetter: true,
    },
    {
      label: "Loan amount",
      getValue: (l) => (l.eligible ? formatCurrency(l.loanAmount) : "—"),
      getNumeric: (l) => l.loanAmount,
      lowerIsBetter: true,
    },
    {
      label: "Interest rate",
      getValue: (l) =>
        l.eligible ? formatPercentOneDecimal(l.interestRate) : "—",
      getNumeric: (l) => l.interestRate,
      lowerIsBetter: true,
    },
    {
      label: "Monthly P&I",
      getValue: (l) =>
        l.eligible ? formatCurrency(l.monthlyPrincipalInterest) : "—",
      getNumeric: (l) => l.monthlyPrincipalInterest,
      lowerIsBetter: true,
    },
    {
      label: "PMI / MIP / fees",
      getValue: (l) =>
        l.eligible ? formatCurrency(l.monthlyInsurance) : "—",
      getNumeric: (l) => l.monthlyInsurance,
      lowerIsBetter: true,
    },
    {
      label: "Total monthly payment",
      getValue: (l) => (l.eligible ? formatCurrency(l.monthlyPayment) : "—"),
      getNumeric: (l) => l.monthlyPayment,
      lowerIsBetter: true,
    },
    {
      label: "Housing ratio",
      getValue: (l) =>
        l.eligible ? `${l.housingRatio.toFixed(1)}%` : "—",
      getNumeric: (l) => l.housingRatio,
      lowerIsBetter: true,
    },
    {
      label: "Upfront fees",
      getValue: (l) => (l.eligible ? formatCurrency(l.upfrontFees) : "—"),
      getNumeric: (l) => l.upfrontFees,
      lowerIsBetter: true,
    },
    {
      label: "30-year total cost",
      getValue: (l) => (l.eligible ? formatCurrency(l.totalCost30Year) : "—"),
      getNumeric: (l) => l.totalCost30Year,
      lowerIsBetter: true,
    },
  ];

  return rows.map((row) => {
    const values = {} as Record<LoanTypeId, string>;
    for (const loan of loans) {
      values[loan.id] = row.getValue(loan);
    }

    let winner: LoanTypeId | undefined;
    if (row.getNumeric && row.lowerIsBetter) {
      const eligible = loans.filter((l) => l.eligible);
      const best = eligible.reduce<LoanOption | null>((acc, l) => {
        const val = row.getNumeric!(l);
        if (!acc) return l;
        return val < row.getNumeric!(acc) ? l : acc;
      }, null);
      if (best) winner = best.id;
    }

    return { label: row.label, values, winner };
  });
}

function buildInsights(
  input: MortgageComparisonInput,
  loans: LoanOption[],
  winner: LoanOption | null,
): string[] {
  const insights: string[] = [];
  const eligible = loans.filter((l) => l.eligible);

  if (input.homePrice <= 0 || input.annualIncome <= 0) {
    return ["Enter a home price and annual income to see personalized insights."];
  }

  if (winner) {
    insights.push(
      `${winner.name} offers the best balance of monthly payment (${formatCurrency(winner.monthlyPayment)}/mo) and long-term cost for your profile.`,
    );
  }

  const va = loans.find((l) => l.id === "va");
  if (input.isVeteran && va?.eligible) {
    insights.push(
      `As a veteran, your VA loan requires $0 down and no PMI — saving ${formatCurrency(va.downPayment)} upfront vs conventional options.`,
    );
  } else if (input.isVeteran && !va?.eligible) {
    insights.push(
      "VA loans offer $0 down with no PMI for eligible veterans — confirm your Certificate of Eligibility with a VA-approved lender.",
    );
  }

  const conv20 = loans.find((l) => l.id === "conventional-20");
  const conv5 = loans.find((l) => l.id === "conventional-5");
  if (conv20?.eligible && conv5?.eligible) {
    const savings = conv5.monthlyPayment - conv20.monthlyPayment;
    insights.push(
      `Putting 20% down saves ${formatCurrency(savings)}/mo vs 5% down by eliminating PMI and securing a lower rate.`,
    );
  } else if (!conv20?.eligible && conv5?.eligible) {
    insights.push(
      `With ${formatCurrency(input.availableDownPayment)} available, conventional 5% is within reach — FHA is another low-down option to compare.`,
    );
  }

  const fha = loans.find((l) => l.id === "fha");
  if (fha?.eligible && input.creditScoreRange === "fair") {
    insights.push(
      "FHA loans are popular for fair credit scores, but lifetime mortgage insurance can make them costlier long-term than conventional once you reach 20% equity.",
    );
  }

  const arm = loans.find((l) => l.id === "arm-5-1");
  if (arm?.eligible && winner?.id !== "arm-5-1") {
    const fixed = eligible.find((l) => l.id === "conventional-20" || l.id === "conventional-5");
    if (fixed) {
      insights.push(
        `The 5/1 ARM starts ${formatCurrency(fixed.monthlyPayment - arm.monthlyPayment)} lower per month, but rates reset after year 5 — best if you plan to sell or refinance within 5–7 years.`,
      );
    }
  }

  const heloc = loans.find((l) => l.id === "heloc");
  if (heloc?.eligible) {
    insights.push(
      `A HELOC against your ${formatCurrency(input.homeEquity)} equity offers flexible interest-only payments, but you won't build equity on the borrowed portion — ideal for bridge financing, not long-term primary mortgages.`,
    );
  }

  const overextended = eligible.filter((l) => l.housingRatio > 28);
  if (overextended.length === eligible.length && eligible.length > 0) {
    insights.push(
      `All eligible options exceed the 28% housing ratio guideline on ${formatCurrency(input.annualIncome)} income. Consider a lower price point or larger down payment.`,
    );
  } else if (winner && winner.housingRatio <= 28) {
    insights.push(
      `Your recommended payment stays within the 28% rule — ${winner.housingRatio.toFixed(1)}% of gross monthly income.`,
    );
  }

  if (input.creditScoreRange === "excellent" && conv20?.eligible) {
    insights.push(
      "Your excellent credit unlocks the best conventional rates — shop at least 3 lenders to maximize savings.",
    );
  }

  if (input.creditScoreRange === "poor") {
    insights.push(
      "Below 580, FHA is typically the primary path — focus on credit improvement to unlock conventional options and lower rates.",
    );
  }

  return insights.slice(0, 6);
}

export function calculateMortgageComparison(
  input: MortgageComparisonInput,
): MortgageComparisonResult | null {
  if (input.homePrice <= 0) return null;

  const baseRate = getBaseRate(input.creditScoreRange);
  const taxes = estimateTaxesAndInsurance(input.homePrice);

  const rawLoans = [
    calculateFha(input, baseRate, taxes),
    calculateConventional20(input, baseRate, taxes),
    calculateConventional5(input, baseRate, taxes),
    calculateVa(input, baseRate, taxes),
    calculateArm(input, baseRate, taxes),
    calculateHeloc(input, baseRate, taxes),
  ].map((loan) => withHousingRatio(loan, input.annualIncome));

  const winner = pickWinner(rawLoans);
  const loans = rawLoans.map((loan) => ({
    ...loan,
    isWinner: winner?.id === loan.id,
  }));

  const eligibleForChart = loans.filter((l) => l.eligible);

  return {
    loans,
    winner,
    chartData: {
      monthlyPayment: eligibleForChart.map((l) => ({
        name: l.shortName,
        value: l.monthlyPayment,
        id: l.id,
      })),
      totalCost: eligibleForChart.map((l) => ({
        name: l.shortName,
        value: l.totalCost30Year,
        id: l.id,
      })),
    },
    comparisonTable: buildComparisonTable(loans),
    insights: buildInsights(input, loans, winner),
  };
}
