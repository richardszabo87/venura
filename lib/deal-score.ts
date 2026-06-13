import { analyzeProperty, DEFAULTS, type AnalysisResult, type PropertyInputs } from "./calculator";

export function computeDealScore(analysis: AnalysisResult): number {
  let score = 50;
  if (analysis.monthlyCashFlow >= 200) score += 20;
  else if (analysis.monthlyCashFlow >= 100) score += 12;
  else if (analysis.monthlyCashFlow >= 0) score += 4;
  else score -= 15;

  if (analysis.capRate >= 0.07) score += 15;
  else if (analysis.capRate >= 0.05) score += 8;

  if (analysis.cashOnCashReturn >= 0.1) score += 10;
  else if (analysis.cashOnCashReturn >= 0.06) score += 5;

  if (analysis.fiftyPercentRulePass) score += 5;
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function computeListingDealScore(options: {
  listPrice: number;
  monthlyRent: number;
  hoaFee?: number | null;
  taxAmount?: number | null;
}): number {
  const propertyTaxes =
    options.taxAmount != null && options.taxAmount > 0
      ? Math.round(options.taxAmount / 12)
      : Math.round((options.listPrice * 0.011) / 12);

  const insurance = Math.round((options.listPrice * 0.0035) / 12);

  const inputs: PropertyInputs = {
    ...DEFAULTS,
    purchasePrice: options.listPrice,
    monthlyRent: options.monthlyRent,
    hoaFee: options.hoaFee ?? 0,
    propertyTaxes,
    insurance,
  };

  return computeDealScore(analyzeProperty(inputs));
}
