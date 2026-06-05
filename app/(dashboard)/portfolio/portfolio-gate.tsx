"use client";

import { useEffect } from "react";
import { useSubscription } from "@/components/subscription/subscription-provider";
import { canAccessPortfolio } from "@/lib/subscription";

export function PortfolioGate({ children }: { children: React.ReactNode }) {
  const { tier, showUpgrade } = useSubscription();

  useEffect(() => {
    if (!canAccessPortfolio(tier)) {
      showUpgrade("portfolio");
    }
  }, [tier, showUpgrade]);

  if (!canAccessPortfolio(tier)) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-[#1B4332]/50 p-8 text-center">
        <p className="max-w-md text-base text-white/70">
          Portfolio tracker is available on the Pro plan. Upgrade to track owned
          properties, equity positions, and passive income.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
