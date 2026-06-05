import { MarketPulseDashboard } from "@/components/markets/market-pulse-dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rental Market Pulse | Venura",
  description:
    "Free rental market intelligence for DC metro, Baltimore, Northern Virginia, Atlanta, Miami, and Phoenix. Investor scores, zip-level data, rent trends, and market signals.",
};

export default function MarketsPage() {
  return <MarketPulseDashboard />;
}
