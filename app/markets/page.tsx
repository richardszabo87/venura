import { MarketPulseDashboard } from "@/components/markets/market-pulse-dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rental Market Pulse | Venura",
  description:
    "Free DC metro rental market intelligence. Compare investor scores, rent trends, vacancy, and market signals across Landover, Hyattsville, Silver Spring, and more.",
};

export default function MarketsPage() {
  return <MarketPulseDashboard />;
}
