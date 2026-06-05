import { MarketPulseDashboard } from "@/components/markets/market-pulse-dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rental Market Pulse | Venura",
  description:
    "Free rental market intelligence for 27 US metros across five regions. Investor scores, zip-level rents, rent control, climate warnings, and market signals.",
};

export default function MarketsPage() {
  return <MarketPulseDashboard />;
}
