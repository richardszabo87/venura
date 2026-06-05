import { RentVsBuyCalculator } from "@/components/rvb/rent-vs-buy-calculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rent vs Buy Calculator | Venura",
  description:
    "Free rent vs buy calculator. Compare wealth-building, break-even year, and monthly costs to decide whether to rent or buy your next home.",
};

export default function RentVsBuyPage() {
  return <RentVsBuyCalculator />;
}
