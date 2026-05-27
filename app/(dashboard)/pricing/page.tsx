import { PageHeader } from "@/components/dashboard/page-header";
import { PricingPlans } from "@/components/pricing/pricing-plans";

type PricingPageProps = {
  searchParams: Promise<{ canceled?: string }>;
};

export default async function PricingPage({ searchParams }: PricingPageProps) {
  const params = await searchParams;
  const canceled = params.canceled === "true";

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

      <PricingPlans />
    </>
  );
}
