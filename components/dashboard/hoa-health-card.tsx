"use client";

import { useSubscription } from "@/components/subscription/subscription-provider";
import { canViewHoaHealth } from "@/lib/subscription";

export function HoaHealthCard() {
  const { tier, showUpgrade } = useSubscription();

  if (!canViewHoaHealth(tier)) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#1B4332]/60 p-5 shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
          HOA Health Report
        </p>
        <p className="mt-3 text-sm text-white/70">
          Deep HOA risk analysis for your target markets — reserve funding,
          litigation flags, and fee trends.
        </p>
        <button
          type="button"
          onClick={() => showUpgrade("hoa_health")}
          className="mt-4 rounded-xl border border-[#E8D5B7]/40 bg-[#E8D5B7]/10 px-4 py-2 text-sm font-semibold text-[#E8D5B7] transition hover:bg-[#E8D5B7]/20"
        >
          Unlock HOA Health Report
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#E8D5B7]/30 bg-[#1B4332]/60 p-5 shadow-xl">
      <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
        HOA Health Report
      </p>
      <div className="mt-3 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E8D5B7]/20">
          <span className="text-xl font-bold text-[#E8D5B7]">B+</span>
        </div>
        <div>
          <p className="text-sm font-medium text-white">
            Target markets: healthy HOA outlook
          </p>
          <p className="mt-1 text-xs text-white/60">
            Reserve funding adequate · No major litigation flags · Fee growth
            within norms
          </p>
        </div>
      </div>
    </div>
  );
}
