"use client";

import { useEffect, useState } from "react";
import {
  INVESTOR_FEATURES,
  UPGRADE_MESSAGES,
  type UpgradeReason,
} from "@/lib/subscription";
import { isStripeConfigured } from "@/lib/stripe-config";

const PRO_FEATURES = [
  "Everything in Investor",
  "Unlimited saved deals & deal alerts",
  "City Intelligence full access",
  "VenuraAI priority responses",
  "Portfolio tracker",
  "API access",
  "White label reports",
] as const;

const PRO_REASONS: UpgradeReason[] = [
  "portfolio",
  "city_intelligence",
  "api_access",
];

type UpgradeModalProps = {
  open: boolean;
  reason: UpgradeReason;
  onClose: () => void;
};

export function UpgradeModal({ open, reason, onClose }: UpgradeModalProps) {
  const isPro = PRO_REASONS.includes(reason);
  const plan = isPro ? "pro" : "investor";
  const price = isPro ? 29 : 19;
  const features = isPro ? PRO_FEATURES : INVESTOR_FEATURES;
  const planLabel = isPro ? "Pro" : "Investor";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  async function startCheckout() {
    setLoading(true);
    setError(null);

    if (!isStripeConfigured()) {
      setError("Stripe is not configured. Contact support to upgrade.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Could not start checkout");
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error("No checkout URL returned");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close upgrade modal"
        className="absolute inset-0 bg-[#0d2818]/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="upgrade-modal-title"
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[#E8D5B7]/30 bg-[#1B4332] shadow-2xl"
      >
        <div className="border-b border-[#E8D5B7]/20 bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] px-8 py-7">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#E8D5B7]/80">
            Upgrade to {planLabel}
          </p>
          <h2
            id="upgrade-modal-title"
            className="mt-2 text-2xl font-bold text-white"
          >
            {UPGRADE_MESSAGES[reason]}
          </h2>
          <p className="mt-2 text-sm text-white/70">
            Unlock the full Venura toolkit and analyze deals without limits.
          </p>
        </div>

        <div className="px-8 py-6">
          <p className="mb-4 text-sm font-medium text-[#E8D5B7]">
            {planLabel} plan includes:
          </p>
          <ul className="mb-6 space-y-2.5">
            {features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2.5 text-sm text-white/85"
              >
                <svg
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#E8D5B7]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {feature}
              </li>
            ))}
          </ul>

          <div className="mb-6 flex items-baseline gap-2">
            <span className="text-4xl font-black text-white">${price}</span>
            <span className="text-sm text-white/60">/month</span>
          </div>

          {error && (
            <p className="mb-4 rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={() => void startCheckout()}
            disabled={loading}
            className="w-full rounded-xl bg-[#E8D5B7] py-3.5 text-sm font-semibold text-[#1B4332] transition hover:bg-[#F0E4CE] disabled:opacity-60"
          >
            {loading
              ? "Redirecting to checkout…"
              : isPro
                ? "Upgrade to Pro — $29/month"
                : "Upgrade to Investor — $19/month"}
          </button>

          <p className="mt-3 text-center text-xs text-white/50">
            Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}
