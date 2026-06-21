"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { SubscriptionTier } from "@/lib/subscription";

type SubscriptionInfo = {
  tier: SubscriptionTier;
  planName: string;
  pricePerMonth: number;
  nextBillingDate: string | null;
  hasStripeCustomer: boolean;
};

function formatBillingDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatPrice(price: number): string {
  if (price === 0) return "$0";
  return `$${price}`;
}

export function SubscriptionSettings() {
  const [info, setInfo] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/subscription")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error ?? "Failed to load subscription");
        }
        setInfo(data as SubscriptionInfo);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load subscription");
      })
      .finally(() => setLoading(false));
  }, []);

  async function openCustomerPortal() {
    setPortalLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/customer-portal", { method: "POST" });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Could not open billing portal");
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error("No portal URL returned");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not open billing portal");
      setPortalLoading(false);
    }
  }

  if (loading) {
    return (
      <section className="mb-8 rounded-2xl border border-white/10 bg-[#1B4332] p-6 shadow-xl sm:p-8">
        <h2 className="text-lg font-semibold text-[#E8D5B7]">Subscription</h2>
        <p className="mt-4 text-sm text-white/60">Loading subscription…</p>
      </section>
    );
  }

  if (!info) {
    return (
      <section className="mb-8 rounded-2xl border border-red-400/40 bg-red-500/10 p-6 shadow-xl sm:p-8">
        <h2 className="text-lg font-semibold text-[#E8D5B7]">Subscription</h2>
        <p className="mt-4 text-sm text-red-300">
          {error ?? "Could not load subscription details."}
        </p>
      </section>
    );
  }

  const isPaid = info.tier !== "free";

  return (
    <section className="mb-8 rounded-2xl border border-white/10 bg-[#1B4332] p-6 shadow-xl sm:p-8">
      <h2 className="text-lg font-semibold text-[#E8D5B7]">Subscription</h2>
      <p className="mt-1 text-sm text-white/60">
        Manage your plan, billing, and payment method.
      </p>

      {error && (
        <div className="mt-4 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-white/50">
            Current plan
          </p>
          <p className="mt-1 text-xl font-bold text-white">{info.planName}</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-white/50">
            Price
          </p>
          <p className="mt-1 text-xl font-bold text-white">
            {formatPrice(info.pricePerMonth)}
            <span className="text-sm font-normal text-white/50">/month</span>
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-white/50">
            Next billing date
          </p>
          <p className="mt-1 text-xl font-bold text-white">
            {info.nextBillingDate
              ? formatBillingDate(info.nextBillingDate)
              : isPaid
                ? "—"
                : "N/A"}
          </p>
        </div>
      </div>

      <div className="mt-6">
        {info.hasStripeCustomer ? (
          <button
            type="button"
            disabled={portalLoading}
            onClick={() => void openCustomerPortal()}
            className="rounded-xl bg-[#E8D5B7] px-6 py-3 text-sm font-semibold text-[#1B4332] transition hover:bg-[#F0E4CE] disabled:opacity-60"
          >
            {portalLoading ? "Opening portal…" : "Manage subscription"}
          </button>
        ) : (
          <Link
            href="/pricing"
            className="inline-block rounded-xl bg-[#E8D5B7] px-6 py-3 text-sm font-semibold text-[#1B4332] transition hover:bg-[#F0E4CE]"
          >
            Upgrade plan
          </Link>
        )}
        {info.hasStripeCustomer && (
          <p className="mt-2 text-xs text-white/50">
            Cancel, upgrade, downgrade, or update your payment method in the
            Stripe billing portal.
          </p>
        )}
      </div>
    </section>
  );
}
