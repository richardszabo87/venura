import { TrueCostCalculator } from "@/components/cost/true-cost-calculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "True Cost of Ownership | Venura",
  description:
    "Free home ownership cost calculator. Compare true monthly cost vs mortgage-only, check affordability with the 28% rule, and project equity growth.",
};

export default function CostPage() {
  return <TrueCostCalculator />;
}
