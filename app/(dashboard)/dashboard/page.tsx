import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import { JourneyStageTracker } from "@/components/dashboard/journey-stage-tracker";
import { formatGreeting } from "@/lib/dashboard-greeting";
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
  const profile =
    userId != null
      ? await fetchProfileByClerkId(userId).catch(() => null)
      : null;

  const greeting = formatGreeting(user?.firstName);
  const journeyStage: JourneyStage = profile?.journey_stage ?? "exploring";

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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <QuickLink
          href="/analyzer"
          title="Analyzer"
          description="Run property underwriting"
        />
        <QuickLink
          href="/saved-deals"
          title="Saved Deals"
          description="Review your deal library"
        />
        <QuickLink
          href="/portfolio"
          title="Portfolio"
          description="Track equity and cash flow"
        />
        <QuickLink
          href="/venura-ai"
          title="VenuraAI"
          description="Ask investment questions"
        />
        <QuickLink
          href="/projections"
          title="Projections"
          description="10-year outlook charts"
        />
        <QuickLink
          href="/pricing"
          title="Pricing"
          description="Manage your plan"
        />
      </div>
    </>
  );
}

function QuickLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-white/10 bg-[#1B4332] p-5 shadow-xl transition hover:border-[#E8D5B7]/30"
    >
      <h2 className="font-semibold text-white">{title}</h2>
      <p className="mt-1 text-sm text-white/60">{description}</p>
    </Link>
  );
}
