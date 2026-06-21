"use client";

import Link from "next/link";
import { useSubscription } from "@/components/subscription/subscription-provider";
import { getPlanName } from "@/lib/subscription";

export function SidebarPlan() {
  const { tier, loading } = useSubscription();

  if (loading) return null;

  const planName = getPlanName(tier);

  return (
    <div className="mb-4 rounded-xl border border-[#E8D5B7]/20 bg-white/5 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-xs text-white/60">Current plan</span>
        <span className="rounded-full border border-[#E8D5B7]/40 bg-[#E8D5B7]/10 px-2.5 py-0.5 text-xs font-semibold text-[#E8D5B7]">
          {planName}
        </span>
      </div>
      <Link
        href="/settings"
        className="block text-xs font-medium text-[#E8D5B7] transition hover:text-[#F0E4CE]"
      >
        Manage plan →
      </Link>
    </div>
  );
}
