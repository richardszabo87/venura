import { PageHeader } from "@/components/dashboard/page-header";
import { ProfileSettingsForm } from "@/components/settings/profile-settings-form";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Settings"
        description="Update your investor profile, target markets, and preferences."
      />
      <ProfileSettingsForm />
    </>
  );
}
