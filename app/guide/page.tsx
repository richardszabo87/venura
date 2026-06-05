import { BuyerGuide } from "@/components/guide/buyer-guide";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "First-Time Buyer Guide | Venura",
  description:
    "Free 6-stage first-time home buyer checklist. Track your progress from finances to closing with Venura tips and tool links at every step.",
};

export default function GuidePage() {
  return <BuyerGuide />;
}
