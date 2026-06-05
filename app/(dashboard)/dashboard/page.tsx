import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { JourneyStageTracker } from "@/components/dashboard/journey-stage-tracker";
import { getQuickActions } from "@/lib/dashboard-quick-actions";
import { formatGreeting } from "@/lib/dashboard-greeting";
import {
  daysOnVenura,
  extractMarketChips,
  formatBudgetRange,
  GOAL_LABELS,
  GoalIcon,
} from "@/lib/profile-display";
import { setSessionCookie } from "@/lib/auth/session";
import { fetchProfileByClerkId } from "@/lib/user-profile-server";
import type { JourneyStage } from "@/lib/user-profile";

type DashboardPageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const checkoutSuccess = Boolean(params.session_id);

  if (params.session_id) {
    await setSessionCookie(params.session_id);
  }

  const [{ userId }, user] = await Promise.all([auth(), currentUser()]);

  if (!userId) {
    redirect("/sign-in");
  }

  const profile = await fetchProfileByClerkId(userId).catch(() => null);

  if (!profile) {
    redirect("/onboarding");
  }

  const greeting = formatGreeting(user?.firstName);
  const journeyStage: JourneyStage = profile.journey_stage ?? "exploring";
  const marketChips = extractMarketChips(profile.target_markets ?? []);
  const quickActions = getQuickActions(profile.buyer_type);
  const daysActive = daysOnVenura(profile.created_at);

  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {greeting}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-white/60">
          {checkoutSuccess
            ? "Your subscription is active. Here's your Venura snapshot."
            : "Here's your Venura snapshot."}
        </p>
      </header>

      {checkoutSuccess && (
        <div className="mb-8 rounded-2xl border border-[#E8D5B7]/40 bg-[#E8D5B7]/10 px-6 py-5">
          <p className="font-semibold text-[#E8D5B7]">Payment successful</p>
          <p className="mt-1 text-sm text-white/80">
            Thank you for subscribing. Explore your upgraded tools below.
          </p>
        </div>
      )}

      <JourneyStageTracker stage={journeyStage} />

      <section className="mb-8">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#E8D5B7]">
          Profile snapshot
        </h2>
        <div className="grid gap-4 lg:grid-cols-3">
          <SnapshotCard title="Target markets">
            {marketChips.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {marketChips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full bg-[#1B4332] px-3 py-1 text-xs font-medium text-[#E8D5B7]"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white/50">No markets selected yet</p>
            )}
          </SnapshotCard>

          <SnapshotCard title="Budget">
            <p className="text-lg font-semibold text-white">
              {formatBudgetRange(profile.budget_min, profile.budget_max)}
            </p>
          </SnapshotCard>

          <SnapshotCard title="Goal">
            {profile.goal ? (
              <div className="flex items-center gap-3">
                <GoalIcon goal={profile.goal} />
                <p className="text-sm font-medium text-white">
                  {GOAL_LABELS[profile.goal]}
                </p>
              </div>
            ) : (
              <p className="text-sm text-white/50">Not set</p>
            )}
          </SnapshotCard>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#E8D5B7]">
          Quick stats
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Properties analyzed"
            value={profile.properties_analyzed}
          />
          <StatCard label="Deals saved" value={profile.properties_saved} />
          <StatCard label="Active alerts" value={0} />
          <StatCard label="Days on Venura" value={daysActive} />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#E8D5B7]">
          Quick actions
        </h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action) => (
            <Link
              key={`${action.href}-${action.label}`}
              href={action.href}
              className="rounded-xl border border-[#E8D5B7]/30 bg-[#1B4332] px-4 py-2.5 text-sm font-semibold text-[#E8D5B7] transition hover:border-[#E8D5B7]/60 hover:bg-[#1B4332]/80"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

function SnapshotCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#1B4332]/60 p-5 shadow-xl">
      <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
        {title}
      </p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#1B4332] p-5 shadow-xl">
      <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
        {label}
      </p>
      <p className="mt-2 text-3xl font-bold text-[#E8D5B7]">{value}</p>
    </div>
  );
}
