import { MortgageComparisonTool } from "@/components/mortgage/mortgage-comparison-tool";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mortgage Comparison Tool | Venura",
  description:
    "Compare FHA, conventional, VA, 5/1 ARM, and HELOC side by side. Free mortgage comparison with monthly payment, 30-year total cost, and personalized recommendations.",
};

export default function MortgagePage() {
  return <MortgageComparisonTool />;
}
