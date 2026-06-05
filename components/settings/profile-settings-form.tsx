"use client";

import { useEffect, useState } from "react";
import { fetchUserProfile, patchProfileFields } from "@/lib/profile-client";
import {
  BUYER_TYPE_OPTIONS,
  FINANCING_TYPE_OPTIONS,
  MANAGEMENT_STYLE_OPTIONS,
  PROFILE_GOAL_OPTIONS,
  PROFILE_TIMELINE_OPTIONS,
  TARGET_MARKET_OPTIONS,
} from "@/lib/profile-options";
import type {
  BuyerType,
  FinancingType,
  ManagementStyle,
  ProfileGoal,
  ProfileTimeline,
  UserProfileRow,
} from "@/lib/user-profile";

type SettingsState = {
  buyerType: BuyerType | null;
  budgetMin: string;
  budgetMax: string;
  financingType: FinancingType | null;
  targetMarkets: string[];
  goal: ProfileGoal | null;
  timeline: ProfileTimeline | null;
  managementStyle: ManagementStyle | null;
};

function profileToState(profile: UserProfileRow): SettingsState {
  return {
    buyerType: profile.buyer_type,
    budgetMin: profile.budget_min != null ? String(profile.budget_min) : "",
    budgetMax: profile.budget_max != null ? String(profile.budget_max) : "",
    financingType: profile.financing_type,
    targetMarkets: profile.target_markets ?? [],
    goal: profile.goal,
    timeline: profile.timeline,
    managementStyle: profile.management_style,
  };
}

function parseBudget(value: string): number | null {
  const cleaned = value.replace(/[^0-9]/g, "");
  if (!cleaned) return null;
  const num = Number(cleaned);
  return Number.isFinite(num) && num > 0 ? num : null;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/60">
      {children}
    </span>
  );
}

const selectClassName =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#E8D5B7] focus:ring-2 focus:ring-[#E8D5B7]/30";

const inputClassName =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#E8D5B7] focus:ring-2 focus:ring-[#E8D5B7]/30";

export function ProfileSettingsForm() {
  const [state, setState] = useState<SettingsState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    fetchUserProfile()
      .then((profile) => {
        if (profile) setState(profileToState(profile));
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      })
      .finally(() => setLoading(false));
  }, []);

  function toggleMarket(market: string) {
    setState((prev) => {
      if (!prev) return prev;
      const selected = prev.targetMarkets.includes(market);
      return {
        ...prev,
        targetMarkets: selected
          ? prev.targetMarkets.filter((m) => m !== market)
          : [...prev.targetMarkets, market],
      };
    });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!state) return;

    setSaving(true);
    setError(null);

    try {
      await patchProfileFields({
        buyer_type: state.buyerType,
        budget_min: parseBudget(state.budgetMin),
        budget_max: parseBudget(state.budgetMax),
        financing_type: state.financingType,
        target_markets: state.targetMarkets,
        goal: state.goal,
        timeline: state.timeline,
        management_style: state.managementStyle,
      });
      setToast(true);
      setTimeout(() => setToast(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#1B4332] p-8 text-center text-sm text-white/60">
        Loading profile…
      </div>
    );
  }

  if (!state) {
    return (
      <div className="rounded-2xl border border-red-400/40 bg-red-500/10 p-8 text-center text-sm text-red-300">
        {error ?? "Could not load your profile."}
      </div>
    );
  }

  return (
    <>
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl border border-[#E8D5B7]/40 bg-[#1B4332] px-5 py-3 text-sm font-medium text-[#E8D5B7] shadow-xl">
          Profile updated
        </div>
      )}

      <form
        onSubmit={(e) => void handleSave(e)}
        className="space-y-8 rounded-2xl border border-white/10 bg-[#1B4332] p-6 shadow-xl sm:p-8"
      >
        {error && (
          <div className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <FieldLabel>Buyer type</FieldLabel>
            <select
              value={state.buyerType ?? ""}
              onChange={(e) =>
                setState((prev) =>
                  prev
                    ? {
                        ...prev,
                        buyerType: (e.target.value || null) as BuyerType | null,
                      }
                    : prev,
                )
              }
              className={selectClassName}
            >
              <option value="" className="bg-[#1B4332]">
                Select buyer type
              </option>
              {BUYER_TYPE_OPTIONS.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="bg-[#1B4332]"
                >
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <FieldLabel>Budget min</FieldLabel>
            <input
              type="text"
              inputMode="numeric"
              value={state.budgetMin}
              onChange={(e) =>
                setState((prev) =>
                  prev ? { ...prev, budgetMin: e.target.value } : prev,
                )
              }
              placeholder="200000"
              className={inputClassName}
            />
          </label>

          <label className="block">
            <FieldLabel>Budget max</FieldLabel>
            <input
              type="text"
              inputMode="numeric"
              value={state.budgetMax}
              onChange={(e) =>
                setState((prev) =>
                  prev ? { ...prev, budgetMax: e.target.value } : prev,
                )
              }
              placeholder="350000"
              className={inputClassName}
            />
          </label>

          <label className="block sm:col-span-2">
            <FieldLabel>Financing type</FieldLabel>
            <select
              value={state.financingType ?? ""}
              onChange={(e) =>
                setState((prev) =>
                  prev
                    ? {
                        ...prev,
                        financingType: (e.target.value ||
                          null) as FinancingType | null,
                      }
                    : prev,
                )
              }
              className={selectClassName}
            >
              <option value="" className="bg-[#1B4332]">
                Select financing
              </option>
              {FINANCING_TYPE_OPTIONS.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="bg-[#1B4332]"
                >
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block sm:col-span-2">
            <FieldLabel>Management style</FieldLabel>
            <select
              value={state.managementStyle ?? ""}
              onChange={(e) =>
                setState((prev) =>
                  prev
                    ? {
                        ...prev,
                        managementStyle: (e.target.value ||
                          null) as ManagementStyle | null,
                      }
                    : prev,
                )
              }
              className={selectClassName}
            >
              <option value="" className="bg-[#1B4332]">
                Select management style
              </option>
              {MANAGEMENT_STYLE_OPTIONS.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="bg-[#1B4332]"
                >
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <FieldLabel>Primary goal</FieldLabel>
            <select
              value={state.goal ?? ""}
              onChange={(e) =>
                setState((prev) =>
                  prev
                    ? {
                        ...prev,
                        goal: (e.target.value || null) as ProfileGoal | null,
                      }
                    : prev,
                )
              }
              className={selectClassName}
            >
              <option value="" className="bg-[#1B4332]">
                Select goal
              </option>
              {PROFILE_GOAL_OPTIONS.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="bg-[#1B4332]"
                >
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <FieldLabel>Timeline</FieldLabel>
            <select
              value={state.timeline ?? ""}
              onChange={(e) =>
                setState((prev) =>
                  prev
                    ? {
                        ...prev,
                        timeline: (e.target.value ||
                          null) as ProfileTimeline | null,
                      }
                    : prev,
                )
              }
              className={selectClassName}
            >
              <option value="" className="bg-[#1B4332]">
                Select timeline
              </option>
              {PROFILE_TIMELINE_OPTIONS.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="bg-[#1B4332]"
                >
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div>
          <FieldLabel>Target markets</FieldLabel>
          <p className="mb-3 text-xs text-white/50">
            DC metro zip codes and all Venura market cities
          </p>
          <div className="grid max-h-64 grid-cols-2 gap-2 overflow-y-auto rounded-xl border border-white/10 bg-white/5 p-3 sm:grid-cols-3">
            {TARGET_MARKET_OPTIONS.map((market) => {
              const selected = state.targetMarkets.includes(market);
              return (
                <label
                  key={market}
                  className={`flex cursor-pointer items-start gap-2 rounded-lg border px-2.5 py-2 text-xs transition ${
                    selected
                      ? "border-[#E8D5B7]/50 bg-[#E8D5B7]/15 text-[#E8D5B7]"
                      : "border-transparent text-white/70 hover:bg-white/5"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => toggleMarket(market)}
                    className="mt-0.5 accent-[#E8D5B7]"
                  />
                  <span>{market}</span>
                </label>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-[#E8D5B7] py-3 text-sm font-semibold text-[#1B4332] transition hover:bg-[#F0E4CE] disabled:opacity-60 sm:w-auto sm:px-8"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </>
  );
}
