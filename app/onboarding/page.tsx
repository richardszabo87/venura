import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Set Up Your Profile | Venura",
  description:
    "Tell us about your goals, budget, and target markets to personalize your Venura experience.",
};

export default function OnboardingPage() {
  return <OnboardingWizard />;
}
