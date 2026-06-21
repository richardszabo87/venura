import { PageHeader } from "@/components/dashboard/page-header";
import { ProfileSettingsForm } from "@/components/settings/profile-settings-form";
import { SubscriptionSettings } from "@/components/settings/subscription-settings";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Settings"
        description="Manage your subscription, investor profile, target markets, and preferences."
      />
      <SubscriptionSettings />
      <ProfileSettingsForm />
    </>
  );
}
