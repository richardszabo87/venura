import Link from "next/link";
import { PageHeader } from "@/components/dashboard/page-header";

type DashboardPageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const checkoutSuccess = Boolean(params.session_id);

  return (
    <>
      <PageHeader
        eyebrow="Welcome"
        title="Dashboard"
        description={
          checkoutSuccess
            ? "Your subscription is active. You now have full access to Venura."
            : "Your investment command center."
        }
      />

      {checkoutSuccess && (
        <div className="mb-8 rounded-2xl border border-[#74C69D]/40 bg-[#74C69D]/10 px-6 py-5">
          <p className="font-semibold text-[#74C69D]">Payment successful</p>
          <p className="mt-1 text-sm text-white/80">
            Thank you for subscribing. Explore your upgraded tools below.
          </p>
        </div>
      )}

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
      className="rounded-2xl border border-white/10 bg-[#1B4332] p-5 shadow-xl transition hover:border-[#74C69D]/30"
    >
      <h2 className="font-semibold text-white">{title}</h2>
      <p className="mt-1 text-sm text-white/60">{description}</p>
    </Link>
  );
}
