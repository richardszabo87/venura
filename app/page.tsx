import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { LandingPage } from "@/components/landing/landing-page";

export const metadata: Metadata = {
  title: "Venura — Analyze Any Property in 60 Seconds",
  description:
    "Stop building spreadsheets. Get a clear Go or No-Go on any rental deal with cash flow, cap rate, and 10-year projections.",
};

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return <LandingPage />;
}
