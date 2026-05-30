import { RentCheckTool } from "@/components/rent/rent-check-tool";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RentCheck | Venura",
  description:
    "Free DC metro rent estimate tool. Check market rent ranges, vacancy, rent growth, and comparable rentals before analyzing your investment deal.",
};

export default function RentPage() {
  return <RentCheckTool />;
}
