import { FirstTimeInvestorQuiz } from "@/components/quiz/first-time-investor-quiz";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "First-Time Investor Quiz | Venura",
  description:
    "Take the free First-Time Investor Quiz to discover your DC metro investor profile and get a personalized Venura dashboard.",
};

export default function QuizPage() {
  return <FirstTimeInvestorQuiz />;
}
