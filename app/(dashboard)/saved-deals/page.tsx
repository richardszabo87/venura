import { PageHeader } from "@/components/dashboard/page-header";
import { SavedDealsList } from "@/components/saved-deals/saved-deals-list";

export default function SavedDealsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Deal Library"
        title="Saved Deals"
        description="Your saved property analyses with cash flow indicators at a glance."
      />
      <SavedDealsList />
    </>
  );
}
