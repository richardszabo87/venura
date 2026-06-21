import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ProfileSync } from "@/components/profile/profile-sync";
import { SubscriptionProvider } from "@/components/subscription/subscription-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SubscriptionProvider>
      <ProfileSync />
      <DashboardShell>{children}</DashboardShell>
    </SubscriptionProvider>
  );
}
