import type { PropertyInputs } from "./calculator";

export type SavedDeal = PropertyInputs & {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  monthlyCashFlow: number;
  owned?: boolean;
  equity?: number;
  currentValue?: number;
};

export const SAMPLE_SAVED_DEALS: SavedDeal[] = [
  {
    id: "deal-1",
    address: "1909 Dutch Village",
    city: "Landover",
    state: "MD",
    zip: "20785",
    purchasePrice: 165000,
    monthlyRent: 1950,
    hoaFee: 274,
    propertyTaxes: 155,
    downPaymentPercent: 20,
    interestRate: 6.75,
    insurance: 55,
    loanTerm: 30,
    monthlyCashFlow: 221,
    owned: true,
    equity: 42000,
    currentValue: 178000,
  },
  {
    id: "deal-2",
    address: "1925 Dutch Village",
    city: "Landover",
    state: "MD",
    zip: "20785",
    purchasePrice: 172000,
    monthlyRent: 1850,
    hoaFee: 274,
    propertyTaxes: 160,
    downPaymentPercent: 20,
    interestRate: 6.99,
    insurance: 55,
    loanTerm: 30,
    monthlyCashFlow: 47,
    owned: true,
    equity: 28500,
    currentValue: 169000,
  },
  {
    id: "deal-3",
    address: "95 E Wayne Ave",
    city: "Silver Spring",
    state: "MD",
    zip: "20901",
    purchasePrice: 425000,
    monthlyRent: 2800,
    hoaFee: 450,
    propertyTaxes: 520,
    downPaymentPercent: 20,
    interestRate: 7.1,
    insurance: 95,
    loanTerm: 30,
    monthlyCashFlow: -822,
    owned: false,
    equity: 0,
    currentValue: 425000,
  },
];
