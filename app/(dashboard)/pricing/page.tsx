import { auth } from "@clerk/nextjs/server";
import { PageHeader } from "@/components/dashboard/page-header";
import { PricingPlans } from "@/components/pricing/pricing-plans";
import { getSubscriptionTier } from "@/lib/subscription";
import { fetchProfileByClerkId } from "@/lib/user-profile-server";

type PricingPageProps = {
  searchParams: Promise<{ canceled?: string }>;
};

export default async function PricingPage({ searchParams }: PricingPageProps) {
  const params = await searchParams;
  const canceled = params.canceled === "true";

  const { userId } = await auth();
  const profile = userId
    ? await fetchProfileByClerkId(userId).catch(() => null)
    : null;
  const currentTier = getSubscriptionTier(profile);

  return (
    <>
      <PageHeader
        eyebrow="Plans"
        title="Pricing"
        description="Choose the plan that fits your investment workflow."
      />

      {canceled && (
        <div className="mb-6 rounded-xl border border-amber-400/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Checkout was canceled. You can try again when you&apos;re ready.
        </div>
      )}

      <PricingPlans currentTier={currentTier} />
    </>
  );
}
