import { calculateMortgagePayment } from "./calculator";
import { formatCurrency } from "./format";

export type RentVsBuyInput = {
  purchasePrice: number;
  downPaymentPercent: number;
  interestRate: number;
  propertyTaxes: number;
  homeInsurance: number;
  hoa: number;
  appreciationRate: number;
  monthlyRent: number;
  rentersInsurance: number;
  annualRentIncrease: number;
  investmentReturn: number;
  yearsToStay: number;
  annualIncome: number;
};

export type RentVsBuyVerdict = "buy" | "rent";

export type ComparisonRow = {
  label: string;
  buyValue: string;
  rentValue: string;
  winner?: "buy" | "rent";
};

export type WealthYearPoint = {
  year: number;
  buyWealth: number;
  rentWealth: number;
};

export type AdaptiveCta = {
  headline: string;
  description: string;
  href: string;
  label: string;
};

export type RentVsBuyResult = {
  verdict: RentVsBuyVerdict;
  wealthDifference: number;
  breakEvenYear: number | null;
  monthlyBuyCost: number;
  monthlyRentCost: number;
  buyEndingWealth: number;
  rentEndingWealth: number;
  buyUpfrontCash: number;
  rentUpfrontCash: number;
  buyTotalCashOut: number;
  rentTotalCashOut: number;
  comparisonTable: ComparisonRow[];
  wealthChart: WealthYearPoint[];
  insights: string[];
  cta: AdaptiveCta;
};

const LOAN_TERM_YEARS = 30;
const CLOSING_COST_RATE = 0.03;
const SELLING_COST_RATE = 0.05;
const MAINTENANCE_RATE = 0.01;
const PMI_ANNUAL_RATE = 0.005;

function monthlyInvestmentReturn(annualPercent: number): number {
  return Math.pow(1 + annualPercent / 100, 1 / 12) - 1;
}

function monthlyAppreciation(annualPercent: number): number {
  return Math.pow(1 + annualPercent / 100, 1 / 12) - 1;
}

function getMonthlyBuyCosts(
  input: RentVsBuyInput,
  loanAmount: number,
): {
  monthlyMortgage: number;
  monthlyPmi: number;
  monthlyMaintenance: number;
  total: number;
} {
  const monthlyMortgage = calculateMortgagePayment(
    loanAmount,
    input.interestRate,
    LOAN_TERM_YEARS,
  );
  const monthlyPmi =
    input.downPaymentPercent < 20 && loanAmount > 0
      ? (loanAmount * PMI_ANNUAL_RATE) / 12
      : 0;
  const monthlyMaintenance = (input.purchasePrice * MAINTENANCE_RATE) / 12;
  const total =
    monthlyMortgage +
    input.propertyTaxes +
    input.homeInsurance +
    input.hoa +
    monthlyMaintenance +
    monthlyPmi;

  return { monthlyMortgage, monthlyPmi, monthlyMaintenance, total };
}

function buildInsights(
  input: RentVsBuyInput,
  result: Omit<RentVsBuyResult, "insights" | "cta" | "comparisonTable">,
): string[] {
  const insights: string[] = [];
  const horizon = input.yearsToStay;

  if (result.verdict === "buy") {
    insights.push(
      `Over ${horizon} years, buying builds ${formatCurrency(result.wealthDifference)} more wealth than renting at your assumed ${input.investmentReturn}% investment return.`,
    );
  } else {
    insights.push(
      `Over ${horizon} years, renting and investing your savings outpaces buying by ${formatCurrency(result.wealthDifference)}.`,
    );
  }

  if (result.breakEvenYear) {
    if (result.breakEvenYear <= horizon) {
      insights.push(
        `Buying overtakes renting in year ${result.breakEvenYear} — before your planned ${horizon}-year stay.`,
      );
    } else {
      insights.push(
        `Break-even arrives in year ${result.breakEvenYear}, after your planned ${horizon}-year stay — a shorter timeline favors renting.`,
      );
    }
  } else if (result.verdict === "rent") {
    insights.push(
      `Within a 10-year window, renting and investing never falls behind buying at these assumptions.`,
    );
  }

  if (result.monthlyBuyCost > result.monthlyRentCost) {
    const diff = result.monthlyBuyCost - result.monthlyRentCost;
    insights.push(
      `Owning costs ${formatCurrency(diff)} more per month upfront, but equity and appreciation can offset that over time.`,
    );
  } else {
    const diff = result.monthlyRentCost - result.monthlyBuyCost;
    insights.push(
      `Your monthly ownership cost is ${formatCurrency(diff)} lower than rent — buying wins on cash flow too.`,
    );
  }

  if (input.appreciationRate >= 4) {
    insights.push(
      `Strong appreciation (${input.appreciationRate}%/yr) boosts equity — buying is more attractive when home values rise.`,
    );
  } else if (input.appreciationRate <= 2) {
    insights.push(
      `Modest appreciation (${input.appreciationRate}%/yr) shifts the math toward renting and investing the down payment.`,
    );
  }

  const buyHousingRatio =
    input.annualIncome > 0
      ? ((result.monthlyBuyCost * 12) / input.annualIncome) * 100
      : 0;
  if (buyHousingRatio > 28) {
    insights.push(
      `Ownership would consume ${buyHousingRatio.toFixed(0)}% of gross income — above the 28% guideline even if wealth math favors buying.`,
    );
  }

  return insights;
}

function buildCta(verdict: RentVsBuyVerdict): AdaptiveCta {
  if (verdict === "buy") {
    return {
      headline: "Buying looks better — stress-test the numbers",
      description:
        "Run the full ownership cost breakdown and analyze this property as an investment on Venura.",
      href: "/cost",
      label: "Calculate true ownership costs →",
    };
  }

  return {
    headline: "Renting wins on wealth — keep validating rent",
    description:
      "Check market rent trends and compare neighborhoods before you sign a lease or make an offer.",
    href: "/rent",
    label: "Check rent with RentCheck →",
  };
}

export function calculateRentVsBuy(
  input: RentVsBuyInput,
): RentVsBuyResult | null {
  if (input.purchasePrice <= 0 || input.monthlyRent <= 0 || input.yearsToStay <= 0) {
    return null;
  }

  const downPayment = input.purchasePrice * (input.downPaymentPercent / 100);
  const closingCosts = input.purchasePrice * CLOSING_COST_RATE;
  const loanAmount = input.purchasePrice - downPayment;
  const buyCosts = getMonthlyBuyCosts(input, loanAmount);
  const monthlyRentCost = input.monthlyRent + input.rentersInsurance;

  const monthlyRate =
    input.interestRate > 0 ? input.interestRate / 100 / 12 : 0;
  const investGrowth = monthlyInvestmentReturn(input.investmentReturn);
  const homeGrowth = monthlyAppreciation(input.appreciationRate);

  let renterInvestments = downPayment + closingCosts;
  let homeValue = input.purchasePrice;
  let loanBalance = loanAmount;
  let currentRent = input.monthlyRent;

  let buyTotalCashOut = downPayment + closingCosts;
  let rentTotalCashOut = 0;
  let breakEvenYear: number | null = null;

  const wealthChart: WealthYearPoint[] = [];
  const chartYears = 10;
  const simulationYears = Math.max(chartYears, input.yearsToStay);
  const horizonMonths = input.yearsToStay * 12;
  const totalMonths = simulationYears * 12;
  let buyEndingWealth = 0;
  let rentEndingWealth = 0;

  for (let month = 1; month <= totalMonths; month++) {
    if (month > 1 && (month - 1) % 12 === 0) {
      currentRent *= 1 + input.annualRentIncrease / 100;
    }

    const rentPayment = currentRent + input.rentersInsurance;
    const buyPayment = buyCosts.total;

    if (month <= horizonMonths) {
      rentTotalCashOut += rentPayment;
      buyTotalCashOut += buyPayment;
    }

    const monthlyDiff = buyPayment - rentPayment;
    if (monthlyDiff > 0) {
      renterInvestments += monthlyDiff;
    } else {
      renterInvestments = Math.max(0, renterInvestments + monthlyDiff);
    }

    if (loanBalance > 0) {
      const interestPayment = monthlyRate > 0 ? loanBalance * monthlyRate : 0;
      const principalPayment = Math.min(
        buyCosts.monthlyMortgage - interestPayment,
        loanBalance,
      );
      loanBalance = Math.max(0, loanBalance - principalPayment);
    }

    homeValue *= 1 + homeGrowth;
    renterInvestments *= 1 + investGrowth;

    if (month % 12 === 0) {
      const year = month / 12;
      const sellingCosts = homeValue * SELLING_COST_RATE;
      const buyWealth = Math.max(0, homeValue - loanBalance - sellingCosts);
      const rentWealth = renterInvestments;

      if (year <= chartYears) {
        wealthChart.push({ year, buyWealth, rentWealth });
      }

      if (year === input.yearsToStay) {
        buyEndingWealth = buyWealth;
        rentEndingWealth = rentWealth;
      }

      if (breakEvenYear === null && buyWealth > rentWealth) {
        breakEvenYear = year;
      }
    }
  }
  const wealthDifference = Math.abs(buyEndingWealth - rentEndingWealth);
  const verdict: RentVsBuyVerdict =
    buyEndingWealth >= rentEndingWealth ? "buy" : "rent";

  const buyHousingRatio =
    input.annualIncome > 0
      ? ((buyCosts.total * 12) / input.annualIncome) * 100
      : 0;
  const rentHousingRatio =
    input.annualIncome > 0
      ? ((monthlyRentCost * 12) / input.annualIncome) * 100
      : 0;

  const partial: Omit<RentVsBuyResult, "insights" | "cta" | "comparisonTable"> = {
    verdict,
    wealthDifference,
    breakEvenYear,
    monthlyBuyCost: buyCosts.total,
    monthlyRentCost,
    buyEndingWealth,
    rentEndingWealth,
    buyUpfrontCash: downPayment + closingCosts,
    rentUpfrontCash: 0,
    buyTotalCashOut,
    rentTotalCashOut,
    wealthChart,
  };

  const comparisonTable: ComparisonRow[] = [
    {
      label: "Monthly housing cost",
      buyValue: formatCurrency(buyCosts.total),
      rentValue: formatCurrency(monthlyRentCost),
      winner: buyCosts.total <= monthlyRentCost ? "buy" : "rent",
    },
    {
      label: "Upfront cash needed",
      buyValue: formatCurrency(downPayment + closingCosts),
      rentValue: formatCurrency(0),
      winner: "rent",
    },
    {
      label: `Total cash out over ${input.yearsToStay} years`,
      buyValue: formatCurrency(buyTotalCashOut),
      rentValue: formatCurrency(rentTotalCashOut),
      winner: buyTotalCashOut <= rentTotalCashOut ? "buy" : "rent",
    },
    {
      label: `Net worth after ${input.yearsToStay} years`,
      buyValue: formatCurrency(buyEndingWealth),
      rentValue: formatCurrency(rentEndingWealth),
      winner: verdict,
    },
    {
      label: "Housing % of income",
      buyValue: `${buyHousingRatio.toFixed(1)}%`,
      rentValue: `${rentHousingRatio.toFixed(1)}%`,
      winner: buyHousingRatio <= rentHousingRatio ? "buy" : "rent",
    },
  ];

  return {
    ...partial,
    comparisonTable,
    insights: buildInsights(input, partial),
    cta: buildCta(verdict),
  };
}

export const DEFAULT_RENT_VS_BUY_INPUT: RentVsBuyInput = {
  purchasePrice: 450000,
  downPaymentPercent: 20,
  interestRate: 6.5,
  propertyTaxes: 400,
  homeInsurance: 150,
  hoa: 200,
  appreciationRate: 3,
  monthlyRent: 2200,
  rentersInsurance: 20,
  annualRentIncrease: 3,
  investmentReturn: 7,
  yearsToStay: 7,
  annualIncome: 120000,
};

export const VERDICT_STYLES: Record<
  RentVsBuyVerdict,
  { label: string; bg: string; border: string; text: string }
> = {
  buy: {
    label: "BUY",
    bg: "bg-[#1B4332]",
    border: "border-[#E8D5B7]/50",
    text: "text-[#E8D5B7]",
  },
  rent: {
    label: "RENT",
    bg: "bg-white",
    border: "border-[#1B4332]/20",
    text: "text-[#1B4332]",
  },
};
