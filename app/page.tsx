import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LandingPage } from "@/components/landing/landing-page";
import { isLoggedIn } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Venura — Analyze Any Property in 60 Seconds",
  description:
    "Stop building spreadsheets. Get a clear Go or No-Go on any rental deal with cash flow, cap rate, and 10-year projections.",
};

export default async function Home() {
  if (await isLoggedIn()) {
    redirect("/analyzer");
  }

  return <LandingPage />;
}
