import { HoaDangerScoreTool } from "@/components/hoa/hoa-danger-score-tool";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HOA Danger Score | Venura",
  description:
    "Free HOA Danger Score tool for rental investors. Evaluate reserve funds, fee increases, special assessments, and litigation risk before you buy.",
};

export default function HoaPage() {
  return <HoaDangerScoreTool />;
}
