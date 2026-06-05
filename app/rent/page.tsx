import { RentCheckTool } from "@/components/rent/rent-check-tool";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RentCheck | Venura",
  description:
    "Free rent estimate tool for DC metro, Baltimore, Northern Virginia, Atlanta, Miami, and Phoenix. Market rent ranges, vacancy, and comparable rentals.",
};

export default function RentPage() {
  return <RentCheckTool />;
}
