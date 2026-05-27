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

export const SAMPLE_SAVED_DEALS: SavedDeal[] = [];
