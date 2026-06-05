"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { formatCurrency } from "@/lib/format";
import { fetchUserProfile, saveProfileFields } from "@/lib/profile-client";
import type {
  BuyerType,
  FinancingType,
  ProfileGoal,
  ProfileTimeline,
  UserProfileRow,
} from "@/lib/user-profile";

const TOTAL_STEPS = 5;

const BUYER_OPTIONS: { value: BuyerType; label: string }[] = [
  { value: "first_time_buyer", label: "First home buyer" },
  { value: "investor", label: "Real estate investor" },
  { value: "move_up_buyer", label: "Move-up buyer" },
  { value: "all", label: "All of the above" },
];

const FINANCING_OPTIONS: { value: FinancingType; label: string }[] = [
  { value: "home_equity", label: "Home equity loan" },
  { value: "conventional", label: "Conventional mortgage" },
  { value: "cash", label: "All cash" },
  { value: "undecided", label: "Still deciding" },
];

const MARKET_OPTIONS = [
  "Landover 20785",
  "Hyattsville 20783",
  "Silver Spring 20901",
  "Takoma Park 20912",
  "Bowie 20715",
  "DC Proper",
  "Montgomery County",
  "PG County",
  "Open to anywhere",
];

const GOAL_OPTIONS: { value: ProfileGoal; label: string }[] = [
  { value: "cash_flow", label: "Monthly cash flow" },
  { value: "appreciation", label: "Long-term appreciation" },
  { value: "both", label: "Both equally" },
  { value: "primary_home", label: "Finding my perfect home" },
];

const TIMELINE_OPTIONS: { value: ProfileTimeline; label: string }[] = [
  { value: "asap", label: "Ready now" },
  { value: "3months", label: "Within 3 months" },
  { value: "6months", label: "Within 6 months" },
  { value: "exploring", label: "Just exploring" },
];

type WizardState = {
  buyerType: BuyerType | null;
  budgetMin: string;
  budgetMax: string;
  financingType: FinancingType | null;
  targetMarkets: string[];
  goal: ProfileGoal | null;
  timeline: ProfileTimeline | null;
};

const INITIAL_STATE: WizardState = {
  buyerType: null,
  budgetMin: "",
  budgetMax: "",
  financingType: null,
  targetMarkets: [],
  goal: null,
  timeline: null,
};

function profileToState(profile: UserProfileRow): WizardState {
  return {
    buyerType: profile.buyer_type,
    budgetMin: profile.budget_min != null ? String(profile.budget_min) : "",
    budgetMax: profile.budget_max != null ? String(profile.budget_max) : "",
    financingType: profile.financing_type,
    targetMarkets: profile.target_markets ?? [],
    goal: profile.goal,
    timeline: profile.timeline,
  };
}

function inferStepFromProfile(profile: UserProfileRow | null): number {
  if (!profile) return 1;
  if (!profile.buyer_type) return 1;
  if (profile.budget_max == null && profile.financing_type == null) return 2;
  if (!profile.target_markets?.length) return 3;
  if (!profile.goal || !profile.timeline) return 4;
  return 5;
}

function labelFor<T extends string>(
  options: { value: T; label: string }[],
  value: T | null,
): string | null {
  if (!value) return null;
  return options.find((o) => o.value === value)?.label ?? null;
}

function parseBudget(value: string): number | null {
  const cleaned = value.replace(/[^0-9]/g, "");
  if (!cleaned) return null;
  const num = Number(cleaned);
  return Number.isFinite(num) && num > 0 ? num : null;
}

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [state, setState] = useState<WizardState>(INITIAL_STATE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProfile()
      .then((profile) => {
        if (profile?.onboarding_completed) {
          router.replace("/dashboard");
          return;
        }
        if (profile) {
          setState(profileToState(profile));
          setStep(inferStepFromProfile(profile));
        }
      })
      .catch((err) => {
        console.error("Failed to load profile:", err);
      })
      .finally(() => setLoading(false));
  }, [router]);

  const progress = (step / TOTAL_STEPS) * 100;

  const saveAndAdvance = useCallback(
    async (fields: Parameters<typeof saveProfileFields>[0], nextStep: number) => {
      setSaving(true);
      setError(null);
      try {
        await saveProfileFields(fields);
        setStep(nextStep);
        if (nextStep === 5) {
          await saveProfileFields({ onboarding_completed: true });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save");
      } finally {
        setSaving(false);
      }
    },
    [],
  );

  function handleStep1Continue() {
    if (!state.buyerType) return;
    void saveAndAdvance({ buyer_type: state.buyerType }, 2);
  }

  function handleStep2Continue() {
    const budgetMin = parseBudget(state.budgetMin);
    const budgetMax = parseBudget(state.budgetMax);
    if (!budgetMax || !state.financingType) return;
    void saveAndAdvance(
      {
        budget_min: budgetMin,
        budget_max: budgetMax,
        financing_type: state.financingType,
      },
      3,
    );
  }

  function handleStep3Continue() {
    if (state.targetMarkets.length === 0) return;
    void saveAndAdvance({ target_markets: state.targetMarkets }, 4);
  }

  function handleStep4Continue() {
    if (!state.goal || !state.timeline) return;
    void saveAndAdvance({ goal: state.goal, timeline: state.timeline }, 5);
  }

  function toggleMarket(market: string) {
    setState((prev) => {
      const selected = prev.targetMarkets.includes(market);
      return {
        ...prev,
        targetMarkets: selected
          ? prev.targetMarkets.filter((m) => m !== market)
          : [...prev.targetMarkets, market],
      };
    });
  }

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center bg-[#F7F1E8]">
        <p className="text-sm font-medium text-[#1B4332]/60">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#F7F1E8] text-[#1B4332]">
      <header className="border-b border-[#1B4332]/10 bg-[#F7F1E8]">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
          <Link href="/" className="inline-flex items-baseline gap-0.5">
            <span className="text-xl font-bold tracking-tight text-[#1B4332] sm:text-2xl">
              Venura
            </span>
            <span className="text-xl font-bold text-[#E8D5B7] sm:text-2xl">.</span>
          </Link>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#1B4332]/50">
            Step {step} of {TOTAL_STEPS}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#1B4332]/50">
            <span>Your profile</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[#E8D5B7]/50">
            <div
              className="h-full rounded-full bg-[#1B4332] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <span
                key={i}
                className={`text-[10px] font-semibold sm:text-xs ${
                  i + 1 <= step ? "text-[#1B4332]" : "text-[#1B4332]/30"
                }`}
              >
                {i + 1}
              </span>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {step === 1 && (
          <StepCard
            title="What brings you to Venura?"
            subtitle="We'll tailor your experience to your goals."
          >
            <div className="grid gap-3">
              {BUYER_OPTIONS.map((option) => (
                <OptionButton
                  key={option.value}
                  label={option.label}
                  selected={state.buyerType === option.value}
                  onClick={() =>
                    setState((prev) => ({ ...prev, buyerType: option.value }))
                  }
                />
              ))}
            </div>
            <StepActions
              onContinue={handleStep1Continue}
              disabled={!state.buyerType}
              saving={saving}
            />
          </StepCard>
        )}

        {step === 2 && (
          <StepCard
            title="What's your budget?"
            subtitle="Set a range and how you plan to finance."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#1B4332]/60">
                  Min budget
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="$300,000"
                  value={state.budgetMin}
                  onChange={(e) =>
                    setState((prev) => ({ ...prev, budgetMin: e.target.value }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-[#1B4332]/15 bg-[#F7F1E8] px-4 py-3 text-sm font-medium text-[#1B4332] outline-none transition focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/20"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#1B4332]/60">
                  Max budget
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="$500,000"
                  value={state.budgetMax}
                  onChange={(e) =>
                    setState((prev) => ({ ...prev, budgetMax: e.target.value }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-[#1B4332]/15 bg-[#F7F1E8] px-4 py-3 text-sm font-medium text-[#1B4332] outline-none transition focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/20"
                />
              </label>
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-[#1B4332]/60">
              Financing type
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {FINANCING_OPTIONS.map((option) => (
                <OptionButton
                  key={option.value}
                  label={option.label}
                  selected={state.financingType === option.value}
                  onClick={() =>
                    setState((prev) => ({
                      ...prev,
                      financingType: option.value,
                    }))
                  }
                  compact
                />
              ))}
            </div>
            <StepActions
              onContinue={handleStep2Continue}
              onBack={() => setStep(1)}
              disabled={
                !parseBudget(state.budgetMax) || !state.financingType
              }
              saving={saving}
            />
          </StepCard>
        )}

        {step === 3 && (
          <StepCard
            title="Where are you looking?"
            subtitle="Select all DC metro areas that interest you."
          >
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
              {MARKET_OPTIONS.map((market) => {
                const selected = state.targetMarkets.includes(market);
                return (
                  <button
                    key={market}
                    type="button"
                    onClick={() => toggleMarket(market)}
                    className={`rounded-xl border px-3 py-3 text-left text-xs font-semibold transition sm:text-sm ${
                      selected
                        ? "border-[#1B4332] bg-[#1B4332] text-[#E8D5B7]"
                        : "border-[#1B4332]/15 bg-[#F7F1E8] text-[#1B4332] hover:border-[#1B4332]/40 hover:bg-[#E8D5B7]/30"
                    }`}
                  >
                    {market}
                  </button>
                );
              })}
            </div>
            <StepActions
              onContinue={handleStep3Continue}
              onBack={() => setStep(2)}
              disabled={state.targetMarkets.length === 0}
              saving={saving}
            />
          </StepCard>
        )}

        {step === 4 && (
          <StepCard
            title="What matters most?"
            subtitle="Tell us your primary goal and timeline."
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-[#1B4332]/60">
              Primary goal
            </p>
            <div className="mt-3 grid gap-3">
              {GOAL_OPTIONS.map((option) => (
                <OptionButton
                  key={option.value}
                  label={option.label}
                  selected={state.goal === option.value}
                  onClick={() =>
                    setState((prev) => ({ ...prev, goal: option.value }))
                  }
                />
              ))}
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-[#1B4332]/60">
              Timeline
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {TIMELINE_OPTIONS.map((option) => (
                <OptionButton
                  key={option.value}
                  label={option.label}
                  selected={state.timeline === option.value}
                  onClick={() =>
                    setState((prev) => ({ ...prev, timeline: option.value }))
                  }
                  compact
                />
              ))}
            </div>
            <StepActions
              onContinue={handleStep4Continue}
              onBack={() => setStep(3)}
              disabled={!state.goal || !state.timeline}
              saving={saving}
            />
          </StepCard>
        )}

        {step === 5 && (
          <div className="space-y-5">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#1B4332]/60">
                All set
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#1B4332] sm:text-3xl">
                Your Venura profile is set
              </h2>
            </div>

            <div className="rounded-2xl border border-[#1B4332]/10 bg-[#1B4332] px-5 py-6 text-white sm:px-8 sm:py-8">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#E8D5B7]/80">
                Your profile
              </p>

              <div className="mt-5 space-y-4">
                <SummaryRow
                  label="Buyer type"
                  value={labelFor(BUYER_OPTIONS, state.buyerType)}
                />
                <SummaryRow
                  label="Budget"
                  value={
                    parseBudget(state.budgetMax)
                      ? state.budgetMin
                        ? `${formatCurrency(parseBudget(state.budgetMin)!)} – ${formatCurrency(parseBudget(state.budgetMax)!)}`
                        : `Up to ${formatCurrency(parseBudget(state.budgetMax)!)}`
                      : null
                  }
                />
                <SummaryRow
                  label="Financing"
                  value={labelFor(FINANCING_OPTIONS, state.financingType)}
                />
                <SummaryRow
                  label="Markets"
                  value={
                    state.targetMarkets.length > 0
                      ? state.targetMarkets.join(", ")
                      : null
                  }
                />
                <SummaryRow
                  label="Goal"
                  value={labelFor(GOAL_OPTIONS, state.goal)}
                />
                <SummaryRow
                  label="Timeline"
                  value={labelFor(TIMELINE_OPTIONS, state.timeline)}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="w-full rounded-xl bg-[#E8D5B7] px-6 py-4 text-base font-bold text-[#1B4332] transition hover:bg-[#F0E4CE] sm:text-lg"
            >
              Take me to my dashboard →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function StepCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#1B4332]/10 bg-white p-5 shadow-sm sm:p-8">
      <h2 className="text-xl font-semibold text-[#1B4332] sm:text-2xl">{title}</h2>
      <p className="mt-2 text-sm text-[#1B4332]/70">{subtitle}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function OptionButton({
  label,
  selected,
  onClick,
  compact = false,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl border text-left font-semibold transition ${
        compact ? "px-3 py-3 text-xs sm:text-sm" : "px-4 py-4 text-sm sm:text-base"
      } ${
        selected
          ? "border-[#1B4332] bg-[#1B4332] text-[#E8D5B7]"
          : "border-[#1B4332]/15 bg-[#F7F1E8] text-[#1B4332] hover:border-[#1B4332]/40 hover:bg-[#E8D5B7]/30"
      }`}
    >
      {label}
    </button>
  );
}

function StepActions({
  onContinue,
  onBack,
  disabled,
  saving,
}: {
  onContinue: () => void;
  onBack?: () => void;
  disabled?: boolean;
  saving?: boolean;
}) {
  return (
    <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          disabled={saving}
          className="text-sm font-medium text-[#1B4332]/70 transition hover:text-[#1B4332] disabled:opacity-50"
        >
          ← Back
        </button>
      ) : (
        <span />
      )}
      <button
        type="button"
        onClick={onContinue}
        disabled={disabled || saving}
        className="rounded-xl bg-[#E8D5B7] px-6 py-3 text-sm font-bold text-[#1B4332] transition hover:bg-[#F0E4CE] disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-[140px]"
      >
        {saving ? "Saving…" : "Continue"}
      </button>
    </div>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  if (!value) return null;
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#E8D5B7]/60">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-medium text-white/90">{value}</p>
    </div>
  );
}
