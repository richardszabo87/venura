import type { AnalysisResult, PropertyInputs, Verdict } from "./calculator";

export type SavedDealRow = {
  id: string;
  user_id: string;
  name: string;
  address: string;
  purchase_price: number;
  monthly_rent: number;
  hoa: number;
  taxes: number;
  insurance: number;
  down_payment: number;
  interest_rate: number;
  loan_term: number;
  monthly_cash_flow: number;
  cap_rate: number;
  cash_on_cash: number;
  verdict: Verdict;
  created_at: string;
};

export type SaveDealPayload = {
  name: string;
  address: string;
  inputs: PropertyInputs;
  analysis: AnalysisResult;
};

export function dealRowToPayload(row: SavedDealRow) {
  return {
    id: row.id,
    name: row.name,
    address: row.address,
    purchasePrice: row.purchase_price,
    monthlyRent: row.monthly_rent,
    hoaFee: row.hoa,
    propertyTaxes: row.taxes,
    insurance: row.insurance,
    downPaymentPercent: row.down_payment,
    interestRate: row.interest_rate,
    loanTerm: row.loan_term,
    monthlyCashFlow: row.monthly_cash_flow,
    capRate: row.cap_rate,
    cashOnCash: row.cash_on_cash,
    verdict: row.verdict,
    createdAt: row.created_at,
  };
}

export function buildDealInsert(
  userId: string,
  payload: SaveDealPayload,
): Omit<SavedDealRow, "id" | "created_at"> {
  const { name, address, inputs, analysis } = payload;
  return {
    user_id: userId,
    name,
    address,
    purchase_price: inputs.purchasePrice,
    monthly_rent: inputs.monthlyRent,
    hoa: inputs.hoaFee,
    taxes: inputs.propertyTaxes,
    insurance: inputs.insurance,
    down_payment: inputs.downPaymentPercent,
    interest_rate: inputs.interestRate,
    loan_term: inputs.loanTerm,
    monthly_cash_flow: analysis.monthlyCashFlow,
    cap_rate: analysis.capRate,
    cash_on_cash: analysis.cashOnCashReturn,
    verdict: analysis.verdict,
  };
}
