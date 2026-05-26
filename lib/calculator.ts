export const DEFAULTS = {
  purchasePrice: 174999,
  monthlyRent: 1850,
  hoaFee: 274,
  propertyTaxes: 165,
  downPaymentPercent: 20,
  interestRate: 6.99,
  insurance: 55,
  loanTerm: 30,
};

export type Verdict = "go" | "no-go" | "caution";

export type PropertyInputs = {
  purchasePrice: number;
  monthlyRent: number;
  hoaFee: number;
  propertyTaxes: number;
  downPaymentPercent: number;
  interestRate: number;
  insurance: number;
  loanTerm: number;
};

export type AnalysisResult = {
  downPayment: number;
  loanAmount: number;
  monthlyMortgage: number;
  operatingExpenses: number;
  totalMonthlyExpenses: number;
  monthlyCashFlow: number;
  capRate: number;
  cashOnCashReturn: number;
  fiftyPercentRulePass: boolean;
  fiftyPercentThreshold: number;
  verdict: Verdict;
  expenseBreakdown: { label: string; amount: number }[];
};

export function calculateMortgagePayment(
  principal: number,
  annualRate: number,
  years: number,
): number {
  if (principal <= 0) return 0;
  if (annualRate <= 0) return principal / (years * 12);

  const monthlyRate = annualRate / 100 / 12;
  const payments = years * 12;
  const factor = Math.pow(1 + monthlyRate, payments);

  return (principal * monthlyRate * factor) / (factor - 1);
}

export function analyzeProperty(inputs: PropertyInputs): AnalysisResult {
  const {
    purchasePrice,
    monthlyRent,
    hoaFee,
    propertyTaxes,
    downPaymentPercent,
    interestRate,
    insurance,
    loanTerm,
  } = inputs;

  const downPayment = purchasePrice * (downPaymentPercent / 100);
  const loanAmount = purchasePrice - downPayment;
  const monthlyMortgage = calculateMortgagePayment(
    loanAmount,
    interestRate,
    loanTerm,
  );

  const operatingExpenses = hoaFee + propertyTaxes + insurance;
  const totalMonthlyExpenses = monthlyMortgage + operatingExpenses;
  const monthlyCashFlow = monthlyRent - totalMonthlyExpenses;

  const annualRent = monthlyRent * 12;
  const annualOperatingExpenses = operatingExpenses * 12;
  const annualNoi = annualRent - annualOperatingExpenses;
  const capRate = purchasePrice > 0 ? (annualNoi / purchasePrice) * 100 : 0;

  const annualCashFlow = monthlyCashFlow * 12;
  const cashInvested = downPayment;
  const cashOnCashReturn =
    cashInvested > 0 ? (annualCashFlow / cashInvested) * 100 : 0;

  const fiftyPercentThreshold = monthlyRent * 0.5;
  const fiftyPercentRulePass = operatingExpenses <= fiftyPercentThreshold;

  let verdict: Verdict;
  if (monthlyCashFlow < 0) {
    verdict = "no-go";
  } else if (monthlyCashFlow > 150 && capRate > 5) {
    verdict = "go";
  } else {
    verdict = "caution";
  }

  return {
    downPayment,
    loanAmount,
    monthlyMortgage,
    operatingExpenses,
    totalMonthlyExpenses,
    monthlyCashFlow,
    capRate,
    cashOnCashReturn,
    fiftyPercentRulePass,
    fiftyPercentThreshold,
    verdict,
    expenseBreakdown: [
      { label: "Mortgage (P&I)", amount: monthlyMortgage },
      { label: "HOA", amount: hoaFee },
      { label: "Property taxes", amount: propertyTaxes },
      { label: "Insurance", amount: insurance },
    ],
  };
}

export type NegotiationPrices = {
  openOfferPrice: number;
  targetPrice: number;
  walkAwayPrice: number;
};

function findMaxPriceForCondition(
  inputs: Omit<PropertyInputs, "purchasePrice">,
  condition: (analysis: AnalysisResult) => boolean,
  maxSearch = 2_000_000,
): number {
  let low = 0;
  let high = maxSearch;
  let result = 0;

  while (high - low > 50) {
    const mid = Math.floor((low + high) / 2);
    const analysis = analyzeProperty({ ...inputs, purchasePrice: mid });

    if (condition(analysis)) {
      result = mid;
      low = mid;
    } else {
      high = mid;
    }
  }

  return result;
}

export function calculateNegotiationPrices(
  inputs: PropertyInputs,
): NegotiationPrices {
  const { purchasePrice, ...rest } = inputs;

  const walkAwayPrice = findMaxPriceForCondition(
    rest,
    (a) => a.monthlyCashFlow >= 0,
  );

  const targetPrice = findMaxPriceForCondition(
    rest,
    (a) => a.monthlyCashFlow > 150 && a.capRate > 5,
  );

  const openOfferFromTarget = targetPrice > 0 ? Math.round(targetPrice * 0.92) : 0;
  const openOfferFromList = Math.round(purchasePrice * 0.9);
  const openOfferPrice =
    openOfferFromTarget > 0
      ? Math.min(openOfferFromTarget, openOfferFromList)
      : openOfferFromList;

  return {
    openOfferPrice,
    targetPrice,
    walkAwayPrice,
  };
}

export const VERDICT_STYLES: Record<
  Verdict,
  { label: string; bg: string; border: string; glow: string }
> = {
  go: {
    label: "GO",
    bg: "bg-emerald-500/20",
    border: "border-emerald-400",
    glow: "shadow-[0_0_60px_rgba(74,222,128,0.25)]",
  },
  "no-go": {
    label: "NO-GO",
    bg: "bg-red-500/20",
    border: "border-red-400",
    glow: "shadow-[0_0_60px_rgba(248,113,113,0.25)]",
  },
  caution: {
    label: "CAUTION",
    bg: "bg-amber-500/20",
    border: "border-amber-400",
    glow: "shadow-[0_0_60px_rgba(251,191,36,0.2)]",
  },
};
