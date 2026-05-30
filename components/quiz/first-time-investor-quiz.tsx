"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  buildInvestorProfile,
  QUIZ_QUESTIONS,
  saveInvestorProfile,
  type QuizAnswers,
} from "@/lib/investor-profile";

type QuizStep = "questions" | "results";

export function FirstTimeInvestorQuiz() {
  const router = useRouter();
  const [step, setStep] = useState<QuizStep>("questions");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});

  const currentQuestion = QUIZ_QUESTIONS[questionIndex];
  const selectedValue = currentQuestion ? answers[currentQuestion.id] : undefined;
  const progress = ((questionIndex + 1) / QUIZ_QUESTIONS.length) * 100;

  const completedAnswers = useMemo(() => {
    const missing = QUIZ_QUESTIONS.find((question) => !answers[question.id]);
    if (missing) return null;
    return answers as QuizAnswers;
  }, [answers]);

  const profile = useMemo(() => {
    if (!completedAnswers) return null;
    return buildInvestorProfile(completedAnswers);
  }, [completedAnswers]);

  function selectAnswer(value: QuizAnswers[keyof QuizAnswers]) {
    if (!currentQuestion) return;

    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));

    if (questionIndex < QUIZ_QUESTIONS.length - 1) {
      setTimeout(() => setQuestionIndex((index) => index + 1), 180);
      return;
    }

    setTimeout(() => setStep("results"), 220);
  }

  function goBack() {
    if (step === "results") {
      setStep("questions");
      setQuestionIndex(QUIZ_QUESTIONS.length - 1);
      return;
    }

    if (questionIndex > 0) {
      setQuestionIndex((index) => index - 1);
    }
  }

  function handleSignUp() {
    if (!profile) return;
    saveInvestorProfile(profile);
    router.push("/sign-up");
  }

  return (
    <div className="min-h-full bg-[#F7F1E8] text-[#1B4332]">
      <header className="border-b border-[#1B4332]/10 bg-[#F7F1E8]">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-5 sm:px-6">
          <Link href="/" className="inline-flex items-baseline gap-0.5">
            <span className="text-2xl font-bold tracking-tight text-[#1B4332]">
              Venura
            </span>
            <span className="text-2xl font-bold text-[#E8D5B7]">.</span>
          </Link>
          <Link
            href="/sign-in"
            className="text-sm font-medium text-[#1B4332]/70 transition hover:text-[#1B4332]"
          >
            Log in
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1B4332]/60">
            First-Time Investor Quiz
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-[#1B4332] sm:text-3xl">
            {step === "questions"
              ? "Build your investor profile"
              : "Your investor profile is ready"}
          </h1>
          <p className="mt-3 text-sm text-[#1B4332]/70 sm:text-base">
            {step === "questions"
              ? "Answer 7 quick questions to get personalized DC metro market recommendations."
              : "Sign up free to analyze deals matched to your profile."}
          </p>
        </div>

        {step === "questions" && currentQuestion && (
          <div className="rounded-2xl border border-[#1B4332]/10 bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#1B4332]/50">
                <span>
                  Question {questionIndex + 1} of {QUIZ_QUESTIONS.length}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#E8D5B7]/50">
                <div
                  className="h-full rounded-full bg-[#1B4332] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <h2 className="text-xl font-semibold text-[#1B4332] sm:text-2xl">
              {currentQuestion.prompt}
            </h2>

            <div className="mt-6 grid gap-3">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedValue === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => selectAnswer(option.value)}
                    className={`w-full rounded-xl border px-4 py-4 text-left text-sm font-semibold transition sm:text-base ${
                      isSelected
                        ? "border-[#1B4332] bg-[#1B4332] text-[#E8D5B7]"
                        : "border-[#1B4332]/15 bg-[#F7F1E8] text-[#1B4332] hover:border-[#1B4332]/40 hover:bg-[#E8D5B7]/30"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            {questionIndex > 0 && (
              <button
                type="button"
                onClick={goBack}
                className="mt-6 text-sm font-medium text-[#1B4332]/70 transition hover:text-[#1B4332]"
              >
                ← Back
              </button>
            )}
          </div>
        )}

        {step === "results" && profile && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-[#1B4332]/10 bg-[#1B4332] px-5 py-8 text-center text-white sm:px-8">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#E8D5B7]/80">
                Your Investor Profile
              </p>
              <p className="mt-3 text-2xl font-black tracking-tight text-[#E8D5B7] sm:text-3xl">
                {profile.investorTypeLabel}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-white/85">
                {profile.summary}
              </p>
            </div>

            <div className="rounded-2xl border border-[#1B4332]/10 bg-white p-5 shadow-sm sm:p-8">
              <h3 className="text-lg font-semibold text-[#1B4332]">
                Top DC Metro Markets for You
              </h3>
              <p className="mt-1 text-sm text-[#1B4332]/70">
                Based on your budget, cash flow target, and property preferences.
              </p>

              <ol className="mt-5 space-y-4">
                {profile.marketRecommendations.map((market) => (
                  <li
                    key={market.rank}
                    className="rounded-xl border border-[#1B4332]/10 bg-[#F7F1E8] p-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1B4332] text-sm font-bold text-[#E8D5B7]">
                        {market.rank}
                      </span>
                      <div>
                        <p className="font-semibold text-[#1B4332]">{market.name}</p>
                        <p className="mt-1 text-sm text-[#1B4332]/70">
                          {market.neighborhoods}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-[#1B4332]/80">
                          {market.reason}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-2xl border border-[#1B4332]/10 bg-white p-5 text-center shadow-sm sm:p-8">
              <h3 className="text-lg font-semibold text-[#1B4332]">
                Ready to analyze your first deal?
              </h3>
              <p className="mt-2 text-sm text-[#1B4332]/70">
                Create your free Venura account and we&apos;ll pre-fill your
                dashboard with this investor profile.
              </p>
              <button
                type="button"
                onClick={handleSignUp}
                className="mt-6 w-full rounded-xl bg-[#E8D5B7] px-6 py-3.5 text-sm font-semibold text-[#1B4332] transition hover:bg-[#F0E4CE] sm:w-auto"
              >
                Sign up free at venura.io/sign-up
              </button>
              <button
                type="button"
                onClick={goBack}
                className="mt-4 block w-full text-sm font-medium text-[#1B4332]/60 transition hover:text-[#1B4332]"
              >
                ← Review answers
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
