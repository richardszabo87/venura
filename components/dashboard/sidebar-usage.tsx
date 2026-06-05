"use client";

import Link from "next/link";
import { useSubscription } from "@/components/subscription/subscription-provider";
import { formatUsageLabel, usagePercent } from "@/lib/subscription";

function UsageBar({
  label,
  used,
  limit,
}: {
  label: string;
  used: number;
  limit: number;
}) {
  const percent = usagePercent(used, limit);

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-white/70">
        <span>{formatUsageLabel(used, limit, label)}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-[#E8D5B7] transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export function SidebarUsage() {
  const { tier, usage, loading } = useSubscription();

  if (loading || tier !== "free" || !usage) return null;

  return (
    <div className="mb-4 space-y-3 rounded-xl border border-[#E8D5B7]/20 bg-white/5 p-3">
      <UsageBar
        label="Analyses"
        used={usage.analyses.used}
        limit={usage.analyses.limit}
      />
      <UsageBar
        label="VenuraAI"
        used={usage.aiMessages.used}
        limit={usage.aiMessages.limit}
      />
      <Link
        href="/pricing"
        className="block text-xs font-medium text-[#E8D5B7] transition hover:text-[#F0E4CE]"
      >
        Upgrade for unlimited →
      </Link>
    </div>
  );
}
