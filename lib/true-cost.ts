import { calculateMortgagePayment } from "./calculator";

export type TrueCostInput = {
  purchasePrice: number;
  downPaymentPercent: number;
  interestRate: number;
  loanTerm: number;
  propertyTaxes: number;
  homeInsurance: number;
  hoa: number;
  utilities: number;
  annualIncome: number;
  appreciationRate: number;
};

export type AffordabilityRating = "comfortable" | "stretch" | "overextended";

export type MonthlyBreakdownItem = {
  label: string;
  amount: number;
};

export type EquityProjection = {
  year: number;
  homeValue: number;
  loanBalance: number;
  equity: number;
};

export type HiddenCosts = {
  pmi: number;
  maintenance: number;
  closingCosts: number;
};

export type TrueCostResult = {
  monthlyMortgage: number;
  trueMonthlyCost: number;
  monthlyIncome: number;
  housingRatio: number;
  affordability: AffordabilityRating;
  affordabilityLabel: string;
  breakdown: MonthlyBreakdownItem[];
  equityProjections: EquityProjection[];
  hiddenCosts: HiddenCosts;
  totalUpfrontCash: number;
  downPayment: number;
  loanAmount: number;
};

const CLOSING_COST_RATE = 0.03;
const MAINTENANCE_RATE = 0.01;
const PMI_ANNUAL_RATE = 0.005;

export function remainingLoanBalance(
  principal: number,
  annualRate: number,
  loanTermYears: number,
  paymentsMade: number,
): number {
  if (principal <= 0) return 0;
  const totalPayments = loanTermYears * 12;
  if (paymentsMade >= totalPayments) return 0;

  if (annualRate <= 0) {
    const monthlyPrincipal = principal / totalPayments;
    return Math.max(0, principal - monthlyPrincipal * paymentsMade);
  }

  const monthlyRate = annualRate / 100 / 12;
  const factor = Math.pow(1 + monthlyRate, totalPayments);
  const paidFactor = Math.pow(1 + monthlyRate, paymentsMade);

  return (principal * (factor - paidFactor)) / (factor - 1);
}

function getAffordability(ratio: number): {
  rating: AffordabilityRating;
  label: string;
} {
  if (ratio <= 28) {
    return { rating: "comfortable", label: "Within budget" };
  }
  if (ratio <= 36) {
    return { rating: "stretch", label: "Stretching budget" };
  }
  return { rating: "overextended", label: "Above recommended limit" };
}

export function calculateTrueCost(input: TrueCostInput): TrueCostResult | null {
  const purchasePrice = input.purchasePrice;
  if (purchasePrice <= 0) return null;

  const downPayment = purchasePrice * (input.downPaymentPercent / 100);
  const loanAmount = purchasePrice - downPayment;
  const monthlyMortgage = calculateMortgagePayment(
    loanAmount,
    input.interestRate,
    input.loanTerm,
  );

  const monthlyPmi =
    input.downPaymentPercent < 20 && loanAmount > 0
      ? (loanAmount * PMI_ANNUAL_RATE) / 12
      : 0;

  const monthlyMaintenance = (purchasePrice * MAINTENANCE_RATE) / 12;
  const closingCosts = purchasePrice * CLOSING_COST_RATE;

  const breakdown: MonthlyBreakdownItem[] = [
    { label: "Mortgage (P&I)", amount: monthlyMortgage },
    { label: "Property taxes", amount: input.propertyTaxes },
    { label: "Home insurance", amount: input.homeInsurance },
    { label: "HOA", amount: input.hoa },
    { label: "Utilities", amount: input.utilities },
    { label: "PMI", amount: monthlyPmi },
    { label: "Maintenance reserve", amount: monthlyMaintenance },
  ].filter((item) => item.amount > 0);

  const trueMonthlyCost = breakdown.reduce((sum, item) => sum + item.amount, 0);
  const monthlyIncome = input.annualIncome / 12;
  const housingRatio =
    monthlyIncome > 0 ? (trueMonthlyCost / monthlyIncome) * 100 : 0;
  const affordability = getAffordability(housingRatio);

  const appreciationMultiplier = 1 + input.appreciationRate / 100;
  const projectionYears = [1, 5, 10, 20];
  const equityProjections: EquityProjection[] = projectionYears.map((year) => {
    const homeValue = purchasePrice * Math.pow(appreciationMultiplier, year);
    const loanBalance = remainingLoanBalance(
      loanAmount,
      input.interestRate,
      input.loanTerm,
      year * 12,
    );
    return {
      year,
      homeValue,
      loanBalance,
      equity: homeValue - loanBalance,
    };
  });

  return {
    monthlyMortgage,
    trueMonthlyCost,
    monthlyIncome,
    housingRatio,
    affordability: affordability.rating,
    affordabilityLabel: affordability.label,
    breakdown,
    equityProjections,
    hiddenCosts: {
      pmi: monthlyPmi,
      maintenance: monthlyMaintenance,
      closingCosts,
    },
    totalUpfrontCash: downPayment + closingCosts,
    downPayment,
    loanAmount,
  };
}

export const DEFAULT_TRUE_COST_INPUT: TrueCostInput = {
  purchasePrice: 450000,
  downPaymentPercent: 20,
  interestRate: 6.5,
  loanTerm: 30,
  propertyTaxes: 400,
  homeInsurance: 150,
  hoa: 200,
  utilities: 250,
  annualIncome: 120000,
  appreciationRate: 3,
};

export const AFFORDABILITY_STYLES: Record<
  AffordabilityRating,
  { bg: string; text: string; border: string }
> = {
  comfortable: {
    bg: "bg-emerald-500/15",
    text: "text-emerald-300",
    border: "border-emerald-400/40",
  },
  stretch: {
    bg: "bg-amber-500/15",
    text: "text-amber-300",
    border: "border-amber-400/40",
  },
  overextended: {
    bg: "bg-red-500/15",
    text: "text-red-300",
    border: "border-red-400/40",
  },
};
